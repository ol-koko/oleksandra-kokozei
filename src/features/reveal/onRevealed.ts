const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Calls `callback` once the `data-reveal` element around `element` has appeared
 * (see useReveal): revealed, and its rise finished. Called at once when nothing
 * reveals it: no such element, no page armed for it, or reduced motion. Returns
 * a cleanup. Looping specimens use it to start only after their section is there.
 */
export function onRevealed(element: Element, callback: () => void): () => void {
  const target = element.closest('[data-reveal]');
  const armed = target?.closest('[data-reveal-pending], [data-reveal-armed]');
  if (!target || !armed || window.matchMedia(REDUCED_MOTION).matches) {
    callback();
    return () => undefined;
  }

  let cancelled = false;
  const appear = () => {
    // A cancelled animation rejects: the element is there all the same.
    void Promise.allSettled(target.getAnimations().map((animation) => animation.finished)).then(
      () => {
        if (!cancelled) callback();
      },
    );
  };

  if (target.hasAttribute('data-revealed')) {
    appear();
    return () => {
      cancelled = true;
    };
  }

  const observer = new MutationObserver(() => {
    if (!target.hasAttribute('data-revealed')) return;
    observer.disconnect();
    appear();
  });
  observer.observe(target, { attributes: true, attributeFilter: ['data-revealed'] });
  return () => {
    cancelled = true;
    observer.disconnect();
  };
}
