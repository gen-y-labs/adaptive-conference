import { NextResponse } from 'next/server';
import { current } from '@/server/read';
import { observed } from '@/server/telemetry';
export const runtime = 'nodejs'; export const dynamic = 'force-dynamic';
export async function GET(_: Request, { params }: { params: Promise<{slug:string}> }) {
  return observed('release.read', async () => {
    try { const { slug } = await params, pointer = current(slug);
      return pointer ? NextResponse.json(pointer, { headers: { 'Cache-Control':'no-store', 'X-Request-Id': crypto.randomUUID() } }) :
        NextResponse.json({ error:{ code:'not_found',message:'No published event was found.',requestId:crypto.randomUUID() } }, { status:404,headers:{'Cache-Control':'no-store'} });
    } catch { return NextResponse.json({ error:{code:'unavailable',message:'Event data is not available. Try again.',requestId:crypto.randomUUID()} },{status:503,headers:{'Cache-Control':'no-store'}}); }
  });
}
