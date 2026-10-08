import type { BookId, ShelfItem } from './types';

/** "Books" in overlay-me, left to right as in Figma (84:122). */
export const books = [
  {
    id: 'goodNightMrHolmes',
    cover: { src: '/media/covers/good-night-mr-holmes.webp', width: 300, height: 481 },
  },
  {
    id: 'likeSwitch',
    cover: { src: '/media/covers/the-like-switch.webp', width: 300, height: 448 },
  },
  {
    id: 'designOfEverydayThings',
    cover: { src: '/media/covers/the-design-of-everyday-things.webp', width: 300, height: 451 },
  },
] as const satisfies readonly ShelfItem<BookId>[];
