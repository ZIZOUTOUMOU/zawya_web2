/**
 * backend/server.js
 * ─────────────────────────────────────────────────────────────────
 * Zawiya Digital Center — Express API server
 *
 * In development:  React (Vite) on :5173  ←→  API on :3000
 * In production:   Express serves built React from frontend-react/dist
 */
'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express      = require('express');
const path         = require('path');
const fs           = require('fs');
const helmet       = require('helmet');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const db           = require('./database/db');

const app      = express();
const PORT     = parseInt(process.env.PORT, 10) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const UPLOAD_ROOT = process.env.UPLOAD_PATH || './backend/uploads';

// ─── Ensure upload dirs exist ─────────────────────────────────────
['covers', 'previews', 'pdfs', 'events', 'misc'].forEach(sub => {
  const d = path.join(UPLOAD_ROOT, sub);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ─── Security headers ─────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,       // React app manages its own CSP
  crossOriginEmbedderPolicy: false,   // needed for PDF.js / iframes
}));

// ─── CORS ─────────────────────────────────────────────────────────
// Allowed origins: Vite dev server + optional production domain
const ALLOWED = [
  'http://localhost:5173',   // Vite dev
  'http://localhost:4173',   // Vite preview
  `http://localhost:${PORT}`,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    // Requests with no origin (curl, Postman, same-origin) are allowed
    if (!origin)                         return cb(null, true);
    if (NODE_ENV !== 'production')       return cb(null, true);   // allow all in dev
    if (ALLOWED.includes(origin))        return cb(null, true);
    if (/\.zawya-web2\.pages\.dev$/.test(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,   // allow cookies (JWT)
  methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body parsing ─────────────────────────────────────────────────
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true, limit: '4mb' }));
app.use(cookieParser());

// ─── Wait for DB before handling requests ────────────────────────
app.use(async (req, res, next) => {
  try { await db.ready(); next(); }
  catch (e) { next(e); }
});

// ─── Static: uploaded files ───────────────────────────────────────
app.use('/uploads', express.static(path.resolve(UPLOAD_ROOT), {
  index:    false,
  dotfiles: 'deny',
  maxAge:   '7d',
}));

// ─── API routes ───────────────────────────────────────────────────
app.use('/api',       require('./routes/books'));
app.use('/api',       require('./routes/events'));
app.use('/api',       require('./routes/contact'));
app.use('/api/admin', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

// ─── Health check (useful for deploy platforms) ───────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: NODE_ENV, time: new Date().toISOString() });
});

// ─── Serve built React app in production ─────────────────────────
const REACT_DIST = path.join(__dirname, '..', 'frontend-react', 'dist');

if (NODE_ENV === 'production' && fs.existsSync(REACT_DIST)) {
  app.use(express.static(REACT_DIST));
  // React Router catch-all — must come AFTER /api routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }
    res.sendFile(path.join(REACT_DIST, 'index.html'));
  });
} else {
  // Development: inform the developer that Vite is the frontend
  app.get('/', (req, res) => {
    res.json({
      message: '🕌 Zawiya API is running',
      note:    'React frontend → http://localhost:5173 (run: cd frontend-react && npm run dev)',
      api: {
        books:      `http://localhost:${PORT}/api/books`,
        stats:      `http://localhost:${PORT}/api/stats`,
        categories: `http://localhost:${PORT}/api/categories`,
        health:     `http://localhost:${PORT}/health`,
      },
    });
  });
}

// ─── 404 for unknown /api/* ───────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// ─── Global error handler ─────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[server error]', err.message);
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ─── Start ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🕌  Zawiya API  →  http://localhost:${PORT}`);
  if (NODE_ENV !== 'production') {
    console.log(`📚  Books       →  http://localhost:${PORT}/api/books`);
    console.log(`⚙️   Admin       →  http://localhost:${PORT}/api/admin/me`);
    console.log(`🔑  Login       →  POST http://localhost:${PORT}/api/admin/login`);
    console.log(`\n    React dev   →  cd frontend-react && npm run dev\n`);
  }
}).on('error', err => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
