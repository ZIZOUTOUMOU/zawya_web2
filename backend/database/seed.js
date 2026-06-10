/**
 * backend/database/seed.js
 * Run with: npm run seed
 *
 * Seeds the database with:
 * - Default admin account from .env
 * - Categories and books from the extracted catalog JSON
 * - Safe to re-run: uses INSERT OR IGNORE
 */
'use strict';

const path = require('path');
const fs   = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const bcrypt = require('bcryptjs');
const db     = require('./db');

const JSON_PATH = path.join(__dirname, 'extracted_books.json');

async function run() {
  await db.ready();

  // ── Categories ──────────────────────────────────────────────────
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
  const { categories } = data;

  const catInsert = db.prepare(
    `INSERT OR IGNORE INTO categories (name, slug, color) VALUES (?, ?, ?)`
  );
  for (const ci of categories) {
    const name = ci.category_name;
    const slug = name.replace(/\s+/g, '-');
    catInsert.run(name, slug, null);
  }
  console.log(`✓ Categories: ${categories.length} upserted`);

  // ── Admin ────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL    || 'admin@zawiya.com';
  const adminPass  = process.env.ADMIN_PASSWORD || 'Admin123!';
  const existing   = db.prepare(`SELECT id FROM admins WHERE email = ?`).get(adminEmail);

  if (!existing) {
    const hash = await bcrypt.hash(adminPass, 12);
    db.prepare(`INSERT INTO admins (email, password_hash) VALUES (?, ?)`).run(adminEmail, hash);
    console.log(`✓ Admin created:   ${adminEmail} / ${adminPass}`);
  } else {
    console.log(`• Admin already exists: ${adminEmail}`);
  }

  // ── Books ────────────────────────────────────────────────────────
  const bookCount = db.prepare(`SELECT COUNT(*) AS n FROM books`).get().n;
  if (bookCount > 0) {
    console.log(`• Books table already has ${bookCount} rows — skipping.`);
    process.exit(0);
  }

  const insertBook = db.prepare(`
    INSERT INTO books (
      title, author, description, category, language,
      publisher, license_type, is_visible, is_featured, call_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let count = 0;
  for (const b of data.books) {
    insertBook.run(
      b.title, b.author, b.description, b.category, b.language,
      b.publisher, b.license_type, b.is_visible, b.is_featured,
      b.book_number || null
    );
    count++;
  }

  console.log(`✓ Seeded ${count} books.`);
  process.exit(0);
}

run().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
