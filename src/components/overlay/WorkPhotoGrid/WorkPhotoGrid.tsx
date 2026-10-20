import { useTranslations } from 'next-intl';
import { LoadingImage } from '@/components/media/LoadingImage/LoadingImage';
import type { WorkPhotoGridBlock } from '@/content/types';
import styles from './WorkPhotoGrid.module.css';

type WorkPhotoGridProps = {
  photos: WorkPhotoGridBlock['photos'];
};

/**
 * Captioned screenshots, two per row on desktop (Figma 558:717) and one per
 * row on mobile, like the case photos. The photos fade up one after another
 * as they come into view (`data-reveal`). Hovering a photo scales its card
 * like a work card cover; decorative, the photos are not controls.
 */
export function WorkPhotoGrid({ photos }: WorkPhotoGridProps) {
  const t = useTranslations('WorkCases');

  return (
    <div className={styles.grid}>
      {photos.map((photo) => (
        <figure key={photo.copy} className={styles.photo} data-reveal>
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
