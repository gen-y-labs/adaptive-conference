import type { Bundle } from './domain/contracts';
// Fictional Inclusive Design conference for the local kiosk demo. Picture artwork is shown as
// generated local-preview content; the package representations remain awaiting review.
export const demo: Bundle = {
  schemaVersion: 1, canonicalizationVersion: 1, releaseNumber: 1, publishedAt: '2026-11-09T16:00:00.000Z', changes: [],
  conference: { id: 'inclusive-design-summit', slug: 'inclusive-design-summit', title: 'Inclusive Design Summit',
    timezone: 'America/Denver', date: '2026-11-10', help: 'Ask the welcome desk for help finding a room or getting event information.',
    writtenLanguages: ['en'], signLanguages: ['ase'] },
  rooms: [
    { id: 'main-hall', name: 'Main Hall', guidance: 'Enter through the north doors and follow the wide green floor markers to Main Hall.' },
    { id: 'workshop-studio', name: 'Workshop Studio', guidance: 'From the welcome desk, follow the blue signs past Main Hall to the Workshop Studio.' },
  ],
  sessions: [
    { id: 'people-first-design', title: 'Start with the people: an inclusive design foundation', start: '2026-11-10T16:00:00.000Z',
      end: '2026-11-10T16:45:00.000Z', roomId: 'main-hall',
      summary: 'Explore how to notice barriers early, learn from people with different experiences, and make access part of the first design decisions.',
      nextAction: 'Follow the green floor markers to Main Hall before 9:00 AM.' },
    { id: 'accessible-digital-services', title: 'Make digital services usable by more people', start: '2026-11-10T17:30:00.000Z',
      end: '2026-11-10T18:15:00.000Z', roomId: 'workshop-studio',
      summary: 'Walk through practical ways to make content clearer, support keyboard use, and check common tasks with assistive technology.',
      nextAction: 'Follow the blue signs to Workshop Studio before 10:30 AM.' },
    { id: 'welcoming-wayfinding', title: 'Wayfinding that welcomes everyone', start: '2026-11-10T19:00:00.000Z',
      end: '2026-11-10T19:45:00.000Z', roomId: 'main-hall',
      summary: 'Look at signs, maps, landmarks, and room information that help more people find their next step at an event.',
      nextAction: 'Follow the green floor markers to Main Hall before 12:00 PM.' },
  ],
  representations: [
    ...[
      { id: 'people-first-design', steps: [
        ['Plan with people', 'A group plans together around a table. A green floor path points toward Main Hall.'],
      ] },
      { id: 'accessible-digital-services', steps: [
        ['Try accessible digital tasks', 'A person uses a computer and keyboard at a workstation, then follows blue arrows toward Workshop Studio.'],
      ] },
      { id: 'welcoming-wayfinding', steps: [
        ['Find the next place', 'Two people consult a map, and green floor arrows lead toward Main Hall.'],
      ] },
    ].flatMap(session => [
      { id: `${session.id}-pictures-preview`, subjectId: session.id, subjectType: 'session' as const, format: 'pictures' as const, language: 'en' as const,
        sourceHash: '0'.repeat(64), availability: 'available' as const,
        steps: session.steps.map(([shortLabel, description]) => ({
          assetHash: session.id === 'people-first-design'
            ? 'e21ae3c2135d7c260fe09d1e228944279f7060b258def95367154ffa27fbbb6d'
            : session.id === 'accessible-digital-services'
              ? '48e73b071f4dd442893b7d2f8ec9ba5f26c6bf4afbd6d0972c0a309a745200f1'
              : '8f7f09b43ebbc0b11bc16c09bc50fd16e0361864e5a0ab00ac04cdf6fe96aaba',
          shortLabel, description,
        })) },
      { id: `${session.id}-sign-preview`, subjectId: session.id, subjectType: 'session' as const, format: 'sign' as const, language: 'ase' as const,
        sourceHash: '0'.repeat(64), availability: 'awaiting_review' as const,
        script: 'Permitted American Sign Language content and fluent review are not yet available.' },
    ]),
  ],
  coverage: [
    ...['people-first-design', 'accessible-digital-services', 'welcoming-wayfinding'].flatMap(subjectId => [
      { subjectId, format: 'pictures' as const, language: 'en' as const, availability: 'available' as const },
      { subjectId, format: 'sign' as const, language: 'ase' as const, availability: 'awaiting_review' as const },
    ]),
    { subjectId: 'inclusive-design-summit', format: 'sign', language: 'ase', availability: 'awaiting_review' },
  ],
};
