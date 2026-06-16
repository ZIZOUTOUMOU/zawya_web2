// Render EVERY page of each sample PDF to an image, for the book-detail
// "Page Previews" gallery (cover + first + last + any extra pages).
// Run from repo root:  node scripts/render-pages.mjs  (or: npm run pages)
//
// Sources (a PDF named  <ddc>-<seq>.pdf , e.g. 413-24.pdf or 414-01.pdf):
//   frontend-react/public/book-pages/   (413 dictionary series)
//   book-pages/                          (414 rhetoric series, etc.)
// Writes:
//   frontend-react/public/book-pages-img/<ddc>-<seq>-pN.jpg
//   frontend-react/src/data/bookPages.json   { "<call_number>": ["413-24-p1.jpg", ...] }
//
// The manifest key is the book's REAL call_number as stored in the catalog,
// so it matches book.call_number in the UI. Call-number orientation differs
// per series (413/NN vs NN/414); we read it from the catalog rather than guess.
import { pdf } from 'pdf-to-img';
import { Jimp } from 'jimp';
import { readdirSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { loadCatalogKeys, callNumberFor } from './lib/callnumber.mjs';

const SRC_DIRS = ['frontend-react/public/book-pages', 'book-pages'];
const OUT  = 'frontend-react/public/book-pages-img';
const DATA = 'frontend-react/src/data';

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
for (const d of [OUT, DATA]) mkdirSync(d, { recursive: true });

const { realSet, orient } = loadCatalogKeys();

// Collect all PDFs across sources (dedupe by basename; first dir wins).
const pdfs = new Map(); // filename -> { dir, ddc, seq }
for (const dir of SRC_DIRS) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    const m = f.match(/^(\d{3})-(\d+)\.pdf$/);
    if (!m || pdfs.has(f)) continue;
    pdfs.set(f, { dir, ddc: m[1], seq: m[2] });
  }
}

const manifest = {};
let pages = 0; const failed = []; const unmatched = [];

for (const [f, { dir, ddc, seq }] of [...pdfs.entries()].sort()) {
  const cn = callNumberFor(ddc, seq, realSet, orient);
  if (!realSet.has(cn)) unmatched.push(`${f} -> ${cn}`);
  const base = f.replace(/\.pdf$/, '');
  try {
    const doc = await pdf(`${dir}/${f}`, { scale: 1.3 });
    const list = [];
    let i = 0;
    for await (const png of doc) {
      i++;
      const name = `${base}-p${i}.jpg`;
      let buf;
      try {
        const img = await Jimp.read(png);
        if (img.bitmap.width > 700) img.resize({ w: 700 });
        buf = await img.getBuffer('image/jpeg', { quality: 76 });
      } catch {
        buf = png; // PNG fallback (shouldn't happen; Jimp verified working)
      }
      writeFileSync(`${OUT}/${name}`, buf);
      list.push(name);
      pages++;
    }
    manifest[cn] = list;
  } catch (e) {
    failed.push(`${f}: ${e.message}`);
  }
}

writeFileSync(`${DATA}/bookPages.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(`books: ${Object.keys(manifest).length} | pages rendered: ${pages} | failed: ${failed.length}`);
if (failed.length) console.log('FAILED:\n' + failed.join('\n'));
if (unmatched.length) console.log(`\n⚠ ${unmatched.length} PDF(s) have no matching catalog book (preview wired but dormant until the book exists):\n  ` + unmatched.join('\n  '));
