import { randomUUID } from 'node:crypto';
import { closeSync, existsSync, fsyncSync, linkSync, mkdirSync, openSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { bundleSchema, canonical, type Bundle } from '../domain/contracts.ts';
import { openDb, paths } from './db.ts';
import { assetHashes, readAsset, sha256, validatePackage } from './validation.ts';

export function changes(previous: Bundle | undefined, next: Bundle): Bundle['changes'] {
  if (!previous) return [];
  const result: Bundle['changes'] = [];
  for (const [before, after] of [[previous.sessions, next.sessions], [previous.rooms, next.rooms], [[previous.conference], [next.conference]]] as const) {
    for (const key of new Set([...before, ...after].map(s => s.id))) {
      const old = before.find(s => s.id === key), value = after.find(s => s.id === key);
      for (const field of new Set([...Object.keys(old ?? {}), ...Object.keys(value ?? {})])) {
        const a = (old as Record<string, unknown> | undefined)?.[field] ?? null;
        const b = (value as Record<string, unknown> | undefined)?.[field] ?? null;
        if (canonical(a) !== canonical(b)) result.push({ subjectId: key, field, before: a, after: b });
      }
    }
  }
  return result;
}
export function publicBundle(root: string, releaseNumber = 1): Bundle {
  const { manifest: m, coverage } = validatePackage(root, false);
  const { assets: _assets, reviews: _reviews, ...publicFields } = m;
  // Incomplete representations may reference private drafts: do not expose those media hashes.
  publicFields.representations = publicFields.representations.map(r => r.availability === 'available' ? r :
    r.format === 'pictures' ? { ...r, steps: [] } : { ...r, assetHash: undefined });
  return bundleSchema.parse({ ...publicFields, releaseNumber, publishedAt: new Date().toISOString(), coverage, changes: [] });
}
export function publish(root: string, expected: number, requestId: string, acknowledgeReduced = false,
  config = paths(), fault?: (point: string) => void) {
  if (!Number.isSafeInteger(expected) || expected < 0 || !/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(requestId)) throw new Error('Expected a nonnegative version and UUID request ID');
  const { manifest: m } = validatePackage(root, expected === 0 || !acknowledgeReduced);
  const inputHash = sha256(canonical({ manifest: m, expected, acknowledgeReduced }));
  mkdirSync(config.assets, { recursive: true });
  const used = new Set(m.representations.filter(r => r.availability === 'available').flatMap(assetHashes));
  const assets = m.assets.filter(a => used.has(a.sha256));
  for (const a of assets) {
    const target = join(config.assets, a.sha256);
    if (!existsSync(target)) {
      const temp = join(config.assets, `.${randomUUID()}.tmp`);
      try {
        const fd = openSync(temp, 'wx', 0o644);
        try { writeFileSync(fd, readAsset(root, a)); fsyncSync(fd); } finally { closeSync(fd); }
        // A hard link atomically installs a new inode without overwriting a racing publisher.
        try { linkSync(temp, target); } catch (e) { if ((e as NodeJS.ErrnoException).code !== 'EEXIST') throw e; }
      } finally { if (existsSync(temp)) unlinkSync(temp); }
    }
    if (sha256(readFileSync(target)) !== a.sha256) throw new Error(`Stored asset ${a.sha256} is corrupt`);
  }
  const directory = openSync(config.assets, 'r'); try { fsyncSync(directory); } finally { closeSync(directory); }
  fault?.('after-staging');
  const db = openDb(config.database);
  try {
    return db.transaction(() => {
      const duplicate = db.prepare('SELECT inputHash,releaseNumber FROM publication_requests WHERE conferenceId=? AND requestId=?').get(m.conference.id, requestId) as { inputHash: string; releaseNumber: number } | undefined;
      if (duplicate) { if (duplicate.inputHash !== inputHash) throw new Error('Request ID reused with different input'); return duplicate.releaseNumber; }
      const event = db.prepare('SELECT slug,activeRelease FROM conferences WHERE id=?').get(m.conference.id) as { slug: string; activeRelease: number } | undefined;
      if (event && event.slug !== m.conference.slug) throw new Error('Event slug is immutable');
      if ((event?.activeRelease ?? 0) !== expected) throw new Error('Publication conflict: expected version does not match active release');
      const previous = event?.activeRelease ? db.prepare('SELECT bundleJson FROM releases WHERE conferenceId=? AND releaseNumber=?').get(m.conference.id, expected) as { bundleJson: string } : undefined;
      const bundle = publicBundle(root, expected + 1);
      // Revalidation during staging must not activate a package changed underneath this command.
      if (sha256(canonical({ manifest: validatePackage(root, expected === 0 || !acknowledgeReduced).manifest, expected, acknowledgeReduced })) !== inputHash) throw new Error('Package changed during publication');
      bundle.changes = changes(previous ? bundleSchema.parse(JSON.parse(previous.bundleJson)) : undefined, bundle);
      db.prepare('INSERT OR IGNORE INTO conferences(id,slug) VALUES(?,?)').run(m.conference.id, m.conference.slug);
      const json = canonical(bundle);
      db.prepare('INSERT INTO releases VALUES(?,?,?,?,?,?)').run(m.conference.id, expected + 1, 1, bundle.publishedAt, json, sha256(json));
      for (const a of assets) {
        if (sha256(readFileSync(join(config.assets, a.sha256))) !== a.sha256) throw new Error(`Asset ${a.sha256} missing or corrupt before activation`);
        db.prepare('INSERT OR IGNORE INTO assets VALUES(?,?,?,?)').run(a.sha256, a.mime, a.bytes, a.sha256);
        db.prepare('INSERT INTO release_assets VALUES(?,?,?)').run(m.conference.id, expected + 1, a.sha256);
      }
      fault?.('before-activation');
      db.prepare('UPDATE conferences SET activeRelease=? WHERE id=?').run(expected + 1, m.conference.id);
      db.prepare('INSERT INTO publication_requests VALUES(?,?,?,?)').run(m.conference.id, requestId, inputHash, expected + 1);
      return expected + 1;
    }).immediate();
  } finally { db.close(); }
}
