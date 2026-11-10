import { notFound } from 'next/navigation';
import { readFileSync,realpathSync,statSync } from 'node:fs';import {resolve,sep} from 'node:path';
import { bundleSchema } from '@/domain/contracts';import {Attendee} from '@/components/attendee';
export const runtime='nodejs';export const dynamic='force-dynamic';
export default async function PackagePreview({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params, root=process.env.PREVIEW_PACKAGE;if(!root)notFound();
 try{const base=realpathSync(root),path=realpathSync(process.env.PREVIEW_DATA_PATH?resolve(/*turbopackIgnore: true*/ process.env.PREVIEW_DATA_PATH):resolve(base,'preview.json'));if(process.env.PREVIEW_DATA_PATH?!statSync(path).isFile():(!path.startsWith(base+sep)||!statSync(path).isFile()))notFound();
  const bundle=bundleSchema.parse(JSON.parse(readFileSync(path,'utf8')));if(bundle.conference.slug!==slug)notFound();return <Attendee initial={bundle} preview/>;
 }catch{notFound();}
}
