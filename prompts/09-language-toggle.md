# Prompt 9 — Language Toggle (Arabic/English Switch)

## Error Handling & Boundaries
- If you encounter an error like "Cannot read [file] (this model does not support image input)",
  do NOT crash or skip the task. Instead:
  1. Inform the user clearly: "This model cannot process image files directly. File [path] was skipped."
  2. Continue with the rest of the task using text-based analysis only
  3. Never assume image content was read — always fall back to file metadata or alt text
- If any other operation fails, log the error, inform the user, and continue with remaining work
- Never stop mid-task — always complete what you can and report what couldn't be done
- After each file is updated, verify it still parses (run `npm run build` at the end)

---

I'm working on D:\zawiya-full. Read ALL of these files first:
- frontend-react/src/App.jsx
- frontend-react/src/components/Navbar.jsx
- frontend-react/src/components/Navbar.module.css
- frontend-react/src/pages/library/LibraryPage.jsx
- frontend-react/src/pages/library/Library.module.css
- frontend-react/src/pages/library/BookDetailPage.jsx
- frontend-react/src/pages/library/BookDetail.module.css
- frontend-react/src/pages/library/ReadingListPage.jsx
- frontend-react/src/pages/library/ReadingList.module.css
- frontend-react/src/pages/library/PdfReader.jsx
- frontend-react/src/pages/library/PdfReader.module.css
- frontend-react/src/components/ErrorBoundary.jsx
- frontend-react/src/components/ui/SectionHero.jsx
- frontend-react/src/styles/global.css
- frontend-react/src/pages/HomePage.jsx
- frontend-react/src/pages/AboutPage.jsx
- frontend-react/src/pages/QuranSchoolPage.jsx
- frontend-react/src/pages/ManuscriptsPage.jsx
- frontend-react/src/pages/SewingPage.jsx
- frontend-react/src/pages/ActivitiesPage.jsx
- frontend-react/src/pages/AssociationPage.jsx
- frontend-react/src/pages/ContactPage.jsx

## Task

Replace all hardcoded bilingual "Arabic / English" text throughout the ENTIRE website with a proper language toggle system. Users should be able to switch between full Arabic mode and full English mode via a toggle in the navbar.

The current approach concatenates both languages everywhere ("قائمة القراءة / Reading List"). Replace this with a React Context-based i18n system.

---

## Step 1 — Create Language Context

Create `frontend-react/src/context/LanguageContext.jsx`:

```jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const LANGUAGE_KEY = 'zawiya_language'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try { return localStorage.getItem(LANGUAGE_KEY) || 'ar' }
    catch { return 'ar' }
  })

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang)
    try { localStorage.setItem(LANGUAGE_KEY, lang) } catch {}
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'ar' ? 'en' : 'ar')
  }, [language, setLanguage])

  // Set <html lang> and <html dir> attributes
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('lang', language)
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export function useT() {
  const { language } = useLanguage()
  // Returns a t(key) function that looks up the current language's translations
  const t = useCallback((key) => {
    const keys = key.split('.')
    let val = translations[language]
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) val = val[k]
      else return key // fallback: return the key itself
    }
    return typeof val === 'string' ? val : key
  }, [language])
  return t
}
```

## Step 2 — Create Translations File

Create `frontend-react/src/translations.js` with EVERY string used across the site:

```js
const translations = {
  ar: {
    // ─── Global ───
    site: {
      name: 'الزاوية',
      subtitle: 'المركز الثقافي والتعليمي',
      titleSuffix: 'الزاوية',
    },
    nav: {
      home: 'الرئيسية',
      about: 'التعريف بالزاوية',
      quranSchool: 'المدرسة القرآنية',
      manuscripts: 'المخطوطات',
      sewing: 'الخياطة',
      activities: 'أنشطة مختلفة',
      association: 'الجمعية',
      library: 'المكتبة',
      readingList: 'قائمة القراءة',
      contact: 'التواصل',
      admin: 'لوحة التحكم',
      themeLight: 'تفعيل الوضع الفاتح',
      themeDark: 'تفعيل الوضع الداكن',
      toggleTheme: 'تبديل المظهر',
      openMenu: 'فتح القائمة',
      mobileMenu: 'القائمة المحمولة',
      mainNav: 'التنقل الرئيسي',
      brandAria: 'الزاوية — الصفحة الرئيسية',
    },
    // ─── Language toggle ───
    language: {
      switchTo: 'English',
      label: 'اللغة',
    },
    // ─── Library ───
    library: {
      heroTitle: 'المكتبة الرقمية',
      heroSubtitle: 'آلاف الكتب في متناولك',
      heroDesc: 'تصفّح مجموعتنا من كتب المجال العام مع معاينة الصفحات الحقيقية.',
      heroBadge: 'مكتبة مفتوحة',
      searchPlaceholder: 'ابحث عن كتاب…',
      searchLabel: 'البحث',
      authorLabel: 'المؤلف',
      authorPlaceholder: 'اسم المؤلف…',
      categoryLabel: 'التصنيف',
      clearCategory: 'إلغاء التصنيف',
      yearLabel: 'سنة النشر',
      yearFrom: 'من',
      yearTo: 'إلى',
      languageLabel: 'اللغة',
      allLanguages: 'الكل',
      sortLabel: 'الترتيب',
      sortNewest: 'الأحدث إضافةً',
      sortOldest: 'الأقدم إضافةً',
      sortTitleAsc: 'العنوان أ–ي',
      sortTitleDesc: 'العنوان ي–أ',
      sortAuthor: 'المؤلف',
      sortPages: 'الأطول',
      loading: 'جارٍ التحميل…',
      booksCount: '{count} كتاب',
      noResults: 'لم يتم العثور على كتب تطابق بحثك.',
      noResultsAuthor: 'لا توجد نتائج لهذا المؤلف',
      clearFilters: 'مسح الكل',
      filterToggleShow: 'الفلاتر',
      filterToggleHide: 'إخفاء الفلاتر',
      filtersLabel: 'فلاتر البحث',
      filtersTitle: 'فلاتر البحث',
      noSuggestions: 'لا توجد نتائج',
      viewGrid: 'شبكة',
      viewList: 'قائمة',
      viewGridAria: 'عرض الشبكة',
      viewListAria: 'عرض القائمة',
      randomBtn: 'اكتشاف كتاب',
      randomLoading: 'جارٍ البحث…',
      randomError: 'لا توجد كتب متاحة',
      // Chips
      chipAuthor: '{author} — مؤلف',
      chipFrom: 'من {year}',
      chipTo: 'إلى {year}',
      // List view
      viewDetails: 'عرض التفاصيل',
      downloadPdf: 'تحميل PDF',
      // Empty state
      emptyEmoji: '📚',
    },
    // ─── Book Detail ───
    bookDetail: {
      backToLibrary: 'العودة إلى المكتبة',
      byAuthor: 'بقلم',
      pages: 'الصفحات',
      publisher: 'الناشر',
      language: 'اللغة',
      license: 'الترخيص',
      publicDomain: 'الملكية العامة',
      addedDate: 'تاريخ الإضافة',
      previewTitle: 'معاينة الصفحات',
      previewDesc: 'صفحات حقيقية من الكتاب. انقر لتكبير والتنقل بين الصفحات.',
      previewBtn: 'معاينة الصفحات',
      readOnline: 'قراءة أونلاين',
      downloadPdf: 'تحميل PDF',
      share: 'مشاركة',
      copied: 'تم النسخ',
      inReadingList: 'في قائمة القراءة',
      addToList: 'أضف لقائمة القراءة',
      firstPage: 'الصفحة الأولى',
      lastPage: 'الصفحة الأخيرة',
      unavailable: 'غير متاحة',
      previous: 'السابق',
      next: 'التالي',
      watermark: 'معاينة فقط — تفضل بزيارة المكتبة للاطلاع الكامل',
      notFound: 'الكتاب غير موجود',
      relatedTitle: 'كتب مشابهة',
      relatedLoading: 'جارٍ التحميل…',
      relatedEmpty: 'لا توجد كتب مشابهة',
    },
    // ─── PDF Reader ───
    pdfReader: {
      page: 'صفحة',
      loading: 'جارٍ تحميل الكتاب…',
      failed: 'فشل تحميل الكتاب',
      retry: 'إعادة المحاولة',
      close: 'إغلاق',
      zoom: 'تكبير',
      fitWidth: 'ملاءمة العرض',
      fitLabel: 'ملاءمة',
    },
    // ─── Reading List ───
    readingList: {
      title: 'قائمة القراءة',
      booksCount: '({count} كتاب)',
      empty: 'قائمتك فارغة — أضف كتباً من المكتبة',
      browse: 'تصفح المكتبة',
      remove: 'إزالة',
      removeAria: 'إزالة {title} من قائمة القراءة',
      loading: 'جارٍ التحميل…',
    },
    // ─── Error Boundary ───
    errorBoundary: {
      heading: 'عذراً، حدث خطأ',
      retry: 'إعادة المحاولة',
      backToLibrary: 'العودة إلى المكتبة',
    },
    // ─── Hero ───
    hero: {
      homeTitle: 'الزاوية',
      homeSubtitle: 'المركز الثقافي والتعليمي',
      homeDesc: 'منصة رقمية للمعرفة والثقافة والفنون.',
      // About page
      aboutTitle: 'التعريف بالزاوية',
      aboutSubtitle: 'نبذة عن المركز',
      // Quran school
      quranTitle: 'المدرسة القرآنية',
      quranSubtitle: 'تعليم القرآن الكريم',
      // Manuscripts
      mssTitle: 'المخطوطات',
      mssSubtitle: 'مخطوطات نادرة',
      // Sewing
      sewingTitle: 'الخياطة',
      sewingSubtitle: 'فن الخياطة والتطريز',
      // Activities
      activitiesTitle: 'أنشطة مختلفة',
      activitiesSubtitle: 'فعاليات وبرامج',
      // Association
      assocTitle: 'الجمعية',
      assocSubtitle: 'عن الجمعية',
      // Contact
      contactTitle: 'التواصل',
      contactSubtitle: 'تواصل معنا',
    },
  },

  en: {
    // ─── Global ───
    site: {
      name: 'Al-Zawiya',
      subtitle: 'Cultural and Educational Center',
      titleSuffix: 'Al-Zawiya',
    },
    nav: {
      home: 'Home',
      about: 'About',
      quranSchool: 'Quran School',
      manuscripts: 'Manuscripts',
      sewing: 'Sewing',
      activities: 'Activities',
      association: 'Association',
      library: 'Library',
      readingList: 'Reading List',
      contact: 'Contact',
      admin: 'Admin',
      themeLight: 'Enable light mode',
      themeDark: 'Enable dark mode',
      toggleTheme: 'Toggle theme',
      openMenu: 'Open menu',
      mobileMenu: 'Mobile menu',
      mainNav: 'Main navigation',
      brandAria: 'Al-Zawiya — Home',
    },
    // ─── Language toggle ───
    language: {
      switchTo: 'العربية',
      label: 'Language',
    },
    // ─── Library ───
    library: {
      heroTitle: 'Digital Library',
      heroSubtitle: 'Thousands of books at your fingertips',
      heroDesc: 'Browse our collection of public domain books with real page previews.',
      heroBadge: 'Open Library',
      searchPlaceholder: 'Search for a book…',
      searchLabel: 'Search',
      authorLabel: 'Author',
      authorPlaceholder: 'Author name…',
      categoryLabel: 'Category',
      clearCategory: 'Clear category',
      yearLabel: 'Publication Year',
      yearFrom: 'From',
      yearTo: 'To',
      languageLabel: 'Language',
      allLanguages: 'All',
      sortLabel: 'Sort',
      sortNewest: 'Newest',
      sortOldest: 'Oldest',
      sortTitleAsc: 'Title A–Z',
      sortTitleDesc: 'Title Z–A',
      sortAuthor: 'Author',
      sortPages: 'Longest',
      loading: 'Loading…',
      booksCount: '{count} books',
      noResults: 'No books match your search.',
      noResultsAuthor: 'No results for this author',
      clearFilters: 'Clear all',
      filterToggleShow: 'Filters',
      filterToggleHide: 'Hide filters',
      filtersLabel: 'Search Filters',
      filtersTitle: 'Search Filters',
      noSuggestions: 'No results',
      viewGrid: 'Grid',
      viewList: 'List',
      viewGridAria: 'Grid view',
      viewListAria: 'List view',
      randomBtn: 'Discover a Book',
      randomLoading: 'Finding…',
      randomError: 'No books available',
      chipAuthor: '{author} — Author',
      chipFrom: 'From {year}',
      chipTo: 'To {year}',
      viewDetails: 'View Details',
      downloadPdf: 'Download PDF',
      emptyEmoji: '📚',
    },
    // ─── Book Detail ───
    bookDetail: {
      backToLibrary: '← Back to Library',
      byAuthor: 'by',
      pages: 'Pages',
      publisher: 'Publisher',
      language: 'Language',
      license: 'License',
      publicDomain: 'Public Domain',
      addedDate: 'Added',
      previewTitle: 'Page Previews',
      previewDesc: 'Real pages from the book. Click to enlarge and navigate.',
      previewBtn: 'Preview Pages',
      readOnline: 'Read Online',
      downloadPdf: 'Download PDF',
      share: 'Share',
      copied: 'Copied!',
      inReadingList: 'In Reading List',
      addToList: 'Add to List',
      firstPage: 'First Page',
      lastPage: 'Last Page',
      unavailable: 'Unavailable',
      previous: 'Previous',
      next: 'Next',
      watermark: 'Preview only — visit the library for full access',
      notFound: 'Book not found',
      relatedTitle: 'Related Books',
      relatedLoading: 'Loading…',
      relatedEmpty: 'No related books',
    },
    // ─── PDF Reader ───
    pdfReader: {
      page: 'Page:',
      loading: 'Loading book…',
      failed: 'Failed to load book',
      retry: 'Retry',
      close: 'Close',
      zoom: 'Zoom',
      fitWidth: 'Fit Width',
      fitLabel: 'Fit',
    },
    // ─── Reading List ───
    readingList: {
      title: 'Reading List',
      booksCount: '({count} books)',
      empty: 'Your reading list is empty — add books from the library',
      browse: 'Browse Library',
      remove: 'Remove',
      removeAria: 'Remove {title} from reading list',
      loading: 'Loading…',
    },
    // ─── Error Boundary ───
    errorBoundary: {
      heading: 'Something went wrong',
      retry: 'Retry',
      backToLibrary: 'Back to Library',
    },
    // ─── Hero ───
    hero: {
      homeTitle: 'Al-Zawiya',
      homeSubtitle: 'Cultural and Educational Center',
      homeDesc: 'A digital platform for knowledge, culture, and the arts.',
      aboutTitle: 'About',
      aboutSubtitle: 'About the Center',
      quranTitle: 'Quran School',
      quranSubtitle: 'Quranic Education',
      mssTitle: 'Manuscripts',
      mssSubtitle: 'Rare Manuscripts',
      sewingTitle: 'Sewing',
      sewingSubtitle: 'Sewing & Embroidery',
      activitiesTitle: 'Activities',
      activitiesSubtitle: 'Events & Programs',
      assocTitle: 'Association',
      assocSubtitle: 'About the Association',
      contactTitle: 'Contact',
      contactSubtitle: 'Get in Touch',
    },
  },
}

export default translations
```

## Step 3 — Wrap App in LanguageProvider

Update `frontend-react/src/App.jsx`:
- Import `{ LanguageProvider }` from `./context/LanguageContext`
- Wrap the `<BrowserRouter>` (or everything inside it) with `<LanguageProvider>`
- Remove the hardcoded `dir="rtl"` from any layout/page components (dir is now set on `<html>`)

## Step 4 — Language Switcher in Navbar

Update `frontend-react/src/components/Navbar.jsx`:
- Import `{ useLanguage, useT }` from `../context/LanguageContext`
- Replace all hardcoded Arabic strings with `t('nav.home')`, `t('nav.library')`, etc.
- Import `translations` directly if needed for nav items structure
- Replace the `NAV_ITEMS` array to use `t()` function (or render inline with t())
- Add a language toggle button in the `.actions` div (next to the theme toggle):
  - Shows "English" when language is 'ar', shows "العربية" when language is 'en'
  - Uses `toggleLanguage` from the context
  - Style it consistently with the theme toggle button
- Update `aria-label` attributes to use translations where dynamic
- Keep the reading list badge logic unchanged

Update `frontend-react/src/components/Navbar.module.css`:
- Add `.langToggle` class matching `.themeToggle` style

## Step 5 — Update LibraryPage.jsx

Replace ALL hardcoded Arabic and bilingual "Arabic / English" strings with `t('library.xxx')` calls.

Import `useT` from language context at the top.

Specific replacements:
- `SectionHero` props: use `t('library.heroTitle')`, `t('library.heroSubtitle')`, etc.
- Search placeholder: `t('library.searchPlaceholder')`
- Author placeholder: `t('library.authorPlaceholder')`
- Author chip: use template literal with `t('library.chipAuthor', { author })`
- Loading text: `t('library.loading')`
- Books count: `t('library.booksCount', { count })`
- View toggle buttons: `t('library.viewGrid')`, `t('library.viewList')`
- Filter labels: `t('library.searchLabel')`, `t('library.authorLabel')`, etc.
- Sort options: use `t('library.sort' + sortKey)` pattern
- Language options: keep 'All' as `t('library.allLanguages')`, other languages stay as-is
- Empty/no results: use `t('library.noResults')`, `t('library.noResultsAuthor')`
- Random button: `t('library.randomBtn')`, `t('library.randomLoading')`, `t('library.randomError')`
- Filter toggle: `t('library.filterToggleShow')` / `t('library.filterToggleHide')`
- Clear/remove: `t('library.clearFilters')`
- Suggestion empty: `t('library.noSuggestions')`
- View details: `t('library.viewDetails')`
- Download PDF: `t('library.downloadPdf')`
- BookCard alt text: use template literal
- Badge fallback: 'عام' or use t() — or just keep 'عام' as a data-driven value
- FilterGroup labels: use t()
- Year placeholders: `t('library.yearFrom')`, `t('library.yearTo')`
- Clear category button: `t('library.clearCategory')`
- Pages count text: use `t('library.booksCount', { count: total })`

Remove ALL `dir="rtl"` from the JSX (the LanguageProvider sets dir on `<html>`).

Remove all bilingual concatenated strings like "شبكة / Grid" — replace with single-language t() call.

## Step 6 — Update BookDetailPage.jsx

Replace ALL hardcoded Arabic and bilingual strings with `t('bookDetail.xxx')` calls.

- `document.title`: Use `book.title` + `' — ' + t('site.name')`
- Error/book not found: `t('bookDetail.notFound')`
- Back link: `t('bookDetail.backToLibrary')`
- alt text for cover: template literal with t()
- By author: `t('bookDetail.byAuthor')`
- Meta row labels: `t('bookDetail.pages')`, `t('bookDetail.publisher')`, `t('bookDetail.language')`, `t('bookDetail.license')`, `t('bookDetail.addedDate')`
- License fallback: `t('bookDetail.publicDomain')`
- Preview title + desc: `t('bookDetail.previewTitle')`, `t('bookDetail.previewDesc')`
- Preview button: `t('bookDetail.previewBtn')`
- Read online: `t('bookDetail.readOnline')`
- Download: `t('bookDetail.downloadPdf')`
- Share: `t('bookDetail.share')`, copied: `t('bookDetail.copied')`
- Reading list buttons: `t('bookDetail.inReadingList')`, `t('bookDetail.addToList')`
- Preview card labels: `t('bookDetail.firstPage')`, `t('bookDetail.lastPage')`, unavailable: `t('bookDetail.unavailable')`
- Lightbox aria-labels: `t('bookDetail.previous')`, `t('bookDetail.next')`
- Watermark: `t('bookDetail.watermark')`
- Related books heading: `t('bookDetail.relatedTitle')`
- Related loading: `t('bookDetail.relatedLoading')`
- Share text: use template with t()
- alt texts: use template literals with t()
- Remove `dir="rtl"`

Remove ALL "Arabic / English" concatenated strings.

## Step 7 — Update ReadingListPage.jsx

Replace ALL hardcoded Arabic and bilingual strings with `t('readingList.xxx')`.

- Page title: `t('readingList.title')` + `t('site.name')`
- Heading: `t('readingList.title')`
- Count: `t('readingList.booksCount', { count })`
- Browse link: `t('readingList.browse')`
- Empty state: `t('readingList.empty')`
- Remove button: `t('readingList.remove')`
- Remove aria-label: `t('readingList.removeAria', { title: book.title })`
- Loading: `t('readingList.loading')`
- Remove `dir="rtl"`

## Step 8 — Update PdfReader.jsx

Replace ALL hardcoded Arabic and bilingual strings with `t('pdfReader.xxx')`.

- Page label: `t('pdfReader.page')`
- Loading text: `t('pdfReader.loading')`
- Failed text: `t('pdfReader.failed')`
- Retry button: `t('pdfReader.retry')`
- Close button title: `t('pdfReader.close')`
- Zoom label: `t('pdfReader.zoom')`
- Fit width: `t('pdfReader.fitWidth')`
- Fit label (when fitWidth active): `t('pdfReader.fitLabel')`
- Nav aria-labels: `t('bookDetail.previous')`, `t('bookDetail.next')` (reuse from bookDetail)
- Remove `dir="rtl"` from toolbar

After updating PdfReader.jsx, also remove the `dir="rtl"` prop from the toolbar div since direction is now on `<html>`.

## Step 9 — Update ErrorBoundary.jsx

Replace ALL hardcoded Arabic and bilingual strings with `t('errorBoundary.xxx')`.

- Heading: `t('errorBoundary.heading')`
- Retry button: `t('errorBoundary.retry')`
- Back to library: `t('errorBoundary.backToLibrary')`
- Remove `dir="rtl"`

## Step 10 — Update SectionHero.jsx

Replace hardcoded Arabic in the component.

Read the file first, then:
- If SectionHero has any hardcoded Arabic labels or default text, replace them with t() calls
- The component receives title/subtitle/description/badge as props so most text is dynamic — only update defaults if any exist

## Step 11 — Update global.css

The `html` element currently has `direction: rtl` hardcoded. Change this to work with the lang attribute approach.

In `frontend-react/src/styles/global.css`:
- Change `html { direction: rtl; }` to `html { direction: var(--dir, rtl); }`
- Or use `[dir="rtl"]` and `[dir="ltr"]` selectors where needed
- The LanguageProvider now sets `dir` attribute on `<html>`, so existing CSS with `dir="rtl"` on individual divs will be overridden

## Step 12 — Build & Verify

Run: `cd frontend-react && npm run build`

Fix any build errors. If imports are missing or translation keys are wrong, fix them.

## Important Notes

- The `useT()` hook returns a `t(key, params?)` function. For template substitutions like `{count}`, the translations use `{count}` in the string. Implement simple interpolation: if `params` is provided, replace `{key}` with `params[key]` in the returned string.
- Navigation items in `NAV_ITEMS` need special handling — either convert NAV_ITEMS to a function that takes `t`, or render them inline. The simplest approach: replace the static NAV_ITEMS array with inline rendering using `t()` calls inside the return JSX.
- The `SORT_OPTIONS` array should become a function or be rendered inline with t().
- `LANGUAGES` — keep as-is, these are data values not UI labels.
- Categories from API — keep as-is, these are data values.
- DO NOT modify any CSS module files except `Navbar.module.css` (for the .langToggle class).
- DO NOT add new dependencies — use React Context only.
- Keep all existing functionality (reading list, PDF viewer, lightbox, etc.) intact.
- The `document.title` updates should use `t('site.name')` as the suffix.
