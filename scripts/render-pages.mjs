// Render EVERY page of each sample PDF to an image, for the book-detail
// "Page Previews" gallery (cover + first + last + any extra pages).
// Run from repo root:  node scripts/render-pages.mjs  (or: npm run pages)
//
// Reads:  frontend-react/public/book-pages/413-XX.pdf
// Writes: frontend-react/public/book-pages-img/413-XX-pN.jpg
//         frontend-react/src/data/bookPages.json   { "413/XX": ["413-XX-p1.jpg", ...] }
import { pdf } from 'pdf-to-img';
import { Jimp } from 'jimp';
import { readdirSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';

const SRC = 'frontend-react/public/book-pages';
const OUT = 'frontend-react/public/book-pages-img';
const DATA = 'frontend-react/src/data';
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
for (const d of [OUT, DATA]) mkdirSync(d, { recursive: true });

const files = readdirSync(SRC).filter(f => /^413-\d+\.pdf$/.test(f)).sort();
const manifest = {};
let pages = 0; const failed = [];

for (const f of files) {
  const cn = '413/' + f.match(/^413-(\d+)\.pdf$/)[1];
  const base = f.replace(/\.pdf$/, '');
  try {
    const doc = await pdf(`${SRC}/${f}`, { scale: 1.3 });
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
if (failed.length) console.log(failed.join('\n'));
