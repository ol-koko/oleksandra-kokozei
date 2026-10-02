'use client';

import { useEffect, useState, type RefObject } from 'react';

/** Activation line: a third of the way down the viewport (never above the header). */
const ACTIVATION_RATIO = 1 / 3;
/** Within this many px of the page end, the last section is active. */
const BOTTOM_THRESHOLD = 24;
/** Keys that scroll the page; any of them ends a click lock. */
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

/**
 * Returns the id of the section currently in view.
 *
 * The active section is the last one, in document order, whose top edge has
 * passed the activation line: a third of the way down the viewport, or the
 * bottom of `offsetRef` (the sticky header) when that is lower. Near the end of
 * the page the last section is active, because a short final section may
 * never reach the line.
 *
 * A click on an in-page link to one of the sections (from any nav) makes that
 * section active at once and keeps it active while the browser scrolls there,
 * until the user scrolls manually (wheel, touch, scroll keys, scrollbar).
 */
export function useScrollSpy<Id extends string>(
  ids: readonly Id[],
  offsetRef?: RefObject<HTMLElement | null>,
): Id | undefined {
  const [activeId, setActiveId] = useState<Id | undefined>(ids[0]);

  useEffect(() => {
    let frame = 0;
    let lockedId: Id | undefined;

    const isSectionId = (value: string): value is Id => (ids as readonly string[]).includes(value);

    const sectionInView = (): Id | undefined => {
      const headerBottom = offsetRef?.current?.getBoundingClientRect().bottom ?? 0;
      const line = Math.max(headerBottom, window.innerHeight * ACTIVATION_RATIO);
      const { scrollHeight } = document.documentElement;
      const nearBottom =
        window.scrollY > 0 && window.scrollY + window.innerHeight >= scrollHeight - BOTTOM_THRESHOLD;

      if (nearBottom) return ids.at(-1);

      let current = ids[0];
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) current = id;
      }
      return current;
    };

    const update = () => {
      frame = 0;
      setActiveId(lockedId ?? sectionInView());
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || !(event.target instanceof Element)) return;
      const id = event.target.closest('a[href^="#"]')?.getAttribute('href')?.slice(1);
      if (!id || !isSectionId(id)) return;
      lockedId = id;
      setActiveId(id);
    };

    const release = () => {
      if (lockedId === undefined) return;
      lockedId = undefined;
      schedule();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) release();
    };

    // A press on the page scrollbar targets the root element.
    const onPointerDown = (event: PointerEvent) => {
      if (event.target === document.documentElement) release();
    };

    const passive = { passive: true } as const;

    schedule();
    window.addEventListener('scroll', schedule, passive);
    window.addEventListener('resize', schedule);
    window.addEventListener('wheel', release, passive);
    window.addEventListener('touchmove', release, passive);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('wheel', release);
      window.removeEventListener('touchmove', release);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('click', onClick);
    };
  }, [ids, offsetRef]);

  return activeId;
}
