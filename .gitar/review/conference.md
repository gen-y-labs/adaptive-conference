# Conference application review priorities

Apply these checks to relevant implementation changes. The repository is currently in preparation; do not report missing planned features as defects in documentation-only PRs.

- Preserve authoritative session title, room, time, timezone, and published version across every presentation mode. Flag mixed or stale versions, including outdated signed videos, picture sequences, and audio.
- The core attendee API is read-only; publishing uses an operator CLI. If organizer write routes are added, require server authentication/authorization and CSRF/origin protection. Isolate conference records and reject stale publication versions; retries must be idempotent.
- Keep attendee access fast and deterministic. Flag unplanned AI/image generation or expensive content preparation on attendee requests. The handoff excludes app-generated speech synthesis; prepared audio is optional. Normal screen-reader access remains supported.
- Keep essential information available as text. Check keyboard controls, accessible names, visible focus, and change announcements that do not steal focus. Do not claim accessibility is proven by code review alone.
- Let attendees choose and switch interfaces. Do not infer diagnoses or prescribe an interface from a diagnosis. Private registration/preferences must not enter public event bundles.
- Keep credentials, attendee identities, diagnoses, private preferences, and request bodies out of telemetry. Server ingestion tokens must not reach browser bundles.
- Preserve SQLite and published content across pod replacement. Flag ephemeral database paths, destructive startup seeding, and competing writers introduced by deployment changes.
- Separate synthetic setup telemetry from application evidence. Require meaningful checks for any claimed update-delivery or persistence fix.


- Follow the [implementation handoff](../../docs/IMPLEMENTATION_HANDOFF.md) where older planning documents disagree. Do not reduce adaptation to layout changes alone.
- Signed media must match the requested sign language and reviewed source hash. Never silently substitute another language or present text fallback as completed signing support. Code review cannot certify translation quality.
- Stage immutable media before activating a release; preserve media and SQLite on durable storage across app-image rollback. Missing media must have a visible, recoverable state.
- Preference selection must be accessible before entering the agenda. Preserve attendee control, exact facts, and context across format changes; no autoplay, cropped signing, or forced text-heavy onboarding.
