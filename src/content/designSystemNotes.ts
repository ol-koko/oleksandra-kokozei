/**
 * Usage notes of the design system page (Figma 730:1537), keyed by token name
 * without the `--`. Values, names and ordering come from design-tokens.css;
 * these only say what a token is for. `assertKnownTokens` fails the build when
 * a note names a token that no longer exists, so a rename cannot go unnoticed.
 */

export const spacingNotes: Record<string, string> = {
  'spacing-none': 'No gap — elements touch',
  'spacing-xxs': 'Hairline offsets, tooltip padding',
  'spacing-xs': 'Tight gaps, pill padding',
  'spacing-sm': 'Breadcrumb gaps, captions',
  'spacing-md': 'Title to text, small gaps',
  'spacing-lg': 'Inside cards, tag padding',
  'spacing-xl': 'Mobile margins, list gaps',
  'spacing-2xl': 'Card and polaroid padding',
  'spacing-3xl': 'Gaps between cards',
  'spacing-4xl': 'Nav links, header padding',
  'spacing-5xl': 'Between blocks',
  'spacing-6xl': 'Large block spacing',
  'spacing-7xl': 'Wide layout gaps',
  'spacing-8xl': 'Between subsections',
  'spacing-9xl': 'Between page sections',
  'spacing-10xl': 'Desktop page margins',
};

export const radiusNotes: Record<string, string> = {
  'border-radius-none': 'Square corners',
  'border-radius-xs': 'Photos, tooltips',
  'border-radius-sm': 'Polaroid frames',
  'border-radius-md': 'Not used yet',
  'border-radius-lg': 'Device screen mockups',
  'border-radius-xl': 'Not used yet',
  'border-radius-2xl': 'Social tiles, photos',
  'border-radius-3xl': 'Work covers (mobile)',
  'border-radius-4xl': 'Work covers (desktop)',
  'border-radius-5xl': 'Overlay panels',
  'border-radius-full': 'Pills, tags, round buttons',
};

export const borderWidthNotes: Record<string, string> = {
  'border-none': 'No border',
  'border-thin': 'Dividers, swatches, hairlines',
  'border-default': 'Focus ring',
  'border-thick': 'Heavy outlines',
};

export const shadowNotes: Record<string, string> = {
  'shadow-sm': 'Polaroid cards',
  'shadow-md': 'Carousel arrow buttons',
  'shadow-lg': 'Lightbox content',
};

/** Tokens that stay off the page: unused, kept in the CSS for now. */
export const hiddenTokens: readonly string[] = ['shadow-polaroid'];

export const blurNotes: Record<string, string> = {
  'blur-sm': 'Subtle background blur',
  'blur-md': 'Overlay and backdrop blur',
};

export const iconSizeNotes: Record<string, string> = {
  'size-xs': 'xs',
  'size-sm': 'sm',
  'size-md': 'md',
  'size-lg': 'lg',
  'size-xl': 'xl',
};

export const durationNotes: Record<string, string> = {
  'duration-200': 'hover colour & scale, overlay backdrop',
  'duration-250': 'language pill slide',
  'duration-300': 'overlay content, captions, close',
  'duration-400': 'card & shelf entrance, reveal',
  'duration-500': 'scroll hint nudge',
  'duration-1500': 'loading skeleton',
};

/** What each text style is for; the sheet's own comment is the fallback. */
export const typographyNotes: Record<string, string> = {
  'body-2xs': 'copyright, the quietest metadata',
  'body-xs': 'cover tags, tooltips, captions',
  'body-s': 'locations, dates, authors, roles, card descriptions',
  'body-m': 'navigation, language pills, logo, short labels and controls',
  'body-l': 'paragraphs: bio, experience, case-study text',
  'title-s': 'card and media titles, overlay section nav, subsection headings',
  'title-m': 'structured detail labels, meta values with open rhythm',
  'title-l': 'section headings, overlay and case-study titles',
};

/**
 * Figma lists "title-s-uppercase" as a ninth style. In code it is `.text-title-s`
 * with `text-transform: uppercase` (one-off, in WorkStory), not a token, so the
 * page documents it as a composition.
 */
export const typographyCompositions = [
  {
    name: 'title-s-uppercase',
    base: 'title-s',
    note: 'case-study section labels',
  },
] as const;

/** Throws when a note names a token the sheet does not declare. */
export function assertKnownTokens(
  notes: Record<string, string>,
  has: (name: string) => boolean,
  group: string,
) {
  for (const name of Object.keys(notes)) {
    if (!has(name)) {
      throw new Error(`design system notes (${group}): --${name} is not in design-tokens.css`);
    }
  }
}
