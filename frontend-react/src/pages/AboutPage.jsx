// frontend-react/src/pages/AboutPage.jsx
// ═══════════════════════════════════════════════════════
// التعريف بالزاوية — About the Zawiya
// Drop in your own text and images using the placeholder spots.
// ═══════════════════════════════════════════════════════

import SectionHero from '../components/ui/SectionHero'
import styles from './SectionPage.module.css'

export default function AboutPage() {
  return (
    <div dir="rtl">
      <SectionHero
        title="التعريف بالزاوية"
        subtitle="إرث علمي وروحاني عريق"
        description="تأسست الزاوية لتكون منارةً للعلم والثقافة والتراث الإسلامي في المنطقة."
        badge="نبذة تاريخية"
      />

      <section className={`section ${styles.content}`}>
        <div className="container">

          {/* Intro block */}
          <div className={styles.introGrid}>
            <div className={styles.introText}>
              <h2 className="section-title">من نحن</h2>
              {/* ↓↓↓ REPLACE WITH YOUR ARABIC TEXT ↓↓↓ */}
              <p>
                أضف هنا نصاً تعريفياً بالزاوية — تاريخها، تأسيسها، وأهدافها.
                يمكنك الكتابة بالعربية الفصحى أو الدارجة حسب ما يناسبك.
              </p>
              <p>
                يمكن أن تتضمن هذه الفقرة معلومات عن المؤسس والموقع الجغرافي
                والتطور التاريخي عبر الأجيال.
              </p>
              {/* ↑↑↑ END PLACEHOLDER TEXT ↑↑↑ */}
            </div>

            {/* Image placeholder — replace src with your photo */}
            <div className={styles.introImage}>
              <div className="img-placeholder" style={{ minHeight: 320 }}>
                {/* <img src="/images/zawiya-exterior.jpg" alt="مبنى الزاوية" /> */}
                <span style={{ fontSize: '3rem' }}>🕌</span>
                <span>صورة الزاوية من الخارج</span>
                <small style={{ opacity: 0.6 }}>ضع صورتك هنا</small>
              </div>
            </div>
          </div>

          <div className="ornament-divider">
            <span>✦</span>
          </div>

          {/* Values grid */}
          <div className={styles.valuesSection}>
            <h2 className="section-title centered" style={{ textAlign: 'center' }}>قيمنا ومبادئنا</h2>
            <div className={styles.valuesGrid}>
              <ValueCard icon="📖" title="العلم والمعرفة"    text="نؤمن بأن طلب العلم فريضة ورسالة مستمرة." />
              <ValueCard icon="🤲" title="الروحانية والتقوى" text="نسعى إلى تقوية الرابط الروحي بالله تعالى." />
              <ValueCard icon="🌱" title="خدمة المجتمع"      text="نهدف إلى بناء مجتمع متماسك ومتعلم." />
              <ValueCard icon="📜" title="صون التراث"        text="نحافظ على الموروث الحضاري والعلمي الإسلامي." />
            </div>
          </div>

          <div className="ornament-divider">
            <span>✦</span>
          </div>

          {/* History timeline */}
          <div className={styles.timeline}>
            <h2 className="section-title centered" style={{ textAlign: 'center' }}>لمحة تاريخية</h2>
            <div className={styles.timelineList}>
              <TimelineItem year="التأسيس" text="أضف هنا سنة التأسيس والظروف المحيطة بها." />
              <TimelineItem year="التطور"  text="أضف هنا مراحل نمو الزاوية وتوسعها عبر السنين." />
              <TimelineItem year="الحاضر"  text="أضف هنا الوضع الراهن والمشاريع الجارية." />
            </div>
          </div>

          {/* Gallery placeholder */}
          <div className={styles.gallery}>
            <h3 className={styles.galleryTitle}>من صور الزاوية</h3>
            <div className={styles.galleryGrid}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="img-placeholder" style={{ minHeight: 160 }}>
                  {/* Replace with: <img src={`/images/gallery-${i}.jpg`} alt={`صورة ${i}`} /> */}
                  <span style={{ fontSize: '1.5rem' }}>🖼️</span>
                  <span style={{ fontSize: '0.8rem' }}>صورة {i}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

function ValueCard({ icon, title, text }) {
  return (
    <div className={`card ${styles.valueCard}`}>
      <span className={styles.valueIcon}>{icon}</span>
      <h4 className={styles.valueTitle}>{title}</h4>
      <p className={styles.valueText}>{text}</p>
    </div>
  )
}

function TimelineItem({ year, text }) {
  return (
    <div className={styles.timelineItem}>
      <div className={styles.timelineMarker} />
      <div className={styles.timelineBody}>
        <span className={styles.timelineYear}>{year}</span>
        <p className={styles.timelineText}>{text}</p>
      </div>
    </div>
  )
}
