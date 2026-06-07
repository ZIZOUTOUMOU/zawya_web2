// frontend-react/src/pages/SewingPage.jsx
// قسم الخياطة — Sewing & Traditional Crafts Section

import { Link } from 'react-router-dom'
import SectionHero from '../components/ui/SectionHero'
import styles from './SectionPage.module.css'

const WORKSHOPS = [
  { emoji: '🪡', title: 'الخياطة الأساسية',       desc: 'دروس تعليمية للمبتدئين في أساسيات الخياطة والقص.', level: 'مبتدئ',    duration: '٣ أشهر' },
  { emoji: '✂️', title: 'الخياطة المتقدمة',        desc: 'تعلّم تصميم الملابس وخياطة الأزياء التقليدية الجزائرية.', level: 'متقدم', duration: '٦ أشهر' },
  { emoji: '🧵', title: 'التطريز والزخرفة',         desc: 'فن التطريز اليدوي بالأنماط الأمازيغية والإسلامية.', level: 'جميع المستويات', duration: 'شهران' },
  { emoji: '🎀', title: 'صناعة الإكسسوار',          desc: 'تصنيع الإكسسوارات التقليدية وأدوات الزينة اليدوية.', level: 'متوسط', duration: 'شهر' },
  { emoji: '🧶', title: 'الكروشيه والتريكو',          desc: 'دروس في الكروشيه والتريكو لتصنيع الملابس والإكسسوارات.', level: 'مبتدئ', duration: 'شهران' },
  { emoji: '👗', title: 'الأزياء التقليدية',          desc: 'صناعة وتوثيق الأزياء التقليدية الجزائرية.', level: 'جميع المستويات', duration: '٤ أشهر' },
]

export default function SewingPage() {
  return (
    <div dir="rtl">
      <SectionHero
        title="قسم الخياطة والحرف اليدوية"
        subtitle="الحرف الأصيلة — توارث عبر الأجيال"
        description="نحافظ على فنون الخياطة والتطريز التقليدي ونعلّمها للأجيال الجديدة."
        badge="حرف يدوية"
      />

      <section className={`section ${styles.content}`}>
        <div className="container">

          <div className={styles.introGrid}>
            <div className={styles.introText}>
              <h2 className="section-title">عن القسم</h2>
              {/* ↓↓↓ REPLACE WITH YOUR TEXT ↓↓↓ */}
              <p>أضف هنا وصفاً لقسم الخياطة — تاريخه، أهدافه، وما يقدمه للمجتمع.</p>
              <p>يمكنك ذكر عدد المتدربات والمدربات المتخصصات في القسم.</p>
              {/* ↑↑↑ END ↑↑↑ */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary">التسجيل في ورشة</Link>
                <Link to="/contact" className="btn btn-ghost">للمزيد من المعلومات</Link>
              </div>
            </div>
            <div className={styles.introImage}>
              <div className="img-placeholder" style={{ minHeight: 300 }}>
                {/* <img src="/images/sewing-section.jpg" alt="قسم الخياطة" /> */}
                <span style={{ fontSize: '4rem' }}>🪡</span>
                <span>صورة من الورشة</span>
              </div>
            </div>
          </div>

          <div className="ornament-divider"><span>✦</span></div>

          {/* Workshops */}
          <h2 className="section-title" style={{ textAlign: 'center' }}>ورشاتنا التدريبية</h2>
          <div className={styles.workshopGrid}>
            {WORKSHOPS.map(w => (
              <WorkshopCard key={w.title} workshop={w} />
            ))}
          </div>

          <div className="ornament-divider"><span>✦</span></div>

          {/* Gallery */}
          <div className={styles.gallery}>
            <h3 className={styles.galleryTitle}>من إبداعات المتدربات</h3>
            <div className={styles.galleryGrid}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="img-placeholder" style={{ minHeight: 160 }}>
                  {/* <img src={`/images/sewing-work-${i}.jpg`} alt={`إبداع ${i}`} /> */}
                  <span style={{ fontSize: '1.5rem' }}>🎨</span>
                  <span style={{ fontSize: '0.8rem' }}>عمل {i}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

function WorkshopCard({ workshop: w }) {
  return (
    <div className={styles.workshopCard}>
      <div className={styles.workshopImg}>
        {/* <img src={w.imageUrl} alt={w.title} /> */}
        <span>{w.emoji}</span>
      </div>
      <div className={styles.workshopBody}>
        <h3 className={styles.workshopTitle}>{w.title}</h3>
        <p className={styles.workshopDesc}>{w.desc}</p>
        <div className={styles.workshopMeta}>
          <span className="badge">{w.level}</span>
          <span className="badge" style={{ background: 'color-mix(in srgb, var(--color-primary) 10%, var(--bg-elevated-2))', color: 'var(--color-primary)' }}>
            ⏱ {w.duration}
          </span>
        </div>
      </div>
    </div>
  )
}
