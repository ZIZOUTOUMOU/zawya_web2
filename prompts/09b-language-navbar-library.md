# Prompt 9b — Language Toggle: Navbar + LibraryPage

## Error Handling
- If any operation fails, log it, inform the user, and continue
- Never stop mid-task

---

I'm working on D:\zawiya-full. Read these files first:
- frontend-react/src/components/Navbar.jsx
- frontend-react/src/components/Navbar.module.css
- frontend-react/src/pages/library/LibraryPage.jsx
- frontend-react/src/pages/library/Library.module.css

## Step 1 — Update Navbar.jsx

Import useT at the top:
```jsx
import { useLanguage, useT } from '../context/LanguageContext'
```

Add inside the component function (after the theme toggle logic):
```jsx
const { language, toggleLanguage } = useLanguage()
const t = useT()
```

Replace the NAV_ITEMS array with inline rendering using t():
- Remove the static NAV_ITEMS array entirely
- In the desktop nav, render each link inline using t():
```jsx
<NavLink to="/" className=... end>{t('nav.home')}</NavLink>
<NavLink to="/about" className=...>{t('nav.about')}</NavLink>
<NavLink to="/quran-school" className=...>{t('nav.quranSchool')}</NavLink>
<NavLink to="/manuscripts" className=...>{t('nav.manuscripts')}</NavLink>
<NavLink to="/sewing" className=...>{t('nav.sewing')}</NavLink>
<NavLink to="/activities" className=...>{t('nav.activities')}</NavLink>
<NavLink to="/association" className=...>{t('nav.association')}</NavLink>
<NavLink to="/library" className=...>{t('nav.library')}</NavLink>
<NavLink to="/reading-list" className=...>
  {t('nav.readingList')}
  {listCount > 0 && <span className={styles.badge}>{listCount}</span>}
</NavLink>
<NavLink to="/contact" className=...>{t('nav.contact')}</NavLink>
```

Do the SAME for the mobile menu nav links.

Replace hardcoded strings:
- Brand aria-label: `t('nav.brandAria')`
- Nav aria-label: `t('nav.mainNav')`
- Mobile menu aria-label: `t('nav.mobileMenu')`
- Admin link text: `t('nav.admin')`
- Theme toggle aria-label: use `t('nav.themeDark')` or `t('nav.themeLight')` based on current theme
- Theme toggle title: `t('nav.toggleTheme')`
- Hamburger aria-label: `t('nav.openMenu')`

Add the language toggle button in the `.actions` div, after the theme toggle:
```jsx
<button
  className={styles.langToggle}
  onClick={toggleLanguage}
  aria-label={language === 'ar' ? t('language.switchTo') : t('language.switchTo')}
  title={language === 'ar' ? t('language.switchTo') : t('language.switchTo')}
>
  {language === 'ar' ? t('language.switchTo') : t('language.switchTo')}
</button>
```

Remove the old `dir="rtl"` if any from the JSX.

## Step 2 — Update Navbar.module.css

Add the .langToggle class:
```css
.langToggle {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-soft);
  cursor: pointer;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm, 4px);
  font-size: 0.78rem;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}
.langToggle:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}
```

## Step 3 — Update LibraryPage.jsx

Import useT at the top:
```jsx
import { useT } from '../../context/LanguageContext'
```

Add at the top of the LibraryPage component:
```jsx
const t = useT()
```

Replace ALL hardcoded Arabic strings with t('library.xxx') calls:

SectionHero:
- title: `t('library.heroTitle')`
- subtitle: `t('library.heroSubtitle')`
- description: `t('library.heroDesc')`
- badge: `t('library.heroBadge')`

Catalog head:
- Loading text: `t('library.loading')`
- Books count: `` {total.toLocaleString('ar-EG')} {t('library.booksCount', { count: total })} `` — actually just use `t('library.booksCount', { count: total })`
- View toggle buttons: `t('library.viewGrid')`, `t('library.viewList')`
- Filter toggle: `t('library.filterToggleShow')`/`t('library.filterToggleHide')`

Sidebar:
- Filters title: `t('library.filtersTitle')`
- Clear all: `t('library.clearFilters')`
- Search placeholder: `t('library.searchPlaceholder')`
- Search label: `t('library.searchLabel')`
- Author label: `t('library.authorLabel')`
- Author placeholder: `t('library.authorPlaceholder')`
- Category label: `t('library.categoryLabel')`
- Clear category: `t('library.clearCategory')`
- Year label: `t('library.yearLabel')`
- Year from placeholder: `t('library.yearFrom')`
- Year to placeholder: `t('library.yearTo')`
- Language label: `t('library.languageLabel')`
- Sort label: `t('library.sortLabel')`
- Random button: `t('library.randomBtn')`, loading: `t('library.randomLoading')`, error: `t('library.randomError')`

Sort options — render inline with t():
```jsx
<option value="newest">{t('library.sortNewest')}</option>
<option value="oldest">{t('library.sortOldest')}</option>
<option value="title_asc">{t('library.sortTitleAsc')}</option>
<option value="title_desc">{t('library.sortTitleDesc')}</option>
<option value="author">{t('library.sortAuthor')}</option>
<option value="pages">{t('library.sortPages')}</option>
```
Remove the SORT_OPTIONS array or replace with empty.

Chips:
- Author chip: `t('library.chipAuthor', { author: debouncedAuthor })`
- From chip: `t('library.chipFrom', { year: yearFrom })`
- To chip: `t('library.chipTo', { year: yearTo })`

Empty state:
- No results: `t('library.noResults')`
- No results for author: `t('library.noResultsAuthor')`
- Clear filters button: `t('library.clearFilters')`

BookCard alt text: use template with t()

BookCardList:
- View details: `t('library.viewDetails')`
- Download PDF: `t('library.downloadPdf')`

Search suggestions empty: `t('library.noSuggestions')`

FilterGroup labels:
- `t('library.searchLabel')`
- `t('library.authorLabel')`
- `t('library.categoryLabel')`
- `t('library.yearLabel')`
- `t('library.languageLabel')`
- `t('library.sortLabel')`

Remove ALL `dir="rtl"` from JSX.

Remove ALL bilingual "Arabic / English" concatenated strings like "شبكة / Grid" — replace with single t() call.

Remove the old LANGUAGES array — keep it as-is but change 'الكل' to just the string 'All' (or use t('library.allLanguages') for display and keep the value logic).

## Step 4 — Build check

Run: `cd frontend-react && npm run build`
If there are errors, fix them.
