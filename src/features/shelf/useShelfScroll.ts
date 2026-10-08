'use client';

import { useCallback, useEffect, useState, type RefObject } from 'react';
import { scrollBehavior } from '@/features/motion/scrollBehavior';

/**
 * Arrow controls for a horizontal scroll-snap row: whether it sits at its
 * start or end, and a step of one item (item width plus the row gap; smooth,
 * instant with reduced motion). Native swiping keeps working; the edges
 * follow every scroll and resize.
 */
export function useShelfScroll(scrollerRef: RefObject<HTMLElement | null>) {
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = scroller.scrollWidth - scroller.clientWidth;
      // One pixel of slack for fractional scroll positions.
      setEdges({ atStart: scroller.scrollLeft <= 1, atEnd: scroller.scrollLeft >= max - 1 });
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    schedule();
    scroller.addEventListener('scroll', schedule, { passive: true });
    const resize = new ResizeObserver(schedule);
    resize.observe(scroller);

    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener('scroll', schedule);
      resize.disconnect();
    };
  }, [scrollerRef]);

  const scrollByItem = useCallback(
    (direction: 1 | -1) => {
      const scroller = scrollerRef.current;
      const item = scroller?.firstElementChild;
      if (!scroller || !(item instanceof HTMLElement)) return;
      const gap = Number.parseFloat(getComputedStyle(scroller).columnGap) || 0;
      scroller.scrollBy({ left: direction * (item.offsetWidth + gap), behavior: scrollBehavior() });
    },
    [scrollerRef],
  );

  return { ...edges, scrollByItem };
}
