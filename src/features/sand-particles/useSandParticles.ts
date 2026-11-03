'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { onRevealed } from '@/features/reveal/onRevealed';
import { SandParticles } from './sandParticles';

/**
 * How the effect is triggered on this device.
 * - `pointer` (hover devices): hover and keyboard focus.
 * - `pointer-autoplay`: the same, plus a sweep every 10 seconds.
 * - `in-view` (touch): one sweep the first time the text is fully in view.
 * - `in-view-tap` (touch): `in-view`, and a tap on the text plays the sweep again, like a hover.
 * - `autoplay`: no pointer or focus trigger; one sweep the first time the text is fully in
 *   view, then one every 10 seconds while it is (the design system page title).
 */
export type SandMode = 'pointer' | 'pointer-autoplay' | 'in-view' | 'in-view-tap' | 'autoplay';

/** Pause between autoplay sweeps, restarted after every play and hover. */
const AUTOPLAY_DELAY_MS = 10_000;

/** Share of the text that counts as fully in view. */
const FULLY_VISIBLE = 0.99;

type SandRefs = {
  host: RefObject<HTMLElement | null>;
  label: RefObject<HTMLElement | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
};

/** Starts the effect on a label and returns its cleanup. `playedInView` is shared across restarts. */
function startSand(
  { host, label, canvas }: { host: HTMLElement; label: HTMLElement; canvas: HTMLCanvasElement },
  mode: SandMode,
  playedInView: { current: boolean },
) {
  const target = host.closest('a') ?? host;
  const pointer = mode === 'pointer' || mode === 'pointer-autoplay';
  const tap = mode === 'in-view-tap';
  let timer = 0;
  let fullyVisible = false;
  let hovering = false;

  const scheduleAutoplay = () => {
    window.clearTimeout(timer);
    if ((mode !== 'pointer-autoplay' && mode !== 'autoplay') || !fullyVisible || hovering) return;
    if (document.visibilityState !== 'visible') return;
    timer = window.setTimeout(() => engine.sweep(), AUTOPLAY_DELAY_MS);
  };

  /** A play has ended by itself at least once: the autoplay chain (idle, then the timer) is running. */
  let completed = false;
  const engine = new SandParticles(host, label, canvas, {
    onIdle: () => {
      completed = true;
      scheduleAutoplay();
    },
  });

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    hovering = true;
    window.clearTimeout(timer);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    engine.pointerMove(event.clientX, event.clientY);
  };
  const onPointerLeave = () => {
    hovering = false;
    engine.pointerLeave();
    scheduleAutoplay();
  };
  const onFocus = () => {
    if (!target.matches(':focus-visible')) return;
    window.clearTimeout(timer);
    engine.sweep();
  };
  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      window.clearTimeout(timer);
      engine.stop();
    } else {
      scheduleAutoplay();
    }
  };

  if (pointer) {
    target.addEventListener('pointerenter', onPointerEnter);
    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerleave', onPointerLeave);
    target.addEventListener('focus', onFocus);
  }
  const onTap = (event: PointerEvent) => {
    if (event.pointerType === 'touch') engine.sweep();
  };
  if (tap) target.addEventListener('pointerdown', onTap);
  document.addEventListener('visibilitychange', onVisibilityChange);

  const visibility = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      if (!entry.isIntersecting) engine.stop();
      // Observers report the ratio right at the threshold, which can land a hair below it.
      fullyVisible = entry.isIntersecting && entry.intersectionRatio >= FULLY_VISIBLE - 0.01;
      if (mode === 'in-view' || mode === 'in-view-tap' || mode === 'autoplay') {
        if (fullyVisible && !playedInView.current) {
          playedInView.current = true;
          engine.sweep();
          return;
        }
        if (mode === 'in-view' || mode === 'in-view-tap') return;
      }
      scheduleAutoplay();
    },
    { threshold: [0, FULLY_VISIBLE] },
  );
  visibility.observe(host);

  // A resize stops a play in progress without an idle callback, which would end the autoplay
  // chain: start the opening sweep again, or the timer again.
  const resize = new ResizeObserver(() => {
    engine.invalidate();
    if (mode === 'autoplay' && !completed && fullyVisible) engine.sweep();
    else scheduleAutoplay();
  });
  resize.observe(host);

  return () => {
    window.clearTimeout(timer);
    if (pointer) {
      target.removeEventListener('pointerenter', onPointerEnter);
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerleave', onPointerLeave);
      target.removeEventListener('focus', onFocus);
    }
    target.removeEventListener('pointerdown', onTap);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    visibility.disconnect();
    resize.disconnect();
    engine.destroy();
  };
}

/**
 * Runs the sand effect on a label inside a link (`null` disables it).
 *
 * Visibility comes from an IntersectionObserver on the text itself. The
 * autoplay timer only runs while the text is fully in view, the tab is
 * visible and the pointer is not over the link; it restarts from zero after
 * each play and each hover. The effect stops at once when the text leaves the
 * screen or the tab is hidden, and resamples lazily after the text resizes.
 */
export function useSandParticles(refs: SandRefs, mode: SandMode | null, text: string) {
  /** The in-view sweep plays once per page view. */
  const playedInView = useRef(false);

  useEffect(() => {
    const host = refs.host.current;
    const label = refs.label.current;
    const canvas = refs.canvas.current;
    if (!mode || !host || !label || !canvas) return;

    // On the design system page the effect starts once its section has appeared.
    let teardown: (() => void) | undefined;
    const cancelWait = onRevealed(host, () => {
      teardown = startSand({ host, label, canvas }, mode, playedInView);
    });
    return () => {
      cancelWait();
      teardown?.();
    };
  }, [refs, mode, text]);
}
