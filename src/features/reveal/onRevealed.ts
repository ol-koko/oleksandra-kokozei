/**
 * Calls `callback` once the `data-reveal` element around `element` has been
 * revealed (see useReveal), at once when nothing is waiting to reveal it: no
 * such element, no page armed for it, or reduced motion. Returns a cleanup.
 * Looping specimens use it to start only after their section has appeared.
 */
export function onRevealed(element: Element, callback: () => void): () => void {
  const target = element.closest('[data-reveal]');
  const waiting =
    target &&
    !target.hasAttribute('data-revealed') &&
    target.closest('[data-reveal-pending], [data-reveal-armed]');
  if (!target || !waiting) {
    callback();
    return () => undefined;
  }

  const observer = new MutationObserver(() => {
    if (!target.hasAttribute('data-revealed')) return;
    observer.disconnect();
    callback();
  });
  observer.observe(target, { attributes: true, attributeFilter: ['data-revealed'] });
  return () => observer.disconnect();
}
