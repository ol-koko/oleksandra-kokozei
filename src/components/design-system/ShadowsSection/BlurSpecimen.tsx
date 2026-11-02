'use client';

import { useRef, type CSSProperties } from 'react';
import { useSpecimenRunning, useTicker } from '@/features/design-system/useSpecimenRunning';
import styles from './BlurSpecimen.module.css';

/** How long the word stays under, then above, the blurring layer (the crossfade is part of it). */
const SWAP_MS = 2400;

/**
 * The word "blur" and a layer that blurs what is behind it (`backdrop-filter`
 * with the token). The word exists twice, one copy under the layer (blurred)
 * and one above it (sharp), and the loop crossfades between them: it never
 * jumps in stacking order. Reduced motion or off screen: it rests under the
 * layer, where the blur shows.
 */
export function BlurSpecimen({ token }: { token: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const running = useSpecimenRunning(stage);
  const above = useTicker(running, SWAP_MS) % 2 === 1;

  return (
    <div
      ref={stage}
      className={styles.stage}
      style={{ '--blur': `var(--${token})` } as CSSProperties}
      data-above={above ? '' : undefined}
      aria-hidden="true"
    >
      <span className={`${styles.word} ${styles.under} text-body-xs`}>blur</span>
      <span className={styles.layer} />
      <span className={`${styles.word} ${styles.over} text-body-xs`}>blur</span>
    </div>
  );
}
