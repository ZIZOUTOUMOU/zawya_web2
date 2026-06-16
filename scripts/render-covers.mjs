// Regenerate first-page cover thumbnails from the sample-page PDFs.
// Run from the repo root:  node scripts/render-covers.mjs  (or: npm run covers)
//
// Sources (a PDF named  <ddc>-<seq>.pdf):
//   frontend-react/public/book-pages/   (413 series)
//   book-pages/                          (414 series, etc.)
// Writes:
//   frontend-react/public/book-covers/<ddc>-<seq>.jpg   (served by Pages)
//   frontend-react/src/data/bookCovers.json             (static import for the UI)
//
// Manifest keys are the books' real catalog call_numbers (see lib/callnumber.mjs).
import { pdf } from 'pdf-to-img';
import { Jimp } from 'jimp';
import { readdirSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { loadCatalogKeys, callNumberFor } from './lib/callnumber.mjs';

const SRC_DIRS = ['frontend-react/public/book-pages', 'book-pages'];
const OUT  = 'frontend-react/public/book-covers';
const DATA = 'frontend-react/src/data';

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
for (const d of [OUT, DATA]) mkdirSync(d, { recursive: true });

const { realSet, orient } = loadCatalogKeys();

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
let done = 0; const failed = [];

for (const [f, { dir, ddc, seq }] of [...pdfs.entries()].sort()) {
  const cn = callNumberFor(ddc, seq, realSet, orient);
  try {
    const doc = await pdf(`${dir}/${f}`, { scale: 1.0 });
    let png;
    for await (const page of doc) { png = page; break; }   // first page only
    let outName, outBuf;
    try {
      const img = await Jimp.read(png);
      if (img.bitmap.width > 420) img.resize({ w: 420 });
      outBuf = await img.getBuffer('image/jpeg', { quality: 78 });
      outName = f.replace(/\.pdf$/, '.jpg');
    } catch {
      outBuf = png;                                          // fallback: raw PNG
      outName = f.replace(/\.pdf$/, '.png');
    }
    writeFileSync(`${OUT}/${outName}`, outBuf);
    manifest[cn] = outName;
    done++;
  } catch (e) {
    failed.push(`${f}: ${e.message}`);
  }
}

writeFileSync(`${DATA}/bookCovers.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(`rendered ${done}/${pdfs.size} covers | failed: ${failed.length}`);
if (failed.length) console.log(failed.join('\n'));
