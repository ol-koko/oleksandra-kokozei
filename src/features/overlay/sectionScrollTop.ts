/** The scroller's `scrollTop` that brings `section` to its scroll margin at the top. */
export function sectionScrollTop(scroller: HTMLElement, section: HTMLElement) {
  const margin = parseFloat(getComputedStyle(section).scrollMarginBlockStart) || 0;
  const offset =
    section.getBoundingClientRect().top - scroller.getBoundingClientRect().top - margin;
  return scroller.scrollTop + offset;
}
