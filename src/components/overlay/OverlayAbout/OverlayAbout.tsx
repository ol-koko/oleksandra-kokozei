import { useTranslations } from 'next-intl';
import { PolaroidSign } from '@/components/media/PolaroidSign/PolaroidSign';
import { AboutIntro } from '@/components/sections/AboutIntro/AboutIntro';
import { portrait } from '@/content/me';
import styles from './OverlayAbout.module.css';

type OverlayAboutProps = {
  /** Id of the greeting heading, which names the section. */
  headingId: string;
};

/**
 * overlay-me "About" (desktop 84:319, mobile 275:965): the hero's polaroid and
 * intro again, without the entrance motion and the "more" button.
 */
export function OverlayAbout({ headingId }: OverlayAboutProps) {
  const t = useTranslations('Me');

  return (
    <div className={styles.about}>
      <div className={styles.portrait}>
        <PolaroidSign image={portrait} alt={t('portraitAlt')} />
      </div>
      <AboutIntro headingLevel={2} headingId={headingId} />
    </div>
  );
}
