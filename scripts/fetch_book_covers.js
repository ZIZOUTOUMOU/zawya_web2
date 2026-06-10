/**
 * scripts/fetch_book_covers.js
 *
 * Queries Open Library API for cover images of catalog books.
 * Updates the database with cover_image and first_page_img URLs.
 *
 * Run:  node scripts/fetch_book_covers.js
 */
'use strict';

const path  = require('path');
const fs    = require('fs');
const fetch = require('node-fetch');

const db = require('../backend/database/db');

const CACHE_FILE = path.join(__dirname, 'cover_cache.json');
const USER_AGENT = 'ZawiyaDigitalLibrary/1.0 (library@zawiya.dz)';
const MIN_CONFIDENCE = 0.3;  // minimum title similarity to accept a match

// ─── Helpers ───────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[\[\](){}「」『』""'']/g, '')
    .replace(/[–—―-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleSimilarity(a, b) {
  const wa = normalize(a).split(/\s+/).filter(s => s.length > 2);
  const wb = normalize(b).split(/\s+/).filter(s => s.length > 2);
  if (!wa.length || !wb.length) return 0;
  const setB = new Set(wb);
  const matches = wa.filter(w => setB.has(w)).length;
  return matches / Math.max(wa.length, wb.length);
}

function extractYear(title) {
  const m = title.match(/\((\d{4})\)/);
  return m ? parseInt(m[1]) : null;
}

// ─── Open Library search ───────────────────────────────────────────

async function searchOpenLibrary(title, author) {
  // Try multiple query strategies
  const queries = [
    // Full title + author
    query => `${query}${author ? `&author=${encodeURIComponent(author)}` : ''}`,
  ];

  // Remove parentheticals (year, edition info)
  const cleanTitle = title.replace(/\([^)]*\)/g, '').trim();

  const searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(cleanTitle)}&limit=5`;

  try {
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 10000,
    });

    if (res.status === 429) {
      console.log('  ⏳ Rate limited — waiting 10s...');
      await sleep(10000);
      return await searchOpenLibrary(title, author); // retry once
    }

    if (!res.ok) {
      console.error(`  ⚠ HTTP ${res.status} for "${cleanTitle}"`);
      return null;
    }

    const data = await res.json();
    if (!data.docs || !data.docs.length) return null;

    // Score results
    let best = null;
    let bestScore = 0;

    for (const doc of data.docs) {
      const docTitle = doc.title || '';
      const docAuthor = doc.author_name ? doc.author_name[0] : '';

      let score = titleSimilarity(cleanTitle, docTitle);

      // Bonus for author match
      if (author && docAuthor) {
        const authorSim = titleSimilarity(author, docAuthor);
        if (authorSim > 0.3) score += 0.2;
      }

      // Bonus for cover existence
      if (doc.cover_i) score += 0.1;

      if (score > bestScore) {
        bestScore = score;
        best = { doc, score };
      }
    }

    if (!best || best.score < MIN_CONFIDENCE) return null;

    return best.doc;
  } catch (err) {
    console.error(`  ⚠ Network error: ${err.message}`);
    return null;
  }
}

// ─── Main ──────────────────────────────────────────────────────────

async function run() {
  await db.ready();

  // Load cache
  const cache = fs.existsSync(CACHE_FILE)
    ? JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))
    : { found: {}, notFound: {} };

  // Get books without covers
  const books = db.prepare(`
    SELECT id, title, author, category
    FROM books
    WHERE (cover_image IS NULL OR cover_image = '')
      AND is_visible = 1
    ORDER BY id
  `).all();

  console.log(`\n📚 ${books.length} books need covers\n`);

  let found = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    const cacheKey = `${b.id}`;

    // Progress
    if (i % 50 === 0) {
      console.log(`[${i}/${books.length}] — found ${found}, skipped ${skipped}, errors ${errors}`);
    }

    // Check cache
    if (cache.found[cacheKey]) {
      const cached = cache.found[cacheKey];
      if (cached.cover_i) {
        db.prepare(`UPDATE books SET cover_image = ?, first_page_img = ? WHERE id = ?`)
          .run(cached.cover, cached.thumb, b.id);
        found++;
      }
      continue;
    }
    if (cache.notFound[cacheKey]) {
      skipped++;
      continue;
    }

    // Skip very short titles
    if (b.title.length < 5 && b.author.length < 3) {
      cache.notFound[cacheKey] = true;
      skipped++;
      continue;
    }

    // Query API
    const authorClean = b.author
      ? b.author.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
      : '';

    const doc = await searchOpenLibrary(b.title, authorClean);

    if (doc && doc.cover_i) {
      const coverUrl  = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
      const thumbUrl  = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;

      db.prepare(`UPDATE books SET cover_image = ?, first_page_img = ? WHERE id = ?`)
        .run(coverUrl, thumbUrl, b.id);

      cache.found[cacheKey] = {
        cover_i: doc.cover_i,
        cover: coverUrl,
        thumb: thumbUrl,
        title: doc.title,
      };
      found++;

      process.stdout.write(`  ✓ #${b.id} "${doc.title}" (score: ${Math.round(doc.score * 100)}%)\n`);
    } else {
      cache.notFound[cacheKey] = true;
      skipped++;
      if (i % 20 === 0) {
        process.stdout.write(`  · #${b.id} not found\n`);
      }
    }

    // Rate limit: 1 req/sec
    await sleep(1100);
  }

  // Save cache
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  fs.writeFileSync(CACHE_FILE.replace('.json', '_notfound.json'), JSON.stringify(Object.keys(cache.notFound), null, 2), 'utf-8');

  console.log(`\n✅ Done!`);
  console.log(`  Found:     ${found}`);
  console.log(`  Not found: ${skipped}`);
  console.log(`  Errors:    ${errors}`);
  console.log(`  Cache saved to ${CACHE_FILE}`);
  process.exit(0);
}

run().catch(err => { console.error('❌ Failed:', err); process.exit(1); });
