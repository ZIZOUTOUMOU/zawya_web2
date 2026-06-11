# Prompt 9c — Language Toggle: Remaining Components

## Error Handling
- If any operation fails, log it, inform the user, and continue
- Never stop mid-task

---

I'm working on D:\zawiya-full. Read these files first:
- frontend-react/src/pages/library/BookDetailPage.jsx
- frontend-react/src/pages/library/ReadingListPage.jsx
- frontend-react/src/pages/library/PdfReader.jsx
- frontend-react/src/components/ErrorBoundary.jsx
- frontend-react/src/components/ui/SectionHero.jsx

## Step 1 — Update BookDetailPage.jsx

Import useT:
```jsx
import { useT } from '../../context/LanguageContext'
```

Add at component top:
```jsx
const t = useT()
```

Replace ALL hardcoded Arabic/bilingual strings with t('bookDetail.xxx') calls:

- document.title: `` `${book.title} — ${t('site.name')}` ``
- Error not found: `t('bookDetail.notFound')`
- Back link: `t('bookDetail.backToLibrary')`
- Cover img alt: `` `${book.title} — ${t('bookDetail.previewTitle')}` ``
- By author prefix: `t('bookDetail.byAuthor')`
- MetaRow labels:
  - 'ISBN-10' → keep as-is (data label)
  - 'ISBN-13' → keep as-is
  - Pages: `t('bookDetail.pages')`
  - Publisher: `t('bookDetail.publisher')`
  - Language: `t('bookDetail.language')`
  - License: `t('bookDetail.license')`
  - Added: `t('bookDetail.addedDate')`
- License fallback: `t('bookDetail.publicDomain')`
- Previews heading: `t('bookDetail.previewTitle')`
- Preview desc: `t('bookDetail.previewDesc')`
- Preview button: `t('bookDetail.previewBtn')`
- Read online: `t('bookDetail.readOnline')`
- Download PDF: `t('bookDetail.downloadPdf')`
- Share: `t('bookDetail.share')`, copied: `t('bookDetail.copied')`
- Reading list buttons:
  - In list: `t('bookDetail.inReadingList')`
  - Not in list: `t('bookDetail.addToList')`
- First page label: `t('bookDetail.firstPage')`
- Last page label: `t('bookDetail.lastPage')`
- Preview unavailable: `t('bookDetail.unavailable')`
- Lightbox nav aria-labels: `t('bookDetail.previous')`, `t('bookDetail.next')`
- Watermark: `t('bookDetail.watermark')`
- Related books heading: `t('bookDetail.relatedTitle')`
- Related loading: `t('bookDetail.relatedLoading')`
- Share text: use t() for the template

Remove `dir="rtl"` from JSX.

Remove ALL "Arabic / English" concatenated strings.

## Step 2 — Update ReadingListPage.jsx

Import useT:
```jsx
import { useT } from '../../context/LanguageContext'
```

Add at component top:
```jsx
const t = useT()
```

Replace:
- document.title: `` `${t('readingList.title')} — ${t('site.name')}` ``
- Heading: `t('readingList.title')`
- Count: `t('readingList.booksCount', { count })`
- Browse link: `t('readingList.browse')`
- Empty state text: `t('readingList.empty')`
- Empty state button: `t('readingList.browse')`
- Remove button: `t('readingList.remove')`
- Remove aria-label: `t('readingList.removeAria', { title: book.title })`
- Loading: `t('readingList.loading')`

Remove `dir="rtl"`.

## Step 3 — Update PdfReader.jsx

Import useT:
```jsx
import { useT } from '../../context/LanguageContext'
```

Add at component top (after hooks):
```jsx
const t = useT()
```

Replace:
- Page label: `t('pdfReader.page')`
- Loading text: `t('pdfReader.loading')`
- Failed text: `t('pdfReader.failed')`
- Retry button: `t('pdfReader.retry')`
- Close title: `t('pdfReader.close')`
- Zoom label: `t('pdfReader.zoom')`
- Fit width button: `t('pdfReader.fitWidth')`
- Fit label (when active): `t('pdfReader.fitLabel')`
- Previous aria-label: `t('bookDetail.previous')`
- Next aria-label: `t('bookDetail.next')`

Remove `dir="rtl"` from toolbar div.

## Step 4 — Update ErrorBoundary.jsx

Read the file first (it may already use class component pattern).

Approach:
- Import `{ useT }` is NOT possible in a class component (hooks only work in function components)
- Instead, import translations directly and read from a static context

Option A: Convert to function component with hooks
Option B: Use a static wrapper

Best approach — convert to use LanguageContext:
```jsx
import { LanguageContext } from '../context/LanguageContext'
```
Then in render:
```jsx
const language = this.context.language || 'ar'
```
And use translations[language] directly.

Or simpler: just import the translations object:
```jsx
import translations from '../translations'
```
And in render:
```jsx
const lang = document.documentElement.getAttribute('lang') || 'ar'
const t = (key) => { /* lookup logic */ }
```

SIMPLEST approach — just use `document.documentElement.getAttribute('lang')`:
```jsx
const lang = document.documentElement.getAttribute('lang') || 'ar'
const t = (key) => {
  const keys = key.split('.')
  let val = translations[lang]
  for (const k of keys) {
    if (val && typeof val === 'object' && k in val) val = val[k]
    else return key
  }
  return typeof val === 'string' ? val : key
}
```

Replace:
- Heading: `t('errorBoundary.heading')`
- Retry button: `t('errorBoundary.retry')`
- Back to library: `t('errorBoundary.backToLibrary')`

Remove any hardcoded `dir="rtl"`.

## Step 5 — Update SectionHero.jsx (if needed)

Read the file. SectionHero likely receives all text as props — so it probably doesn't have hardcoded Arabic text. If it has any default subtitle or badge text, replace with t() calls.

Import:
```jsx
import { useT } from '../../context/LanguageContext'
```

## Step 6 — Build check

Run: `cd frontend-react && npm run build`
Fix any errors. Common issues:
- Missing imports
- Translation key typos
- Incorrect template literal syntax in t() calls
- For class components, hooks won't work — use translations object directly
