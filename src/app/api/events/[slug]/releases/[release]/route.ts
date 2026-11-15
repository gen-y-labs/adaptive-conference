import { NextResponse } from 'next/server';
import { snapshot } from '@/server/read';import { canonical } from '@/domain/contracts';
import { observed } from '@/server/telemetry';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function GET(_:Request,{params}:{params:Promise<{slug:string;release:string}>}){
 return observed('release.read',async()=>{try{const {slug,release}=await params,n=Number(release);
  if(!/^[a-z0-9][a-z0-9-]{0,63}$/.test(slug)||!Number.isSafeInteger(n)||n<1)return NextResponse.json({error:{code:'not_found',message:'Release not found.',requestId:crypto.randomUUID()}},{status:404,headers:{'Cache-Control':'no-store'}});
  const s=snapshot(slug,n);return s?new Response(canonical(s.bundle),{headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Request-Id':s.requestId}}):NextResponse.json({error:{code:'not_found',message:'Release not found.',requestId:crypto.randomUUID()}},{status:404,headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:{code:'unavailable',message:'Event data is not available. Try again.',requestId:crypto.randomUUID()}},{status:503,headers:{'Cache-Control':'no-store'}});}});
}
