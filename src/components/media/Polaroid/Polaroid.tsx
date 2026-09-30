import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { ImageAsset } from '@/content/types';
import styles from './Polaroid.module.css';

type PolaroidProps = {
  image: ImageAsset;
  alt: string;
  /** Rotation in degrees (Figma geometry, stored as data). */
  rotation: number;
  /** Load the photo early (above-the-fold use). */
  preload?: boolean;
  className?: string;
};

/** White instant-photo frame around a photo (Figma 179:773 "polaroid"). */
export function Polaroid({ image, alt, rotation, preload = false, className }: PolaroidProps) {
  return (
    <div
      className={[styles.polaroid, className].filter(Boolean).join(' ')}
      style={{ '--polaroid-rotation': `${rotation}deg` } as CSSProperties}
    >
      <div className={styles.photo}>
        <Image
          className={styles.image}
          src={image.src}
          alt={alt}
          fill
          sizes="228px"
          preload={preload}
        />
      </div>
    </div>
  );
}
