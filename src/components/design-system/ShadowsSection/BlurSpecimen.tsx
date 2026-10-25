'use client';

import { useRef, type CSSProperties } from 'react';
import { useSpecimenRunning, useTicker } from '@/features/design-system/useSpecimenRunning';
import styles from './BlurSpecimen.module.css';

/** How long the word stays above, then under, the blurring layer. */
const SWAP_MS = 2000;

/**
 * The word "blur" and a layer that blurs what is behind it (`backdrop-filter`
 * with the token). While the specimen is on screen the word swaps between
 * above the layer (sharp) and under it (blurred). Reduced motion or off
 * screen: it rests under the layer, where the blur shows.
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
      aria-hidden="true"
    >
      <span className={`${styles.word} ${above ? styles.above : ''} text-body-xs`}>blur</span>
      <span className={styles.layer} />
    </div>
  );
}
