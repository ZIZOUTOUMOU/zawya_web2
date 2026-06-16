// Optimize the About-section photos for the web and build their manifest.
// Run from the repo root:  node scripts/render-about.mjs  (or: npm run about)
//
// Reads:  photo-for-disc/<original>.jpg   (large source photos, git-ignored)
// Writes: frontend-react/public/about/about-NN.jpg     (served by Pages)
//         frontend-react/src/data/aboutPhotos.json      (static import for the UI)
//
// Photos are matched by a unique substring of their original filename, then
// emitted in a curated order with bilingual captions. First entry is the
// "who we are" intro image; the rest fill the gallery.
import { Jimp } from 'jimp';
import { readdirSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';

const SRC  = 'photo-for-disc';
const OUT  = 'frontend-react/public/about';
const DATA = 'frontend-react/src/data';
const MAX_W = 1400;       // plenty for the intro image + lightbox, still light
const QUALITY = 82;

// Curated order + captions, keyed by a unique substring of the source filename.
const ORDER = [
  { match: '2.40.23',   ar: 'قاعة الصلاة الكبرى',    en: 'The grand prayer hall' },     // intro
  { match: '715731032', ar: 'الفناء الداخلي',          en: 'The inner courtyard' },
  { match: '715830301', ar: 'الرواق المزخرف',          en: 'The decorated gallery' },
  { match: '2.40.22',   ar: 'القبة المزخرفة',          en: 'The ornamented dome' },
  { match: '716910905', ar: 'المحراب والمصحف',         en: 'The mihrab and the Qur’an' },
  { match: '716858728', ar: 'السقف المزخرف',           en: 'The ornamented ceiling' },
  { match: '716809889', ar: 'بهو قاعة الصلاة',         en: 'The prayer-hall nave' },
  { match: '715830210', ar: 'الأروقة المقوّسة',         en: 'The vaulted arcades' },
  { match: '716829490', ar: 'واجهة الزاوية',           en: 'The zawiya’s facade' },
  { match: '717095925', ar: 'المدخل المقوّس',           en: 'The arched entrance' },
  { match: '716490336', ar: 'منظر من السطح',           en: 'View from the rooftop' },
  { match: '716650251', ar: 'القبة والنخيل',           en: 'The dome and the palms' },
  { match: '716530801', ar: 'سطوح قمار العتيقة',       en: 'Rooftops of old Guemar' },
  { match: '716858792', ar: 'السقف الهرمي',            en: 'The pyramidal roof' },
];

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
for (const d of [OUT, DATA]) mkdirSync(d, { recursive: true });

const sources = readdirSync(SRC).filter(f => /\.(jpe?g|png)$/i.test(f));

const manifest = [];
let done = 0; const missing = [];

for (let i = 0; i < ORDER.length; i++) {
  const { match, ar, en } = ORDER[i];
  const src = sources.find(f => f.includes(match));
  if (!src) { missing.push(match); continue; }
  const name = `about-${String(i + 1).padStart(2, '0')}.jpg`;
  const img = await Jimp.read(`${SRC}/${src}`);
  if (img.bitmap.width > MAX_W) img.resize({ w: MAX_W });
  const buf = await img.getBuffer('image/jpeg', { quality: QUALITY });
  writeFileSync(`${OUT}/${name}`, buf);
  manifest.push({ file: name, ar, en });
  done++;
}

writeFileSync(`${DATA}/aboutPhotos.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(`about photos: ${done}/${ORDER.length} | missing: ${missing.join(', ') || 'none'}`);
