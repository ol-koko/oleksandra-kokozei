import type { Album, AlbumPhotoId } from '@/content/types';
import { PolaroidAlbumBook } from './PolaroidAlbumBook';
import { PolaroidAlbumSpread } from './PolaroidAlbumSpread';
import styles from './PolaroidAlbum.module.css';

/** Accessible names and announcements, from messages. */
export type AlbumLabels = {
  /** Names the album as a group of controls. */
  group: string;
  open: string;
  close: string;
  previous: string;
  next: string;
  /** "Page 2 of 5": the cover is page 1. */
  pageStatus: (current: number, total: number) => string;
  photoAlt: (id: AlbumPhotoId) => string;
};

type PolaroidAlbumProps = {
  album: Album;
  labels: AlbumLabels;
};

/**
 * A Polaroid photo album that turns its pages like a real one. From 1024 it
 * is the two-page spread (polaroid-album-desktop.html); below, one page at a
 * time (polariod-album-mobile.html). Both are rendered and CSS shows one, so
 * nothing jumps on hydration; the hidden one loads no images and stays silent.
 */
export function PolaroidAlbum({ album, labels }: PolaroidAlbumProps) {
  return (
    <>
      <PolaroidAlbumSpread album={album} labels={labels} className={styles.spread} />
      <PolaroidAlbumBook album={album} labels={labels} className={styles.book} />
    </>
  );
}
