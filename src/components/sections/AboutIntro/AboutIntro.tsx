import { useTranslations } from 'next-intl';
import { LocationLabel } from '@/components/ui/LocationLabel/LocationLabel';
import { bioParagraphs } from '@/content/me';
import styles from './AboutIntro.module.css';

type AboutIntroProps = {
  /** `h1` on the page, `h2` inside overlay-me. */
  headingLevel: 1 | 2;
  headingId?: string;
};

/** Greeting, location and bio (Figma 5:142). Shared by the hero and overlay-me. */
export function AboutIntro({ headingLevel, headingId }: AboutIntroProps) {
  const t = useTranslations('Me');
  const Heading = headingLevel === 1 ? 'h1' : 'h2';

  return (
    <div className={styles.intro}>
      <div className={styles.header}>
        <Heading id={headingId} className="text-title-l">
          {t('greeting')}
        </Heading>
        <LocationLabel label={t('location')} />
      </div>

      <div className={styles.bio}>
        {bioParagraphs.map((key) => (
          <p key={key} className="text-body-l">
            {t(`bio.${key}`)}
          </p>
        ))}
      </div>
    </div>
  );
}
