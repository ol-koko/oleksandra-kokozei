'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import { LoadingImage } from '@/components/media/LoadingImage/LoadingImage';
import type { ImageAsset } from '@/content/types';
import { useInView } from '@/features/media/useInView';
import { useMediaQuery } from '@/features/motion/useMediaQuery';
import type { WandScene as Scene } from '@/features/wand-scene/wandScene';
import { cormorant } from '@/styles/fonts';
import styles from './WandScene.module.css';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';
/** The fallback serif is shown rather than holding the scene back on a slow font. */
const FONT_TIMEOUT_MS = 1500;
/** As on the site: a resize settles before the scene is fitted again. */
const RESIZE_DELAY_MS = 120;

function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

function fontsReady() {
  return Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, FONT_TIMEOUT_MS)),
  ]);
}

/**
 * Whether the element's own layer is the top one. IntersectionObserver does
 * not see modal dialogs, so a card under an open overlay still counts as in
 * view: this is what stops it.
 */
function useIsTopLayer(ref: RefObject<HTMLElement | null>) {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const dialogs = document.querySelectorAll('dialog[open]');
      setIsTop((dialogs[dialogs.length - 1] ?? null) === element.closest('dialog'));
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['open'],
      subtree: true,
    });
    return () => observer.disconnect();
  }, [ref]);

  return isTop;
}

type WandSceneProps = {
  /** First frame, shown with the shimmer until the live scene is ready, and alone with reduced motion. */
  still: ImageAsset;
  sizes: string;
  /** The cover is in view when the overlay opens, so its still loads at once. */
  eager?: boolean;
  /** Selector of the ancestor that tracks the cursor; the scene's own frame by default. */
  pointerRoot?: string;
};

/**
 * The Ollivanders street as a live depth scene that fills its positioned
 * parent: layers follow the cursor, snow falls in front of and behind them.
 * Decorative. The code loads when the scene nears the viewport and animates
 * only while it is on screen, in the top layer and the tab is visible.
 */
export function WandScene({ still, sizes, eager = false, pointerRoot }: WandSceneProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const { near, inView } = useInView(frameRef);
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const finePointer = useMediaQuery(FINE_POINTER);
  const isTop = useIsTopLayer(frameRef);
  const tabVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => false,
  );
  const [ready, setReady] = useState(false);
  const running = ready && inView && isTop && tabVisible;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !near || reducedMotion) return;
    let cancelled = false;
    let scene: Scene | null = null;

    void (async () => {
      const { mountWandScene } = await import('@/features/wand-scene/wandScene');
      if (cancelled) return;
      scene = mountWandScene(stage);
      await fontsReady();
      if (cancelled) return;
      scene.refit();
      sceneRef.current = scene;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      scene?.destroy();
      sceneRef.current = null;
      setReady(false);
    };
  }, [near, reducedMotion]);

  useEffect(() => {
    if (ready) sceneRef.current?.setDrift(!finePointer);
  }, [ready, finePointer]);

  useEffect(() => {
    if (!ready) return;
    const scene = sceneRef.current;
    if (running) scene?.start();
    else scene?.stop();
  }, [ready, running]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!ready || !frame) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => sceneRef.current?.resize(), RESIZE_DELAY_MS);
    });
    observer.observe(frame);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [ready]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!ready || !finePointer || !frame) return;
    // The card's stretched button sits above the cover, so the whole card listens.
    const area = (pointerRoot && frame.closest<HTMLElement>(pointerRoot)) || frame;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const box = frame.getBoundingClientRect();
      sceneRef.current?.setPointer(
        ((event.clientX - box.left) / box.width - 0.5) * 2,
        ((event.clientY - box.top) / box.height - 0.5) * 2,
      );
    };
    const onLeave = () => sceneRef.current?.clearPointer();
    area.addEventListener('pointermove', onMove, { passive: true });
    area.addEventListener('pointerleave', onLeave);
    return () => {
      area.removeEventListener('pointermove', onMove);
      area.removeEventListener('pointerleave', onLeave);
    };
  }, [ready, finePointer, pointerRoot]);

  return (
    <div ref={frameRef} className={styles.frame} aria-hidden="true">
      <LoadingImage image={still} alt="" sizes={sizes} eager={eager} unoptimized />
      <div
        ref={stageRef}
        className={`${styles.stage} ${cormorant.variable}`}
        data-ready={ready || undefined}
        data-paused={running ? undefined : ''}
      />
    </div>
  );
}
