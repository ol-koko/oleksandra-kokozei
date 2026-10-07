/** The scroller's `scrollTop` that brings `section` to its scroll margin at the top. */
export function sectionScrollTop(scroller: HTMLElement, section: HTMLElement) {
  const margin = parseFloat(getComputedStyle(section).scrollMarginBlockStart) || 0;
  const offset =
    section.getBoundingClientRect().top - scroller.getBoundingClientRect().top - margin;
  return scroller.scrollTop + offset;
}

/** Scrolls the nearest scrolling ancestor (the overlay scroller) so `section` starts at its scroll margin. */
export function scrollToSection(section: HTMLElement, behavior: ScrollBehavior) {
  let scroller = section.parentElement;
  while (scroller && !/auto|scroll/.test(getComputedStyle(scroller).overflowY)) {
    scroller = scroller.parentElement;
  }
  scroller?.scrollTo({ top: sectionScrollTop(scroller, section), behavior });
}
