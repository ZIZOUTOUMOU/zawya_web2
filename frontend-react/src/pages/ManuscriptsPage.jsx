import { useState } from 'react'
import { useT } from '../context/LanguageContext'
import SectionHero from '../components/ui/SectionHero'
import styles from './SectionPage.module.css'

const MANUSCRIPTS = [
  { id: 1,  title: 'رسالة في علم الكلام',        date: 'القرن ١٢ هـ', subject: 'علم الكلام',  emoji: '📜' },
  { id: 2,  title: 'شرح الجامع الصغير',           date: 'القرن ١١ هـ', subject: 'الفقه',       emoji: '📜' },
  { id: 3,  title: 'ديوان شعر أندلسي',             date: 'القرن ٩ هـ',  subject: 'الأدب',       emoji: '📜' },
  { id: 4,  title: 'كتاب في الرياضيات',            date: 'القرن ١٠ هـ', subject: 'العلوم',      emoji: '📜' },
  { id: 5,  title: 'رسالة في التصوف',              date: 'القرن ١٣ هـ', subject: 'التصوف',      emoji: '📜' },
  { id: 6,  title: 'مختصر في علم الفلك',          date: 'القرن ١١ هـ', subject: 'الفلك',       emoji: '📜' },
  { id: 7,  title: 'شرح ألفية ابن مالك',           date: 'القرن ١٤ هـ', subject: 'النحو',       emoji: '📜' },
  { id: 8,  title: 'كتاب في الطب والعلاج',         date: 'القرن ١٢ هـ', subject: 'الطب',        emoji: '📜' },
  { id: 9,  title: 'مجموعة فتاوى',                  date: 'القرن ١٥ هـ', subject: 'الفقه',       emoji: '📜' },
]

const SUBJECTS = ['الكل', ...new Set(MANUSCRIPTS.map(m => m.subject))]

export default function ManuscriptsPage() {
  const t = useT()
  const [filter,   setFilter]   = useState('الكل')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'الكل'
    ? MANUSCRIPTS
    : MANUSCRIPTS.filter(m => m.subject === filter)

  return (
    <div>
      <SectionHero
        title={t('nav.manuscripts')}
        subtitle={t('manuscripts.heroSubtitle')}
        description={t('manuscripts.heroDesc')}
        badge={t('manuscripts.heroBadge')}
      />

      <section className={`section ${styles.content}`}>
        <div className="container">

          <div className={styles.introGrid}>
            <div className={styles.introText}>
              <h2 className="section-title">{t('manuscripts.heading')}</h2>
              <p>{t('manuscripts.para1')}</p>
              <p>{t('manuscripts.para2')}</p>
            </div>

            <div className={styles.introImage}>
              <div className="img-placeholder" style={{ minHeight: 280 }}>
                {/* <img src="/images/manuscripts-collection.jpg" alt={t('manuscripts.imgCaption')} /> */}
                <span style={{ fontSize: '4rem' }}>📜</span>
                <span>{t('manuscripts.imgCaption')}</span>
              </div>
            </div>
          </div>

          <div className="ornament-divider"><span>✦</span></div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'center' }}>
            {SUBJECTS.map(s => (
              <button
                key={s}
                className={filter === s ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
                onClick={() => setFilter(s)}
              >
                {s === 'الكل' ? t('manuscripts.filterAll') : s}
              </button>
            ))}
          </div>

          <div className={styles.manuscriptGrid}>
            {filtered.map(ms => (
              <ManuscriptCard
                key={ms.id}
                manuscript={ms}
                onClick={() => setSelected(ms)}
              />
            ))}
          </div>

          <div className={styles.infoCard} style={{ marginTop: '3rem' }}>
            <h3>{t('manuscripts.infoHeading')}</h3>
            <p>{t('manuscripts.infoText')}</p>
          </div>

        </div>
      </section>

      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <div className="lightbox-overlay" />
          <div
            className="lightbox-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 700 }}
          >
            <button className="lightbox-close" onClick={() => setSelected(null)}>×</button>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '5rem', display: 'block', marginBottom: '1rem' }}>📜</span>
              {/* Replace with: <img src={selected.imageUrl} alt={selected.title} style={{ maxHeight: 400, margin: '0 auto' }} /> */}
              <h3 style={{ fontFamily: 'var(--font-display-arabic)', color: 'var(--color-primary)' }}>
                {selected.title}
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <InfoRow label={t('manuscripts.labelDate')}    value={selected.date} />
              <InfoRow label={t('manuscripts.labelSubject')} value={selected.subject} />
            </div>
            <div className="img-placeholder" style={{ marginTop: '1rem', minHeight: 200 }}>
              {/* <img src={selected.fullImageUrl} alt={t('manuscripts.lightboxAlt')} /> */}
              <span style={{ fontSize: '2rem' }}>🖼️</span>
              <span>{t('manuscripts.lightboxAlt')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ManuscriptCard({ manuscript: ms, onClick }) {
  return (
    <div className={styles.manuscriptCard} onClick={onClick} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className={styles.manuscriptThumb}>
        {/* Replace with: <img src={ms.thumbnailUrl} alt={ms.title} /> */}
        <span>{ms.emoji}</span>
      </div>
      <div className={styles.manuscriptMeta}>
        <div className={styles.manuscriptTitle}>{ms.title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem' }}>
          <span className={styles.manuscriptDate}>{ms.date}</span>
          <span className="badge">{ms.subject}</span>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ background: 'var(--bg-elevated-2)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)' }}>{value}</div>
    </div>
  )
}
