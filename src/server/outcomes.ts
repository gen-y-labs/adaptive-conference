import { z } from 'zod';
import { openDb } from './db.ts';
const eventSchema = z.object({ event: z.enum(['release_rendered', 'media_ready', 'media_failed']),
  conferenceId: z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/), releaseNumber: z.number().int().positive(),
  readRequestId: z.string().uuid(), outcomeCode: z.enum(['ok', 'network', 'unsupported', 'corrupt']) }).strict();
const counts = new Map<string, { count:number; reset:number }>();
export function acceptOutcome(body: unknown, origin: string | null, appOrigin: string | undefined, ip = 'unknown') {
  if (!appOrigin || origin !== appOrigin) return false;
  const event = eventSchema.safeParse(body); if (!event.success) return false;
  const now = Date.now(); let bucket = counts.get(ip);
  if (!bucket || bucket.reset < now) {
    if(counts.size>=10_000)for(const [key,value] of counts)if(value.reset<now)counts.delete(key);
    if(counts.size>=10_000&&!counts.has(ip))return false;
    bucket = { count: 0, reset: now + 60_000 }; counts.set(ip, bucket);
  }
  if (++bucket.count > 60) return false;
  const db = openDb();
  try { return Boolean(db.prepare('SELECT 1 FROM releases WHERE conferenceId=? AND releaseNumber=?').get(event.data.conferenceId,event.data.releaseNumber)); }
  finally { db.close(); }
}
