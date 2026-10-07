import type { HometownPhoto } from './types';

/**
 * "My hometown" photos in reading order: left to right in the desktop collage
 * (84:91), top to bottom on mobile (334:1201). The first one is always shown;
 * on mobile the rest appear after "more". Positions are the centers of the
 * rotated frames as Figma lays them out.
 */
export const hometownPhotos = [
  {
    id: 'port',
    image: { src: '/media/me/hometown/port.webp', width: 1208, height: 1600 },
    rotation: -11.83,
    desktop: { x: 112.39, y: 254.59, z: 1 },
    mobile: { x: -0.21, y: 180.73 },
  },
  {
    id: 'opera',
    image: { src: '/media/me/hometown/opera.webp', width: 1200, height: 1600 },
    rotation: 1.86,
    desktop: { x: 329.14, y: 228.13, z: 4 },
    mobile: { x: -5.8, y: 485.11 },
  },
  {
    id: 'beach',
    image: { src: '/media/me/hometown/beach.webp', width: 1200, height: 1600 },
    rotation: -3.11,
    desktop: { x: 557.17, y: 183.77, z: 2 },
    mobile: { x: 15.61, y: 781.35 },
  },
  {
    id: 'street',
    image: { src: '/media/me/hometown/street.webp', width: 1208, height: 1600 },
    rotation: 6.99,
    desktop: { x: 780.18, y: 219.99, z: 3 },
    mobile: { x: -13.16, y: 1061.79 },
  },
] as const satisfies readonly HometownPhoto[];
