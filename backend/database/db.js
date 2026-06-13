/**
 * backend/database/db.js
 * ─────────────────────────────────────────────────────────────────
 * Database layer using libSQL (@libsql/client) — Turso in production,
 * a local SQLite file in development. Writes are immediately durable;
 * there is no in-memory copy and no manual flush.
 *
 * Keeps a better-sqlite3-style surface so route code reads cleanly,
 * but every query is now ASYNC (a network round-trip to Turso):
 *   await db.prepare(sql).get(...params)   → first row or undefined
 *   await db.prepare(sql).all(...params)   → array of rows
 *   await db.prepare(sql).run(...params)   → { changes, lastInsertRowid }
 *   await db.exec(sql)                     → run a multi-statement script
 *
 * Usage:
 *   const db = require('./db')
 *   await db.ready()                       // applies schema once at startup
 *   await db.prepare(sql).all()            // then query with await
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// ─── Resolve connection target ────────────────────────────────────
// Production: Turso (libsql://… + auth token).
// Dev / no env: a real local SQLite file via the same async client, so
// behavior is identical in both environments.
const LOCAL_FILE = process.env.DATABASE_PATH || './backend/database/zawiya.db';
const LOCAL_ABS  = path.isAbsolute(LOCAL_FILE)
  ? LOCAL_FILE
  : path.join(__dirname, '..', '..', LOCAL_FILE);

let url;
if (process.env.TURSO_DATABASE_URL) {
  url = process.env.TURSO_DATABASE_URL;
} else {
  // Ensure the local file's directory exists, then use a file: URL
  const dir = path.dirname(LOCAL_ABS);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  url = `file:${LOCAL_ABS}`;
}

const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,   // ignored for file: URLs
  intMode:   'number',                        // ids/counts/flags as JS numbers
});

// ─── Initialization (apply schema once) ──────────────────────────
let initPromise = null;

function init() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    // executeMultiple runs a multi-statement script (execute() = one stmt)
    await client.executeMultiple(schema);
  })();
  return initPromise;
}

// ─── Statement wrapper — mirrors better-sqlite3, but async ────────
function wrapStatement(sql) {
  return {
    /** Resolves to the first matching row, or undefined */
    async get(...params) {
      const rs = await client.execute({ sql, args: params });
      return rs.rows[0];
    },

    /** Resolves to all matching rows */
    async all(...params) {
      const rs = await client.execute({ sql, args: params });
      return rs.rows;
    },

    /** Executes a mutating statement → { changes, lastInsertRowid } */
    async run(...params) {
      const rs = await client.execute({ sql, args: params });
      return {
        changes:         rs.rowsAffected,
        // libSQL returns BigInt; routes use this as a plain number
        lastInsertRowid: rs.lastInsertRowid != null ? Number(rs.lastInsertRowid) : 0,
      };
    },
  };
}

// ─── Public API ───────────────────────────────────────────────────
const db = {
  /** Resolves when the schema has been applied (call once at startup) */
  ready: init,

  /** Run raw SQL — a multi-statement script (DDL, etc.) */
  async exec(sql) {
    await client.executeMultiple(sql);
  },

  /** Batch-execute many { sql, args } statements in one transactional round-trip */
  batch(statements, mode = 'write') {
    return client.batch(statements, mode);
  },

  /** Returns an async statement wrapper */
  prepare(sql) {
    return wrapStatement(sql);
  },

  /** Underlying libSQL client (escape hatch) */
  client,
};

module.exports = db;
