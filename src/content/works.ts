import type { Work, WorkSlug } from './types';

/** Works grid, in Figma order (2:2, 57:518). Covers are cropped from the Figma artwork. */
export const works = [
  {
    slug: 'ces',
    year: 2026,
    published: true,
    cover: {
      image: { src: '/media/covers/ces-sea.webp', width: 1600, height: 833 },
      fit: 'photo',
      background: 'placeholder',
      logo: {
        src: '/media/covers/ces-logo.webp',
        width: 114,
        height: 106,
        placement: 'center',
      },
    },
  },
  {
    slug: 'juJutsu',
    year: 2026,
    published: false,
    cover: {
      image: { src: '/media/covers/ju-jutsu.webp', width: 1600, height: 900 },
      fit: 'photo',
    },
  },
  {
    slug: 'blowStressAway',
    year: 2026,
    published: false,
    cover: {
      image: { src: '/media/covers/blow-stress-away-phone.webp', width: 568, height: 912 },
      fit: 'mockup',
      background: 'gradient',
    },
  },
  {
    slug: 'filmBudget',
    year: 2025,
    published: true,
    cover: {
      image: { src: '/media/covers/filmbudget.webp', width: 1600, height: 809 },
      fit: 'photo',
      logo: {
        src: '/media/covers/filmbudget-logo.svg',
        width: 54,
        height: 54,
        placement: 'top-end',
      },
    },
  },
] as const satisfies readonly Work[];

/** Whether a work's card and `?work=` link open its overlay. */
export function isPublishedWork(slug: WorkSlug) {
  return works.some((work) => work.slug === slug && work.published);
}
