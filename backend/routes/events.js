/**
 * backend/routes/events.js
 * Public read-only API — no authentication required.
 *
 * GET /api/events            (?upcoming=true, page, limit)
 * GET /api/events/:id
 *
 * All responses use the envelope:
 *   { success: true,  data: ..., meta: ... }
 *   { success: false, error: "message" }
 *
 * Bilingual content lives in _ar / _en columns; both are returned and
 * the frontend selects the language client-side.
 */
'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../database/db');

// ─── Helpers ──────────────────────────────────────────────────────
const ok  = (data, meta = null) => ({ success: true,  data, meta, error: null });
const err = (msg, code = 400)   => ({ _code: code, success: false, data: null, error: msg });

// ─── GET /api/events ──────────────────────────────────────────────
// Query params: upcoming (true → only future events, soonest first), page, limit
router.get('/events', async (req, res) => {
  const { upcoming = '', page = '1', limit = '20' } = req.query;

  const isUpcoming = upcoming === 'true' || upcoming === '1';
  const whereSql   = isUpcoming ? `WHERE e.date >= datetime('now')` : '';
  const orderBy    = isUpcoming ? 'e.date ASC' : 'e.date DESC';

  const lim    = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const pg     = Math.max(1, parseInt(page, 10) || 1);
  const offset = (pg - 1) * lim;

  try {
    const totalRow = await db.prepare(
      `SELECT COUNT(*) AS n FROM events e ${whereSql}`
    ).get();

    const rows = await db.prepare(
      `SELECT * FROM events e ${whereSql} ORDER BY ${orderBy} LIMIT ? OFFSET ?`
    ).all(lim, offset);

    res.json(ok(rows, { page: pg, limit: lim, total: totalRow.n }));
  } catch (e) {
    console.error('/api/events error:', e.message);
    res.status(500).json(err('Database error', 500));
  }
});

// ─── GET /api/events/:id ──────────────────────────────────────────
router.get('/events/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json(err('Invalid id'));
  try {
    const row = await db.prepare(`SELECT * FROM events WHERE id = ?`).get(id);
    if (!row) return res.status(404).json(err('Event not found', 404));
    res.json(ok(row));
  } catch (e) {
    console.error('/api/events/:id error:', e.message);
    res.status(500).json(err('Database error', 500));
  }
});

module.exports = router;
