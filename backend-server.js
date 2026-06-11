// backend/server.js — Updated for React frontend + API model

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_ROOT = process.env.UPLOAD_PATH || './backend/uploads';
const NODE_ENV = process.env.NODE_ENV || 'development';

// ─── Upload directories ────────────────────────────────────────────────────
['covers', 'previews', 'pdfs'].forEach(sub => {
  const d = path.join(UPLOAD_ROOT, sub);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ─── Security ─────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // React app handles its own CSP in production
  crossOriginEmbedderPolicy: false
}));

// ─── CORS — Allow React dev server (Vite runs on 5173) ────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:4173',  // Vite preview
  'http://localhost:3000',  // Same-origin (production)
  process.env.FRONTEND_URL, // Production domain (set in .env)
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin) || NODE_ENV === 'development') {
      return callback(null, true);
    }
    // Allow all Cloudflare Pages preview subdomains
    if (/\.zawya-web2\.pages\.dev$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true, // Allow cookies (JWT auth)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// ─── Wait for DB ───────────────────────────────────────────────────────────
app.use(async (req, res, next) => {
  try { await db.ready(); next(); }
  catch (e) { next(e); }
});

// ─── Static: uploaded files ────────────────────────────────────────────────
app.use('/uploads', express.static(path.resolve(UPLOAD_ROOT), {
  index: false,
  dotfiles: 'deny'
}));

// ─── API routes (pure JSON — no HTML served here) ─────────────────────────
app.use('/api', require('./routes/books'));
app.use('/api/admin', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

// ─── Serve React app in PRODUCTION ────────────────────────────────────────
// In development, Vite serves the frontend on port 5173.
// In production, you build React (`npm run build` in frontend-react/)
// and point Express to serve the dist/ folder.
const REACT_BUILD = path.join(__dirname, '..', 'frontend-react', 'dist');

if (NODE_ENV === 'production' && fs.existsSync(REACT_BUILD)) {
  // Serve static assets (JS, CSS, images)
  app.use(express.static(REACT_BUILD));

  // Catch-all: send React's index.html for any non-API route
  // This enables React Router's client-side routing to work
  app.get('*', (req, res) => {
    // Don't interfere with API routes or upload routes
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }
    res.sendFile(path.join(REACT_BUILD, 'index.html'));
  });
} else if (NODE_ENV !== 'production') {
  // In development, the React app is served by Vite.
  // Keep old Vanilla frontend as fallback if needed:
  const OLD_FRONTEND = path.join(__dirname, '..', 'frontend');
  if (fs.existsSync(OLD_FRONTEND)) {
    app.use(express.static(OLD_FRONTEND));
  }

  app.get('/', (req, res) => {
    res.json({
      message: '📚 Zawiya Library API is running',
      note: 'React frontend is served by Vite on port 5173',
      docs: 'See /api/books, /api/categories, /api/stats'
    });
  });
}

// ─── 404 for unknown API routes ────────────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// ─── Global error handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// ─── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🕌 Zawiya Library API running on http://localhost:${PORT}`);
  console.log(`   API:           http://localhost:${PORT}/api`);
  if (NODE_ENV !== 'production') {
    console.log(`   React Dev UI:  http://localhost:5173 (run: cd frontend-react && npm run dev)`);
  }
  console.log(`   Admin:         http://localhost:${PORT}/api/admin\n`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
