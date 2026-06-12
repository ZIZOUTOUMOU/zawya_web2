'use strict';
const path = require('path');
const fs   = require('fs');
const db   = require('./db');

const JSON_PATH = path.join(__dirname, 'extracted_books.json');

async function run() {
  await db.ready();

  // Check if we already have book data from this extract
  const existingCat = db.prepare(`SELECT COUNT(*) AS n FROM categories`).get().n;
  if (existingCat > 6) {
    console.log(`Categories already have ${existingCat} rows — skipping catalog seed.`);
    console.log(`  (Delete ${process.env.DATABASE_PATH || './backend/database/zawiya.db'} to reseed.)`);
    process.exit(0);
  }

  if (!fs.existsSync(JSON_PATH)) {
    console.error(`extracted_books.json not found at ${JSON_PATH}`);
    console.error('Run `python scripts/extract_books.py` first.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
  const { categories, books } = data;

  console.log(`\n📚 Seeding ${books.length} books from ${categories.length} categories...\n`);

  // Insert categories
  const catInsert = db.prepare(
    `INSERT OR IGNORE INTO categories (name, slug, color) VALUES (?, ?, ?)`
  );
  let catCount = 0;
  for (const ci of categories) {
    const name = ci['category_name'];
    const slug = name.replace(/\s+/g, '-');
    catInsert.run(name, slug, null);
    catCount++;
  }
  console.log(`✓ Categories: ${catCount} upserted`);

  // Insert books
  const insertBook = db.prepare(`
    INSERT OR IGNORE INTO books (
      title, author, description, category, language,
      publisher, license_type, is_visible, is_featured, call_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let count = 0;
  for (const b of books) {
    try {
      insertBook.run(
        b.title, b.author, b.description, b.category, b.language,
        b.publisher, b.license_type, b.is_visible, b.is_featured,
        b.book_number || null
      );
      count++;
      if (count % 200 === 0) process.stdout.write(`  ✓ ${count} books...\n`);
    } catch (err) {
      console.error(`  ✗ Error inserting "${b.title}": ${err.message}`);
    }
  }

  console.log(`\n✅ Seeded ${count} books from catalog extract.\n`);
  process.exit(0);
}

run().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
