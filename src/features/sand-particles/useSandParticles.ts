'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { SandParticles } from './sandParticles';

/**
 * How the effect is triggered on this device.
 * - `pointer` (hover devices): hover and keyboard focus.
 * - `pointer-autoplay`: the same, plus a sweep every 10 seconds.
 * - `in-view` (touch): one sweep the first time the text is fully in view.
 */
export type SandMode = 'pointer' | 'pointer-autoplay' | 'in-view';

/** Pause between autoplay sweeps, restarted after every play and hover. */
const AUTOPLAY_DELAY_MS = 10_000;

/** Share of the text that counts as fully in view. */
const FULLY_VISIBLE = 0.99;

type SandRefs = {
  host: RefObject<HTMLElement | null>;
  label: RefObject<HTMLElement | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
};

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

    const target = host.closest('a') ?? host;
    const pointer = mode !== 'in-view';
    let timer = 0;
    let fullyVisible = false;
    let hovering = false;

    const scheduleAutoplay = () => {
      window.clearTimeout(timer);
      if (mode !== 'pointer-autoplay' || !fullyVisible || hovering) return;
      if (document.visibilityState !== 'visible') return;
      timer = window.setTimeout(() => engine.sweep(), AUTOPLAY_DELAY_MS);
    };

    const engine = new SandParticles(host, label, canvas, { onIdle: scheduleAutoplay });

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
    document.addEventListener('visibilitychange', onVisibilityChange);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!entry.isIntersecting) engine.stop();
        // Observers report the ratio right at the threshold, which can land a hair below it.
        fullyVisible = entry.isIntersecting && entry.intersectionRatio >= FULLY_VISIBLE - 0.01;
        if (mode === 'in-view') {
          if (fullyVisible && !playedInView.current) {
            playedInView.current = true;
            engine.sweep();
          }
          return;
        }
        scheduleAutoplay();
      },
      { threshold: [0, FULLY_VISIBLE] },
    );
    visibility.observe(host);

    const resize = new ResizeObserver(() => engine.invalidate());
    resize.observe(host);

    return () => {
      window.clearTimeout(timer);
      if (pointer) {
        target.removeEventListener('pointerenter', onPointerEnter);
        target.removeEventListener('pointermove', onPointerMove);
        target.removeEventListener('pointerleave', onPointerLeave);
        target.removeEventListener('focus', onFocus);
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
      visibility.disconnect();
      resize.disconnect();
      engine.destroy();
    };
  }, [refs, mode, text]);
}
