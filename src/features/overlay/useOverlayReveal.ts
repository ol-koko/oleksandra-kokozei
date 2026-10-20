'use client';

import { useEffect, type RefObject } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** At most this many steps of stagger, so a batch never keeps the last element waiting long. */
const MAX_STAGGER = 6;

/**
 * Time-based reveal for the overlay content, like the Hero entrance: every
 * `[data-reveal]` element in the scroller fades up once per open. The first
 * screen comes in after the panel's own entrance; the rest as each element
 * enters the scroller (the bottom fade, --spacing-5xl, does not count).
 * Elements that come into view together rise one after another. A
 * `[data-reveal-row]` reveals as one: when any of its items comes in, all
 * do, so items hidden sideways in a scrolling row (mobile shelves) are
 * already there when swiped to.
 *
 * Script arms the scroller (`data-reveal-armed`), which hides the elements
 * until they are revealed (animations.css), so without script, and with
 * reduced motion, the content shows as is. Call it after the effect that
 * opens the dialog: the panel's entrance exists to wait for, and arming
 * still lands before the open dialog's first paint.
 */
export function useOverlayReveal(scrollerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || window.matchMedia(REDUCED_MOTION).matches) return;

    scroller.setAttribute('data-reveal-armed', '');
    let observer: IntersectionObserver | undefined;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      const edge = getComputedStyle(scroller).getPropertyValue('--spacing-5xl').trim() || '0px';
      observer = new IntersectionObserver(
        (entries, self) => {
          // Entries come in document order: a batch rises in reading order.
          const batch = new Set<HTMLElement>();
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const row = entry.target.parentElement?.closest('[data-reveal-row]');
            const items = row ? row.querySelectorAll<HTMLElement>('[data-reveal]') : [];
            for (const element of row ? items : [entry.target as HTMLElement]) {
              if (!element.hasAttribute('data-revealed')) batch.add(element);
            }
          }
          let step = 0;
          for (const element of batch) {
            element.style.setProperty('--reveal-i', String(Math.min(step++, MAX_STAGGER)));
            element.setAttribute('data-revealed', '');
            self.unobserve(element);
          }
        },
        { root: scroller, rootMargin: `0px 0px -${edge} 0px` },
      );
      for (const element of scroller.querySelectorAll('[data-reveal]')) observer.observe(element);
    };

    // Only the panel's entrance counts, as for the initial section scroll.
    const entrance = scroller.parentElement?.getAnimations() ?? [];
    Promise.all(entrance.map((animation) => animation.finished)).then(start, start);

    return () => {
      cancelled = true;
      observer?.disconnect();
      scroller.removeAttribute('data-reveal-armed');
    };
  }, [scrollerRef]);
}
