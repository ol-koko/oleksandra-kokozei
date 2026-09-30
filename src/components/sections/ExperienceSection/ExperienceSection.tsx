import { useTranslations } from 'next-intl';
import { SocialLinks } from '@/components/social/SocialLinks/SocialLinks';
import { roles } from '@/content/experience';
import { socialLinks } from '@/content/links';
import styles from './ExperienceSection.module.css';

const HEADING_ID = 'experience-heading';
const tileOrder = socialLinks.map((link) => link.id);

/** Section `#experience` (Figma: desktop 21:311, mobile 245:734). */
export function ExperienceSection() {
  const t = useTranslations('Experience');

  return (
    <section id="experience" aria-labelledby={HEADING_ID} className={styles.experience}>
      <div className={styles.content}>
        <h2 id={HEADING_ID} className="text-title-l">
          {t('heading')}
        </h2>

        {roles.map((role) => (
          <article key={role.id} className={styles.role}>
            <header className={styles.roleHeader}>
              <h3 className={`${styles.roleTitle} text-title-s`}>{t(`roles.${role.id}.title`)}</h3>
              <p className={`${styles.period} text-body-s`}>{t(`roles.${role.id}.period`)}</p>
            </header>

            <div className={styles.paragraphs}>
              {role.paragraphs.map((key) => (
                <p key={key} className="text-body-l">
                  {t(`roles.${role.id}.${key}`)}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>

      <SocialLinks label={t('profilesNav')} order={tileOrder} variant="tile" />
    </section>
  );
}
