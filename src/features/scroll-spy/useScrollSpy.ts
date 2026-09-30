'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Returns the id of the section currently in view.
 *
 * The active section is the last one, in document order, whose top edge has
 * reached the bottom edge of `offsetRef` (the sticky header), which is where
 * anchor links land. Before any section gets there, the first one is active.
 * At the bottom of a scrollable page the last section is active, because a
 * short final section can never reach the header.
 *
 * The line is fixed to the header, not to a share of the viewport: sections
 * are shorter than tall viewports, so a viewport-relative line would pass
 * several section tops at once and pick a section further down the page.
 */
export function useScrollSpy<Id extends string>(
  ids: readonly Id[],
  offsetRef?: RefObject<HTMLElement | null>,
): Id | undefined {
  const [activeId, setActiveId] = useState<Id | undefined>(ids[0]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      // 1 px tolerance for the fractional header height after an anchor jump.
      const line = (offsetRef?.current?.getBoundingClientRect().bottom ?? 0) + 1;
      const { scrollHeight } = document.documentElement;
      const atBottom =
        window.scrollY > 0 && window.scrollY + window.innerHeight >= scrollHeight - 1;

      if (atBottom) {
        setActiveId(ids.at(-1));
        return;
      }

      let current = ids[0];
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) current = id;
      }
      setActiveId(current);
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids, offsetRef]);

  return activeId;
}
