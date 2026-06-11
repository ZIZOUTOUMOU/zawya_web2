// frontend-react/src/pages/AssociationPage.jsx
// الجمعية — The Association / Organization Page

import SectionHero from '../components/ui/SectionHero'
import styles from './SectionPage.module.css'

const TEAM = [
  { emoji: '👤', name: 'أضف الاسم هنا', role: 'رئيس الجمعية' },
  { emoji: '👤', name: 'أضف الاسم هنا', role: 'نائب الرئيس' },
  { emoji: '👤', name: 'أضف الاسم هنا', role: 'الأمين العام' },
  { emoji: '👤', name: 'أضف الاسم هنا', role: 'أمين المال' },
  { emoji: '👤', name: 'أضف الاسم هنا', role: 'عضو المجلس' },
  { emoji: '👤', name: 'أضف الاسم هنا', role: 'عضو المجلس' },
  { emoji: '👤', name: 'أضف الاسم هنا', role: 'عضو المجلس' },
  { emoji: '👤', name: 'أضف الاسم هنا', role: 'عضو المجلس' },
]

const GOALS = [
  { icon: '📚', title: 'نشر العلم',         text: 'دعم التعليم وتوفير الفرص التعليمية لأبناء المنطقة.' },
  { icon: '🏛️', title: 'صون التراث',        text: 'الحفاظ على الموروث الثقافي والحضاري الإسلامي.' },
  { icon: '🤝', title: 'التماسك الاجتماعي', text: 'تعزيز الروابط الاجتماعية وتقديم الدعم المجتمعي.' },
  { icon: '🌱', title: 'التنمية المستدامة',  text: 'دعم مشاريع التنمية المستدامة في المنطقة.' },
]

export default function AssociationPage() {
  return (
    <div dir="rtl">
      <SectionHero
        title="الجمعية"
        subtitle="منظمتنا وهيكلنا التنظيمي"
        description="جمعية الزاوية الثقافية والتعليمية — نعمل من أجل مجتمع متعلم ومتحضر."
        badge="الهيئة الإدارية"
      />

      <section className={`section ${styles.content}`}>
        <div className="container">

          {/* Intro */}
          <div className={styles.introGrid}>
            <div className={styles.introText}>
              <h2 className="section-title">عن الجمعية</h2>
              {/* ↓↓↓ REPLACE WITH YOUR TEXT ↓↓↓ */}
              <p>
                أضف هنا نصاً تعريفياً بالجمعية — تاريخ تأسيسها، أهدافها،
                ورقم تسجيلها القانوني.
              </p>
              <p>
                يمكنك ذكر الشركاء والداعمين والإنجازات التي حققتها الجمعية
                منذ تأسيسها.
              </p>
              {/* ↑↑↑ END ↑↑↑ */}
            </div>
            <div className={styles.introImage}>
              <div className="img-placeholder" style={{ minHeight: 280 }}>
                {/* <img src="/images/association.jpg" alt="الجمعية" /> */}
                <span style={{ fontSize: '4rem' }}>🤝</span>
                <span>صورة الجمعية</span>
              </div>
            </div>
          </div>

          <div className="ornament-divider"><span>✦</span></div>

          {/* Goals */}
          <h2 className="section-title centered" style={{ textAlign: 'center' }}>أهدافنا</h2>
          <div className={styles.valuesGrid}>
            {GOALS.map(g => (
              <div key={g.title} className={`card ${styles.valueCard}`}>
                <span className={styles.valueIcon}>{g.icon}</span>
                <h4 className={styles.valueTitle}>{g.title}</h4>
                <p className={styles.valueText}>{g.text}</p>
              </div>
            ))}
          </div>

          <div className="ornament-divider"><span>✦</span></div>

          {/* Documents / Legal info */}
          <div className={styles.infoCard}>
            <h3>المعلومات القانونية</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
              {[
                { label: 'رقم السجل', value: 'أضف الرقم هنا' },
                { label: 'تاريخ التأسيس', value: 'أضف التاريخ هنا' },
                { label: 'الولاية', value: 'قمار، الجزائر' },
              ].map(i => (
                <div key={i.label}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>{i.label}</div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{i.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ornament-divider"><span>✦</span></div>

          {/* Team */}
          <h2 className="section-title centered" style={{ textAlign: 'center' }}>أعضاء مجلس الإدارة</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            الفريق المسيّر لجمعية الزاوية
          </p>
          <div className={styles.teamGrid}>
            {TEAM.map((member, i) => (
              <div key={i} className={styles.teamCard}>
                <div className={styles.teamAvatar}>
                  {/* <img src={member.photoUrl} alt={member.name} /> */}
                  <span>{member.emoji}</span>
                </div>
                <div className={styles.teamName}>{member.name}</div>
                <div className={styles.teamRole}>{member.role}</div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
