/** Marks an element that received script focus right after a tap or click. Styled in globals.css. */
export const POINTER_FOCUS_ATTRIBUTE = 'data-pointer-focus';

type MoveFocusOptions = {
  /** The focus move answers a mouse or touch activation, not a key press. */
  fromPointer: boolean;
  preventScroll?: boolean;
};

/**
 * Moves focus by script (dialog open/close) and tells the browser which input
 * caused it, instead of leaving `:focus-visible` to a guess.
 *
 * Safari never focuses a button on click or tap, so focus is still on <body>
 * when a dialog opens; WebKit then treats the script focus as keyboard focus
 * and draws the ring, and the ring follows when focus returns to the trigger.
 * `focusVisible` fixes this where supported; the attribute covers the rest
 * and is dropped on blur or on the next key press, so keyboard use always
 * brings the ring back.
 */
export function moveFocus(
  target: HTMLElement | null,
  { fromPointer, preventScroll }: MoveFocusOptions,
) {
  if (!target) return;

  if (fromPointer) {
    target.setAttribute(POINTER_FOCUS_ATTRIBUTE, '');
    const cleanup = new AbortController();
    const clear = () => {
      target.removeAttribute(POINTER_FOCUS_ATTRIBUTE);
      cleanup.abort();
    };
    target.addEventListener('blur', clear, { signal: cleanup.signal });
    target.addEventListener('keydown', clear, { signal: cleanup.signal });
  } else {
    target.removeAttribute(POINTER_FOCUS_ATTRIBUTE);
  }

  target.focus({ preventScroll, focusVisible: !fromPointer });
}

/** `click` from Enter or Space has `detail` 0; mouse and touch clicks count from 1. */
export function isPointerClick(event: { detail: number }) {
  return event.detail > 0;
}
