// frontend-react/src/pages/library/BookDetailPage.jsx
// صفحة الكتاب — Book detail view, React port of book.html

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getBook, getRelatedBooks, assetUrl } from '../../services/api'
import { coverUrl } from '../../utils/cover'
import bookPages from '../../data/bookPages.json'
import { useT, useLanguage } from '../../context/LanguageContext'
import PageLoader from '../../components/ui/PageLoader'
import ErrorBoundary from '../../components/ErrorBoundary'
import PdfReader from './PdfReader'
import styles from './BookDetail.module.css'

// ─── Local reading-list (localStorage) ────────────────────────────
const ReadingList = {
  KEY: 'zawiya_readingList',
  getSet() {
    try { return new Set(JSON.parse(localStorage.getItem(this.KEY) || '[]')) }
    catch { return new Set() }
  },
  has(id) { return this.getSet().has(Number(id)) },
  toggle(id) {
    const s = this.getSet()
    id = Number(id)
    s.has(id) ? s.delete(id) : s.add(id)
    localStorage.setItem(this.KEY, JSON.stringify([...s]))
    return s.has(id)
  },
}

// ─── Component ─────────────────────────────────────────────────────
export default function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const t = useT()
  const { language } = useLanguage()

  const [book,         setBook]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [inList,       setInList]       = useState(false)
  const [lightbox,     setLightbox]     = useState(null) // { pages, index }
  const [pdfOpen,      setPdfOpen]      = useState(false)
  const [copied,       setCopied]       = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getBook(id)
      .then(r => {
        if (r.success) {
          setBook(r.data)
          setInList(ReadingList.has(r.data.id))
          document.title = `${r.data.title} — ${t('site.name')}`
        } else {
          setError(r.error || t('bookDetail.notFound'))
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const toggleList = () => {
    const now = ReadingList.toggle(book.id)
    setInList(now)
  }

  const share = async () => {
    const data = {
      title: `${book.title} — ${t('site.name')}`,
      text: `"${book.title}" — ${t('bookDetail.byAuthor')} ${book.author}`,
      url: window.location.href,
    }
    if (navigator.share) {
      try { await navigator.share(data) } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Rendered scanned pages (cover + first + last + extras) for this book, if any
  const pageImgs = (book?.call_number && bookPages[book.call_number] ? bookPages[book.call_number] : [])
    .map((f, i) => ({ url: `/book-pages-img/${f}`, label: t('bookDetail.pageLabel', { n: i + 1 }) }))

  const openPreview = (startIndex = 0) => {
    if (!book) return
    let pages = pageImgs
    if (!pages.length) {
      pages = []
      if (book.first_page_img) pages.push({ url: assetUrl(book.first_page_img), label: t('bookDetail.firstPage') })
      if (book.last_page_img)  pages.push({ url: assetUrl(book.last_page_img),  label: t('bookDetail.lastPage') })
    }
    if (pages.length) setLightbox({ pages, index: startIndex })
  }

  // ─── Keyboard nav in lightbox ──────────────────────────────────
  useEffect(() => {
    if (!lightbox) return
    const onKey = e => {
      if (e.key === 'Escape')      setLightbox(null)
      if (e.key === 'ArrowRight')  setLightbox(lb => lb && { ...lb, index: (lb.index + 1) % lb.pages.length })
      if (e.key === 'ArrowLeft')   setLightbox(lb => lb && { ...lb, index: (lb.index - 1 + lb.pages.length) % lb.pages.length })
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [!!lightbox])

  useEffect(() => {
    if (!pdfOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [pdfOpen])

  if (loading) return <PageLoader />
  if (error)   return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
      <button className="btn btn-primary" onClick={() => navigate('/library')}>{t('bookDetail.backToLibrary')}</button>
    </div>
  )
  if (!book) return null

  const cover      = coverUrl(book)
  const rating     = Math.round(parseFloat(book.rating) || 0)
  const dateLocale = language === 'ar' ? 'ar' : 'en-GB'
  const addedDate  = book.created_at
    ? new Date(book.created_at).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })
    : ''
  const olLink     = book.open_library_id ? `https://openlibrary.org/books/${book.open_library_id}` : null
  const gutLink    = book.gutenberg_id    ? `https://www.gutenberg.org/ebooks/${book.gutenberg_id}`   : null

  return (
    <ErrorBoundary>
    <div>
      <div className={`container ${styles.backBar}`}>
        <Link to="/library" className={styles.backLink}>{t('bookDetail.backToLibrary')}</Link>
      </div>

      <div className={`container ${styles.detail}`}>
        {/* ── Cover ── */}
        <div className={styles.coverWrap}>
          {cover ? (
            <img src={cover} alt={`${book.title} — ${t('bookDetail.previewTitle')}`} className={styles.coverImg} />
          ) : (
            <div className={styles.coverFallback}>
              <span>{book.title?.charAt(0) || '📖'}</span>
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className={styles.info}>
          {book.category && <span className="badge" style={{ marginBottom: '0.5rem' }}>{t.tCat(book.category)}</span>}
          {book.call_number && (
            <span style={{
              display: 'inline-block', background: 'var(--color-accent)',
              color: '#fff', padding: '2px 10px', borderRadius: '4px',
              fontSize: '0.85rem', fontFamily: 'monospace', marginBottom: '0.5rem'
            }}>
              📍 {book.call_number}
            </span>
          )}
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.by}>
            {t('bookDetail.byAuthor')}{' '}
            <Link
              to={`/library?author=${encodeURIComponent(book.author)}`}
              className={styles.authorLink}
            >
              <strong>{book.author}</strong>
            </Link>
            {book.publication_year && <> · {book.publication_year}</>}
          </p>

          {rating > 0 && (
            <div className="stars" style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < rating ? '' : 'empty'}>★</span>
              ))}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginRight: '0.4rem' }}>
                ({book.rating?.toFixed(1)})
              </span>
            </div>
          )}

          {book.description && (
            <p className={styles.desc}>{book.description}</p>
          )}

          {/* Meta grid */}
          <div className={styles.metaGrid}>
            <MetaRow label="ISBN-10"                   value={book.isbn10       ? <code>{book.isbn10}</code>  : '—'} />
            <MetaRow label="ISBN-13"                   value={book.isbn13       ? <code>{book.isbn13}</code>  : '—'} />
            <MetaRow label={t('bookDetail.pages')}     value={book.total_pages  || '—'} />
            <MetaRow label={t('bookDetail.published')}  value={book.publication_year || '—'} />
            <MetaRow label={t('bookDetail.language')}  value={book.language     || '—'} />
            <MetaRow label={t('bookDetail.publisher')} value={book.publisher    || '—'} />
            <MetaRow label={t('bookDetail.license')}   value={book.license_type || t('bookDetail.publicDomain')} />
            <MetaRow label={t('bookDetail.addedDate')} value={addedDate         || '—'} />
          </div>

          {/* Action buttons */}
          <div className={styles.actions}>
            {(pageImgs.length > 0 || book.first_page_img || book.last_page_img) && (
              <button className="btn btn-primary" onClick={() => openPreview(0)}>
                👁 {t('bookDetail.previewBtn')}
              </button>
            )}
            {book.pdf_file && (
              <button className="btn btn-ghost" onClick={() => setPdfOpen(true)}>
                📖 {t('bookDetail.readOnline')}
              </button>
            )}
            {book.pdf_file && book.license_type === 'Public Domain' && (
              <a className="btn btn-ghost" href={assetUrl(book.pdf_file)} download>
                ⬇ {t('bookDetail.downloadPdf')}
              </a>
            )}
            {gutLink && (
              <a className="btn btn-ghost" href={gutLink} target="_blank" rel="noopener noreferrer">
                Gutenberg ↗
              </a>
            )}
            {olLink && (
              <a className="btn btn-ghost" href={olLink} target="_blank" rel="noopener noreferrer">
                Open Library ↗
              </a>
            )}
            <button className="btn btn-ghost" onClick={share}>
              {copied ? `✅ ${t('bookDetail.copied')}` : `🔗 ${t('bookDetail.share')}`}
            </button>
            <button
              className={`btn ${inList ? 'btn-accent' : 'btn-ghost'}`}
              onClick={toggleList}
            >
              {inList ? `🔖 ${t('bookDetail.inReadingList')}` : `🔖 ${t('bookDetail.addToList')}`}
            </button>
          </div>
        </div>
      </div>

      {/* ── Page previews section ── */}
      <div className="container" style={{ marginTop: '3rem', marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display-arabic)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          {t('bookDetail.previewTitle')}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          {t('bookDetail.previewDesc')}
        </p>
        <div className={styles.previewGrid}>
          {pageImgs.length > 0 ? (
            pageImgs.map((p, i) => (
              <PreviewCard
                key={p.url}
                src={p.url}
                label={p.label}
                onClick={() => openPreview(i)}
                available
                bookTitle={book.title}
              />
            ))
          ) : (
            <>
              <PreviewCard
                src={assetUrl(book.first_page_img)}
                label={t('bookDetail.firstPage')}
                onClick={() => openPreview(0)}
                available={!!book.first_page_img}
                bookTitle={book.title}
              />
              <PreviewCard
                src={assetUrl(book.last_page_img)}
                label={t('bookDetail.lastPage')}
                onClick={() => openPreview(book.first_page_img ? 1 : 0)}
                available={!!book.last_page_img}
                bookTitle={book.title}
              />
            </>
          )}
        </div>
      </div>

      {/* ── Related books ── */}
      <RelatedBooks bookId={id} />

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-overlay" />
          <div className={styles.lbContent} onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label={t('bookDetail.closePreview')}>×</button>

            {lightbox.pages.length > 1 && (
              <button
                className={styles.lbNav}
                onClick={() => setLightbox(lb => ({ ...lb, index: (lb.index - 1 + lb.pages.length) % lb.pages.length }))}
                aria-label={t('bookDetail.previous')}
              >›</button>
            )}

            <div className={styles.lbStage}>
              <img
                src={lightbox.pages[lightbox.index].url}
                alt={lightbox.pages[lightbox.index].label}
              />
              <div className={styles.lbWatermark}>{t('bookDetail.watermark')}</div>
            </div>

            {lightbox.pages.length > 1 && (
              <button
                className={styles.lbNav}
                onClick={() => setLightbox(lb => ({ ...lb, index: (lb.index + 1) % lb.pages.length }))}
                aria-label={t('bookDetail.next')}
              >‹</button>
            )}

            <div className={styles.lbLabel}>{lightbox.pages[lightbox.index].label}</div>
          </div>
        </div>
      )}

      {/* ── PDF reader (full book) ── */}
      {pdfOpen && <PdfReader pdfUrl={assetUrl(book.pdf_file)} onClose={() => setPdfOpen(false)} />}
    </div>
    </ErrorBoundary>
  )
}

// ─── Sub-components ────────────────────────────────────────────────

function MetaRow({ label, value }) {
  return (
    <div>
      <span style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
        {label}
      </span>
      <span style={{ fontWeight: 600, wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}

function RelatedBooks({ bookId }) {
  const [books,   setBooks]   = useState([])
  const [loading, setLoading] = useState(true)
  const t = useT()

  useEffect(() => {
    if (!bookId) return
    setLoading(true)
    getRelatedBooks(bookId)
      .then(r => { if (r.success) setBooks(r.data) })
      .finally(() => setLoading(false))
  }, [bookId])

  if (!loading && books.length === 0) return null

  return (
    <div className="container" style={{ marginBottom: '4rem' }}>
      <h2 style={{ fontFamily: 'var(--font-display-arabic)', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
        {t('bookDetail.relatedTitle')}
      </h2>
      <div className={styles.relatedRow}>
        {loading
          ? Array.from({ length: 4 }, (_, i) => (
              <div key={i} className={styles.relatedCardSkeleton}>
                <div className={styles.relatedSkeletonCover} />
                <div className={styles.relatedSkeletonLine} />
                <div className={`${styles.relatedSkeletonLine} ${styles.relatedSkeletonLineShort}`} />
              </div>
            ))
          : books.map(b => (
              <Link key={b.id} to={`/library/${b.id}`} className={styles.relatedCard}>
                <div className={styles.relatedCoverWrap}>
                  {b.cover_image
                    ? <img src={assetUrl(b.cover_image)} alt={b.title} className={styles.relatedCoverImg} loading="lazy" />
                    : <div className={styles.relatedCoverFallback}>{b.title?.charAt(0) || '📖'}</div>
                  }
                </div>
                <div className={styles.relatedInfo}>
                  <span className={styles.relatedTitle}>{b.title}</span>
                  <span className={styles.relatedAuthor}>{b.author}</span>
                </div>
              </Link>
            ))
        }
      </div>
    </div>
  )
}

function PreviewCard({ src, label, onClick, available, bookTitle }) {
  const t = useT()
  return (
    <figure
      className={styles.previewCard}
      onClick={available ? onClick : undefined}
      style={{ cursor: available ? 'zoom-in' : 'default' }}
      role={available ? 'button' : undefined}
      tabIndex={available ? 0 : undefined}
      onKeyDown={available ? e => e.key === 'Enter' && onClick() : undefined}
    >
      <div className={styles.previewFrame}>
        {available ? (
          <img src={src} alt={`${bookTitle} — ${label}`}
            onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', background: 'linear-gradient(135deg, var(--bg-elevated-2), var(--bg-elevated))' }}>
            <span style={{ fontSize: '2rem' }}>📄</span>
            <span style={{ fontSize: '0.85rem' }}>{t('bookDetail.unavailable')}</span>
          </div>
        )}
      </div>
      <figcaption style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-soft)', padding: '0.75rem', fontSize: '0.9rem' }}>
        {label}
      </figcaption>
    </figure>
  )
}
