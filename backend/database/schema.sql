-- ═══════════════════════════════════════════════════════════════════
-- Zawiya Digital Center — Database Schema
-- ═══════════════════════════════════════════════════════════════════

-- ─── Books ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
  id                INTEGER  PRIMARY KEY AUTOINCREMENT,
  title             TEXT     NOT NULL,
  author            TEXT     NOT NULL,
  description       TEXT,
  category          TEXT     NOT NULL  DEFAULT 'General',
  isbn10            TEXT     UNIQUE,
  isbn13            TEXT     UNIQUE,
  publication_year  INTEGER,
  total_pages       INTEGER,
  language          TEXT     DEFAULT 'English',
  publisher         TEXT,
  license_type      TEXT     DEFAULT 'Public Domain',
  rating            REAL     DEFAULT 0,
  cover_image       TEXT,
  first_page_img    TEXT,
  last_page_img     TEXT,
  pdf_file          TEXT,
  open_library_id   TEXT,
  gutenberg_id      TEXT,
  is_visible        INTEGER  DEFAULT 1,
  is_featured       INTEGER  DEFAULT 0,
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  call_number       TEXT
);

CREATE INDEX IF NOT EXISTS idx_books_category   ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_year       ON books(publication_year);
CREATE INDEX IF NOT EXISTS idx_books_visible    ON books(is_visible);
CREATE INDEX IF NOT EXISTS idx_books_featured   ON books(is_featured);
CREATE INDEX IF NOT EXISTS idx_books_created    ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_books_language   ON books(language);

-- ─── Events ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id              INTEGER  PRIMARY KEY AUTOINCREMENT,
  title_ar        TEXT     NOT NULL,
  title_en        TEXT     NOT NULL,
  description_ar  TEXT,
  description_en  TEXT,
  location_ar     TEXT,
  location_en     TEXT,
  date            TEXT     NOT NULL,           -- ISO 8601 (e.g. 2026-07-01T18:00:00)
  image           TEXT,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_date    ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at DESC);

-- ─── Categories ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT    NOT NULL UNIQUE,
  color TEXT    DEFAULT '#4A90D9',
  slug  TEXT    UNIQUE
);

-- ─── Admin users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            INTEGER  PRIMARY KEY AUTOINCREMENT,
  email         TEXT     NOT NULL UNIQUE,
  password_hash TEXT     NOT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─── Contact messages ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id          INTEGER  PRIMARY KEY AUTOINCREMENT,
  name        TEXT     NOT NULL,
  email       TEXT     NOT NULL,
  phone       TEXT,
  subject     TEXT,
  message     TEXT     NOT NULL,
  is_handled  INTEGER  DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_handled ON messages(is_handled);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- ─── Activity log ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id          INTEGER  PRIMARY KEY AUTOINCREMENT,
  admin_id    INTEGER,
  action      TEXT,                        -- 'add' | 'edit' | 'delete'
  book_title  TEXT,
  timestamp   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id)
);

CREATE INDEX IF NOT EXISTS idx_activity_ts ON activity_log(timestamp DESC);
