// Optimize the About-section photos for the web and build their manifest.
// Run from the repo root:  node scripts/render-about.mjs  (or: npm run about)
//
// Reads:  photo-for-disc/<original>.jpg   (large source photos, git-ignored)
// Writes: frontend-react/public/about/about-NN.jpg     (served by Pages)
//         frontend-react/src/data/aboutPhotos.json      (static import for the UI)
//
// Photos are matched by the numeric prefix of their original filename, then
// emitted in a curated order with bilingual captions. First entry is the
// "who we are" intro image; the rest fill the gallery.
import { Jimp } from 'jimp';
import { readdirSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';

const SRC  = 'photo-for-disc';
const OUT  = 'frontend-react/public/about';
const DATA = 'frontend-react/src/data';
const MAX_W = 1400;       // plenty for the intro image + lightbox, still light
const QUALITY = 82;

// Curated order + captions, keyed by the original filename's numeric prefix.
const ORDER = [
  { id: '716809889', ar: 'قاعة الصلاة',            en: 'The prayer hall' },          // intro
  { id: '715731032', ar: 'الفناء الداخلي',          en: 'The inner courtyard' },
  { id: '715830301', ar: 'الرواق المزخرف',          en: 'The decorated gallery' },
  { id: '716910905', ar: 'المحراب والمصحف',         en: 'The mihrab and the Qur’an' },
  { id: '716858728', ar: 'السقف المزخرف',           en: 'The ornamented ceiling' },
  { id: '715830210', ar: 'الأروقة المقوّسة',         en: 'The vaulted arcades' },
  { id: '716829490', ar: 'واجهة الزاوية',           en: 'The zawiya’s facade' },
  { id: '717095925', ar: 'المدخل المقوّس',           en: 'The arched entrance' },
  { id: '716490336', ar: 'منظر من السطح',           en: 'View from the rooftop' },
  { id: '716650251', ar: 'القبة والنخيل',           en: 'The dome and the palms' },
  { id: '716530801', ar: 'سطوح قمار العتيقة',       en: 'Rooftops of old Guemar' },
  { id: '716858792', ar: 'السقف الهرمي',            en: 'The pyramidal roof' },
];

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
for (const d of [OUT, DATA]) mkdirSync(d, { recursive: true });

const sources = readdirSync(SRC).filter(f => /\.(jpe?g|png)$/i.test(f));
const byPrefix = new Map(sources.map(f => [f.split('_')[0], f]));

const manifest = [];
let done = 0; const missing = [];

for (let i = 0; i < ORDER.length; i++) {
  const { id, ar, en } = ORDER[i];
  const src = byPrefix.get(id);
  if (!src) { missing.push(id); continue; }
  const name = `about-${String(i + 1).padStart(2, '0')}.jpg`;
  const img = await Jimp.read(`${SRC}/${src}`);
  if (img.bitmap.width > MAX_W) img.resize({ w: MAX_W });
  const buf = await img.getBuffer('image/jpeg', { quality: QUALITY });
  writeFileSync(`${OUT}/${name}`, buf);
  manifest.push({ file: name, ar, en });
  done++;
}

writeFileSync(`${DATA}/aboutPhotos.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(`about photos: ${done}/${ORDER.length} | missing prefixes: ${missing.join(', ') || 'none'}`);
