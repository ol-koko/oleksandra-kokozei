import type { Album } from './types';

/** Placeholder frame until the real photo is added. */
const ph = { placeholder: true } as const;

/**
 * "Album" in overlay-me (428:349, 428:408), a Polaroid photo album. The
 * photos are not ready yet: every pocket is a placeholder frame, laid out
 * like the templates (`null` is an empty pocket). To add a photo, put the
 * file in `public/media/me/album/`, add its alt text to
 * `Overlay.me.sections.album.photos.<id>` (en, uk, de), and replace the
 * placeholder with `{ photo: '<id>', image: { src, width, height } }`.
 * Set `published` to true to show the section in production.
 */
export const album = {
  published: false,
  cover: ph,
  pages: [
    [ph, ph, ph, ph],
    [ph, ph, ph, null],
    [ph, null, ph, ph],
    [ph, ph, null, null],
  ],
} as const satisfies Album;

/** Development and Vercel previews always show the album; production once it is published. */
export const albumVisible = album.published || process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production';
