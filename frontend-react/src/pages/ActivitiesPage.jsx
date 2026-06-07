// frontend-react/src/pages/ActivitiesPage.jsx
// أنشطة مختلفة — General Community Activities (blog/gallery)

import SectionHero from '../components/ui/SectionHero'
import styles from './SectionPage.module.css'

// ─── Placeholder activities — replace with API or CMS data ────────
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

const CATEGORIES = ['الكل', ...new Set(ACTIVITIES.map(a => a.category))]

import { useState } from 'react'

export default function ActivitiesPage() {
  const [filter, setFilter] = useState('الكل')

  const filtered = filter === 'الكل'
    ? ACTIVITIES
    : ACTIVITIES.filter(a => a.category === filter)

  return (
    <div dir="rtl">
      <SectionHero
        title="أنشطة مختلفة"
        subtitle="فعاليات وبرامج لكل المجتمع"
        description="نظّم الزاوية طوال العام فعاليات ثقافية وتعليمية ودينية واجتماعية متنوعة."
        badge="فعاليات وأنشطة"
      />

      <section className={`section ${styles.content}`}>
        <div className="container">

          {/* Filter */}
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

          {/* Activities grid */}
          <div className={styles.activityGrid}>
            {filtered.map(act => (
              <ActivityCard key={act.id} activity={act} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              لا توجد فعاليات في هذا التصنيف حالياً.
            </p>
          )}

          {/* Note */}
          <div className={styles.infoCard} style={{ marginTop: '3rem' }}>
            <h3>إضافة فعاليات جديدة</h3>
            <p>
              لإضافة فعاليات حقيقية، عدّل مصفوفة <code style={{ background: 'rgba(255,255,255,0.15)', padding: '0 4px', borderRadius: '3px', margin: '0 4px' }}>ACTIVITIES</code>
              في ملف <code style={{ background: 'rgba(255,255,255,0.15)', padding: '0 4px', borderRadius: '3px' }}>ActivitiesPage.jsx</code>،
              أو أنشئ جدول قاعدة بيانات وربطه بـ API.
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
