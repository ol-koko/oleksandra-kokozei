import Image from 'next/image';
import type { ImageAsset } from '@/content/types';
import styles from './VinylRecord.module.css';

type VinylRecordProps = {
  cover: ImageAsset;
  /** The track on Spotify, opened in a new tab. */
  href: string;
  /** Names the link: "Listen to <title> by <artist> on Spotify (opens in a new tab)". */
  label: string;
  /** Open: the record is out of its sleeve and spinning (touch autoplay). */
  open: boolean;
};

/**
 * Vinyl record in its sleeve (template: reference/claude-design/vinyl-record-template.html).
 * The record peeks out of the sleeve; when open it slides out and spins.
 * A link to the track: hover and keyboard focus play the record, a click or
 * tap opens Spotify in a new tab.
 */
export function VinylRecord({ cover, href, label, open }: VinylRecordProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.record}
      aria-label={label}
      data-open={open || undefined}
    >
      <span className={styles.media}>
        <span className={styles.disc}>
          <span className={styles.spin}>
            <Image className={styles.label} src={cover.src} alt="" width={64} height={64} />
          </span>
        </span>
        <span className={styles.sleeve}>
          {/* The link's aria-label names the song; the cover itself is decorative. */}
          <Image src={cover.src} alt="" width={cover.width} height={cover.height} sizes="186px" />
        </span>
      </span>
    </a>
  );
}
