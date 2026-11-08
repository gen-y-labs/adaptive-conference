# Implementation kickoff prompt

Use the prompt below in an implementation session attached to this repository. It references the agreed design instead of duplicating the full specification. Owner decisions: ASL is confirmed; the hackathon environment is preferred, subject to confirmation during the event; coding start/deadline are yet to be determined. The permitted video source and fluent ASL reviewer remain unresolved. Do not treat provisional choices or unanswered questions as approval.

---

Implement **Adaptive Conference**, a conference companion that presents the same event information according to each attendee's communication preferences and strengths.

The core problem is that a text-heavy agenda, an audio announcement, or a single presentation style does not work equally well for everyone. Our core demonstration is **the same agenda understood through meaningful pictures, prepared sign-language content, and accessible text/screen-reader navigation**. Schedule updates and Focus/Overview layouts support this experience; they must not replace the communication-adaptation goal.

## Read the current design first

Inspect the working tree and applicable repository instructions before editing. Preserve existing work and reuse implementation that may have been added since this prompt was written. Read:

1. [Implementation handoff](./IMPLEMENTATION_HANDOFF.md) — authoritative implementation contracts, gap review, build sequence, and acceptance checks A01–A12.
2. [Product vision](./PRODUCT_VISION.md) — intended audience, communication needs, and content principles.
3. [Demo strategy](./DEMO_STRATEGY.md) — priorities, scope gates, and demonstration story.
4. [Integration setup](./INTEGRATION_SETUP.md) — previously verified service preparation and remaining integration work.
5. [Gitar review rules](../.gitar/review/conference.md).

Use the latest explicit owner decisions first, then the handoff for technical detail. Older pitch/track alternatives do not override them. Verify current tool and repository state; setup records are historical evidence, not proof that services are healthy today. Do not repeat completed setup unnecessarily.

## Carry forward the owner decisions

- **Sign language: American Sign Language (ASL), confirmed.** Do not ask the owner to choose a language again. Attendees still explicitly select their communication preference.
- **Deployment: most likely the hackathon environment.** Confirm the assigned environment during the event before deployment. Local Docker and the existing Radar cluster remain development/test options, not a replacement for that preference.
- **Coding timing: yet to be determined.** This prompt does not itself establish that the permitted coding period has started.
- **Content dependency:** an ASL video source, usage permission, and fluent reviewer have not been identified.

## Ask only unresolved critical questions

Check the conversation and documents for existing answers. Ask the following together, concisely, only where unresolved:

1. **ASL content:** Who will provide agenda/orientation videos with permission to use them, and who fluent in ASL will review them? What content is already available?
2. **Event deployment, when needed:** Has the preferred hackathon environment been confirmed, and what are its cluster, namespace, storage, URL, and access-expiry details? Do not reopen the general target preference; obtain the concrete details before dependent deployment work.
3. **Timing, only if unclear:** Has the event's permitted main coding period begun, and what implementation deadline should we work toward? Existing preparation notes distinguish advance planning from main coding. If the owner has already established the allowed start and deadline, do not ask again. If coding is not yet permitted, continue permitted preparation only and state the specific restriction.

Record answers and unresolved dependencies in the implementation status. Do not reopen settled choices such as no Elasticsearch, no attendee-triggered generation, and operator CLI publishing for the initial release. Choose routine engineering details autonomously and explain material deviations.

Missing signing content blocks completion of the signed experience, not independent technical work. Once coding is permitted, proceed with schemas, publishing, accessible UI, pictures, media handling, and tests while content is obtained. Use the confirmed ASL scope; never label a placeholder as reviewed signing. Local preview and explicitly labeled test fixtures may exercise incomplete content; they must not bypass the initial-release coverage validation or be presented as the complete public demo.

## Implement this bounded core

- One fictional public conference, initially three sessions and two rooms. Reduce the whole fixture if necessary to achieve complete reviewed coverage; accurately report the supported scope.
- Guest entry with directly discoverable picture/signing previews and accessible controls. No diagnosis questionnaire, account requirement, or text-heavy gate to accessible formats.
- Picture-led session information that communicates the task, prepared ASL agenda/orientation, and semantic text with keyboard/screen-reader navigation.
- Composable preferences: primary format, supplementary pictures, sign language, written language, and density. Preserve selected session and any implemented bookmarks while switching. Remember settings only with device-local opt-in; support reset and blocked/corrupt storage.
- One authoritative set of event facts, versioned representations, source-hash validation, explicit coverage, and meaningful missing/stale/media-error states. Do not silently substitute another sign language or call a text fallback completed signing support.
- An operator CLI to validate, preview, and publish reviewed packages. Stage immutable assets before atomically activating the SQLite release. Enforce expected-version checks and idempotent retries.
- Read APIs, safe media delivery with video range support, bounded freshness checks, and consistent snapshot replacement. No mixed versions, obsolete playback, autoplay, focus stealing, or cropped signing space.

Use Next.js App Router, TypeScript/React, a Node server runtime, SQLite through `better-sqlite3`, and runtime schema validation as specified in the handoff. Start from the Node 24 LTS baseline; verify supported patches and dependency compatibility at implementation time, pin the resulting versions, and retain a reproducible lockfile. Build native dependencies for the actual Linux target. Keep one application and one replica, persistent database/media storage, and a Recreate deployment strategy.

Prepared audio, bookmarks, density variants, QR entry, community discovery, and organizer web UI are later increments. Do not add AI, generated signing, runtime picture/speech generation, Elasticsearch, real registration, or extra services to satisfy a sponsor story. Normal assistive-technology speech remains supported.

The seven communities in the product vision are the intended audience. Membership does not prescribe an interface. Community interests and communication preferences remain separate, voluntary dimensions.

## Build in working increments

After the initial inspection and critical questions, give a short sequence and start implementation once timing permits. Do not stop at a plan when independent work can proceed.

1. **Runtime and storage proof:** scaffold the app; validate a production container with SQLite access, persistent paths, and real media streaming. Record the compatible dependency versions.
2. **Data and publishing:** implement schemas, fixtures, source hashing, asset staging, immutable releases, CLI validation/preview/publication, and the read API. Test rejected input, crash/failure boundaries, retries, and conflicting publishers.
3. **Attendee communication journey:** implement accessible entry, preferences, picture-led content, signing playback, text navigation, and context-preserving switching. Integrate real reviewed assets when available.
4. **Reliability and deployment:** implement freshness/error states, race handling, media failure recovery, persistent deployment, and backup/restore verification. Verify published facts and assets survive replacement.
5. **Evidence and release:** finish required checks, capture an honest demo, update running instructions and limitations, and add only optional features that fit after core gates pass. Protect the final 90 minutes for verification, fixes, rehearsal, and submission when using the hackathon schedule.

Keep progress updates focused on completed behavior, evidence, remaining uncertainty, and the next gate. Persist through routine failures; do not wait for a content answer before doing unrelated authorized work.

## Integrate tools around actual product behavior

- **Gitar:** use the repository's review workflow from early implementation changes. Retain an actual useful review, correction, and passing checks when available. Installation alone is not review evidence.
- **Dash0:** establish server instrumentation early. Observe validation/publication, release reads, and media delivery. Use the handoff's bounded same-origin client-outcome endpoint to distinguish API success from UI/media readiness. Never expose server tokens or record attendee preferences, diagnoses, sign-language choices, or community affiliation in telemetry. Observability failure must not break the attendee journey.
- **Radar:** inspect the explicitly selected application cluster, deployment, image, events, and mounts. Verify persistence and media retrieval through replacement using application assertions alongside Radar evidence. Label deliberate fault injection; a healthy pod is not proof of usable content.

Reuse the existing accounts and local cluster where appropriate. Follow the established repository publication workflow; do not merge or change organization-wide automation settings merely to obtain evidence. Ask for missing target/access details only when they block the next dependent action.

## Completion and delivery

Use the handoff's A01–A12 checks as the acceptance register. Record each as passed, failed, not run, or blocked, with actual commands/results, environment, content release, and evidence. Include focused unit/integration/browser tests, manual keyboard and available screen-reader checks, real encoded-media playback, and human content review. Never claim tests or participant validation that were not performed.

Deliver:

- Runnable implementation with reproducible install, build, test, content preparation/publication, and deployment instructions.
- A content manifest with provenance, permission references, source/asset hashes, review status, language, and honest coverage; keep private review evidence out of public bundles.
- Safe example configuration, persistent-storage deployment configuration, and actual tool-integration evidence.
- A concise implementation status and acceptance register distinguishing completed engineering from unresolved content, environment, or human-review dependencies.
- An updated README and short demo script showing the same information through supported communication formats.

Do not declare the full core complete while reviewed signing is missing. Deliver the functioning work, clearly describe what is unavailable, and identify the exact input required to finish. The final report should explain what works, how it was checked, how to run it, and what remains.
