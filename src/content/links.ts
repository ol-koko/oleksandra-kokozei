import type { ExternalLink, ProjectSiteId, SocialLinkId } from './types';

export const socialLinks = [
  { id: 'linkedin', href: 'https://www.linkedin.com/in/oleksandra-kokozei/' },
  { id: 'behance', href: 'https://www.behance.net/aadb28ef' },
  { id: 'github', href: 'https://github.com/ol-koko' },
] as const satisfies readonly ExternalLink<SocialLinkId>[];

/** Footer icon order, as in Figma (76:669): Behance, LinkedIn, GitHub. */
export const footerSocialOrder = [
  'behance',
  'linkedin',
  'github',
] as const satisfies readonly SocialLinkId[];

export const projectSites = [
  { id: 'filmBudget', href: 'https://www.filmbudget.dk/en/' },
  { id: 'blowStressAway', href: 'https://blowstressaway.figma.site/' },
] as const satisfies readonly ExternalLink<ProjectSiteId>[];
