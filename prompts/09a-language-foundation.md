# Prompt 9a — Language Toggle: Foundation (Context + Translations + App)

## Error Handling
- If any operation fails, log it, inform the user, and continue
- Never stop mid-task

---

I'm working on D:\zawiya-full. Read these files first:
- frontend-react/src/App.jsx
- frontend-react/src/styles/global.css

## Step 1 — Create Language Context

Create `frontend-react/src/context/LanguageContext.jsx`:

```jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import translations from '../translations'

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
  const t = useCallback((key, params) => {
    const keys = key.split('.')
    let val = translations[language]
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) val = val[k]
      else return key
    }
    if (typeof val === 'string' && params) {
      return val.replace(/\{(\w+)\}/g, (_, p) => params[p] !== undefined ? params[p] : `{${p}}`)
    }
    return typeof val === 'string' ? val : key
  }, [language])
  return t
}
```

## Step 2 — Create Translations File

Create `frontend-react/src/translations.js`:

```js
const translations = {
  ar: {
    site: { name: 'الزاوية', subtitle: 'المركز الثقافي والتعليمي' },
    nav: {
      home: 'الرئيسية', about: 'التعريف بالزاوية', quranSchool: 'المدرسة القرآنية',
      manuscripts: 'المخطوطات', sewing: 'الخياطة', activities: 'أنشطة مختلفة',
      association: 'الجمعية', library: 'المكتبة', readingList: 'قائمة القراءة',
      contact: 'التواصل', admin: 'لوحة التحكم',
      themeLight: 'تفعيل الوضع الفاتح', themeDark: 'تفعيل الوضع الداكن',
      toggleTheme: 'تبديل المظهر', openMenu: 'فتح القائمة',
      brandAria: 'الزاوية — الصفحة الرئيسية',
    },
    language: { switchTo: 'English', label: 'اللغة' },
    library: {
      heroTitle: 'المكتبة الرقمية', heroSubtitle: 'آلاف الكتب في متناولك',
      heroDesc: 'تصفّح مجموعتنا من كتب المجال العام مع معاينة الصفحات الحقيقية.',
      heroBadge: 'مكتبة مفتوحة',
      searchPlaceholder: 'ابحث عن كتاب…', searchLabel: 'البحث',
      authorLabel: 'المؤلف', authorPlaceholder: 'اسم المؤلف…',
      categoryLabel: 'التصنيف', clearCategory: 'إلغاء التصنيف',
      yearLabel: 'سنة النشر', yearFrom: 'من', yearTo: 'إلى',
      languageLabel: 'اللغة', allLanguages: 'الكل',
      sortLabel: 'الترتيب', sortNewest: 'الأحدث إضافةً', sortOldest: 'الأقدم إضافةً',
      sortTitleAsc: 'العنوان أ–ي', sortTitleDesc: 'العنوان ي–أ',
      sortAuthor: 'المؤلف', sortPages: 'الأطول',
      loading: 'جارٍ التحميل…', booksCount: '{count} كتاب',
      noResults: 'لم يتم العثور على كتب تطابق بحثك.',
      noResultsAuthor: 'لا توجد نتائج لهذا المؤلف',
      clearFilters: 'مسح الكل',
      filterToggleShow: 'الفلاتر', filterToggleHide: 'إخفاء الفلاتر',
      filtersLabel: 'فلاتر البحث', filtersTitle: 'فلاتر البحث',
      noSuggestions: 'لا توجد نتائج',
      viewGrid: 'شبكة', viewList: 'قائمة',
      viewGridAria: 'عرض الشبكة', viewListAria: 'عرض القائمة',
      randomBtn: 'اكتشاف كتاب', randomLoading: 'جارٍ البحث…',
      randomError: 'لا توجد كتب متاحة',
      chipAuthor: '{author} — مؤلف', chipFrom: 'من {year}', chipTo: 'إلى {year}',
      viewDetails: 'عرض التفاصيل', downloadPdf: 'تحميل PDF',
    },
    bookDetail: {
      backToLibrary: 'العودة إلى المكتبة', byAuthor: 'بقلم',
      pages: 'الصفحات', publisher: 'الناشر', language: 'اللغة',
      license: 'الترخيص', publicDomain: 'الملكية العامة', addedDate: 'تاريخ الإضافة',
      previewTitle: 'معاينة الصفحات',
      previewDesc: 'صفحات حقيقية من الكتاب. انقر لتكبير والتنقل بين الصفحات.',
      previewBtn: 'معاينة الصفحات', readOnline: 'قراءة أونلاين',
      downloadPdf: 'تحميل PDF', share: 'مشاركة', copied: 'تم النسخ',
      inReadingList: 'في قائمة القراءة', addToList: 'أضف لقائمة القراءة',
      firstPage: 'الصفحة الأولى', lastPage: 'الصفحة الأخيرة',
      unavailable: 'غير متاحة', previous: 'السابق', next: 'التالي',
      watermark: 'معاينة فقط — تفضل بزيارة المكتبة للاطلاع الكامل',
      notFound: 'الكتاب غير موجود',
      relatedTitle: 'كتب مشابهة', relatedLoading: 'جارٍ التحميل…',
      relatedEmpty: 'لا توجد كتب مشابهة',
    },
    pdfReader: {
      page: 'صفحة:', loading: 'جارٍ تحميل الكتاب…',
      failed: 'فشل تحميل الكتاب', retry: 'إعادة المحاولة',
      close: 'إغلاق', zoom: 'تكبير', fitWidth: 'ملاءمة العرض', fitLabel: 'ملاءمة',
    },
    readingList: {
      title: 'قائمة القراءة', booksCount: '({count} كتاب)',
      empty: 'قائمتك فارغة — أضف كتباً من المكتبة',
      browse: 'تصفح المكتبة', remove: 'إزالة',
      removeAria: 'إزالة {title} من قائمة القراءة', loading: 'جارٍ التحميل…',
    },
    errorBoundary: {
      heading: 'عذراً، حدث خطأ', retry: 'إعادة المحاولة',
      backToLibrary: 'العودة إلى المكتبة',
    },
    hero: {
      homeTitle: 'الزاوية', homeSubtitle: 'المركز الثقافي والتعليمي',
      aboutTitle: 'التعريف بالزاوية', aboutSubtitle: 'نبذة عن المركز',
      quranTitle: 'المدرسة القرآنية', quranSubtitle: 'تعليم القرآن الكريم',
      mssTitle: 'المخطوطات', mssSubtitle: 'مخطوطات نادرة',
      sewingTitle: 'الخياطة', sewingSubtitle: 'فن الخياطة والتطريز',
      activitiesTitle: 'أنشطة مختلفة', activitiesSubtitle: 'فعاليات وبرامج',
      assocTitle: 'الجمعية', assocSubtitle: 'عن الجمعية',
      contactTitle: 'التواصل', contactSubtitle: 'تواصل معنا',
    },
  },
  en: {
    site: { name: 'Al-Zawiya', subtitle: 'Cultural and Educational Center' },
    nav: {
      home: 'Home', about: 'About', quranSchool: 'Quran School',
      manuscripts: 'Manuscripts', sewing: 'Sewing', activities: 'Activities',
      association: 'Association', library: 'Library', readingList: 'Reading List',
      contact: 'Contact', admin: 'Admin',
      themeLight: 'Enable light mode', themeDark: 'Enable dark mode',
      toggleTheme: 'Toggle theme', openMenu: 'Open menu',
      brandAria: 'Al-Zawiya — Home',
    },
    language: { switchTo: 'العربية', label: 'Language' },
    library: {
      heroTitle: 'Digital Library', heroSubtitle: 'Thousands of books at your fingertips',
      heroDesc: 'Browse our collection of public domain books with real page previews.',
      heroBadge: 'Open Library',
      searchPlaceholder: 'Search for a book…', searchLabel: 'Search',
      authorLabel: 'Author', authorPlaceholder: 'Author name…',
      categoryLabel: 'Category', clearCategory: 'Clear category',
      yearLabel: 'Publication Year', yearFrom: 'From', yearTo: 'To',
      languageLabel: 'Language', allLanguages: 'All',
      sortLabel: 'Sort', sortNewest: 'Newest', sortOldest: 'Oldest',
      sortTitleAsc: 'Title A–Z', sortTitleDesc: 'Title Z–A',
      sortAuthor: 'Author', sortPages: 'Longest',
      loading: 'Loading…', booksCount: '{count} books',
      noResults: 'No books match your search.',
      noResultsAuthor: 'No results for this author',
      clearFilters: 'Clear all',
      filterToggleShow: 'Filters', filterToggleHide: 'Hide filters',
      filtersLabel: 'Search Filters', filtersTitle: 'Search Filters',
      noSuggestions: 'No results',
      viewGrid: 'Grid', viewList: 'List',
      viewGridAria: 'Grid view', viewListAria: 'List view',
      randomBtn: 'Discover a Book', randomLoading: 'Finding…',
      randomError: 'No books available',
      chipAuthor: '{author} — Author', chipFrom: 'From {year}', chipTo: 'To {year}',
      viewDetails: 'View Details', downloadPdf: 'Download PDF',
    },
    bookDetail: {
      backToLibrary: '← Back to Library', byAuthor: 'by',
      pages: 'Pages', publisher: 'Publisher', language: 'Language',
      license: 'License', publicDomain: 'Public Domain', addedDate: 'Added',
      previewTitle: 'Page Previews',
      previewDesc: 'Real pages from the book. Click to enlarge and navigate.',
      previewBtn: 'Preview Pages', readOnline: 'Read Online',
      downloadPdf: 'Download PDF', share: 'Share', copied: 'Copied!',
      inReadingList: 'In Reading List', addToList: 'Add to List',
      firstPage: 'First Page', lastPage: 'Last Page',
      unavailable: 'Unavailable', previous: 'Previous', next: 'Next',
      watermark: 'Preview only — visit the library for full access',
      notFound: 'Book not found',
      relatedTitle: 'Related Books', relatedLoading: 'Loading…',
      relatedEmpty: 'No related books',
    },
    pdfReader: {
      page: 'Page:', loading: 'Loading book…',
      failed: 'Failed to load book', retry: 'Retry',
      close: 'Close', zoom: 'Zoom', fitWidth: 'Fit Width', fitLabel: 'Fit',
    },
    readingList: {
      title: 'Reading List', booksCount: '({count} books)',
      empty: 'Your reading list is empty — add books from the library',
      browse: 'Browse Library', remove: 'Remove',
      removeAria: 'Remove {title} from reading list', loading: 'Loading…',
    },
    errorBoundary: {
      heading: 'Something went wrong', retry: 'Retry',
      backToLibrary: 'Back to Library',
    },
    hero: {
      homeTitle: 'Al-Zawiya', homeSubtitle: 'Cultural and Educational Center',
      aboutTitle: 'About', aboutSubtitle: 'About the Center',
      quranTitle: 'Quran School', quranSubtitle: 'Quranic Education',
      mssTitle: 'Manuscripts', mssSubtitle: 'Rare Manuscripts',
      sewingTitle: 'Sewing', sewingSubtitle: 'Sewing & Embroidery',
      activitiesTitle: 'Activities', activitiesSubtitle: 'Events & Programs',
      assocTitle: 'Association', assocSubtitle: 'About the Association',
      contactTitle: 'Contact', contactSubtitle: 'Get in Touch',
    },
  },
}

export default translations
```

## Step 3 — Update App.jsx

Wrap everything in LanguageProvider:
- Import: `import { LanguageProvider } from './context/LanguageContext'`
- Wrap the entire `<BrowserRouter>` block:
```jsx
<BrowserRouter>
  <LanguageProvider>
    <Suspense fallback={<PageLoader />}>
      <Routes>...</Routes>
    </Suspense>
  </LanguageProvider>
</BrowserRouter>
```
- Keep all existing routes and lazy imports exactly as they are

## Step 4 — Update global.css

In `frontend-react/src/styles/global.css`:
- Find `html { direction: rtl; }` and change it to `html[dir="rtl"] { direction: rtl; } html[dir="ltr"] { direction: ltr; }`
- Or simply change `html { direction: rtl; }` to `html { direction: var(--dir, rtl); }`
- The LanguageProvider sets `dir` attribute on `<html>` so CSS should respect it

## Step 5 — Build check

Run: `cd frontend-react && npm run build`
If there are errors, fix them.
