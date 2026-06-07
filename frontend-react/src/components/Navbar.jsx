// frontend-react/src/components/Navbar.jsx
// ═══════════════════════════════════════════════════════
// Sticky RTL navbar with Arabic navigation links,
// theme toggle, and mobile hamburger menu.
// ═══════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import { NavLink, Link } from 'react-router-dom'
import styles from './Navbar.module.css'

// ─── Navigation items — Arabic primary, path secondary ───────────
const NAV_ITEMS = [
  { label: 'الرئيسية',      path: '/' },
  { label: 'التعريف بالزاوية', path: '/about' },
  { label: 'المدرسة القرآنية', path: '/quran-school' },
  { label: 'المخطوطات',     path: '/manuscripts' },
  { label: 'الخياطة',       path: '/sewing' },
  { label: 'أنشطة مختلفة',  path: '/activities' },
  { label: 'الجمعية',       path: '/association' },
  { label: 'المكتبة',       path: '/library' },
  { label: 'التواصل',       path: '/contact' },
]

export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [theme,      setTheme]      = useState(() =>
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Detect scroll for navbar styling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }, [])

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      role="banner"
    >
      <div className={`container ${styles.inner}`}>

        {/* ── Logo / Brand ── */}
        <Link to="/" className={styles.brand} aria-label="الزاوية — الصفحة الرئيسية">
          <div className={styles.logoMark} aria-hidden="true">
            {/* SVG star/crescent motif */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="var(--color-primary)"/>
              <path
                d="M20 8 L22.9 16.1 H31.5 L24.8 21.2 L27.7 29.3 L20 24.2 L12.3 29.3 L15.2 21.2 L8.5 16.1 H17.1 Z"
                fill="var(--color-accent)"
                opacity="0.9"
              />
            </svg>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>الزاوية</span>
            <span className={styles.brandSub}>المركز الثقافي والتعليمي</span>
          </div>
        </Link>

        {/* ── Desktop navigation ── */}
        <nav className={styles.nav} aria-label="التنقل الرئيسي" role="navigation">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
              end={item.path === '/'}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Header actions ── */}
        <div className={styles.actions}>
          {/* Theme toggle */}
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
            title="تبديل المظهر"
          >
            {theme === 'dark' ? (
              // Sun icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            ) : (
              // Moon icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Admin link */}
          <Link to="/admin" className={`btn btn-sm btn-ghost ${styles.adminBtn}`}>
            لوحة التحكم
          </Link>

          {/* Mobile hamburger */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="فتح القائمة"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* ── Mobile menu overlay ── */}
      {menuOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile menu ── */}
      <nav
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}
        aria-label="القائمة المحمولة"
        aria-hidden={!menuOpen}
      >
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.mobileLink} ${isActive ? styles.active : ''}`
            }
            end={item.path === '/'}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
        <Link
          to="/admin"
          className={styles.mobileLink}
          onClick={() => setMenuOpen(false)}
        >
          لوحة التحكم
        </Link>
      </nav>
    </header>
  )
}
