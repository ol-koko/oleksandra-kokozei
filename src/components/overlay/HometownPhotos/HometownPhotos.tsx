'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useId, useRef, useState, type CSSProperties } from 'react';
import { Lightbox } from '@/components/media/Lightbox/Lightbox';
import { Polaroid } from '@/components/media/Polaroid/Polaroid';
import { hometownPhotos } from '@/content/hometown';
import type { HometownPhoto } from '@/content/types';
import { isPointerClick, moveFocus } from '@/features/focus/moveFocus';
import { scrollBehavior } from '@/features/motion/scrollBehavior';
import { scrollToSection } from '@/features/overlay/sectionScrollTop';
import styles from './HometownPhotos.module.css';

/** `folding`: gliding back to the section start while the extra photos fade out. */
type Phase = 'collapsed' | 'expanded' | 'folding';

/** Photo widths inside the frame: 188 in the 220 mobile polaroid, 228 in the 260 desktop one. */
const PHOTO_SIZES = '(min-width: 1024px) 228px, 188px';

/**
 * "My hometown" photos. Desktop (84:91): four overlapping, rotated polaroids
 * in one collage. Mobile and tablet (322:560, 334:1226): a column that shows
 * the first photo and reveals the rest inline with "more"; the same button
 * then reads "close" and folds them away again. Folding glides back to the
 * start of the section while the extra photos fade out in place (opacity
 * only, they keep their space); they leave the layout once both are done and
 * they are out of view, so nothing in view jumps.
 *
 * Every photo is a button that opens it full screen in a lightbox; focus
 * returns to that photo when the lightbox closes.
 */
export function HometownPhotos() {
  const t = useTranslations('Overlay.me.sections.home');
  const [phase, setPhase] = useState<Phase>('collapsed');
  const expanded = phase !== 'collapsed';
  const listId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  /** Resolves the fade-out of the extra photos while folding. */
  const fadeEndRef = useRef<(() => void) | null>(null);
  const [shown, setShown] = useState<{ photo: HometownPhoto; fromPointer: boolean } | null>(null);
  /** The photo button that opened the lightbox. */
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const onLightboxClosed = useCallback((fromPointer: boolean) => {
    setShown(null);
    moveFocus(openerRef.current, { fromPointer, preventScroll: true });
  }, []);

  const toggle = () => {
    if (phase === 'collapsed') {
      setPhase('expanded');
      return;
    }
    if (phase !== 'expanded') return;
    const section = toggleRef.current?.closest('section');
    // Reduced motion: collapse, then jump to the section start before the next paint.
    if (scrollBehavior() !== 'smooth' || !section) {
      setPhase('collapsed');
      requestAnimationFrame(() => {
        if (section) scrollToSection(section, 'instant');
      });
      return;
    }
    // Glide back and fade the photos out at the same time; they keep their space until both
    // are done, then leave the layout out of view. Focus stays put.
    const faded = new Promise<void>((resolve) => {
      fadeEndRef.current = resolve;
    });
    setPhase('folding');
    Promise.all([scrollToSection(section, 'smooth'), faded]).then(() => setPhase('collapsed'));
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
                  extra && phase === 'expanded' && 'animate-shelf-item',
                  extra && phase === 'folding' && styles.leaving,
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
                onAnimationEnd={
                  index === hometownPhotos.length - 1 && phase === 'folding'
                    ? () => fadeEndRef.current?.()
                    : undefined
                }
              >
                <button
                  type="button"
                  className={`polaroid-group ${styles.photoButton}`}
                  aria-label={t('openPhoto', { alt: t(`photos.${photo.id}`) })}
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
                    className={styles.frame}
                  />
                </button>
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

      {shown && (
        <Lightbox
          image={shown.photo.image}
          alt={t(`photos.${shown.photo.id}`)}
          fromPointer={shown.fromPointer}
          onClosed={onLightboxClosed}
        />
      )}
    </div>
  );
}
