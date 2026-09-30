import type { ImageAsset, ParagraphKey } from './types';

/** Portrait cutout, cropped to the polaroid photo slot (228 × 302 in Figma, 179:771). */
export const portrait = {
  src: '/media/me/portrait.webp',
  width: 684,
  height: 906,
} as const satisfies ImageAsset;

/** Bio paragraphs in `Me.bio.*`, in reading order. */
export const bioParagraphs = ['p1', 'p2', 'p3'] as const satisfies readonly ParagraphKey[];
