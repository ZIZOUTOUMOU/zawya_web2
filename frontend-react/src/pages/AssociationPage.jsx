import { useT } from '../context/LanguageContext'
import SectionHero from '../components/ui/SectionHero'
import styles from './SectionPage.module.css'

const TEAM = [
  { emoji: '👤', nameKey: 'teamNamePlaceholder', roleKey: 'teamRole1' },
  { emoji: '👤', nameKey: 'teamNamePlaceholder', roleKey: 'teamRole2' },
  { emoji: '👤', nameKey: 'teamNamePlaceholder', roleKey: 'teamRole3' },
  { emoji: '👤', nameKey: 'teamNamePlaceholder', roleKey: 'teamRole4' },
  { emoji: '👤', nameKey: 'teamNamePlaceholder', roleKey: 'teamRole5' },
  { emoji: '👤', nameKey: 'teamNamePlaceholder', roleKey: 'teamRole5' },
  { emoji: '👤', nameKey: 'teamNamePlaceholder', roleKey: 'teamRole5' },
  { emoji: '👤', nameKey: 'teamNamePlaceholder', roleKey: 'teamRole5' },
]

const GOALS = [
  { icon: '📚', titleKey: 'goal1Title', textKey: 'goal1Text' },
  { icon: '🏛️', titleKey: 'goal2Title', textKey: 'goal2Text' },
  { icon: '🤝', titleKey: 'goal3Title', textKey: 'goal3Text' },
  { icon: '🌱', titleKey: 'goal4Title', textKey: 'goal4Text' },
]

export default function AssociationPage() {
  const t = useT()

  return (
    <div>
      <SectionHero
        title={t('nav.association')}
        subtitle={t('association.heroSubtitle')}
        description={t('association.heroDesc')}
        badge={t('association.heroBadge')}
      />

      <section className={`section ${styles.content}`}>
        <div className="container">

          <div className={styles.introGrid}>
            <div className={styles.introText}>
              <h2 className="section-title">{t('association.headingAbout')}</h2>
              <p>{t('association.para1')}</p>
              <p>{t('association.para2')}</p>
            </div>
            <div className={styles.introImage}>
              <div className="img-placeholder" style={{ minHeight: 280 }}>
                <span style={{ fontSize: '4rem' }}>🤝</span>
                <span>{t('association.imgCaption')}</span>
              </div>
            </div>
          </div>

          <div className="ornament-divider"><span>✦</span></div>

          <h2 className="section-title centered" style={{ textAlign: 'center' }}>{t('association.goalsHeading')}</h2>
          <div className={styles.valuesGrid}>
            {GOALS.map(g => (
              <div key={g.titleKey} className={`card ${styles.valueCard}`}>
                <span className={styles.valueIcon}>{g.icon}</span>
                <h4 className={styles.valueTitle}>{t(`association.${g.titleKey}`)}</h4>
                <p className={styles.valueText}>{t(`association.${g.textKey}`)}</p>
              </div>
            ))}
          </div>

          <div className="ornament-divider"><span>✦</span></div>

          <div className={styles.infoCard}>
            <h3>{t('association.legalHeading')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
              {[
                { labelKey: 'regNumber', valueKey: 'regPlaceholder' },
                { labelKey: 'foundingDate', valueKey: 'datePlaceholder' },
                { labelKey: 'province', valueKey: 'provinceValue' },
              ].map(i => (
                <div key={i.labelKey}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>{t(`association.${i.labelKey}`)}</div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{t(`association.${i.valueKey}`)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ornament-divider"><span>✦</span></div>

          <h2 className="section-title centered" style={{ textAlign: 'center' }}>{t('association.teamHeading')}</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {t('association.teamSubtitle')}
          </p>
          <div className={styles.teamGrid}>
            {TEAM.map((member, i) => (
              <div key={i} className={styles.teamCard}>
                <div className={styles.teamAvatar}>
                  <span>{member.emoji}</span>
                </div>
                <div className={styles.teamName}>{t(`association.${member.nameKey}`)}</div>
                <div className={styles.teamRole}>{t(`association.${member.roleKey}`)}</div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
