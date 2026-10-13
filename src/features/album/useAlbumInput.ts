'use client';

import { useRef, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';

/** Horizontal travel that makes a swipe. */
const SWIPE_MIN = 40;

/**
 * Keyboard and swipe input for the album, on its root element: ArrowLeft and
 * ArrowRight turn while focus is inside; a horizontal touch or pen swipe
 * turns once (left: next, right: previous) and swallows the click that may
 * follow it. Pair with `touch-action: pan-y`, so vertical scrolling stays
 * native and the browser leaves horizontal moves to the page.
 */
export function useAlbumInput(next: () => void, previous: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const swallowClick = useRef(false);

  return {
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      if (event.key === 'ArrowRight') next();
      else previous();
    },
    onPointerDown: (event: PointerEvent) => {
      swallowClick.current = false;
      start.current =
        event.isPrimary && event.pointerType !== 'mouse'
          ? { x: event.clientX, y: event.clientY }
          : null;
    },
    onPointerUp: (event: PointerEvent) => {
      const from = start.current;
      start.current = null;
      if (!from) return;
      const dx = event.clientX - from.x;
      const dy = event.clientY - from.y;
      if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) <= Math.abs(dy)) return;
      swallowClick.current = true;
      if (dx < 0) next();
      else previous();
    },
    onPointerCancel: () => {
      start.current = null;
    },
    onClickCapture: (event: MouseEvent) => {
      if (!swallowClick.current) return;
      swallowClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
  };
}
