import type { WorkCase, WorkSlug } from './types';

/** Covers at 2× the 894 × 435 frame: exported from Figma, or encoded from the screen recording. */
const DETAIL = { width: 1788, height: 870 } as const;

/** Screen recordings kept at their own 1900 × 1080 ratio: the standard frame would crop them. */
const RECORDING = { width: 1710, height: 972 } as const;

/**
 * Case studies, keyed by work. A work opens its overlay only when it is
 * published (`works.ts`) and has an entry here. Copy lives in messages
 * (`WorkCases.*`). Screenshots are WebP at about 3× their displayed width
 * (never upscaled), lossless or quality 94, and served as they are (WorkMedia).
 */
export const workCases = {
  /** Desktop 448:532, mobile patterns 520:879. */
  ces: {
    description: 'ces.description',
    icon: { src: '/media/works/ces/logo-blue.svg', width: 71, height: 71 },
    cover: {
      media: {
        webm: '/media/works/ces/cover.webm',
        mp4: '/media/works/ces/cover.mp4',
        ...DETAIL,
      },
      logo: { src: '/media/works/ces/logo-white.svg', width: 71, height: 71 },
      alt: 'ces.coverAlt',
    },
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
            image: { src: '/media/works/ces/crm-wireframes.webp', width: 2682, height: 1333 },
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
                  width: 1308,
                  height: 751,
                },
              },
              {
                copy: 'juJutsu.screens.bookingFlow',
                image: { src: '/media/works/ju-jitsu/booking-flow.webp', width: 1308, height: 745 },
              },
              {
                copy: 'juJutsu.screens.aiAssistance',
                image: {
                  src: '/media/works/ju-jitsu/ai-assistance.webp',
                  width: 1308,
                  height: 751,
                },
              },
              {
                copy: 'juJutsu.screens.contentStructure',
                image: {
                  src: '/media/works/ju-jitsu/content-structure.webp',
                  width: 1308,
                  height: 752,
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

  /** Desktop 600:268: header and cover, no other sections. Mobile follows the CES mobile patterns. */
  blowStressAway: {
    titleEmoji: 'blowStressAway.titleEmoji',
    description: 'blowStressAway.description',
    cover: {
      media: {
        webm: '/media/works/blow-stress-away/cover.webm',
        mp4: '/media/works/blow-stress-away/cover.mp4',
        ...DETAIL,
      },
      alt: 'blowStressAway.coverAlt',
    },
    facts: [
      { id: 'design', value: 'blowStressAway.facts.design' },
      { id: 'frontend', value: 'blowStressAway.facts.frontend' },
      { id: 'styling', value: 'blowStressAway.facts.styling' },
      { id: 'ai', value: 'blowStressAway.facts.ai' },
    ],
    liveSite: 'blowStressAway',
    liveApp: { title: 'blowStressAway.appTitle' },
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
              width: 2682,
              height: 1462,
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
              width: 2602,
              height: 1412,
            },
          },
        ],
      },
    ],
  },

  /** Desktop 903:3796; there is no mobile frame, so mobile follows the CES mobile patterns. */
  ollivanders: {
    titleEmoji: 'ollivanders.titleEmoji',
    description: 'ollivanders.description',
    cover: {
      media: {
        scene: 'ollivanders',
        still: { src: '/media/works/ollivanders/still-cover.webp', ...DETAIL },
      },
      alt: 'ollivanders.coverAlt',
    },
    facts: [
      { id: 'design', value: 'ollivanders.facts.design' },
      { id: 'frontend', value: 'ollivanders.facts.frontend' },
      { id: 'tracking', value: 'ollivanders.facts.tracking' },
      { id: 'ai', value: 'ollivanders.facts.ai' },
    ],
    liveSite: 'ollivanders',
    liveApp: { title: 'ollivanders.appTitle', frame: 'desktop' },
    about: [],
    sections: [
      {
        id: 'idea',
        nav: 'ollivanders.nav.idea',
        blocks: [
          { kind: 'story', copy: 'ollivanders.idea' },
          {
            kind: 'polaroids',
            caption: 'ollivanders.photos.caption',
            /** Frame centers from 909:4182 (577 × 418); the left photo lies on top. */
            photos: [
              {
                image: {
                  src: '/media/works/ollivanders/elbenwald-trying.webp',
                  width: 684,
                  height: 906,
                },
                alt: 'ollivanders.photos.trying',
                rotation: 1.86,
                desktop: { x: 165.14, y: 202.13, z: 2 },
                mobile: { x: -5.8, y: 168 },
              },
              {
                image: {
                  src: '/media/works/ollivanders/elbenwald-wands.webp',
                  width: 684,
                  height: 906,
                },
                alt: 'ollivanders.photos.wands',
                rotation: -8.95,
                desktop: { x: 430.17, y: 202.17, z: 1 },
                mobile: { x: 4, y: 472 },
              },
            ],
          },
        ],
      },
      {
        id: 'magic',
        nav: 'ollivanders.nav.magic',
        blocks: [{ kind: 'story', copy: 'ollivanders.magic' }],
      },
      {
        id: 'build',
        nav: 'ollivanders.nav.build',
        blocks: [
          { kind: 'story', copy: 'ollivanders.build' },
          {
            kind: 'video',
            copy: 'ollivanders.wandReveal',
            video: {
              webm: '/media/works/ollivanders/wand-reveal.webm',
              mp4: '/media/works/ollivanders/wand-reveal.mp4',
              ...RECORDING,
            },
          },
        ],
      },
      {
        id: 'explore',
        nav: 'ollivanders.nav.explore',
        blocks: [
          {
            kind: 'topics',
            copy: 'ollivanders.explore',
            topics: ['ollivanders.explore.topics.shop', 'ollivanders.explore.topics.sorting'],
            topicLinks: {
              'ollivanders.explore.topics.shop': 'ollivanders',
              'ollivanders.explore.topics.sorting': 'ollivandersSorting',
            },
          },
          {
            kind: 'video',
            copy: 'ollivanders.sortingPreview',
            video: {
              webm: '/media/works/ollivanders/sorting-preview.webm',
              mp4: '/media/works/ollivanders/sorting-preview.mp4',
              ...RECORDING,
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
