import type { WorkCase, WorkSlug } from './types';

/** Covers exported from Figma at 2× the 894 × 435 frame. */
const DETAIL = { width: 1788, height: 870 } as const;

/**
 * Case studies, keyed by work. A work opens its overlay only when it is
 * published (`works.ts`) and has an entry here. Copy lives in messages
 * (`WorkCases.*`). Images are WebP at about 2× their displayed width.
 */
export const workCases = {
  /** Desktop 448:532, mobile patterns 520:879. */
  ces: {
    description: 'ces.description',
    icon: { src: '/media/works/ces/icon.webp', width: 200, height: 200 },
    cover: { image: { src: '/media/works/ces/cover.webp', ...DETAIL }, alt: 'ces.coverAlt' },
    facts: [
      { id: 'year' },
      { id: 'role', value: 'ces.facts.role' },
      { id: 'productType', value: 'ces.facts.productType' },
      { id: 'projectType', value: 'ces.facts.projectType' },
    ],
    privateNote: true,
    about: [{ kind: 'story', copy: 'ces.overview' }],
    sections: [
      {
        id: 'scope',
        nav: 'ces.nav.scope',
        blocks: [
          {
            kind: 'topics',
            copy: 'ces.scope',
            topics: ['ces.scope.topics.crewingCrm', 'ces.scope.topics.cesCrm'],
          },
          {
            kind: 'photo',
            copy: 'ces.wireframes',
            image: { src: '/media/works/ces/crm-wireframes.webp', width: 1788, height: 888 },
          },
        ],
      },
      {
        id: 'flows',
        nav: 'ces.nav.flows',
        blocks: [
          {
            kind: 'topics',
            copy: 'ces.workflows',
            topics: [
              'ces.workflows.topics.vacancies',
              'ces.workflows.topics.seafarers',
              'ces.workflows.topics.services',
            ],
          },
        ],
      },
    ],
  },

  /** Desktop 439:414; mobile follows the CES mobile patterns. */
  filmBudget: {
    description: 'filmBudget.description',
    icon: { src: '/media/covers/filmbudget-logo.svg', width: 54, height: 54 },
    cover: {
      image: { src: '/media/works/film-budget/cover.webp', ...DETAIL },
      alt: 'filmBudget.coverAlt',
    },
    facts: [
      { id: 'year' },
      { id: 'role', value: 'filmBudget.facts.role' },
      { id: 'projectType', value: 'filmBudget.facts.projectType' },
      { id: 'team', value: 'filmBudget.facts.team' },
    ],
    liveSite: 'filmBudget',
    about: [{ kind: 'story', copy: 'filmBudget.overview' }],
    sections: [
      {
        id: 'goal',
        nav: 'filmBudget.nav.goal',
        blocks: [
          { kind: 'story', copy: 'filmBudget.goal' },
          {
            kind: 'photo',
            copy: 'filmBudget.research',
            image: {
              src: '/media/works/film-budget/research-analysis.webp',
              width: 1788,
              height: 975,
            },
          },
        ],
      },
      {
        id: 'decisions',
        nav: 'filmBudget.nav.decisions',
        blocks: [
          {
            kind: 'topics',
            copy: 'filmBudget.decisions',
            topics: [
              'filmBudget.decisions.topics.pricing',
              'filmBudget.decisions.topics.inquiry',
              'filmBudget.decisions.topics.devices',
            ],
          },
        ],
      },
      {
        id: 'result',
        nav: 'filmBudget.nav.result',
        blocks: [
          { kind: 'story', copy: 'filmBudget.result' },
          {
            kind: 'photo',
            copy: 'filmBudget.designFile',
            image: {
              src: '/media/works/film-budget/design-file-overview.webp',
              width: 1788,
              height: 970,
            },
          },
        ],
      },
    ],
  },
} as const satisfies Partial<Record<WorkSlug, WorkCase>>;

/** The case study a work overlay renders, if the work has one. */
export function getWorkCase(slug: WorkSlug): WorkCase | undefined {
  return (workCases as Partial<Record<WorkSlug, WorkCase>>)[slug];
}
