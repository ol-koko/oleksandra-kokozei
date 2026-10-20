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
  /**
   * Serves the file as it is, without next/image re-encoding: for WebPs
   * already encoded from the originals, where a second lossy pass blurs text.
   */
  unoptimized?: boolean;
  /** Loads at once instead of when the image nears the viewport. */
  eager?: boolean;
  /**
   * Preloads the image (above the fold, the LCP photo). It is not hidden
   * before it loads, so it paints as soon as it can, even before hydration;
   * the skeleton shows underneath until then.
   */
  preload?: boolean;
};

/**
 * next/image filling its positioned parent, with a skeleton until the image
 * has loaded, then a fade-in. next/image reports `onLoad` for images already
 * loaded before hydration too, so cached images do not stay hidden.
 */
export function LoadingImage({
  image,
  alt,
  sizes,
  unoptimized = false,
  eager = false,
  preload = false,
}: LoadingImageProps) {
  const [ready, setReady] = useState(false);

  return (
    <>
      <MediaSkeleton ready={ready} />
      <Image
        className={styles.image}
        data-ready={ready || preload || undefined}
        src={image.src}
        alt={alt}
        fill
        loading={eager || preload ? 'eager' : 'lazy'}
        preload={preload}
        unoptimized={unoptimized}
        sizes={sizes}
        onLoad={() => setReady(true)}
      />
    </>
  );
}
