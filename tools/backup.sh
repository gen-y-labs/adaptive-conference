#!/bin/sh
set -eu
database=${DATABASE_PATH:-data/conference.sqlite}
assets=${ASSET_DIR:-data/assets}
destination=${1:?usage: tools/backup.sh destination-directory}
mkdir -p "$destination"
node --input-type=module - "$database" "$destination/conference.sqlite" <<'NODE'
import Database from 'better-sqlite3';
const [source, target] = process.argv.slice(2);
const db = new Database(source, { readonly: true, fileMustExist: true });
try { await db.backup(target); } finally { db.close(); }
NODE
if [ -d "$assets" ]; then cp -R "$assets" "$destination/assets"; fi
printf 'Backed up database and immutable media to %s\n' "$destination"
