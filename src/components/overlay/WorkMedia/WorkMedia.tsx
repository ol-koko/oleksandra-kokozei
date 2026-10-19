import Image from 'next/image';
import { LoopVideo } from '@/components/media/LoopVideo/LoopVideo';
import type { ImageAsset, VideoAsset } from '@/content/types';
import styles from './WorkMedia.module.css';

/** Detailed screenshots (wireframes, boards): above the default 75, allowed in next.config.ts. */
const WORK_MEDIA_QUALITY = 90;

type WorkMediaProps = {
  media: ImageAsset | VideoAsset;
  alt: string;
  /** Images only: loads at once, as the cover is in view when the overlay opens. Photos further down load lazily. */
  eager?: boolean;
};

/**
 * A rounded case study image or looping video: the cover and every photo
 * (894 × 435 on desktop, 358 × 186 on mobile).
 */
export function WorkMedia({ media, alt, eager = false }: WorkMediaProps) {
  if ('webm' in media) {
    return (
      <div className={styles.frame}>
        <LoopVideo video={media} label={alt} />
      </div>
    );
  }

  return (
    <div className={styles.frame}>
      <Image
        className={styles.image}
        src={media.src}
        alt={alt}
        fill
        loading={eager ? 'eager' : 'lazy'}
        quality={WORK_MEDIA_QUALITY}
        sizes="(min-width: 1200px) 894px, (min-width: 768px) 75vw, calc(100vw - 32px)"
      />
    </div>
  );
}
