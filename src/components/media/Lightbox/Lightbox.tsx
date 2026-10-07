'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { MenuToggleIcon } from '@/components/icons/MenuToggleIcon';
import { Polaroid } from '@/components/media/Polaroid/Polaroid';
import type { ImageAsset } from '@/content/types';
import { isPointerClick, moveFocus } from '@/features/focus/moveFocus';
import { trapTab } from '@/features/focus/trapTab';
import { lockScroll, unlockScroll } from '@/features/scroll-lock/scrollLock';
import styles from './Lightbox.module.css';

/** Photo width inside the frame: ~326 on a phone, about 60 % of the viewport height above. */
const PHOTO_SIZES = '(min-width: 768px) 60vh, 326px';

type LightboxProps = {
  image: ImageAsset;
  alt: string;
  /** The photo was opened with a click or tap, not a key press. */
  fromPointer: boolean;
  /** Called once the closing motion has finished and the dialog is closed. */
  onClosed: (fromPointer: boolean) => void;
};

/**
 * One photo full screen (Figma 322:950): an upright, elevated polaroid over
 * a light, blurred backdrop. A modal <dialog> on top of whatever is open
 * (the overlay), so Esc, a click outside the photo and the close button only
 * close this layer. Mounted while open; the parent unmounts it in `onClosed`
 * and returns focus to the photo that opened it.
 */
export function Lightbox({ image, alt, fromPointer, onClosed }: LightboxProps) {
  const t = useTranslations('Lightbox');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState<{ fromPointer: boolean } | null>(null);
  /** Whether this lightbox holds a page scroll lock. */
  const lockedRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    lockScroll();
    lockedRef.current = true;
    moveFocus(closeButtonRef.current, { fromPointer, preventScroll: true });

    return () => {
      if (dialog.open) dialog.close();
      if (lockedRef.current) {
        lockedRef.current = false;
        unlockScroll();
      }
    };
  }, [fromPointer]);

  // Closing: wait for the closing motion, then close the dialog and let the parent unmount it.
  useEffect(() => {
    if (!closing) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      dialog.close();
      if (lockedRef.current) {
        lockedRef.current = false;
        unlockScroll();
      }
      onClosed(closing.fromPointer);
    };

    const animations = dialog.getAnimations({ subtree: true });
    Promise.all(animations.map((animation) => animation.finished)).then(finish, finish);

    return () => {
      cancelled = true;
    };
  }, [closing, onClosed]);

  const requestClose = (fromPointer: boolean) => {
    if (!closing) setClosing({ fromPointer });
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label={alt}
      className={`${styles.dialog} ${closing ? styles.closing : ''}`}
      onKeyDown={(event) => trapTab(event, dialogRef.current)}
      onCancel={(event) => {
        // Esc closes this layer only; the overlay underneath must not see it.
        event.preventDefault();
        event.stopPropagation();
        requestClose(false);
      }}
      onClose={(event) => event.stopPropagation()}
      onClick={(event) => {
        // A click or tap anywhere but the photo closes, like a click on the backdrop.
        if (event.target instanceof Element && event.target.closest(`.${styles.frame}`)) return;
        requestClose(isPointerClick(event));
      }}
    >
      <div className={`${styles.backdrop} animate-overlay`} aria-hidden="true" />

      <div className={styles.topBar}>
        {/* Closes through the dialog's click handler, like any click outside the photo. */}
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          aria-label={t('close')}
        >
          <MenuToggleIcon open />
        </button>
      </div>

      <div className={`${styles.frame} animate-modal`}>
        <Polaroid image={image} alt={alt} rotation={0} sizes={PHOTO_SIZES} elevated />
      </div>
    </dialog>
  );
}
