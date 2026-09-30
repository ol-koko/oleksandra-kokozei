import type { ExternalLink, ProjectSiteId, SocialLinkId } from './types';

export const socialLinks = [
  { id: 'linkedin', href: 'https://www.linkedin.com/in/oleksandra-kokozei/' },
  { id: 'behance', href: 'https://www.behance.net/aadb28ef' },
  { id: 'github', href: 'https://github.com/ol-koko' },
] as const satisfies readonly ExternalLink<SocialLinkId>[];

export const projectSites = [
  { id: 'filmBudget', href: 'https://www.filmbudget.dk/en/' },
  { id: 'blowStressAway', href: 'https://blowstressaway.figma.site/' },
] as const satisfies readonly ExternalLink<ProjectSiteId>[];
