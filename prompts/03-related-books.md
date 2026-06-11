# Prompt 3 — Related Books Section

## Bilingual Requirement
- All UI text/labels must show both Arabic (primary) and English (secondary).
  Format: "النص العربي / English Text"
- Section heading: "كتب مشابهة / Related Books"
- Empty text: "لا توجد كتب مشابهة / No related books"
- Skeleton: "جارٍ التحميل… / Loading…"

## Error Handling & Boundaries
- If you encounter an error like "Cannot read [file] (this model does not support image input)",
  do NOT crash or skip the task. Instead:
  1. Inform the user clearly: "This model cannot process image files directly. File [path] was skipped."
  2. Continue with the rest of the task using text-based analysis only
  3. For image-dependent features (covers, thumbnails), use existing URL/assetUrl patterns
  4. Never assume image content was read — always fall back to file metadata or alt text
- If any other operation fails, log the error, inform the user, and continue with remaining work
- Never stop mid-task — always complete what you can and report what couldn't be done

---

I'm working on D:\zawiya-full.

Files to read first:
- frontend-react/src/pages/library/BookDetailPage.jsx
- frontend-react/src/pages/library/BookDetail.module.css
- backend/routes/books.js
- frontend-react/src/services/api.js

Part A — Backend: Add GET /api/books/:id/related endpoint to backend/routes/books.js.
- Returns up to 6 books with the same category, excluding the current book
- Must be is_visible = 1
- ORDER BY RANDOM() LIMIT 6
- Route must be defined BEFORE /api/books/:id (or use a separate sub-router) — careful with Express route ordering

Part B — Frontend: Add a "كتب مشابهة / Related Books" section at the bottom of BookDetailPage.jsx.
- Below the preview section, above the lightbox
- Show a "RelatedBooks" sub-component that fetches /api/books/{id}/related
- Display as a horizontal scrollable row of small book cards (cover thumbnail + title + author)
- Each card links to /library/{id}
- Show skeleton while loading
- Hide the section if no related books (empty array)
- Add related-book card styles to BookDetail.module.css

Part C — Frontend api.js: Add a new export:
export const getRelatedBooks = (id) => api.get(`${BASE}/books/${id}/related`);

RTL layout. Use existing CSS variable conventions.
