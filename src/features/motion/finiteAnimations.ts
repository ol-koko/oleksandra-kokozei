/**
 * The animations in `element` and its subtree that will finish on their own:
 * time-based and not infinite. A closing layer waits for these. Loops (the
 * loading shimmer) and scroll-driven animations, which only progress with
 * scrolling, would keep it waiting forever.
 */
export function finiteAnimations(element: Element) {
  return element
    .getAnimations({ subtree: true })
    .filter(
      (animation) =>
        animation.timeline === document.timeline &&
        animation.effect?.getTiming().iterations !== Infinity,
    );
}
