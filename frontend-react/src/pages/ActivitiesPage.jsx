import { useState } from 'react'
import { useT } from '../context/LanguageContext'
import SectionHero from '../components/ui/SectionHero'
import styles from './SectionPage.module.css'

const ACTIVITIES = [
  {
    id: 1, emoji: '🎉', date: 'يناير ٢٠٢٥',
    title: 'احتفال المولد النبوي الشريف',
    desc: 'أضف هنا وصفاً للنشاط أو الفعالية المُقامة في الزاوية.',
    category: 'ديني',
  },
  {
    id: 2, emoji: '📚', date: 'فبراير ٢٠٢٥',
    title: 'ندوة في التراث الإسلامي',
    desc: 'أضف هنا وصفاً للندوة العلمية أو الثقافية.',
    category: 'علمي',
  },
  {
    id: 3, emoji: '🌿', date: 'مارس ٢٠٢٥',
    title: 'يوم بيئي في الزاوية',
    desc: 'أضف هنا وصفاً للنشاط البيئي أو الاجتماعي.',
    category: 'اجتماعي',
  },
  {
    id: 4, emoji: '🎓', date: 'أبريل ٢٠٢٥',
    title: 'حفل توزيع شهادات المتخرجين',
    desc: 'أضف هنا وصفاً لحفل التخرج أو التكريم.',
    category: 'تعليمي',
  },
  {
    id: 5, emoji: '🍽️', date: 'مايو ٢٠٢٥',
    title: 'إفطار جماعي في رمضان',
    desc: 'أضف هنا وصفاً للفعالية الرمضانية.',
    category: 'ديني',
  },
  {
    id: 6, emoji: '🎨', date: 'يونيو ٢٠٢٥',
    title: 'معرض فنون تراثية',
    desc: 'أضف هنا وصفاً لمعرض الفنون أو الحرف.',
    category: 'ثقافي',
  },
]

export default function ActivitiesPage() {
  const t = useT()
  const CATEGORIES = [t('activities.filterAll'), ...new Set(ACTIVITIES.map(a => a.category))]
  const [filter, setFilter] = useState(t('activities.filterAll'))

  const filtered = filter === t('activities.filterAll')
    ? ACTIVITIES
    : ACTIVITIES.filter(a => a.category === filter)

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

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'center' }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={filter === c ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className={styles.activityGrid}>
            {filtered.map(act => (
              <ActivityCard key={act.id} activity={act} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              {t('activities.empty')}
            </p>
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

function ActivityCard({ activity: a }) {
  return (
    <div className={styles.activityCard}>
      <div className={styles.activityImg}>
        {/* <img src={a.imageUrl} alt={a.title} /> */}
        <span>{a.emoji}</span>
      </div>
      <div className={styles.activityBody}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span className={styles.activityDate}>{a.date}</span>
          <span className="badge">{a.category}</span>
        </div>
        <h3 className={styles.activityTitle}>{a.title}</h3>
        <p className={styles.activityDesc}>{a.desc}</p>
      </div>
    </div>
  )
}
