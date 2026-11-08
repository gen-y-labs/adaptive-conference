# Hackathon track integration analysis and decisions

Research checked November 7, 2026; updated with the subsequent track discussions. Baseline: [project pitch](./PITCH_DECK.md). This document distinguishes project direction, recommendations, and planned demo evidence. It is not an eligibility determination or an implemented design.

**Latest setup decision:** The owner subsequently requested preparation of Radar and Dash0 and connection of the Radar cluster. Both MCP connections work in this coding session. Dash0's synthetic setup trace was ingested and retrieved. Radar is connected to a local k3d development cluster, with a ready deployment and successful MCP resource query. Gitar's GitHub installation is healthy with this repository enabled. See the [integration readiness record](./INTEGRATION_SETUP.md) for verified results and outstanding checks. Earlier solo-capacity recommendations below remain tradeoffs, not a reason to omit the requested setup. Infrastructure readiness is not a completed application integration or final track submission.

**Operational exploration:** See [conference operations planning](./CONFERENCE_OPERATIONS_PLAN.md) for the subsequent discussion of preparing content before attendee access, selectable interfaces, registration/preferences, and integration readiness. Multi-conference administration, real attendee sign-in, and pre-generated audio are explored options, not silently added to the committed solo scope. The handoff now excludes app-generated browser synthesis and leaves prepared audio as an enhancement.

**Product clarification:** The owner defined the core as conference information presented according to attendee challenges, communication preferences, and strengths, including picture-led and signed agendas. See the [product vision and seven-community mapping](./PRODUCT_VISION.md). The earlier change-delivery cases below remain operational examples; the revised product demonstration centers equivalent prepared representations. Gitar can review selection/fallback code, Dash0 can investigate media delivery failures, and Radar can investigate serving/deployment health; none establishes translation quality.

**Demo planning:** See [demo theme, personas, and staged feature priorities](./DEMO_STRATEGY.md) for the recommended attendee-led story, core/optional feature menu, and build-day decision gates. These remain proposals for the owner to select, not completed features.

**Current scope direction:** Defer Elasticsearch for the hackathon, following the project owner's preference after reviewing its time cost and limited value to the core journey. Retain the pitch's proposed SQLite store. The Elasticsearch assessment and combinations below remain research for a possible later expansion, not the current build plan.

**Radar direction:** The project owner is interested in using Radar during development and deployment, provided its contribution can be justified and captured for the demo. Treat Radar as a provisional choice, subject to a working deployment and persistence path. The proposed evidence plan below defines that contribution; it does not record completed work.

**Recommendation after confirming a solo build:** Keep Merge Forward as the product's center and Radar as the main sponsor integration to attempt. Consider Gitar only if repository access/setup is straightforward and its review workflow fits the build budget. Defer Dash0 for this event unless explicitly choosing it in place of Radar or revising scope to fund both. This is a capacity recommendation, not a new selection decision; Gitar and Dash0 remain unconfirmed.

At the initial repository inspection, no application implementation was found. The project owner has confirmed a **solo build**. Estimates below assume the proposed Next.js/TypeScript application still needs to be built. They are engineering estimates, not sponsor setup promises.

**Implementation entry point:** The [current handoff](./IMPLEMENTATION_HANDOFF.md) resolves data/API contracts, operator publishing, asset lifecycle, runtime, and acceptance gates. This document retains historical track comparisons; older deferral and gap-review recommendations do not override later user decisions or the handoff.

## Discussion outcomes and current status

| Track or component | Status after discussion | Rationale and condition |
| --- | --- | --- |
| Team capacity | Confirmed solo | Integration work, application implementation, verification, and presentation preparation compete for the same person's build time. |
| Merge Forward / accessible conference journey | Existing product direction | Preserve preferences, readable session information, and consistent room/time changes across supported modes. |
| SQLite | Retain the proposed design | Elasticsearch is deferred; avoid adding a second data store. Radar deployment must preserve SQLite data. |
| Elasticsearch | Deferred for this hackathon | The project owner is not inclined to include it given the time cost and limited core value for the current journey. Revisit only if session discovery becomes a deliberate later product expansion. |
| Dash0 | Setup requested; MCP authenticated and synthetic ingestion checked | Application instrumentation and a product-specific investigation still need build time. Earlier deferral advice was a capacity recommendation; final track evidence is outstanding. |
| Radar | Provisional development/deployment choice | The project owner is inclined to use its features during actual delivery, provided the contribution is justified and tracked for the demo. Use the release and persistence evidence plan below. |
| Gitar | Repository connection verified; review instructions prepared locally | Use from early implementation PRs; review/CI execution and evidence remain unverified. |
| AI companion | Existing stretch scope | Neither Dash0 nor Radar needs an attendee AI companion. Cut it before the core journey or verification work. |

Elasticsearch's deferral does not automatically select other submissions. Radar and Dash0 setup is now requested and partly verified; final inclusion depends on implementation. All product/demo evidence below remains planned. The separate readiness record contains the completed setup checks.

## Verified event constraints

The [official track page](https://www.wemakedevs.org/hackathons/cnh) permits multi-track participation. Its judging criteria emphasize:

| Track | Published emphasis, paraphrased |
| --- | --- |
| Merge Forward — Conferences for Everyone | Conference inclusion and accessibility |
| Sonar/Gitar — Never Merge Broken | Reviews across development, project-specific instructions/rules, CI diagnosis and fixes |
| Dash0 — Stop Flying Blind | Broad instrumentation including frontend monitoring, a real investigation, product relevance; dashboard/SLO bonus |
| Radar — AI SRE | Kubernetes deployment, sustained UI/MCP use, AI investigation with findings acted upon |
| Elasticsearch — Find the Right Talk | Elasticsearch as the central application data layer and useful search |

The [rules](https://www.wemakedevs.org/hackathons/cnh/rules) require one project per participant/team, a public source repository with setup instructions, and disclosure of AI coding assistance. Main coding and design begin after the event starts; advance research and notes are allowed. This analysis is preparation. Final eligibility remains with the organizers.

The [schedule](https://www.wemakedevs.org/hackathons/cnh/schedule) places build time at 11:00 AM and submission at 5:30 PM Mountain Time on November 9, 2026: **6½ elapsed hours, including lunch/panel time**. The pitch's eight focused hours should be revised when choosing scope.

## Fit and cost at a glance

These assessments are my interpretation of the product and engineering work, not official scores. Effort includes a small demonstrable integration after a working app exists; account permissions, unfamiliar tooling, and debugging can add substantial time. Estimates overlap and should not simply be added to an optimistic core build estimate.

| Technology | Value to this prototype | Architectural impact | Estimated additional effort | Current status |
| --- | --- | --- | --- | --- |
| Gitar | Catch wrong time/room handling and regressions during delivery | Development workflow only | ½–1½ hours, distributed across the day | Recommend early adoption if selected |
| Dash0 + OpenTelemetry | Identify why critical changes arrive late or fail to render | Instrument browser/API; export telemetry | 1½–3 hours | Setup requested; application integration budget still open |
| Elasticsearch | Help attendees find suitable sessions without reading the whole agenda | Replace the proposed primary event store for the evaluated variant | 3–5 hours for storage and keyword/filter search; semantic search adds uncertainty | Deferred |
| Radar + Kubernetes | Inspect releases, investigate health, and support verification after deployment | Container deployment, storage, health checks, cluster workflow | 2–4 hours with a working supplied environment | Provisional choice with scope gate |

Merge Forward remains the strongest fit because the proposed preference selection, consistent facts, optional audio, and accessible change notification already address the product problem. The sponsor integrations should strengthen that journey.

## Gitar: protect the meaning of conference information

**Use case:** A feature changes session-time formatting and accidentally displays the developer's local timezone. A failing check and review reveal the issue before it reaches attendees.

Gitar connects to repositories, reviews PRs, diagnoses CI failures, and can commit fixes when requested or configured. Its [quickstart](https://docs.gitar.ai/quickstart) lists repository-connection permissions and a 14-day trial. The [hackathon resources](https://www.wemakedevs.org/hackathons/cnh/resources) identify `.gitar/review/` as the review-instruction location and describe repository rules and auto-apply.

Proposed project-specific review instructions:

- All modes preserve the authoritative session title, room, time, and timezone.
- Updates cannot bypass organizer authorization or overwrite a newer version.
- Critical information remains available without AI or audio.
- Controls have names, keyboard operation, and visible focus; updates do not steal focus.
- Preferences and attendee questions stay out of logs.

Pair instructions with executable checks for time formatting, update versions, authorization, and the critical UI journey. AI review alone cannot verify accessibility.

**Evidence to retain:** Several meaningful implementation PRs, a relevant finding, the resulting correction, and passing checks. A deliberately introduced failure must be described as a controlled demonstration. Do not count on the agent discovering or fixing every issue.

**Recommendation, not a selection:** High fit with little product disruption. If adopted, set it up at the start; a final review cannot recreate a day's development evidence.

## Dash0: make timely information delivery observable

**Use case:** An organizer moves a session, but attendees see a stale schedule because the polling endpoint is slow. The attendee UI reports stale information, while the operator traces the delay and verifies recovery.

**Product justification:** Saving an organizer change successfully does not establish that an attendee received it. Someone relying on the app may not receive or comfortably use a spoken announcement, making a silent delivery failure particularly relevant to the product's purpose. This is a product hypothesis to validate with attendees, not a measured accessibility outcome. Dash0 primarily helps developers/operators investigate failures; attendees benefit from correct application behavior and faster recovery.

**Why this technology fits:** Dash0 brings browser and backend evidence together, fits the proposed JavaScript stack, and does not require replacing SQLite or adding a new attendee feature. OpenTelemetry provides a standard for backend instrumentation. Another capable observability platform could address the same underlying need; sponsor relevance is an additional reason to evaluate Dash0, not evidence that it is uniquely necessary.

Use [Node.js OpenTelemetry instrumentation](https://www.dash0.com/hub/integrations/int_nodejs/overview) for API activity and the [Dash0 web SDK](https://www.dash0.com/hub/integrations/int_dash0_sdk_web/overview) for browser requests, errors, and custom events. [Agent0](https://www.dash0.com/agent0) supports investigations over telemetry; verify its explanation against the actual traces and code.

Proposed measurements:

| Signal | What it establishes |
| --- | --- |
| Organizer save result and update version | Whether the new information was accepted and which version should subsequently appear |
| Poll request latency/error rate | Whether the API can deliver schedule data |
| Returned version and custom matching-version render event | Whether the observed UI rendered the intended update, rather than only receiving a successful HTTP response |
| Time since the browser's last successful refresh | Whether the attendee is seeing potentially stale information |
| Update accepted → matching version rendered, measured by a controlled test client | Whether the signature room/time change reaches the screen |
| Browser render failures | Whether successful API responses still fail to become usable information |
| Optional read-aloud start/error callbacks, where supported | Whether the browser reports a technical playback failure; this is secondary to update delivery |

Use an explicit test client for the end-to-end measurement so cross-device clock differences do not produce misleading latency. A proposed demo objective is that the changed session renders within ten seconds while the app is open and online. That is a target to test, not an established service guarantee. A recent successful poll is not the same as a recently edited session: an unchanged session can still be current.

**Application responsibility:** Implement failed-refresh detection, a visible last-checked/stale message, preservation of last-known information, and retry in the app itself. Dash0 helps diagnose and verify; it is not on the critical path for displaying the schedule or activating those fallbacks. A render event cannot establish that an attendee read or understood the message, and playback callbacks cannot establish that it was heard. Missing telemetry is inconclusive, not proof of successful delivery. Keep manual accessibility and usability checks separate.

**Minimum demo scope:** One dashboard covering refresh errors, request latency, browser errors, and controlled end-to-end update timing; one proposed ten-second delivery target; one investigation with a verified outcome. Prefer a real issue encountered during development. If using a bounded API delay in the protected demo environment, clearly label it as an injected demonstration and do not present it as an organically discovered defect. Correlate traces and structured logs by request/version; keep metric labels low-cardinality.

**Evidence sequence:** Capture the failed or delayed journey and relevant versions, use Agent0 or MCP to investigate the available evidence, record the supported finding and correction, and rerun the same journey to show recovery. Save the investigation reference and before/after results. Do not claim a diagnosis or improvement the collected evidence does not support.

**Proposed pitch wording:** “Accessible conference information must also stay current. We use Dash0 to observe the journey from an organizer's update to its display in the attendee interface, investigate delivery failures, and verify recovery.” Use this as a planned claim until the integration and evidence exist.

**Privacy and failure behavior:** Disable session replay and user identification for this prototype; scrub URLs, request bodies, questions, and preferences. Browser ingestion credentials are necessarily visible: Dash0 documents a separate dataset-limited, ingestion-only token. Server/admin credentials stay server-side. Telemetry failure must not prevent schedule use.

**Decision status:** Setup was subsequently requested and verified, including synthetic ingestion and MCP retrieval. Application instrumentation is still planned and needs room in the solo build budget. Complete the investigation-and-recovery loop without sacrificing the attendee journey; generic traffic charts or SDK installation alone do not justify the added scope. Final track submission remains dependent on implementation evidence.

## Feature-driven use cases for the build

Added after integration setup, November 7, 2026. These are reasonable scenarios to design for and investigate during implementation, not incidents already observed. Actual readiness is recorded in [integration setup](./INTEGRATION_SETUP.md). The current app is not implemented; only service connections and infrastructure have been exercised.

Use the tools around product commitments: Gitar reviews the implementation and helps diagnose failing CI; Radar exposes Kubernetes deployment/runtime evidence; Dash0 exposes instrumented application/browser evidence. Application tests establish factual correctness and accessibility behavior. None of the tools automatically supplies the application's content versioning, publication transactions, stale-state UI, or durable storage.

### 1. Publish a complete conference version

**Feature and trigger:** An organizer loads six sessions, prepares short descriptions and available visual/audio assets, previews them, and publishes version 1. Later, a draft amendment contains an invalid room reference or a failed write.

**Product requirement:** A rejected publication leaves the previous complete version active. A successful publication exposes matching facts and prepared representations. Optional audio can be explicitly unavailable; outdated audio must not be played as current.

- **Gitar:** Review validation, event scoping, transaction boundaries, and media-version handling. Have CI exercise a failed publication and assert that the active version and its content remain unchanged; use Gitar's actual review/failure analysis and verify any proposed fix.
- **Dash0:** Instrument `conference.prepare` and `conference.publish` with child operations for validation and database work. Distinguish expected validation rejection from infrastructure/server failure. Investigate whether a publish failed before activation or after a write. Useful evidence is the operation outcome and committed version, not just a successful HTTP response.
- **Radar:** Useful when publication fails because the container cannot write its mounted directory, a required Secret is missing, or the pod restarts. Inspect workload status, events, mounts, and relevant logs. A malformed room reference is an application concern and does not need a Radar investigation.

**Evidence:** Invalid amendment rejected, prior version still available, corrected publication succeeds, and the supporting test/trace identifies the failure boundary. No background worker or AI generation is needed for this case.

### 2. Deliver a changed room/time to an open attendee screen

**Feature and trigger:** The attendee bookmarks a session. The organizer changes it from Room A at 2:00 PM to Room B at 2:30 PM. The API saves version 2, but the browser continues showing version 1 because polling fails, a stale cache is returned, or rendering throws.

**Product requirement:** While visible and online, the attendee receives the new facts and a persistent notice. Refresh failure preserves the last-known schedule and clearly indicates staleness. Changes must remain understandable in both layouts.

- **Gitar:** Review cache keys, version comparisons, tab-resume refresh, and state updates. CI verifies that the matching version appears, switching layouts preserves the notice, and failed refresh does not silently look current.
- **Dash0 — primary diagnostic tool:** Connect publication traces, polling requests, returned versions, browser errors, and an application-defined matching-version render event. Determine whether the failure is in saving, fetching, or rendering. A healthy API with a browser exception is a meaningful finding even when Kubernetes is healthy.
- **Radar:** Check whether the intended release is running and whether readiness failures, restarts, or routing configuration explain failed polls. If these checks are healthy, record that evidence and continue with application investigation. Do not invent an infrastructure cause for a frontend defect.

**Evidence:** A reproducible delayed/failed journey, supported diagnosis, fix, and rerun. Measure the proposed ten-second update target with one controlled test-runner clock, from submitting the organizer update to observing the matching DOM state. Backend and browser wall-clock timestamps alone are insufficient for a precise cross-device latency claim.

### 3. Ship an application release without losing conference facts

**Feature and trigger:** Version 2 is already published. A PR improves the attendee UI, producing a new app image. Kubernetes replaces the pod. A plausible bug stores SQLite in the disposable container filesystem or startup seeding replaces organizer edits.

**Product requirement:** The latest published room/time/content version survives replacement, and a subsequent organizer amendment still works. Keep the application release version separate from the conference content version.

- **Gitar:** Review the Docker/deployment storage path, startup seed logic, migration behavior, and single-writer assumptions. A persistence test writes a distinctive fixture, restarts/replaces the app, and asserts it remains; a code review is not a substitute for this test.
- **Radar — primary deployment tool:** Inspect the rollout, running image, readiness, pod replacement, and volume/PVC relationships. Investigate failed mounts or startup problems using actual evidence. If GitOps is adopted, inspect its reconciliation state too; Argo CD is not currently installed merely because Radar is connected.
- **Dash0:** Compare request failures/latency across the release using `service.version` and deployment identity. In a controlled fixture, observe that post-release reads return the expected published version. A healthy trace does not establish that its payload is correct unless version/outcome checks are deliberately instrumented.

**Evidence:** Saved fixture before release, deployed image and replacement pod, healthy rollout or a diagnosed issue, identical published facts afterward, and a successful new update. Application assertions prove persistence; Radar explains the infrastructure transition. Record any brief single-replica downtime honestly.

### 4. Switch presentation without losing essential information

**Feature and trigger:** An attendee switches between Focus and Overview while viewing a changed session, or chooses Listen when the prepared clip is missing/outdated. Plausible faults include a component exception, lost bookmarks, dropped notices, or an obsolete media reference.

**Product requirement:** Preserve the selected session/bookmarks and current change notice. A missing current clip leaves readable current text and an explicit unavailable state. No layout silently restores old room/time facts.

- **Gitar:** Review shared state, semantic controls, focus handling, current media references, and fallback logic. CI checks factual equivalence and state preservation across layouts. Supplement it with keyboard and screen-reader checks.
- **Dash0:** Capture technical render exceptions, failed asset requests, and explicit playback error callbacks if available. A controlled test can verify matching-version rendering before/after switching. Do not collect real attendees' diagnoses or presentation preferences merely to segment a dashboard.
- **Radar:** Secondary role only when a bad deployment or backend route prevents assets/content from being served. It cannot explain a purely client-side state bug or prove that a layout suits a person.

**Evidence:** A switching/media regression test, useful review/fix, relevant browser error evidence, and successful fallback. This does not validate cognitive accessibility or prove the message was understood.

### 5. Optional: a modest arrival-time scan burst

**Feature and trigger:** Several attendees scan the event QR around the start of a session. Accidentally preparing content on every request or transferring oversized assets slows the first useful screen.

- **Gitar:** Review that attendee requests retrieve prepared content and avoid unnecessary writes/generation; review the test's assertions.
- **Dash0:** Use a small labeled synthetic load test to locate request latency/errors and browser loading delays. Require sufficient samples before quoting percentiles; record concurrency, duration, dataset, and hardware.
- **Radar:** Inspect CPU/memory/restarts and resource constraints only where metrics are available. Resource saturation supports an infrastructure hypothesis; lack of it directs attention toward application work or network/assets.

**Scope limit:** Optional after the core journey. Fix a demonstrated bottleneck; do not add autoscaling, replicas around SQLite, a queue, or a cache service solely to use sponsor features. Local laptop results do not establish event-scale capacity.

### Recommended solo implementation and demo

Make cases **2 (current updates)** and **3 (safe releases)** the main evidence story. Implement case 1's publication checks as a correctness prerequisite and case 4's interface/fallback checks as part of the core product. Case 5 is optional.

1. From the first runnable slice, use Gitar on meaningful PRs and CI checks. Instrument a small set of server operations: `conference.prepare`, `conference.publish`, and `conference.read_updates`.
2. Deploy the app to the connected cluster with explicit persistent storage. Use Radar to record the initial image, pod, and readiness baseline.
3. Add browser request/error monitoring and the explicit render-version signal. Keep telemetry failure independent of attendee functionality.
4. Publish the fixture room/time change and measure its appearance in both interfaces with a controlled test. Investigate an actual problem using Dash0, and Radar when infrastructure evidence is relevant.
5. Ship the correction or another meaningful implementation change through a reviewed PR. Use Radar to inspect the new release; repeat update-delivery and persistence assertions. Retain links/recordings while the evidence is available.

Use a bounded, clearly labeled fault only if needed to demonstrate recovery; do not describe it as a naturally encountered incident. A healthy-release investigation is also useful. Never create a regression merely so a review bot can claim to discover it.

**Small shared evidence contract:** PR/commit, image or `service.version`, deployment identity, synthetic fixture ID, `content.version`, operation/outcome, trace ID, test result, and investigation link. Keep high-cardinality IDs in traces/structured logs rather than metric labels. Do not include private roster/profile data or full request bodies. Missing browser telemetry is inconclusive; use controlled test assertions for demonstration claims.

**Candidate demo narrative, only after verification:** “We review changes that affect conference facts with Gitar, inspect each Kubernetes release with Radar, and use Dash0 to investigate whether published updates reach the attendee interface. Our tests verify that the facts remain consistent across layouts and survive deployment.”

Capability references: [Radar investigations](https://radarhq.io/docs/features/diagnose), [Radar GitOps views](https://radarhq.io/docs/features/gitops), [Dash0 browser monitoring](https://www.dash0.com/hub/integrations/int_dash0_sdk_web/overview), and [Gitar CI analysis](https://docs.gitar.ai/features/ci-failure-analysis). The feature-to-tool mappings and prioritization above are project-specific engineering proposals.

## Elasticsearch: accessible session discovery

**Decision status:** Deferred for this hackathon. The following is retained evaluation, not implementation scope. The project owner judged its time cost and core relevance insufficient for the current prototype.

**Use case:** An attendee chooses “beginner,” “after 2 PM,” and a topic such as containers, then sees a few readable session cards rather than a dense agenda. Explicit constraints filter results; relevance ranks the remaining talks.

[Elasticsearch supports keyword and semantic search](https://www.elastic.co/docs/solutions/search/get-started); [hybrid search](https://www.elastic.co/docs/solutions/search/hybrid-search) combines keyword and vector results. Start with structured filters and keyword matching. Semantic search is an optional second step, with an embedding/inference dependency and deployment-specific feature availability to verify.

For the evaluated track-focused variant, Elasticsearch would serve the agenda, session detail, and search endpoints, and persist organizer session changes there. Browser preferences/bookmarks would remain local. Replacing SQLite was our scope-management recommendation for that variant, not an explicit organizer requirement; maintaining two stores would introduce synchronization work. No such replacement is planned now.

Suggested session fields: ID, title, abstract, topic, level, start/end time, timezone, room ID, version, and update timestamp. Venue accessibility facts must be organizer-verified and able to represent “unknown.” Presentation preferences must not be treated as inferred disabilities or semantic suitability scores.

**Correctness work:** Define optimistic concurrency and polling/version semantics explicitly; replacing SQLite is more than swapping a client library. Search visibility follows refresh behavior. For the small demo, evaluate `refresh=wait_for` when acknowledging an organizer change so subsequent searches can see it; account for that wait in the update latency budget. See [Elastic refresh documentation](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/refresh-parameter).

**Evidence to retain:** Inspectable queries, authoritative records, results that honor time/level filters, a no-match response, and updated room/time values after an edit. For semantic search, include paraphrased queries and known expected results; exact title matches alone do not demonstrate its benefit. Consider 30–50 clearly labeled synthetic talks to make discovery meaningful while preserving six talks for the core journey.

**Tradeoff discussed:** This would expand the product from understanding conference information to finding a suitable session and staying informed about it. A bounded version could use keyword search and explicit filters; vector search, RAG, conversational queries, and personalized recommendations are not needed for that version. Even then, its storage and consistency work competes with the core build. For a solo builder unfamiliar with Elasticsearch, deferral is preferable; an experienced builder or dedicated teammate could make the alternative more feasible. With six sessions and a change-notification focus, its incremental attendee value is limited. Revisit only if discovery becomes a sustained product direction.

**Deployment uncertainty:** The event resources request Kubernetes preparation for this track but also offer local Docker/cloud Elasticsearch options. Confirm whether a particular hosting topology is expected. Elastic's [local starter](https://github.com/elastic/start-local) explicitly targets testing, not production hosting; a trial is not a permanent deployment plan.

## Radar: verify releases and preserve conference updates

**Primary use case:** An organizer changes a session's room and time. We deploy a new application version, inspect its rollout through Radar, investigate its health, and verify that the saved conference update remains available to attendees. This makes Radar useful to the actual release workflow without adding attendee-facing scope.

**Incident alternative:** If a real deployment issue arises, such as a failed health check or inaccessible database volume, retain the evidence, investigation, correction, and successful verification. A deliberately injected fault must be labeled as such. The current [starter guidance](https://github.com/skyhook-io/cnh-starter) also accepts an evidence-backed healthy-release investigation; a broken release is not required.

[Radar](https://github.com/skyhook-io/radar) provides Kubernetes visibility, MCP tools, and AI investigations. It addresses cluster/workload operation; Dash0 addresses application requests and user-facing performance. They can complement each other, but each needs its own demonstrated contribution.

**Justification and complexity discussed:** Radar can be central to how we deliver the prototype, while the core attendee value remains the accessible interface. Most added work comes from adopting Kubernetes: image builds, deployment configuration, networking, health checks, persistent storage, and rollout behavior. The supplied environment reduces setup work, but does not remove application-specific validation. Retain one application and avoid adding microservices or autoscaling merely to demonstrate infrastructure features.

The [hackathon starter](https://github.com/skyhook-io/cnh-starter) provides a path through GitHub Actions, container images, and Argo CD, with a team URL and a supplied environment. Adapt the app to that deployment path and use Radar while shipping, investigating, and verifying recovery.

**SQLite implication:** Retain SQLite, use one application replica with durable storage, and choose a rollout strategy that avoids competing writers. Confirm volume support in the provided environment. Keep the database outside the container's disposable filesystem, and ensure startup seeding does not overwrite organizer changes. Do not adopt autoscaling examples. A single-replica rollout may briefly interrupt service; measure and disclose that behavior rather than promising zero downtime.

### Proposed Radar demo evidence

Justification: Radar helps us inspect releases and investigate deployment health so that operating the conference app does not silently discard or interrupt access to current event information. Radar supplies infrastructure evidence; application checks establish that the saved information remains correct.

| Step | Action during development | Evidence to retain |
| --- | --- | --- |
| Establish a baseline | Connect Radar and inspect the first running deployment | Timestamp, workload identity, deployed commit/image, initial health view |
| Save a meaningful change | Move the fixture session from Room A at 2:00 PM to Room B at 2:30 PM through the protected organizer control | Session ID, application version of the record, and before-release API/UI values |
| Deploy through the normal workflow | Ship a real implementation change and inspect its rollout using Radar UI/MCP | PR/commit, image identifier, deployment timeline, observed rollout outcome |
| Investigate | Ask whether the latest release is healthy and what evidence supports that conclusion | Investigation reference, findings and supporting events/logs; any actual issue and correction |
| Verify the product | Confirm the saved record after pod replacement and show the same room/time in the attendee UI; then make another organizer update | Passing application check, new deployment identity, retained record values, and working new update |

**Acceptance conditions:** The intended image runs, readiness checks pass, the pre-release room/time/version survives pod replacement, and the attendee can receive a subsequent update. Missing evidence stays unverified. A healthy workload alone does not prove correct data, usable accessibility, or actual attendee comprehension.

**Record as work happens:** For each significant release, capture `time | commit/image | change or investigation question | Radar evidence | finding | action taken | application verification | limitation`. Use links or saved screenshots/recordings that the presenter can access; redact secrets. Capture real findings, including an all-clear when supported, without fabricating an incident or improvement metric.

**60–90-second demo segment:** Show the saved room/time, the real deployment timeline and one investigation finding, then the retained data and functioning attendee update. Keep a recording of the deployment rather than depending on a live image build finishing during the presentation. Phrase unperformed checks as planned, never as results.

**Scope gate:** Use Radar from the first deployment if selected. Timebox initial deployment adaptation to roughly one hour after a runnable container exists; confirm persistent storage early. If that path remains unresolved or threatens the core accessibility journey, reconsider the track instead of introducing a new database or more infrastructure. This is a stop/reassess point, not a one-hour estimate for all Radar work.

**Publishing limitation:** The starter says hackathon cluster/org access ends November 13. Its demo URL should therefore be treated as temporary; a longer-lived prototype needs separately arranged hosting and data persistence.

**Decision:** Provisionally pursue Radar as the development/deployment workflow, with the above evidence and scope gate. Final inclusion depends on completing that workflow while preserving time for the core attendee journey.

## Scope options after discussion

These are alternatives, not a commitment to combine every remaining integration. Elasticsearch combinations are excluded from the current plan; their rationale is retained in its deferred evaluation above.

| Build choice | Track targets | Status and rationale |
| --- | --- | --- |
| Product baseline | Merge Forward | Preserve the complete accessible change-notification journey. |
| Provisional deployment direction | Merge Forward + Radar | Follow the owner's interest in Radar, subject to deployment/persistence feasibility and demo evidence. |
| Development workflow addition | Add Gitar if selected | Conditional on straightforward setup and budget for reviewed implementation PRs. |
| Application monitoring alternative | Dash0 in place of Radar, or with an explicitly revised budget | Useful capability, but recommend deferral alongside Radar for the confirmed solo build. User decision remains open. |

If Dash0 is selected, tell one story: an attendee selects a calm presentation, bookmarks a talk, and receives a room/time change. Investigate a real delivery issue where available, or clearly label a controlled API delay that makes the UI show stale status. After correction, verify the update arrives in the supported formats. If Gitar is selected, show its reviewed correction and checks as supporting engineering evidence. If time is tight, make the healthy attendee journey the live demo and retain recordings of investigations and PR history.

For the deferred search alternative, lead with finding and bookmarking a suitable talk, then show the same change-notification journey. For Radar, show evidence from a release investigation and verify that the saved schedule update survives deployment; include incident recovery if a real issue occurred. Avoid spending the whole presentation switching among sponsor dashboards.

## Demo evidence tracker

All entries are **planned / not yet collected**. During implementation, replace the status with the actual outcome and attach the relevant commit, investigation, check result, or recording. Do not infer success from a tool being installed.

| Area | Evidence to collect | Completion condition |
| --- | --- | --- |
| Core attendee journey | Preferences, saved session, changed room/time, keyboard/screen-reader checks | Exact facts remain consistent and the critical journey is usable; document remaining limitations. |
| Radar baseline and releases | Initial health, commit/image IDs, deployment timelines, UI/MCP use | Evidence reflects actual development activity, not only a final dashboard visit. |
| Radar investigation | Question, findings, supporting events/logs, action taken | Findings support the conclusion; an evidence-backed all-clear is acceptable. |
| Persistence after deployment | Pre/post-replacement room, time, record version, and subsequent update | Saved data survives and the attendee can receive another change. |
| Dash0, only if selected | Failure/delay evidence, investigation, correction, controlled before/after results | Demonstrated diagnosis and verified recovery; distinguish injected and naturally encountered issues. |
| Gitar, only if selected | Meaningful reviewed PRs, relevant finding/fix, passing checks | Actual use across implementation, with participant verification. |

Suggested record for each evidence item: `status | timestamp | question/change | source link | finding | action | verification result | limitation`. Private investigation links must be accessible to the presenter; retain a redacted recording when needed.

## Build-day decision gates

1. **At kickoff:** Use the confirmed solo capacity to finalize the reduced build budget and submission details. Retain the proposed SQLite design and validate the provisional Radar deployment/storage path. If adopting Gitar, connect it before implementation PRs. Use Radar from the first deployment if proceeding; establish basic telemetry early if selecting Dash0.
2. **After roughly two hours:** Preferences, agenda, and one protected room/time update should work end to end. If this fails, reduce additional track scope.
3. **By roughly hour four:** Freeze feature scope. Finish the selected integration's evidence; do not start another data/deployment migration.
4. **Reserve the remaining time:** Check keyboard and screen-reader behavior, failure states, update correctness, public setup instructions, submission, and a backup recording.

These are prioritization gates, not a claim that the whole original eight-hour pitch fits into the event window. Cut the AI companion and decorative character before compromising the core journey.

## Historical gap review and decisions to finalize

Superseded for implementation by the [current design review](./IMPLEMENTATION_HANDOFF.md#1-review-verdict-and-gaps). The entries below preserve earlier reasoning and are not the active readiness checklist.

**Review conclusion:** Track rationale and proposed evidence are documented, but the analysis is not yet a finalized execution plan. Solo capacity is now confirmed. The largest gap is the absence of a reduced build budget that includes the selected integrations, verification, and submission.

### Finalize before implementation

| Priority | Gap or unresolved decision | Recommended resolution | Status / who resolves it |
| --- | --- | --- | --- |
| 1 | Final track commitment: Radar is provisional; Gitar and Dash0 are unconfirmed | Target the core Merge Forward journey plus Radar. Consider Gitar with early setup and a bounded review workflow. Recommend deferring Dash0 rather than committing to both operational integrations. | Owner decision open; recommendations are not selections. |
| 1 | Solo build budget: the pitch allocates eight focused hours to the app, while the event allows 6½ elapsed hours including lunch/panel time | Replace the eight-hour plan with a single-person budget. Reserve at least the final 90 minutes for checks, fixes, recording, and submission, and account separately for breaks. Reduce features to fit; do not treat integration estimates as free parallel work. | Execution plan open; cannot claim the full original scope fits. |
| 1 | Feature freeze and cut order do not yet account for sponsor work | Keep one synthetic event, local preferences, agenda/bookmark flow, protected room/time update, persistent notification, and text/visual/audio support. Recommend deferring AI entirely for the event, using a simple event URL, and omitting decorative character work. Cut a sponsor integration before core accessibility verification. | Reduced scope and cut order require owner agreement. |
| 1 | Radar deployment/persistence depends on an environment not yet inspected | Use one container and one replica; verify durable storage, filesystem permissions, startup seeding, health checks, and replacement behavior. If the existing one-hour deployment gate fails, fall back to the same app locally with a persistent Docker volume and reconsider the Radar entry. | Technical dependency to verify at kickoff/first deployment; fallback is proposed. |
| 2 | Pitch and analysis now describe different delivery plans | Once scope is selected, update the pitch's eight-hour schedule, local-first/later-Kubernetes wording, optional AI emphasis, and demo sequence to match the actual plan. | Documentation follow-up; pitch intentionally remains unchanged during this review. |
| 2 | Demo time is oversubscribed: the pitch already fills three minutes, while Radar proposes another 60–90 seconds | Verify the actual presentation limit. If using the team's three-minute assumption, aim for 90 seconds of attendee journey, 60 seconds of Radar evidence, and 30 seconds for framing/limitations and a brief Gitar reference if selected. Retain deeper evidence in recordings and the README. | Presentation duration external; proposed allocation is not an official rule. |
| 2 | Publishing lifetime is undecided; the supplied environment is temporary | Decide whether success means an event-day demo or a durable public URL. For a durable demo, assign a post-event host, persistence/export plan, and budget; do not promise that the hackathon URL stays live. | Owner requirement open; persistent hosting is not provisioned. |

The proposed local fallback preserves the product demonstration but does not fulfill a Kubernetes/Radar track claim. If preserving that track is mandatory, a working alternative Kubernetes environment would need its own explicit time budget.

### Resolve during setup and verification

These are concrete technical checks or external dependencies, not all questions that need to be answered by the project owner now.

| Gap | Required resolution or evidence |
| --- | --- |
| Account access and permissions are assumed | Verify Radar invitation/MCP access, repository and image permissions, and CI readiness. If selected, verify Gitar repository installation rights and Dash0 ingestion/investigation access before relying on them. |
| Organizer protection is a requirement without a selected mechanism | Choose a minimal server-validated demo authentication mechanism. Check unauthorized writes are rejected, credentials stay out of public artifacts, and the authenticated change path still works after deployment. |
| The ten-second target lacks a fully specified measurement protocol | Define a controlled test using one test-runner clock, from submitting the organizer update to observing its matching version in the attendee UI. This includes save time and is a proposed clarification of the existing target. Record the polling interval, visible/online browser condition, and failure behavior; do not infer delivery from request success. |
| Accessibility and trial-user targets have no allocated execution plan | Choose one browser/screen-reader pair and record keyboard, announcement, resize/contrast, and automated-check outcomes. Arrange the pitch's three formative trials if feasible; otherwise mark the usability hypothesis unvalidated rather than claiming the target passed. |
| Evidence fields are defined but have no capture owner or location | The solo builder owns capture. Before the first deployment, choose one release/evidence log and a location for redacted screenshots/recordings, with timestamp, commit, investigation, action, verification, and limitations. Keep the final summary public and omit private credentials. |
| Final submission logistics are not confirmed | Confirm presentation length, track-selection/evidence submission method, deadline, and required links at kickoff. Verify a clean-checkout setup path, public repository access, and AI-assistance disclosure before submitting. |

**Settled or intentionally deferred:** Solo build confirmed; Elasticsearch deferred; SQLite retained as the proposed store; no microservice or autoscaling expansion planned. Radar remains provisional. Gitar, Dash0, exact reduced feature scope, and public-hosting lifetime still need decisions. The event-specific deployment prerequisites must be verified rather than assumed.

The analysis initially involved no account changes. Subsequent sponsor setup, local Radar infrastructure deployment, and verification are recorded in the [integration readiness record](./INTEGRATION_SETUP.md). Conference application implementation and deployment have not started; the pitch now points to the updated vision and implementation handoff.
