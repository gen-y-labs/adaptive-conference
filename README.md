# Adaptive Conference

Adaptive Conference presents the same event information as picture sequences, prepared sign-language content, or accessible text. Attendees choose and combine formats without an account or diagnosis. The project is at its first implementation checkpoint: the application, publishing path, and local preview work; approved picture packages and human-reviewed ASL media are still needed before a public release.

## Run the local preview

Use the pinned Node 24.22.2 runtime and the committed npm lockfile:

```sh
nvm install
npm ci
npm run dev
```

Open <http://127.0.0.1:3000> or `/kiosk` for the entrance touchscreen. The start screen is a transparent sample-match preview: choose Maya, Jordan, or Sam to see the entire attendee screen adapt, or continue as a general visitor. It does not access a camera or identify visitors. A live installation would need an opted-in identity match connected to visitor-saved preferences; it must never infer accessibility needs from a face. The general agenda is `/kiosk/attendee?format=text`; focused picture and ASL-first experiences appear in the Maya and Jordan sample journeys. `/accessibility` remains a minimal text page. `/demo` includes the organizer's package review. The local kiosk preview uses generated event and session imagery; the content package remains pending review, and ASL video remains unavailable until permitted media receives fluent human review.

To preview a content package through the same attendee UI, start the loopback-only server:

```sh
npm run content -- preview content/inclusive-design-summit
```

The preview command validates the package, binds Next.js to `127.0.0.1`, and opens `/preview/<event-slug>`. Its data file is temporary and removed when the process exits. It cannot create or activate a public release.

## Prepare and publish reviewed content

An operator package contains a validated `manifest.json` and only its referenced, local media files. The schema records source hashes, status, language, permission references, provenance, and private reviewer evidence. Private permission and reviewer fields are kept out of public releases.

```sh
npm run content -- validate content/inclusive-design-summit --allow-incomplete
npm run content -- preview content/inclusive-design-summit
npm run db:migrate
npm run content -- publish content/inclusive-design-summit --expected 0 --request-id <UUID>
```

The current sample package is intentionally incomplete. Complete validation and initial publication will fail until pictures, permitted ASL orientation/session videos, and matching fluent human review are supplied. Incomplete coverage can be acknowledged only for a later update; it cannot bypass the initial-release gate. Use a fresh UUID for each publication attempt and reuse the same UUID only when retrying identical input.

Representations reference exact session, room, time-zone, and event facts through deterministic source hashes. Publication verifies asset bytes and review references, stages content-addressed media, then activates the immutable SQLite release in one compare-and-swap transaction. Attendee routes are read-only. The active release is never silently changed by starting or rebuilding the app.

Relevant paths: [manifest contract](src/domain/contracts.ts), [package validation](src/server/validation.ts), [publisher](src/server/publisher.ts), and [operator CLI](scripts/content.ts).

## Tests and production build

```sh
npm run typecheck
npm test
npx playwright install chromium
npm run test:browser
npm run build
npm audit --omit=dev
```

The focused unit/integration suite exercises format selection, missing-review rejection, SQLite publication idempotency/conflict/rollback, and byte-range validation. The Playwright suite covers guest previews, preference switching, and an axe check. `npm run test:container` builds the Linux ARM64 image and exercises SQLite, snapshot hashes, HEAD/range responses, replacement, and backup restore using synthetic test-only media. That synthetic file is not a decodable video or actual ASL content. Safari/VoiceOver, content equivalence, real encoded-media seeking, event-update race testing, and event-cluster deployment remain unverified. See [implementation status and acceptance register](docs/IMPLEMENTATION_STATUS.md).

## Container and persistent storage

```sh
docker build -t adaptive-conference:local .
docker volume create adaptive-conference-data
docker run --rm -p 3000:3000 -v adaptive-conference-data:/data adaptive-conference:local
```

The image pins Node 24.22.2 on Debian, builds native `better-sqlite3` inside Linux, and runs as an unprivileged user. Persist `/data` across container replacement. Initialize with `node scripts/content.ts migrate`, then run the CLI against a reviewed package before marking readiness successful. Readiness intentionally stays at 503 until a published release is readable.

The example Kubernetes manifest in [ops/kubernetes/app.yaml](ops/kubernetes/app.yaml) uses one replica, a durable PVC, and `Recreate`. Replace its sample image and URL with the approved environment values. Confirm the hackathon cluster, namespace, URL, storage behavior, and access-expiry date before deployment; local Radar/k3d is for development. No live deployment or cluster replacement has been performed.

Back up the database with SQLite's online backup API and copy immutable media together:

```sh
DATABASE_PATH=data/conference.sqlite ASSET_DIR=data/assets tools/backup.sh /safe/location/conference-backup
```

Restore both the backup database and `assets/` into an isolated new `/data`, then verify `/api/health/ready`, the current pointer, every referenced asset hash, and media retrieval before switching traffic. Do not copy only a live SQLite file or restore an older event release as part of an application rollback.

## Observability and current content status

Server OpenTelemetry is optional and configured only with server-side `DASH0_OTLP_HTTP_ENDPOINT`, `DASH0_DATASET`, and `DASH0_INGESTION_TOKEN` variables. The authenticated token is never prefixed `NEXT_PUBLIC_`. When telemetry is absent or unreachable, event reads and playback still work. The same-origin client-events route allows only small release-rendered/media-ready/media-failed outcomes and refuses requests without a matching `APP_ORIGIN`.

The included [Inclusive Design Summit manifest](content/inclusive-design-summit/manifest.json) declares three fictional sessions in two rooms. Generated pictures are wired into the local kiosk demo but remain awaiting package review; ASL sessions and orientation await permitted media and fluent review. There is no approved public content release. Missing media-source permission, fluent ASL reviewer, event deployment details, coding deadline, manual screen-reader review, and participant validation remain outstanding. Do not claim all seven communities' needs or real-user comprehension are validated.
