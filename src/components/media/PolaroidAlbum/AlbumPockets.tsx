import Image from 'next/image';
import type { AlbumPhotoId, AlbumSlot } from '@/content/types';

/** Class names of one template's pocket grid; each layout styles its own. */
export type AlbumPocketClasses = Record<
  'grid' | 'slot' | 'photo' | 'placeholder',
  string | undefined
>;

type AlbumPhotoProps = {
  slot: Exclude<AlbumSlot, null>;
  classes: Pick<AlbumPocketClasses, 'photo' | 'placeholder'>;
  /** Rendered width of the photo, for `sizes`. */
  sizes: string;
  photoAlt: (id: AlbumPhotoId) => string;
};

/** An instant photo in its white frame, or a neutral frame while the photo is missing. */
export function AlbumPhoto({ slot, classes, sizes, photoAlt }: AlbumPhotoProps) {
  return (
    <figure className={classes.photo}>
      {'photo' in slot ? (
        <Image
          src={slot.image.src}
          alt={photoAlt(slot.photo)}
          width={slot.image.width}
          height={slot.image.height}
          sizes={sizes}
        />
      ) : (
        <span className={classes.placeholder} aria-hidden="true" />
      )}
    </figure>
  );
}

type AlbumPocketsProps = Omit<AlbumPhotoProps, 'slot' | 'classes'> & {
  /** Four pockets, or none for the blank back of the last leaf. */
  page?: readonly AlbumSlot[];
  classes: AlbumPocketClasses;
};

/** One album page: a 2 × 2 grid of pockets; an empty pocket stays visible. */
export function AlbumPockets({ page, classes, ...photo }: AlbumPocketsProps) {
  return (
    <div className={classes.grid}>
      {(page ?? [null, null, null, null]).map((slot, index) => (
        <div key={index} className={classes.slot}>
          {slot && <AlbumPhoto slot={slot} classes={classes} {...photo} />}
        </div>
      ))}
    </div>
  );
}
