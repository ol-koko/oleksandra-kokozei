'use client';

import { useRef, type ReactNode } from 'react';
import { useReveal } from '@/features/reveal/useReveal';

/**
 * Reveals the page content like the overlays do: every `data-reveal` element
 * fades up once, the first screen in a short stagger on load and the rest as
 * it scrolls into view. The wrapper adds no box (`display: contents`).
 * Until script takes over, the elements are hidden by the server render
 * (`data-reveal-pending`, animations.css), so nothing flashes.
 */
export function PageReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { root: 'viewport' });

  return (
    <div ref={ref} data-reveal-pending="" style={{ display: 'contents' }}>
      {children}
    </div>
  );
}
