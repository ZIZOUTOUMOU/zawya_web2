// frontend-react/src/components/Footer.jsx
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const SECTIONS = [
  { label: 'التعريف بالزاوية', path: '/about' },
  { label: 'المدرسة القرآنية',  path: '/quran-school' },
  { label: 'المخطوطات',        path: '/manuscripts' },
  { label: 'الخياطة',          path: '/sewing' },
  { label: 'أنشطة مختلفة',     path: '/activities' },
  { label: 'الجمعية',          path: '/association' },
  { label: 'المكتبة',          path: '/library' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logoMark} aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="var(--color-accent)" opacity="0.15"/>
              <path
                d="M20 8 L22.9 16.1 H31.5 L24.8 21.2 L27.7 29.3 L20 24.2 L12.3 29.3 L15.2 21.2 L8.5 16.1 H17.1 Z"
                fill="var(--color-accent)"
              />
            </svg>
          </div>
          <div>
            <div className={styles.brandName}>الزاوية</div>
            <div className={styles.brandSub}>المركز الثقافي والتعليمي</div>
            <p className={styles.tagline}>
              مساحة للعلم والثقافة والتراث الإسلامي
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>أقسام الموقع</h4>
          <nav aria-label="روابط الأقسام">
            {SECTIONS.map(s => (
              <Link key={s.path} to={s.path} className={styles.link}>
                {s.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact info */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>التواصل</h4>
          <address className={styles.address}>
            <p>📧 <a href="mailto:zawiya@example.com" className={styles.link}>zawiya@example.com</a></p>
            <p>📞 <a href="tel:+213XXXXXXXX" className={styles.link}>+213 XX XX XX XX</a></p>
            <p>📍 ورقلة، الجزائر</p>
          </address>
        </div>

        {/* Library attribution */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>مصادر المكتبة</h4>
          <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer" className={styles.link}>Open Library</a><br/>
          <a href="https://www.gutenberg.org" target="_blank" rel="noopener noreferrer" className={styles.link}>Project Gutenberg</a><br/>
          <a href="https://archive.org" target="_blank" rel="noopener noreferrer" className={styles.link}>Internet Archive</a>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {year} الزاوية — المركز الثقافي والتعليمي. جميع الحقوق محفوظة.</span>
        <Link to="/admin" className={styles.adminLink}>لوحة التحكم</Link>
      </div>
    </footer>
  )
}
