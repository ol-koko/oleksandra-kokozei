import type { CSSProperties } from 'react';
import { LoadingImage } from '@/components/media/LoadingImage/LoadingImage';
import { MediaSkeleton } from '@/components/media/MediaSkeleton/MediaSkeleton';
import type { ImageAsset } from '@/content/types';
import styles from './Book.module.css';

type BookProps = {
  /** The cover art; without it the cover is the neutral media placeholder (design system page). */
  cover?: ImageAsset;
  /** Back cover color. */
  backColor: string;
  /** Names the button: "Cover of <title> by <author>". */
  alt: string;
  /** Open: lifted, cover open, pages fanned out, ribbon down. */
  pressed: boolean;
  onToggle: () => void;
};

/** Text lines printed on the page block, as in the template. */
const PAGE_LINES = Array.from({ length: 10 }, (_, index) => index);

/** Loose pages behind the cover, back to front. */
const LEAVES = ['leaf3', 'leaf2', 'leaf1'] as const;

/**
 * A book (template: reference/claude-design/book-template.html). When open it
 * lifts, the cover swings open, three pages fan out one after another and a
 * ribbon slides down. A toggle button: hover and keyboard focus preview the
 * open state, a press keeps it (aria-pressed).
 */
export function Book({ cover, backColor, alt, pressed, onToggle }: BookProps) {
  return (
    <button
      type="button"
      className={styles.slot}
      style={{ '--back': backColor } as CSSProperties}
      aria-label={cover ? undefined : alt}
      aria-pressed={pressed}
      onClick={onToggle}
    >
      <span className={styles.book}>
        <span className={styles.shadow} />
        <span className={styles.body}>
          <span className={styles.ribbon} />
          <span className={styles.back} />
          <span className={styles.pages}>
            {PAGE_LINES.map((line) => (
              <span key={line} className={styles.line} />
            ))}
          </span>
          {LEAVES.map((leaf) => (
            <span key={leaf} className={`${styles.leaf} ${styles[leaf]}`} />
          ))}
          <span className={styles.cover}>
            {cover ? (
              <LoadingImage image={cover} alt={alt} sizes="150px" />
            ) : (
              <MediaSkeleton ready />
            )}
          </span>
        </span>
      </span>
    </button>
  );
}
