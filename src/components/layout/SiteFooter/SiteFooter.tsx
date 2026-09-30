import { getTranslations } from 'next-intl/server';
import { LocalTime } from '@/components/layout/LocalTime/LocalTime';
import { Logo } from '@/components/layout/Logo/Logo';
import { SectionNav } from '@/components/navigation/SectionNav/SectionNav';
import { SocialLinks } from '@/components/social/SocialLinks/SocialLinks';
import { footerSocialOrder } from '@/content/links';
import { contactEmail } from '@/content/site';
import styles from './SiteFooter.module.css';

/** Figma: desktop 220:76, mobile 233:621. */
export async function SiteFooter() {
  const t = await getTranslations('Footer');

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.column}>
            <Logo />
            <p className={`${styles.localTime} text-body-s`}>
              {t.rich('localTime', { time: () => <LocalTime /> })}
            </p>
          </div>

          <SectionNav label={t('nav')} orientation="responsive" size="m" />

          <div className={styles.column}>
            <a className={`${styles.email} text-body-m`} href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
            <SocialLinks label={t('socialNav')} order={footerSocialOrder} />
          </div>
        </div>

        <p className={`${styles.copyright} text-body-2xs`}>
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
