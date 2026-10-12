'use client';

import type { CSSProperties } from 'react';
import type { Album } from '@/content/types';
import { useAlbumFlip } from '@/features/album/useAlbumFlip';
import { useAlbumInput } from '@/features/album/useAlbumInput';
import { AlbumPhoto, AlbumPockets } from './AlbumPockets';
import type { AlbumLabels } from './PolaroidAlbum';
import styles from './PolaroidAlbumSpread.module.css';

type PolaroidAlbumSpreadProps = {
  album: Album;
  labels: AlbumLabels;
  className?: string;
};

/** The template's page turn (1.1s) plus a little, as in its script. */
const TURN_MS = 1150;

/** Rendered photo width inside a pocket (138 minus the 10 px frame on each side). */
const PHOTO_SIZES = '118px';

/**
 * The album as a two-page spread (template:
 * reference/claude-design/polaroid-album-desktop.html). Closed, the cover
 * sits in the middle; a click on the right half turns forward, on the left
 * half back. Each leaf holds two pages: the right page, and on its back the
 * left page of the next spread.
 */
export function PolaroidAlbumSpread({ album, labels, className }: PolaroidAlbumSpreadProps) {
  const leaves = Array.from({ length: Math.ceil(album.pages.length / 2) }, (_, index) => ({
    front: album.pages[index * 2],
    back: album.pages[index * 2 + 1],
  }));
  // The cover is leaf 0; every leaf can be turned, which leaves the back cover.
  const leafCount = leaves.length + 1;
  const { flipped, canNext, canPrevious, next, previous, leaf } = useAlbumFlip({
    leafCount,
    maxFlipped: leafCount,
    turnMs: TURN_MS,
  });
  const input = useAlbumInput(next, previous);

  const leafProps = (index: number, extra = '') => {
    const state = leaf(index);
    return {
      className: [
        styles.leaf,
        extra,
        state.flipped && styles.flipped,
        state.top && styles.top,
        state.last && styles.last,
      ]
        .filter(Boolean)
        .join(' '),
      style: { zIndex: state.zIndex } as CSSProperties,
    };
  };

  const pockets = {
    classes: {
      grid: styles.grid,
      slot: styles.slot,
      photo: styles.photo,
      placeholder: styles.placeholder,
    },
    sizes: PHOTO_SIZES,
    photoAlt: labels.photoAlt,
  };

  return (
    <div
      role="group"
      aria-label={labels.group}
      className={[styles.wrap, className].filter(Boolean).join(' ')}
      {...input}
    >
      <div className={`${styles.album} ${flipped > 0 ? styles.open : ''}`}>
        <div className={styles.stage}>
          <div className={styles.board}>
            <div className={styles.backcover} />

            <div {...leafProps(0, styles.leafCover)}>
              <div className={styles.cover}>
                <div className={styles.window}>
                  <div className={styles.sleeve}>
                    <AlbumPhoto slot={album.cover} {...pockets} />
                  </div>
                </div>
              </div>
              <div className={`${styles.cover} ${styles.coverInside}`} />
            </div>

            {leaves.map((pages, index) => (
              <div key={index} {...leafProps(index + 1)}>
                <div className={`${styles.face} ${styles.faceFront}`}>
                  <AlbumPockets page={pages.front} {...pockets} />
                </div>
                <div className={`${styles.face} ${styles.faceBack}`}>
                  <AlbumPockets page={pages.back} {...pockets} />
                </div>
              </div>
            ))}

            <button
              type="button"
              className={`${styles.zone} ${styles.zonePrevious}`}
              aria-label={flipped === 1 ? labels.close : labels.previous}
              aria-disabled={!canPrevious}
              onClick={previous}
            />
            <button
              type="button"
              className={`${styles.zone} ${styles.zoneNext}`}
              aria-label={flipped === 0 ? labels.open : labels.next}
              aria-disabled={!canNext}
              onClick={next}
            />
          </div>
        </div>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {labels.pageStatus(flipped + 1, leafCount + 1)}
      </p>
    </div>
  );
}
