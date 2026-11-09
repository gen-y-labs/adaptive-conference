// Dependency-free integration check, not application instrumentation.
import { randomBytes } from 'node:crypto';

const dryRun = process.argv.includes('--dry-run');
const endpoint = process.env.DASH0_OTLP_HTTP_ENDPOINT;
const token = process.env.DASH0_INGESTION_TOKEN;
const dataset = process.env.DASH0_DATASET || 'default';
const traceId = randomBytes(16).toString('hex');
const start = BigInt(Date.now()) * 1_000_000n;
const resource = {
  attributes: [
    { key: 'service.name', value: { stringValue: 'adaptive-conference-setup' } },
    { key: 'deployment.environment.name', value: { stringValue: 'setup' } },
  ],
};
const payload = {
  resourceSpans: [{
    resource,
    scopeSpans: [{
      scope: { name: 'integration-readiness' },
      spans: [{
        traceId,
        spanId: randomBytes(8).toString('hex'),
        name: 'setup.connection-check',
        kind: 1,
        startTimeUnixNano: start.toString(),
        endTimeUnixNano: (start + 1_000_000n).toString(),
        attributes: [{ key: 'setup.synthetic', value: { boolValue: true } }],
        status: { code: 1 },
      }],
    }],
  }],
};

if (dryRun) {
  console.log(JSON.stringify(payload, null, 2));
} else {
  try {
    if (!endpoint || !token) throw new Error('Set the endpoint and ingestion token in .env.local.');
    const url = new URL(endpoint);
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.dash0.com') ||
        url.username || url.password || url.search || url.hash || url.pathname !== '/') {
      throw new Error('Use the Dash0 HTTPS OTLP base endpoint, without a signal path or credentials.');
    }
    url.pathname = '/v1/traces';
    const response = await fetch(url, {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(15000),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Dash0-Dataset': dataset,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Dash0 ingestion returned HTTP ${response.status}.`);
    const result = await response.json();
    if (BigInt(result.partialSuccess?.rejectedSpans ?? 0) > 0n || result.partialSuccess?.errorMessage) {
      throw new Error('Dash0 reported partial success; inspect ingestion settings before retrying.');
    }
    console.log(`Accepted setup trace: ${traceId}`);
    console.log('Verify this ID under adaptive-conference-setup in Dash0 Tracing. Acceptance alone does not prove query visibility.');
  } catch (error) {
    // Do not print request objects, response bodies, or credential-bearing errors.
    const safeMessage = error.message.startsWith('Dash0 ') || error.message.startsWith('Set ') || error.message.startsWith('Use ')
      ? error.message : 'Telemetry request failed. Check connectivity and endpoint; credentials were not printed.';
    console.error(safeMessage);
    process.exitCode = 1;
  }
}
