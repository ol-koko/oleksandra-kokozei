'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useMediaQuery } from '@/features/motion/useMediaQuery';

/** Devices with real hover; everything else (touch) gets autoplay instead. */
const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/** Share of the shelf that must be in view before its centered item plays. */
const VISIBLE_RATIO = 0.66;

/** Pause before the centered item plays once the shelf is in view. */
const START_DELAY_TOKEN = '--motion-duration-slower';

/** Attribute that carries an item's id, on each item of the scroller. */
const SHELF_ITEM_ATTRIBUTE = 'data-shelf-id';

/** A tap's choice, valid until the shelf's situation changes (`epoch`). */
type Choice = { id: string | null; epoch: number };

function startDelay(): number {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(START_DELAY_TOKEN)
    .trim();
  const amount = Number.parseFloat(value);
  if (Number.isNaN(amount)) return 0;
  return value.endsWith('ms') ? amount : amount * 1000;
}

/**
 * Which item of a shelf is open (record out and spinning, book open). At most
 * one at a time.
 *
 * A tap or click toggles an item, and opening one closes the previous one.
 * On touch devices (no fine pointer) and without reduced motion, the item
 * centered in the scroll-snap row also opens by itself, once the shelf is
 * about two thirds in view and a short pause has passed. Swiping or the
 * arrows close it as the next item takes the center, and that one plays;
 * scrolling the shelf out of view closes it. A tap holds until one of those
 * changes happens.
 *
 * Both signals come from IntersectionObservers: the shelf root against the
 * viewport, and each item against a thin line down the middle of the
 * scroller (items carry `data-shelf-id`).
 */
export function useShelfAutoplay(
  rootRef: RefObject<HTMLElement | null>,
  scrollerRef: RefObject<HTMLElement | null>,
) {
  const finePointer = useMediaQuery(FINE_POINTER);
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const autoplay = !finePointer && !reducedMotion;
  const autoplayRef = useRef(autoplay);

  /** The shelf is in view and the start pause has passed. */
  const [ready, setReady] = useState(false);
  const [centeredId, setCenteredId] = useState<string | null>(null);
  /** Bumped whenever a tap's choice should expire. */
  const [epoch, setEpoch] = useState(0);
  const [choice, setChoice] = useState<Choice | null>(null);

  useEffect(() => {
    autoplayRef.current = autoplay;
  }, [autoplay]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let timer = 0;
    let isReady = false;
    const bump = () => setEpoch((value) => value + 1);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // Observers report the ratio right at the threshold, which can land a hair below it.
        const visible = entry.isIntersecting && entry.intersectionRatio >= VISIBLE_RATIO - 0.01;
        window.clearTimeout(timer);
        if (visible) {
          if (isReady) return;
          timer = window.setTimeout(() => {
            isReady = true;
            setReady(true);
            if (autoplayRef.current) bump();
          }, startDelay());
          return;
        }
        if (isReady) {
          isReady = false;
          setReady(false);
        }
        // Fully out of view: close whatever is open, the spin stops with it.
        if (!entry.isIntersecting) bump();
      },
      { threshold: [0, VISIBLE_RATIO] },
    );
    observer.observe(root);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [rootRef]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let current: string | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute(SHELF_ITEM_ATTRIBUTE);
          if (!entry.isIntersecting || id === null || id === current) continue;
          current = id;
          setCenteredId(id);
          setEpoch((value) => value + 1);
        }
      },
      // A thin vertical line down the middle of the scroller.
      { root: scroller, rootMargin: '0px -49% 0px -49%' },
    );
    scroller
      .querySelectorAll(`[${SHELF_ITEM_ATTRIBUTE}]`)
      .forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [scrollerRef]);

  const autoId = autoplay && ready ? centeredId : null;
  const openId = choice !== null && choice.epoch === epoch ? choice.id : autoId;

  const toggle = useCallback(
    (id: string) => setChoice({ id: openId === id ? null : id, epoch }),
    [openId, epoch],
  );

  return { openId, toggle };
}
