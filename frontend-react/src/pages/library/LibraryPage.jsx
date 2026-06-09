// frontend-react/src/pages/library/LibraryPage.jsx
// المكتبة الرقمية — Full React port of the existing catalog.
// Connects to the same Express backend via /api/books.

import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { getBooks, getCategories, assetUrl, searchBooks, getRandomBook } from '../../services/api'
import { useT } from '../../context/LanguageContext'
import SectionHero from '../../components/ui/SectionHero'
import ErrorBoundary from '../../components/ErrorBoundary'
import styles from './Library.module.css'

// ─── Debounce hook ────────────────────────────────────────────────
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

const LANGUAGES = ['English', 'French', 'Arabic', 'Spanish', 'German']

export default function LibraryPage() {
  const t = useT()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // ─── Filter state (synced with URL) ─────────────────────────────
  const [search,     setSearch]     = useState(searchParams.get('search')   || '')
  const [author,     setAuthor]     = useState(searchParams.get('author')   || '')
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
  const [viewMode,    setViewMode]    = useState(() => localStorage.getItem('zawiya_library_view') || 'grid')

  const [randomLoading, setRandomLoading] = useState(false)
  const [randomError,   setRandomError]   = useState('')

  const setView = (mode) => {
    setViewMode(mode)
    localStorage.setItem('zawiya_library_view', mode)
  }

  // ─── Autocomplete state ──────────────────────────────────────────
  const [suggestions,     setSuggestions]     = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const blurTimeout      = useRef(null)
  const searchFocusedRef = useRef(false)

  const debouncedSearch = useDebounce(search)
  const debouncedAuthor = useDebounce(author)
  const limit = 20

  // Fetch inline search suggestions
  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setSuggestions([])
      return
    }
    searchBooks(debouncedSearch).then(r => {
      if (r.success) {
        setSuggestions(r.data.slice(0, 6))
        if (searchFocusedRef.current) setShowSuggestions(true)
      }
    })
  }, [debouncedSearch])

  // Load categories once
  useEffect(() => {
    getCategories().then(r => { if (r.success) setCategories(r.data) })
  }, [])

  // Sync URL author param → filter state (enables <Link> navigation to pre-fill the author filter)
  const urlAuthor = searchParams.get('author') || ''
  useEffect(() => { setAuthor(urlAuthor) }, [urlAuthor])

  // Fetch books whenever filters change
  useEffect(() => {
    setLoading(true)
    const params = {
      search: debouncedSearch,
      author: debouncedAuthor,
      category,
      language,
      year_from: yearFrom,
      year_to:   yearTo,
      sort,
      page,
      limit,
    }
    // Sync URL
    const q = {}
    if (params.search)    q.search    = params.search
    if (params.author)    q.author    = params.author
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
  }, [debouncedSearch, debouncedAuthor, category, language, yearFrom, yearTo, sort, page])

  const discoverRandom = async () => {
    setRandomLoading(true)
    setRandomError('')
    const r = await getRandomBook()
    setRandomLoading(false)
    if (r.success && r.data?.id) {
      navigate(`/library/${r.data.id}`)
    } else {
      setRandomError(t('library.randomError'))
    }
  }

  const clearFilters = useCallback(() => {
    setSearch(''); setAuthor(''); setCategory(''); setLanguage('')
    setYearFrom(''); setYearTo(''); setSort('newest'); setPage(1)
  }, [])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const hasFilters = !!(debouncedSearch || debouncedAuthor || category || language || yearFrom || yearTo)

  return (
    <div>
      <SectionHero
        title={t('library.heroTitle')}
        subtitle={t('library.heroSubtitle')}
        description={t('library.heroDesc')}
        badge={t('library.heroBadge')}
      />

      <section className={`section ${styles.catalogSection}`}>
        <div className="container">
          <div className={styles.catalogHead}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-muted)' }}>
              {loading
                ? t('library.loading')
                : t('library.booksCount', { count: total })}
            </h2>
            <div className={styles.catalogHeadRight}>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? 'btn btn-primary' : 'btn btn-ghost'}`}
                  onClick={() => setView('grid')}
                  aria-label={t('library.viewGridAria')}
                >
                  ⊞ {t('library.viewGrid')}
                </button>
                <button
                  className={`${styles.viewToggleBtn} ${viewMode === 'list' ? 'btn btn-primary' : 'btn btn-ghost'}`}
                  onClick={() => setView('list')}
                  aria-label={t('library.viewListAria')}
                >
                  ☰ {t('library.viewList')}
                </button>
              </div>
              <button
                className={`btn btn-ghost btn-sm ${styles.filterToggle}`}
                onClick={() => setSidebarOpen(o => !o)}
              >
                {sidebarOpen ? t('library.filterToggleHide') : t('library.filterToggleShow')}
              </button>
            </div>
          </div>

          <div className={`${styles.layout} ${sidebarOpen ? styles.sidebarVisible : ''}`}>

            {/* ── Filters sidebar ── */}
            <aside className={styles.sidebar} aria-label={t('library.filtersLabel')}>
              <div className={styles.sidebarHead}>
                <h3>{t('library.filtersTitle')}</h3>
                {hasFilters && (
                  <button className="btn-link" onClick={clearFilters}>{t('library.clearFilters')}</button>
                )}
              </div>

              {/* Search */}
              <FilterGroup label={t('library.searchLabel')}>
                <div className={styles.searchWrapper}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={t('library.searchPlaceholder')}
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1) }}
                    onFocus={() => {
                      searchFocusedRef.current = true
                      clearTimeout(blurTimeout.current)
                      if (search.length >= 2) setShowSuggestions(true)
                    }}
                    onBlur={() => {
                      searchFocusedRef.current = false
                      blurTimeout.current = setTimeout(() => setShowSuggestions(false), 150)
                    }}
                    onKeyDown={e => { if (e.key === 'Escape') setShowSuggestions(false) }}
                  />
                  {showSuggestions && debouncedSearch.length >= 2 && (
                    <div className={styles.searchSuggestions}>
                      {suggestions.length === 0 ? (
                        <div className={styles.suggestionEmpty}>{t('library.noSuggestions')}</div>
                      ) : (
                        suggestions.map(s => (
                          <SuggestionItem
                            key={s.id}
                            suggestion={s}
                            onSelect={() => {
                              clearTimeout(blurTimeout.current)
                              setShowSuggestions(false)
                              navigate(`/library/${s.id}`)
                            }}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              </FilterGroup>

              {/* Author */}
              <FilterGroup label={t('library.authorLabel')}>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t('library.authorPlaceholder')}
                  value={author}
                  onChange={e => { setAuthor(e.target.value); setPage(1) }}
                />
              </FilterGroup>

              {/* Category */}
              <FilterGroup label={t('library.categoryLabel')}>
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
                      {t('library.clearCategory')}
                    </button>
                  )}
                </div>
              </FilterGroup>

              {/* Year range */}
              <FilterGroup label={t('library.yearLabel')}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="number" className="form-input"
                    placeholder={t('library.yearFrom')} value={yearFrom}
                    min="1400" max="2025"
                    onChange={e => { setYearFrom(e.target.value); setPage(1) }}
                    style={{ flex: 1 }}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>–</span>
                  <input
                    type="number" className="form-input"
                    placeholder={t('library.yearTo')} value={yearTo}
                    min="1400" max="2025"
                    onChange={e => { setYearTo(e.target.value); setPage(1) }}
                    style={{ flex: 1 }}
                  />
                </div>
              </FilterGroup>

              {/* Language */}
              <FilterGroup label={t('library.languageLabel')}>
                <select
                  className="form-select"
                  value={language}
                  onChange={e => { setLanguage(e.target.value); setPage(1) }}
                >
                  <option value="">{t('library.allLanguages')}</option>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </FilterGroup>

              {/* Sort */}
              <FilterGroup label={t('library.sortLabel')}>
                <select
                  className="form-select"
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1) }}
                >
                  <option value="newest">{t('library.sortNewest')}</option>
                  <option value="oldest">{t('library.sortOldest')}</option>
                  <option value="title_asc">{t('library.sortTitleAsc')}</option>
                  <option value="title_desc">{t('library.sortTitleDesc')}</option>
                  <option value="author">{t('library.sortAuthor')}</option>
                  <option value="pages">{t('library.sortPages')}</option>
                </select>
              </FilterGroup>

              {/* Random book discovery */}
              <div className={styles.randomBookCard}>
                <button
                  className={styles.randomBookBtn}
                  onClick={discoverRandom}
                  disabled={randomLoading}
                  aria-label={t('library.randomBtn')}
                >
                  {randomLoading
                    ? `⏳ ${t('library.randomLoading')}`
                    : `🎲 ${t('library.randomBtn')}`}
                </button>
                {randomError && (
                  <p className={styles.randomError}>{randomError}</p>
                )}
              </div>
            </aside>

            {/* ── Main grid ── */}
            <div className={styles.main}>
              {/* Active chips */}
              {hasFilters && (
                <div className={styles.chips}>
                  {debouncedSearch && <Chip label={`"${debouncedSearch}"`} onRemove={() => { setSearch(''); setPage(1) }} />}
                  {debouncedAuthor && <Chip label={t('library.chipAuthor', { author: debouncedAuthor })} onRemove={() => { setAuthor(''); setPage(1) }} />}
                  {category  && <Chip label={category}  onRemove={() => { setCategory(''); setPage(1) }} />}
                  {language  && <Chip label={language}  onRemove={() => { setLanguage(''); setPage(1) }} />}
                  {yearFrom  && <Chip label={t('library.chipFrom', { year: yearFrom })}  onRemove={() => { setYearFrom(''); setPage(1) }} />}
                  {yearTo    && <Chip label={t('library.chipTo', { year: yearTo })}      onRemove={() => { setYearTo('');   setPage(1) }} />}
                </div>
              )}

              {/* Book grid / list */}
              {loading ? (
                viewMode === 'grid' ? (
                  <div className={styles.bookGrid}>
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className={`skeleton ${styles.skeletonCard}`} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.bookList}>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`skeleton ${styles.skeletonListRow}`} />
                    ))}
                  </div>
                )
              ) : books.length === 0 ? (
                <div className={styles.empty}>
                  <span>📚</span>
                  <p>{debouncedAuthor
                    ? t('library.noResultsAuthor')
                    : t('library.noResults')}</p>
                  <button className="btn btn-ghost" onClick={clearFilters}>{t('library.clearFilters')}</button>
                </div>
              ) : viewMode === 'grid' ? (
                <ErrorBoundary>
                  <div className={styles.bookGrid}>
                    {books.map((book, i) => (
                      <BookCard key={book.id} book={book} delay={i * 30} />
                    ))}
                  </div>
                </ErrorBoundary>
              ) : (
                <div className={styles.bookList}>
                  {books.map((book, i) => (
                    <BookCardList key={book.id} book={book} delay={i * 30} />
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

function SuggestionItem({ suggestion, onSelect }) {
  const cover = assetUrl(suggestion.cover_image)
  const [imgError, setImgError] = useState(false)
  return (
    <div
      className={styles.suggestionItem}
      onMouseDown={e => { e.preventDefault(); onSelect() }}
    >
      <div className={styles.suggestionCover}>
        {cover && !imgError ? (
          <img src={cover} alt="" onError={() => setImgError(true)} />
        ) : (
          <div className={styles.suggestionPlaceholder}>
            {suggestion.title?.charAt(0) || '?'}
          </div>
        )}
      </div>
      <div className={styles.suggestionInfo}>
        <span className={styles.suggestionTitle}>{suggestion.title}</span>
        <span className={styles.suggestionAuthor}>{suggestion.author}</span>
      </div>
    </div>
  )
}

function BookCard({ book, delay }) {
  const t = useT()
  const navigate = useNavigate()
  const cover = assetUrl(book.cover_image)
  const rating = Math.round(parseFloat(book.rating) || 0)

  return (
    <div
      role="article"
      tabIndex={0}
      className={`card ${styles.bookCard} fade-up`}
      style={{ animationDelay: `${delay}ms`, cursor: 'pointer' }}
      onClick={() => navigate(`/library/${book.id}`)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/library/${book.id}`) }}
    >
      <div className={styles.cover}>
        {cover ? (
          <img src={cover} alt={t('library.coverAlt', { title: book.title })} loading="lazy"
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
        <p className={styles.author}>
          <Link
            to={`/library?author=${encodeURIComponent(book.author)}`}
            className={styles.authorLink}
            onClick={e => e.stopPropagation()}
          >
            {book.author}
          </Link>
        </p>
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
    </div>
  )
}

function BookCardList({ book, delay }) {
  const t = useT()
  const navigate = useNavigate()
  const cover = assetUrl(book.cover_image)
  const rating = Math.round(parseFloat(book.rating) || 0)
  const desc = book.description
    ? book.description.length > 150
      ? book.description.slice(0, 150) + '…'
      : book.description
    : ''
  const isPublicDomain = book.license_type === 'Public Domain'

  return (
    <div
      role="article"
      tabIndex={0}
      className={`${styles.bookCardList} fade-up`}
      style={{ animationDelay: `${delay}ms`, cursor: 'pointer' }}
      onClick={() => navigate(`/library/${book.id}`)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/library/${book.id}`) }}
    >
      <div className={styles.bookCardListCover}>
        {cover ? (
          <img src={cover} alt={t('library.coverAlt', { title: book.title })} loading="lazy"
            onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div className={styles.bookCardListPlaceholder}>
            {book.title?.charAt(0) || '📖'}
          </div>
        )}
      </div>

      <div className={styles.bookCardListInfo}>
        <h3 className={styles.bookCardListTitle}>{book.title}</h3>
        <p className={styles.bookCardListAuthor}>
          <Link
            to={`/library?author=${encodeURIComponent(book.author)}`}
            className={styles.authorLink}
            onClick={e => e.stopPropagation()}
          >
            {book.author}
          </Link>
        </p>
        <div className={styles.bookCardListMeta}>
          <span className="badge">{book.category || 'عام'}</span>
          {book.publication_year && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{book.publication_year}</span>
          )}
          {rating > 0 && (
            <span className="stars" style={{ fontSize: '0.75rem' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < rating ? '' : 'empty'}>★</span>
              ))}
            </span>
          )}
        </div>
        {desc && <p className={styles.bookCardListDesc}>{desc}</p>}
      </div>

      <div className={styles.bookCardListActions} onClick={e => e.stopPropagation()}>
        <Link
          to={`/library/${book.id}`}
          className="btn btn-ghost btn-sm"
          onClick={e => e.stopPropagation()}
        >
          {t('library.viewDetails')}
        </Link>
        {book.pdf_file && isPublicDomain && (
          <a
            className="btn btn-ghost btn-sm"
            href={assetUrl(book.pdf_file)}
            download
            onClick={e => e.stopPropagation()}
          >
            ⬇ {t('library.downloadPdf')}
          </a>
        )}
      </div>
    </div>
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
