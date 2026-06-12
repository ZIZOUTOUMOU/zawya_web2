// frontend-react/src/pages/library/BookDetailPage.jsx
// صفحة الكتاب — Book detail view, React port of book.html

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getBook, assetUrl } from '../../services/api'
import PageLoader from '../../components/ui/PageLoader'
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
          document.title = `${r.data.title} — المكتبة الرقمية`
        } else {
          setError(r.error || 'الكتاب غير موجود')
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
      title: book.title + ' — المكتبة الرقمية',
      text: `اكتشف "${book.title}" بقلم ${book.author}`,
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

  const openPreview = (startIndex = 0) => {
    if (!book) return
    const pages = []
    if (book.first_page_img) pages.push({ url: assetUrl(book.first_page_img), label: 'الصفحة الأولى' })
    if (book.last_page_img)  pages.push({ url: assetUrl(book.last_page_img),  label: 'الصفحة الأخيرة' })
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
      <button className="btn btn-primary" onClick={() => navigate('/library')}>← العودة للمكتبة</button>
    </div>
  )
  if (!book) return null

  const cover      = assetUrl(book.cover_image)
  const rating     = Math.round(parseFloat(book.rating) || 0)
  const addedDate  = book.created_at
    ? new Date(book.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''
  const olLink     = book.open_library_id ? `https://openlibrary.org/books/${book.open_library_id}` : null
  const gutLink    = book.gutenberg_id    ? `https://www.gutenberg.org/ebooks/${book.gutenberg_id}`   : null

  return (
    <div dir="rtl">
      <div className={`container ${styles.backBar}`}>
        <Link to="/library" className={styles.backLink}>← العودة إلى المكتبة</Link>
      </div>

      <div className={`container ${styles.detail}`}>
        {/* ── Cover ── */}
        <div className={styles.coverWrap}>
          {cover ? (
            <img src={cover} alt={`غلاف ${book.title}`} className={styles.coverImg} loading="lazy" />
          ) : (
            <div className={styles.coverFallback}>
              <span>{book.title?.charAt(0) || '📖'}</span>
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className={styles.info}>
          {book.category && <span className="badge" style={{ marginBottom: '0.5rem' }}>{book.category}</span>}
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.by}>
            بقلم <strong>{book.author}</strong>
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
            <MetaRow label="ISBN-10"     value={book.isbn10       ? <code>{book.isbn10}</code>  : '—'} />
            <MetaRow label="ISBN-13"     value={book.isbn13       ? <code>{book.isbn13}</code>  : '—'} />
            <MetaRow label="الصفحات"     value={book.total_pages  || '—'} />
            <MetaRow label="النشر"       value={book.publication_year || '—'} />
            <MetaRow label="اللغة"       value={book.language     || '—'} />
            <MetaRow label="الناشر"      value={book.publisher    || '—'} />
            <MetaRow label="الترخيص"     value={book.license_type || 'الملكية العامة'} />
            <MetaRow label="تاريخ الإضافة" value={addedDate      || '—'} />
          </div>

          {/* Action buttons */}
          <div className={styles.actions}>
            {(book.first_page_img || book.last_page_img) && (
              <button className="btn btn-primary" onClick={() => openPreview(0)}>
                👁 معاينة الصفحات
              </button>
            )}
            {book.pdf_file && (
              <button className="btn btn-ghost" onClick={() => setPdfOpen(true)}>
                📖 قراءة أونلاين
              </button>
            )}
            {book.pdf_file && book.license_type === 'Public Domain' && (
              <a className="btn btn-ghost" href={assetUrl(book.pdf_file)} download>
                ⬇ تحميل PDF
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
              {copied ? '✅ تم النسخ' : '🔗 مشاركة'}
            </button>
            <button
              className={`btn ${inList ? 'btn-accent' : 'btn-ghost'}`}
              onClick={toggleList}
            >
              {inList ? '🔖 في قائمة القراءة' : '🔖 أضف لقائمة القراءة'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Page previews section ── */}
      <div className="container" style={{ marginTop: '3rem', marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display-arabic)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          معاينة الصفحات
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          صفحات حقيقية من الكتاب. انقر لتكبير والتنقل بين الصفحات.
        </p>
        <div className={styles.previewGrid}>
          <PreviewCard
            src={assetUrl(book.first_page_img)}
            label="الصفحة الأولى"
            onClick={() => openPreview(0)}
            available={!!book.first_page_img}
            bookTitle={book.title}
          />
          <PreviewCard
            src={assetUrl(book.last_page_img)}
            label="الصفحة الأخيرة"
            onClick={() => openPreview(book.first_page_img ? 1 : 0)}
            available={!!book.last_page_img}
            bookTitle={book.title}
          />
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-overlay" />
          <div className={styles.lbContent} onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>×</button>

            {lightbox.pages.length > 1 && (
              <button
                className={styles.lbNav}
                onClick={() => setLightbox(lb => ({ ...lb, index: (lb.index - 1 + lb.pages.length) % lb.pages.length }))}
                aria-label="السابق"
              >›</button>
            )}

            <div className={styles.lbStage}>
              <img
                src={lightbox.pages[lightbox.index].url}
                alt={lightbox.pages[lightbox.index].label}
                loading="lazy"
              />
              <div className={styles.lbWatermark}>معاينة فقط — تفضل بزيارة المكتبة للاطلاع الكامل</div>
            </div>

            {lightbox.pages.length > 1 && (
              <button
                className={styles.lbNav}
                onClick={() => setLightbox(lb => ({ ...lb, index: (lb.index + 1) % lb.pages.length }))}
                aria-label="التالي"
              >‹</button>
            )}

            <div className={styles.lbLabel}>{lightbox.pages[lightbox.index].label}</div>
          </div>
        </div>
      )}

      {/* ── PDF modal ── */}
      {pdfOpen && book.pdf_file && (
        <div className="lightbox" onClick={() => setPdfOpen(false)}>
          <div className="lightbox-overlay" />
          <div className={styles.pdfModal} onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setPdfOpen(false)}>×</button>
            <iframe
              src={`${assetUrl(book.pdf_file)}#toolbar=1&navpanes=0&zoom=page-fit`}
              title="قارئ PDF"
              style={{ width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </div>
      )}
    </div>
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

function PreviewCard({ src, label, onClick, available, bookTitle }) {
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
          <img src={src} alt={`${bookTitle} — ${label}`} loading="lazy"
            onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', background: 'linear-gradient(135deg, var(--bg-elevated-2), var(--bg-elevated))' }}>
            <span style={{ fontSize: '2rem' }}>📄</span>
            <span style={{ fontSize: '0.85rem' }}>غير متاحة</span>
          </div>
        )}
      </div>
      <figcaption style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-soft)', padding: '0.75rem', fontSize: '0.9rem' }}>
        {label}
      </figcaption>
    </figure>
  )
}
