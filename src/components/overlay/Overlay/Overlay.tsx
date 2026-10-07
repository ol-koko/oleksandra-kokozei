'use client';

import { useTranslations } from 'next-intl';
import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Breadcrumbs } from '@/components/overlay/Breadcrumbs/Breadcrumbs';
import { OverlayHeader } from '@/components/overlay/OverlayHeader/OverlayHeader';
import { OverlayNav } from '@/components/overlay/OverlayNav/OverlayNav';
import { OverlaySection } from '@/components/overlay/OverlaySection/OverlaySection';
import { Divider } from '@/components/ui/Divider/Divider';
import { sectionIds } from '@/content/navigation';
import type { OverlayRoute, SectionId } from '@/content/types';
import { moveFocus } from '@/features/focus/moveFocus';
import { trapTab } from '@/features/focus/trapTab';
import { scrollBehavior } from '@/features/motion/scrollBehavior';
import { closeOverlay, findTrigger, getOpener } from '@/features/overlay/overlayRoute';
import { useOverlayScrollSpy } from '@/features/overlay/useOverlayScrollSpy';
import { useOverlayView } from '@/features/overlay/useOverlayView';
import { lockScroll, unlockScroll } from '@/features/scroll-lock/scrollLock';
import styles from './Overlay.module.css';

type OverlayProps = {
  route: OverlayRoute;
  /** False once the URL no longer names this overlay: the closing motion plays, then `onClosed`. */
  open: boolean;
  onClosed: () => void;
  /** The site footer, repeated at the end of the mobile overlay. */
  footer: ReactNode;
};

type CloseRequest = {
  fromPointer: boolean;
  /** Runs instead of returning focus to the trigger (a page link was followed). */
  then?: () => void;
};

const isSectionId = (value: string): value is SectionId =>
  (sectionIds as readonly string[]).includes(value);

/**
 * The one overlay shell (D5). Desktop: a fixed panel over a dimmed page that
 * never grows with its content; only the inner scroller moves, next to a
 * sticky scroll-spy nav. Mobile: full screen with the site header, breadcrumbs
 * as the exit control, and the site footer (D10).
 *
 * A modal <dialog> makes the page inert. Esc, a click on the backdrop and the
 * first breadcrumb all close through the URL (`closeOverlay`), so browser Back
 * takes the same path: the host flips `open`, the closing motion plays, and
 * focus returns to the trigger.
 */
export function Overlay({ route, open, onClosed, footer }: OverlayProps) {
  const t = useTranslations('Overlay');
  const view = useOverlayView(route);
  const titleId = useId();
  const hintId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const closeRequest = useRef<CloseRequest | null>(null);
  /** Whether this overlay holds a page scroll lock. */
  const lockedRef = useRef(false);

  const anchorIds = useMemo(() => view.sections.map((section) => section.anchorId), [view]);
  const { activeId, lock } = useOverlayScrollSpy(anchorIds, scrollerRef, sentinelRef);

  // Open on mount. Focus goes to the scroller, so arrow keys scroll at once and Tab reaches the nav.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    lockScroll();
    lockedRef.current = true;
    moveFocus(scrollerRef.current, { fromPointer: getOpener().fromPointer, preventScroll: true });

    return () => {
      if (dialog.open) dialog.close();
      if (lockedRef.current) {
        lockedRef.current = false;
        unlockScroll();
      }
    };
  }, []);

  // Closing: wait for the closing motion, then close the dialog and hand focus back.
  useEffect(() => {
    if (open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      const request = closeRequest.current;
      closeRequest.current = null;
      dialog.close();
      if (lockedRef.current) {
        lockedRef.current = false;
        unlockScroll();
      }
      if (request?.then) {
        request.then();
      } else {
        // Back from a pointer or gesture is treated like a pointer close: no ring until a key press.
        moveFocus(findTrigger(view.key), {
          fromPointer: request?.fromPointer ?? true,
          preventScroll: true,
        });
      }
      onClosed();
    };

    const animations = dialog
      .getAnimations({ subtree: true })
      .filter((animation) => animation.effect?.getTiming().iterations !== Infinity);
    Promise.all(animations.map((animation) => animation.finished)).then(finish, finish);

    return () => {
      cancelled = true;
    };
  }, [open, onClosed, view.key]);

  const requestClose = (request: CloseRequest) => {
    if (!open || closeRequest.current) return;
    closeRequest.current = request;
    closeOverlay();
  };

  const selectSection = (anchorId: string, fromPointer: boolean) => {
    const scroller = scrollerRef.current;
    const section = document.getElementById(anchorId);
    if (!scroller || !section) return;
    lock(anchorId);
    const margin = parseFloat(getComputedStyle(section).scrollMarginBlockStart) || 0;
    const offset =
      section.getBoundingClientRect().top - scroller.getBoundingClientRect().top - margin;
    scroller.scrollTo({ top: scroller.scrollTop + offset, behavior: scrollBehavior() });
    moveFocus(section, { fromPointer, preventScroll: true });
  };

  // Links to page sections (mobile menu, footer): close the overlay, then scroll the page there.
  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.defaultPrevented || !(event.target instanceof Element)) return;
    const id = event.target.closest('a[href^="#"]')?.getAttribute('href')?.slice(1);
    if (!id || !isSectionId(id)) return;
    event.preventDefault();
    requestClose({
      fromPointer: true,
      then: () =>
        document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' }),
    });
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={hintId}
      className={`${styles.dialog} ${open ? '' : styles.closing}`}
      onKeyDown={(event) => trapTab(event, dialogRef.current)}
      onClick={onDialogClick}
      onCancel={(event) => {
        // Esc: close through the URL like every other path.
        event.preventDefault();
        requestClose({ fromPointer: false });
      }}
      onClose={() => {
        // The browser closed the dialog on its own (repeated Esc): sync the URL. The event is
        // async, so a dialog reopened since (Strict Mode remount) is still open and stays.
        if (open && !closeRequest.current && !dialogRef.current?.open) {
          requestClose({ fromPointer: false });
        }
      }}
    >
      <div
        className={`${styles.backdrop} animate-overlay`}
        aria-hidden="true"
        onClick={() => requestClose({ fromPointer: true })}
      />

      <div className={`${styles.panel} animate-modal`}>
        <div ref={scrollerRef} className={styles.scroller} tabIndex={-1}>
          <p id={titleId} className="visually-hidden">
            {view.title}
          </p>
          <p id={hintId} className="visually-hidden">
            {t('hint')}
          </p>

          <OverlayHeader activeId={view.parentSection} className={styles.mobileOnly} />
          <Breadcrumbs
            parentLabel={view.parentLabel}
            current={view.crumb}
            onExit={(fromPointer) => requestClose({ fromPointer })}
            className={styles.mobileOnly}
          />

          <div className={styles.layout}>
            <div className={styles.content}>
              {view.sections.map((section, index) => (
                <Fragment key={section.id}>
                  {index > 0 && <Divider className={styles.divider} />}
                  <OverlaySection section={section} />
                </Fragment>
              ))}
            </div>

            <OverlayNav
              label={t('sectionsNav')}
              items={view.sections}
              activeId={activeId}
              onSelect={selectSection}
            />
          </div>

          <div ref={sentinelRef} aria-hidden="true" />
          <div className={styles.mobileOnly}>{footer}</div>
        </div>
      </div>
    </dialog>
  );
}
