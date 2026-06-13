import { useState } from 'react'
import { useT } from '../context/LanguageContext'
import SectionHero from '../components/ui/SectionHero'
import { sendContactMessage } from '../services/api'
import styles from './SectionPage.module.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d][\d\s\-().]{4,29}$/

// Google Maps place link for الزاوية التجانية
const MAPS_URL = 'https://www.google.com/maps/place/الزاوية+التجانية%E2%80%AD/@33.4908891,6.8074102,17z/data=!3m1!4b1!4m6!3m5!1s0x12591910bf27b0e3:0xb43acf1d61f73374!8m2!3d33.4908891!4d6.8048353!16s%2Fg%2F11bwp6fxzg?entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D'

export default function ContactPage() {
  const t = useT()
  const [form, setForm]     = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [error,  setError]  = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setFieldErrors(fe => (fe[name] ? { ...fe, [name]: null } : fe))
  }

  const validate = () => {
    const fe = {}
    if (!form.name.trim())                              fe.name    = t('contact.errName')
    if (!EMAIL_RE.test(form.email.trim()))              fe.email   = t('contact.errEmail')
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) fe.phone = t('contact.errPhone')
    if (!form.subject)                                  fe.subject = t('contact.errSubject')
    if (form.message.trim().length < 10)                fe.message = t('contact.errMessage')
    return fe
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    const fe = validate()
    if (Object.keys(fe).length) { setFieldErrors(fe); return }
    setFieldErrors({})

    setStatus('sending')
    const res = await sendContactMessage({
      name:    form.name.trim(),
      email:   form.email.trim(),
      phone:   form.phone.trim(),
      subject: form.subject,
      message: form.message.trim(),
    })

    if (res.success) {
      setStatus('success')
      return
    }

    setStatus('idle')
    if (Array.isArray(res.details) && res.details.length) {
      // Server-side validation: map field errors to translated copy
      const serverFe = {}
      const KEYS = { name: 'errName', email: 'errEmail', phone: 'errPhone', subject: 'errSubject', message: 'errMessage' }
      res.details.forEach(d => { if (KEYS[d.field]) serverFe[d.field] = t(`contact.${KEYS[d.field]}`) })
      setFieldErrors(serverFe)
    } else if ((res.error || '').includes('Too many')) {
      setError(t('contact.errRateLimit'))
    } else {
      setError(t('contact.errGeneric'))
    }
  }

  return (
    <div>
      <SectionHero
        title={t('nav.contact')}
        subtitle={t('contact.heroSubtitle')}
        description={t('contact.heroDesc')}
        badge={t('contact.heroBadge')}
      />

      <section className={`section ${styles.content}`}>
        <div className="container">
          <div className={styles.contactGrid}>

            <div className={styles.contactInfo}>
              <h2 className="section-title">{t('contact.heading')}</h2>

              <ContactInfoItem
                icon="📧"
                title={t('contact.emailTitle')}
                content={
                  <a href="mailto:zawiya@example.com" className={styles.link}>
                    zawiya@example.com
                  </a>
                }
                note={t('contact.emailNote')}
              />

              <ContactInfoItem
                icon="📞"
                title={t('contact.phoneTitle')}
                content={
                  <a href="tel:+213XXXXXXXX" className={styles.link}>
                    +213 XX XX XX XX
                  </a>
                }
                note={t('contact.phoneNote')}
              />

              <ContactInfoItem
                icon="📍"
                title={t('contact.addressTitle')}
                content={
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {t('contact.addressValue')}
                  </a>
                }
                note={t('contact.addressNote')}
              />

              <ContactInfoItem
                icon="⏰"
                title={t('contact.hoursTitle')}
                content={<span>{t('contact.hoursDays')}</span>}
                note={t('contact.hoursTime')}
              />

              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="img-placeholder"
                style={{ minHeight: 200, marginTop: '1rem', textDecoration: 'none', cursor: 'pointer' }}
                aria-label={t('contact.mapHint')}
              >
                <span style={{ fontSize: '2rem' }} aria-hidden="true">🗺️</span>
                <span>{t('contact.mapCaption')}</span>
                <small style={{ opacity: 0.6 }}>{t('contact.mapHint')}</small>
              </a>
            </div>

            <div className={styles.contactForm}>
              {status === 'success' ? (
                <div className={styles.formSuccess}>
                  <span>✅</span>
                  <h3 style={{ color: 'var(--color-primary)' }}>{t('contact.successHeading')}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>
                    {t('contact.successMsg')}
                  </p>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                  >
                    {t('contact.successBtn')}
                  </button>
                </div>
              ) : (
                <>
                  <h3>{t('contact.formHeading')}</h3>
                  <form onSubmit={handleSubmit} noValidate>

                    <div className={styles.formRow}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="name">{t('contact.formName')}</label>
                        <input
                          id="name" name="name" type="text"
                          className="form-input"
                          value={form.name} onChange={handleChange}
                          placeholder={t('contact.namePlaceholder')}
                          aria-invalid={!!fieldErrors.name}
                          required
                        />
                        <FieldError msg={fieldErrors.name} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="phone">{t('contact.formPhone')}</label>
                        <input
                          id="phone" name="phone" type="tel"
                          className="form-input"
                          value={form.phone} onChange={handleChange}
                          placeholder="+213 XX XX XX XX"
                          aria-invalid={!!fieldErrors.phone}
                          dir="ltr"
                        />
                        <FieldError msg={fieldErrors.phone} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="email">{t('contact.formEmail')}</label>
                      <input
                        id="email" name="email" type="email"
                        className="form-input"
                        value={form.email} onChange={handleChange}
                        placeholder="example@mail.com"
                        aria-invalid={!!fieldErrors.email}
                        dir="ltr"
                        required
                      />
                      <FieldError msg={fieldErrors.email} />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="subject">{t('contact.formSubject')}</label>
                      <select
                        id="subject" name="subject"
                        className="form-select"
                        value={form.subject} onChange={handleChange}
                        aria-invalid={!!fieldErrors.subject}
                        required
                      >
                        <option value="">{t('contact.subjectPlaceholder')}</option>
                        <option>{t('contact.subjectGeneral')}</option>
                        <option>{t('contact.subjectQuran')}</option>
                        <option>{t('contact.subjectSewing')}</option>
                        <option>{t('contact.subjectMss')}</option>
                        <option>{t('contact.subjectJoin')}</option>
                        <option>{t('contact.subjectDonate')}</option>
                        <option>{t('contact.subjectOther')}</option>
                      </select>
                      <FieldError msg={fieldErrors.subject} />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="message">{t('contact.formMessage')}</label>
                      <textarea
                        id="message" name="message"
                        className="form-textarea"
                        value={form.message} onChange={handleChange}
                        placeholder={t('contact.messagePlaceholder')}
                        rows={5}
                        aria-invalid={!!fieldErrors.message}
                        required
                      />
                      <FieldError msg={fieldErrors.message} />
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
                      {status === 'sending' ? t('contact.sendingText') : t('contact.submitText')}
                    </button>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
                      {t('contact.privacy')}
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

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p role="alert" style={{ color: '#dc2626', fontSize: '0.82rem', marginTop: '0.35rem', marginBottom: 0 }}>
      {msg}
    </p>
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
