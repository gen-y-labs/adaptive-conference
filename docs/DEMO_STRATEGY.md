# Demo theme, personas, and feature priorities

Revised after the owner's clarification · November 7, 2026 · Solo build. The [product vision](./PRODUCT_VISION.md) records the intended audience and core communication problem. Features below are proposals, not implemented or fully validated capabilities.

Implementation reference: the [handoff](./IMPLEMENTATION_HANDOFF.md) defines the three-session default, operator publishing command, exact representation contracts, and acceptance gates. No organizer dashboard is required for the initial communication proof.

## Theme and story

**One conference. Information in the way that works for you.**

The core is presenting conference information according to a person's stated challenges, communication preferences, and strengths. Picture-led and signed agendas are central examples. Focus/Overview are supporting layout choices. “Stay oriented when plans change” is a secondary reliability scenario, superseding its earlier recommendation as the main theme.

Show the same session through different selected representations: an attendee who finds words difficult chooses a picture-led agenda; an attendee who prefers signing selects a prepared signed agenda; another attendee navigates equivalent information with a screen reader. Then show that switching preferences preserves the session and facts. The value hypothesis is improved access and understanding; it needs participant validation.

## Personas and priorities

These are fictional scenarios, not diagnosis rules or interview findings. Community membership does not assign a persona or interface; people may combine preferences.

| Role | Communication preference or task | Proposed demonstration |
| --- | --- | --- |
| Core: Maya | Finds long written descriptions difficult; understands picture sequences better | Picture-led session cards, recognizable room imagery, short optional labels, and a clear next action |
| Core: Jordan | Prefers a particular sign language for understanding event information | Prepared, reviewed agenda video in that language, explicit playback, language label, and equivalent text |
| Core access check: Sam | Uses a screen reader and keyboard | Semantic agenda, useful image descriptions, predictable controls, and access to the same facts |
| Additional preference: Alex | Wants fewer simultaneous choices or the full agenda | Focus/Overview settings within the chosen communication format |
| Additional participation scenario | Prefers not to use speech | No speech requirement for entry, browsing, or preferences; typed help or communication cards are later scope |
| Supporting: Priya, organizer | Prepares equivalent information and keeps it accurate | Review and preview representations linked to the same session/version |

All seven communities named by the owner are in the intended audience; see the [community support mapping](./PRODUCT_VISION.md#intended-communities-and-proposed-support). Community-event discovery and communication preferences are separate dimensions. Do not assign special communication modes to Women in Cloud Native, Deep Roots, or Friends of Dorothy based on membership.

## Core concepts, in priority order

1. **Understandable representations:** pictures, signing, accessible text, and selected audio options communicate the same information in usable forms.
2. **Attendee control:** preview, choose, combine, change, and reset preferences; no required diagnosis disclosure.
3. **Preparation and review:** produce content before arrival, including human review of meaning and sign-language accuracy.
4. **Consistent facts and availability:** every representation has source/version references; stale or missing media is identified honestly.
5. **Reliable delivery:** representations load, choices persist as intended, and deployment changes preserve published content.

Keyboard access, semantic structure, readable resizing, contrast, and controllable playback are shared foundations. A transcript is useful alongside signing but does not establish that signing has been provided.

## Feature menu

P0 is the proposed communication proof. The signed agenda is a core product goal with an unresolved content dependency; it must not silently become an optional decoration or be claimed complete using placeholder media.

| Priority | Feature | Completion evidence |
| --- | --- | --- |
| P0 | One small fictional conference, with representation coverage stated explicitly | Authoritative sessions/rooms/timezone validate; choose the size based on reviewed content availability |
| P0 | Guest event entry and preference previews | Attendee can select picture-led, signed, or accessible text presentation and change the choice |
| P0 | Picture-led agenda for the demo fixture | Pictures help communicate the session/task; verified room details, meaningful descriptions, and exact facts are preserved |
| P0, content dependency | Signed agenda for the demo fixture | Named sign language, permitted and fluently reviewed clips conveying actual agenda facts, playback controls, and version matching |
| P0 | Accessible text and screen-reader/keyboard journey | Same information and controls remain available; manual checks and limitations recorded |
| P0 | Shared source data and prepared asset selection | No attendee-triggered generation; switching preserves the current session and any implemented bookmark state |
| P0 | Missing/stale asset behavior | No old media presented as current; availability is explained; user can choose other available formats |
| P1 | Small organizer preparation/preview/publication flow | Protected publishing checks required facts and representation coverage |
| P1 | Prepared room/time change and persistent notice | All affected formats are current or explicitly unavailable; exact changes verified |
| P1 | Focus/Overview, bookmarking, room/help details, QR convenience | Add individually once core representation checks pass |
| P2 | Prepared audio with transcript | Current recordings, explicit play/stop, version checks, and honest fallback |
| P2 | Community-event/resource discovery | Organizer-supplied links and optional interest filters; no automatic preference or identity inference |
| P2 | Typed help or prepared communication cards | A complete non-speech interaction, with delivery behavior clear |
| P3 | Real accounts/rosters, full multi-event admin, automatic translation, generated signing, AI companion, Elasticsearch | Revisit after a validated small communication journey |

## Build gates and time control

1. **Content readiness:** use the confirmed ASL scope, identify a permitted clip source and fluent reviewer, and a small set of equivalent text/picture/signed records. Missing reviewed signing is a visible blocker to the signed-demo claim, not permission to substitute an unrelated video.
2. **Complete communication journey:** guest entry → preferences → the same session in supported representations → switch without losing context. Start lightweight Gitar review and instrumentation with the first runnable slice.
3. **Failure and delivery evidence:** missing/stale media, keyboard/screen-reader checks, deployment, prepared-asset retrieval, and persistence where mutable content is used.
4. **One enhancement at a time:** organizer publication/change story, then other features that fit the remaining time.

The [published schedule](https://www.wemakedevs.org/hackathons/cnh/schedule), checked November 7, places building from 11:00 AM to the 5:30 PM submission deadline on November 9, Mountain Time, including lunch/panel activity. Confirm at kickoff. Reserve the final 90 minutes for fixes, verification, evidence, rehearsal, and submission: proposed feature freeze is 4:00 PM.

If content or implementation stalls, reduce the number of sessions and optional features before weakening the core communication claim. If reviewed signing cannot be obtained, explicitly report it as an unmet core goal and demonstrate only completed formats. Do not claim a complete product on the basis of layout switching alone.

Track candidates as `feature | user task | priority | content dependency | build/check estimate | evidence | status`. Use proposed, selected, in progress, verified, or deferred. No new application code is authorized by these planning notes.

## Sponsor evidence

| Tool | Meaningful role in this demo | Limits |
| --- | --- | --- |
| Gitar | Review selection, version/fallback logic, accessible controls, and tests | Code review cannot validate picture comprehension or signed translation quality |
| Dash0 | Investigate preparation failures, failed picture/video delivery, or stale representation rendering | Keep individual preferences, diagnoses, and community affiliation out of telemetry |
| Radar | Inspect deployment health, asset-serving configuration, and persistence through releases | A healthy pod does not prove accessible or understandable content |

Collect evidence during development. Keep sponsor explanation short enough that the communication experience remains the main demonstration.

## Proposed three-minute demo

Three minutes is a rehearsal assumption, not a confirmed official presentation limit.

| Time | Demonstration |
| --- | --- |
| 0:00–0:20 | Explain the barrier: one text-heavy or audio-only agenda does not work for everyone |
| 0:20–0:55 | Maya chooses a picture-led agenda and identifies the session/place/next action |
| 0:55–1:30 | Show the same information in a prepared signed clip, with its language and bounded coverage stated |
| 1:30–1:55 | Demonstrate accessible text/keyboard navigation and preserved context when switching |
| 1:55–2:20 | Explain preparation once and source/version consistency; show a prepared change only if completed |
| 2:20–2:45 | Brief verified Gitar, Dash0, and Radar evidence supporting delivery |
| 2:45–3:00 | State what was tested, representation coverage, and the next participant-validation step |

## Open decisions and truthful claims

ASL is confirmed. Resolve the permitted ASL video source and fluent reviewer, exact fixture coverage, and optional audio/community-discovery scope. The hackathon environment is preferred pending confirmation during the event; coding start/deadline remain undecided. A signed agenda is part of the clarified vision, but its implementation feasibility depends on actual content readiness.

Current verified results remain tool connections, synthetic telemetry, and the local Radar cluster. None establish an implemented attendee experience, accurate sign-language content, usable picture comprehension, or measured accessibility outcomes. The next validation should ask people using their chosen formats to identify the same session, time, room, and next action, and record observed limitations with consent.
