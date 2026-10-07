'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import {
  ACTIVATION_RATIO,
  BOTTOM_THRESHOLD,
  SCROLL_KEYS,
  pickActiveSection,
} from '@/features/scroll-spy/activeSection';

/**
 * Scroll-spy inside an overlay, with the overlay's own scroll container as the
 * IntersectionObserver root. Same rules as the page (`useScrollSpy`): the
 * active section is the last one whose top has passed the line a third of the
 * way down the scroller; when the end sentinel is in view, the last section is
 * active. `lock(id)` keeps a clicked item active while the scroller glides
 * there, until the visitor scrolls by hand (wheel, touch, scroll keys, a press
 * on the scrollbar).
 */
export function useOverlayScrollSpy<Id extends string>(
  ids: readonly Id[],
  scrollerRef: RefObject<HTMLElement | null>,
  sentinelRef: RefObject<HTMLElement | null>,
) {
  const [activeId, setActiveId] = useState<Id | undefined>(ids[0]);
  const lockedId = useRef<Id | undefined>(undefined);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const sentinel = sentinelRef.current;
    if (!scroller || !sentinel) return;

    let frame = 0;
    let atEnd = false;

    const update = () => {
      frame = 0;
      if (lockedId.current !== undefined) return;
      const line = scroller.getBoundingClientRect().top + scroller.clientHeight * ACTIVATION_RATIO;
      setActiveId(
        pickActiveSection(ids, {
          line,
          nearBottom: atEnd && scroller.scrollTop > 0,
          topOf: (id) => document.getElementById(id)?.getBoundingClientRect().top,
        }),
      );
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    // A section's top crosses the line exactly when it enters or leaves the band above the line.
    const sections = new IntersectionObserver(schedule, {
      root: scroller,
      rootMargin: `0px 0px -${(1 - ACTIVATION_RATIO) * 100}% 0px`,
    });
    const end = new IntersectionObserver(
      ([entry]) => {
        atEnd = entry?.isIntersecting ?? false;
        schedule();
      },
      { root: scroller, rootMargin: `0px 0px ${BOTTOM_THRESHOLD}px 0px` },
    );

    for (const id of ids) {
      const section = document.getElementById(id);
      if (section) sections.observe(section);
    }
    end.observe(sentinel);

    const release = () => {
      if (lockedId.current === undefined) return;
      lockedId.current = undefined;
      schedule();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) release();
    };
    // A press on the scroller's own scrollbar targets the scroller itself.
    const onPointerDown = (event: PointerEvent) => {
      if (event.target === scroller) release();
    };

    const passive = { passive: true } as const;
    scroller.addEventListener('wheel', release, passive);
    scroller.addEventListener('touchmove', release, passive);
    scroller.addEventListener('keydown', onKeyDown);
    scroller.addEventListener('pointerdown', onPointerDown);

    return () => {
      cancelAnimationFrame(frame);
      sections.disconnect();
      end.disconnect();
      scroller.removeEventListener('wheel', release);
      scroller.removeEventListener('touchmove', release);
      scroller.removeEventListener('keydown', onKeyDown);
      scroller.removeEventListener('pointerdown', onPointerDown);
    };
  }, [ids, scrollerRef, sentinelRef]);

  const lock = useCallback((id: Id) => {
    lockedId.current = id;
    setActiveId(id);
  }, []);

  return { activeId, lock };
}
