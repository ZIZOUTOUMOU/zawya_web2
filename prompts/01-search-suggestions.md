# Prompt 1 — Inline Search Suggestions

## Bilingual Requirement
- All UI text/labels must show both Arabic (primary) and English (secondary).
  Format: "النص العربي / English Text"
  Examples: "بحث / Search", "ابحث عن كتاب… / Search for a book…", "لا توجد نتائج / No results"
- All new routes in App.jsx must have Arabic + English URL aliases (e.g., /library and /المكتبة)
- Follow the existing App.jsx pattern: Arabic path first, English path second
- Keep RTL layout — English text will naturally appear LTR within RTL context, that's fine

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
- frontend-react/src/services/api.js
- frontend-react/src/pages/library/Library.module.css
- backend/routes/books.js

Part A — Backend: Update the GET /api/search endpoint in backend/routes/books.js.
Change the SELECT to include b.cover_image:
  SELECT b.id, b.title, b.author, b.cover_image
Keep the same WHERE clause and LIMIT 10.

Part B — Frontend: Add autocomplete suggestion dropdown to LibraryPage.jsx.
- Use the existing searchBooks(q) from api.js (it calls /api/search)
- Show a floating dropdown under the search input with up to 6 results
- Each result shows: small cover thumbnail (50px, with onError fallback to a placeholder div with first letter), title, author
- Clicking a suggestion navigates to /library/{id}
- Typing continues to work normally for the full search
- Close dropdown on blur (with 150ms delay for click), on Escape, or when search is cleared
- Debounce the search input by 300ms before querying /api/search
- If search query is less than 2 characters, don't show the dropdown
- If no results, show "لا توجد نتائج / No results"

Part C — Search input placeholder:
placeholder="ابحث عن كتاب… / Search for a book…"

Part D — Styling: Add to Library.module.css:
- .searchWrapper { position: relative; } around the search input+suggestions
- .searchSuggestions { position: absolute; top: 100%; right: 0; left: 0; z-index: 50; ... }
- .suggestionItem, .suggestionCover, .suggestionInfo, .suggestionPlaceholder
- RTL layout (dropdown anchored to the right)
- Use CSS variable conventions: var(--bg-elevated), var(--border), var(--shadow-lg), var(--text), var(--text-soft)

Don't modify any other files. Keep all existing functionality intact.
