// Regenerate first-page cover thumbnails from the sample-page PDFs.
// Run from the repo root:  node scripts/render-covers.mjs  (or: npm run covers)
//
// Reads:  frontend-react/public/book-pages/413-XX.pdf
// Writes: frontend-react/public/book-covers/413-XX.jpg   (served by Pages)
//         frontend-react/src/data/bookCovers.json        (static import for the UI)
import { pdf } from 'pdf-to-img';
import { Jimp } from 'jimp';
import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const SRC = 'frontend-react/public/book-pages';
const OUT = 'frontend-react/public/book-covers';
const DATA = 'frontend-react/src/data';
for (const d of [OUT, DATA]) if (!existsSync(d)) mkdirSync(d, { recursive: true });

const files = readdirSync(SRC).filter(f => /^413-\d+\.pdf$/.test(f)).sort();
const manifest = {};
let done = 0; const failed = [];

for (const f of files) {
  const cn = '413/' + f.match(/^413-(\d+)\.pdf$/)[1];
  try {
    const doc = await pdf(`${SRC}/${f}`, { scale: 1.0 });
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
console.log(`rendered ${done}/${files.length} covers | failed: ${failed.length}`);
if (failed.length) console.log(failed.join('\n'));
