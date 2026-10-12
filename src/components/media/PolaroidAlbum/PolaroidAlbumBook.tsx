'use client';

import type { CSSProperties } from 'react';
import type { Album } from '@/content/types';
import { useAlbumFlip } from '@/features/album/useAlbumFlip';
import { useAlbumInput } from '@/features/album/useAlbumInput';
import { AlbumPhoto, AlbumPockets } from './AlbumPockets';
import type { AlbumLabels } from './PolaroidAlbum';
import styles from './PolaroidAlbumBook.module.css';

type PolaroidAlbumBookProps = {
  album: Album;
  labels: AlbumLabels;
  className?: string;
};

/** The template's page turn (1s) plus a little, as in its script. */
const TURN_MS = 1050;

/** How visible the open cover stays on the left. */
const COVER_OPACITY = 0.7;

/** How visible the last turned page stays on the left. */
const PAGE_OPACITY = 0.55;

/** Rendered photo width inside a pocket (106 minus the 8 px frame on each side). */
const PHOTO_SIZES = '90px';

/**
 * The album one page at a time (template:
 * reference/claude-design/polariod-album-mobile.html). A tap on the cover
 * opens it; a tap on the right part of the page turns forward, on the left
 * part (38 %) back. A turned page lies to the left of the album and fades,
 * the cover and the last page only partly; the last page stays on the right.
 */
export function PolaroidAlbumBook({ album, labels, className }: PolaroidAlbumBookProps) {
  // The cover is leaf 0, then one leaf per page.
  const leafCount = album.pages.length + 1;
  const { flipped, canNext, canPrevious, next, previous, leaf } = useAlbumFlip({
    leafCount,
    maxFlipped: leafCount - 1,
    turnMs: TURN_MS,
  });
  const input = useAlbumInput(next, previous);

  const leafProps = (index: number, extra = '') => {
    const state = leaf(index);
    let opacity = 1;
    if (state.flipped && !state.turning) {
      if (index === 0) opacity = COVER_OPACITY;
      else opacity = index === flipped - 1 ? PAGE_OPACITY : 0;
    }
    return {
      className: [styles.leaf, extra, state.flipped && styles.flipped, opacity < 1 && styles.ghost]
        .filter(Boolean)
        .join(' '),
      style: { zIndex: state.zIndex, '--op': opacity } as CSSProperties,
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
      <div className={`${styles.album} ${flipped === 0 ? styles.closed : ''}`}>
        <div className={styles.back} />

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

        {album.pages.map((page, index) => (
          <div key={index} {...leafProps(index + 1)}>
            <div className={styles.face}>
              <AlbumPockets page={page} {...pockets} />
            </div>
            <div className={`${styles.face} ${styles.faceBack}`} />
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

      <p className="visually-hidden" aria-live="polite">
        {labels.pageStatus(flipped + 1, leafCount)}
      </p>
    </div>
  );
}
