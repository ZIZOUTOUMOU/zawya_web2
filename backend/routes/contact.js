/**
 * backend/routes/contact.js
 * Public contact form endpoint.
 *
 * POST /api/contact → store a visitor message in the `messages` table.
 *
 * All responses use the envelope:
 *   { success: true,  data: ..., meta: ... }
 *   { success: false, error: "message" }
 */
'use strict';

const express   = require('express');
const router    = express.Router();
const rateLimit = require('express-rate-limit');
const db        = require('../database/db');
const { contactValidation } = require('../middleware/validate');

// ─── Rate limiter: 5 submissions per 15 min per IP ────────────────
const contactLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             5,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { success: false, data: null, error: 'Too many messages. Try again in 15 minutes.' },
});

// ─── POST /api/contact ────────────────────────────────────────────
router.post('/contact', contactLimiter, contactValidation, (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    const result = db.prepare(`
      INSERT INTO messages (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, email, phone || null, subject || null, message);

    res.status(201).json({
      success: true,
      data:    { id: result.lastInsertRowid },
      meta:    null,
      error:   null,
    });
  } catch (e) {
    console.error('/api/contact error:', e.message);
    res.status(500).json({ success: false, data: null, error: 'Database error' });
  }
});

module.exports = router;
