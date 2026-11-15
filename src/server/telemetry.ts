import { trace, SpanStatusCode } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchSpanProcessor, NodeTracerProvider } from '@opentelemetry/sdk-trace-node';

const globalKey = Symbol.for('adaptive-conference.telemetry');
type TelemetryGlobal = typeof globalThis & { [globalKey]?: NodeTracerProvider };
let provider = (globalThis as TelemetryGlobal)[globalKey];
if (!provider) {
  const endpoint = process.env.DASH0_OTLP_HTTP_ENDPOINT, token = process.env.DASH0_INGESTION_TOKEN;
  if (endpoint && token) {
    provider = new NodeTracerProvider({ resource: resourceFromAttributes({ 'service.name': 'adaptive-conference', 'service.version': process.env.SERVICE_VERSION ?? 'dev' }),
      spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter({ url: `${endpoint.replace(/\/$/, '')}/v1/traces`, headers: {
        Authorization: `Bearer ${token}`, ...(process.env.DASH0_DATASET ? { 'Dash0-Dataset': process.env.DASH0_DATASET } : {}),
      } }))] });
    provider.register(); (globalThis as TelemetryGlobal)[globalKey] = provider;
  }
}
export async function observed<T>(name: string, fn: () => Promise<T>) {
  const tracer = trace.getTracer('adaptive-conference');
  return tracer.startActiveSpan(name, async span => {
    try { return await fn(); } catch (error) { span.recordException(error as Error); span.setStatus({ code: SpanStatusCode.ERROR }); throw error; }
    finally { span.end(); }
  });
}
export async function flushTelemetry() {
  if(!provider)return;
  let timer:NodeJS.Timeout|undefined;
  try{await Promise.race([provider.forceFlush(),new Promise<void>(resolve=>{timer=setTimeout(resolve,3000);})]);}
  catch{/* Observability must never hold up a container shutdown. */}
  finally{if(timer)clearTimeout(timer);}
}
