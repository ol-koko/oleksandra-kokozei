import { useTranslations } from 'next-intl';
import { PolaroidSign } from '@/components/media/PolaroidSign/PolaroidSign';
import { AboutIntro } from '@/components/sections/AboutIntro/AboutIntro';
import { portrait } from '@/content/me';
import styles from './HeroSection.module.css';

const HEADING_ID = 'me-heading';

/** Section `#me` (Figma: desktop 84:328, mobile 245:670). */
export function HeroSection() {
  const t = useTranslations('Me');

  return (
    <section id="me" aria-labelledby={HEADING_ID} className={styles.hero}>
      <div className={styles.portrait}>
        <PolaroidSign image={portrait} alt={t('portraitAlt')} preload animateEntrance />
      </div>

      <div className={styles.text}>
        <AboutIntro headingLevel={1} headingId={HEADING_ID} />
        {/* TODO(overlay stage): opens overlay-me (`?overlay=me`). Disabled until the overlay exists;
            add its hover state (hover.css) when it becomes clickable. */}
        <button type="button" className={`${styles.more} text-body-m`} disabled>
          {t('more')}
        </button>
      </div>
    </section>
  );
}
