'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@/features/motion/useMediaQuery';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

type AlbumFlipOptions = {
  /** Leaves, the cover included (it is leaf 0). */
  leafCount: number;
  /** How many leaves can lie turned: all of them, or all but the last page. */
  maxFlipped: number;
  /** The page turn's duration; the turning leaf stays on top until it has landed. */
  turnMs: number;
};

export type AlbumLeafState = {
  flipped: boolean;
  /** Stacking order: turned leaves pile up on the left, the rest on the right. */
  zIndex: number;
  /** The leaf currently turning over. */
  turning: boolean;
  /** The topmost leaf on the right, at rest (lifts on hover). */
  top: boolean;
  /** The topmost leaf on the left, at rest. */
  last: boolean;
};

/**
 * Page turning for the Polaroid album templates (both run the same script):
 * how many leaves lie turned, which one is turning, and each leaf's stacking
 * and state. With reduced motion a turn lands at once.
 */
export function useAlbumFlip({ leafCount, maxFlipped, turnMs }: AlbumFlipOptions) {
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const [flipped, setFlipped] = useState(0);
  const [turning, setTurning] = useState(-1);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const turn = useCallback(
    (to: number, index: number) => {
      window.clearTimeout(timer.current);
      setFlipped(to);
      setTurning(index);
      timer.current = window.setTimeout(() => setTurning(-1), reducedMotion ? 0 : turnMs);
    },
    [reducedMotion, turnMs],
  );

  const canNext = flipped < maxFlipped;
  const canPrevious = flipped > 0;

  const next = useCallback(() => {
    if (canNext) turn(flipped + 1, flipped);
  }, [canNext, flipped, turn]);

  const previous = useCallback(() => {
    if (canPrevious) turn(flipped - 1, flipped - 1);
  }, [canPrevious, flipped, turn]);

  const leaf = (index: number): AlbumLeafState => {
    const isFlipped = index < flipped;
    const isTurning = index === turning;
    const atRest = turning < 0;
    return {
      flipped: isFlipped,
      zIndex: isTurning ? 100 : isFlipped ? index + 1 : leafCount - index,
      turning: isTurning,
      top: atRest && index === flipped,
      last: atRest && index === flipped - 1,
    };
  };

  return { flipped, canNext, canPrevious, next, previous, leaf };
}
