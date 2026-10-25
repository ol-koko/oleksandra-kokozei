'use client';

import { useRef, useState, type ReactNode } from 'react';
import { ComponentCard } from '@/components/design-system/ComponentCard/ComponentCard';
import { SandText } from '@/components/layout/Logo/SandText';
import { Book } from '@/components/media/Book/Book';
import { MediaSkeleton } from '@/components/media/MediaSkeleton/MediaSkeleton';
import { VhsTape } from '@/components/media/VhsTape/VhsTape';
import { VinylRecord } from '@/components/media/VinylRecord/VinylRecord';
import type { MaterialId } from '@/content/designSystem';
import { songs } from '@/content/songs';
import { useSpecimenRunning, useTicker } from '@/features/design-system/useSpecimenRunning';
import { Signature } from '@/features/signature/Signature';
import styles from './MaterialSpecimen.module.css';

/** The signature is drawn again this often while it is on screen. */
const SIGNATURE_LOOP_MS = 5000;

type MaterialSpecimenProps = {
  id: MaterialId;
  title: string;
  caption: string;
};

/** Media tiles (Figma 796:1110) are 240 high; the rest 200. */
const mediaIds: readonly MaterialId[] = ['music', 'book', 'film'];

function MediaItem({ children }: { children: ReactNode }) {
  return <div className={styles.media}>{children}</div>;
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
  const [pressed, setPressed] = useState(false);

  const specimen = (() => {
    switch (id) {
      case 'music':
        return (
          <MediaItem>
            <VinylRecord
              href={songs[0]?.spotifyUrl ?? 'https://open.spotify.com'}
              label="Vinyl record, plays on hover (opens Spotify in a new tab)"
              open={false}
            />
          </MediaItem>
        );
      case 'book':
        return (
          <MediaItem>
            <Book
              alt="Book"
              backColor="var(--gray-300)"
              pressed={pressed}
              onToggle={() => setPressed((value) => !value)}
            />
          </MediaItem>
        );
      case 'film':
        return (
          <MediaItem>
            <VhsTape
              alt="Film on VHS"
              pressed={pressed}
              onToggle={() => setPressed((value) => !value)}
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
          <div className={styles.fades} aria-hidden="true">
            {Array.from({ length: 6 }, (_, line) => (
              <span key={line} className={`${styles.line} text-body-s`}>
                Content that scrolls under a soft edge
              </span>
            ))}
          </div>
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
        className={`${styles.preview} ${mediaIds.includes(id) ? styles.tall : ''}`}
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
