// Resolve a book's cover image URL.
// Priority: a real uploaded cover_image (via the API origin), else the
// generated first-page cover for books that have sample pages (served from
// the frontend at /book-covers/), else '' (caller shows a placeholder).
import covers from '../data/bookCovers.json'
import { assetUrl } from '../services/api'

export function coverUrl(book) {
  if (!book) return ''
  if (book.cover_image) return assetUrl(book.cover_image)
  const file = book.call_number && covers[book.call_number]
  return file ? `/book-covers/${file}` : ''
}
