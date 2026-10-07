/** Number of open layers (menu, overlay) that currently lock page scroll. */
let locks = 0;

/**
 * Locks page scroll while a modal layer is open. Calls are counted, so a menu
 * opened on top of an overlay does not unlock the page when it closes. The
 * root keeps `scrollbar-gutter: stable` (globals.css), so nothing shifts.
 */
export function lockScroll() {
  locks += 1;
  document.documentElement.style.overflow = 'hidden';
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) document.documentElement.style.overflow = '';
}
