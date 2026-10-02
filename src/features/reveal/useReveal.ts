'use client';

import { useLayoutEffect, type RefObject } from 'react';

const ENABLED_CLASS = 'js-reveal';

/** Whether revealInitScript hid the sections before first paint (a normal load). Read once. */
let animatesOnLoad: boolean | undefined;

/**
 * Scroll reveal for one `.reveal` element (see design-system/animations.css).
 *
 * Normal load: the element is hidden from the first paint (revealInitScript)
 * and gets `is-visible` once it approaches the viewport, then the observer
 * disconnects. When it is already in view on load, it also gets `is-delayed`,
 * so it animates in after the hero entrance.
 *
 * Load at a hash or with a restored scroll position: `js-reveal` is added here,
 * before paint, and an element already in view or above it gets `is-visible`
 * and `is-instant` in the same step, so it never waits.
 */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const root = document.documentElement;
    animatesOnLoad ??= root.classList.contains(ENABLED_CLASS);
    root.classList.add(ENABLED_CLASS);

    const reveal = (...extra: string[]) => element.classList.add('is-visible', ...extra);

    if (typeof IntersectionObserver === 'undefined') {
      reveal('is-instant');
      return;
    }

    if (!animatesOnLoad && element.getBoundingClientRect().top < window.innerHeight) {
      reveal('is-instant');
      return;
    }

    // The first callback reports the state on load; later ones come from scrolling.
    let initial = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const onLoad = initial;
        initial = false;
        if (!entry?.isIntersecting) return;
        if (onLoad) reveal('is-delayed');
        else reveal();
        observer.disconnect();
      },
      // Reveals a little before the section's top edge reaches the viewport bottom.
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);
}
