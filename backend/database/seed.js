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

  // ── Events ──────────────────────────────────────────────────────
  const eventCount = db.prepare(`SELECT COUNT(*) AS n FROM events`).get().n;
  if (eventCount > 0) {
    console.log(`• Events table already has ${eventCount} rows — skipping.`);
  } else {
    const insertEvent = db.prepare(`
      INSERT INTO events (
        title_ar, title_en, description_ar, description_en,
        location_ar, location_en, date, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const events = [
      {
        title_ar:       'أمسية شعرية',
        title_en:       'Poetry Evening',
        description_ar: 'أمسية شعرية مفتوحة يشارك فيها شعراء محليون بقراءات من أعمالهم.',
        description_en: 'An open poetry evening featuring local poets reading from their works.',
        location_ar:    'القاعة الرئيسية — مركز الزاوية',
        location_en:    'Main Hall — Zawiya Center',
        date:           '2026-06-25T19:00:00',
      },
      {
        title_ar:       'نادي القراءة الشهري',
        title_en:       'Monthly Book Club',
        description_ar: 'نقاش مفتوح حول كتاب الشهر، مع ضيافة وشاي.',
        description_en: 'An open discussion of this month’s book, with refreshments and tea.',
        location_ar:    'قاعة المطالعة',
        location_en:    'Reading Room',
        date:           '2026-07-05T17:30:00',
      },
      {
        title_ar:       'ورشة الخط العربي',
        title_en:       'Arabic Calligraphy Workshop',
        description_ar: 'ورشة عملية لتعلم أساسيات خط الرقعة للمبتدئين، الأدوات متوفرة.',
        description_en: 'A hands-on workshop covering Ruq’ah script basics for beginners. Materials provided.',
        location_ar:    'قاعة الورشات',
        location_en:    'Workshop Room',
        date:           '2026-07-18T10:00:00',
      },
      {
        title_ar:       'معرض الكتاب المستعمل',
        title_en:       'Used Book Fair',
        description_ar: 'معرض لبيع وتبادل الكتب المستعملة بأسعار رمزية.',
        description_en: 'A fair for selling and exchanging used books at symbolic prices.',
        location_ar:    'الساحة الخارجية',
        location_en:    'Outdoor Courtyard',
        date:           '2026-05-20T09:00:00',
      },
    ];

    for (const ev of events) {
      insertEvent.run(
        ev.title_ar, ev.title_en, ev.description_ar, ev.description_en,
        ev.location_ar, ev.location_en, ev.date, ev.image || null
      );
    }
    console.log(`✓ Seeded ${events.length} events.`);
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
