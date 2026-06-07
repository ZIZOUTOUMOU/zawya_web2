// frontend-react/src/components/ui/SectionHero.jsx
// Reusable hero banner for inner section pages.
// Drop in your own image via the `imageSrc` prop later.

import styles from './SectionHero.module.css'

export default function SectionHero({
  title,
  subtitle,
  description,
  imageSrc,       // Optional: path to background image
  imageAlt = '',
  badge,          // Optional: small badge above title
  children,       // Optional: extra content / buttons
  pattern = true, // Show geometric bg pattern
}) {
  return (
    <section
      className={`${styles.hero} ${pattern ? styles.pattern : ''}`}
      style={imageSrc ? {
        backgroundImage: `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url(${imageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
    >
      <div className={`container ${styles.content}`}>
        {badge && <span className={`badge ${styles.badge}`}>{badge}</span>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {description && <p className={styles.description}>{description}</p>}
        {children && <div className={styles.actions}>{children}</div>}
      </div>

      {/* Decorative wave at bottom */}
      <div className={styles.wave} aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="var(--bg)">
          <path d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z"/>
        </svg>
      </div>
    </section>
  )
}
