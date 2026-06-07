/**
 * backend/middleware/validate.js
 * express-validator chains for the two main form types.
 */
'use strict';

const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

/** Runs validation and returns 400 if any error found */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

/** Used by POST /api/admin/books and PUT /api/admin/books/:id */
const bookValidation = [
  body('title')
    .trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title too long'),
  body('author')
    .trim().notEmpty().withMessage('Author is required')
    .isLength({ max: 255 }),
  body('category')
    .trim().notEmpty().withMessage('Category is required')
    .isLength({ max: 100 }),
  body('description')
    .optional({ checkFalsy: true })
    .isLength({ max: 4000 })
    .customSanitizer(v =>
      sanitizeHtml(v || '', { allowedTags: [], allowedAttributes: {} })
    ),
  body('isbn10')
    .optional({ checkFalsy: true })
    .matches(/^\d{9}[\dXx]$/).withMessage('Invalid ISBN-10'),
  body('isbn13')
    .optional({ checkFalsy: true })
    .matches(/^\d{13}$/).withMessage('Invalid ISBN-13'),
  body('publication_year')
    .optional({ checkFalsy: true })
    .isInt({ min: -3000, max: 2030 }),
  body('total_pages')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 1000000 }),
  body('language').optional().isLength({ max: 50 }),
  body('publisher').optional().isLength({ max: 255 }),
  body('license_type')
    .optional()
    .isIn(['Public Domain', 'Creative Commons', 'All Rights Reserved']),
  body('rating')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 5 }),
  handleValidation,
];

/** Used by POST /api/admin/login */
const loginValidation = [
  body('email')
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password required (min 6 chars)'),
  handleValidation,
];

module.exports = { bookValidation, loginValidation, handleValidation };
