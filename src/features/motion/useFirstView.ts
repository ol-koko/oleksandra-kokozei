'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Turns true once any part of the element has come on screen, and stays
 * true: for entrances (item staggers) that should play when the visitor
 * reaches them, not at mount. Inside a scrolling overlay the observer clips
 * by the overlay scroller too, as `useInView` does.
 */
export function useFirstView(ref: RefObject<HTMLElement | null>) {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setSeen(true);
      observer.disconnect();
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return seen;
}
