import Image from 'next/image';
import type { CSSProperties } from 'react';
import { LoadingImage } from '@/components/media/LoadingImage/LoadingImage';
import { LoopVideo } from '@/components/media/LoopVideo/LoopVideo';
import { WandScene } from '@/components/media/WandScene/WandScene';
import type { ImageAsset, WorkMediaAsset } from '@/content/types';
import styles from './WorkMedia.module.css';

const COVER_SIZES = '(min-width: 1200px) 894px, (min-width: 768px) 75vw, calc(100vw - 32px)';

type WorkMediaProps = {
  media: WorkMediaAsset;
  /** Drawn centered above the media (the CES cover). Decorative: `alt` names it. */
  logo?: ImageAsset;
  alt: string;
  /** Images only: loads at once, as the cover is in view when the overlay opens. Photos further down load lazily. */
  eager?: boolean;
  /** Videos only: the frame takes the video's own ratio, for recordings the standard frame would crop. */
  ownRatio?: boolean;
};

/**
 * A rounded case study image or looping video: the cover and every photo
 * (894 × 435 on desktop, 358 × 186 on mobile).
 */
export function WorkMedia({ media, logo, alt, eager = false, ownRatio = false }: WorkMediaProps) {
  const logoImage = logo && (
    <Image
      className={styles.logo}
      src={logo.src}
      alt=""
      aria-hidden="true"
      width={logo.width}
      height={logo.height}
    />
  );

  if ('scene' in media) {
    return (
      <div className={styles.frame} data-reveal role="img" aria-label={alt}>
        <WandScene still={media.still} sizes={COVER_SIZES} eager={eager} />
      </div>
    );
  }

  if ('webm' in media) {
    return (
      <div
        className={ownRatio ? `${styles.frame} ${styles.ownRatio}` : styles.frame}
        style={
          ownRatio
            ? ({ '--media-ratio': `${media.width} / ${media.height}` } as CSSProperties)
            : undefined
        }
        data-reveal
      >
        <LoopVideo video={media} label={alt} />
        {logoImage}
      </div>
    );
  }

  return (
    <div className={styles.frame} data-reveal>
      <LoadingImage image={media} alt={alt} eager={eager} unoptimized sizes={COVER_SIZES} />
      {logoImage}
    </div>
  );
}
