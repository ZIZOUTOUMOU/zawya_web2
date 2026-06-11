// frontend-react/src/components/ui/PageLoader.jsx
// Full-page loading spinner shown during lazy-load (Suspense fallback)

import { useT } from '../../context/LanguageContext'

export default function PageLoader() {
  const t = useT()
  return (
    <div role="status" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '1rem',
      color: 'var(--text-muted)'
    }}>
      <div aria-hidden="true" style={{
        width: 40, height: 40,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--color-accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}/>
      <span style={{ fontSize: '0.9rem' }}>{t('common.loading')}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
