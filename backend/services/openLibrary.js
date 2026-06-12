/**
 * backend/services/openLibrary.js
 * Thin wrapper around the Open Library public APIs.
 */
'use strict';

const fetch = require('node-fetch');
const BASE  = process.env.OPEN_LIBRARY_BASE_URL || 'https://openlibrary.org';

/** Fetch book data by ISBN (10 or 13). Returns raw OL data or null. */
async function fetchByISBN(isbn) {
  try {
    const url = `${BASE}/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
    const res  = await fetch(url, { timeout: 10_000 });
    if (!res.ok) return null;
    const data = await res.json();
    return data[`ISBN:${isbn}`] || null;
  } catch {
    return null;
  }
}

/** Fetch book data by Open Library edition ID (e.g. OL7353617M). */
async function fetchByOLID(olid) {
  try {
    const res = await fetch(`${BASE}/books/${olid}.json`, { timeout: 10_000 });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Build a cover URL from Open Library cover ID. */
const coverUrl      = (id,   size = 'L') => id    ? `https://covers.openlibrary.org/b/id/${id}-${size}.jpg`      : null;
const coverUrlISBN  = (isbn, size = 'L') => isbn  ? `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`  : null;

/**
 * Normalise raw Open Library data into the fields our DB expects.
 * Works for both ISBN and OLID responses (slightly different shapes).
 */
function normalise(raw, olid = null) {
  if (!raw) return null;

  // Authors can come as array of objects or plain names
  const authors = (raw.authors || [])
    .map(a => a.name || a.personal_name || (typeof a === 'string' ? a : null))
    .filter(Boolean)
    .join(', ');

  const isbn13 = raw.identifiers?.isbn_13?.[0] || null;
  const isbn10 = raw.identifiers?.isbn_10?.[0] || null;
  const coverId = raw.cover?.cover_id || raw.covers?.[0] || null;

  let pub_year = null;
  if (raw.publish_date) {
    const m = String(raw.publish_date).match(/\d{4}/);
    if (m) pub_year = parseInt(m[0], 10);
  } else if (raw.first_publish_year) {
    pub_year = raw.first_publish_year;
  }

  return {
    title:            raw.title || null,
    author:           authors   || null,
    description:      raw.notes || raw.subtitle || raw.description?.value || null,
    publisher:        (raw.publishers || []).map(p => p.name || p).join(', ') || null,
    publication_year: pub_year,
    total_pages:      raw.number_of_pages || raw.pagination || null,
    language:         (raw.languages || []).map(l => l.name || l.key?.split('/').pop() || l).join(', ') || 'English',
    isbn10,
    isbn13,
    open_library_id:  olid || raw.key?.split('/').pop() || null,
    cover_image:      coverId
      ? coverUrl(coverId, 'L')
      : (isbn13 || isbn10 ? coverUrlISBN(isbn13 || isbn10, 'L') : null),
  };
}

module.exports = { fetchByISBN, fetchByOLID, normalise, coverUrl, coverUrlISBN };
