'use client';

import { useTranslations } from 'next-intl';
import { useId, useRef, useState, type CSSProperties } from 'react';
import { Polaroid } from '@/components/media/Polaroid/Polaroid';
import { hometownPhotos } from '@/content/hometown';
import { scrollBehavior } from '@/features/motion/scrollBehavior';
import styles from './HometownPhotos.module.css';

/** Photo widths inside the frame: 188 in the 220 mobile polaroid, 228 in the 260 desktop one. */
const PHOTO_SIZES = '(min-width: 1024px) 228px, 188px';

/**
 * "My hometown" photos. Desktop (84:91): four overlapping, rotated polaroids
 * in one collage. Mobile and tablet (322:560, 334:1226): a column that shows
 * the first photo and reveals the rest inline with "more"; the same button
 * then reads "close" and folds them away again.
 */
export function HometownPhotos() {
  const t = useTranslations('Overlay.me.sections.home');
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    setExpanded(!expanded);
    // Folding away moves the button up by three photos: bring it back into view.
    if (expanded) {
      requestAnimationFrame(() =>
        toggleRef.current?.scrollIntoView({ block: 'nearest', behavior: scrollBehavior() }),
      );
    }
  };

  return (
    <div className={styles.root} data-expanded={expanded}>
      <div className={styles.stage}>
        <ul id={listId} className={styles.photos}>
          {hometownPhotos.map((photo, index) => {
            const extra = index > 0;
            return (
              <li
                key={photo.id}
                className={[
                  styles.item,
                  extra && styles.extra,
                  extra && expanded && 'animate-shelf-item',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={
                  {
                    '--i': index - 1,
                    '--desktop-x': `${photo.desktop.x}px`,
                    '--desktop-y': `${photo.desktop.y}px`,
                    '--desktop-z': photo.desktop.z,
                    '--mobile-x': `${photo.mobile.x}px`,
                    '--mobile-y': `${photo.mobile.y}px`,
                  } as CSSProperties
                }
              >
                <Polaroid
                  image={photo.image}
                  alt={t(`photos.${photo.id}`)}
                  rotation={photo.rotation}
                  sizes={PHOTO_SIZES}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <button
        ref={toggleRef}
        type="button"
        className={`hover-link ${styles.toggle} text-body-m`}
        aria-expanded={expanded}
        aria-controls={listId}
        onClick={toggle}
      >
        {expanded ? t('close') : t('more')}
        <span className="visually-hidden"> {t('photosLabel')}</span>
      </button>
    </div>
  );
}
