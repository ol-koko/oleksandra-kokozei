# Design system

Design tokens are exported from the Figma file and live in [`design-system/`](../design-system). They are the single source of truth for visual values. Do not edit token values by hand; re-export from Figma instead.

| File                               | Contents                                                               |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `design-system/design-tokens.css`  | CSS custom properties (primitive + semantic) and typography classes    |
| `design-system/design-tokens.json` | The same tokens as JSON                                                |
| `design-system/animations.css`     | Keyframes and animation utility classes, with reduced-motion fallbacks |
| `design-system/hover.css`          | Hover and focus-visible state classes (fine pointers only)             |

All three CSS files are imported globally in `src/app/globals.css`.

When syncing a new Figma export, merge it instead of overwriting. The repository keeps tokens that the export does not contain yet: `--size-content-max`, `--size-overlay-content`, `--size-overlay-max`, `--size-measure`, `--shadow-polaroid`, `--blur-header`, `--gradient-media-cover`, `--gradient-media-detail`. `--color-icon-strong` stays `gray-900` (#1e1e1e, as bound in Figma) even though the export maps it to `gray-1000`.

## Rules

- Use **semantic** tokens in components: `--color-*`, `--spacing-*`, `--border-radius-*`, `--border-*`, `--size-*`, `--motion-*`. Primitive tokens (`--gray-*`, `--dimension-*`) are building blocks for the semantic layer.
- Use typography classes (`.text-body-*`, `.text-title-*`) for text styles instead of setting font properties by hand.
- Never hardcode a value that exists as a token. If a Figma value has no token, flag it and propose a new token instead of hardcoding it.
- Use the animation utility classes from `animations.css`. Every animation must respect `prefers-reduced-motion`.

> **`animations.css` and `hover.css` are maintained in this repo.** They have been adapted to the project (for example `aria-current="true"` instead of `"page"`, the scroll-reveal scoping, `.animate-card` fill mode). Merge future updates from Figma by comparison, never by overwriting these two files.

## Typography

| Class            | Use                                                     |
| ---------------- | ------------------------------------------------------- |
| `.text-body-2xs` | Quietest footer metadata, legal and copyright text      |
| `.text-body-xs`  | Compact metadata, dates, small captions                 |
| `.text-body-s`   | Secondary information: locations, dates, authors, roles |
| `.text-body-m`   | Navigation, short labels, links, controls               |
| `.text-body-l`   | Paragraphs and longer body copy                         |
| `.text-title-s`  | Card titles, item names, overlay navigation anchors     |
| `.text-title-m`  | Structured detail labels, small headings                |
| `.text-title-l`  | Primary section headings, overlay titles                |

### Font

Figtree is self-hosted through `next/font/google` (`src/styles/fonts.ts`) with weights 300 and 400, the only weights the tokens use. `next/font` exposes the family as `--font-figtree`, and `globals.css` maps it onto the `--font-family-figtree` token, so every typography class picks it up without the token file changing.

## Breakpoints

The Figma tokens do not define breakpoints, so this project sets the convention below. The values live in [`src/styles/breakpoints.css`](../src/styles/breakpoints.css) as `--breakpoint-*` custom properties.

| Name   | Min width | Target                                           |
| ------ | --------- | ------------------------------------------------ |
| (base) | `0`       | Phones: designed at 390 px, fluid down to 320 px |
| `md`   | `768px`   | Tablets                                          |
| `lg`   | `1024px`  | Small laptops; the desktop layout starts here    |
| `xl`   | `1440px`  | The Figma desktop frame width                    |

Conventions:

- **Mobile-first.** Base styles target the smallest viewport; enhance with `@media (min-width: …)`.
- CSS custom properties are not allowed inside media queries, so queries repeat the literal value, for example `@media (min-width: 1024px)`. Use only the values in the table.
- **Fluid layouts.** No fixed page widths. Use `max-inline-size` with token-based padding, flex and grid with token gaps, and intrinsic sizing.
- The desktop implementation must match Figma at `xl`, and the mobile implementation at 390 px. Tablet widths are not designed yet.

## Utilities

`globals.css` provides `.visually-hidden` to hide content visually while keeping it available to screen readers.
