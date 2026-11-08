# Integration setup and verification

Checked November 7, 2026. This records actual preparation separately from future application/track evidence. See [track rationale](./TRACK_INTEGRATION_ANALYSIS.md) and [conference operations](./CONFERENCE_OPERATIONS_PLAN.md).

The owner requested preparation of both Radar and Dash0. The earlier recommendation to defer Dash0 was a solo-capacity recommendation; it does not override this setup request. Final track submissions still depend on useful implementation and evidence.

Implementation follow-through: see the [handoff](./IMPLEMENTATION_HANDOFF.md) for runtime, storage, media delivery, and bounded client-evidence contracts. Its first-release path uses operator publishing; a public organizer API and a browser monitoring SDK are not prerequisites. Node 24 LTS is the handoff runtime baseline; previously verified Node 25 availability does not establish dependency support.

## Current readiness

| Integration | Verified now | Still needed |
| --- | --- | --- |
| GitHub | Owner confirms repository/PR connection; local origin is `git@github.com:gen-y-labs/adaptive-conference.git` | Application build/check workflow and image publishing have not been exercised. |
| Gitar | Gen Y Labs installation is healthy; `gen-y-labs/adaptive-conference` is enabled and is the one connected repository | Publish prepared review instructions; verify a meaningful PR review and CI diagnosis during implementation. Dashboard currently reports zero reviews. |
| Radar Cloud | Connected Radar cluster `adaptive-conference-cluster` (ID `vXGNNNKY-qg`), backed by local k3d cluster `adaptive-conference-cluster`, Radar 1.20.1; MCP returned its running, ready pod; browser shows Connected | Application deployment, persistence validation, and a product release investigation remain pending. |
| Dash0 | Gen Y Labs browser access, AWS Oregon endpoint; `dash0` configured and OAuth-authenticated; this coding session successfully queried its MCP | Instrument application backend/browser; logs, metrics, and product investigation remain pending. |
| Dash0 ingestion | Synthetic OTLP trace accepted with HTTP 200; UI showed one span; MCP retrieved the exact ID, service, span name, OK status, and `setup.synthetic=true` | Connectivity is verified end to end. Application behavior and performance are not yet instrumented. |
| Local tools | Git, Node, npm, Docker CLI verified earlier; Docker engine now responds with version 28.5.1; Codex CLI 0.162.1, kubectl and Helm are present | Actual app container build/run and dependency compatibility remain untested. |
| Elasticsearch | Intentionally deferred | No setup planned. |

Setup trace: `3a66d1d66f0d4dc2ae8d346591f5a7c7`; service `adaptive-conference-setup`; span `setup.connection-check`; environment `setup`; attribute `setup.synthetic=true`. MCP confirmed start time `2026-11-07T22:17:38.009Z`. [Open the verified trace](https://app.dash0.com/goto/traces/explorer?org=5d4e8bd1-1fe5-45b0-959e-c2ef0bb5e508&dataset=default&from=2026-11-07T22%3A15%3A00.000Z&to=2026-11-07T22%3A20%3A00.000Z&trace_id=3a66d1d66f0d4dc2ae8d346591f5a7c7&span_id=2eb5252e74ae4868). The Dash0 UI reports a trial ending November 21. No paid subscription was selected.

## Connections and ownership

```text
GitHub PR → Gitar review → verified merge
GitHub Actions → container image → Argo CD → Kubernetes app
Coding agent → Radar MCP → inspect deployment, events, health
Application → OpenTelemetry → Dash0
Coding agent → Dash0 MCP → query telemetry and investigate
```

Radar does not instrument the application's update-delivery logic. Dash0 MCP reads telemetry; configuring MCP does not send telemetry. Gitar is a GitHub App connection and does not need a local MCP server for PR review.

## MCP configuration already applied

These public endpoints were saved in the user's global Codex configuration using the installed CLI:

```sh
codex mcp add radar-cloud --url https://api.radarhq.io/mcp
codex mcp add dash0 --url https://api.us-west-2.aws.dash0.com/mcp
```

Both commands completed browser OAuth successfully. Do not repeat them just to verify. Use `codex mcp list`; reauthenticate with `codex mcp login radar-cloud` or `codex mcp login dash0` only if needed. No static tokens were written to repository configuration.

The resumed chat acquired both tool catalogs, and read-only calls to both services succeeded. For another session/client, inspect `/mcp` in the CLI or its MCP settings in the IDE and reload if newly configured servers are absent. A successful CLI login alone does not prove another client's live tool access; the completed queries here establish access for this session.

Repeatable read-only verification prompts (both checks completed in this session):

- Radar: “List the clusters I can access. Identify adaptive-conference-cluster and report its connection status. Do not modify resources.” Once using the hackathon organization, select the assigned team cluster explicitly on every call.
- Dash0: “In the default dataset, find setup trace 3a66d1d66f0d4dc2ae8d346591f5a7c7 around November 7, 2026, 22:17 UTC. Report service, span name, and whether it is marked synthetic.”

Sources: [Codex MCP configuration](https://learn.chatgpt.com/docs/extend/mcp?surface=cli), [Dash0 MCP](https://www.dash0.com/hub/integrations/int_dash0_mcp/overview), [Radar MCP](https://radarhq.io/docs/features/mcp).

## Radar: attach the actual deployment environment

The owner subsequently requested connecting the cluster. A local development environment is now running in Docker and attached to the existing Gen Y Labs Radar entry. The supplied hackathon environment remains a separate build-day option.

### Local cluster connected November 7

- Radar link: [adaptive-conference-cluster](https://app.radarhq.io/c/vXGNNNKY-qg). Radar and the underlying k3d cluster now both use `adaptive-conference-cluster`. On November 7, the original empty development cluster was replaced because k3d does not support renaming. Radar retains its stable cloud cluster ID. Only Kubernetes system components and Radar existed; no application workloads or persistent volumes needed migration.
- k3d 5.8.3; one server, no worker agents; Kubernetes `v1.33.4+k3s1`.
- Kubernetes context: `k3d-adaptive-conference-cluster`; API bound to `127.0.0.1:6551`. This is the selected current context after replacement. Commands below select it explicitly.
- Helm release/namespace: `radar` / `radar`; chart and application version `1.20.1`.
- Replacement connection reported at `2026-11-07T22:30:32Z`; MCP resource search returned the Radar pod as Running, ready `1/1`. Kubernetes reports its deployment available `1/1`, with zero pod restarts at verification.
- Cloud connection token stored only in Kubernetes Secret `radar/radar-cloud-config`; it is not in the committed values or documentation. The old unused onboarding token was replaced during installation.
- Non-secret install configuration: [Radar Helm values](../ops/radar-values.yaml). It follows the cloud setup's operational RBAC options, including Helm, secrets, exec, port-forward, metrics, and self-upgrade access. This is an isolated development cluster.
- Default storage class `local-path` is available. Application PVC provisioning and data survival have not been tested. Stopping the cluster retains its containers/storage; deleting it is not a backup strategy.

Repeatable health checks:

```sh
kubectl --context k3d-adaptive-conference-cluster get nodes
kubectl --context k3d-adaptive-conference-cluster -n radar get deployments,pods
helm status radar --kube-context k3d-adaptive-conference-cluster -n radar
```

Stop/start the development environment when needed (Docker must be running):

```sh
k3d cluster stop adaptive-conference-cluster
k3d cluster start adaptive-conference-cluster
```

Radar Cloud will show disconnected while the local cluster or Docker is stopped. After starting, verify Connected and the ready pod again. This setup does not expose a public application URL or deploy the conference app.

Reapply the pinned Radar release, keeping the existing Secret:

```sh
helm upgrade --install radar skyhook/radar --version 1.20.1 \
  --kube-context k3d-adaptive-conference-cluster --namespace radar \
  --values ops/radar-values.yaml --wait --timeout 180s
```

### Supplied hackathon environment

At kickoff, obtain the join code through the organizers, provision the team's environment, and accept the Radar organization invitation. This is distinct from the current Gen Y Labs organization and its connected local development cluster. Reauthorize/select the hackathon organization as needed. Record the assigned cluster ID, namespace, app URL, storage class, and access expiry. Do not install another Radar agent into the supplied environment unless its instructions require it.

The [event starter](https://github.com/skyhook-io/cnh-starter) documents image publishing and Argo CD deployment. Adapt that path to this existing repository after implementation starts. Verify repository/image readability, Actions permissions, rollout health, and persistent SQLite storage. Use one replica and validate replacement behavior. Keep baseline health, deployed commit/image, one investigation, and pre/post-release data checks as demo evidence. The event environment's access ends November 13.

For another local installation, provision an isolated development cluster first, verify its context, then use that cluster entry's own install instructions. A Radar Cloud entry alone does not create Kubernetes. See [Radar Cloud setup](https://radarhq.io/docs/quickstart-cloud).

## Dash0: ingestion now, app instrumentation during the build

Verified organization settings:

- OTLP HTTP base: `https://ingress.us-west-2.aws.dash0.com`
- MCP: `https://api.us-west-2.aws.dash0.com/mcp`
- Setup dataset: `default`

The [environment template](../.env.example) and [repeatable smoke check](../tools/dash0-smoke.mjs) send one explicitly synthetic span without adding application dependencies. To repeat locally:

1. Copy `.env.example` to `.env.local` and enter an ingestion-scoped token locally. Keep it out of chat, Git, and browser bundles.
2. Run `node --env-file=.env.local tools/dash0-smoke.mjs` from the repository root.
3. Find the printed trace ID under service `adaptive-conference-setup` in Dash0 Tracing. Network acceptance and query visibility are separate checks.

`node tools/dash0-smoke.mjs --dry-run` prints a synthetic payload without requiring a token or contacting Dash0. Syntax validation and the dry run passed. The repository ignores local environment files. The original live check was sent from the authenticated setup page; the reusable script still requires a locally supplied ingestion token for a live run.

During implementation, initialize OpenTelemetry before server request handling and instrument the chosen Next.js runtime through its supported startup path. Use the Dash0 operator if the cluster supports and permits it; otherwise use application SDK instrumentation and direct OTLP export. Avoid installing both paths blindly and producing duplicate spans. [Dash0 Node.js setup](https://www.dash0.com/hub/integrations/int_nodejs/overview).

Start with server operations for publishing an event version and polling/reading updates. For the handoff core, use the allowlisted same-origin client-outcome endpoint described in the handoff, with server-side export. A full browser monitoring SDK is a later enhancement using its appropriate configuration; never reuse server ingestion credentials in frontend code. Request timing alone cannot establish that an attendee saw the update: record and verify the matching version at render time. Restrict telemetry to operational IDs, versions, durations, outcomes, and deployment identity; exclude private roster/preferences and diagnosis data.

Deployment ingestion credentials belong in a Kubernetes Secret, referenced by the app configuration. OAuth for the coding agent and ingestion credentials for the application are different connections. Before declaring the product integrated, verify correlated server/browser evidence, intentional failure/stale states, correction, and measured recovery. The setup trace proves none of those product claims.

## Gitar: prepare the review workflow

The current repository is already enabled in the healthy GitHub installation. [Project review instructions](../.gitar/review/conference.md) are prepared locally using Gitar's [supported review directory](https://docs.gitar.ai/configuration/repository-config). They cover factual consistency, authorization, accessibility, prepared content, privacy, and deployment persistence. They are not published yet.

At the first implementation PR, verify a Gitar review appears and inspect its findings alongside real tests. Retain a useful finding, fix, and passing checks. Existing organization automation settings were not changed. No review or CI success is claimed from account access alone. [Gitar quickstart](https://docs.gitar.ai/quickstart).

## Remaining readiness gates

- Completed: the live coding client invoked both authenticated MCP servers successfully.
- Completed: local development cluster connected; Radar UI, MCP, and Kubernetes readiness checks passed. The event cluster is a separate option at kickoff.
- Publish setup/review configuration when ready; verify Gitar on a meaningful PR.
- Run the app with instrumentation, verify all selected signals, and capture a product-specific investigation.
- Build/publish an image, deploy, and verify durable content after replacement.

Radar infrastructure has been deployed locally. No conference application implementation, public push, or product-specific competition evidence was created during this preparation.
