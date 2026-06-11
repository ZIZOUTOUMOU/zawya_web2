// frontend-react/src/pages/library/ReadingListPage.jsx
// قائمة القراءة — Reading List dashboard, reads IDs from localStorage

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getBook, assetUrl } from '../../services/api'
import { useT } from '../../context/LanguageContext'
import styles from './ReadingList.module.css'
import libStyles from './Library.module.css'

const STORAGE_KEY = 'zawiya_readingList'

function getStoredIds() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

function removeStoredId(id) {
  const ids = getStoredIds().filter(i => Number(i) !== Number(id))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export default function ReadingListPage() {
  const t = useT()
  const [ids,       setIds]       = useState(getStoredIds)
  const [books,     setBooks]     = useState([])
  const [loading,   setLoading]   = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    document.title = `${t('readingList.title')} — ${t('site.name')}`
  }, [])

  useEffect(() => {
    if (ids.length === 0) {
      setBooks([])
      return
    }
    setLoading(true)
    setLoadError(false)
    Promise.allSettled(ids.map(id => getBook(id)))
      .then(results => {
        const loaded = results
          .filter(r => r.status === 'fulfilled' && r.value?.success)
          .map(r => r.value.data)
        setBooks(loaded)
        // Saved IDs exist but none could be fetched → connection problem or removed books
        if (loaded.length === 0) setLoadError(true)
      })
      .finally(() => setLoading(false))
  }, [ids, reloadKey])

  const handleRemove = (id) => {
    removeStoredId(id)
    setIds(getStoredIds())
  }

  const count = loading ? ids.length : books.length

  return (
    <div>
      <section className={`section ${styles.page}`}>
        <div className="container">

          <div className={styles.pageHeader}>
            <h1 className={styles.heading}>
              {t('readingList.title')}
              <span className={styles.count}>
                {t('readingList.booksCount', { count })}
              </span>
            </h1>
            <Link to="/library" className="btn btn-ghost btn-sm">
              {t('readingList.browse')}
            </Link>
          </div>

          {loading ? (
            <div className={libStyles.bookGrid}>
              {[...Array(Math.max(ids.length, 3))].map((_, i) => (
                <div key={i} className={`skeleton ${libStyles.skeletonCard}`} />
              ))}
            </div>
          ) : ids.length === 0 ? (
            <EmptyState />
          ) : loadError ? (
            <div className={libStyles.empty} role="alert">
              <span aria-hidden="true">⚠️</span>
              <p>{t('readingList.loadError')}</p>
              <button className="btn btn-primary" onClick={() => setReloadKey(k => k + 1)}>
                {t('readingList.retry')}
              </button>
            </div>
          ) : (
            <div className={libStyles.bookGrid}>
              {books.map((book, i) => (
                <ReadingListCard
                  key={book.id}
                  book={book}
                  delay={i * 30}
                  onRemove={() => handleRemove(book.id)}
                />
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}

function EmptyState() {
  const t = useT()
  return (
    <div className={libStyles.empty}>
      <span>📚</span>
      <p>{t('readingList.empty')}</p>
      <Link to="/library" className="btn btn-primary">
        {t('readingList.browse')}
      </Link>
    </div>
  )
}

function ReadingListCard({ book, delay, onRemove }) {
  const t = useT()
  const navigate = useNavigate()
  const cover = assetUrl(book.cover_image)
  const rating = Math.round(parseFloat(book.rating) || 0)

  return (
    <div
      role="article"
      tabIndex={0}
      className={`card ${libStyles.bookCard} ${styles.card} fade-up`}
      style={{ animationDelay: `${delay}ms`, cursor: 'pointer' }}
      onClick={() => navigate(`/library/${book.id}`)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/library/${book.id}`) }}
    >
      <div className={libStyles.cover}>
        {cover ? (
          <img
            src={cover}
            alt={book.title}
            loading="lazy"
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className={libStyles.placeholder}>{book.title?.charAt(0) || '📖'}</div>
        )}
      </div>

      <div className={libStyles.info}>
        <h3 className={libStyles.title}>{book.title}</h3>
        <p className={libStyles.author}>
          <Link
            to={`/library?author=${encodeURIComponent(book.author)}`}
            className={libStyles.authorLink}
            onClick={e => e.stopPropagation()}
          >
            {book.author}
          </Link>
        </p>
        <div className={libStyles.meta}>
          <span className="badge">{book.category || t('library.categoryGeneral')}</span>
          {book.call_number && <span className="badge" style={{ background: 'var(--color-accent)', color: '#fff' }}>{book.call_number}</span>}
          {book.publication_year && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {book.publication_year}
            </span>
          )}
          {rating > 0 && (
            <span className="stars" style={{ fontSize: '0.75rem' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < rating ? '' : 'empty'}>★</span>
              ))}
            </span>
          )}
        </div>
        <button
          className={`btn btn-ghost btn-sm ${styles.removeBtn}`}
          onClick={e => { e.stopPropagation(); onRemove() }}
          aria-label={t('readingList.removeAria', { title: book.title })}
        >
          {t('readingList.remove')}
        </button>
      </div>
    </div>
  )
}
