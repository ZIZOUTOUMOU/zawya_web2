import { Component } from 'react'
import { Link } from 'react-router-dom'
import translations from '../translations'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      const lang = document.documentElement.getAttribute('lang') || 'ar'
      const t = (key) => {
        const keys = key.split('.')
        let val = translations[lang]
        for (const k of keys) {
          if (val && typeof val === 'object' && k in val) val = val[k]
          else return key
        }
        return typeof val === 'string' ? val : key
      }

      return (
        <div style={{
          width: '100%',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-lg, 0.75rem)',
          border: '1px solid var(--border-color)',
        }}>
          <svg
            width="48" height="48" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ color: 'var(--color-accent, #e67e22)', flexShrink: 0 }}
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>

          <h2 style={{
            margin: 0,
            fontFamily: 'var(--font-display-arabic)',
            color: 'var(--color-primary)',
            fontSize: '1.25rem',
          }}>
            {t('errorBoundary.heading')}
          </h2>

          {this.state.error?.message && (
            <p style={{
              margin: 0,
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              maxWidth: '480px',
              wordBreak: 'break-word',
            }}>
              {this.state.error.message}
            </p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              {t('errorBoundary.retry')}
            </button>
            <Link to="/library" className="btn btn-ghost">
              {t('errorBoundary.backToLibrary')}
            </Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
