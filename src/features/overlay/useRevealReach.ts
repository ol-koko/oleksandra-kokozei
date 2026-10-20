'use client';

import { useEffect, type RefObject } from 'react';

/** The reveal's own vertical offset (`translate`), which client rects include. */
function revealOffset(element: HTMLElement) {
  const [, y = '0'] = getComputedStyle(element).translate.split(' ');
  return parseFloat(y) || 0;
}

/**
 * Sets `--reveal-reach` on every `.reveal` in the overlay scroller: how far
 * the block can still travel once its top edge enters at the bottom, up to
 * the end of the scroll. The overlay caps the reveal range with it, so blocks
 * near the end, which can never travel the page's full 50svh, still finish
 * at the end of the scroll; every other block keeps the page's range.
 * Measured again whenever the scroller or its content changes size.
 */
export function useRevealReach(scrollerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const measure = () => {
      const box = scroller.getBoundingClientRect();
      // The panel scales in on open: work in layout pixels.
      const scale = box.height / scroller.offsetHeight || 1;
      for (const element of scroller.querySelectorAll<HTMLElement>('.reveal')) {
        const top =
          (element.getBoundingClientRect().top - box.top) / scale +
          scroller.scrollTop -
          revealOffset(element);
        // At the end of the scroll the scrollport's bottom edge sits at scrollHeight.
        const reach = Math.floor(scroller.scrollHeight - top) - 1;
        element.style.setProperty('--reveal-reach', `${reach}px`);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(scroller);
    for (const child of scroller.children) observer.observe(child);
    return () => observer.disconnect();
  }, [scrollerRef]);
}
