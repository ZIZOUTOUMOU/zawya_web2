# Prompt 5 — Grid/List View Toggle + Advanced Sorting

## Bilingual Requirement
- All UI text/labels must show both Arabic (primary) and English (secondary).
  Format: "النص العربي / English Text"
- Grid button: "⊞ شبكة / Grid"
- List button: "☰ قائمة / List"

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
- frontend-react/src/pages/library/LibraryPage.jsx
- frontend-react/src/pages/library/Library.module.css
- frontend-react/src/services/api.js
- frontend-react/src/pages/library/BookDetailPage.jsx

Add a grid/list view toggle to LibraryPage.

Part A — View toggle:
- Add state: const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
- Add toggle buttons in the catalogHead area, next to the filter toggle:
  A button group with two buttons: "⊞ شبكة / Grid" and "☰ قائمة / List"
  Active button gets .btn-primary style, inactive gets .btn-ghost
  Persist preference in localStorage key 'zawiya_library_view'

Part B — List view BookCard:
- Create a separate list-mode card render (inline or as a new sub-component):
  Horizontal layout: small cover thumbnail (80px wide) | title, author, category badge, year, rating on the right
- In list mode, also show:
  - A short description snippet (first 150 chars of book.description with "…" appended)
  - Action buttons: "عرض التفاصيل / View Details" link + "⬇ تحميل PDF / Download PDF" if public domain
- Style: border-bottom separator between rows, full-width cards

Part C — CSS:
- Add .viewToggle, .viewToggleBtn, .bookCardList, .bookCardList_cover, .bookCardList_info, .bookCardList_actions to Library.module.css
- List cards should have hover background highlight

Don't break grid mode or any existing feature. RTL layout.
