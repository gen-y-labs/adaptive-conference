import { createReadStream,readFileSync } from 'node:fs';import { stat } from 'node:fs/promises';import { Readable } from 'node:stream';import { createHash } from 'node:crypto';import { resolve,join } from 'node:path';import { NextRequest,NextResponse } from 'next/server';import { asset } from '@/server/read';import { parseRange } from '@/server/range';import { paths } from '@/server/db';import { observed } from '@/server/telemetry';import { manifestSchema } from '@/domain/contracts';import { readAsset } from '@/server/validation';
export const runtime='nodejs';export const dynamic='force-dynamic';
async function serve(req:NextRequest,hash:string,head:boolean){return observed('media.delivery',async()=>{
 try{const previewRoot=process.env.PREVIEW_PACKAGE;let previewBytes:Buffer|undefined;
  let a=previewRoot?undefined:asset(hash);
  if(previewRoot){const root=resolve(previewRoot),manifest=manifestSchema.parse(JSON.parse(readFileSync(resolve(root,'manifest.json'),'utf8')));
   const used=new Set(manifest.representations.filter(r=>r.availability==='available').flatMap(r=>r.format==='pictures'?r.steps.map(s=>s.assetHash):r.assetHash?[r.assetHash]:[]));
   const item=manifest.assets.find(v=>v.sha256===hash&&used.has(hash));if(item){previewBytes=readAsset(root,item);a={storageKey:item.path,mime:item.mime,bytes:item.bytes};}}
  if(!a)return new NextResponse(null,{status:404,headers:{'Cache-Control':'no-store'}});
  if(previewBytes){const range=parseRange(req.headers.get('range'),previewBytes.length);if(range==='invalid')return new NextResponse(null,{status:416,headers:{'Content-Range':`bytes */${previewBytes.length}`,'Cache-Control':'no-store'}});
   const start=range?.start??0,end=range?.end??previewBytes.length-1;const headers:Record<string,string>={'Content-Type':a.mime,'Content-Length':String(end-start+1),'Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff','Cache-Control':'no-store',...(range?{'Content-Range':`bytes ${start}-${end}/${previewBytes.length}`}:{})};
   return new NextResponse(head?null:new Uint8Array(previewBytes.subarray(start,end+1)),{status:range?206:200,headers});}
  const file=join(paths().assets,a.storageKey), st=await stat(file);if(!st.isFile()||st.size!==a.bytes)return new NextResponse(null,{status:404,headers:{'Cache-Control':'no-store'}});
  const check=createHash('sha256');for await(const chunk of createReadStream(file,{highWaterMark:64*1024}))check.update(chunk);
  if(check.digest('hex')!==hash)return new NextResponse(null,{status:503,headers:{'Cache-Control':'no-store'}});
  const range=parseRange(req.headers.get('range'),st.size);if(range==='invalid')return new NextResponse(null,{status:416,headers:{'Content-Range':`bytes */${st.size}`,'Cache-Control':'no-store'}});
  const start=range?.start??0,end=range?.end??st.size-1,status=range?206:200;
  const headers:Record<string,string>={'Content-Type':a.mime,'Content-Length':String(end-start+1),'Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff',
   'Cache-Control':'public, max-age=31536000, immutable',...(range?{'Content-Range':`bytes ${start}-${end}/${st.size}`}:{})};
  if(head)return new NextResponse(null,{status,headers});
  const stream=createReadStream(file,{start,end,highWaterMark:64*1024});return new NextResponse(Readable.toWeb(stream) as ReadableStream,{status,headers});
 }catch{return new NextResponse(null,{status:503,headers:{'Cache-Control':'no-store'}});}
});}
type Ctx={params:Promise<{sha256:string}>};
export async function GET(req:NextRequest,{params}:Ctx){return serve(req,(await params).sha256,false);}
export async function HEAD(req:NextRequest,{params}:Ctx){return serve(req,(await params).sha256,true);}
