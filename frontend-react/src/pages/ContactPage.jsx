import { useState } from 'react'
import { useT } from '../context/LanguageContext'
import SectionHero from '../components/ui/SectionHero'
import styles from './SectionPage.module.css'

export default function ContactPage() {
  const t = useT()
  const [form, setForm]     = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [error,  setError]  = useState('')

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    setError('')

    const subject = encodeURIComponent(form.subject || '')
    const body    = encodeURIComponent(
      `${t('contact.formName')}: ${form.name}\n${t('contact.formEmail')}: ${form.email}\n${t('contact.formPhone')}: ${form.phone}\n\n${form.message}`
    )
    window.location.href = `mailto:zawiya@example.com?subject=${subject}&body=${body}`
    setTimeout(() => setStatus('success'), 400)
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
                content={<span>{t('contact.addressValue')}</span>}
                note={t('contact.addressNote')}
              />

              <ContactInfoItem
                icon="⏰"
                title={t('contact.hoursTitle')}
                content={<span>{t('contact.hoursDays')}</span>}
                note={t('contact.hoursTime')}
              />

              <div className="img-placeholder" style={{ minHeight: 200, marginTop: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🗺️</span>
                <span>{t('contact.mapCaption')}</span>
                <small style={{ opacity: 0.6 }}>{t('contact.mapHint')}</small>
              </div>
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
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="phone">{t('contact.formPhone')}</label>
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
                      <label className="form-label" htmlFor="email">{t('contact.formEmail')}</label>
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
                      <label className="form-label" htmlFor="subject">{t('contact.formSubject')}</label>
                      <select
                        id="subject" name="subject"
                        className="form-select"
                        value={form.subject} onChange={handleChange}
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
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="message">{t('contact.formMessage')}</label>
                      <textarea
                        id="message" name="message"
                        className="form-textarea"
                        value={form.message} onChange={handleChange}
                        placeholder={t('contact.messagePlaceholder')}
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
