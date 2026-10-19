'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { ExpandIcon } from '@/components/icons/ExpandIcon';
import { MediaSkeleton } from '@/components/media/MediaSkeleton/MediaSkeleton';
import { projectSites } from '@/content/links';
import type { WorkSlug } from '@/content/types';
import { getWorkCase } from '@/content/workCases';
import { moveFocus } from '@/features/focus/moveFocus';
import { trapTab } from '@/features/focus/trapTab';
import { appOpenedFromPointer, closeApp } from '@/features/overlay/overlayRoute';
import styles from './AppOverlay.module.css';

/**
 * Only what the app needs: scripts, and its own origin, which keeps the
 * microphone permission (an opaque origin cannot hold one). The app is on
 * another origin, so it still cannot reach this page.
 */
const SANDBOX = 'allow-scripts allow-same-origin';

/** The app's own screen height in CSS px (it lays out a 390 × 844 phone screen). */
const APP_HEIGHT = 844;

const subscribeNever = () => () => {};

type AppOverlayProps = {
  slug: WorkSlug;
  /** False once the URL no longer opens the app: the closing motion plays, then `onClosed`. */
  open: boolean;
  onClosed: () => void;
};

/**
 * A work's live app in a second overlay above its case, desktop only. Same
 * size and motion as the work overlays: the app in a phone-shaped iframe on
 * the cover gradient, a skeleton until it has loaded,
 * and a full-screen button. The iframe mounts with the overlay, so the app
 * loads only once it is opened.
 *
 * Esc, a click on the backdrop and browser Back close it through the URL
 * (`closeApp`), back to the case. Key presses inside the iframe never reach
 * this page, so the full-screen button follows the iframe: Tab leaves the app
 * for the button, where Esc works again.
 */
export function AppOverlay({ slug, open, onClosed }: AppOverlayProps) {
  const t = useTranslations('Overlay');
  const tCases = useTranslations('WorkCases');
  const tWorks = useTranslations('Works');
  const hintId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pressedOnBackdrop = useRef(false);
  /** Set when this page asked to close; `fromPointer` decides the focus ring on the trigger. */
  const closeRequest = useRef<{ fromPointer: boolean } | null>(null);
  const [ready, setReady] = useState(false);
  const canFullScreen = useSyncExternalStore(
    subscribeNever,
    () => document.fullscreenEnabled,
    () => false,
  );

  const workCase = getWorkCase(slug);
  const site = projectSites.find((item) => item.id === workCase?.liveSite);
  const title = tWorks(`items.${slug}.title`);
  const appTitle = workCase?.liveApp ? tCases(workCase.liveApp.title) : title;

  // Open on mount, above the case overlay. Focus goes to the panel, so Esc works at once.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    moveFocus(panelRef.current, { fromPointer: appOpenedFromPointer(), preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  // The iframe keeps the app's native 390 × 844 and is scaled to the screen height.
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;
    const observer = new ResizeObserver(() => {
      screen.style.setProperty('--app-scale', String(screen.clientHeight / APP_HEIGHT));
    });
    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

  // Closing: wait for the closing motion, then close the dialog and return focus to the link.
  useEffect(() => {
    if (open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      const request = closeRequest.current;
      closeRequest.current = null;
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
      dialog.close();
      moveFocus(document.querySelector<HTMLElement>(`[data-app-trigger="${slug}"]`), {
        fromPointer: request?.fromPointer ?? true,
        preventScroll: true,
      });
      onClosed();
    };

    const animations = dialog
      .getAnimations({ subtree: true })
      .filter((animation) => animation.effect?.getTiming().iterations !== Infinity);
    Promise.all(animations.map((animation) => animation.finished)).then(finish, finish);

    return () => {
      cancelled = true;
    };
  }, [open, onClosed, slug]);

  if (!site) return null;

  const requestClose = (fromPointer: boolean) => {
    if (!open || closeRequest.current) return;
    closeRequest.current = { fromPointer };
    closeApp({ kind: 'work', slug });
  };

  const enterFullScreen = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    // Focus follows, so the keyboard reaches the app at once.
    iframe.requestFullscreen().then(
      () => iframe.focus(),
      () => {},
    );
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label={appTitle}
      aria-describedby={hintId}
      className={`${styles.dialog} ${open ? '' : styles.closing}`}
      onKeyDown={(event) => trapTab(event, dialogRef.current)}
      onPointerDown={(event) => {
        pressedOnBackdrop.current = event.isPrimary && event.target === backdropRef.current;
      }}
      onClick={(event) => {
        // Only a press that starts and ends on the backdrop closes.
        const fromBackdrop = pressedOnBackdrop.current;
        pressedOnBackdrop.current = false;
        if (event.target === backdropRef.current && fromBackdrop) requestClose(true);
      }}
      onCancel={(event) => {
        // Esc: close through the URL, back to the case.
        event.preventDefault();
        requestClose(false);
      }}
      onClose={() => {
        // The browser closed the dialog on its own (repeated Esc): sync the URL.
        if (open && !closeRequest.current && !dialogRef.current?.open) requestClose(false);
      }}
    >
      <div ref={backdropRef} className={`${styles.backdrop} animate-overlay`} aria-hidden="true" />

      <div ref={panelRef} className={`${styles.panel} animate-modal`} tabIndex={-1}>
        <div className={styles.stage}>
          <p id={hintId} className="visually-hidden">
            {t('appHint')}
          </p>

          <div ref={screenRef} className={styles.screen}>
            <MediaSkeleton ready={ready} />
            <iframe
              ref={iframeRef}
              className={styles.iframe}
              data-ready={ready || undefined}
              src={site.href}
              title={appTitle}
              loading="lazy"
              allow="microphone"
              sandbox={SANDBOX}
              onLoad={() => setReady(true)}
            />
          </div>
        </div>

        {canFullScreen && (
          <button
            type="button"
            className={styles.fullScreen}
            aria-label={t('work.fullScreen', { title })}
            onClick={enterFullScreen}
          >
            <ExpandIcon />
          </button>
        )}
      </div>
    </dialog>
  );
}
