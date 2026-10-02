'use client';

import { useLayoutEffect, type RefObject } from 'react';

const ENABLED_CLASS = 'js-reveal';

/**
 * Scroll reveal for one `.reveal` element (see design-system/animations.css).
 *
 * Without JavaScript the element stays visible: it is hidden only once
 * `js-reveal` is on <html>. In the same synchronous step (before paint) an
 * element that is already in view, or above it (page load, anchor link such as
 * /#works, restored scroll), gets `is-visible` and `is-instant`, so it never
 * waits. The rest get `is-visible` once when they approach the viewport, and
 * the observer disconnects.
 */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    document.documentElement.classList.add(ENABLED_CLASS);

    const reveal = () => element.classList.add('is-visible');

    if (
      typeof IntersectionObserver === 'undefined' ||
      element.getBoundingClientRect().top < window.innerHeight
    ) {
      element.classList.add('is-instant');
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        reveal();
        observer.disconnect();
      },
      // Reveals a little before the section's top edge reaches the viewport bottom.
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);
}
