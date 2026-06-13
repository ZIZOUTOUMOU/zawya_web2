'use strict';
const path = require('path');
const fs   = require('fs');
const db   = require('./db');

const JSON_PATH = path.join(__dirname, 'extracted_books.json');

async function run() {
  await db.ready();

  // Check if we already have book data from this extract
  const existingCat = (await db.prepare(`SELECT COUNT(*) AS n FROM categories`).get()).n;
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

  // Batch-insert in write-transaction chunks of 500
  const runBatches = async (stmts) => {
    for (let i = 0; i < stmts.length; i += 500) {
      await db.batch(stmts.slice(i, i + 500), 'write');
    }
  };

  // Insert categories
  await runBatches(categories.map(ci => {
    const name = ci['category_name'];
    return {
      sql:  `INSERT OR IGNORE INTO categories (name, slug, color) VALUES (?, ?, ?)`,
      args: [name, name.replace(/\s+/g, '-'), null],
    };
  }));
  console.log(`✓ Categories: ${categories.length} upserted`);

  // Insert books
  await runBatches(books.map(b => ({
    sql: `INSERT OR IGNORE INTO books (
      title, author, description, category, language,
      publisher, license_type, is_visible, is_featured, call_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [b.title, b.author, b.description, b.category, b.language,
           b.publisher, b.license_type, b.is_visible, b.is_featured,
           b.book_number || null],
  })));

  console.log(`\n✅ Seeded ${books.length} books from catalog extract.\n`);
  process.exit(0);
}

run().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
