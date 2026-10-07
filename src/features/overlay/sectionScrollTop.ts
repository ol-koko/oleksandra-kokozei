/** The scroller's `scrollTop` that brings `section` to its scroll margin at the top. */
export function sectionScrollTop(scroller: HTMLElement, section: HTMLElement) {
  const margin = parseFloat(getComputedStyle(section).scrollMarginBlockStart) || 0;
  const offset =
    section.getBoundingClientRect().top - scroller.getBoundingClientRect().top - margin;
  return scroller.scrollTop + offset;
}

/**
 * Scrolls the nearest scrolling ancestor (the overlay scroller) so `section`
 * starts at its scroll margin. Resolves once the scroll has settled.
 */
export function scrollToSection(section: HTMLElement, behavior: ScrollBehavior) {
  let scroller = section.parentElement;
  while (scroller && !/auto|scroll/.test(getComputedStyle(scroller).overflowY)) {
    scroller = scroller.parentElement;
  }
  if (!scroller) return Promise.resolve();
  const top = sectionScrollTop(scroller, section);
  const target = scroller;
  // Already there (or instant): nothing to wait for.
  if (behavior !== 'smooth' || Math.abs(target.scrollTop - top) < 1) {
    target.scrollTo({ top, behavior: 'instant' });
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    // Browsers without `scrollend` fall back to a generous timeout.
    const fallback = setTimeout(done, 1000);
    function done() {
      clearTimeout(fallback);
      target.removeEventListener('scrollend', done);
      resolve();
    }
    target.addEventListener('scrollend', done, { once: true });
    target.scrollTo({ top, behavior });
  });
}
