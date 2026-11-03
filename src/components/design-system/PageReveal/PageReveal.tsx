'use client';

import { useRef, type ReactNode } from 'react';
import { useReveal } from '@/features/reveal/useReveal';

/**
 * Reveals the page content like the overlays do: every block (`data-reveal`: a
 * heading, a table row, a card or tile of a grid) fades up once, the first screen
 * in a short stagger on load and the rest as it scrolls into view. Blocks that
 * come in together rise in reading order: left to right, top to bottom.
 * The wrapper must keep its box: with `display: contents` Next.js has nothing to
 * measure and skips scrolling a new page to the top.
 * Until script takes over, the elements are hidden by the server render
 * (`data-reveal-page`, animations.css), so nothing flashes.
 */
export function PageReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { root: 'viewport' });

  return (
    <div ref={ref} data-reveal-page="">
      {children}
    </div>
  );
}
