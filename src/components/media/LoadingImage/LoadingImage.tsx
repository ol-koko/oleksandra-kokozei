'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MediaSkeleton } from '@/components/media/MediaSkeleton/MediaSkeleton';
import type { ImageAsset } from '@/content/types';
import styles from './LoadingImage.module.css';

type LoadingImageProps = {
  image: ImageAsset;
  alt: string;
  sizes: string;
  quality?: number;
  /** Loads at once instead of when the image nears the viewport. */
  eager?: boolean;
};

/**
 * next/image filling its positioned parent, with a skeleton until the image
 * has loaded, then a fade-in. next/image reports `onLoad` for images already
 * loaded before hydration too, so cached images do not stay hidden.
 */
export function LoadingImage({ image, alt, sizes, quality, eager = false }: LoadingImageProps) {
  const [ready, setReady] = useState(false);

  return (
    <>
      <MediaSkeleton ready={ready} />
      <Image
        className={styles.image}
        data-ready={ready || undefined}
        src={image.src}
        alt={alt}
        fill
        loading={eager ? 'eager' : 'lazy'}
        quality={quality}
        sizes={sizes}
        onLoad={() => setReady(true)}
      />
    </>
  );
}
