'use client';

import { useEffect, type RefObject } from 'react';
import { scrollBehavior } from '@/features/motion/scrollBehavior';
import { sectionScrollTop } from './sectionScrollTop';

/** Any of these from the visitor stops the glide where it is. */
const INTERRUPTIONS = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;

/** Reads a duration token (`400ms` or `0.4s`) in milliseconds. */
function durationToken(name: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const amount = parseFloat(value) || 0;
  return value.endsWith('ms') ? amount : amount * 1000;
}

type InitialSectionScrollOptions = {
  scrollerRef: RefObject<HTMLElement | null>;
  /** Section to glide to; nothing happens without one. */
  anchorId: string | undefined;
  /** False once the overlay starts closing. */
  enabled: boolean;
  /** Scroll-spy: keep the target active while gliding, and let go when interrupted. */
  lock: (anchorId: string) => void;
  release: () => void;
};

/**
 * Takes a freshly opened overlay to `anchorId`: once the entrance motion has
 * finished and a short pause (--motion-duration-slow) has passed, the
 * scroller glides there and the nav shows that section as active. A wheel,
 * touch, press or key stops it at once. With reduced motion the overlay opens
 * at the section with no glide. Focus is left alone.
 */
export function useInitialSectionScroll({
  scrollerRef,
  anchorId,
  enabled,
  lock,
  release,
}: InitialSectionScrollOptions) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    const dialog = scroller?.closest('dialog');
    const section = anchorId ? document.getElementById(anchorId) : null;
    if (!enabled || !anchorId || !scroller || !dialog || !section) return;

    // Same task as showModal, so the first painted frame is already there.
    if (scrollBehavior() === 'auto') {
      scroller.scrollTop = sectionScrollTop(scroller, section);
      return;
    }

    let stopped = false;
    let gliding = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const detach = () => {
      for (const type of INTERRUPTIONS) dialog.removeEventListener(type, stop, true);
    };

    function stop() {
      if (stopped) return;
      stopped = true;
      clearTimeout(timer);
      detach();
      if (gliding) {
        // A new instant scroll to the current position cancels the smooth one.
        scroller?.scrollTo({ top: scroller.scrollTop, behavior: 'instant' });
        release();
      }
    }

    const glide = () => {
      if (stopped) return;
      gliding = true;
      lock(anchorId);
      scroller.scrollTo({ top: sectionScrollTop(scroller, section), behavior: 'smooth' });
      scroller.addEventListener(
        'scrollend',
        () => {
          stopped = true;
          detach();
        },
        { once: true },
      );
    };

    for (const type of INTERRUPTIONS) {
      dialog.addEventListener(type, stop, { capture: true, passive: true });
    }

    const entrance = dialog
      .getAnimations({ subtree: true })
      .filter((animation) => animation.effect?.getTiming().iterations !== Infinity);
    const afterEntrance = () => {
      if (!stopped) timer = setTimeout(glide, durationToken('--motion-duration-slow'));
    };
    Promise.all(entrance.map((animation) => animation.finished)).then(afterEntrance, afterEntrance);

    return stop;
  }, [scrollerRef, anchorId, enabled, lock, release]);
}
