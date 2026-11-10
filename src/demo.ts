import type { Bundle } from './domain/contracts';
// Fictional Inclusive Design conference for the local kiosk demo. The picture sequences are
// simple illustrations; ASL is intentionally unavailable until permitted content is reviewed.
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
        ['People', 'Start by considering people with different ways of moving, sensing, communicating, and learning.'],
        ['Listen', 'Ask people what helps and where they meet barriers.'],
        ['Include', 'Use what you learn while making the first design choices.'],
      ] },
      { id: 'accessible-digital-services', steps: [
        ['Read', 'Use clear words and a page structure that is easy to follow.'],
        ['Test', 'Try the same task using a keyboard and assistive technology.'],
        ['Improve', 'Find a barrier and change the design to make the task easier to complete.'],
      ] },
      { id: 'welcoming-wayfinding', steps: [
        ['Notice', 'Look for visible signs and landmarks at the entrance.'],
        ['Find', 'Use clear signs and maps to choose the route to a room.'],
        ['Arrive', 'Follow the green markers to Main Hall.'],
      ] },
    ].flatMap(session => [
      { id: `${session.id}-pictures-preview`, subjectId: session.id, subjectType: 'session' as const, format: 'pictures' as const, language: 'en' as const,
        sourceHash: '0'.repeat(64), availability: 'available' as const,
        steps: session.steps.map(([shortLabel, description], i) => ({ assetHash: String(i + 1).repeat(64), shortLabel, description })) },
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
