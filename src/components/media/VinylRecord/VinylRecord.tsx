import Image from 'next/image';
import type { ImageAsset } from '@/content/types';
import styles from './VinylRecord.module.css';

type VinylRecordProps = {
  cover: ImageAsset;
  /** Names the button: "Cover of <title> by <artist>". */
  alt: string;
  /** Open: the record is out of its sleeve and spinning. */
  pressed: boolean;
  onToggle: () => void;
};

/**
 * Vinyl record in its sleeve (template: reference/claude-design/vinyl-record-template.html).
 * The record peeks out of the sleeve; when open it slides out and spins.
 * A toggle button: hover and keyboard focus preview the open state, a press
 * keeps it (aria-pressed).
 */
export function VinylRecord({ cover, alt, pressed, onToggle }: VinylRecordProps) {
  return (
    <button type="button" className={styles.record} aria-pressed={pressed} onClick={onToggle}>
      <span className={styles.media}>
        <span className={styles.disc}>
          <span className={styles.spin}>
            {/* The label repeats the cover; the sleeve image names the button. */}
            <Image className={styles.label} src={cover.src} alt="" width={64} height={64} />
          </span>
        </span>
        <span className={styles.sleeve}>
          <Image
            src={cover.src}
            alt={alt}
            width={cover.width}
            height={cover.height}
            sizes="186px"
          />
        </span>
      </span>
    </button>
  );
}
