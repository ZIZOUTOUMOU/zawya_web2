import { useState, useEffect } from 'react'
import { useT, useLanguage } from '../context/LanguageContext'
import SectionHero from '../components/ui/SectionHero'
import styles from './SectionPage.module.css'
import about from './AboutPage.module.css'
import photos from '../data/aboutPhotos.json'

// Facebook video shared by the center. The plugin renders the share link;
// if Facebook ever blocks the short link, swap in the canonical video URL.
const FB_VIDEO_URL = 'https://www.facebook.com/share/v/14fqvaWg3G9/'
const FB_EMBED = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(FB_VIDEO_URL)}&show_text=false&allowfullscreen=true`

export default function AboutPage() {
  const t = useT()
  const { language } = useLanguage()
  const [lightbox, setLightbox] = useState(null) // index into `photos`, or null

  const caption = (p) => (language === 'ar' ? p.ar : p.en)
  const intro = photos[0]
  const gallery = photos.slice(1)

  // ── Keyboard nav while the lightbox is open ──
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e) => {
      if (e.key === 'Escape')     setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % photos.length)
      if (e.key === 'ArrowLeft')  setLightbox(i => (i - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox === null])

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
              <img
                src={`/about/${intro.file}`}
                alt={caption(intro)}
                className={about.introPhoto}
                loading="lazy"
                onClick={() => setLightbox(0)}
              />
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

          {/* ── Video tour ── */}
          <div className="ornament-divider">
            <span>✦</span>
          </div>
          <div className={styles.gallery} style={{ marginTop: 0 }}>
            <h3 className={styles.galleryTitle} style={{ textAlign: 'center' }}>{t('about.videoHeading')}</h3>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto' }}>
              {t('about.videoDesc')}
            </p>
            <div className={about.videoWrap}>
              <iframe
                src={FB_EMBED}
                title={t('about.videoHeading')}
                scrolling="no"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <p className={about.videoFallback}>
              <a href={FB_VIDEO_URL} target="_blank" rel="noopener noreferrer">
                {t('about.videoUnavailable')}
              </a>
            </p>
          </div>

          {/* ── Photo gallery ── */}
          <div className={styles.gallery}>
            <h3 className={styles.galleryTitle}>{t('about.galleryHeading')}</h3>
            <div className={styles.galleryGrid}>
              {gallery.map((p, j) => (
                <img
                  key={p.file}
                  src={`/about/${p.file}`}
                  alt={caption(p)}
                  loading="lazy"
                  onClick={() => setLightbox(j + 1)}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Photo lightbox ── */}
      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-overlay" />
          <div className={`lightbox-content ${about.lbContent}`} onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="×">×</button>

            <button
              className={`${about.lbNav} ${about.lbPrev}`}
              aria-label="prev"
              onClick={() => setLightbox(i => (i - 1 + photos.length) % photos.length)}
            >‹</button>

            <img
              src={`/about/${photos[lightbox].file}`}
              alt={caption(photos[lightbox])}
              className={about.lbImage}
            />

            <button
              className={`${about.lbNav} ${about.lbNext}`}
              aria-label="next"
              onClick={() => setLightbox(i => (i + 1) % photos.length)}
            >›</button>

            <div className={about.lbLabel}>{caption(photos[lightbox])}</div>
          </div>
        </div>
      )}
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
