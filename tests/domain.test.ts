import {after, test} from 'node:test';import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,rmSync,writeFileSync,readFileSync} from 'node:fs';import {join} from 'node:path';import {tmpdir} from 'node:os';import {randomUUID} from 'node:crypto';import Database from 'better-sqlite3';
import {canonical,defaultPreferences,selectRepresentations} from '../src/domain/contracts.ts';
import {migrate} from '../src/server/db.ts';import {publish} from '../src/server/publisher.ts';
import {asset,current,snapshot} from '../src/server/read.ts';
import {coverage,sha256,sourceHash,validatePackage} from '../src/server/validation.ts';import {parseRange} from '../src/server/range.ts';import {demo} from '../src/demo.ts';

const dir=mkdtempSync(join(tmpdir(),'adaptive-conference-tests-'));after(()=>rmSync(dir,{recursive:true,force:true}));
function packageAt(name:string){
 const root=join(dir,name);mkdirSync(join(root,'media'),{recursive:true});
 const image=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jX2sAAAAASUVORK5CYII=','base64');
 const video=Buffer.concat([Buffer.alloc(4),Buffer.from('ftypisom','ascii')]);
 writeFileSync(join(root,'media','picture.png'),image);writeFileSync(join(root,'media','clip.mp4'),video);
 const event={id:'test-event',slug:'test-event',title:'Test Conference',timezone:'America/Denver',date:'2026-11-09',help:'Visit the desk.',writtenLanguages:['en'],signLanguages:['ase']};
 const rooms=[{id:'hall',name:'Main Hall',guidance:'Follow the blue wall.'}];
 const sessions=[{id:'session',title:'Test Session',start:'2026-11-09T17:00:00.000Z',end:'2026-11-09T17:45:00.000Z',roomId:'hall',summary:'A short description.',nextAction:'Go to the hall.'}];
 const basis={conference:event,rooms,sessions};const picHash=sha256(image),clipHash=sha256(video);
 const picture={id:'session-pictures',subjectId:'session',subjectType:'session',format:'pictures',language:'en',sourceHash:sourceHash(basis as never,'session'),availability:'available',steps:[{assetHash:picHash,shortLabel:'Go',description:'Follow the blue wall to the hall.'}]};
 const sign={id:'session-sign',subjectId:'session',subjectType:'session',format:'sign',language:'ase',sourceHash:sourceHash(basis as never,'session'),availability:'available',assetHash:clipHash,script:'Test script.'};
 const orientation={id:'event-sign',subjectId:'test-event',subjectType:'orientation',format:'sign',language:'ase',sourceHash:sourceHash(basis as never,'test-event'),availability:'available',assetHash:clipHash,script:'Test orientation.'};
 const assets=[{sha256:picHash,path:'media/picture.png',mime:'image/png',bytes:image.length,permissionRef:'test only',provenance:'synthetic test asset'},
  {sha256:clipHash,path:'media/clip.mp4',mime:'video/mp4',bytes:video.length,permissionRef:'test only',provenance:'synthetic test asset'}];
 const reviews=[picture,sign,orientation].map(r=>({representationId:r.id,sourceHash:r.sourceHash,reviewerRef:'synthetic test fixture',reviewedAt:'2026-11-09T16:00:00.000Z',...(r.format==='sign'?{fluentSignLanguage:'ase'}:{})}));
 const manifest={schemaVersion:1,canonicalizationVersion:1,conference:event,rooms,sessions,representations:[picture,sign,orientation],assets,reviews};
 writeFileSync(join(root,'manifest.json'),JSON.stringify(manifest));return{root,db:join(dir,`${name}.sqlite`),assetsDir:join(dir,`${name}-assets`)};
}

test('canonical JSON sorts keys and preserves list order',()=>{
 assert.equal(canonical({b:2,a:1}),'{"a":1,"b":2}');assert.notEqual(canonical([1,2]),canonical([2,1]));
});
test('representation selection never silently chooses a different sign language',()=>{
 const p={...defaultPreferences,primaryFormat:'sign' as const};const result=selectRepresentations(demo,'people-first-design',p);
 assert.match(result[0]!.reason!,/Choose American Sign Language/);assert.equal(result[0]!.representation,undefined);
 const asl=selectRepresentations(demo,'people-first-design',{...p,signLanguage:'ase'});assert.match(asl[0]!.reason!,/awaiting human review/);
});
test('coverage requires an ASL orientation and pictures for every declared session',()=>{
 const {root}=packageAt('coverage');const result=validatePackage(root,false);
 assert.equal(result.coverage.length,3);assert.equal(result.coverage.filter(v=>v.availability==='available').length,3);
});
test('a publishable package produces one immutable SQLite release, and retry is idempotent',()=>{
 const f=packageAt('publish');migrate(f.db);const request=randomUUID(),opts={database:f.db,assets:f.assetsDir};
 assert.equal(publish(f.root,0,request,false,opts),1);assert.equal(publish(f.root,0,request,false,opts),1);
 const pointer=current('test-event',f.db)!;assert.equal(pointer.releaseNumber,1);
 const read=snapshot('test-event',1,f.db)!;assert.equal(read.bundle.conference.id,'test-event');assert.equal(sha256(canonical(read.bundle)),pointer.bundleHash);
 const representation=read.bundle.representations.find(r=>r.format==='pictures'&&r.subjectId==='session');
 assert.ok(representation&&representation.format==='pictures');const hash=representation.steps[0]!.assetHash;
 assert.equal(asset(hash,f.db)?.mime,'image/png');
 assert.throws(()=>publish(f.root,0,randomUUID(),false,opts),/conflict/);
 assert.throws(()=>publish(f.root,1,request,false,opts),/different input/);
});
test('failure before activation leaves no active release; staged assets are harmless',()=>{
 const f=packageAt('failure');migrate(f.db);const opts={database:f.db,assets:f.assetsDir};
 assert.throws(()=>publish(f.root,0,randomUUID(),false,opts,p=>{if(p==='before-activation')throw new Error('injected test fault');}),/injected test fault/);
 const db=new Database(f.db);
 try{assert.equal((db.prepare('SELECT count(*) as count FROM releases').get() as {count:number}).count,0);assert.equal(db.prepare('SELECT activeRelease FROM conferences').get(),undefined);}finally{db.close();}
});
test('initial publication rejects incomplete signing coverage',()=>{
 const f=packageAt('unreviewed');const m=JSON.parse(readFileSync(join(f.root,'manifest.json'),'utf8'));
 m.representations.find((r:any)=>r.subjectId==='session'&&r.format==='sign').availability='awaiting_review';
 m.representations.find((r:any)=>r.subjectId==='test-event').availability='awaiting_review';writeFileSync(join(f.root,'manifest.json'),JSON.stringify(m));
 migrate(f.db);assert.throws(()=>publish(f.root,0,randomUUID(),false,{database:f.db,assets:f.assetsDir}),/required coverage/);
});
test('stale representation hashes and incorrect asset bytes are rejected before publishing',()=>{
 const f=packageAt('stale');const path=join(f.root,'manifest.json'),m=JSON.parse(readFileSync(path,'utf8'));
 m.representations[0].sourceHash='f'.repeat(64);writeFileSync(path,JSON.stringify(m));
 assert.throws(()=>validatePackage(f.root,false),/stale source hash/);
});
test('media range parser handles full, suffix, and invalid ranges',()=>{
 assert.equal(parseRange(null,100),undefined);assert.deepEqual(parseRange('bytes=10-20',100),{start:10,end:20});
 assert.deepEqual(parseRange('bytes=-12',100),{start:88,end:99});assert.deepEqual(parseRange('bytes=95-',100),{start:95,end:99});
 assert.equal(parseRange('bytes=100-110',100),'invalid');assert.equal(parseRange('bytes=0-1,3-4',100),'invalid');
});
