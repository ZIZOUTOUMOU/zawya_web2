// frontend-react/src/components/ui/PageLoader.jsx
// Full-page loading spinner shown during lazy-load (Suspense fallback)

export default function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '1rem',
      color: 'var(--text-muted)'
    }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--color-accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}/>
      <span style={{ fontSize: '0.9rem' }}>جارٍ التحميل…</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
