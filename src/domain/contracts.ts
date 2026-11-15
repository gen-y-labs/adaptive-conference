import { z } from 'zod';

export const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/);
export const hash = z.string().regex(/^[a-f0-9]{64}$/);
const text = z.string().trim().min(1).max(4000);
const instant = z.string().datetime({ offset: true }).transform(v => new Date(v).toISOString());
export const conferenceSchema = z.object({
  id, slug: id, title: text, timezone: z.string().refine(v => {
    try { new Intl.DateTimeFormat('en', { timeZone: v }); return true; } catch { return false; }
  }, 'Expected an IANA timezone'), date: z.string().date(), help: text,
  writtenLanguages: z.array(z.literal('en')).length(1), signLanguages: z.array(z.literal('ase')).length(1),
}).strict();
export const roomSchema = z.object({ id, name: text, guidance: text }).strict();
export const sessionSchema = z.object({ id, title: text, start: instant, end: instant, roomId: id, summary: text, nextAction: text }).strict();
const common = { id, subjectId: id, subjectType: z.enum(['session', 'orientation']), sourceHash: hash,
  availability: z.enum(['available', 'not_prepared', 'awaiting_review']) };
export const representationSchema = z.discriminatedUnion('format', [
  z.object({ ...common, format: z.literal('pictures'), language: z.literal('en'),
    steps: z.array(z.object({ assetHash: hash, shortLabel: text, description: text }).strict()).max(8) }).strict(),
  z.object({ ...common, format: z.literal('sign'), language: z.literal('ase'), assetHash: hash.optional(), script: text }).strict(),
]);
export const assetSchema = z.object({ sha256: hash, path: z.string().min(1).max(250),
  mime: z.enum(['image/png', 'image/jpeg', 'image/webp', 'video/mp4']), bytes: z.number().int().positive(),
  permissionRef: text, provenance: text }).strict();
export const reviewSchema = z.object({ representationId: id, sourceHash: hash, reviewerRef: text,
  reviewedAt: instant, fluentSignLanguage: z.literal('ase').optional() }).strict();
export const manifestSchema = z.object({
  schemaVersion: z.literal(1), canonicalizationVersion: z.literal(1),
  conference: conferenceSchema, rooms: z.array(roomSchema).min(1).max(2),
  sessions: z.array(sessionSchema).min(1).max(3), representations: z.array(representationSchema).max(32),
  assets: z.array(assetSchema).max(64), reviews: z.array(reviewSchema).max(32),
}).strict();
export const coverageSchema = z.object({ subjectId: id, format: z.enum(['pictures', 'sign']),
  language: z.enum(['en', 'ase']), availability: z.enum(['available', 'not_prepared', 'awaiting_review']) }).strict();
export const bundleSchema = manifestSchema.omit({ assets: true, reviews: true }).extend({
  releaseNumber: z.number().int().positive(), publishedAt: z.string().datetime(),
  coverage: z.array(coverageSchema), changes: z.array(z.object({ subjectId: id, field: text, before: z.unknown(), after: z.unknown() }).strict()),
}).strict();
export const pointerSchema = z.object({ schemaVersion: z.literal(1), conferenceId: id,
  releaseNumber: z.number().int().positive(), bundleHash: hash, publishedAt: z.string().datetime() }).strict();
export const preferencesSchema = z.object({ schemaVersion: z.literal(1), primaryFormat: z.enum(['text', 'pictures', 'sign']),
  showPicturesAlongside: z.boolean(), signLanguage: z.literal('ase').nullable(), writtenLanguage: z.literal('en'),
  density: z.enum(['standard', 'focus']), offerPreparedAudio: z.literal(false) }).strict();
export type Manifest = z.infer<typeof manifestSchema>;
export type Bundle = z.infer<typeof bundleSchema>;
export type Representation = z.infer<typeof representationSchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
export const defaultPreferences: Preferences = { schemaVersion: 1, primaryFormat: 'text', showPicturesAlongside: false,
  signLanguage: null, writtenLanguage: 'en', density: 'standard', offerPreparedAudio: false };

export function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value !== null && typeof value === 'object') return '{' + Object.entries(value).filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => JSON.stringify(k) + ':' + canonical(v)).join(',') + '}';
  return JSON.stringify(value) ?? 'null';
}

// Shared dependency definition: an orientation can describe the entire agenda.
export function sourceFacts(m: Pick<Manifest, 'conference' | 'rooms' | 'sessions'>, subjectId: string) {
  const session = m.sessions.find(s => s.id === subjectId);
  return { canonicalizationVersion: 1, conference: m.conference,
    ...(session ? { session, room: m.rooms.find(r => r.id === session.roomId) } : { rooms: m.rooms, sessions: m.sessions }) };
}

export function selectRepresentations(bundle: Bundle, subjectId: string, p: Preferences) {
  const formats: ('pictures' | 'sign')[] = p.primaryFormat === 'sign' ? ['sign'] : [];
  if (p.primaryFormat === 'pictures' || p.showPicturesAlongside) formats.push('pictures');
  return formats.map(format => {
    if (format === 'sign' && p.signLanguage !== 'ase') return { format, reason: 'Choose American Sign Language (ASL) to view prepared signing.', representation: undefined };
    const rep = bundle.representations.find(r => r.subjectId === subjectId && r.format === format && r.language === (format === 'sign' ? p.signLanguage : p.writtenLanguage));
    const reason = !rep || rep.availability === 'not_prepared' ? `${format === 'sign' ? 'ASL signing' : 'Pictures'} not prepared for this item.`
      : rep.availability === 'awaiting_review' ? `${format === 'sign' ? 'ASL signing' : 'Pictures'} awaiting human review.` : undefined;
    return { format, reason, representation: reason ? undefined : rep };
  });
}
