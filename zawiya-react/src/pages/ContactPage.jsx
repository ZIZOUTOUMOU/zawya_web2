// frontend-react/src/pages/ContactPage.jsx
// التواصل — Contact Us Page with functional form

import { useState } from 'react'
import SectionHero from '../components/ui/SectionHero'
import styles from './SectionPage.module.css'

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [error,  setError]  = useState('')

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    setError('')

    // ─────────────────────────────────────────────────────────────────
    // OPTION A: Send via a backend endpoint you create in Express
    // Example: POST /api/contact
    // ─────────────────────────────────────────────────────────────────
    // try {
    //   const res = await fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(form),
    //   })
    //   if (!res.ok) throw new Error('فشل الإرسال')
    //   setStatus('success')
    // } catch (err) {
    //   setError(err.message)
    //   setStatus('error')
    // }

    // ─────────────────────────────────────────────────────────────────
    // OPTION B: Simple mailto fallback (works without a backend)
    // ─────────────────────────────────────────────────────────────────
    const subject = encodeURIComponent(form.subject || 'رسالة من الموقع')
    const body    = encodeURIComponent(
      `الاسم: ${form.name}\nالبريد: ${form.email}\nالهاتف: ${form.phone}\n\n${form.message}`
    )
    window.location.href = `mailto:zawiya@example.com?subject=${subject}&body=${body}`
    // Simulate success for UX
    setTimeout(() => setStatus('success'), 400)
  }

  return (
    <div dir="rtl">
      <SectionHero
        title="تواصل معنا"
        subtitle="نحن هنا للإجابة على استفساراتك"
        description="يسعدنا سماع منك. تواصل معنا للاستفسار أو الانضمام أو أي طلب آخر."
        badge="تواصل"
      />

      <section className={`section ${styles.content}`}>
        <div className="container">
          <div className={styles.contactGrid}>

            {/* ── Contact info ── */}
            <div className={styles.contactInfo}>
              <h2 className="section-title">معلومات التواصل</h2>

              <ContactInfoItem
                icon="📧"
                title="البريد الإلكتروني"
                content={
                  <a href="mailto:zawiya@example.com" className={styles.link}>
                    zawiya@example.com
                  </a>
                }
                note="نرد خلال ٢٤ ساعة"
              />

              <ContactInfoItem
                icon="📞"
                title="الهاتف"
                content={
                  <a href="tel:+213XXXXXXXX" className={styles.link}>
                    +213 XX XX XX XX
                  </a>
                }
                note="من الأحد إلى الخميس، ٨ص–٤م"
              />

              <ContactInfoItem
                icon="📍"
                title="العنوان"
                content={<span>قمار، الجزائر</span>}
                note="FRR3+9W4, Guemar"
              />

              <ContactInfoItem
                icon="⏰"
                title="أوقات الدوام"
                content={<span>الأحد – الخميس</span>}
                note="٨:٠٠ صباحاً – ٥:٠٠ مساءً"
              />

              {/* Map placeholder */}
              <div className="img-placeholder" style={{ minHeight: 200, marginTop: '1rem' }}>
                {/* Replace with an actual map embed:
                  <iframe
                    src="https://www.google.com/maps/embed?pb=..."
                    width="100%" height="100%" style={{ border: 0 }}
                    allowFullScreen loading="lazy"
                  />
                */}
                <span style={{ fontSize: '2rem' }}>🗺️</span>
                <span>خريطة الموقع</span>
                <small style={{ opacity: 0.6 }}>أضف رابط خرائط جوجل هنا</small>
              </div>
            </div>

            {/* ── Contact form ── */}
            <div className={styles.contactForm}>
              {status === 'success' ? (
                <div className={styles.formSuccess}>
                  <span>✅</span>
                  <h3 style={{ color: 'var(--color-primary)' }}>تم الإرسال بنجاح!</h3>
                  <p style={{ color: 'var(--text-muted)' }}>
                    شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
                  </p>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <>
                  <h3>أرسل لنا رسالة</h3>
                  <form onSubmit={handleSubmit} noValidate>

                    <div className={styles.formRow}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="name">الاسم الكامل *</label>
                        <input
                          id="name" name="name" type="text"
                          className="form-input"
                          value={form.name} onChange={handleChange}
                          placeholder="اسمك الكامل"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="phone">رقم الهاتف</label>
                        <input
                          id="phone" name="phone" type="tel"
                          className="form-input"
                          value={form.phone} onChange={handleChange}
                          placeholder="+213 XX XX XX XX"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="email">البريد الإلكتروني *</label>
                      <input
                        id="email" name="email" type="email"
                        className="form-input"
                        value={form.email} onChange={handleChange}
                        placeholder="example@mail.com"
                        dir="ltr"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="subject">موضوع الرسالة *</label>
                      <select
                        id="subject" name="subject"
                        className="form-select"
                        value={form.subject} onChange={handleChange}
                        required
                      >
                        <option value="">اختر موضوعاً…</option>
                        <option>الاستفسار العام</option>
                        <option>التسجيل في المدرسة القرآنية</option>
                        <option>التسجيل في ورشات الخياطة</option>
                        <option>المخطوطات والتراث</option>
                        <option>الانضمام للجمعية</option>
                        <option>التبرع والدعم</option>
                        <option>أخرى</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="message">رسالتك *</label>
                      <textarea
                        id="message" name="message"
                        className="form-textarea"
                        value={form.message} onChange={handleChange}
                        placeholder="اكتب رسالتك هنا…"
                        rows={5}
                        required
                      />
                    </div>

                    {error && (
                      <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        ⚠️ {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%' }}
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? 'جارٍ الإرسال…' : 'إرسال الرسالة ✉️'}
                    </button>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
                      لن نشارك معلوماتك مع أي طرف ثالث.
                    </p>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

function ContactInfoItem({ icon, title, content, note }) {
  return (
    <div className={styles.contactInfoItem}>
      <div className={styles.contactInfoIcon}>{icon}</div>
      <div className={styles.contactInfoBody}>
        <h4>{title}</h4>
        <p>{content}</p>
        {note && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{note}</p>}
      </div>
    </div>
  )
}
