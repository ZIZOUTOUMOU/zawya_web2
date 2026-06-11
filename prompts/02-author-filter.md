# Prompt 2 — Author Filter & Author Links

## Bilingual Requirement
- All UI text/labels must show both Arabic (primary) and English (secondary).
  Format: "النص العربي / English Text"
- Author filter label: "المؤلف / Author"
- Author chip: "{author} — تصفية / Filter"
- Empty author results state: "لا توجد نتائج لهذا المؤلف / No results for this author"
- All new routes in App.jsx must have Arabic + English URL aliases
- Follow the existing App.jsx pattern: Arabic path first, English path second

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
- frontend-react/src/pages/library/LibraryPage.jsx
- frontend-react/src/pages/library/Library.module.css
- frontend-react/src/pages/library/BookDetailPage.jsx
- frontend-react/src/pages/library/BookDetail.module.css
- frontend-react/src/services/api.js
- backend/routes/books.js
- frontend-react/src/App.jsx

Part A — Author filter on LibraryPage:
- Add an "author" input in the sidebar filters (between search and category), label: "المؤلف / Author"
- Add author to URL search params sync, filter state, and the /api/books query params
- The backend already supports author in the LIKE search, but add a dedicated author query param to GET /api/books: if author is set, add b.author LIKE ? to the WHERE clause (separate from the general search param)
- Add author chip to the active filters chips row: "{author} — تصفية / Filter"

Part B — Clickable author links:
- In BookCard (LibraryPage.jsx), wrap the author name in a <Link to={`/library?author=${encodeURIComponent(book.author)}`}>
- In BookDetailPage.jsx, make the author name a <Link> to /library?author=...
- When navigated to LibraryPage with ?author=, pre-fill the author filter

Part C — Backend changes:
- In backend/routes/books.js, add a new optional query param author:
  if (author.trim()) {
    where.push('b.author LIKE ?')
    params.push(`%${author.trim()}%`)
  }

Part D — Add Arabic URL alias for book detail in App.jsx:
<Route path="/المكتبة/:id" element={<BookDetailPage />} />

All styling must use CSS modules with existing CSS variable conventions. RTL layout. Don't break any existing features.
