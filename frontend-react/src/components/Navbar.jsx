// frontend-react/src/components/Navbar.jsx

import { useState, useEffect, useCallback } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useLanguage, useT } from '../context/LanguageContext'
import styles from './Navbar.module.css'

const READING_LIST_KEY = 'zawiya_readingList'

function getReadingListCount() {
  try { return JSON.parse(localStorage.getItem(READING_LIST_KEY) || '[]').length }
  catch { return 0 }
}

export default function Navbar() {
  const location = useLocation()
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const [listCount, setListCount] = useState(getReadingListCount)
  const [theme,     setTheme]     = useState(() =>
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    setListCount(getReadingListCount())
  }, [location.pathname])

  useEffect(() => {
    const onStorage = e => {
      if (!e.key || e.key === READING_LIST_KEY) setListCount(getReadingListCount())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  const { language, toggleLanguage } = useLanguage()
  const t = useT()

  const navCls = ({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`
  const mobileCls = ({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`
  const close = () => setMenuOpen(false)

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      role="banner"
    >
      <div className={`container ${styles.inner}`}>

        {/* ── Logo / Brand ── */}
        <Link to="/" className={styles.brand} aria-label={t('nav.brandAria')}>
          <div className={styles.logoMark} aria-hidden="true">
            <img src="/logo.jpg" alt="" width="40" height="40" style={{ display: 'block', borderRadius: '10px', objectFit: 'cover' }} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>{t('site.name')}</span>
            <span className={styles.brandSub}>{t('site.subtitle')}</span>
          </div>
        </Link>

        {/* ── Desktop navigation ── */}
        <nav className={styles.nav} aria-label={t('nav.mainNav')} role="navigation">
          <NavLink to="/" className={navCls} end onClick={close}>{t('nav.home')}</NavLink>
          <NavLink to="/about" className={navCls} onClick={close}>{t('nav.about')}</NavLink>
          <NavLink to="/quran-school" className={navCls} onClick={close}>{t('nav.quranSchool')}</NavLink>
          <NavLink to="/manuscripts" className={navCls} onClick={close}>{t('nav.manuscripts')}</NavLink>
          <NavLink to="/sewing" className={navCls} onClick={close}>{t('nav.sewing')}</NavLink>
          <NavLink to="/activities" className={navCls} onClick={close}>{t('nav.activities')}</NavLink>
          <NavLink to="/association" className={navCls} onClick={close}>{t('nav.association')}</NavLink>
          <NavLink to="/library" className={navCls} onClick={close}>{t('nav.library')}</NavLink>
          <NavLink to="/reading-list" className={navCls} onClick={close}>
            {t('nav.readingList')}
            {listCount > 0 && <span className={styles.badge}>{listCount}</span>}
          </NavLink>
          <NavLink to="/contact" className={navCls} onClick={close}>{t('nav.contact')}</NavLink>
        </nav>

        {/* ── Header actions ── */}
        <div className={styles.actions}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}
            title={t('nav.toggleTheme')}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <button
            className={styles.langToggle}
            onClick={toggleLanguage}
            aria-label={t('language.switchTo')}
            title={t('language.switchTo')}
          >
            {t('language.switchTo')}
          </button>

          <Link to="/admin" className={`btn btn-sm btn-ghost ${styles.adminBtn}`}>
            {t('nav.admin')}
          </Link>

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={t('nav.openMenu')}
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
        aria-label={t('nav.mobileMenu')}
        aria-hidden={!menuOpen}
      >
        <NavLink to="/" className={mobileCls} end onClick={close}>{t('nav.home')}</NavLink>
        <NavLink to="/about" className={mobileCls} onClick={close}>{t('nav.about')}</NavLink>
        <NavLink to="/quran-school" className={mobileCls} onClick={close}>{t('nav.quranSchool')}</NavLink>
        <NavLink to="/manuscripts" className={mobileCls} onClick={close}>{t('nav.manuscripts')}</NavLink>
        <NavLink to="/sewing" className={mobileCls} onClick={close}>{t('nav.sewing')}</NavLink>
        <NavLink to="/activities" className={mobileCls} onClick={close}>{t('nav.activities')}</NavLink>
        <NavLink to="/association" className={mobileCls} onClick={close}>{t('nav.association')}</NavLink>
        <NavLink to="/library" className={mobileCls} onClick={close}>{t('nav.library')}</NavLink>
        <NavLink to="/reading-list" className={mobileCls} onClick={close}>
          {t('nav.readingList')}
          {listCount > 0 && <span className={styles.badge}>{listCount}</span>}
        </NavLink>
        <NavLink to="/contact" className={mobileCls} onClick={close}>{t('nav.contact')}</NavLink>
        <Link to="/admin" className={styles.mobileLink} onClick={close}>
          {t('nav.admin')}
        </Link>
      </nav>
    </header>
  )
}
