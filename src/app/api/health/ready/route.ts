import { NextResponse } from 'next/server';import { dbOkay } from '@/server/read';
export const runtime='nodejs';export const dynamic='force-dynamic';
export function GET(){try{return dbOkay()?NextResponse.json({status:'ready'},{headers:{'Cache-Control':'no-store'}}):NextResponse.json({status:'not_ready'},{status:503,headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({status:'not_ready'},{status:503,headers:{'Cache-Control':'no-store'}});}}
