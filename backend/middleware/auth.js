/**
 * backend/middleware/auth.js
 * JWT authentication middleware.
 *
 * Usage in routes:
 *   const { requireAuth, signToken } = require('../middleware/auth')
 *   router.get('/secret', requireAuth, handler)
 */
'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET  = process.env.JWT_SECRET  || 'dev_fallback_secret_change_me';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '8h';

// Refuse to start in production with the well-known dev secret —
// admin tokens would be forgeable by anyone who reads the source.
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('[FATAL] JWT_SECRET must be set in production. Refusing to start.');
  process.exit(1);
}

/**
 * Express middleware — reads JWT from httpOnly cookie or Bearer header.
 * On success: attaches req.admin = { id, email, iat, exp }
 * On failure: 401 JSON
 */
function requireAuth(req, res, next) {
  const token =
    (req.cookies?.token) ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

/**
 * Sign a JWT for an admin user.
 * @param {{ id: number, email: string }} payload
 * @returns {string} signed token
 */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

module.exports = { requireAuth, signToken, JWT_SECRET };
