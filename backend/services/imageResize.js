/**
 * backend/services/imageResize.js
 * Image processing utilities using Jimp (pure JS, no native deps).
 */
'use strict';

const Jimp   = require('jimp');
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
  img.cover(400, 600).quality(85);
  await img.writeAsync(dest);
  return dest;
}

/**
 * Optimise a preview image (max 1200px wide, quality 85).
 */
async function optimizePreview(src, dest) {
  const img = await Jimp.read(src);
  if (img.bitmap.width > 1200) img.resize(1200, Jimp.AUTO);
  const ext = path.extname(dest).toLowerCase();
  if (ext === '.png') img.deflateLevel(9);
  else img.quality(85);
  await img.writeAsync(dest);
  return dest;
}

/**
 * Generate a UUID-based filename preserving the extension.
 */
function uniqueFilename(originalName) {
  const ext  = path.extname(originalName).toLowerCase();
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
