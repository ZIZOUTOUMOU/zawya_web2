import { useT } from '../context/LanguageContext'
import SectionHero from '../components/ui/SectionHero'
import styles from './SectionPage.module.css'

export default function AboutPage() {
  const t = useT()

  return (
    <div>
      <SectionHero
        title={t('site.name')}
        subtitle={t('about.heroSubtitle')}
        description={t('about.heroDesc')}
        badge={t('about.heroBadge')}
      />

      <section className={`section ${styles.content}`}>
        <div className="container">

          <div className={styles.introGrid}>
            <div className={styles.introText}>
              <h2 className="section-title">{t('about.headingWho')}</h2>
              <p>{t('about.intro1')}</p>
              <p>{t('about.intro2')}</p>
              <p>{t('about.intro3')}</p>
            </div>

            <div className={styles.introImage}>
              <div className="img-placeholder" style={{ minHeight: 320 }}>
                {/* <img src="/images/zawiya-exterior.jpg" alt={t('about.imgCaption')} /> */}
                <span style={{ fontSize: '3rem' }}>🕌</span>
                <span>{t('about.imgCaption')}</span>
                <small style={{ opacity: 0.6 }}>{t('about.imgHint')}</small>
              </div>
            </div>
          </div>

          <div className="ornament-divider">
            <span>✦</span>
          </div>

          <div className={styles.valuesSection}>
            <h2 className="section-title centered" style={{ textAlign: 'center' }}>{t('about.valuesHeading')}</h2>
            <div className={styles.valuesGrid}>
              <ValueCard icon="📖" title={t('about.value1Title')} text={t('about.value1Text')} />
              <ValueCard icon="🤲" title={t('about.value2Title')} text={t('about.value2Text')} />
              <ValueCard icon="🌱" title={t('about.value3Title')} text={t('about.value3Text')} />
              <ValueCard icon="📜" title={t('about.value4Title')} text={t('about.value4Text')} />
            </div>
          </div>

          <div className="ornament-divider">
            <span>✦</span>
          </div>

          <div className={styles.timeline}>
            <h2 className="section-title centered" style={{ textAlign: 'center' }}>{t('about.historyHeading')}</h2>
            <div className={styles.timelineList}>
              <TimelineItem year={t('about.timeline1Year')} text={t('about.timeline1Text')} />
              <TimelineItem year={t('about.timeline2Year')} text={t('about.timeline2Text')} />
              <TimelineItem year={t('about.timeline3Year')} text={t('about.timeline3Text')} />
            </div>
          </div>

          <div className={styles.gallery}>
            <h3 className={styles.galleryTitle}>{t('about.galleryHeading')}</h3>
            <div className={styles.galleryGrid}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="img-placeholder" style={{ minHeight: 160 }}>
                  {/* Replace with: <img src={`/images/gallery-${i}.jpg`} alt={t('about.galleryAlt', { i })} /> */}
                  <span style={{ fontSize: '1.5rem' }}>🖼️</span>
                  <span style={{ fontSize: '0.8rem' }}>{t('about.galleryAlt', { i })}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

function ValueCard({ icon, title, text }) {
  return (
    <div className={`card ${styles.valueCard}`}>
      <span className={styles.valueIcon}>{icon}</span>
      <h4 className={styles.valueTitle}>{title}</h4>
      <p className={styles.valueText}>{text}</p>
    </div>
  )
}

function TimelineItem({ year, text }) {
  return (
    <div className={styles.timelineItem}>
      <div className={styles.timelineMarker} />
      <div className={styles.timelineBody}>
        <span className={styles.timelineYear}>{year}</span>
        <p className={styles.timelineText}>{text}</p>
      </div>
    </div>
  )
}
