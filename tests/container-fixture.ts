import {mkdirSync,writeFileSync} from 'node:fs';import {join,resolve} from 'node:path';import {randomUUID} from 'node:crypto';
import {sourceHash,sha256} from '../src/server/validation.ts';import {migrate} from '../src/server/db.ts';import {publish} from '../src/server/publisher.ts';
import type {Manifest} from '../src/domain/contracts.ts';

const data=resolve(process.argv[2]!);mkdirSync(join(data,'assets'),{recursive:true});
const root=join(data,'package');mkdirSync(join(root,'media'),{recursive:true});
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jX2sAAAAASUVORK5CYII=','base64');
const mp4=Buffer.concat([Buffer.alloc(4),Buffer.from('ftypisom')]);writeFileSync(join(root,'media','sample.png'),png);writeFileSync(join(root,'media','sample.mp4'),mp4);
const conference:Manifest['conference']={id:'smoke-event',slug:'container-smoke-fixture',title:'Container smoke test',timezone:'America/Denver',date:'2026-11-10',help:'This is a temporary local verification fixture.',writtenLanguages:['en'],signLanguages:['ase']};
const rooms:Manifest['rooms']=[{id:'hall',name:'Temporary hall',guidance:'Testing only.'}],sessions:Manifest['sessions']=[{id:'sample',title:'Temporary media range test',start:'2026-11-10T17:00:00.000Z',end:'2026-11-10T17:45:00.000Z',roomId:'hall',summary:'Synthetic content used only to verify the app container.',nextAction:'Remove this temporary fixture after verification.'}],basis={conference,rooms,sessions};
const pictureHash=sha256(png),videoHash=sha256(mp4);
const representations=[{id:'sample-pictures',subjectId:'sample',subjectType:'session',format:'pictures',language:'en',sourceHash:sourceHash(basis,'sample'),availability:'available',steps:[{assetHash:pictureHash,shortLabel:'Check',description:'A synthetic test image.'}]},
 {id:'sample-asl',subjectId:'sample',subjectType:'session',format:'sign',language:'ase',sourceHash:sourceHash(basis,'sample'),availability:'available',assetHash:videoHash,script:'Synthetic test script. This is not signed content.'},
 {id:'orientation-asl',subjectId:'smoke-event',subjectType:'orientation',format:'sign',language:'ase',sourceHash:sourceHash(basis,'smoke-event'),availability:'available',assetHash:videoHash,script:'Synthetic test orientation. This is not signed content.'}];
const assets=[{sha256:pictureHash,path:'media/sample.png',mime:'image/png',bytes:png.length,permissionRef:'test-only',provenance:'synthetic test file'},
 {sha256:videoHash,path:'media/sample.mp4',mime:'video/mp4',bytes:mp4.length,permissionRef:'test-only',provenance:'synthetic test bytes; no media playback claim'}];
const reviews=representations.map(r=>({representationId:r.id,sourceHash:r.sourceHash,reviewerRef:'test-only, not a human review',reviewedAt:'2026-11-09T16:00:00.000Z',...(r.format==='sign'?{fluentSignLanguage:'ase'}:{})}));
writeFileSync(join(root,'manifest.json'),JSON.stringify({schemaVersion:1,canonicalizationVersion:1,conference,rooms,sessions,representations,assets,reviews}));
const db=join(data,'conference.sqlite');migrate(db);publish(root,0,randomUUID(),false,{database:db,assets:join(data,'assets')});
console.log(JSON.stringify({conferenceId:conference.id,slug:conference.slug,pictureHash,videoHash}));
