import type { OverlayContent, WorkSlug } from './types';

/**
 * overlay-me (desktop 76:686, mobile 275:815), in nav order. About repeats the
 * hero, so the overlay glides on to the hometown right after it opens.
 */
export const meOverlay = {
  kind: 'me',
  parentSection: 'me',
  sections: ['about', 'home', 'music', 'books', 'films'],
  initialSection: 'home',
} as const satisfies OverlayContent;

/** Shared by every work overlay. Sections come from each case (`workCases`). */
export const workOverlay = {
  kind: 'work',
  parentSection: 'works',
} as const satisfies OverlayContent;

/** Work slugs as they appear in shareable links (`?work=blow-stress-away`). */
export const workUrlSlugs = {
  ces: 'ces',
  juJutsu: 'ju-jutsu',
  blowStressAway: 'blow-stress-away',
  filmBudget: 'film-budget',
} as const satisfies Record<WorkSlug, string>;
