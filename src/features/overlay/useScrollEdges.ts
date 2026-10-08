'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Marks a scroll container's edges for CSS, straight on the element (no
 * re-render): `data-scrolled` once the content has left the top, and
 * `data-at-end` at the very end. Follows scrolling and size changes of the
 * scroller and its content (a section that grows, a font that loads).
 */
export function useScrollEdges(scrollerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = scroller.scrollHeight - scroller.clientHeight;
      // One pixel of slack for fractional scroll positions.
      scroller.dataset.scrolled = String(scroller.scrollTop > 1);
      scroller.dataset.atEnd = String(scroller.scrollTop >= max - 1);
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener('scroll', schedule, { passive: true });
    const resize = new ResizeObserver(schedule);
    resize.observe(scroller);
    for (const child of scroller.children) resize.observe(child);

    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener('scroll', schedule);
      resize.disconnect();
    };
  }, [scrollerRef]);
}
