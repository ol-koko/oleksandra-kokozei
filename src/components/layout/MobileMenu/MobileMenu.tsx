'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { MenuIcon } from '@/components/icons/MenuIcon';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher/LanguageSwitcher';
import { SectionNav } from '@/components/navigation/SectionNav/SectionNav';
import type { SectionId } from '@/content/types';
import styles from './MobileMenu.module.css';

const DESKTOP_QUERY = '(min-width: 1024px)';
const FOCUSABLE = 'a[href], button:not([disabled])';

type MobileMenuProps = {
  activeId?: SectionId;
};

/**
 * Menu button + full-screen menu (Figma 233:666) for viewports below 1024 px.
 * A modal <dialog> makes the rest of the page inert; Tab is kept inside,
 * Esc closes it, and page scroll is locked while it is open.
 */
export function MobileMenu({ activeId }: MobileMenuProps) {
  const t = useTranslations('Header');
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogId = useId();

  const lockScroll = (locked: boolean) => {
    document.documentElement.style.overflow = locked ? 'hidden' : '';
  };

  const openMenu = () => {
    dialogRef.current?.showModal();
    closeButtonRef.current?.focus();
    lockScroll(true);
    setOpen(true);
  };

  /** Closes the menu. Focus returns to the menu button unless a link is being followed. */
  const closeMenu = useCallback((restoreFocus: boolean) => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    lockScroll(false);
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
  }, []);

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
  useEffect(() => () => lockScroll(false), []);

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.iconButton} ${styles.trigger}`}
        aria-label={t('openMenu')}
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={openMenu}
      >
        <MenuIcon />
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label={t('menu')}
        className={`${styles.dialog} ${open ? 'animate-overlay' : ''}`}
        onKeyDown={onKeyDown}
        onCancel={(event) => {
          // Esc: close through the same path so scroll and focus are restored.
          event.preventDefault();
          closeMenu(true);
        }}
      >
        <div className={styles.topBar}>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.iconButton}
            aria-label={t('closeMenu')}
            onClick={() => closeMenu(true)}
          >
            <CloseIcon />
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
