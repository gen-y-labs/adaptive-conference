# Product vision: conference information that works for you

Owner clarification · November 7, 2026. This direction supersedes the earlier recommendation to center the product on schedule changes and Focus/Overview layouts. It records product intent, not implemented capabilities or validated user outcomes. See the revised [demo strategy](./DEMO_STRATEGY.md) for proposed build priorities.

Implementation reference: use the [design review and handoff](./IMPLEMENTATION_HANDOFF.md) for concrete contracts, selected technical defaults, readiness gates, and remaining decisions.

## Problem and idea

Conference information often assumes that everyone can comfortably read dense agendas, hear announcements, or communicate through speech. The application should present the same conference information in forms that fit a person's stated challenges, communication preferences, and strengths.

**One conference. Information in the way that works for you.**

The owner's examples are central: someone who finds words difficult to read can choose a picture-led agenda; someone who prefers sign language can access a signed agenda. Accessible text, listening, and calmer layouts offer other combinations. Focus/Overview are layout choices within this broader product, not the entire adaptation.

Ask what helps the attendee, show a preview, and let them combine or change preferences. A disclosed challenge may inform a suggestion, but the attendee confirms it. Community membership or a diagnosis must not automatically determine a format. No diagnosis is required to use the application.

## Intended communities and proposed support

The owner identified all seven communities below as the intended audience. Their linked pages establish community context; the feature mappings are our design proposals, not community endorsements or findings from interviews. People may belong to several communities and have overlapping preferences.

| Community | Proposed support to explore |
| --- | --- |
| [Deaf and Hard of Hearing](https://community.cncf.io/deaf-and-hard-of-hearing) | Prepared sign-language agenda videos in a named language, captions/transcripts for spoken media, and persistent visual notices; attendees choose their preferred combination. |
| [Blind and Visually Impaired](https://community.cncf.io/blind-and-visually-impaired/) | Screen-reader-compatible agenda and controls, meaningful image descriptions, keyboard access, adjustable text/contrast, and optional prepared audio. |
| [Stuttering and Speech Diversity](https://community.cncf.io/stuttering-and-speech-diversity/) | Complete browsing and preference selection without speaking; explore typed questions or prepared communication cards for asking for help. |
| [Women in Cloud Native](https://community.cncf.io/women-in-cloud-native/) | Optional discovery of relevant community sessions, networking opportunities, and organizer-provided support resources; no assumed accessibility preset. |
| [Deep Roots](https://community.cncf.io/deep-roots/) | Optional discovery of relevant community events, connections, and participation resources; no assumed accessibility preset. |
| [Friends of Dorothy](https://community.cncf.io/friends-of-dorothy/) | Optional discovery of community gatherings and organizer-provided support resources; community interests need not be publicly disclosed. |
| [Neurodiversity](https://community.cncf.io/neurodiversity/) | Picture-led or plain-language information, predictable navigation, fewer simultaneous choices, and control over motion, sound, and information density. |

Representation and belonging are part of the audience scope. Community discovery is distinct from communication adaptation: for example, interest in a women's community event says nothing about whether someone wants pictures, text, or signing. The Deep Roots page describes participation across backgrounds; do not invent more specific demographic criteria.

## Prepared representations, selected at access time

1. An organizer supplies authoritative sessions, times, rooms, help information, and community-event metadata.
2. Before publication, prepare and review equivalent representations: plain-language text, meaningful picture sequences with descriptions, recordings/transcripts, and sign-language videos as supported.
3. Attach each representation to its source record, content version, language, format, review status, and asset location. Distinguish a spoken/written language from a sign language.
4. On entry, the attendee previews and chooses preferences, or confirms restored preferences. Retrieve matching prepared content; do not generate pictures, speech, or signing on attendee requests.
5. Preserve selected sessions and bookmarks when switching or combining formats. Explain which representations are available rather than silently substituting a different communication mode.
6. When facts change, mark affected media as needing review. Never serve an old recording or signed video as the current agenda. Show current facts and an explicit format-availability notice; another format is not automatically an adequate substitute for every person.

One conceptual record path is `conference → session → versioned representations`. Preferences select representations and layout; they do not create different underlying schedules. Use the existing proposed Next.js/TypeScript and SQLite approach; no new AI service is required for deterministic selection.

## Picture-led and signed content quality

Picture-led information must convey the task, not merely decorate a text-heavy card. Use recognizable session/topic imagery, verified room images, consistent symbols, and clear sequences. Preserve exact factual details with labels, alternative text, and complementary formats; do not assume an abstract technical topic or exact time is self-explanatory in an icon.

Signed content needs a selected language and appropriate review. The [CNCF Deaf and Hard of Hearing page](https://community.cncf.io/deaf-and-hard-of-hearing) explicitly describes ASL, ISL, and other country-specific sign languages. Do not assume one language serves every signing attendee, or that all deaf/hard-of-hearing attendees prefer signing.

For the first demo, propose a small, clearly bounded set of prepared videos, with permission to use them and review by someone fluent in the chosen sign language. Provide user-controlled playback, a visible language label, and accompanying text. Do not present an unverified generated avatar or a string of gesture images as an accurate signed translation. Videos must actually convey the represented agenda information; a generic welcome clip does not demonstrate a signed agenda.

Reviewed video availability is an open dependency. A placeholder may demonstrate planned UI behavior but must be labeled and cannot support a claim of delivered sign-language access. Limit the fixture to content that can be reviewed, rather than claim every session or future change is translated.

## Demo and evidence

Lead with one session presented in a picture-led agenda, a signed agenda, and accessible text/screen-reader navigation. Show attendee choice and continuity. Then, if time permits, publish a prepared change to demonstrate version consistency and honest media availability.

Gitar can support review of selection/fallback logic and accessibility-related code; it cannot establish translation quality. Dash0 can help investigate content preparation, asset delivery, and rendering failures without logging sensitive preference profiles. Radar can help investigate deployment, asset availability, and persistence. These tools support delivery of the core communication experience.

## Decisions still needed

- ASL is confirmed for the first demo. Obtain a permitted source and fluent reviewer for usable ASL agenda/orientation clips.
- Finalize reviewed representation coverage: the handoff starts with three sessions/two rooms, shrinking the complete fixture if necessary.
- Prepared audio is deferred from the handoff core; choose it only as an enhancement. Screen-reader-compatible navigation remains a shared baseline.
- Which community-discovery content is supplied by the organizer and fits after the communication journey works.

Validate with participants using their chosen formats when feasible. A working media player, fictional persona, automated accessibility check, or connected sponsor account does not establish that the information is understandable or suitable for every member of a community.
