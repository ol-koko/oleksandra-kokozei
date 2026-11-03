'use client';

import { useEffect, type RefObject } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** At most this many steps of stagger, so a batch never keeps the last element waiting long. */
const MAX_STAGGER = 6;

/** Elements that never reveal on their own, only together with what follows them (dividers). */
const WITH_NEXT = '[data-reveal="with-next"]';

/** Sorts elements into document order. */
function byDocumentOrder(a: Element, b: Element) {
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

/**
 * Time-based reveal, like the Hero entrance: every `[data-reveal]` element in
 * the container fades up once. In an overlay (`root: 'scroller'`, the default)
 * the container is the scroller: the first screen comes in after the panel's
 * own entrance, once per open. On a page (`root: 'viewport'`) the container
 * is the page content and the window is the viewport: the first screen comes
 * in on load. The rest come in as each element enters (the bottom edge,
 * --spacing-5xl, does not count).
 * Elements that come into view together rise one after another. A
 * `[data-reveal-row]` reveals as one: when any of its items comes in, all
 * do, so items hidden sideways in a scrolling row (mobile shelves) are
 * already there when swiped to. A `[data-reveal="with-next"]` (a divider)
 * is never observed: it rises just before the first element after it, so it
 * is never on screen alone.
 *
 * Script arms the container (`data-reveal-armed`), which hides the elements
 * until they are revealed (animations.css), so without script, and with
 * reduced motion, the content shows as is. Call it after the effect that
 * opens the dialog: the panel's entrance exists to wait for, and arming
 * still lands before the open dialog's first paint.
 */
export function useReveal(
  scrollerRef: RefObject<HTMLElement | null>,
  { root = 'scroller' }: { root?: 'scroller' | 'viewport' } = {},
) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    // A page may be hidden from the server render until script takes over (animations.css).
    scroller.removeAttribute('data-reveal-pending');
    if (window.matchMedia(REDUCED_MOTION).matches) return;

    scroller.setAttribute('data-reveal-armed', '');
    let observer: IntersectionObserver | undefined;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      const edge = getComputedStyle(scroller).getPropertyValue('--spacing-5xl').trim() || '0px';
      observer = new IntersectionObserver(
        (entries, self) => {
          const batch = new Set<HTMLElement>();
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const row = entry.target.parentElement?.closest('[data-reveal-row]');
            const items = row ? row.querySelectorAll<HTMLElement>('[data-reveal]') : [];
            for (const element of row ? items : [entry.target as HTMLElement]) {
              if (!element.hasAttribute('data-revealed')) batch.add(element);
            }
          }
          if (!batch.size) return;
          // Hidden dividers above anything revealed now come along, one step ahead of it.
          const last = [...batch].sort(byDocumentOrder).at(-1);
          for (const lead of scroller.querySelectorAll<HTMLElement>(WITH_NEXT)) {
            if (lead.hasAttribute('data-revealed') || !last) continue;
            if (lead.compareDocumentPosition(last) & Node.DOCUMENT_POSITION_FOLLOWING)
              batch.add(lead);
          }
          // A batch rises in reading order.
          let step = 0;
          for (const element of [...batch].sort(byDocumentOrder)) {
            element.style.setProperty('--reveal-i', String(Math.min(step++, MAX_STAGGER)));
            element.setAttribute('data-revealed', '');
            self.unobserve(element);
          }
        },
        { root: root === 'scroller' ? scroller : null, rootMargin: `0px 0px -${edge} 0px` },
      );
      for (const element of scroller.querySelectorAll(`[data-reveal]:not(${WITH_NEXT})`)) {
        observer.observe(element);
      }
    };

    // Only the panel's entrance counts, as for the initial section scroll.
    const entrance = root === 'scroller' ? (scroller.parentElement?.getAnimations() ?? []) : [];
    Promise.all(entrance.map((animation) => animation.finished)).then(start, start);

    return () => {
      cancelled = true;
      observer?.disconnect();
      scroller.removeAttribute('data-reveal-armed');
    };
  }, [scrollerRef, root]);
}
