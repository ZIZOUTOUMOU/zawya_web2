# Prompt 6 — Reading List Dashboard Page

## Bilingual Requirement
- All UI text/labels must show both Arabic (primary) and English (secondary).
  Format: "النص العربي / English Text"
- Page heading: "قائمة القراءة / Reading List"
- Count: "({N} كتاب / {N} books)"
- Empty state: "القائمة فارغة — أضف كتباً من المكتبة / Your reading list is empty — add books from the library"
- Remove button: "إزالة / Remove"
- Browse link: "تصفّح المكتبة / Browse Library"
- Loading: "جارٍ التحميل… / Loading…"

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

Read these files:
- frontend-react/src/pages/library/BookDetailPage.jsx
- frontend-react/src/pages/library/LibraryPage.jsx
- frontend-react/src/pages/library/Library.module.css
- frontend-react/src/App.jsx
- frontend-react/src/components/Navbar.jsx

Part A — Create frontend-react/src/pages/library/ReadingListPage.jsx:
- Reads book IDs from localStorage key 'zawiya_readingList'
- Fetches each book via getBook(id) from api.js (use Promise.allSettled for resilience)
- Displays books in the same grid layout as LibraryPage (reuse BookCard styling pattern)
- Shows count at top: "قائمة القراءة / Reading List ({N} كتاب / {N} books)"
- Empty state: "القائمة فارغة — أضف كتباً من المكتبة / Your reading list is empty — add books from the library"
- Loading state while fetching: show skeleton cards
- Each card has a "إزالة / Remove" button that removes from localStorage and re-renders
- A "تصفّح المكتبة / Browse Library" link back to /library

Part B — Create frontend-react/src/pages/library/ReadingList.module.css:
- Minimal styles, reuse existing patterns from Library.module.css
- Import and compose with existing classes where possible

Part C — Update frontend-react/src/App.jsx:
- Import ReadingListPage lazy:
  const ReadingListPage = lazy(() => import('./pages/library/ReadingListPage'))
- Add new routes inside the <Route element={<Layout />}> block:
  <Route path="/قائمة-القراءة" element={<ReadingListPage />} />
  <Route path="/reading-list"   element={<ReadingListPage />} />
- Also add the missing Arabic book detail route:
  <Route path="/المكتبة/:id" element={<BookDetailPage />} />

Part D — Update frontend-react/src/components/Navbar.jsx:
- Import useLocation for reading list count
- Add a link to the reading list in NAV_ITEMS:
  { label: 'قائمة القراءة / Reading List', path: '/reading-list' }
- Show a small badge with the reading list count next to the link (read from localStorage)

RTL layout. Don't break any existing features.
