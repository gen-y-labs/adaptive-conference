import { NextRequest,NextResponse } from 'next/server';import { acceptOutcome } from '@/server/outcomes';import { observed } from '@/server/telemetry';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function POST(req:NextRequest){return observed('client.outcome',async()=>{
 if(Number(req.headers.get('content-length')??0)>2048)return NextResponse.json({ok:false},{status:413});
 let data:unknown;try{const reader=req.body?.getReader();if(!reader)return NextResponse.json({ok:false},{status:400});const chunks:Uint8Array[]=[];let total=0;
  while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>2048){await reader.cancel();return NextResponse.json({ok:false},{status:413});}chunks.push(value);}
  data=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{return NextResponse.json({ok:false},{status:400});}
 let ip='unknown';try{ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()??'unknown';}catch{}
 const accepted=acceptOutcome(data,req.headers.get('origin'),process.env.APP_ORIGIN,ip);
 return accepted?NextResponse.json({ok:true},{status:202,headers:{'Cache-Control':'no-store'}}):NextResponse.json({ok:false},{status:400,headers:{'Cache-Control':'no-store'}});
});}
