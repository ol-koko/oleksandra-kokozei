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

/**
 * Where a looping animation is: `playing` (the animation runs), `holding` (its
 * end state stays), `fading` (the specimen fades out) and `resting` (invisible,
 * a pause before the next round).
 */
export type LoopPhase = 'playing' | 'holding' | 'fading' | 'resting';

/** How long the end state stays, how long the fade takes (--duration-300) and the pause after it. */
const HOLD_MS = 900;
const FADE_MS = 300;
const REST_MS = 500;

/**
 * Loops the finite CSS animations under `ref` smoothly: they play, the end
 * state is held, the specimen fades out, rests for a moment and then plays
 * again from the start while it fades back in. It never jumps from the end
 * state to the start. `round` is the React key that restarts the animations.
 * An infinite animation (the shimmer) is left alone. Not running (off screen,
 * hidden tab, reduced motion): it stays on `playing`, the animation's own
 * end state.
 */
export function useAnimationLoop(ref: RefObject<HTMLElement | null>, running: boolean) {
  const [state, setState] = useState<{ round: number; phase: LoopPhase }>({
    round: 0,
    phase: 'playing',
  });

  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, ms)));

    const finite = (ref.current?.getAnimations({ subtree: true }) ?? []).filter((animation) =>
      Number.isFinite(animation.effect?.getComputedTiming().endTime),
    );
    // Nothing to wait for (an infinite animation, or none): the specimen is not looped.
    if (finite.length === 0) return;

    const next = (phase: LoopPhase) => setState((current) => ({ ...current, phase }));

    void (async () => {
      await Promise.all(finite.map((animation) => animation.finished)).catch(() => undefined);
      if (cancelled) return;
      next('holding');
      await wait(HOLD_MS);
      if (cancelled) return;
      next('fading');
      await wait(FADE_MS);
      if (cancelled) return;
      next('resting');
      await wait(REST_MS);
      if (cancelled) return;
      setState((current) => ({ round: current.round + 1, phase: 'playing' }));
    })();

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [ref, running, state.round]);

  return { round: state.round, phase: running ? state.phase : ('playing' as const) };
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
