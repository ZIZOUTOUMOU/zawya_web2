/**
 * backend/routes/auth.js
 * Admin authentication endpoints.
 *
 * POST /api/admin/login   → verify credentials, set JWT cookie
 * POST /api/admin/logout  → clear JWT cookie
 * GET  /api/admin/me      → return current admin (from cookie)
 */
'use strict';

const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db        = require('../database/db');
const { signToken, JWT_SECRET } = require('../middleware/auth');
const { loginValidation }       = require('../middleware/validate');

// ─── Rate limiter: 10 attempts per 15 min per IP ──────────────────
const loginLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { success: false, error: 'Too many login attempts. Try again in 15 minutes.' },
});

// ─── Cookie options ───────────────────────────────────────────────
const cookieOpts = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure:   process.env.NODE_ENV === 'production',
  maxAge:   8 * 60 * 60 * 1000,   // 8 hours in ms
  path:     '/',
};

// ─── POST /api/admin/login ────────────────────────────────────────
router.post('/login', loginLimiter, loginValidation, async (req, res) => {
  const { email, password } = req.body;

  const admin = db.prepare(`SELECT * FROM admins WHERE email = ?`).get(email);
  if (!admin) {
    await bcrypt.compare(password, '$2a$12$invalidhashpadding000000000000000000000000000000000000000');
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = signToken({ id: admin.id, email: admin.email });
  res.cookie('token', token, cookieOpts);
  res.json({
    success: true,
    data:    { id: admin.id, email: admin.email },
    meta:    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
    error:   null,
  });
});

// ─── POST /api/admin/logout ───────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ success: true, data: null, meta: null, error: null });
});

// ─── GET /api/admin/me ────────────────────────────────────────────
router.get('/me', (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  try {
    const jwt     = require('jsonwebtoken');
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, data: decoded, meta: null, error: null });
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

module.exports = router;
