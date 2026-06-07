/**
 * backend/database/seed.js
 * Run with: npm run seed
 *
 * - Creates the default admin account from .env
 * - Inserts a set of real public-domain books (with Open Library cover URLs)
 * - Safe to re-run: skips if data already exists
 */
'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const bcrypt = require('bcryptjs');
const db     = require('./db');

// ─── Sample public-domain books ───────────────────────────────────
const BOOKS = [
  {
    title: 'Pride and Prejudice', author: 'Jane Austen',
    category: 'Fiction', year: 1813, pages: 432, lang: 'English',
    gutenberg: '1342', rating: 4.8,
    cover: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    desc: 'A romantic novel following Elizabeth Bennet and Mr. Darcy through misunderstandings and personal growth.',
    featured: 1,
  },
  {
    title: 'Moby Dick', author: 'Herman Melville',
    category: 'Fiction', year: 1851, pages: 635, lang: 'English',
    gutenberg: '2701', rating: 4.4,
    cover: 'https://covers.openlibrary.org/b/id/8231432-L.jpg',
    desc: 'Captain Ahab\'s obsessive quest to hunt the white whale Moby Dick.',
    featured: 1,
  },
  {
    title: 'Dracula', author: 'Bram Stoker',
    category: 'Horror', year: 1897, pages: 418, lang: 'English',
    gutenberg: '345', rating: 4.5,
    cover: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
    desc: 'The iconic Gothic horror novel about Count Dracula\'s attempt to move to England.',
    featured: 1,
  },
  {
    title: 'The Art of War', author: 'Sun Tzu',
    category: 'Philosophy', year: -500, pages: 273, lang: 'English',
    gutenberg: '132', rating: 4.6,
    cover: 'https://covers.openlibrary.org/b/id/8760834-L.jpg',
    desc: 'Ancient Chinese military treatise on strategy and tactics.',
    featured: 0,
  },
  {
    title: 'Frankenstein', author: 'Mary Shelley',
    category: 'Horror', year: 1818, pages: 280, lang: 'English',
    gutenberg: '84', rating: 4.5,
    cover: 'https://covers.openlibrary.org/b/id/8231432-L.jpg',
    desc: 'The story of Victor Frankenstein and his monstrous creation.',
    featured: 0,
  },
  {
    title: 'The Picture of Dorian Gray', author: 'Oscar Wilde',
    category: 'Fiction', year: 1890, pages: 254, lang: 'English',
    gutenberg: '174', rating: 4.7,
    cover: 'https://covers.openlibrary.org/b/id/8739204-L.jpg',
    desc: 'A portrait that ages while its subject remains young — with dark consequences.',
    featured: 0,
  },
  {
    title: "Alice's Adventures in Wonderland", author: 'Lewis Carroll',
    category: 'Fiction', year: 1865, pages: 96, lang: 'English',
    gutenberg: '11', rating: 4.7,
    cover: 'https://covers.openlibrary.org/b/id/8739231-L.jpg',
    desc: 'A young girl falls through a rabbit hole into a fantastical world.',
    featured: 0,
  },
  {
    title: 'The Republic', author: 'Plato',
    category: 'Philosophy', year: -380, pages: 312, lang: 'English',
    gutenberg: '1497', rating: 4.3,
    cover: 'https://covers.openlibrary.org/b/id/8226191-L.jpg',
    desc: 'Plato\'s dialogue on justice, the ideal state, and the philosopher-king.',
    featured: 1,
  },
  {
    title: 'Meditations', author: 'Marcus Aurelius',
    category: 'Philosophy', year: 180, pages: 254, lang: 'English',
    gutenberg: '7142', rating: 4.8,
    cover: 'https://covers.openlibrary.org/b/id/8760885-L.jpg',
    desc: 'Personal writings of the Roman Emperor on Stoic philosophy.',
    featured: 1,
  },
  {
    title: 'On the Origin of Species', author: 'Charles Darwin',
    category: 'Science', year: 1859, pages: 502, lang: 'English',
    gutenberg: '2009', rating: 4.5,
    cover: 'https://covers.openlibrary.org/b/id/8226105-L.jpg',
    desc: 'Darwin\'s foundational work presenting the theory of evolution by natural selection.',
    featured: 0,
  },
  {
    title: 'The Time Machine', author: 'H.G. Wells',
    category: 'Science Fiction', year: 1895, pages: 118, lang: 'English',
    gutenberg: '35', rating: 4.4,
    cover: 'https://covers.openlibrary.org/b/id/8228668-L.jpg',
    desc: 'A scientist invents a machine that carries him into the far future.',
    featured: 0,
  },
  {
    title: "Gulliver's Travels", author: 'Jonathan Swift',
    category: 'Satire', year: 1726, pages: 306, lang: 'English',
    gutenberg: '829', rating: 4.2,
    cover: 'https://covers.openlibrary.org/b/id/8739178-L.jpg',
    desc: 'The voyages of Lemuel Gulliver to strange lands — a biting satire of human nature.',
    featured: 0,
  },
];

const CATEGORIES = [
  { name: 'Fiction',          color: '#1B2A4A' },
  { name: 'Horror',           color: '#3D0C11' },
  { name: 'Philosophy',       color: '#4A5D23' },
  { name: 'Science',          color: '#1E3A8A' },
  { name: 'Science Fiction',  color: '#0F4C5C' },
  { name: 'Satire',           color: '#2A4A6B' },
];

async function run() {
  await db.ready();

  // ── Categories ──────────────────────────────────────────────────
  const catInsert = db.prepare(
    `INSERT OR IGNORE INTO categories (name, color, slug) VALUES (?, ?, ?)`
  );
  for (const c of CATEGORIES) {
    catInsert.run(c.name, c.color, c.name.toLowerCase().replace(/\s+/g, '-'));
  }
  console.log(`✓ Categories: ${CATEGORIES.length} upserted`);

  // ── Admin ────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL    || 'admin@zawiya.com';
  const adminPass  = process.env.ADMIN_PASSWORD || 'Admin123!';
  const existing   = db.prepare(`SELECT id FROM admins WHERE email = ?`).get(adminEmail);

  if (!existing) {
    const hash = await bcrypt.hash(adminPass, 12);
    db.prepare(`INSERT INTO admins (email, password_hash) VALUES (?, ?)`).run(adminEmail, hash);
    console.log(`✓ Admin created:   ${adminEmail} / ${adminPass}`);
    console.log(`  ⚠️  Change this password in .env and re-run seed!`);
  } else {
    console.log(`• Admin already exists: ${adminEmail}`);
  }

  // ── Books ────────────────────────────────────────────────────────
  const bookCount = db.prepare(`SELECT COUNT(*) AS n FROM books`).get().n;
  if (bookCount > 0) {
    console.log(`• Books table already has ${bookCount} rows — skipping.`);
    console.log(`  (Delete ${process.env.DATABASE_PATH || './backend/database/zawiya.db'} to reseed.)`);
    process.exit(0);
  }

  const insertBook = db.prepare(`
    INSERT INTO books (
      title, author, description, category,
      publication_year, total_pages, language, publisher,
      license_type, rating, cover_image, gutenberg_id,
      is_visible, is_featured
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  for (const b of BOOKS) {
    insertBook.run(
      b.title, b.author, b.desc, b.category,
      b.year, b.pages, b.lang, 'Project Gutenberg',
      'Public Domain', b.rating, b.cover, b.gutenberg,
      1, b.featured
    );
    process.stdout.write(`  ✓ ${b.title}\n`);
  }

  console.log(`\n✅ Seeded ${BOOKS.length} books.\n`);
  console.log(`Next steps:`);
  console.log(`  1. npm run dev        (start the Express backend on :3000)`);
  console.log(`  2. cd frontend-react && npm install && npm run dev  (React on :5173)`);
  process.exit(0);
}

run().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
