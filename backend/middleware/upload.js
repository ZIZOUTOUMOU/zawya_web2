/**
 * backend/middleware/upload.js
 * Multer configuration for book file uploads.
 * Handles: cover_image, first_page_img, last_page_img, pdf_file
 */
'use strict';

const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const crypto  = require('crypto');

const UPLOAD_ROOT = process.env.UPLOAD_PATH || './backend/uploads';

// Ensure upload directories exist
['covers', 'previews', 'pdfs', 'events', 'misc'].forEach(sub => {
  const dir = path.join(UPLOAD_ROOT, sub);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Storage ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination(req, file, cb) {
    let sub = 'misc';
    if (file.fieldname === 'cover_image')                               sub = 'covers';
    else if (file.fieldname === 'first_page_img' ||
             file.fieldname === 'last_page_img')                        sub = 'previews';
    else if (file.fieldname === 'pdf_file')                             sub = 'pdfs';
    else if (file.fieldname === 'image')                                sub = 'events';

    const dest = path.join(UPLOAD_ROOT, sub);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },

  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'].includes(ext) ? ext : '.bin';
    cb(null, `${crypto.randomUUID()}${safe}`);
  },
});

// ─── File type filter ─────────────────────────────────────────────
const ALLOWED = {
  cover_image:    ['image/jpeg', 'image/png', 'image/webp'],
  first_page_img: ['image/jpeg', 'image/png', 'image/webp'],
  last_page_img:  ['image/jpeg', 'image/png', 'image/webp'],
  pdf_file:       ['application/pdf'],
  image:          ['image/jpeg', 'image/png', 'image/webp'],
};

const fileFilter = (req, file, cb) => {
  const allowed = ALLOWED[file.fieldname];
  if (!allowed)                      return cb(null, true);  // unknown field — pass through
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error(`Unsupported file type for ${file.fieldname}: ${file.mimetype}`));
};

// ─── Size limits ──────────────────────────────────────────────────
const MB       = 1024 * 1024;
const maxCover = (parseInt(process.env.MAX_COVER_SIZE_MB,   10) || 2)  * MB;
const maxPrev  = (parseInt(process.env.MAX_PREVIEW_SIZE_MB, 10) || 3)  * MB;
const maxPdf   = (parseInt(process.env.MAX_PDF_SIZE_MB,     10) || 50) * MB;

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: Math.max(maxCover, maxPrev, maxPdf) },
});

/** Multer middleware that accepts all four file fields */
const uploadBook = upload.fields([
  { name: 'cover_image',    maxCount: 1 },
  { name: 'first_page_img', maxCount: 1 },
  { name: 'last_page_img',  maxCount: 1 },
  { name: 'pdf_file',       maxCount: 1 },
]);

/** Multer middleware for event image upload */
const uploadEvent = upload.fields([
  { name: 'image', maxCount: 1 },
]);

module.exports = { uploadBook, uploadEvent, UPLOAD_ROOT };
