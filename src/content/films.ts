import type { ShelfFilm } from './types';

/** "Films" in overlay-me, left to right as in Figma (417:773). Posters are 2:3. */
export const films = [
  {
    id: 'focus',
    cover: { src: '/media/covers/focus.webp', width: 300, height: 450 },
    year: 2015,
  },
  {
    id: 'nowYouSeeMe',
    cover: { src: '/media/covers/now-you-see-me.webp', width: 300, height: 450 },
    year: 2013,
  },
  {
    id: 'theGentlemen',
    cover: { src: '/media/covers/the-gentlemen.webp', width: 300, height: 450 },
    year: 2019,
  },
] as const satisfies readonly ShelfFilm[];
