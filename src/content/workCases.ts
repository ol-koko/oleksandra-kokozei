import type { WorkCase, WorkSlug } from './types';

/** Covers at 2× the 894 × 435 frame: exported from Figma, or encoded from the screen recording. */
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
    icon: { src: '/media/works/ces/logo-blue.svg', width: 71, height: 71 },
    cover: { media: { src: '/media/works/ces/cover.webp', ...DETAIL }, alt: 'ces.coverAlt' },
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

  /** Desktop 551:480; mobile follows the CES mobile patterns. */
  juJutsu: {
    description: 'juJutsu.description',
    icon: { src: '/media/works/ju-jitsu/logo.webp', width: 200, height: 200 },
    cover: {
      media: {
        webm: '/media/works/ju-jitsu/cover.webm',
        mp4: '/media/works/ju-jitsu/cover.mp4',
        ...DETAIL,
      },
      alt: 'juJutsu.coverAlt',
    },
    facts: [
      { id: 'year' },
      { id: 'role', value: 'juJutsu.facts.role' },
      { id: 'productType', value: 'juJutsu.facts.productType' },
      { id: 'platform', value: 'juJutsu.facts.platform' },
    ],
    liveSite: 'juJutsu',
    about: [
      { kind: 'story', copy: 'juJutsu.overview' },
      {
        kind: 'photo',
        copy: 'juJutsu.promptToWebsite',
        image: { src: '/media/works/ju-jitsu/from-prompt-to-website.webp', ...DETAIL },
      },
    ],
    sections: [
      { id: 'goal', nav: 'juJutsu.nav.goal', blocks: [{ kind: 'story', copy: 'juJutsu.goal' }] },
      {
        id: 'design',
        nav: 'juJutsu.nav.design',
        blocks: [
          {
            kind: 'topics',
            copy: 'juJutsu.design',
            topics: [
              'juJutsu.design.topics.schedule',
              'juJutsu.design.topics.booking',
              'juJutsu.design.topics.assistant',
              'juJutsu.design.topics.content',
            ],
          },
          {
            kind: 'photo-grid',
            photos: [
              {
                copy: 'juJutsu.screens.classDiscovery',
                image: {
                  src: '/media/works/ju-jitsu/class-discovery.webp',
                  width: 872,
                  height: 502,
                },
              },
              {
                copy: 'juJutsu.screens.bookingFlow',
                image: { src: '/media/works/ju-jitsu/booking-flow.webp', width: 872, height: 498 },
              },
              {
                copy: 'juJutsu.screens.aiAssistance',
                image: { src: '/media/works/ju-jitsu/ai-assistance.webp', width: 872, height: 567 },
              },
              {
                copy: 'juJutsu.screens.contentStructure',
                image: {
                  src: '/media/works/ju-jitsu/content-structure.webp',
                  width: 872,
                  height: 502,
                },
              },
            ],
          },
        ],
      },
      {
        id: 'result',
        nav: 'juJutsu.nav.result',
        blocks: [{ kind: 'story', copy: 'juJutsu.result' }],
      },
    ],
  },

  /**
   * Desktop 600:268: header and the live app, no other sections. Mobile
   * follows the CES mobile patterns, with the card video in place of the app.
   */
  blowStressAway: {
    titleEmoji: 'blowStressAway.titleEmoji',
    description: 'blowStressAway.description',
    cover: {
      embed: 'blowStressAway',
      title: 'blowStressAway.embedTitle',
      fallback: {
        webm: '/media/works/blow-stress-away/card.webm',
        mp4: '/media/works/blow-stress-away/card.mp4',
        width: 1280,
        height: 720,
      },
      fallbackAlt: 'blowStressAway.fallbackAlt',
    },
    facts: [
      { id: 'design', value: 'blowStressAway.facts.design' },
      { id: 'frontend', value: 'blowStressAway.facts.frontend' },
      { id: 'styling', value: 'blowStressAway.facts.styling' },
      { id: 'ai', value: 'blowStressAway.facts.ai' },
    ],
    liveSite: 'blowStressAway',
    about: [],
    sections: [],
  },

  /** Desktop 439:414; mobile follows the CES mobile patterns. */
  filmBudget: {
    description: 'filmBudget.description',
    icon: { src: '/media/covers/filmbudget-logo.svg', width: 54, height: 54 },
    cover: {
      media: {
        webm: '/media/works/film-budget/cover.webm',
        mp4: '/media/works/film-budget/cover.mp4',
        ...DETAIL,
      },
      alt: 'filmBudget.coverAlt',
      caption: 'filmBudget.coverCaption',
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
