import type { ShelfSong } from './types';

/** "Fav songs" in overlay-me, left to right as in Figma (130:10). Covers are square. */
export const songs = [
  {
    id: 'wickedGame',
    cover: { src: '/media/covers/wicked-game.webp', width: 372, height: 372 },
    spotifyUrl: 'https://open.spotify.com/track/2y42xAsl6dfMeVXQgOYsUw',
  },
  {
    id: 'raindance',
    cover: { src: '/media/covers/raindance.webp', width: 372, height: 372 },
    spotifyUrl: 'https://open.spotify.com/track/3oTuTpF1F3A7rEC6RKsMRz',
  },
  {
    id: 'trance',
    cover: { src: '/media/covers/trance.webp', width: 372, height: 372 },
    spotifyUrl: 'https://open.spotify.com/track/5wG3HvLhF6Y5KTGlK0IW3J',
  },
] as const satisfies readonly ShelfSong[];
