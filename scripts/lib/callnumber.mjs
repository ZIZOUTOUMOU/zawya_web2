// Shared call-number helpers for the cover/page renderers.
//
// The library catalog stores each book's shelf mark in `book_number`, which the
// seed copies verbatim into the `call_number` column the UI looks up. Different
// DDC series were entered with different orientations:
//   413 series -> "413/24"   (ddc first)
//   414 series -> "01/414"   (ddc last)
// So we read the real call_numbers from the catalog and reproduce them exactly,
// rather than assuming one format.
import { readFileSync } from 'node:fs';

const CATALOG = 'backend/database/extracted_books.json';

/** @returns {{ realSet: Set<string>, orient: Record<string,'ddc-first'|'ddc-last'> }} */
export function loadCatalogKeys() {
  const raw = JSON.parse(readFileSync(CATALOG, 'utf8'));
  const arr = Array.isArray(raw) ? raw : (raw.books || []);
  const realSet = new Set();
  const orient = {};
  for (const b of arr) {
    const cn = String(b.book_number || '').trim();
    if (!cn) continue;
    realSet.add(cn);
    const parts = cn.split('/');
    if (parts.length !== 2) continue;
    const [a, z] = parts;
    if (/^\d{3}$/.test(a) && !/^\d{3}$/.test(z))      orient[a] ??= 'ddc-first';
    else if (/^\d{3}$/.test(z) && !/^\d{3}$/.test(a)) orient[z] ??= 'ddc-last';
  }
  return { realSet, orient };
}

/**
 * Map a PDF named <ddc>-<seq> to the book's real call_number.
 * Prefers an exact catalog match; otherwise falls back to the series'
 * known orientation (default: ddc-first, the legacy 413 behaviour).
 */
export function callNumberFor(ddc, seq, realSet, orient) {
  const ddcFirst = `${ddc}/${seq}`; // 413/01
  const ddcLast  = `${seq}/${ddc}`; // 01/414
  if (realSet.has(ddcFirst)) return ddcFirst;
  if (realSet.has(ddcLast))  return ddcLast;
  return orient[ddc] === 'ddc-last' ? ddcLast : ddcFirst;
}
