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

async function auto() {
  // The catalog JSON is ~1 MB — only read/parse it when a table is empty
  let data = null;
  const loadCatalog = () => {
    if (!data) data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
    return data;
  };

  // ── Categories ──────────────────────────────────────────────────
  const catCount = db.prepare(`SELECT COUNT(*) AS n FROM categories`).get().n;
  if (catCount === 0) {
    const { categories } = loadCatalog();
    const catInsert = db.prepare(
      `INSERT OR IGNORE INTO categories (name, slug, color) VALUES (?, ?, ?)`
    );
    for (const ci of categories) {
      const name = ci.category_name;
      const slug = name.replace(/\s+/g, '-');
      catInsert.run(name, slug, null);
    }
    console.log(`✓ Auto-seed: ${categories.length} categories`);
  }

  // ── Admin ────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL    || 'admin@zawiya.com';
  const adminPass  = process.env.ADMIN_PASSWORD || 'Admin123!';
  const existing   = db.prepare(`SELECT id FROM admins WHERE email = ?`).get(adminEmail);
  if (!existing) {
    const hash = await bcrypt.hash(adminPass, 12);
    db.prepare(`INSERT INTO admins (email, password_hash) VALUES (?, ?)`).run(adminEmail, hash);
    console.log(`✓ Auto-seed: admin ${adminEmail}`);
  }

  // ── Events ──────────────────────────────────────────────────────
  const eventCount = db.prepare(`SELECT COUNT(*) AS n FROM events`).get().n;
  if (eventCount === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO events (
        title_ar, title_en, description_ar, description_en,
        location_ar, location_en, date, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const events = [
      { title_ar:'أمسية شعرية', title_en:'Poetry Evening', description_ar:'أمسية شعرية مفتوحة يشارك فيها شعراء محليون بقراءات من أعمالهم.', description_en:'An open poetry evening featuring local poets.', location_ar:'القاعة الرئيسية', location_en:'Main Hall', date:'2026-06-25T19:00:00' },
      { title_ar:'نادي القراءة الشهري', title_en:'Monthly Book Club', description_ar:'نقاش مفتوح حول كتاب الشهر، مع ضيافة وشاي.', description_en:'Open discussion of the monthly book.', location_ar:'قاعة المطالعة', location_en:'Reading Room', date:'2026-07-05T17:30:00' },
      { title_ar:'ورشة الخط العربي', title_en:'Calligraphy Workshop', description_ar:'ورشة عملية لتعلم أساسيات خط الرقعة.', description_en:'Ruq\'ah script basics workshop.', location_ar:'قاعة الورشات', location_en:'Workshop Room', date:'2026-07-18T10:00:00' },
      { title_ar:'معرض الكتاب المستعمل', title_en:'Used Book Fair', description_ar:'معرض لبيع وتبادل الكتب.', description_en:'Used book sale and exchange.', location_ar:'الساحة الخارجية', location_en:'Outdoor Courtyard', date:'2026-05-20T09:00:00' },
    ];
    for (const ev of events) {
      insertEvent.run(ev.title_ar, ev.title_en, ev.description_ar, ev.description_en, ev.location_ar, ev.location_en, ev.date, ev.image || null);
    }
    console.log(`✓ Auto-seed: ${events.length} events`);
  }

  // ── Books ────────────────────────────────────────────────────────
  const bookCount = db.prepare(`SELECT COUNT(*) AS n FROM books`).get().n;
  if (bookCount === 0) {
    const insertBook = db.prepare(`INSERT INTO books (title, author, description, category, language, publisher, license_type, is_visible, is_featured, call_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    let c = 0;
    for (const b of loadCatalog().books) {
      insertBook.run(b.title, b.author, b.description, b.category, b.language, b.publisher, b.license_type, b.is_visible, b.is_featured, b.book_number || null);
      c++;
    }
    console.log(`✓ Auto-seed: ${c} books`);
  }
}

async function run() {
  await db.ready();
  await auto();
  process.exit(0);
}

// Auto-run when called as CLI (`npm run seed`)
if (require.main === module) {
  run().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
}

module.exports = { auto, run };
