// frontend-react/src/pages/QuranSchoolPage.jsx
// المدرسة القرآنية — Quranic School Section

import { Link } from 'react-router-dom'
import SectionHero from '../components/ui/SectionHero'
import styles from './SectionPage.module.css'

const PROGRAMS = [
  {
    icon: '📖',
    title: 'تحفيظ القرآن الكريم',
    text: 'برنامج متكامل لحفظ كتاب الله للأطفال والكبار بأساليب تربوية حديثة.',
    badge: 'جميع الأعمار',
  },
  {
    icon: '🎵',
    title: 'تعليم التجويد',
    text: 'دروس في أحكام التجويد والتلاوة الصحيحة وفق روايات متعددة.',
    badge: 'مستويات مختلفة',
  },
  {
    icon: '📚',
    title: 'تفسير القرآن',
    text: 'حلقات دراسية في تفسير الآيات وفهم معانيها وأسباب نزولها.',
    badge: 'للبالغين',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'برامج الأطفال',
    text: 'قسم خاص للأطفال بأساليب تعليمية مشوّقة تجمع بين الحفظ واللعب.',
    badge: '٤–١٢ سنة',
  },
  {
    icon: '🌙',
    title: 'حلقات رمضانية',
    text: 'برامج مكثفة خلال شهر رمضان المبارك لختم القرآن والمراجعة.',
    badge: 'موسمي',
  },
  {
    icon: '🏆',
    title: 'مسابقات التحفيظ',
    text: 'مشاركة في المسابقات المحلية والوطنية في تلاوة وتحفيظ القرآن.',
    badge: 'سنوي',
  },
]

export default function QuranSchoolPage() {
  return (
    <div dir="rtl">
      <SectionHero
        title="المدرسة القرآنية"
        subtitle="تعليم كتاب الله — القرآن الكريم نور القلوب"
        description="نحن مدرسة متخصصة في تحفيظ القرآن الكريم وتعليم علوم التجويد والتلاوة."
        badge="قرآن وتجويد"
      />

      <section className={`section ${styles.content}`}>
        <div className="container">

          {/* Intro */}
          <div className={styles.introGrid}>
            <div className={styles.introText}>
              <h2 className="section-title">عن المدرسة</h2>
              {/* ↓↓↓ REPLACE WITH YOUR TEXT ↓↓↓ */}
              <p>
                أضف هنا وصفاً للمدرسة القرآنية — تاريخها، منهجها التعليمي،
                وعدد الطلاب الملتحقين بها.
              </p>
              <p>
                يمكنك ذكر أسماء المعلمين والمشايخ المؤهلين الذين يشرفون
                على التعليم في المدرسة.
              </p>
              {/* ↑↑↑ END ↑↑↑ */}
              <Link to="/contact" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                التسجيل الآن
              </Link>
            </div>

            <div className={styles.introImage}>
              <div className="img-placeholder" style={{ minHeight: 320 }}>
                {/* <img src="/images/quran-school.jpg" alt="المدرسة القرآنية" /> */}
                <span style={{ fontSize: '4rem' }}>📖</span>
                <span>صورة من المدرسة</span>
                <small style={{ opacity: 0.6 }}>ضع صورتك هنا</small>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className={styles.infoCard}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', position: 'relative', zIndex: 1 }}>
              {[
                { n: '٥٠٠+', l: 'طالب وطالبة' },
                { n: '١٥',   l: 'أستاذاً مؤهلاً' },
                { n: '٣٠',   l: 'خريجاً هذا العام' },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display-arabic)', fontSize: '2.5rem', color: 'var(--color-accent-light)', fontWeight: 700 }}>{s.n}</div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ornament-divider"><span>✦</span></div>

          {/* Programs grid */}
          <h2 className="section-title centered" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>برامجنا التعليمية</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            نقدم مجموعة متنوعة من البرامج لمختلف الأعمار والمستويات
          </p>

          <div className={styles.valuesGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {PROGRAMS.map(p => (
              <ProgramCard key={p.title} {...p} />
            ))}
          </div>

          <div className="ornament-divider"><span>✦</span></div>

          {/* Gallery */}
          <div className={styles.gallery}>
            <h3 className={styles.galleryTitle}>من أجواء المدرسة</h3>
            <div className={styles.galleryGrid}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="img-placeholder" style={{ minHeight: 150 }}>
                  {/* <img src={`/images/school-${i}.jpg`} alt={`من المدرسة ${i}`} /> */}
                  <span style={{ fontSize: '1.3rem' }}>🖼️</span>
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

function ProgramCard({ icon, title, text, badge }) {
  return (
    <div className={`card ${styles.valueCard}`}>
      <span className={styles.valueIcon}>{icon}</span>
      {badge && <span className="badge" style={{ fontSize: '0.72rem' }}>{badge}</span>}
      <h4 className={styles.valueTitle}>{title}</h4>
      <p className={styles.valueText}>{text}</p>
    </div>
  )
}
