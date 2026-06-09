import { Link } from 'react-router-dom'
import { useT } from '../context/LanguageContext'
import SectionHero from '../components/ui/SectionHero'
import styles from './SectionPage.module.css'

const PROGRAM_ICONS = ['📖', '🎵', '📚', '👨‍👩‍👧', '🌙', '🏆']

export default function QuranSchoolPage() {
  const t = useT()

  return (
    <div>
      <SectionHero
        title={t('nav.quranSchool')}
        subtitle={t('quranSchool.heroSubtitle')}
        description={t('quranSchool.heroDesc')}
        badge={t('quranSchool.heroBadge')}
      />

      <section className={`section ${styles.content}`}>
        <div className="container">

          <div className={styles.introGrid}>
            <div className={styles.introText}>
              <h2 className="section-title">{t('quranSchool.headingAbout')}</h2>
              <p>{t('quranSchool.para1')}</p>
              <p>{t('quranSchool.para2')}</p>
              <Link to="/contact" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                {t('quranSchool.registerBtn')}
              </Link>
            </div>

            <div className={styles.introImage}>
              <div className="img-placeholder" style={{ minHeight: 320 }}>
                {/* <img src="/images/quran-school.jpg" alt={t('quranSchool.imgCaption')} /> */}
                <span style={{ fontSize: '4rem' }}>📖</span>
                <span>{t('quranSchool.imgCaption')}</span>
                <small style={{ opacity: 0.6 }}>{t('quranSchool.imgHint')}</small>
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', position: 'relative', zIndex: 1 }}>
              {[
                { n: '٥٠٠+', l: t('quranSchool.statStudents') },
                { n: '١٥',   l: t('quranSchool.statTeachers') },
                { n: '٣٠',   l: t('quranSchool.statGraduates') },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display-arabic)', fontSize: '2.5rem', color: 'var(--color-accent-light)', fontWeight: 700 }}>{s.n}</div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ornament-divider"><span>✦</span></div>

          <h2 className="section-title centered" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>{t('quranSchool.programsHeading')}</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {t('quranSchool.programsSubtitle')}
          </p>

          <div className={styles.valuesGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {PROGRAM_ICONS.map((icon, idx) => {
              const n = idx + 1
              return (
                <ProgramCard
                  key={n}
                  icon={icon}
                  title={t(`quranSchool.prog${n}Title`)}
                  text={t(`quranSchool.prog${n}Text`)}
                  badge={t(`quranSchool.prog${n}Badge`)}
                />
              )
            })}
          </div>

          <div className="ornament-divider"><span>✦</span></div>

          <div className={styles.gallery}>
            <h3 className={styles.galleryTitle}>{t('quranSchool.galleryHeading')}</h3>
            <div className={styles.galleryGrid}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="img-placeholder" style={{ minHeight: 150 }}>
                  {/* <img src={`/images/school-${i}.jpg`} alt={t('quranSchool.galleryAlt', { i })} /> */}
                  <span style={{ fontSize: '1.3rem' }}>🖼️</span>
                  <span style={{ fontSize: '0.8rem' }}>{t('quranSchool.galleryAlt', { i })}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

function ProgramCard({ icon, title, text, badge }) {
  return (
    <div className={`card ${styles.valueCard}`}>
      <span className={styles.valueIcon}>{icon}</span>
      {badge && <span className="badge" style={{ fontSize: '0.72rem' }}>{badge}</span>}
      <h4 className={styles.valueTitle}>{title}</h4>
      <p className={styles.valueText}>{text}</p>
    </div>
  )
}
