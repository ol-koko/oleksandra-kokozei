import type { CSSProperties } from 'react';
import { LoadingImage } from '@/components/media/LoadingImage/LoadingImage';
import type { ImageAsset } from '@/content/types';
import styles from './Polaroid.module.css';

type PolaroidProps = {
  image: ImageAsset;
  alt: string;
  /** Rotation in degrees (Figma geometry, stored as data). */
  rotation: number;
  /** Load the photo early (above-the-fold use). */
  preload?: boolean;
  /** Rendered photo width for next/image; defaults to the 228 px photo of the 260 px frame. */
  sizes?: string;
  /** Stronger shadow for a photo shown on its own (lightbox). */
  elevated?: boolean;
  className?: string;
};

/**
 * White instant-photo frame around a photo (Figma 179:773 "polaroid"), with a
 * loading skeleton in the photo area.
 */
export function Polaroid({
  image,
  alt,
  rotation,
  preload = false,
  sizes = '228px',
  elevated = false,
  className,
}: PolaroidProps) {
  return (
    <div
      className={['polaroid', styles.polaroid, elevated && styles.elevated, className]
        .filter(Boolean)
        .join(' ')}
      style={{ '--polaroid-rotation': `${rotation}deg` } as CSSProperties}
    >
      <div className={styles.photo}>
        <LoadingImage image={image} alt={alt} sizes={sizes} preload={preload} />
      </div>
    </div>
  );
}
