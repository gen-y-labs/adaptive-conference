# Conference preparation, attendee preferences, and integration planning

Exploration notes · November 7, 2026. Companion to the [pitch](./PITCH_DECK.md) and [track decisions](./TRACK_INTEGRATION_ANALYSIS.md). These are proposed workflows and data boundaries, not implemented capabilities or newly confirmed scope.

Implementation reference: the [design review and handoff](./IMPLEMENTATION_HANDOFF.md) supersedes exploratory alternatives below. The first release uses operator validation/preview/publication, three sessions/two rooms, prepared media, and device-local opt-in preferences. Public organizer UI and real registration are later scope.

## Current product direction

The owner clarified that communication adaptation is the core: picture-led agendas, prepared signing, accessible text, and other chosen representations. See the [product vision](./PRODUCT_VISION.md) and [revised priorities](./DEMO_STRATEGY.md). The earlier two-layout recommendation below is now a supporting layout proposal, not the complete core scope. ASL is confirmed for the first demo; permitted content availability and fluent review remain explicit planning dependencies.

## Proposed operating model

Prepare and review conference information when an organizer publishes it. Attendee requests should select already-prepared information and apply explicit presentation preferences. Avoid attendee-triggered model calls, image generation, or full schedule comparisons.

Keep three concerns separate:

1. **Conference facts:** authoritative schedule, venue, rooms, event timezone, help contacts, and verified facilities.
2. **Prepared content:** short descriptions, step-by-step guidance, labeled visual assets, audio/transcripts, sign-language videos, and prebuilt change notices tied to a published version.
3. **Attendee preferences:** the person's chosen presentation settings, stored locally or in a private authenticated profile. These never enter the shared conference content bundle.

The app still needs small runtime operations: resolve the event, authenticate if requested, select preferences, find a record by ID, identify the next session from the clock/bookmarks, and check a version. Precomputation removes heavy generation and repeated derivation; it cannot eliminate freshness checks for changing information.

## Organizer flow: draft → prepare → preview → publish

| Step | Organizer supplies or does | Result |
| --- | --- | --- |
| Create a conference | Name, stable event ID/slug, dates, timezone, organizer/help contact | An event-specific draft; other conferences remain separate. |
| Load sessions and rooms | Structured JSON/CSV or a small form; session/room IDs, titles, times, abstracts, verified room information | Normalized records validated for references, time ranges, required fields, and duplicate IDs. Conflicts become review warnings where appropriate. |
| Prepare representations | Author short summaries and instructions; attach approved icons, photos, maps, and audio as applicable | Reusable content variants with source/version references. |
| Preview | Inspect the same fixture in each supported presentation and check critical facts | Recorded review of wording, labels, media alternatives, and factual consistency. |
| Publish | Confirm a complete reviewed version | One active conference version and an event QR/URL. |
| Amend | Edit the authoritative record and prepare affected representations | A new published version with an explicit change notice; no attendee request initiates generation. |

If preprocessing ever uses AI for draft summaries or illustrations, do it in this preparation stage, retain provenance, and require organizer review. It is unnecessary for the small demo. Do not use generated venue diagrams to assert real physical routes or facilities. Use supplied, reviewed venue material, and mark unknown accessibility information as unknown.

## Interface choices

Offer presentation choices described by what they do, not diagnosis-specific modes. These options can support some cognitive or sensory needs, but no preset is universally suitable for a neurodivergent group. Let the attendee preview, select, combine settings, reset, and switch without losing their place or bookmarks. W3C's [cognitive accessibility guidance](https://www.w3.org/TR/coga-usable/#support-a-personalized-and-familiar-interface-pattern) supports understandable content and configurable presentation; it does not validate these particular presets.

| Proposed choice | What the attendee sees | Prepared content reused |
| --- | --- | --- |
| Focus | A clear next action, fewer simultaneous cards, short descriptions, persistent change notice | Short summaries, action labels, and room/time change cards |
| Overview | A predictable chronological agenda with room/time consistently positioned and details expandable | Grouped agenda, full/short descriptions, room facts |
| Picture-led agenda | A meaningful picture sequence or picture-led cards, with short labels and exact session facts | Reviewed imagery, verified room pictures, descriptions, and consistent symbols |
| Signed agenda | User-controlled agenda videos in the chosen sign language, with equivalent text | Permitted, fluently reviewed clips linked to the exact source/version and sign language |
| Listen toggle | Explicit play/stop controls with equivalent visible text; never autoplay | Reviewed recordings and matching transcripts if strict pre-generation is selected |

Readable typography, keyboard operation, focus visibility, semantic controls, contrast, and a reduced-motion option belong in the shared interface. They should not depend on selecting a special mode. Do not automatically hide important changes, switch layouts, or infer a person's needs from behavior.

For the solo prototype, start with shared facts and selectable picture-led, signed, and accessible-text presentations. Focus/Overview are later density/layout enhancements; prepared audio is optional. Reuse components and content rather than building a separate application for every preference combination.

## What to prepare, and what must remain current

| Information | Prepare before attendee use | Runtime work still needed |
| --- | --- | --- |
| Session content | Reviewed short description, full description, labels, structured key facts | Select the requested session and representation |
| Agenda | Day/track grouping, sorting, durations, event-local absolute time labels | Determine now/next and apply bookmarks or simple filters |
| Room guidance | Approved image/map, caption, text directions, facilities and help details | Retrieve the current published room record; do not invent a route |
| Visuals | Small approved icon/photo library, optimized images, captions and alternatives | Display selected assets |
| Audio | Recording per supported message/language/version, plus transcript | Playback of the matching clip |
| Change notifications | Compute old/new field changes once at publication; produce deterministic notices | Retrieve new notices, match bookmarked session IDs, and track acknowledgment |
| Interface defaults | Small authored presets and any attendee-confirmed saved preferences | Resolve settings and let the attendee override them |

Avoid generating a complete copy of the conference for each attendee or each combination of settings. Shared content plus small preference objects controls both storage cost and inconsistency risk. Locale, timezone, and presentation language should be explicit; do not silently reinterpret an event's timezone.

**Audio decision for handoff:** App-generated browser speech synthesis is excluded. Prepared clips are an optional enhancement after the core picture-led, signed, and accessible-text journey works. Normal screen-reader speech remains user-controlled assistive technology, not application content generation. If a new change has no matching audio yet, show its current text, indicate audio is unavailable, and never play an old clip with obsolete room/time information. Audio that repeats exact times/rooms must be replaced or invalidated whenever those facts change. Do not claim an audio-equivalent update until a current clip exists.

## Publication and freshness

Proposed logical records: conference, session, room, content variant, published version, change notice, and private attendee preference. Give each event-scoped record a conference ID. If authenticated registrations are added later, keep them separate from public content and scope access by conference.

For the small SQLite prototype, store the required prepared text and published revision together. Validate the complete draft, write new records/change notices, and update the active version in one database transaction. A publishing error leaves the previous version active. Use immutable/versioned media references; prepare required media before activation or explicitly mark optional media unavailable.

Attendee flow: fetch the active version, load its content, and poll a small version/change endpoint while visible and online. If the version changes, load the matching records before replacing the visible state. Recheck when a background tab becomes active. A version-number comparison and bookmarked-session lookup are expected; repeated client-side diffing of entire schedules is avoidable.

New room/time values and the previous values should come from the prebuilt change notice. All presentations must reference the same published facts. Do not regenerate or improvise summaries when someone scans a QR code. Preserve a visible stale/last-checked state when disconnected; cached information is not a promise of current information. Immediate off-screen/background notifications remain outside the polling MVP.

An older published version may be retained for audit or recovery, but restoring an application release must not silently roll conference facts back. Republish deliberate corrections as a new version so attendees do not miss them through decreasing version numbers.

## Representation coverage and signing

Track source record/version, format, language, review status, asset location, and availability for each prepared representation. Sign-language clips must convey the actual agenda facts and be reviewed by someone fluent in the chosen language. A generic welcome clip does not complete the signed-agenda feature.

Invalidate affected recordings and signed clips when their source facts change. Never offer obsolete media as current; explicitly show unavailable representations and let the attendee choose another available format. Text fallback alone does not fulfill a signing preference. All attendee-time selection remains deterministic; no runtime translation or generation is assumed.

## Registration, sign-in, and preference mapping

A general event QR identifies the conference, not the person. Scanning it can restore settings from that device or open a simple preference preview. Offer guest access for public event information. For a private conference, access authorization must happen before returning its event bundle.

If an organizer has an authorized registration list, it can connect a registration ID to preferences the attendee voluntarily supplied. Ask directly about presentation needs, for example: “Show pictures,” “Show signing” with a language choice, “Show fewer things at once,” “Offer audio,” or “Use larger text.” Use an explicit rules table to suggest settings and show a preview. A person choosing fewer items might start in Focus; someone asking to scan the full schedule might start in Overview. Neither needs an AI classifier.

Do not map a diagnosis alone to a supposedly correct interface. If existing registration notes include challenges, obtain attendee confirmation of the actual presentation preferences; keep unrelated medical/support notes out of this app. Store only what the interface needs, explain its use, and allow correction or deletion. Do not require disclosure to use the accessible interface.

Proposed preference precedence: current explicit choice → attendee-confirmed saved profile → device defaults for guest use → accessible app default. An organizer suggestion should not silently overwrite an explicit choice. Switching modes must preserve the current session, bookmarks, and acknowledged notices.

Cross-device restoration requires authenticated identity. Verify a session and conference membership before loading a profile; knowing someone's email or scanning a public QR is not authentication. Keep profiles out of shared responses/caches, telemetry, public repositories, and demos. Provide logout/clear-local-data for shared devices. Guest use on a new device simply asks for preferences again.

For the solo demo, prefer fictional registrants with clearly labeled simulated profiles and a guest flow. Real roster import, account recovery, email sign-in, permissions, retention, and deletion are additional scope. A profile selector is a simulation, not a completed sign-in system.

## Stack and track integration plan

Keep the proposed TypeScript/React/Next.js application and SQLite. Use one codebase with organizer publication logic and attendee rendering. For six sessions, a synchronous preparation step is sufficient; a queue, background-worker service, vector database, and generative model are unnecessary. Versioned prepared text can stay in SQLite; approved fixed assets can ship with the app, while mutable uploaded assets would need durable storage.

| Integration | How it joins this workflow | Evidence / setup check |
| --- | --- | --- |
| Radar, provisional | Operate the deployment containing SQLite and prepared event content; investigate release health | Publish conference version N, deploy a new app image, inspect the release, and verify N, media references, preferences behavior, and subsequent publication still work. Persist dynamic content outside the image. |
| Gitar, if selected | Review actual implementation PRs for publication consistency and preference behavior | Review rules covering same-version facts, no generation on attendee requests, conference isolation, protected publishing, and no private roster data in bundles/logs; verify with meaningful checks. |
| Dash0, setup requested | Prepare ingestion and MCP access now; budget application publishing/version-delivery instrumentation during implementation | Track preparation failures, publication duration, and version-to-render results. See the [verified setup record](./INTEGRATION_SETUP.md); synthetic connectivity checks are not application evidence. |
| Elasticsearch | Remains deferred | This prepared-content design does not require search infrastructure. |

Proposed integration order during implementation:

1. Establish a minimal runnable container and health endpoint; if selecting Gitar, use reviewed PRs from this first slice.
2. Connect the supplied Radar environment and establish one deployment with durable SQLite storage. Capture the baseline.
3. Implement one conference draft-to-publish path and its deterministic prepared representations.
4. Implement guest URL entry, directly discoverable picture/signing previews, accessible text, and preference switching. QR and density variants are enhancements.
5. Publish a room/time change and verify factual consistency across formats, failure behavior, and persistence through replacement of the application pod.
6. Capture the Radar investigation and final attendee journey; complete accessibility checks before adding any further integration.

The [event resources](https://www.wemakedevs.org/hackathons/cnh/resources) encourage account preparation in advance. The supplied Radar environment is obtained using a kickoff code; its [starter](https://github.com/skyhook-io/cnh-starter) provides a build/deployment path. Plan around that access timing rather than assuming the event environment is already available.

## Head-start preparation and local readiness

The [published rules](https://www.wemakedevs.org/hackathons/cnh/rules) permit advance ideas, notes, sketches, and research, while requiring the main coding and design work to begin after the event starts. Treat these notes as exploration. The owner subsequently clarified the immediate request as service/tool preparation: configure Radar and Dash0 and verify readiness. Application implementation is outside this preparation step.

| Before the event | During the event |
| --- | --- |
| Verify development tools and repository access; prepare selected sponsor accounts | Implement the application and conference publication logic |
| Read starter documentation and identify deployment/storage prerequisites | Obtain the supplied environment and adapt its deployment path |
| Outline data fields, sample scenarios, preference questions, and evidence checklist | Build final event fixtures, prepare/review representations, and validate the UI |
| Identify permitted public assets and data sources | Integrate, test, investigate, and capture actual results |

Local tooling verification, corrected after the project owner supplied executable paths:

| Tool | Verified executable | Version reported outside the sandbox |
| --- | --- | --- |
| Git | `/usr/bin/git` | 2.54.0 (Apple Git-157) |
| Node.js | `/opt/homebrew/bin/node` | v25.2.1 |
| npm | `/opt/homebrew/bin/npm` | 11.6.2 |
| Docker CLI | `/usr/local/bin/docker` | 28.5.1, build e180ab8 |

The initial sandbox checks could not discover or execute the Homebrew/local tools and reported an `xcrun` error for Git. All four read-only version checks succeeded outside the sandbox. Those earlier errors were execution-environment limitations, not evidence of missing or broken host installations. npm was checked with the Homebrew and local executable directories included in PATH.

CLI availability and Docker engine connectivity are verified. Radar and Dash0 MCP queries succeeded; Dash0 synthetic ingestion/retrieval and Gitar repository enablement were checked. A local k3d development cluster is now connected to Radar, with a ready Radar pod. See the [integration readiness record](./INTEGRATION_SETUP.md) for evidence and remaining application telemetry, deployment/persistence, image-build, and CI checks. No conference application implementation was performed.

## Proposed solo scope and remaining choices

Design event-scoped records from the start, but fully populate one conference for the demo. A second small fixture can demonstrate conference isolation if time allows. A full organizer platform for many conferences and real attendee account integration are separate expansions beyond the existing single-event pitch.

Recommended demo: create/load a conference draft → preview prepared formats → publish → scan its URL → select or simulate saved preferences → switch interface → publish a room/time change → deploy an app update through the Radar workflow → verify the published content survives.

Choices to resolve before implementation:

- For the confirmed ASL scope, which permitted media source, fluent reviewer, and bounded set of agenda records can the first demo support?

1. Whether optional prepared audio fits after core completion; browser synthesis is excluded from this handoff.
2. Guest plus fictional profiles for the demo, or real registration/authentication as a funded scope change?
3. One fully populated conference with event-scoped records, or full multi-conference administration?
4. Confirm the track choices and the amount of setup intended before the event.

This workflow strengthens Radar's evidence story: successful releases must preserve both the authoritative event facts and their published representations. It also introduces publication/version consistency work, so preprocessing is not a claim that the overall project becomes effortless or that all expanded scope fits the event.
