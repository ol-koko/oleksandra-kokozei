'use client';

import { useRef, useState, type ReactNode } from 'react';
import { ComponentCard } from '@/components/design-system/ComponentCard/ComponentCard';
import { SandText } from '@/components/layout/Logo/SandText';
import { Book } from '@/components/media/Book/Book';
import { MediaSkeleton } from '@/components/media/MediaSkeleton/MediaSkeleton';
import { VhsTape } from '@/components/media/VhsTape/VhsTape';
import { VinylRecord } from '@/components/media/VinylRecord/VinylRecord';
import { useMediaQuery } from '@/features/motion/useMediaQuery';
import type { MaterialId } from '@/content/designSystem';
import { books } from '@/content/books';
import { films } from '@/content/films';
import { songs } from '@/content/songs';
import { useOpenCycle, useSpecimenRunning, useTicker } from '@/features/design-system/useSpecimenRunning';
import { Signature } from '@/features/signature/Signature';
import styles from './MaterialSpecimen.module.css';

/** Touch: how long a media item stays open (slide, hold) and closed, in a loop. */
const OPEN_MS = 3200;
const CLOSED_MS = 1800;

/** Devices that really hover open the media on hover; the others loop it. */
const HOVER = '(hover: hover) and (pointer: fine)';

/** The signature is drawn again this often while it is on screen. */
const SIGNATURE_LOOP_MS = 5000;

type MaterialSpecimenProps = {
  id: MaterialId;
  title: string;
  caption: string;
};

/** Media tiles (Figma 796:1110) are 240 high; the rest 200. */
const mediaIds: readonly MaterialId[] = ['music', 'book', 'film'];

/** Tiles drawn without the hairline border (Figma: gradient, shimmer, signature, fades, scrim). */
const plainIds: readonly MaterialId[] = [
  'gradient',
  'shimmer',
  'signature',
  'edge-fades',
  'modal-scrim',
];

/** A shelf item, shown 90 % of its size and centered in the tile. */
function MediaItem({ kind, children }: { kind: 'record' | 'poster' | 'film'; children: ReactNode }) {
  // A film is a poster that is shifted so its open state is centered.
  const classes = kind === 'film' ? `${styles.poster} ${styles.film}` : styles[kind];
  return <div className={`${styles.media} ${classes}`}>{children}</div>;
}

/**
 * One material of the Materials section. Media show without cover art, in the
 * neutral placeholder color, and open on hover as on the site; shimmer,
 * signature and sand particles loop while on screen.
 */
export function MaterialSpecimen({ id, title, caption }: MaterialSpecimenProps) {
  const stage = useRef<HTMLDivElement>(null);
  const running = useSpecimenRunning(stage);
  const signatureRound = useTicker(running, SIGNATURE_LOOP_MS);
  const [tapped, setTapped] = useState(false);
  const canHover = useMediaQuery(HOVER);
  const autoOpen = useOpenCycle(running && !canHover && mediaIds.includes(id), OPEN_MS, CLOSED_MS);
  // A tap keeps the item open, as a press does on the site; the loop opens it by itself.
  const pressed = tapped || autoOpen;

  const specimen = (() => {
    switch (id) {
      case 'music':
        return (
          <MediaItem kind="record">
            <VinylRecord
              cover={songs[0].cover}
              href={songs[0].spotifyUrl}
              label="Vinyl record, plays on hover (opens Spotify in a new tab)"
              open={autoOpen}
            />
          </MediaItem>
        );
      case 'book':
        return (
          <MediaItem kind="poster">
            <Book
              cover={books[0].cover}
              alt="Book cover"
              backColor={books[0].backColor}
              pressed={pressed}
              onToggle={() => setTapped((value) => !value)}
            />
          </MediaItem>
        );
      case 'film':
        return (
          <MediaItem kind="film">
            <VhsTape
              poster={films[0].cover}
              alt="Film poster"
              pressed={pressed}
              onToggle={() => setTapped((value) => !value)}
            />
          </MediaItem>
        );
      case 'gradient':
        return <div className={styles.gradient} />;
      case 'shimmer':
        return (
          <div className={styles.shimmer}>
            <MediaSkeleton ready={false} />
          </div>
        );
      case 'signature':
        return (
          <div className={styles.signature}>
            <Signature key={signatureRound} animated={running} />
          </div>
        );
      case 'edge-fades':
        return (
          <div className={styles.fades} aria-hidden="true" />
        );
      case 'modal-scrim':
        return (
          <div className={styles.scrimStage} aria-hidden="true">
            <span className={styles.scrim} />
            <span className={styles.modal} />
          </div>
        );
      case 'sand-particles':
        return (
          <span className="text-title-s">
            <SandText text="Oleksandra Kokozei" placement="footer" />
          </span>
        );
      case 'component':
        return (
          <ComponentCard label="menu toggle" legend>
            {null}
          </ComponentCard>
        );
    }
  })();

  return (
    <figure className={styles.card}>
      <div
        ref={stage}
        className={`${styles.preview} ${mediaIds.includes(id) ? styles.tall : ''} ${plainIds.includes(id) ? styles.plain : ''}`}
        data-paused={running ? undefined : ''}
      >
        {specimen}
      </div>
      <figcaption className={styles.caption}>
        <span className="text-body-xs">{title}</span>
        <span className={`${styles.note} text-body-xs`}>{caption}</span>
      </figcaption>
    </figure>
  );
}
