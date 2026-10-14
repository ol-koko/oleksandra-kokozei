'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownIcon } from '@/components/icons/ArrowDownIcon';
import { LockIcon } from '@/components/icons/LockIcon';
import { isPointerClick, moveFocus } from '@/features/focus/moveFocus';
import { scrollBehavior } from '@/features/motion/scrollBehavior';
import { scrollToSection } from '@/features/overlay/sectionScrollTop';
import styles from './PrivateNote.module.css';

type PrivateNoteProps = {
  /** Id of the project overview the card leads to. */
  targetId: string;
};

/**
 * "Private project overview" card (Figma 484:753). A button that glides the
 * overlay down to the overview and moves focus there. Its arrow bobs a few
 * times when the card first comes into view, and again on hover or keyboard
 * focus; never in a loop, and not at all with reduced motion.
 */
export function PrivateNote({ targetId }: PrivateNoteProps) {
  const t = useTranslations('Overlay.work.privateNote');
  const ref = useRef<HTMLButtonElement>(null);
  const [nudging, setNudging] = useState(false);

  useEffect(() => {
    const button = ref.current;
    if (!button) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setNudging(true);
      observer.disconnect();
    });
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className={styles.note}
      onClick={(event) => {
        const target = document.getElementById(targetId);
        if (!target) return;
        void scrollToSection(target, scrollBehavior());
        moveFocus(target, { fromPointer: isPointerClick(event), preventScroll: true });
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setNudging(true);
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(':focus-visible')) setNudging(true);
      }}
    >
      <LockIcon className={styles.lock} />
      <span className={styles.text}>
        <span className="text-title-s">{t('title')}</span>
        <span className={`${styles.hint} text-body-s`}>{t('text')}</span>
      </span>
      <ArrowDownIcon
        className={`${styles.arrow} ${nudging ? 'animate-nudge' : ''}`}
        onAnimationEnd={() => setNudging(false)}
      />
    </button>
  );
}
