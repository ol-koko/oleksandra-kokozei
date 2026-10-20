import type { Work, WorkSlug } from './types';

/**
 * Works grid, in Figma order (2:2, 57:518). Cover videos are 1280 px wide,
 * about 2.6× the 486 px card, with backdrops baked in. Logos are layers on top.
 */
export const works = [
  {
    slug: 'ces',
    year: 2026,
    published: true,
    cover: {
      video: {
        webm: '/media/works/ces/card.webm',
        mp4: '/media/works/ces/card.mp4',
        width: 1280,
        height: 720,
      },
      logo: { src: '/media/works/ces/logo-white.svg', width: 71, height: 71, placement: 'center' },
    },
  },
  {
    slug: 'juJutsu',
    year: 2026,
    published: true,
    cover: {
      video: {
        webm: '/media/works/ju-jitsu/card.webm',
        mp4: '/media/works/ju-jitsu/card.mp4',
        width: 1280,
        height: 624,
      },
    },
  },
  {
    slug: 'blowStressAway',
    year: 2026,
    published: true,
    cover: {
      video: {
        webm: '/media/works/blow-stress-away/card.webm',
        mp4: '/media/works/blow-stress-away/card.mp4',
        width: 1280,
        height: 720,
      },
    },
  },
  {
    slug: 'filmBudget',
    year: 2025,
    published: true,
    cover: {
      video: {
        webm: '/media/works/film-budget/card.webm',
        mp4: '/media/works/film-budget/card.mp4',
        width: 1280,
        height: 648,
      },
      logo: {
        src: '/media/covers/filmbudget-logo.svg',
        width: 54,
        height: 54,
        placement: 'top-end',
      },
    },
  },
] as const satisfies readonly Work[];

/** Whether a work's card and `/works/<slug>` link open its overlay. */
export function isPublishedWork(slug: WorkSlug) {
  return works.some((work) => work.slug === slug && work.published);
}
