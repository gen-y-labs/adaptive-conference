import { createHash } from 'node:crypto';
import { readFileSync, realpathSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { canonical, manifestSchema, sourceFacts, type Manifest } from '../domain/contracts.ts';

export const sha256 = (bytes: string | Uint8Array) => createHash('sha256').update(bytes).digest('hex');
export const sourceHash = (m: Pick<Manifest, 'conference' | 'rooms' | 'sessions'>, subjectId: string) => sha256(canonical(sourceFacts(m, subjectId)));
export const assetHashes = (r: Manifest['representations'][number]) => r.format === 'pictures' ? r.steps.map(s => s.assetHash) : r.assetHash ? [r.assetHash] : [];
export function coverage(m: Manifest) {
  return [m.conference.id, ...m.sessions.map(s => s.id)].flatMap(subjectId =>
    (subjectId === m.conference.id ? ['sign'] as const : ['pictures', 'sign'] as const).map(format => ({
      subjectId, format, language: format === 'sign' ? 'ase' as const : 'en' as const,
      availability: m.representations.find(r => r.subjectId === subjectId && r.format === format)?.availability ?? 'not_prepared' as const,
    })));
}
export function mimeOf(b: Buffer): string | undefined {
  if (b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'image/png';
  if (b[0] === 255 && b[1] === 216 && b[2] === 255) return 'image/jpeg';
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (b.toString('ascii', 4, 8) === 'ftyp' && ['isom', 'iso2', 'mp41', 'mp42', 'avc1', 'M4V '].includes(b.toString('ascii', 8, 12))) return 'video/mp4';
}
export function readAsset(root: string, asset: Manifest['assets'][number]) {
  if (asset.path.split(/[\\/]/).includes('..') || asset.path.startsWith('/') || asset.path.includes('://')) throw new Error(`Asset ${asset.sha256}: local package path required`);
  const base = realpathSync(root), path = realpathSync(resolve(base, asset.path));
  if (!path.startsWith(base + sep) || !statSync(path).isFile()) throw new Error(`Asset ${asset.sha256}: path escapes package or is not a regular file`);
  const max = asset.mime === 'video/mp4' ? 25 * 1024 * 1024 : 2 * 1024 * 1024;
  if (statSync(path).size !== asset.bytes || asset.bytes > max) throw new Error(`Asset ${asset.sha256}: invalid size or limit exceeded`);
  const bytes = readFileSync(path);
  if (sha256(bytes) !== asset.sha256 || mimeOf(bytes) !== asset.mime) throw new Error(`Asset ${asset.sha256}: hash or MIME mismatch`);
  return bytes;
}
export function validatePackage(root: string, requireComplete = true) {
  const m = manifestSchema.parse(JSON.parse(readFileSync(resolve(root, 'manifest.json'), 'utf8')));
  const errors: string[] = [];
  const unique = (values: string[], label: string) => { if (new Set(values).size !== values.length) errors.push(`${label}: duplicate identifiers`); };
  unique([m.conference.id, ...m.sessions.map(s => s.id), ...m.rooms.map(r => r.id)], 'subjects');
  unique(m.representations.map(r => r.id), 'representations');
  unique(m.representations.map(r => `${r.subjectId}/${r.format}/${r.language}`), 'representations by subject/format/language');
  unique(m.assets.map(a => a.sha256), 'assets');
  unique(m.reviews.map(r => r.representationId), 'reviews');
  for (const s of m.sessions) {
    if (!m.rooms.some(r => r.id === s.roomId)) errors.push(`${s.id}: unknown room ${s.roomId}`);
    if (Date.parse(s.end) <= Date.parse(s.start)) errors.push(`${s.id}: end must follow start`);
    for (const time of [s.start, s.end]) {
      if (new Intl.DateTimeFormat('en-CA', { timeZone: m.conference.timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(time)) !== m.conference.date) errors.push(`${s.id}: time is outside event date`);
    }
  }
  for (const r of m.representations) {
    if (r.subjectType === 'session' ? !m.sessions.some(s => s.id === r.subjectId) : r.subjectId !== m.conference.id) errors.push(`${r.id}: subject is outside this event`);
    if (r.sourceHash !== sourceHash(m, r.subjectId)) errors.push(`${r.id}: stale source hash; review current facts`);
    const hashes = assetHashes(r);
    if (r.availability === 'available') {
      if (!hashes.length) errors.push(`${r.id}: available content needs assets`);
      const review = m.reviews.find(v => v.representationId === r.id);
      if (!review || review.sourceHash !== r.sourceHash || (r.format === 'sign' && review.fluentSignLanguage !== r.language)) errors.push(`${r.id}: missing matching human review`);
    }
    for (const h of hashes) {
      const a = m.assets.find(a => a.sha256 === h);
      if (!a || (r.format === 'sign' ? a.mime !== 'video/mp4' : !a.mime.startsWith('image/'))) errors.push(`${r.id}: missing asset or wrong format ${h}`);
    }
  }
  if (m.assets.reduce((n, a) => n + a.bytes, 0) > 150 * 1024 * 1024) errors.push('Package exceeds 150 MB');
  for (const a of m.assets) try { readAsset(root, a); } catch (e) { errors.push((e as Error).message); }
  const report = coverage(m);
  if (requireComplete) for (const c of report) if (c.availability !== 'available') errors.push(`${c.subjectId}/${c.format}/${c.language}: required coverage is ${c.availability}`);
  if (errors.length) throw new Error(errors.join('\n'));
  return { manifest: m, coverage: report };
}
