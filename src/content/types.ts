/** Identifiers for social profiles. Display labels live in messages (`Links.social.*`). */
export type SocialLinkId = 'linkedin' | 'behance' | 'github';

/** Identifiers for live project sites. Display labels live in messages (`Links.projects.*`). */
export type ProjectSiteId = 'filmBudget' | 'blowStressAway';

/** Page sections. Each id is the anchor of a `<section>` on the main page. */
export type SectionId = 'me' | 'works' | 'experience';

export type ExternalLink<Id extends string> = {
  id: Id;
  href: `https://${string}`;
};
