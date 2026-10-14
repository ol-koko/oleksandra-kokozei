'use client';

import { useEffect, type RefObject } from 'react';
import { SandParticles } from './sandParticles';

/** How the effect is triggered on this device. */
export type SandMode = 'pointer';

type SandRefs = {
  host: RefObject<HTMLElement | null>;
  label: RefObject<HTMLElement | null>;
  canvas: RefObject<HTMLCanvasElement | null>;
};

/**
 * Runs the sand effect on a label inside a link.
 *
 * `pointer` (hover devices): plays while the mouse is over the link and as a
 * sweep on keyboard focus. `null` disables it.
 *
 * The effect stops at once when the text leaves the screen or the tab is
 * hidden, and resamples lazily after the text resizes.
 */
export function useSandParticles(refs: SandRefs, mode: SandMode | null, text: string) {
  useEffect(() => {
    const host = refs.host.current;
    const label = refs.label.current;
    const canvas = refs.canvas.current;
    if (!mode || !host || !label || !canvas) return;

    const target = host.closest('a') ?? host;
    const engine = new SandParticles(host, label, canvas);

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      engine.pointerMove(event.clientX, event.clientY);
    };
    const onPointerLeave = () => engine.pointerLeave();
    const onFocus = () => {
      if (target.matches(':focus-visible')) engine.sweep();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') engine.stop();
    };

    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerleave', onPointerLeave);
    target.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry && !entry.isIntersecting) engine.stop();
    });
    visibility.observe(host);

    const resize = new ResizeObserver(() => engine.invalidate());
    resize.observe(host);

    return () => {
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerleave', onPointerLeave);
      target.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      visibility.disconnect();
      resize.disconnect();
      engine.destroy();
    };
  }, [refs, mode, text]);
}
