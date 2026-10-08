import type { ShelfBook } from './types';

/**
 * "Books" in overlay-me, left to right as in Figma (84:122). Back colors are
 * each cover's dominant color (sharp `stats().dominant`); override by hand.
 */
export const books = [
  {
    id: 'goodNightMrHolmes',
    cover: { src: '/media/covers/good-night-mr-holmes.webp', width: 300, height: 481 },
    backColor: '#080818',
  },
  {
    id: 'likeSwitch',
    cover: { src: '/media/covers/the-like-switch.webp', width: 300, height: 448 },
    backColor: '#b81828',
  },
  {
    id: 'designOfEverydayThings',
    cover: { src: '/media/covers/the-design-of-everyday-things.webp', width: 300, height: 451 },
    backColor: '#f8d838',
  },
] as const satisfies readonly ShelfBook[];
