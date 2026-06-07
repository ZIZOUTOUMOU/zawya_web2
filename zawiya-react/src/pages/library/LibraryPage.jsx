// frontend-react/src/pages/library/LibraryPage.jsx
// المكتبة الرقمية — Full React port of the existing catalog.
// Connects to the same Express backend via /api/books.

import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getBooks, getCategories, assetUrl } from '../../services/api'
import SectionHero from '../../components/ui/SectionHero'
import styles from './Library.module.css'

// ─── Debounce hook ────────────────────────────────────────────────
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

const SORT_OPTIONS = [
  { value: 'newest',     label: 'الأحدث إضافةً' },
  { value: 'oldest',     label: 'الأقدم إضافةً' },
  { value: 'title_asc',  label: 'العنوان أ–ي' },
  { value: 'title_desc', label: 'العنوان ي–أ' },
  { value: 'author',     label: 'المؤلف' },
  { value: 'pages',      label: 'الأطول' },
]

const LANGUAGES = ['الكل', 'English', 'French', 'Arabic', 'Spanish', 'German']

export default function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // ─── Filter state (synced with URL) ─────────────────────────────
  const [search,     setSearch]     = useState(searchParams.get('search')   || '')
  const [category,   setCategory]   = useState(searchParams.get('category') || '')
  const [language,   setLanguage]   = useState(searchParams.get('language') || '')
  const [yearFrom,   setYearFrom]   = useState(searchParams.get('year_from') || '')
  const [yearTo,     setYearTo]     = useState(searchParams.get('year_to')   || '')
  const [sort,       setSort]       = useState(searchParams.get('sort')      || 'newest')
  const [page,       setPage]       = useState(parseInt(searchParams.get('page') || '1'))

  const [books,       setBooks]       = useState([])
  const [total,       setTotal]       = useState(0)
  const [categories,  setCategories]  = useState([])
  const [loading,     setLoading]     = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const debouncedSearch = useDebounce(search)
  const limit = 20

  // Load categories once
  useEffect(() => {
    getCategories().then(r => { if (r.success) setCategories(r.data) })
  }, [])

  // Fetch books whenever filters change
  useEffect(() => {
    setLoading(true)
    const params = {
      search: debouncedSearch,
      category,
      language: language === 'الكل' ? '' : language,
      year_from: yearFrom,
      year_to:   yearTo,
      sort,
      page,
      limit,
    }
    // Sync URL
    const q = {}
    if (params.search)    q.search    = params.search
    if (params.category)  q.category  = params.category
    if (params.language)  q.language  = params.language
    if (params.year_from) q.year_from = params.year_from
    if (params.year_to)   q.year_to   = params.year_to
    q.sort = params.sort
    q.page = params.page
    setSearchParams(q, { replace: true })

    getBooks(params)
      .then(r => {
        if (r.success) {
          setBooks(r.data)
          setTotal(r.meta?.total || 0)
        }
      })
      .finally(() => setLoading(false))
  }, [debouncedSearch, category, language, yearFrom, yearTo, sort, page])

  const clearFilters = useCallback(() => {
    setSearch(''); setCategory(''); setLanguage('الكل')
    setYearFrom(''); setYearTo(''); setSort('newest'); setPage(1)
  }, [])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const hasFilters = !!(debouncedSearch || category || (language && language !== 'الكل') || yearFrom || yearTo)

  return (
    <div dir="rtl">
      <SectionHero
        title="المكتبة الرقمية"
        subtitle="آلاف الكتب في متناولك"
        description="تصفّح مجموعتنا من كتب المجال العام مع معاينة الصفحات الحقيقية."
        badge="مكتبة مفتوحة"
      />

      <section className={`section ${styles.catalogSection}`}>
        <div className="container">
          <div className={styles.catalogHead}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-muted)' }}>
              {loading
                ? 'جارٍ التحميل…'
                : `${total.toLocaleString('ar-EG')} كتاب`}
            </h2>
            <button
              className={`btn btn-ghost btn-sm ${styles.filterToggle}`}
              onClick={() => setSidebarOpen(o => !o)}
            >
              {sidebarOpen ? 'إخفاء الفلاتر ✕' : 'الفلاتر ⚙'}
            </button>
          </div>

          <div className={`${styles.layout} ${sidebarOpen ? styles.sidebarVisible : ''}`}>

            {/* ── Filters sidebar ── */}
            <aside className={styles.sidebar} aria-label="فلاتر البحث">
              <div className={styles.sidebarHead}>
                <h3>فلاتر البحث</h3>
                {hasFilters && (
                  <button className="btn-link" onClick={clearFilters}>مسح الكل</button>
                )}
              </div>

              {/* Search */}
              <FilterGroup label="البحث">
                <input
                  type="text"
                  className="form-input"
                  placeholder="عنوان، مؤلف، ISBN…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                />
              </FilterGroup>

              {/* Category */}
              <FilterGroup label="التصنيف">
                <div className={styles.checkList}>
                  {categories.map(c => (
                    <label key={c.id} className={styles.checkItem}>
                      <input
                        type="radio"
                        name="category"
                        checked={category === c.name}
                        onChange={() => { setCategory(category === c.name ? '' : c.name); setPage(1) }}
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                  {category && (
                    <button className="btn-link" style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}
                      onClick={() => { setCategory(''); setPage(1) }}>
                      إلغاء التصنيف
                    </button>
                  )}
                </div>
              </FilterGroup>

              {/* Year range */}
              <FilterGroup label="سنة النشر">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="number" className="form-input"
                    placeholder="من" value={yearFrom}
                    min="1400" max="2025"
                    onChange={e => { setYearFrom(e.target.value); setPage(1) }}
                    style={{ flex: 1 }}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>–</span>
                  <input
                    type="number" className="form-input"
                    placeholder="إلى" value={yearTo}
                    min="1400" max="2025"
                    onChange={e => { setYearTo(e.target.value); setPage(1) }}
                    style={{ flex: 1 }}
                  />
                </div>
              </FilterGroup>

              {/* Language */}
              <FilterGroup label="اللغة">
                <select
                  className="form-select"
                  value={language}
                  onChange={e => { setLanguage(e.target.value); setPage(1) }}
                >
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
              </FilterGroup>

              {/* Sort */}
              <FilterGroup label="الترتيب">
                <select
                  className="form-select"
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1) }}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </FilterGroup>
            </aside>

            {/* ── Main grid ── */}
            <div className={styles.main}>
              {/* Active chips */}
              {hasFilters && (
                <div className={styles.chips}>
                  {debouncedSearch && <Chip label={`"${debouncedSearch}"`} onRemove={() => { setSearch(''); setPage(1) }} />}
                  {category  && <Chip label={category}  onRemove={() => { setCategory(''); setPage(1) }} />}
                  {language && language !== 'الكل' && <Chip label={language} onRemove={() => { setLanguage('الكل'); setPage(1) }} />}
                  {yearFrom  && <Chip label={`من ${yearFrom}`}  onRemove={() => { setYearFrom(''); setPage(1) }} />}
                  {yearTo    && <Chip label={`إلى ${yearTo}`}   onRemove={() => { setYearTo('');   setPage(1) }} />}
                </div>
              )}

              {/* Book grid */}
              {loading ? (
                <div className={styles.bookGrid}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`skeleton ${styles.skeletonCard}`} />
                  ))}
                </div>
              ) : books.length === 0 ? (
                <div className={styles.empty}>
                  <span>📚</span>
                  <p>لم يتم العثور على كتب تطابق بحثك.</p>
                  <button className="btn btn-ghost" onClick={clearFilters}>مسح الفلاتر</button>
                </div>
              ) : (
                <div className={styles.bookGrid}>
                  {books.map((book, i) => (
                    <BookCard key={book.id} book={book} delay={i * 30} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  >›</button>
                  {getPaginationRange(page, totalPages).map((p, i) =>
                    p === '…' ? (
                      <span key={`dots-${i}`} style={{ padding: '0 0.25rem', color: 'var(--text-muted)' }}>…</span>
                    ) : (
                      <button
                        key={p}
                        className={p === page ? 'active' : ''}
                        onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      >{p}</button>
                    )
                  )}
                  <button
                    disabled={page === totalPages}
                    onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  >‹</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────

function FilterGroup({ label, children }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Chip({ label, onRemove }) {
  return (
    <span className="badge" style={{ background: 'var(--color-accent)', color: '#fff', gap: '0.4rem', display: 'inline-flex', alignItems: 'center' }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, fontSize: '1rem', lineHeight: 1 }}>×</button>
    </span>
  )
}

function BookCard({ book, delay }) {
  const cover = assetUrl(book.cover_image)
  const rating = Math.round(parseFloat(book.rating) || 0)

  return (
    <Link
      to={`/library/${book.id}`}
      className={`card ${styles.bookCard} fade-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.cover}>
        {cover ? (
          <img src={cover} alt={`غلاف ${book.title}`} loading="lazy"
            onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div className={styles.placeholder}>{book.title?.charAt(0) || '📖'}</div>
        )}
        <div className={styles.quickActions}>
          {(book.first_page_img || book.last_page_img) && (
            <span className={styles.previewBadge} title="يوجد معاينة للصفحات">👁</span>
          )}
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author}</p>
        <div className={styles.meta}>
          <span className="badge">{book.category || 'عام'}</span>
          {book.publication_year && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{book.publication_year}</span>}
          {rating > 0 && (
            <span className="stars" style={{ fontSize: '0.75rem' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < rating ? '' : 'empty'}>★</span>
              ))}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────
function getPaginationRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const range = []
  range.push(1)
  if (current > 3) range.push('…')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) range.push(i)
  if (current < total - 2) range.push('…')
  range.push(total)
  return range
}
