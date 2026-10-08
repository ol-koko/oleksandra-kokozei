'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import { CaretRightIcon } from '@/components/icons/CaretRightIcon';
import { useShelfAutoplay } from '@/features/shelf/useShelfAutoplay';
import { useShelfScroll } from '@/features/shelf/useShelfScroll';
import styles from './Shelf.module.css';

/** Open state handed to an item's media (a toggle button). */
export type ShelfMediaState = {
  pressed: boolean;
  onToggle: () => void;
};

export type ShelfEntry = {
  id: string;
  title: string;
  /** Artist or author. */
  byline: string;
  renderMedia: (state: ShelfMediaState) => ReactNode;
};

type ShelfProps = {
  entries: readonly ShelfEntry[];
  previousLabel: string;
  nextLabel: string;
};

/**
 * A row of songs or books (overlay-me). Desktop (130:10, 84:122): the items
 * side by side. Mobile and tablet (322:249, 322:302): one item at a time in a
 * scroll-snap row between two arrow buttons; the arrows also show on desktop
 * whenever the row does not fit. At most one item is open; see
 * `useShelfAutoplay` for taps and the touch autoplay.
 */
export function Shelf({ entries, previousLabel, nextLabel }: ShelfProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const { openId, toggle } = useShelfAutoplay(rootRef, scrollerRef);
  const { atStart, atEnd, overflowing, scrollByItem } = useShelfScroll(scrollerRef);

  return (
    <div ref={rootRef} className={styles.root} data-overflowing={overflowing}>
      <ArrowButton
        label={previousLabel}
        className={styles.previous}
        disabled={atStart}
        onClick={() => scrollByItem(-1)}
      />

      <ul ref={scrollerRef} className={styles.row}>
        {entries.map((entry, index) => (
          <li
            key={entry.id}
            data-shelf-id={entry.id}
            className={`${styles.item} animate-shelf-item`}
            style={{ '--i': index } as CSSProperties}
          >
            {entry.renderMedia({
              pressed: openId === entry.id,
              onToggle: () => toggle(entry.id),
            })}
            <div className={styles.caption}>
              <p className={`${styles.title} text-title-s`}>{entry.title}</p>
              <p className={`${styles.byline} text-body-s`}>{entry.byline}</p>
            </div>
          </li>
        ))}
      </ul>

      <ArrowButton
        label={nextLabel}
        className={styles.next}
        disabled={atEnd}
        onClick={() => scrollByItem(1)}
      />
    </div>
  );
}

type ArrowButtonProps = {
  label: string;
  className?: string;
  disabled: boolean;
  onClick: () => void;
};

/**
 * Round arrow button (322:238). Disabled at the row's ends through
 * `aria-disabled`, so a focused arrow keeps focus when it reaches the end.
 */
function ArrowButton({ label, className, disabled, onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.arrow} ${className}`}
      aria-label={label}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      <CaretRightIcon />
    </button>
  );
}
