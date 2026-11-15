import { openDb } from './db.ts';
import { pointerSchema, bundleSchema, canonical } from '../domain/contracts.ts';
import { createHash, randomUUID } from 'node:crypto';

const digest = (value: string) => createHash('sha256').update(value).digest('hex');
export function current(slug: string, path?: string) {
  const db = openDb(path);
  try {
    const row = db.prepare(`SELECT c.id as conferenceId,r.releaseNumber,r.bundleHash,r.createdAt as publishedAt
      FROM conferences c JOIN releases r ON r.conferenceId=c.id AND r.releaseNumber=c.activeRelease WHERE c.slug=?`).get(slug) as
      { conferenceId:string;releaseNumber:number;bundleHash:string;publishedAt:string } | undefined;
    if (!row) return undefined;
    return pointerSchema.parse({ schemaVersion: 1, ...row });
  } finally { db.close(); }
}
export function snapshot(slug: string, release: number, path?: string) {
  const db = openDb(path);
  try {
    const row = db.prepare(`SELECT r.bundleJson,r.bundleHash,c.id as conferenceId FROM conferences c JOIN releases r ON r.conferenceId=c.id
      WHERE c.slug=? AND r.releaseNumber=?`).get(slug, release) as { bundleJson:string;bundleHash:string;conferenceId:string } | undefined;
    if (!row || digest(row.bundleJson) !== row.bundleHash) return undefined;
    const parsed = bundleSchema.parse(JSON.parse(row.bundleJson));
    if (parsed.conference.id !== row.conferenceId || parsed.releaseNumber !== release) return undefined;
    return { bundle: parsed, requestId: randomUUID() };
  } finally { db.close(); }
}
export function asset(key: string, path?: string) {
  if (!/^[a-f0-9]{64}$/.test(key)) return undefined;
  const db = openDb(path);
  try {
    return db.prepare(`SELECT a.storageKey,a.mime,a.bytes FROM assets a
      WHERE EXISTS (SELECT 1 FROM release_assets ra JOIN conferences c ON c.id=ra.conferenceId
      WHERE c.activeRelease=ra.releaseNumber AND ra.sha256=a.sha256) AND a.sha256=? LIMIT 1`).get(key) as
      { storageKey:string;mime:string;bytes:number } | undefined;
  } finally { db.close(); }
}
export function dbOkay(path?: string) {
  const db = openDb(path);
  try { db.prepare('SELECT 1').get(); const release = db.prepare('SELECT 1 FROM releases LIMIT 1').get(); return Boolean(release); } finally { db.close(); }
}
