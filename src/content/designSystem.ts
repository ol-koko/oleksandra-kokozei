/**
 * Copy and structure of the /design-system page. Technical documentation, so it
 * stays in English in every locale (the one exception to "all copy through
 * next-intl", see docs/translations-review.md). Token names and values are never
 * written here: they are read from design-system/design-tokens.css.
 */

export const designSystemTitle = 'Design System';

export const designSystemDomain = 'oleksandra-kokozei.com';

export const designSystemSummary = 'The colors, type, space, motion, and components.';

export const designSystemDescription =
  'The design system of oleksandra-kokozei.com: colors, typography, spacing, radius, shadows, iconography, motion and components, as live specimens built from the real design tokens.';

/** Route of the page, without a locale prefix. */
export const designSystemPath = '/design-system';

export type DesignSystemNavItem = {
  /** Anchor id of the section or subsection. */
  id: string;
  label: string;
  children?: readonly { id: string; label: string }[];
};

/** The sticky menu, as in Figma (730:1540). Ids are the anchors of the page sections. */
export const designSystemNav = [
  { id: 'overview', label: 'Overview' },
  { id: 'colors', label: 'Colors' },
  {
    id: 'typography',
    label: 'Typography',
    children: [
      { id: 'typography-family', label: 'Family' },
      { id: 'typography-scale', label: 'Scale' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    children: [
      { id: 'components-buttons', label: 'Buttons' },
      { id: 'components-dividers', label: 'Dividers' },
      { id: 'components-navigation', label: 'Navigation' },
      { id: 'components-pills', label: 'Pills' },
    ],
  },
  { id: 'spacing', label: 'Spacing' },
  { id: 'borders', label: 'Borders', children: [{ id: 'borders-radius', label: 'Radius' }] },
  { id: 'shadows', label: 'Shadows', children: [{ id: 'shadows-blur', label: 'Blur' }] },
  {
    id: 'iconography',
    label: 'Iconography',
    children: [
      { id: 'iconography-size', label: 'Size' },
      { id: 'iconography-filled', label: 'Filled' },
      { id: 'iconography-stroke', label: 'Stroke' },
      { id: 'iconography-social', label: 'Social' },
    ],
  },
  {
    id: 'motion',
    label: 'Motion',
    children: [
      { id: 'motion-animation', label: 'Animation' },
      { id: 'motion-hover', label: 'Hover' },
      { id: 'motion-duration', label: 'Duration scale' },
    ],
  },
  { id: 'materials', label: 'Materials' },
] as const satisfies readonly DesignSystemNavItem[];

/** Every anchor id, in page order: the scroll-spy follows these. */
export const designSystemAnchorIds = designSystemNav.flatMap((item) => [
  item.id,
  ...('children' in item ? item.children.map((child) => child.id) : []),
]);

export const colorPalettes = ['gray', 'white', 'black', 'pink', 'purple'] as const;

export type ColorPaletteId = (typeof colorPalettes)[number];

export const componentsIntro = [
  'Small building blocks shared across the site.',
  'Each card shows a live instance of the component',
];

/** Cards of the Components section (Figma 808:1094), by subsection. */
export type ComponentSpecimenId =
  | 'menu-toggle'
  | 'carousel-arrows'
  | 'text-button'
  | 'divider'
  | 'nav-bar'
  | 'sidebar-nav'
  | 'breadcrumbs'
  | 'tooltip-label'
  | 'tag'
  | 'language-pills';

export const componentGroups = [
  {
    id: 'components-buttons',
    title: 'Buttons',
    items: ['menu-toggle', 'carousel-arrows', 'text-button'],
  },
  { id: 'components-dividers', title: 'Dividers', items: ['divider'] },
  {
    id: 'components-navigation',
    title: 'Navigation',
    items: ['nav-bar', 'sidebar-nav', 'breadcrumbs', 'tooltip-label'],
  },
  { id: 'components-pills', title: 'Pills', items: ['tag', 'language-pills'] },
] as const satisfies readonly {
  id: string;
  title: string;
  items: readonly ComponentSpecimenId[];
}[];

export const componentLabels: Record<ComponentSpecimenId, string> = {
  'menu-toggle': 'menu toggle',
  'carousel-arrows': 'carousel arrows',
  'text-button': 'text button',
  divider: 'divider',
  'nav-bar': 'nav bar',
  'sidebar-nav': 'sidebar nav',
  breadcrumbs: 'breadcrumbs',
  'tooltip-label': 'tooltip label',
  tag: 'tag',
  'language-pills': 'language pills',
};

export type AnimationSpecimen = {
  /** Name shown in Figma (`fadeIn`). */
  id: string;
  caption: string;
  /** The utility class in animations.css that the specimen applies. */
  className: string;
};

/** Figma 781:1565, each mapped to its utility class in animations.css. */
export const animations = [
  { id: 'fadeIn', caption: 'Overlay backdrop', className: 'animate-overlay' },
  { id: 'scaleIn', caption: 'Overlay content', className: 'animate-modal' },
  { id: 'fadeSlideUp', caption: 'Captions inside overlays', className: 'animate-caption' },
  { id: 'fadeSlideDown', caption: 'Close buttons', className: 'animate-close' },
  { id: 'riseIn', caption: 'Work cards, hero', className: 'animate-card' },
  { id: 'shelfItem', caption: 'Books, music', className: 'animate-shelf-item' },
  { id: 'nudgeDown', caption: 'Scroll hint arrow', className: 'animate-nudge' },
  { id: 'shimmer', caption: 'Loading skeleton band · infinite', className: 'animate-shimmer' },
  { id: 'revealIn', caption: 'Scroll-driven reveal', className: 'reveal' },
] as const satisfies readonly AnimationSpecimen[];

export type HoverSpecimenId = 'hoverColor' | 'hoverScale' | 'hoverMedia' | 'langSlide';

/** Figma 781:1567. The class is the hover rule in hover.css the specimen uses. */
export const hovers = [
  { id: 'hoverColor', caption: 'Links, nav, social icons', className: 'nav-link' },
  { id: 'hoverScale', caption: 'Work covers, polaroids, social tiles', className: 'social-tile' },
  { id: 'hoverMedia', caption: 'Icon inside a clipped frame', className: 'experience-icon' },
  { id: 'langSlide', caption: 'Language pill indicator', className: 'lang-switch' },
] as const satisfies readonly { id: HoverSpecimenId; caption: string; className: string }[];

export type MaterialId =
  | 'music'
  | 'book'
  | 'film'
  | 'gradient'
  | 'shimmer'
  | 'signature'
  | 'edge-fades'
  | 'modal-scrim'
  | 'sand-particles'
  | 'component';

/** Figma 798:1141, in grid order. */
export const materials = [
  { id: 'music', title: 'Music', caption: 'Hover' },
  { id: 'book', title: 'Book', caption: 'Hover' },
  { id: 'film', title: 'Film', caption: 'Hover' },
  { id: 'gradient', title: 'gradient/media-cover', caption: 'Work card covers' },
  { id: 'shimmer', title: 'Shimmer', caption: 'Image / skeleton loading' },
  { id: 'signature', title: 'Signature', caption: 'Handwriting animation' },
  { id: 'edge-fades', title: 'Edge fades', caption: 'Scroll fade' },
  { id: 'modal-scrim', title: 'Modal scrim', caption: 'All modal overlays' },
  { id: 'sand-particles', title: 'Sand particles', caption: 'Hover & animation' },
  { id: 'component', title: 'Component', caption: 'Design system showcase' },
] as const satisfies readonly { id: MaterialId; title: string; caption: string }[];

export type IconId =
  | 'lock'
  | 'location'
  | 'caret-right'
  | 'caret-right-small'
  | 'arrow-down'
  | 'arrow-up-right'
  | 'link'
  | 'expand'
  | 'menu'
  | 'close'
  | 'linkedin'
  | 'behance'
  | 'github';

/** The icons of the Iconography section, named as the components in src/components/icons. */
export const iconGroups = [
  { id: 'iconography-filled', title: 'Filled', icons: [{ id: 'lock', label: 'Lock' }] },
  {
    id: 'iconography-stroke',
    title: 'Stroke',
    icons: [
      { id: 'location', label: 'Location' },
      { id: 'caret-right', label: 'Caret right' },
      { id: 'caret-right-small', label: 'Caret right small' },
      { id: 'arrow-down', label: 'Arrow down' },
      { id: 'link', label: 'Link' },
      { id: 'arrow-up-right', label: 'Arrow up-right' },
      { id: 'expand', label: 'Expand' },
      { id: 'menu', label: 'Menu' },
      { id: 'close', label: 'Close' },
    ],
  },
  {
    id: 'iconography-social',
    title: 'Social',
    icons: [
      { id: 'linkedin', label: 'LinkedIn' },
      { id: 'behance', label: 'Behance' },
      { id: 'github', label: 'GitHub' },
    ],
  },
] as const satisfies readonly {
  id: string;
  title: string;
  icons: readonly { id: IconId; label: string }[];
}[];
