import { getTranslations } from 'next-intl/server';
import { BrushIcon } from '@/components/icons/BrushIcon';
import { LocalTime } from '@/components/layout/LocalTime/LocalTime';
import { Logo } from '@/components/layout/Logo/Logo';
import { SectionNav } from '@/components/navigation/SectionNav/SectionNav';
import { SocialLinks } from '@/components/social/SocialLinks/SocialLinks';
import { footerSocialOrder } from '@/content/links';
import { designSystemPath } from '@/content/designSystem';
import { contactEmail } from '@/content/site';
import { Link } from '@/features/i18n/navigation';
import styles from './SiteFooter.module.css';

/** Figma: desktop 220:76, mobile 233:621; the brush link 831:1599. */
export async function SiteFooter() {
  const t = await getTranslations('Footer');

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.column}>
            <Logo animation="footer" typography="text-title-s" />
            <p className={`${styles.localTime} text-body-s`}>
              {t.rich('localTime', { time: () => <LocalTime /> })}
            </p>
            {/* Same icon-and-tooltip pattern as the social links (hover.css). */}
            <Link href={designSystemPath} className={`social-link ${styles.designSystem}`}>
              <BrushIcon />
              <span className="social-label" aria-hidden="true">
                {t('designSystem')}
              </span>
              <span className="visually-hidden">{t('designSystem')}</span>
            </Link>
          </div>

          <SectionNav label={t('nav')} orientation="responsive" size="m" />

          <div className={styles.column}>
            <a className={`hover-link ${styles.email} text-body-m`} href={`mailto:${contactEmail}`}>
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
