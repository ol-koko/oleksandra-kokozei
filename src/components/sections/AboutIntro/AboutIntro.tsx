import { useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';
import { LocationLabel } from '@/components/ui/LocationLabel/LocationLabel';
import { bioParagraphs } from '@/content/me';
import styles from './AboutIntro.module.css';

type AboutIntroProps = {
  /** `h1` on the page, `h2` inside overlay-me. */
  headingLevel: 1 | 2;
  headingId?: string;
  /**
   * Page-load entrance: greeting, location and paragraphs rise in one after
   * another (`.animate-card` with `--i` from 1, after the polaroid at 0).
   */
  animateEntrance?: boolean;
};

/** Index of the first item after the intro, for content that continues the stagger. */
export const ABOUT_INTRO_ENTRANCE_END = 3 + bioParagraphs.length;

/** Greeting, location and bio (Figma 5:142). Shared by the hero and overlay-me. */
export function AboutIntro({ headingLevel, headingId, animateEntrance = false }: AboutIntroProps) {
  const t = useTranslations('Me');
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  const entrance = (index: number) =>
    animateEntrance
      ? { className: 'animate-card', style: { '--i': index } as CSSProperties }
      : { className: undefined, style: undefined };
  const greeting = entrance(1);
  const location = entrance(2);

  return (
    <div className={styles.intro}>
      <div className={styles.header}>
        <Heading
          id={headingId}
          className={['text-title-l', greeting.className].filter(Boolean).join(' ')}
          style={greeting.style}
        >
          {t('greeting')}
        </Heading>
        <LocationLabel label={t('location')} {...location} />
      </div>

      <div className={styles.bio}>
        {bioParagraphs.map((key, index) => {
          const paragraph = entrance(3 + index);
          return (
            <p
              key={key}
              className={['text-body-l', paragraph.className].filter(Boolean).join(' ')}
              style={paragraph.style}
            >
              {t(`bio.${key}`)}
            </p>
          );
        })}
      </div>
    </div>
  );
}
