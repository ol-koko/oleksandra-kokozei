'use client';

import { useEffect, useState, type RefObject } from 'react';

/** How far ahead of the viewport media starts loading: half a screen on each side. */
const NEAR_MARGIN = '50% 50%';

/**
 * Where an element stands against the viewport, for lazy media.
 *
 * `near` turns true once the element comes within half a screen of the
 * viewport and stays true, so loading starts once. `inView` follows whether
 * any part of it is on screen, for playing and pausing. Elements inside a
 * scrolling overlay work too: the observers clip by every scroll container.
 */
export function useInView(ref: RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNear(true);
        nearObserver.disconnect();
      },
      { rootMargin: NEAR_MARGIN },
    );
    const viewObserver = new IntersectionObserver(([entry]) => {
      if (entry) setInView(entry.isIntersecting);
    });
    nearObserver.observe(element);
    viewObserver.observe(element);

    return () => {
      nearObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [ref]);

  return { near, inView };
}
