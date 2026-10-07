import type { OverlayContent, OverlayRoute, WorkSlug } from './types';

/** overlay-me (desktop 76:686, mobile 275:815), in nav order. */
export const meOverlay = {
  kind: 'me',
  parentSection: 'me',
  sections: ['about', 'home', 'music', 'books'],
} as const satisfies OverlayContent;

/** Shared by every work overlay (desktop 42:429, mobile 334:1390), in nav order. */
export const workOverlay = {
  kind: 'work',
  parentSection: 'works',
  sections: ['about', 'goal', 'problem', 'result'],
} as const satisfies OverlayContent;

/** Work slugs as they appear in shareable links (`?work=blow-stress-away`). */
export const workUrlSlugs = {
  ces: 'ces',
  juJutsu: 'ju-jutsu',
  blowStressAway: 'blow-stress-away',
  filmBudget: 'film-budget',
} as const satisfies Record<WorkSlug, string>;

export function getOverlayContent(route: OverlayRoute): OverlayContent {
  return route.kind === 'me' ? meOverlay : workOverlay;
}
