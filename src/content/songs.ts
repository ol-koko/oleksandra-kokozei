import type { ShelfItem, SongId } from './types';

/** "Fav songs" in overlay-me, left to right as in Figma (130:10). Covers are square. */
export const songs = [
  { id: 'wickedGame', cover: { src: '/media/covers/wicked-game.webp', width: 372, height: 372 } },
  { id: 'raindance', cover: { src: '/media/covers/raindance.webp', width: 372, height: 372 } },
  { id: 'trance', cover: { src: '/media/covers/trance.webp', width: 372, height: 372 } },
] as const satisfies readonly ShelfItem<SongId>[];
