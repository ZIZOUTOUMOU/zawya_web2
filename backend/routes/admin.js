/**
 * backend/routes/admin.js
 * Protected admin routes — all require requireAuth middleware.
 *
 * GET    /api/admin/dashboard
 * GET    /api/admin/logs
 * GET    /api/admin/books
 * POST   /api/admin/books
 * POST   /api/admin/books/:id?_method=PUT   (multipart update)
 * PUT    /api/admin/books/:id
 * DELETE /api/admin/books/:id
 * POST   /api/admin/books/fetch-openlibrary
 */
'use strict';

const express  = require('express');
const router   = express.Router();
const path     = require('path');
const fs       = require('fs');
const db       = require('../database/db');
const { requireAuth }               = require('../middleware/auth');
const { bookValidation }            = require('../middleware/validate');
const { uploadBook, UPLOAD_ROOT }   = require('../middleware/upload');
const { resizeCover, optimizePreview, uniqueFilename } = require('../services/imageResize');
const ol       = require('../services/openLibrary');

// ─── Helpers ──────────────────────────────────────────────────────
const envelope = (data, meta = null, error = null) => ({
  success: !error, data, meta, error,
});

/** Record an action in the activity log */
function logActivity(adminId, action, bookTitle) {
  try {
    db.prepare(
      `INSERT INTO activity_log (admin_id, action, book_title) VALUES (?, ?, ?)`
    ).run(adminId, action, bookTitle || null);
  } catch (e) {
    console.error('[activity_log] write error:', e.message);
  }
}

/** Convert a bare filename/external URL into a public /uploads/… URL */
function toPublicUrl(field, filename) {
  if (!filename) return null;
  if (/^https?:\/\//i.test(filename)) return filename;  // external URL — keep as-is
  let sub = 'misc';
  if (field === 'cover_image')                              sub = 'covers';
  else if (field === 'first_page_img' || field === 'last_page_img') sub = 'previews';
  else if (field === 'pdf_file')                            sub = 'pdfs';
  return `/uploads/${sub}/${path.basename(filename)}`;
}

/** Delete a locally stored file (ignore errors) */
function deleteLocal(url) {
  if (!url || /^https?:\/\//i.test(url)) return;
  const sub = url.includes('/covers/')   ? 'covers'
            : url.includes('/previews/') ? 'previews'
            : url.includes('/pdfs/')     ? 'pdfs'
            : 'misc';
  fs.promises.unlink(path.join(UPLOAD_ROOT, sub, path.basename(url))).catch(() => {});
}

// ─── GET /api/admin/dashboard ─────────────────────────────────────
router.get('/dashboard', requireAuth, (req, res) => {
  const totalBooks      = db.prepare(`SELECT COUNT(*) AS n FROM books`).get().n;
  const booksThisMonth  = db.prepare(`
    SELECT COUNT(*) AS n FROM books
    WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
  `).get().n;
  const totalCategories = db.prepare(`SELECT COUNT(*) AS n FROM categories`).get().n;

  // Calculate upload directory size
  let storageBytes = 0;
  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walkDir(full); continue; }
      try { storageBytes += fs.statSync(full).size; } catch {}
    }
  }
  walkDir(path.resolve(UPLOAD_ROOT));

  res.json(envelope({
    totalBooks,
    booksThisMonth,
    totalCategories,
    storageBytes,
    storageMB: +(storageBytes / 1024 / 1024).toFixed(2),
  }));
});

// ─── GET /api/admin/logs ──────────────────────────────────────────
router.get('/logs', requireAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT al.*, a.email AS admin_email
    FROM activity_log al
    LEFT JOIN admins a ON a.id = al.admin_id
    ORDER BY al.timestamp DESC
    LIMIT 50
  `).all();
  res.json(envelope(rows));
});

// ─── GET /api/admin/books ─────────────────────────────────────────
router.get('/books', requireAuth, (req, res) => {
  const rows = db.prepare(`SELECT * FROM books ORDER BY created_at DESC`).all();
  res.json(envelope(rows));
});

// ─── POST /api/admin/books/fetch-openlibrary ─────────────────────
// MUST be defined before /books/:id to avoid `:id` matching "fetch-openlibrary"
router.post('/books/fetch-openlibrary', requireAuth, async (req, res) => {
  const { olid, isbn } = req.body;
  if (!olid && !isbn) {
    return res.status(400).json(envelope(null, null, 'Provide olid or isbn'));
  }
  try {
    let raw = null;
    if (isbn)  raw = await ol.fetchByISBN(isbn);
    if (!raw && olid) raw = await ol.fetchByOLID(olid);
    if (!raw)  return res.status(404).json(envelope(null, null, 'No data found on Open Library'));
    res.json(envelope(ol.normalise(raw, olid)));
  } catch (e) {
    res.status(500).json(envelope(null, null, e.message));
  }
});

// ─── POST /api/admin/books ────────────────────────────────────────
router.post('/books', requireAuth, uploadBook, bookValidation, async (req, res) => {
  try {
    const body  = req.body;
    const files = req.files || {};

    let coverPath = null, firstPath = null, lastPath = null, pdfPath = null;

    // Handle cover image: upload takes priority over URL
    if (files.cover_image?.[0]) {
      const f       = files.cover_image[0];
      const newName = uniqueFilename('.jpg');
      const dest    = path.join(UPLOAD_ROOT, 'covers', newName);
      await resizeCover(f.path, dest);
      fs.promises.unlink(f.path).catch(() => {});
      coverPath = newName;
    } else if (body.cover_image_url?.trim()) {
      coverPath = body.cover_image_url.trim();
    }

    if (files.first_page_img?.[0]) {
      const f       = files.first_page_img[0];
      const newName = uniqueFilename('.jpg');
      const dest    = path.join(UPLOAD_ROOT, 'previews', newName);
      await optimizePreview(f.path, dest);
      fs.promises.unlink(f.path).catch(() => {});
      firstPath = newName;
    }

    if (files.last_page_img?.[0]) {
      const f       = files.last_page_img[0];
      const newName = uniqueFilename('.jpg');
      const dest    = path.join(UPLOAD_ROOT, 'previews', newName);
      await optimizePreview(f.path, dest);
      fs.promises.unlink(f.path).catch(() => {});
      lastPath = newName;
    }

    if (files.pdf_file?.[0]) {
      const f       = files.pdf_file[0];
      const newName = uniqueFilename('.pdf');
      const dest    = path.join(UPLOAD_ROOT, 'pdfs', newName);
      fs.renameSync(f.path, dest);
      pdfPath = newName;
    }

    const result = db.prepare(`
      INSERT INTO books (
        title, author, description, category, isbn10, isbn13,
        publication_year, total_pages, language, publisher,
        license_type, rating, cover_image, first_page_img, last_page_img,
        pdf_file, open_library_id, gutenberg_id, is_visible, is_featured
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(
      body.title,
      body.author,
      body.description  || null,
      body.category,
      body.isbn10        || null,
      body.isbn13        || null,
      body.publication_year ? parseInt(body.publication_year, 10) : null,
      body.total_pages      ? parseInt(body.total_pages,      10) : null,
      body.language      || 'English',
      body.publisher     || null,
      body.license_type  || 'Public Domain',
      body.rating        ? parseFloat(body.rating) : 0,
      toPublicUrl('cover_image',    coverPath),
      toPublicUrl('first_page_img', firstPath),
      toPublicUrl('last_page_img',  lastPath),
      toPublicUrl('pdf_file',       pdfPath),
      body.open_library_id || null,
      body.gutenberg_id    || null,
      body.is_visible  === '0' ? 0 : 1,
      body.is_featured === '1' ? 1 : 0,
    );

    logActivity(req.admin.id, 'add', body.title);
    const inserted = db.prepare(`SELECT * FROM books WHERE id = ?`).get(result.lastInsertRowid);
    res.json(envelope(inserted));
  } catch (e) {
    console.error('Add book error:', e);
    res.status(500).json(envelope(null, null, e.message));
  }
});

// ─── PUT logic (shared by PUT and POST?_method=PUT) ───────────────
async function updateBook(req, res) {
  try {
    const id       = parseInt(req.params.id, 10);
    const existing = db.prepare(`SELECT * FROM books WHERE id = ?`).get(id);
    if (!existing) return res.status(404).json(envelope(null, null, 'Not found'));

    const body  = req.body;
    const files = req.files || {};

    let coverPath = existing.cover_image;
    let firstPath = existing.first_page_img;
    let lastPath  = existing.last_page_img;
    let pdfPath   = existing.pdf_file;

    if (files.cover_image?.[0]) {
      deleteLocal(existing.cover_image);
      const f       = files.cover_image[0];
      const newName = uniqueFilename('.jpg');
      const dest    = path.join(UPLOAD_ROOT, 'covers', newName);
      await resizeCover(f.path, dest);
      fs.promises.unlink(f.path).catch(() => {});
      coverPath = toPublicUrl('cover_image', newName);
    } else if (body.cover_image_url?.trim()) {
      coverPath = body.cover_image_url.trim();
    }

    if (files.first_page_img?.[0]) {
      deleteLocal(existing.first_page_img);
      const f       = files.first_page_img[0];
      const newName = uniqueFilename('.jpg');
      const dest    = path.join(UPLOAD_ROOT, 'previews', newName);
      await optimizePreview(f.path, dest);
      fs.promises.unlink(f.path).catch(() => {});
      firstPath = toPublicUrl('first_page_img', newName);
    }

    if (files.last_page_img?.[0]) {
      deleteLocal(existing.last_page_img);
      const f       = files.last_page_img[0];
      const newName = uniqueFilename('.jpg');
      const dest    = path.join(UPLOAD_ROOT, 'previews', newName);
      await optimizePreview(f.path, dest);
      fs.promises.unlink(f.path).catch(() => {});
      lastPath = toPublicUrl('last_page_img', newName);
    }

    if (files.pdf_file?.[0]) {
      deleteLocal(existing.pdf_file);
      const f       = files.pdf_file[0];
      const newName = uniqueFilename('.pdf');
      const dest    = path.join(UPLOAD_ROOT, 'pdfs', newName);
      fs.renameSync(f.path, dest);
      pdfPath = toPublicUrl('pdf_file', newName);
    }

    db.prepare(`
      UPDATE books SET
        title=?, author=?, description=?, category=?, isbn10=?, isbn13=?,
        publication_year=?, total_pages=?, language=?, publisher=?,
        license_type=?, rating=?, cover_image=?, first_page_img=?, last_page_img=?,
        pdf_file=?, open_library_id=?, gutenberg_id=?, is_visible=?, is_featured=?,
        updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `).run(
      body.title,
      body.author,
      body.description  || null,
      body.category,
      body.isbn10        || null,
      body.isbn13        || null,
      body.publication_year ? parseInt(body.publication_year, 10) : null,
      body.total_pages      ? parseInt(body.total_pages,      10) : null,
      body.language      || 'English',
      body.publisher     || null,
      body.license_type  || 'Public Domain',
      body.rating        ? parseFloat(body.rating) : 0,
      coverPath,
      firstPath,
      lastPath,
      pdfPath,
      body.open_library_id || null,
      body.gutenberg_id    || null,
      body.is_visible  === '0' ? 0 : 1,
      body.is_featured === '1' ? 1 : 0,
      id,
    );

    logActivity(req.admin.id, 'edit', body.title);
    const updated = db.prepare(`SELECT * FROM books WHERE id = ?`).get(id);
    res.json(envelope(updated));
  } catch (e) {
    console.error('Update book error:', e);
    res.status(500).json(envelope(null, null, e.message));
  }
}

router.put('/books/:id',  requireAuth, uploadBook, bookValidation, updateBook);
router.post('/books/:id', requireAuth, uploadBook, bookValidation, (req, res, next) => {
  if (req.query._method === 'PUT') return updateBook(req, res);
  res.status(405).json(envelope(null, null, 'Method not allowed'));
});

// ─── DELETE /api/admin/books/:id ──────────────────────────────────
router.delete('/books/:id', requireAuth, (req, res) => {
  const id   = parseInt(req.params.id, 10);
  const book = db.prepare(`SELECT * FROM books WHERE id = ?`).get(id);
  if (!book) return res.status(404).json(envelope(null, null, 'Not found'));

  deleteLocal(book.cover_image);
  deleteLocal(book.first_page_img);
  deleteLocal(book.last_page_img);
  deleteLocal(book.pdf_file);

  db.prepare(`DELETE FROM books WHERE id = ?`).run(id);
  logActivity(req.admin.id, 'delete', book.title);
  res.json(envelope({ deleted: id }));
});

module.exports = router;
