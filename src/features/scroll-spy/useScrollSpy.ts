'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Returns the id of the section currently in view.
 *
 * One IntersectionObserver watches a band from the bottom edge of `offsetRef`
 * (the sticky header) down to 40 % of the viewport. The active section is the
 * last one, in document order, that intersects the band: a section becomes
 * active once its top edge scrolls above the 40 % line.
 */
export function useScrollSpy<Id extends string>(
  ids: readonly Id[],
  offsetRef?: RefObject<HTMLElement | null>,
): Id | undefined {
  const [activeId, setActiveId] = useState<Id | undefined>(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const offset = offsetRef?.current?.offsetHeight ?? 0;
    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }
        const current = ids.findLast((id) => intersecting.has(id));
        if (current !== undefined) setActiveId(current);
      },
      { rootMargin: `-${offset}px 0px -60% 0px` },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [ids, offsetRef]);

  return activeId;
}
