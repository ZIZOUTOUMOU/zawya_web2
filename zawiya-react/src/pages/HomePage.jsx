// frontend-react/src/pages/HomePage.jsx
// ═══════════════════════════════════════════════════════
// Main interactive homepage — the hub for all sections.
// Fetches live stats from the backend and displays
// section cards with Arabic content.
// ═══════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStats, getRecentBooks, getFeaturedBooks, assetUrl } from '../services/api'
import styles from './HomePage.module.css'

// ─── Section cards data ────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'about',
    path: '/about',
    title: 'التعريف بالزاوية',
    subtitle: 'نبذة تاريخية وتعريفية',
    description: 'تعرّف على تاريخ الزاوية وإرثها العلمي والروحاني العريق في المنطقة.',
    icon: '🕌',
    color: '#1B3A2D',
  },
  {
    id: 'quran',
    path: '/quran-school',
    title: 'المدرسة القرآنية',
    subtitle: 'تعليم كتاب الله',
    description: 'برامج تحفيظ القرآن الكريم وتعليم التجويد لجميع الأعمار.',
    icon: '📖',
    color: '#2D6A4F',
  },
  {
    id: 'manuscripts',
    path: '/manuscripts',
    title: 'المخطوطات',
    subtitle: 'كنوز الإرث الإسلامي',
    description: 'مجموعة نادرة من المخطوطات العلمية والأدبية والدينية القيّمة.',
    icon: '📜',
    color: '#8B4513',
  },
  {
    id: 'sewing',
    path: '/sewing',
    title: 'قسم الخياطة',
    subtitle: 'الحرف والمهارات اليدوية',
    description: 'ورشات تعليمية في الخياطة والتطريز والفنون النسيجية التقليدية.',
    icon: '🪡',
    color: '#9B2335',
  },
  {
    id: 'activities',
    path: '/activities',
    title: 'أنشطة مختلفة',
    subtitle: 'فعاليات وبرامج متنوعة',
    description: 'برامج ثقافية وترفيهية وتعليمية للمجتمع طوال العام.',
    icon: '🎨',
    color: '#5E2A84',
  },
  {
    id: 'association',
    path: '/association',
    title: 'الجمعية',
    subtitle: 'منظمتنا وهيكلنا',
    description: 'تعرّف على جمعية الزاوية وأهدافها ومشاريعها المجتمعية.',
    icon: '🤝',
    color: '#1B3A2D',
  },
  {
    id: 'library',
    path: '/library',
    title: 'المكتبة الرقمية',
    subtitle: 'آلاف الكتب في متناولك',
    description: 'مكتبة رقمية تضم كتباً في المجال العام مع معاينة الصفحات.',
    icon: '📚',
    color: '#1a4a6b',
  },
  {
    id: 'contact',
    path: '/contact',
    title: 'التواصل معنا',
    subtitle: 'نحن هنا للمساعدة',
    description: 'تواصل معنا لأي استفسار أو للانضمام إلى أنشطة الزاوية.',
    icon: '✉️',
    color: '#C9963C',
  },
]

// ─── Component ─────────────────────────────────────────────────────
export default function HomePage() {
  const [stats,     setStats]     = useState(null)
  const [recentBooks, setRecentBooks] = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    // Fetch stats and recent books in parallel
    Promise.all([getStats(), getRecentBooks()])
      .then(([statsRes, booksRes]) => {
        if (statsRes.success) setStats(statsRes.data)
        if (booksRes.success)  setRecentBooks(booksRes.data.slice(0, 4))
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page} dir="rtl">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          {/* Geometric SVG pattern */}
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
            <span className={styles.eyebrow}>مرحباً بكم في</span>
            <h1 className={styles.heroTitle}>
              الزاوية
              <span className={styles.heroTitleAccent}>المركز الثقافي والتعليمي</span>
            </h1>
            <p className={styles.heroLede}>
              مساحة للعلم والثقافة والتراث الإسلامي — من تحفيظ القرآن الكريم
              إلى المخطوطات النادرة والأنشطة المجتمعية المتنوعة.
            </p>
            <div className={styles.heroCta}>
              <Link to="/about" className="btn btn-accent btn-lg">
                تعرّف علينا
              </Link>
              <Link to="/library" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
                المكتبة الرقمية
              </Link>
            </div>
          </div>

          {/* Hero visual — image placeholder */}
          <div className={styles.heroArt}>
            <div className={styles.imgPlaceholder}>
              {/* Replace the src below with your actual mosque/zawiya photo */}
              {/* <img src="/images/zawiya-hero.jpg" alt="الزاوية" className={styles.heroImg} /> */}
              <div className={styles.placeholderBox}>
                <span className={styles.placeholderIcon}>🕌</span>
                <span className={styles.placeholderText}>صورة الزاوية</span>
                <span className={styles.placeholderHint}>ضع صورتك هنا</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
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
              <StatCard number={stats.totalBooks?.toLocaleString('ar-EG')}  label="كتاب في المكتبة"    icon="📚" />
              <StatCard number={stats.totalCategories?.toLocaleString('ar-EG')} label="تصنيف معرفي"   icon="🗂️" />
              <StatCard number={stats.totalAuthors?.toLocaleString('ar-EG')} label="مؤلف ومفكر"        icon="✍️" />
              <StatCard number="٢٥+"  label="نشاط سنوياً"                                              icon="🎯" />
            </div>
          </div>
        </section>
      )}

      {/* ══ SECTIONS GRID ════════════════════════════════════════ */}
      <section className={`section ${styles.sectionsSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={`section-title ${styles.sectionTitle}`}>
              أقسام الزاوية
            </h2>
            <p className={styles.sectionSubtitle}>
              اكتشف كل ما تقدمه الزاوية من خدمات وأنشطة
            </p>
          </div>

          <div className={styles.sectionsGrid}>
            {SECTIONS.map((sec, i) => (
              <SectionCard key={sec.id} section={sec} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ ORNAMENTAL DIVIDER ════════════════════════════════════ */}
      <div className="ornament-divider container">
        <span>✦</span>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>من كنوز المكتبة الرقمية</span>
        <span>✦</span>
      </div>

      {/* ══ RECENT BOOKS PREVIEW ═════════════════════════════════ */}
      <section className={`section ${styles.booksSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className="section-title">آخر إضافات المكتبة</h2>
            <Link to="/library" className={styles.viewAll}>
              عرض الكل ←
            </Link>
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
                <BookCard key={book.id} book={book} delay={i * 80} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              لا توجد كتب حتى الآن. أضف كتباً من لوحة التحكم.
            </p>
          )}
        </div>
      </section>

      {/* ══ CTA BANNER ════════════════════════════════════════════ */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>انضم إلى عائلة الزاوية</h2>
            <p className={styles.ctaDesc}>
              نرحب بجميع الراغبين في التعلم والمشاركة في أنشطتنا الثقافية والتعليمية.
            </p>
            <div className={styles.ctaActions}>
              <Link to="/contact" className="btn btn-accent btn-lg">تواصل معنا</Link>
              <Link to="/association" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
                تعرّف على الجمعية
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

function SectionCard({ section, delay }) {
  return (
    <Link
      to={section.path}
      className={`card ${styles.sectionCard} fade-up`}
      style={{ '--delay': `${delay}ms`, animationDelay: `${delay}ms` }}
    >
      <div
        className={styles.sectionCardAccent}
        style={{ background: section.color }}
        aria-hidden="true"
      />
      <div className={styles.sectionCardBody}>
        <span className={styles.sectionIcon}>{section.icon}</span>
        <div>
          <h3 className={styles.sectionCardTitle}>{section.title}</h3>
          <p className={styles.sectionCardSub}>{section.subtitle}</p>
        </div>
      </div>
      <p className={styles.sectionCardDesc}>{section.description}</p>
      <span className={styles.sectionCardArrow} aria-hidden="true">←</span>
    </Link>
  )
}

function BookCard({ book, delay }) {
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
            alt={`غلاف ${book.title}`}
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
