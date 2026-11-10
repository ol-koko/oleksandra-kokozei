'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { Lightbox } from '@/components/media/Lightbox/Lightbox';
import { Polaroid } from '@/components/media/Polaroid/Polaroid';
import type { WorkPolaroid, WorkPolaroidsBlock } from '@/content/types';
import { isPointerClick, moveFocus } from '@/features/focus/moveFocus';
import styles from './WorkPolaroids.module.css';

/** Photo widths inside the frame: 188 in the 220 mobile polaroid, 228 in the 260 desktop one. */
const PHOTO_SIZES = '(min-width: 1024px) 228px, 188px';

/**
 * Rotated Polaroids with one caption (Figma 909:4183), built like the
 * hometown photos: a collage on desktop, a column on mobile with every photo
 * showing. Each photo fades up as it comes into view and opens full screen in
 * a lightbox; focus returns to it when the lightbox closes.
 */
export function WorkPolaroids({ block }: { block: WorkPolaroidsBlock }) {
  const t = useTranslations('WorkCases');
  const tWork = useTranslations('Overlay.work');
  const [shown, setShown] = useState<{ photo: WorkPolaroid; fromPointer: boolean } | null>(null);
  /** The photo button that opened the lightbox. */
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const onLightboxClosed = useCallback((fromPointer: boolean) => {
    setShown(null);
    moveFocus(openerRef.current, { fromPointer, preventScroll: true });
  }, []);

  return (
    <figure className={styles.root}>
      <div className={styles.stage}>
        <ul className={styles.photos}>
          {block.photos.map((photo) => (
            <li
              key={photo.image.src}
              className={styles.item}
              style={
                {
                  '--desktop-x': `${photo.desktop.x}px`,
                  '--desktop-y': `${photo.desktop.y}px`,
                  '--desktop-z': photo.desktop.z,
                  '--mobile-x': `${photo.mobile.x}px`,
                  '--mobile-y': `${photo.mobile.y}px`,
                } as CSSProperties
              }
              data-reveal
            >
              <button
                type="button"
                className={`polaroid-group ${styles.photoButton}`}
                aria-label={tWork('openPhoto', { alt: t(photo.alt) })}
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setShown({ photo, fromPointer: isPointerClick(event) });
                }}
              >
                {/* The button names the photo; the image itself stays unnamed. */}
                <Polaroid
                  image={photo.image}
                  alt=""
                  rotation={photo.rotation}
                  sizes={PHOTO_SIZES}
                  unoptimized
                  className={styles.frame}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <figcaption className={`${styles.caption} text-body-2xs`} data-reveal>
        {t(block.caption)}
      </figcaption>

      {shown && (
        <Lightbox
          image={shown.photo.image}
          alt={t(shown.photo.alt)}
          fromPointer={shown.fromPointer}
          onClosed={onLightboxClosed}
        />
      )}
    </figure>
  );
}
