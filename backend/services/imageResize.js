/**
 * backend/services/imageResize.js
 * Image processing utilities using Jimp (pure JS, no native deps).
 */
'use strict';

const { Jimp } = require('jimp');   // Jimp v1: named export, new API
const path   = require('path');
const crypto = require('crypto');
const fs     = require('fs');

/**
 * Resize a cover image to 400×600 and save as JPEG.
 * @param {string} src  - source file path
 * @param {string} dest - destination file path
 */
async function resizeCover(src, dest) {
  const img = await Jimp.read(src);
  img.cover({ w: 400, h: 600 });
  await img.write(dest, { quality: 85 });
  return dest;
}

/**
 * Optimise a preview image (max 1200px wide, quality 85).
 */
async function optimizePreview(src, dest) {
  const img = await Jimp.read(src);
  if (img.bitmap.width > 1200) img.resize({ w: 1200 });
  const ext = path.extname(dest).toLowerCase();
  if (ext === '.png') await img.write(dest);
  else                await img.write(dest, { quality: 85 });
  return dest;
}

/**
 * Generate a UUID-based filename with a safe extension.
 * Accepts either a full original name ("photo.jpg") or a bare
 * extension ("./.jpg") — callers pass the bare form.
 */
function uniqueFilename(nameOrExt) {
  // path.extname('.jpg') === '' (leading-dot names have no "extension"),
  // so fall back to the argument itself when it's already a bare extension.
  const ext  = (path.extname(nameOrExt) || nameOrExt).toLowerCase();
  const safe = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'].includes(ext) ? ext : '.bin';
  return `${crypto.randomUUID()}${safe}`;
}

/**
 * Ensure a directory exists (recursive).
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

module.exports = { resizeCover, optimizePreview, uniqueFilename, ensureDir };
