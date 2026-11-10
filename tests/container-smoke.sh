#!/bin/sh
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
scratch=$(mktemp -d)
name="adaptive-conference-smoke-$$"
restored="adaptive-conference-restore-$$"
cleanup(){ docker rm -f "$name" "$restored" >/dev/null 2>&1 || true; rm -rf "$scratch"; }
trap cleanup EXIT INT TERM
docker build -t adaptive-conference:local "$root"
node "$root/tests/container-fixture.ts" "$scratch/data" > "$scratch/fixture.json"
chmod 755 "$scratch"
chmod 777 "$scratch/data" "$scratch/data/assets"
docker run -d --name "$name" -p 127.0.0.1:3211:3000 -v "$scratch/data:/data" adaptive-conference:local >/dev/null
wait_ready(){ i=0; while [ "$i" -lt 15 ]; do if curl -fsS http://127.0.0.1:"$1"/api/health/ready >/dev/null 2>&1; then return 0; fi; i=$((i+1)); sleep 1; done; docker logs "${2}" >&2; return 1; }
wait_ready 3211 "$name"
docker exec "$name" node scripts/content.ts migrate >/dev/null
node --input-type=module - "$scratch/fixture.json" 3211 <<'NODE'
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const fixture=JSON.parse(readFileSync(process.argv[2],'utf8')),origin=`http://127.0.0.1:${process.argv[3]}`;
const pointer=await fetch(`${origin}/api/events/${fixture.slug}/current`).then(r=>r.json());
if(pointer.releaseNumber!==1)throw Error('Container did not read the active release');
const response=await fetch(`${origin}/api/events/${fixture.slug}/releases/1`),bytes=await response.text();
if(createHash('sha256').update(bytes).digest('hex')!==pointer.bundleHash)throw Error('Snapshot hash mismatch');
const head=await fetch(`${origin}/media/${fixture.videoHash}`,{method:'HEAD'});
if(head.status!==200||head.headers.get('content-length')!=='12'||head.headers.get('accept-ranges')!=='bytes')throw Error('HEAD media response invalid');
const part=await fetch(`${origin}/media/${fixture.videoHash}`,{headers:{Range:'bytes=4-11'}}),body=new Uint8Array(await part.arrayBuffer());
if(part.status!==206||part.headers.get('content-range')!=='bytes 4-11/12'||body.length!==8)throw Error('Range media stream invalid');
const asset=await fetch(`${origin}/media/${fixture.pictureHash}`);if(asset.status!==200||asset.headers.get('content-type')!=='image/png')throw Error('Published picture delivery failed');
console.log('Container read, SQLite snapshot hash, HEAD, range stream, and published asset checks passed. Media bytes are synthetic test fixtures; no codec or signing claim.');
NODE
docker restart "$name" >/dev/null
wait_ready 3211 "$name"
node --input-type=module - "$scratch/fixture.json" <<'NODE'
import {readFileSync} from 'node:fs';
const f=JSON.parse(readFileSync(process.argv[2],'utf8'));
const r=await fetch(`http://127.0.0.1:3211/api/events/${f.slug}/current`);
if(!r.ok||(await r.json()).releaseNumber!==1)throw Error('Release did not survive container replacement');
NODE
DATABASE_PATH="$scratch/data/conference.sqlite" ASSET_DIR="$scratch/data/assets" "$root/tools/backup.sh" "$scratch/backup"
mkdir -p "$scratch/restored"
chmod 777 "$scratch/restored"
cp "$scratch/backup/conference.sqlite" "$scratch/restored/conference.sqlite"
cp -R "$scratch/backup/assets" "$scratch/restored/assets"
docker run -d --name "$restored" -p 127.0.0.1:3212:3000 -v "$scratch/restored:/data" adaptive-conference:local >/dev/null
wait_ready 3212 "$restored"
node --input-type=module - "$scratch/fixture.json" <<'NODE'
import {readFileSync} from 'node:fs';
const f=JSON.parse(readFileSync(process.argv[2],'utf8')),origin='http://127.0.0.1:3212';
const response=await fetch(`${origin}/api/events/${f.slug}/current`);
if(!response.ok||(await response.json()).releaseNumber!==1)throw Error('Restored release is not available');
const asset=await fetch(`${origin}/media/${f.pictureHash}`);if(!asset.ok)throw Error('Restored media is not available');
NODE
printf 'Container replacement and SQLite-plus-media backup restore checks passed.\n'
