import { useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';
import { PolaroidSign } from '@/components/media/PolaroidSign/PolaroidSign';
import { OverlayTrigger } from '@/components/overlay/OverlayTrigger/OverlayTrigger';
import { ABOUT_INTRO_ENTRANCE_END, AboutIntro } from '@/components/sections/AboutIntro/AboutIntro';
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
        <AboutIntro headingLevel={1} headingId={HEADING_ID} animateEntrance />
        <OverlayTrigger
          route={{ kind: 'me' }}
          className={`hover-link ${styles.more} text-body-m animate-card`}
          style={{ '--i': ABOUT_INTRO_ENTRANCE_END } as CSSProperties}
        >
          {t('more')}
        </OverlayTrigger>
      </div>
    </section>
  );
}
