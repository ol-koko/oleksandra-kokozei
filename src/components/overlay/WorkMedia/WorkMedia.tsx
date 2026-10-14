import Image from 'next/image';
import type { ImageAsset } from '@/content/types';
import styles from './WorkMedia.module.css';

/** Detailed screenshots (wireframes, boards): above the default 75, allowed in next.config.ts. */
const WORK_MEDIA_QUALITY = 90;

type WorkMediaProps = {
  image: ImageAsset;
  alt: string;
  /** Loads at once: the cover is in view when the overlay opens. Photos further down load lazily. */
  eager?: boolean;
};

/** A rounded case study image: the cover and every photo (894 × 435 on desktop, 358 × 186 on mobile). */
export function WorkMedia({ image, alt, eager = false }: WorkMediaProps) {
  return (
    <div className={styles.frame}>
      <Image
        className={styles.image}
        src={image.src}
        alt={alt}
        fill
        loading={eager ? 'eager' : 'lazy'}
        quality={WORK_MEDIA_QUALITY}
        sizes="(min-width: 1200px) 894px, (min-width: 768px) 75vw, calc(100vw - 32px)"
      />
    </div>
  );
}
