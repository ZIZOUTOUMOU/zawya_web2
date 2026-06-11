# Prompt 4 — Embedded PDF.js Reader

## Bilingual Requirement
- All UI text/labels must show both Arabic (primary) and English (secondary).
  Format: "النص العربي / English Text"
- Page indicator: "صفحة / Page:"
- Loading state: "جارٍ تحميل الكتاب… / Loading book…"
- Error state: "تعذر تحميل الكتاب / Failed to load book"
- Retry button: "إعادة المحاولة / Retry"
- Close button: "إغلاق / Close" (or just X icon with title attribute)
- Zoom label: "تكبير / Zoom"
- Fit to width: "ملء العرض / Fit Width"

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
- frontend-react/package.json

Step 0 — Install dependency:
cd frontend-react && npm install pdfjs-dist

Step 1 — Create frontend-react/src/pages/library/PdfReader.jsx:
A modal component that takes props: pdfUrl (string), onClose (function).

Features:
- Uses pdfjs-dist to render each page as a canvas
  import * as pdfjs from 'pdfjs-dist';
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
- Toolbar at top with:
  - Page number input + "/ {totalPages}" — label: "صفحة / Page:"
  - Prev/Next buttons (◀ ▶)
  - Zoom controls (+/- with scale display like "100%")
  - "ملء العرض / Fit Width" toggle button
  - Close button (✕) with title="إغلاق / Close"
- Zoom: scale 0.5 to 2.0, steps of 0.25, show current zoom percentage
- "Fit to width" toggle — calculates scale to fill container width
- Loading spinner while PDF is being parsed (centered, with "جارٍ تحميل الكتاب… / Loading book…")
- Keyboard shortcuts: ArrowRight/ArrowDown/D for next page, ArrowLeft/ArrowUp/A for prev page, +/= for zoom in, -/_ for zoom out, Escape to close
- Clicking on the overlay background (not the reader panel) closes the modal

Error handling:
- If PDF fails to load, show error state: "تعذر تحميل الكتاب / Failed to load book" with a retry button
- Handle missing/corrupt PDFUrl gracefully — don't crash
- Wrap in try/catch and show user-friendly error

Step 2 — Create frontend-react/src/pages/library/PdfReader.module.css:
- Fixed overlay: position fixed, inset 0, background rgba(0,0,0,0.85), z-index 1000
- Reader container: centered, max 90vw × 90vh, flex column
- Toolbar: dark bg (var(--bg-elevated-2)), padding, flex row, gap, RTL layout
- Canvas area: flex-grow, overflow-y auto, centered, padding
- Each canvas: display block, margin auto, box-shadow
- Loading/error states centered in the canvas area
- Responsive: on small screens, toolbar wraps and font sizes shrink

Step 3 — Update BookDetailPage.jsx:
- Import PdfReader from './PdfReader'
- Replace the iframe PDF modal block with:
  {pdfOpen && <PdfReader pdfUrl={assetUrl(book.pdf_file)} onClose={() => setPdfOpen(false)} />}
- Remove the old iframe modal block and its related styles

Keep RTL layout for UI controls. Arabic + English labels for all text.
