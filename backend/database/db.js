/**
 * backend/database/db.js
 * ─────────────────────────────────────────────────────────────────
 * Database layer using sql.js (pure-JS SQLite, no native compilation).
 * The in-memory database is flushed to disk every 30 ms after a write.
 *
 * Exposes a better-sqlite3-compatible API so route code stays clean:
 *   db.prepare(sql).get(...params)
 *   db.prepare(sql).all(...params)
 *   db.prepare(sql).run(...params)
 *
 * Usage:
 *   const db = require('./db')
 *   await db.ready()      // wait for initialization (call once at startup)
 *   db.prepare(sql).all() // then use synchronously
 */

'use strict';

const fs         = require('fs');
const path       = require('path');
const initSqlJs  = require('sql.js');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// ─── Resolve DB file path ─────────────────────────────────────────
const DB_PATH_RAW = process.env.DATABASE_PATH || './backend/database/zawiya.db';
const DB_PATH = path.isAbsolute(DB_PATH_RAW)
  ? DB_PATH_RAW
  : path.join(__dirname, '..', '..', DB_PATH_RAW);

// Ensure directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// ─── Module state ─────────────────────────────────────────────────
let SQL      = null;
let rawDb    = null;
let pending  = false;
let timer    = null;

// Statement cache: sql → { stmt }
const cache  = new Map();

// ─── Deferred disk flush ──────────────────────────────────────────
function scheduleFlush() {
  pending = true;
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
    if (!pending) return;
    pending = false;
    flush();
  }, 30);
}

function flush() {
  // Free all cached statements before export() (which invalidates them)
  for (const entry of cache.values()) {
    if (!entry.stmt) continue;
    try { entry.stmt.reset(); }  catch {}
    try { entry.stmt.free();  }  catch {}
    entry.stmt = null;
  }
  try {
    fs.writeFileSync(DB_PATH, Buffer.from(rawDb.export()));
  } catch (e) {
    console.error('[db] flush failed:', e.message);
  }
}

// Flush on exit
process.on('exit',   () => { if (timer) { clearTimeout(timer); flush(); } });
process.on('SIGINT', () => { flush(); process.exit(0); });
process.on('SIGTERM',() => { flush(); process.exit(0); });

// ─── Initialization ───────────────────────────────────────────────
let initPromise = null;

function init() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
      rawDb = new SQL.Database(new Uint8Array(fs.readFileSync(DB_PATH)));
    } else {
      rawDb = new SQL.Database();
    }

    // Apply schema
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    rawDb.exec(schema);
    scheduleFlush();
  })();
  return initPromise;
}

// ─── Live statement helper ────────────────────────────────────────
function liveStmt(sql) {
  let entry = cache.get(sql);
  if (!entry) { entry = { stmt: null }; cache.set(sql, entry); }
  if (!entry.stmt) entry.stmt = rawDb.prepare(sql);
  return entry.stmt;
}

// ─── Wrapper mirrors better-sqlite3 API ──────────────────────────
function wrapStatement(sql) {
  return {
    /** Returns first matching row or undefined */
    get(...params) {
      const stmt = liveStmt(sql);
      stmt.bind(params);
      const row = stmt.step() ? stmt.getAsObject() : undefined;
      stmt.reset();
      return row;
    },

    /** Returns all matching rows */
    all(...params) {
      const stmt = liveStmt(sql);
      stmt.bind(params);
      const rows = [];
      while (stmt.step()) rows.push(stmt.getAsObject());
      stmt.reset();
      return rows;
    },

    /** Executes a mutating statement, returns { changes, lastInsertRowid } */
    run(...params) {
      const stmt = liveStmt(sql);
      stmt.bind(params);
      stmt.step();
      stmt.reset();
      const changes = rawDb.getRowsModified ? rawDb.getRowsModified() : 0;
      const idRes   = rawDb.exec('SELECT last_insert_rowid() AS id');
      const lastInsertRowid = idRes?.[0]?.values?.[0]?.[0] ?? 0;
      scheduleFlush();
      return { changes, lastInsertRowid };
    },
  };
}

// ─── Public API ───────────────────────────────────────────────────
const db = {
  /** Resolves when the DB is ready to use */
  ready: init,

  /** Execute raw SQL (DDL, pragma, etc.) */
  exec(sql) {
    rawDb.exec(sql);
    scheduleFlush();
  },

  /** Returns a statement wrapper */
  prepare(sql) {
    return wrapStatement(sql);
  },
};

module.exports = db;
