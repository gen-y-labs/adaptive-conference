# Implementation status

Checkpoint recorded November 9, 2026. Engineering work has started against the [implementation handoff](./IMPLEMENTATION_HANDOFF.md). Tests and build are local evidence only; no event deployment, public release, real signed clip, or participant validation has occurred.

## Current state

The App Router application presents guest previews, selectable text/picture/ASL preferences, a screen-reader-readable agenda, device-local opt-in settings, error/coverage messages, and an immutable release read model. The operator package validator, SQLite migrations, asset staging, version-checked publisher, read API, byte-range media route, freshness polling, limited telemetry endpoint, container, and persistent-volume manifest are implemented.

The demo fixture is the fictional Inclusive Design Summit with three topic-relevant sessions and two rooms. `/kiosk` is an entrance screen with a transparent sample-match flow for Maya, Jordan, and Sam, plus a general visitor entry. The demo does not access a camera or identify visitors; a live installation needs an opted-in identity service connected to visitor-saved preferences, and must not infer accessibility needs from appearance. The attendee's entire visual presentation changes with the selected sample profile. `/accessibility` remains a minimal text-first agenda with a session selector and help. Picture sequences are local illustrations rather than independently reviewed content. The operator manifest records pictures as not prepared and ASL orientation/session content as awaiting review. A complete initial release cannot be published until permitted content has the required review.

## Acceptance register

| ID | Status | Evidence and limits |
| --- | --- | --- |
| A01 | Partial | `npm test` covers canonical hashing, package coverage and missing-review rejection through publication. Detailed negative cases for bad times, cross-event IDs, unsupported uploads, and all actionable item errors are incomplete. |
| A02 | Partial | Unit-tested selection preserves an explicitly selected ASL language and reports awaiting review. The full format/language/missing/stale matrix is not yet covered. |
| A03 | Partial | SQLite tests cover one immutable publish, idempotent retry, expected-version conflict, changed-input request-ID rejection, and an injected pre-activation rollback. Actual parallel writers and post-staging process termination have not been exercised. |
| A04 | Not run | Client version/hash/snapshot checks reject stale or mismatched responses; delayed-response browser race test remains to be added. |
| A05 | Partial | Parser and production ARM64 container checks cover HEAD length, hash-checked asset delivery, and a byte-range response. The video fixture is only synthetic bytes: real encoded playback/seeking, codec support, and obsolete-media behavior remain blocked on a permitted clip. |
| A06 | Blocked | No ASL content source/usage permission/fluent reviewer or reviewed picture sequence. Synthetic test metadata is not content review. |
| A07 | Partial | Playwright covers the sample-match screen, distinct attendee views, the minimal accessibility view, organizer status, preference reset, and blocked storage. Axe reports no WCAG 2.1 A/AA violations in the tested preview. Manual keyboard walkthrough and Safari/VoiceOver remain unperformed. |
| A08 | Partial | Axe/contrast check passes for the tested screen; responsive CSS, text alternatives, visible focus and reduced-motion rules are present. 200% zoom, narrow-device visual inspection, signing-space, and manual contrast checks are pending. |
| A09 | Partial | Browser tests cover opt-in preference storage, reset, and blocked-storage operation; settings are schema-checked and scoped by event. Production browser-secret scan remains pending. |
| A10 | Partial | Polling, no-store reads, hash/version checks, stale labeling, and asset failure states are implemented. Offline recovery and delayed/racing update behavior remain unverified in a browser. |
| A11 | Partial | Linux ARM64 production container test passes Node/SQLite use, snapshot hash, HEAD/range media responses, container restart, and isolated SQLite-plus-media backup restore. Kubernetes/event-cluster replacement and durable-volume semantics remain untested. |
| A12 | Partial | Dash0 OTLP initialization and bounded outcome endpoint are wired. No application telemetry has yet been observed in Dash0, Gitar has not reviewed a PR, and Radar has not inspected an application deployment. |

## Reproducible local evidence

These checks have passed on Node 24.22.2 on the local macOS ARM64 environment:

- `npm run check` — typecheck, eight tests, and the Next.js production build passed
- `npm run test:browser -- --workers=1` — seven Playwright tests passed, including the sample-match screen, distinct kiosk views, minimal accessibility view, organizer agenda, axe, and blocked-storage flow
- `npm run test:container` — ARM64 Linux image, synthetic content publish, SQLite reads, media HEAD/range/hash, replacement, and backup restore all passed
- `npm audit --omit=dev` — zero production dependency findings
- `npm run content -- validate content/inclusive-design-summit --allow-incomplete` — three sessions/two rooms, picture states `not_prepared`, and ASL orientation/session states `awaiting_review`

Automated container media checks use test-only files with a valid declared MIME signature, not an encoded/video-playable clip or a human-reviewed ASL representation. No content release was published outside a temporary smoke-test volume.

## Remaining owner and content inputs

- A source of ASL orientation and agenda videos with permission to use them.
- A fluent ASL reviewer and review of each exact source hash.
- Permitted factual imagery/illustrations and review of what each sequence communicates; shrink or expand the fixture only to match fully reviewed coverage.
- Event-day confirmation and concrete hackathon cluster, namespace, storage, URL, and expiry details.
- Coding deadline remains unspecified. No participant comprehension/experience validation is claimed.

The ASL choice remains settled. The app must not publish a complete initial release or represent the text fallback as signing support until the required content inputs are present.
