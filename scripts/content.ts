import {mkdtempSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';import {tmpdir} from 'node:os';import {spawn} from 'node:child_process';
import {migrate,paths} from '../src/server/db.ts';import {validatePackage} from '../src/server/validation.ts';import {publicBundle,publish} from '../src/server/publisher.ts';

const [command,...args]=process.argv.slice(2);
function usage():never{console.error(`Usage:\n  npm run content -- validate <package> [--allow-incomplete]\n  npm run content -- preview <package> [--port 3000]\n  npm run content -- publish <package> --expected <N> --request-id <UUID> [--accept-reduced-coverage]\n  npm run content -- migrate`);process.exit(2);}
function option(flag:string){const i=args.indexOf(flag);return i<0?undefined:args[i+1];}
if(command==='migrate'){migrate();console.log(`Migrated ${paths().database}`);}
else if(command==='validate'){
 const root=resolve(args[0]??'');if(!args[0])usage();const complete=!args.includes('--allow-incomplete');
 const result=validatePackage(root,complete);console.log(JSON.stringify({valid:true,publishable:complete,conference:result.manifest.conference.slug,
  sessions:result.manifest.sessions.length,coverage:result.coverage},null,2));
}
else if(command==='publish'){
 const root=resolve(args[0]??''),expected=Number(option('--expected')),requestId=option('--request-id');if(!args[0]||!requestId||!Number.isSafeInteger(expected))usage();
 const release=publish(root,expected,requestId,args.includes('--accept-reduced-coverage'));
 console.log(JSON.stringify({published:true,releaseNumber:release,conference:JSON.parse(readFileSync(resolve(root,'manifest.json'),'utf8')).conference.slug}));
}
else if(command==='preview'){
 const root=resolve(args[0]??''),port=Number(option('--port')??'3000');if(!args[0]||!Number.isInteger(port)||port<1024||port>65535)usage();
 const {manifest}=validatePackage(root,false),bundle=publicBundle(root),temp=mkdtempSync(join(tmpdir(),'adaptive-conference-preview-')),data=join(temp,'preview.json');writeFileSync(data,JSON.stringify(bundle));
 const child=spawn('npm',['run','dev','--','--hostname','127.0.0.1','--port',String(port)],{stdio:'inherit',env:{...process.env,PREVIEW_PACKAGE:root,PREVIEW_DATA_PATH:data}});
 console.log(`Preview: http://127.0.0.1:${port}/preview/${manifest.conference.slug}\nLocal only. Unreviewed content is labeled and cannot be published by preview.`);
 const stop=()=>child.kill('SIGTERM');process.on('SIGINT',stop);process.on('SIGTERM',stop);child.on('close',()=>rmSync(temp,{recursive:true,force:true}));
}else usage();
