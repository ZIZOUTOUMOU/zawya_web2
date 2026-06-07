// frontend-react/src/pages/admin/AdminLoginPage.jsx
// لوحة التحكم — Admin Login

import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { adminLogin, adminMe } from '../../services/api'
import styles from './Admin.module.css'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  // If already logged in, redirect to dashboard
  useEffect(() => {
    adminMe().then(r => { if (r.success) navigate('/admin', { replace: true }) })
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const r = await adminLogin(email, password)
    setLoading(false)
    if (r.success) {
      navigate('/admin', { replace: true })
    } else {
      setError(r.error || 'فشل تسجيل الدخول. تحقق من بياناتك.')
    }
  }

  return (
    <div className={styles.loginPage} dir="rtl">
      <div className={styles.loginCard}>
        <div className={styles.loginBrand}>
          <svg width="52" height="52" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="var(--color-primary)"/>
            <path d="M20 8 L22.9 16.1 H31.5 L24.8 21.2 L27.7 29.3 L20 24.2 L12.3 29.3 L15.2 21.2 L8.5 16.1 H17.1 Z" fill="var(--color-accent)"/>
          </svg>
          <h1 className={styles.loginTitle}>لوحة تحكم الزاوية</h1>
          <p className={styles.loginSub}>أدخل بياناتك للوصول إلى لوحة الإدارة</p>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">البريد الإلكتروني</label>
            <input
              id="email" type="email"
              className="form-input"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
              dir="ltr"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">كلمة المرور</label>
            <input
              id="password" type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className={styles.loginError}>⚠️ {error}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'جارٍ الدخول…' : 'تسجيل الدخول'}
          </button>
        </form>

        <p className={styles.loginBack}>
          <Link to="/">← العودة إلى الموقع</Link>
        </p>
      </div>
    </div>
  )
}
