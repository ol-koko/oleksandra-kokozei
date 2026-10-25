'use client';

import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';
import { useInView } from '@/features/media/useInView';
import { useMediaQuery } from '@/features/motion/useMediaQuery';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

/** Whether the tab is visible. `true` on the server. */
function useTabVisible() {
  return useSyncExternalStore(
    subscribeToVisibility,
    () => document.visibilityState === 'visible',
    () => true,
  );
}

/**
 * Whether a looping specimen should be running: it is on screen, the tab is
 * visible and the visitor has not asked for reduced motion. Loops and canvas
 * animations stop as soon as this turns false.
 */
export function useSpecimenRunning(ref: RefObject<HTMLElement | null>): boolean {
  const { inView } = useInView(ref);
  const tabVisible = useTabVisible();
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  return inView && tabVisible && !reducedMotion;
}

/** Pause after a finite animation ends, before the loop replays it. */
const HOLD_MS = 1000;

/**
 * Replays the finite CSS animations on `ref`'s element, over and over, while
 * `running`: it waits for them to end, holds for a moment and returns a new
 * round number, which the specimen uses as a React key to start them again.
 * An infinite animation never ends, so it is left alone.
 */
export function useAnimationRounds(ref: RefObject<HTMLElement | null>, running: boolean): number {
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!running) return;
    let timer = 0;
    let cancelled = false;
    const finite = (ref.current?.getAnimations({ subtree: true }) ?? []).filter((animation) =>
      Number.isFinite(animation.effect?.getComputedTiming().endTime),
    );
    // Nothing to wait for (an infinite animation, or none): the specimen is not replayed.
    if (finite.length === 0) return;
    Promise.all(finite.map((animation) => animation.finished))
      .then(() => {
        if (!cancelled) timer = window.setTimeout(() => setRound((value) => value + 1), HOLD_MS);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [ref, running, round]);

  return round;
}

/**
 * A counter that ticks every `period` ms while `running`, for specimens that
 * are not CSS animations (a swap between two states, the signature).
 */
export function useTicker(running: boolean, period: number): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTick((value) => value + 1), period);
    return () => window.clearInterval(id);
  }, [running, period]);

  return tick;
}
