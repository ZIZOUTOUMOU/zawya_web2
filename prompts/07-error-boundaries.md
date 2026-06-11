# Prompt 7 — Library Error Boundaries

## Bilingual Requirement
- All UI text/labels must show both Arabic (primary) and English (secondary).
  Format: "النص العربي / English Text"
- Error heading: "عذراً، حدث خطأ / Something went wrong"
- Retry button: "إعادة المحاولة / Retry"
- Back to library link: "العودة إلى المكتبة / Back to Library"

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
- frontend-react/src/App.jsx
- frontend-react/src/pages/library/LibraryPage.jsx
- frontend-react/src/pages/library/BookDetailPage.jsx

Part A — Create frontend-react/src/components/ErrorBoundary.jsx:
A React class component that catches render errors in its children.

Features:
- State: hasError (bool), error (object), errorInfo (object)
- static getDerivedStateFromError(error) → { hasError: true, error }
- componentDidCatch(error, errorInfo) — log to console
- Render: if hasError, show a centered error card:
  - A caution icon (inline SVG triangle-exclamation)
  - Heading: "عذراً، حدث خطأ / Something went wrong"
  - Error message in smaller muted text
  - "إعادة المحاولة / Retry" button that calls window.location.reload()
  - "العودة إلى المكتبة / Back to Library" Link to /library
- Otherwise render children normally
- Styling: full-width padded card, centered text, use existing CSS variables

Part B — Update LibraryPage.jsx:
- Import ErrorBoundary
- Wrap the book cards grid area specifically:
  Replace: <div className={s.bookGrid}> with:
  <ErrorBoundary><div className={s.bookGrid}>
  Close the ErrorBoundary after the grid div

Part C — Update BookDetailPage.jsx:
- Import ErrorBoundary
- Wrap the entire page return in <ErrorBoundary>...</ErrorBoundary>

Important: Use a class component (React error boundaries require componentDidCatch).
Arabic + English labels. RTL layout. Use CSS variable conventions.
