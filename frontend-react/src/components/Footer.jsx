import { Link } from 'react-router-dom'
import { useT } from '../context/LanguageContext'
import styles from './Footer.module.css'

// Google Maps place link for الزاوية التجانية
const MAPS_URL = 'https://www.google.com/maps/place/الزاوية+التجانية%E2%80%AD/@33.4908891,6.8074102,17z/data=!3m1!4b1!4m6!3m5!1s0x12591910bf27b0e3:0xb43acf1d61f73374!8m2!3d33.4908891!4d6.8048353!16s%2Fg%2F11bwp6fxzg?entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D'

const NAV_LINKS = [
  { key: 'nav.about',        path: '/about' },
  { key: 'nav.quranSchool',  path: '/quran-school' },
  { key: 'nav.manuscripts',  path: '/manuscripts' },
  { key: 'nav.sewing',       path: '/sewing' },
  { key: 'nav.activities',   path: '/activities' },
  { key: 'nav.association',  path: '/association' },
  { key: 'nav.library',      path: '/library' },
]

export default function Footer() {
  const t = useT()
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logoMark} aria-hidden="true">
            <img src="/logo.jpg" alt="" width="48" height="48" style={{ display: 'block', borderRadius: '10px', objectFit: 'cover' }} />
          </div>
          <div>
            <div className={styles.brandName}>{t('footer.brandName')}</div>
            <div className={styles.brandSub}>{t('footer.brandSubtitle')}</div>
            <p className={styles.tagline}>{t('footer.tagline')}</p>
          </div>
        </div>

        {/* Sections */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('footer.sections')}</h4>
          <nav aria-label={t('footer.sections')}>
            {NAV_LINKS.map(s => (
              <Link key={s.path} to={s.path} className={styles.link}>
                {t(s.key)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact info */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('footer.contact')}</h4>
          <address className={styles.address}>
            <p>📧 <a href="mailto:zawiya@example.com" className={styles.link}>zawiya@example.com</a></p>
            <p>📞 <a href="tel:+213XXXXXXXX" className={styles.link}>+213 XX XX XX XX</a></p>
            <p>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {t('footer.address')}
              </a>
            </p>
          </address>
        </div>

        {/* Library attribution */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('footer.sources')}</h4>
          <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer" className={styles.link}>Open Library</a><br/>
          <a href="https://www.gutenberg.org" target="_blank" rel="noopener noreferrer" className={styles.link}>Project Gutenberg</a><br/>
          <a href="https://archive.org" target="_blank" rel="noopener noreferrer" className={styles.link}>Internet Archive</a>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>{t('footer.copyright', { year })}</span>
        <Link to="/admin" className={styles.adminLink}>{t('footer.admin')}</Link>
      </div>
    </footer>
  )
}
