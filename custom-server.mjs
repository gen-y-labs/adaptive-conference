import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import next from 'next';
import { asset } from './src/server/read.ts';
import { paths } from './src/server/db.ts';
import { parseRange } from './src/server/range.ts';
import { observed,flushTelemetry } from './src/server/telemetry.ts';

const port=Number(process.env.PORT??3000),hostname=process.env.HOSTNAME??'0.0.0.0';
const app=next({dev:false,hostname,port,dir:process.cwd()});await app.prepare();const nextHandler=app.getRequestHandler();
const server=createServer(async(req,res)=>{
  const pathname=new URL(req.url??'/',`http://${req.headers.host??'localhost'}`).pathname;
  const match=/^\/media\/([a-f0-9]{64})$/.exec(pathname);
  if(!match||!['GET','HEAD'].includes(req.method??'')){await nextHandler(req,res);return;}
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  await observed('media.delivery',async()=>{
    try{
      const record=asset(match[1]);if(!record){res.writeHead(404,{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end();return;}
      const file=join(paths().assets,record.storageKey),info=await stat(file);
      if(!info.isFile()||info.size!==record.bytes){res.writeHead(404,{'Cache-Control':'no-store'});res.end();return;}
      const hash=createHash('sha256');for await(const part of createReadStream(file,{highWaterMark:64*1024}))hash.update(part);
      if(hash.digest('hex')!==match[1]){res.writeHead(503,{'Cache-Control':'no-store'});res.end();return;}
      const range=parseRange(req.headers.range??null,info.size);
      if(range==='invalid'){res.writeHead(416,{'Content-Range':`bytes */${info.size}`,'Cache-Control':'no-store'});res.end();return;}
      const start=range?.start??0,end=range?.end??info.size-1;
      res.writeHead(range?206:200,{'Content-Type':record.mime,'Content-Length':String(end-start+1),'Accept-Ranges':'bytes',
        'X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=31536000, immutable',
        ...(range?{'Content-Range':`bytes ${start}-${end}/${info.size}`}:{})});
      if(req.method==='HEAD'){res.end();return;}
      const stream=createReadStream(file,{start,end,highWaterMark:64*1024});req.on('aborted',()=>stream.destroy());
      await new Promise(resolve=>{res.on('finish',resolve);res.on('close',resolve);stream.on('error',()=>{res.destroy();resolve();});stream.pipe(res);});
    }catch{if(!res.headersSent){res.writeHead(503,{'Cache-Control':'no-store'});res.end();}else res.destroy();}
  });
});
server.listen(port,hostname,()=>console.log(`Adaptive Conference listening on ${hostname}:${port}`));
let stopping=false;
const shutdown=async()=>{
  if(stopping)return;stopping=true;
  const deadline=setTimeout(()=>server.closeAllConnections(),10_000);
  try{await Promise.all([new Promise(resolve=>server.close(resolve)),flushTelemetry()]);}
  finally{clearTimeout(deadline);process.exit(0);}
};
process.on('SIGTERM',()=>void shutdown());process.on('SIGINT',()=>void shutdown());
