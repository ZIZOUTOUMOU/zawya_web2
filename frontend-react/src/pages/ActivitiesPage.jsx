import { useState, useEffect, useCallback } from 'react'
import { useT, useLanguage } from '../context/LanguageContext'
import SectionHero from '../components/ui/SectionHero'
import PageLoader from '../components/ui/PageLoader'
import { getEvents, assetUrl } from '../services/api'
import styles from './SectionPage.module.css'

/** Pick the field matching the active language, falling back to the other */
function pick(ev, field, language) {
  return language === 'ar'
    ? (ev[`${field}_ar`] || ev[`${field}_en`])
    : (ev[`${field}_en`] || ev[`${field}_ar`])
}

/** Format an ISO date for display; Arabic locale uses Eastern Arabic numerals */
function formatEventDate(iso, language) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const locale = language === 'ar' ? 'ar' : 'en-GB'
  let out = new Intl.DateTimeFormat(locale, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(d)
  if (d.getHours() || d.getMinutes()) {
    out += ' · ' + new Intl.DateTimeFormat(locale, {
      hour: 'numeric', minute: '2-digit',
    }).format(d)
  }
  return out
}

export default function ActivitiesPage() {
  const t = useT()
  const { language } = useLanguage()
  const [events, setEvents]     = useState(null)   // null = loading
  const [error, setError]       = useState(null)
  const [showPast, setShowPast] = useState(false)

  const load = useCallback(async () => {
    setEvents(null)
    setError(null)
    const res = await getEvents()
    if (!res.success) {
      setError(res.error || 'Error')
      setEvents([])
      return
    }
    setEvents(res.data || [])
  }, [])

  useEffect(() => { load() }, [load])

  // Events from today onward count as upcoming, even if their time has passed
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const upcoming = (events || [])
    .filter(ev => new Date(ev.date) >= startOfToday)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const past = (events || [])
    .filter(ev => new Date(ev.date) < startOfToday)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div>
      <SectionHero
        title={t('nav.activities')}
        subtitle={t('activities.heroSubtitle')}
        description={t('activities.heroDesc')}
        badge={t('activities.heroBadge')}
      />

      <section className={`section ${styles.content}`}>
        <div className="container">

          {events === null && <PageLoader />}

          {error && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ marginBottom: '1.25rem' }}>{t('activities.error')}</p>
              <button className="btn btn-primary btn-sm" onClick={load}>
                {t('activities.retry')}
              </button>
            </div>
          )}

          {events !== null && !error && (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                {t('activities.upcomingHeading')}
              </h2>

              {upcoming.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  {t('activities.emptyUpcoming')}
                </p>
              ) : (
                <div className={styles.activityGrid}>
                  {upcoming.map(ev => (
                    <EventCard key={ev.id} event={ev} language={language} t={t} />
                  ))}
                </div>
              )}

              {past.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setShowPast(s => !s)}
                      aria-expanded={showPast}
                    >
                      {showPast
                        ? t('activities.hidePast')
                        : t('activities.showPast', {
                            count: past.length.toLocaleString(language === 'ar' ? 'ar' : 'en'),
                          })}
                    </button>
                  </div>

                  {showPast && (
                    <>
                      <h2 style={{ textAlign: 'center', margin: '2rem 0 0.5rem' }}>
                        {t('activities.pastHeading')}
                      </h2>
                      <div className={styles.activityGrid}>
                        {past.map(ev => (
                          <EventCard key={ev.id} event={ev} language={language} t={t} past />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          <div className={styles.infoCard} style={{ marginTop: '3rem' }}>
            <h3>{t('activities.infoHeading')}</h3>
            <p>
              {t('activities.infoText')}
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}

function EventCard({ event: ev, language, t, past = false }) {
  const title    = pick(ev, 'title', language)
  const desc     = pick(ev, 'description', language)
  const location = pick(ev, 'location', language)

  return (
    <div className={styles.activityCard} style={past ? { opacity: 0.75 } : undefined}>
      <div className={styles.activityImg}>
        {ev.image
          ? <img src={assetUrl(ev.image)} alt={t('activities.imageAlt', { title })} loading="lazy" />
          : <span aria-hidden="true">📅</span>}
      </div>
      <div className={styles.activityBody}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
          <span className={styles.activityDate}>{formatEventDate(ev.date, language)}</span>
          {location && <span className="badge">📍 {location}</span>}
        </div>
        <h3 className={styles.activityTitle}>{title}</h3>
        {desc && <p className={styles.activityDesc}>{desc}</p>}
      </div>
    </div>
  )
}
