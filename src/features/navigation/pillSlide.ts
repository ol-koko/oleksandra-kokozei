/**
 * The sliding indicator behind a row of pills (hover.css `.lang-switch`): one
 * indicator that glides from the active pill to the chosen one. Shared by the
 * language switcher and the design system's color tabs, so both slide with the
 * same duration (`--duration-250`) and easing (`--motion-easing-emphasized`).
 */

/** Puts the indicator under a chip (hover.css reads --pill-x and --pill-w). */
export function placeIndicator(indicator: HTMLElement, chip: HTMLElement) {
  indicator.style.setProperty('--pill-x', `${chip.offsetLeft}px`);
  indicator.style.setProperty('--pill-w', `${chip.offsetWidth}px`);
}

/** The indicator geometry under a chip, as a keyframe. */
export function chipFrame(chip: HTMLElement): Keyframe {
  return { transform: `translateX(${chip.offsetLeft}px)`, width: `${chip.offsetWidth}px` };
}

/** A motion token duration (`250ms`, `0.25s`) in milliseconds. */
export function toMilliseconds(duration: string) {
  const value = parseFloat(duration);
  if (!Number.isFinite(value)) return 0;
  return duration.trim().endsWith('ms') ? value : value * 1000;
}

/** The slide's duration and easing, read from the tokens on the indicator. */
export function slideTiming(indicator: HTMLElement) {
  const tokens = getComputedStyle(indicator);
  return {
    duration: toMilliseconds(tokens.getPropertyValue('--duration-250')),
    easing: tokens.getPropertyValue('--motion-easing-emphasized').trim() || 'ease-out',
  };
}

/** Whether the visitor asked for no motion: pills then switch at once. */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
