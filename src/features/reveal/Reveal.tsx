'use client';

import { useRef, type ReactNode } from 'react';
import { useReveal } from './useReveal';

type RevealProps = {
  children: ReactNode;
};

/** Fades and lifts its content in once, when it scrolls into view. */
export function Reveal({ children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);

  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}
