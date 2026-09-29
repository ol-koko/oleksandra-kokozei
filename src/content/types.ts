/** Identifiers for social profiles. Display labels live in messages (`Links.social.*`). */
export type SocialLinkId = 'linkedin' | 'behance' | 'notion' | 'github';

/** Identifiers for live project sites. Display labels live in messages (`Links.projects.*`). */
export type ProjectSiteId = 'filmBudget' | 'blowStressAway';

export type ExternalLink<Id extends string> = {
  id: Id;
  href: `https://${string}`;
};
