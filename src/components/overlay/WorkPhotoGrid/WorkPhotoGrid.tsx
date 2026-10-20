'use client';

import { useTranslations } from 'next-intl';
import { useRef, type CSSProperties } from 'react';
import { LoadingImage } from '@/components/media/LoadingImage/LoadingImage';
import type { WorkPhotoGridBlock } from '@/content/types';
import { useFirstView } from '@/features/motion/useFirstView';
import styles from './WorkPhotoGrid.module.css';

type WorkPhotoGridProps = {
  photos: WorkPhotoGridBlock['photos'];
};

/**
 * Captioned screenshots, two per row on desktop (Figma 558:717) and one per
 * row on mobile, like the case photos. The photos rise in one after another
 * once the grid first comes into view.
 */
export function WorkPhotoGrid({ photos }: WorkPhotoGridProps) {
  const t = useTranslations('WorkCases');
  const gridRef = useRef<HTMLDivElement>(null);
  const seen = useFirstView(gridRef);

  return (
    <div ref={gridRef} className={styles.grid}>
      {photos.map((photo, index) => (
        <figure
          key={photo.copy}
          className={seen ? `${styles.photo} animate-shelf-item` : styles.photo}
          style={{ '--i': index } as CSSProperties}
        >
          <div className={styles.frame}>
            <LoadingImage
              image={photo.image}
              alt={t(`${photo.copy}.alt`)}
              unoptimized
              sizes="(min-width: 1200px) 436px, (min-width: 768px) 37vw, calc(100vw - 32px)"
            />
          </div>
          <figcaption className={`${styles.caption} text-body-2xs`}>
            {t(`${photo.copy}.caption`)}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
