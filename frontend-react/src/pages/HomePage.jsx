import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStats, getRecentBooks, assetUrl } from '../services/api'
import { useT } from '../context/LanguageContext'
import styles from './HomePage.module.css'

export default function HomePage() {
  const t = useT()
  const [stats, setStats] = useState(null)
  const [recentBooks, setRecentBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [booksError, setBooksError] = useState(false)

  useEffect(() => {
    Promise.all([getStats(), getRecentBooks()])
      .then(([statsRes, booksRes]) => {
        if (statsRes.success) setStats(statsRes.data)
        if (booksRes.success) setRecentBooks(booksRes.data.slice(0, 4))
        else setBooksError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon points="40,5 75,22.5 75,57.5 40,75 5,57.5 5,22.5" fill="none" stroke="rgba(201,150,60,0.12)" strokeWidth="1"/>
                <circle cx="40" cy="40" r="5" fill="none" stroke="rgba(201,150,60,0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geo)"/>
          </svg>
        </div>

        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>{t('home.eyebrow')}</span>
            <h1 className={styles.heroTitle}>
              {t('site.name')}
              <span className={styles.heroTitleAccent}>{t('home.heroAccent')}</span>
            </h1>
            <p className={styles.heroLede}>{t('home.heroLede')}</p>
            <div className={styles.heroCta}>
              <Link to="/about" className="btn btn-accent btn-lg">
                {t('home.ctaAbout')}
              </Link>
              <Link to="/library" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
                {t('home.ctaLibrary')}
              </Link>
            </div>
          </div>

          <div className={styles.heroArt}>
            <div className={styles.imgPlaceholder}>
              <div className={styles.placeholderBox}>
                <span className={styles.placeholderIcon}>🕌</span>
                <span className={styles.placeholderText}>{t('home.placeholderImg')}</span>
                <span className={styles.placeholderHint}>{t('home.placeholderHint')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.wave} aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="var(--bg)">
            <path d="M0,0 C480,80 960,80 1440,0 L1440,80 L0,80 Z"/>
          </svg>
        </div>
      </section>

      {/* ══ LIVE STATS ════════════════════════════════════════════ */}
      {stats && (
        <section className={`section ${styles.statsSection}`}>
          <div className="container">
            <div className={styles.statsGrid}>
              <StatCard number={stats.totalBooks?.toLocaleString()}      label={t('home.statBooks')}      icon="📚" />
              <StatCard number={stats.totalCategories?.toLocaleString()} label={t('home.statCategories')} icon="🗂️" />
              <StatCard number={stats.totalAuthors?.toLocaleString()}    label={t('home.statAuthors')}    icon="✍️" />
              <StatCard number={t('home.statActivitiesNum')}             label={t('home.statActivities')} icon="🎯" />
            </div>
          </div>
        </section>
      )}

      {/* ══ SECTIONS GRID ════════════════════════════════════════ */}
      <section className={`section ${styles.sectionsSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={`section-title ${styles.sectionTitle}`}>{t('home.sectionsTitle')}</h2>
            <p className={styles.sectionSubtitle}>{t('home.sectionsSubtitle')}</p>
          </div>
          <div className={styles.sectionsGrid}>
            <SectionCard icon="🕌" title={t('home.sectionAbout')}       subtitle={t('home.sectionAboutSub')}       description={t('home.sectionAboutDesc')}       linkTo="/about"        color="#1B3A2D" delay={0}   />
            <SectionCard icon="📖" title={t('home.sectionQuran')}       subtitle={t('home.sectionQuranSub')}       description={t('home.sectionQuranDesc')}       linkTo="/quran-school" color="#2D6A4F" delay={60}  />
            <SectionCard icon="📜" title={t('home.sectionMss')}         subtitle={t('home.sectionMssSub')}         description={t('home.sectionMssDesc')}         linkTo="/manuscripts"  color="#8B4513" delay={120} />
            <SectionCard icon="🪡" title={t('home.sectionSewing')}      subtitle={t('home.sectionSewingSub')}      description={t('home.sectionSewingDesc')}      linkTo="/sewing"       color="#9B2335" delay={180} />
            <SectionCard icon="🎨" title={t('home.sectionActivities')}  subtitle={t('home.sectionActivitiesSub')}  description={t('home.sectionActivitiesDesc')}  linkTo="/activities"   color="#5E2A84" delay={240} />
            <SectionCard icon="🤝" title={t('home.sectionAssociation')} subtitle={t('home.sectionAssociationSub')} description={t('home.sectionAssociationDesc')} linkTo="/association"  color="#1B3A2D" delay={300} />
            <SectionCard icon="📚" title={t('home.sectionLibrary')}     subtitle={t('home.sectionLibrarySub')}     description={t('home.sectionLibraryDesc')}     linkTo="/library"      color="#1a4a6b" delay={360} />
            <SectionCard icon="✉️" title={t('home.sectionContact')}     subtitle={t('home.sectionContactSub')}     description={t('home.sectionContactDesc')}     linkTo="/contact"      color="#C9963C" delay={420} />
          </div>
        </div>
      </section>

      {/* ══ ORNAMENTAL DIVIDER ════════════════════════════════════ */}
      <div className="ornament-divider container">
        <span>✦</span>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('home.ornamentText')}</span>
        <span>✦</span>
      </div>

      {/* ══ RECENT BOOKS PREVIEW ═════════════════════════════════ */}
      <section className={`section ${styles.booksSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className="section-title">{t('home.recentTitle')}</h2>
            <Link to="/library" className={styles.viewAll}>{t('home.viewAll')}</Link>
          </div>

          {loading ? (
            <div className={styles.booksGrid}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`skeleton ${styles.bookSkeleton}`} />
              ))}
            </div>
          ) : recentBooks.length > 0 ? (
            <div className={styles.booksGrid}>
              {recentBooks.map((book, i) => (
                <BookCard key={book.id} book={book} delay={i * 80} t={t} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              {booksError ? t('home.errorBooks') : t('home.emptyBooks')}
            </p>
          )}
        </div>
      </section>

      {/* ══ CTA BANNER ════════════════════════════════════════════ */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>{t('home.ctaBannerHeading')}</h2>
            <p className={styles.ctaDesc}>{t('home.ctaBannerDesc')}</p>
            <div className={styles.ctaActions}>
              <Link to="/contact" className="btn btn-accent btn-lg">{t('home.ctaBannerContact')}</Link>
              <Link to="/association" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
                {t('home.ctaBannerAbout')}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────

function StatCard({ number, label, icon }) {
  return (
    <div className={`card ${styles.statCard} fade-up`}>
      <span className={styles.statIcon}>{icon}</span>
      <span className={styles.statNum}>{number}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

function SectionCard({ icon, title, subtitle, description, linkTo, color, delay }) {
  return (
    <Link
      to={linkTo}
      className={`card ${styles.sectionCard} fade-up`}
      style={{ '--delay': `${delay}ms`, animationDelay: `${delay}ms` }}
    >
      <div
        className={styles.sectionCardAccent}
        style={{ background: color }}
        aria-hidden="true"
      />
      <div className={styles.sectionCardBody}>
        <span className={styles.sectionIcon}>{icon}</span>
        <div>
          <h3 className={styles.sectionCardTitle}>{title}</h3>
          <p className={styles.sectionCardSub}>{subtitle}</p>
        </div>
      </div>
      <p className={styles.sectionCardDesc}>{description}</p>
      <span className={styles.sectionCardArrow} aria-hidden="true">←</span>
    </Link>
  )
}

function BookCard({ book, delay, t }) {
  const cover = assetUrl(book.cover_image)

  return (
    <Link
      to={`/library/${book.id}`}
      className={`card ${styles.bookCard} fade-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.bookCover}>
        {cover ? (
          <img
            src={cover}
            alt={t('home.coverAlt', { title: book.title })}
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className={styles.bookCoverFallback}>
            <span>{book.title?.charAt(0) || '📖'}</span>
          </div>
        )}
      </div>
      <div className={styles.bookInfo}>
        <h4 className={styles.bookTitle}>{book.title}</h4>
        <p className={styles.bookAuthor}>{book.author}</p>
        {book.category && (
          <span className="badge">{book.category}</span>
        )}
      </div>
    </Link>
  )
}
