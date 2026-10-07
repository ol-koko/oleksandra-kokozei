'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { MenuToggleIcon } from '@/components/icons/MenuToggleIcon';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher/LanguageSwitcher';
import { SectionNav } from '@/components/navigation/SectionNav/SectionNav';
import type { SectionId } from '@/content/types';
import { isPointerClick, moveFocus } from '@/features/focus/moveFocus';
import { trapTab } from '@/features/focus/trapTab';
import { lockScroll, unlockScroll } from '@/features/scroll-lock/scrollLock';
import styles from './MobileMenu.module.css';

const DESKTOP_QUERY = '(min-width: 1024px)';

type Phase = 'closed' | 'open' | 'closing';

type MobileMenuProps = {
  activeId?: SectionId;
};

/**
 * Menu button + full-screen menu (Figma 233:666) for viewports below 1024 px.
 * A modal <dialog> makes the rest of the page inert; Tab is kept inside,
 * Esc closes it, and page scroll is locked while it is open.
 *
 * Motion: a white panel slides down behind the menu content, then the links
 * and the language bar fade in (styles in the module). The close button never
 * moves: it sits over the menu button, so the burger ↔ cross morph stays
 * visible both ways. Closing plays a quicker reverse; the dialog closes and
 * focus returns only when it has finished.
 */
export function MobileMenu({ activeId }: MobileMenuProps) {
  const t = useTranslations('Header');
  const [phase, setPhase] = useState<Phase>('closed');
  const open = phase === 'open';
  /** Set while closing: where focus goes once the dialog has closed. */
  const pendingClose = useRef<{ restoreFocus: boolean; fromPointer: boolean } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogId = useId();
  /** Whether this menu holds a page scroll lock. */
  const lockedRef = useRef(false);

  const openMenu = (fromPointer: boolean) => {
    dialogRef.current?.showModal();
    moveFocus(closeButtonRef.current, { fromPointer });
    lockScroll();
    lockedRef.current = true;
    setPhase('open');
  };

  /**
   * Starts closing the menu: scroll unlocks and both icons morph back to the
   * burger at once. Focus returns to the menu button unless a link is being
   * followed; it shows a ring only when the menu was closed from the keyboard.
   */
  const closeMenu = useCallback((restoreFocus: boolean, fromPointer = false) => {
    if (!dialogRef.current?.open || pendingClose.current) return;
    pendingClose.current = { restoreFocus, fromPointer };
    unlockScroll();
    lockedRef.current = false;
    setPhase('closing');
  }, []);

  // Closes the dialog once the closing animations (panel, items, icon) have finished.
  useEffect(() => {
    if (phase !== 'closing') return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      const pending = pendingClose.current;
      pendingClose.current = null;
      dialog.close();
      setPhase('closed');
      if (pending?.restoreFocus) {
        moveFocus(triggerRef.current, { fromPointer: pending.fromPointer, preventScroll: true });
      }
    };

    const animations = dialog.getAnimations({ subtree: true });
    Promise.all(animations.map((animation) => animation.finished)).then(finish, finish);

    return () => {
      cancelled = true;
    };
  }, [phase]);

  // Close when the viewport grows into the desktop layout.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [closeMenu]);

  // Never leave the page locked if the component unmounts while open.
  useEffect(
    () => () => {
      if (lockedRef.current) unlockScroll();
    },
    [],
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.iconButton} ${styles.trigger}`}
        aria-label={t('openMenu')}
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={(event) => openMenu(isPointerClick(event))}
      >
        {/* Under the open dialog this turns into the cross, so closing morphs it back to the burger. */}
        <MenuToggleIcon open={open} />
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label={t('menu')}
        className={`${styles.dialog} ${phase === 'closing' ? styles.closing : ''}`}
        onKeyDown={(event) => trapTab(event, dialogRef.current)}
        onCancel={(event) => {
          // Esc: close through the same path so scroll and focus are restored.
          event.preventDefault();
          closeMenu(true);
        }}
      >
        <div className={styles.panel} aria-hidden="true" />

        <div className={styles.topBar}>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.iconButton}
            aria-label={t('closeMenu')}
            onClick={(event) => closeMenu(true, isPointerClick(event))}
          >
            {/*
             * Sits where the menu button is, so opening reads as one burger → cross morph,
             * and turns back into the burger together with it while the menu closes.
             */}
            <MenuToggleIcon open={phase !== 'closing'} morphIn />
          </button>
        </div>

        <SectionNav
          label={t('mainNav')}
          activeId={activeId}
          orientation="column"
          size="l"
          className={styles.nav}
          onNavigate={() => closeMenu(false)}
        />

        <LanguageSwitcher
          label={t('languageNav')}
          activeId={activeId}
          className={styles.languages}
          onNavigate={() => closeMenu(false)}
        />
      </dialog>
    </>
  );
}
