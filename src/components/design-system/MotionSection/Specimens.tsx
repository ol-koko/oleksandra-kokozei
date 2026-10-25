'use client';

import { useEffect, useRef, useState } from 'react';
import { PreviewCard } from '@/components/design-system/PreviewCard/PreviewCard';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher/LanguageSwitcher';
import { MediaSkeleton } from '@/components/media/MediaSkeleton/MediaSkeleton';
import type { HoverSpecimenId } from '@/content/designSystem';
import type { Locale } from '@/features/i18n/routing';
import {
  useAnimationRounds,
  useSpecimenRunning,
  useTicker,
} from '@/features/design-system/useSpecimenRunning';
import styles from './Specimens.module.css';

type AnimationSpecimenProps = {
  id: string;
  caption: string;
  className: string;
};

/**
 * One animation of animations.css on the square from Figma (752:2707): the real
 * utility class, replayed while the card is on screen. The scroll-driven
 * `.reveal` cannot loop on its own, so its keyframes play on a timer here.
 */
export function AnimationSpecimen({ id, caption, className }: AnimationSpecimenProps) {
  const stage = useRef<HTMLDivElement>(null);
  const running = useSpecimenRunning(stage);
  const round = useAnimationRounds(stage, running);
  const isShimmer = className === 'animate-shimmer';
  const isReveal = className === 'reveal';

  return (
    <PreviewCard title={id} caption={caption} code={`.${className}`}>
      <div ref={stage} className={styles.stage} data-paused={running ? undefined : ''}>
        <span
          key={round}
          className={[styles.box, isReveal ? styles.reveal : isShimmer ? '' : className]
            .filter(Boolean)
            .join(' ')}
        >
          {isShimmer && <MediaSkeleton ready={false} />}
        </span>
      </div>
    </PreviewCard>
  );
}

/** How long a forced hover state is held, then released. */
const HOVER_MS = 1400;

type HoverSpecimenProps = {
  id: HoverSpecimenId;
  caption: string;
  className: string;
};

/**
 * One hover rule of hover.css: the real classes, with the hover state forced on
 * a timer while the card is on screen (`data-forced` mirrors the `:hover` rule).
 * The real pointer and keyboard focus still work. The language slide clicks the
 * other pill of the real switcher, so the indicator really slides.
 */
export function HoverSpecimen({ id, caption, className }: HoverSpecimenProps) {
  const stage = useRef<HTMLDivElement>(null);
  const running = useSpecimenRunning(stage);
  const forced = useTicker(running, HOVER_MS) % 2 === 1;
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    if (id !== 'langSlide' || !running) return;
    stage.current?.querySelector<HTMLAnchorElement>('a:not([aria-current="true"])')?.click();
  }, [id, running, forced]);

  const forcedProps = { 'data-forced': forced && running ? '' : undefined };

  return (
    <PreviewCard title={id} caption={caption} code={`.${className}`}>
      <div ref={stage} className={styles.stage}>
        {id === 'hoverColor' && (
          <button
            type="button"
            className={`nav-link text-body-m ${styles.link}`}
            aria-label="Hover color specimen"
            {...forcedProps}
          >
            Link
          </button>
        )}
        {id === 'hoverScale' && (
          <button
            type="button"
            className={`social-tile ${styles.tile}`}
            aria-label="Hover scale specimen"
            {...forcedProps}
          />
        )}
        {id === 'hoverMedia' && (
          <button
            type="button"
            className={`experience-icon ${styles.clip}`}
            aria-label="Hover media specimen"
            {...forcedProps}
          >
            <span className={styles.clipped} />
          </button>
        )}
        {id === 'langSlide' && (
          <LanguageSwitcher
            label="Language pill indicator"
            preview={{ locale, onChange: setLocale }}
          />
        )}
      </div>
    </PreviewCard>
  );
}

