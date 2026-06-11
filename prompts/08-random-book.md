# Prompt 8 — Random Book Discovery Button

## Bilingual Requirement
- All UI text/labels must show both Arabic (primary) and English (secondary).
  Format: "النص العربي / English Text"
- Button label: "اكتشف كتاباً / Discover a Book"
- Loading text: "جاري البحث… / Finding…"
- Error text: "لا توجد كتب متاحة / No books available"

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

I'm working on D:\zawiya-full. Read these files first:
- frontend-react/src/pages/library/LibraryPage.jsx
- frontend-react/src/pages/library/Library.module.css
- backend/routes/books.js
- frontend-react/src/services/api.js

Part A — Backend: Add GET /api/books/random to backend/routes/books.js.
Add this route BEFORE /api/books/:id (Express route ordering is critical):
router.get('/random', (req, res) => {
  const row = db.prepare(`
    SELECT b.id, b.title, b.author, b.cover_image
    FROM books b
    WHERE b.is_visible = 1
    ORDER BY RANDOM() LIMIT 1
  `).get();
  if (!row) return res.json(err('No books found', 404));
  res.json(ok(row));
});

Part B — Frontend api.js: Add a new export:
export const getRandomBook = () => api.get(`${BASE}/books/random`);

Part C — Frontend LibraryPage.jsx: Add a "اكتشف كتاباً / Discover a Book" button.
- Add it in the sidebar, below the filters section, in its own card/container
- Button styled as a full-width outlined/accent button (use var(--color-accent))
- Clicking calls getRandomBook() then navigates to /library/{id}
- Show a brief loading state on the button (spinner or "جاري البحث… / Finding…")
- Handle error: if no random book found or API fails, show inline error "لا توجد كتب متاحة / No books available"

Part D — Styling: Add to Library.module.css:
- .randomBookBtn { width: 100%; margin-top: 1rem; padding: 0.75rem; ... }
- Use var(--color-accent) for the border/text color
- .randomBookBtn:disabled { opacity: 0.7; cursor: wait; }

Arabic + English labels. RTL layout. Use existing CSS variable conventions.
