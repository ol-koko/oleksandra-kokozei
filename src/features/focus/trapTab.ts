import type { KeyboardEvent } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab inside `container`: from the last focusable element it wraps to
 * the first, and Shift+Tab from the first wraps to the last. A modal <dialog>
 * already makes the page inert; this also keeps focus off the browser UI.
 * Hidden elements (display: none) are skipped.
 */
export function trapTab(event: KeyboardEvent, container: HTMLElement | null) {
  if (event.key !== 'Tab' || event.defaultPrevented || !container) return;
  // A dialog opened inside this one (the menu inside an overlay) keeps its own trap.
  if (
    event.target instanceof Element &&
    event.target.closest('dialog') !== container.closest('dialog')
  )
    return;
  const focusable = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => element.getClientRects().length > 0,
  );
  const first = focusable[0];
  const last = focusable.at(-1);
  if (!first || !last) return;

  const active = document.activeElement;
  if (event.shiftKey && (active === first || active === container)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}
