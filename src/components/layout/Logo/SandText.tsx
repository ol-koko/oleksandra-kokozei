'use client';

import { useMemo, useRef } from 'react';
import { useMediaQuery } from '@/features/motion/useMediaQuery';
import { useSandParticles, type SandMode } from '@/features/sand-particles/useSandParticles';
import styles from './SandText.module.css';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export type SandPlacement = 'header' | 'footer';

type SandTextProps = {
  text: string;
  placement: SandPlacement;
};

/** Header: hover devices only. Footer: also autoplays, and plays once in view on touch. */
function sandMode(placement: SandPlacement, finePointer: boolean): SandMode | null {
  if (placement === 'header') return finePointer ? 'pointer' : null;
  return finePointer ? 'pointer-autoplay' : 'in-view';
}

/**
 * Text that can turn into sand (see features/sand-particles). The real text
 * stays in the DOM; the canvas is decorative, sits over it and ignores the
 * pointer, so the size, position and link behavior never change.
 */
export function SandText({ text, placement }: SandTextProps) {
  const host = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const refs = useMemo(() => ({ host, label, canvas }), []);

  const finePointer = useMediaQuery(FINE_POINTER);
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const mode = reducedMotion ? null : sandMode(placement, finePointer);

  useSandParticles(refs, mode, text);

  return (
    <span ref={host} className={styles.host}>
      <span ref={label} className={styles.label}>
        {text}
      </span>
      {mode && <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />}
    </span>
  );
}
