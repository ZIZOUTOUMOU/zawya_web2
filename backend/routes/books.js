/**
 * backend/routes/books.js
 * Public read-only API — no authentication required.
 *
 * All responses use the envelope:
 *   { success: true,  data: ..., meta: ... }
 *   { success: false, error: "message" }
 */
'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../database/db');

// ─── Helpers ──────────────────────────────────────────────────────
const ok  = (data, meta = null) => ({ success: true,  data, meta, error: null });
const err = (msg, code = 400)   => ({ _code: code, success: false, data: null, error: msg });

const SORT_MAP = {
  newest:     'created_at DESC',
  oldest:     'created_at ASC',
  title_asc:  'title COLLATE NOCASE ASC',
  title_desc: 'title COLLATE NOCASE DESC',
  author:     'author COLLATE NOCASE ASC',
  pages:      'total_pages DESC',
  rating:     'rating DESC',
};

// ─── GET /api/books ───────────────────────────────────────────────
// Query params: search, category, year_from, year_to, language, sort, page, limit
router.get('/books', (req, res) => {
  const {
    search = '', category = '', year_from = '', year_to = '',
    language = '', sort = 'newest', page = '1', limit = '20',
  } = req.query;

  const params = [];
  const where  = ['b.is_visible = 1'];

  if (search.trim()) {
    where.push('(b.title LIKE ? OR b.author LIKE ? OR b.isbn10 LIKE ? OR b.isbn13 LIKE ? OR b.description LIKE ?)');
    const q = `%${search.trim()}%`;
    params.push(q, q, q, q, q);
  }
  if (category.trim()) {
    const cats = category.split(',').map(c => c.trim()).filter(Boolean);
    if (cats.length) {
      where.push(`b.category IN (${cats.map(() => '?').join(',')})`);
      params.push(...cats);
    }
  }
  if (year_from) { where.push('b.publication_year >= ?'); params.push(parseInt(year_from, 10)); }
  if (year_to)   { where.push('b.publication_year <= ?'); params.push(parseInt(year_to,   10)); }
  if (language && language !== 'الكل' && language !== 'All') {
    where.push('b.language = ?'); params.push(language);
  }

  const orderBy = SORT_MAP[sort] || SORT_MAP.newest;
  const lim     = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const pg      = Math.max(1, parseInt(page, 10) || 1);
  const offset  = (pg - 1) * lim;

  const whereSql = where.join(' AND ');

  try {
    const totalRow = db.prepare(
      `SELECT COUNT(*) AS n FROM books b WHERE ${whereSql}`
    ).get(...params);

    const rows = db.prepare(
      `SELECT * FROM books b WHERE ${whereSql} ORDER BY ${orderBy} LIMIT ? OFFSET ?`
    ).all(...params, lim, offset);

    res.json(ok(rows, { page: pg, limit: lim, total: totalRow.n }));
  } catch (e) {
    console.error('/api/books error:', e.message);
    res.status(500).json(err('Database error', 500));
  }
});

// ─── GET /api/books/featured ──────────────────────────────────────
router.get('/books/featured', (req, res) => {
  const rows = db.prepare(
    `SELECT * FROM books WHERE is_visible = 1 AND is_featured = 1
     ORDER BY created_at DESC LIMIT 8`
  ).all();
  res.json(ok(rows));
});

// ─── GET /api/books/recent ────────────────────────────────────────
router.get('/books/recent', (req, res) => {
  const rows = db.prepare(
    `SELECT * FROM books WHERE is_visible = 1
     ORDER BY created_at DESC LIMIT 8`
  ).all();
  res.json(ok(rows));
});

// ─── GET /api/books/:id ───────────────────────────────────────────
router.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json(err('Invalid id'));
  const row = db.prepare(
    `SELECT * FROM books WHERE id = ? AND is_visible = 1`
  ).get(id);
  if (!row) return res.status(404).json(err('Book not found', 404));
  res.json(ok(row));
});

// ─── GET /api/categories ──────────────────────────────────────────
router.get('/categories', (req, res) => {
  const rows = db.prepare(
    `SELECT c.*, COUNT(b.id) AS book_count
     FROM categories c
     LEFT JOIN books b ON b.category = c.name AND b.is_visible = 1
     GROUP BY c.id
     ORDER BY c.name ASC`
  ).all();
  res.json(ok(rows));
});

// ─── GET /api/search?q= ───────────────────────────────────────────
router.get('/search', (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q || q.length < 2) return res.json(ok([]));
  const like = `%${q}%`;
  const rows = db.prepare(`
    SELECT id, title, author, cover_image, category
    FROM books
    WHERE is_visible = 1 AND (title LIKE ? OR author LIKE ? OR isbn13 LIKE ?)
    ORDER BY
      CASE WHEN title LIKE ? THEN 0 ELSE 1 END,
      title COLLATE NOCASE ASC
    LIMIT 8
  `).all(like, like, like, like);
  res.json(ok(rows));
});

// ─── GET /api/stats ───────────────────────────────────────────────
router.get('/stats', (req, res) => {
  const totalBooks      = db.prepare(`SELECT COUNT(*) AS n FROM books WHERE is_visible = 1`).get().n;
  const totalCategories = db.prepare(`SELECT COUNT(DISTINCT category) AS n FROM books WHERE is_visible = 1`).get().n;
  const totalAuthors    = db.prepare(`SELECT COUNT(DISTINCT author)   AS n FROM books WHERE is_visible = 1`).get().n;
  const totalPages      = db.prepare(`SELECT COALESCE(SUM(total_pages),0) AS n FROM books WHERE is_visible = 1`).get().n;
  res.json(ok({ totalBooks, totalCategories, totalAuthors, totalPages }));
});

module.exports = router;
