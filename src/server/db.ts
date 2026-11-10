import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export function paths() {
  return { database: resolve(/*turbopackIgnore: true*/ process.env.DATABASE_PATH ?? 'data/conference.sqlite'), assets: resolve(/*turbopackIgnore: true*/ process.env.ASSET_DIR ?? 'data/assets') };
}
export function openDb(path = paths().database) {
  const db = new Database(path, { fileMustExist: true });
  db.pragma('foreign_keys = ON'); db.pragma('busy_timeout = 5000');
  const version = db.pragma('user_version', { simple: true });
  if (version !== 1) { db.close(); throw new Error('Run explicit database migration before serving'); }
  return db;
}
export function migrate(path = paths().database) {
  mkdirSync(dirname(path), { recursive: true });
  const db = new Database(path);
  db.pragma('foreign_keys = ON'); db.pragma('busy_timeout = 5000'); db.pragma('journal_mode = WAL');
  if (Number(db.pragma('user_version', { simple: true })) > 1) { db.close(); throw new Error('Unsupported schema version'); }
  db.exec(`BEGIN IMMEDIATE;
    CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY);
    INSERT OR IGNORE INTO schema_migrations VALUES(1);
    CREATE TABLE IF NOT EXISTS conferences(id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, activeRelease INTEGER,
      FOREIGN KEY(id,activeRelease) REFERENCES releases(conferenceId,releaseNumber) DEFERRABLE INITIALLY DEFERRED);
    CREATE TABLE IF NOT EXISTS releases(conferenceId TEXT NOT NULL REFERENCES conferences(id), releaseNumber INTEGER NOT NULL CHECK(releaseNumber>0),
      schemaVersion INTEGER NOT NULL CHECK(schemaVersion=1), createdAt TEXT NOT NULL, bundleJson TEXT NOT NULL, bundleHash TEXT NOT NULL,
      PRIMARY KEY(conferenceId,releaseNumber));
    CREATE TABLE IF NOT EXISTS assets(sha256 TEXT PRIMARY KEY, mime TEXT NOT NULL, bytes INTEGER NOT NULL, storageKey TEXT NOT NULL UNIQUE);
    CREATE TABLE IF NOT EXISTS release_assets(conferenceId TEXT NOT NULL, releaseNumber INTEGER NOT NULL, sha256 TEXT NOT NULL REFERENCES assets(sha256),
      PRIMARY KEY(conferenceId,releaseNumber,sha256), FOREIGN KEY(conferenceId,releaseNumber) REFERENCES releases(conferenceId,releaseNumber));
    CREATE TABLE IF NOT EXISTS publication_requests(conferenceId TEXT NOT NULL, requestId TEXT NOT NULL, inputHash TEXT NOT NULL, releaseNumber INTEGER NOT NULL,
      PRIMARY KEY(conferenceId,requestId), FOREIGN KEY(conferenceId,releaseNumber) REFERENCES releases(conferenceId,releaseNumber));
    CREATE TRIGGER IF NOT EXISTS immutable_releases_update BEFORE UPDATE ON releases BEGIN SELECT RAISE(ABORT,'immutable release'); END;
    CREATE TRIGGER IF NOT EXISTS immutable_releases_delete BEFORE DELETE ON releases BEGIN SELECT RAISE(ABORT,'immutable release'); END;
    CREATE TRIGGER IF NOT EXISTS immutable_assets_update BEFORE UPDATE ON assets BEGIN SELECT RAISE(ABORT,'immutable asset'); END;
    PRAGMA user_version=1;
    COMMIT;`);
  db.close();
}
