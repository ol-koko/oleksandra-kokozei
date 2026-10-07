# Implementation plan: Figma audit

Audit of Figma file `vJCOCkFcnVJ9Pn4TFuRHV9`, section `107:329` ("Design Website"), made through Figma MCP reads only. It maps the design onto the existing stack (Next.js App Router, CSS Modules, `design-system/design-tokens.css`, next-intl) before any UI code is written.

Conventions used below:

- Node ids are written `123:456` (the URL form is `123-456`).
- "Desktop" means the 1440 px frames, "mobile" means the 390 px frames.
- A value is "unbound" when Figma shows a raw number that equals an existing token but is not linked to the variable. Unbound values map to tokens; they are not missing tokens.

---

## Decisions

Made by the repository owner after the audit (2026-09-30). They take precedence over anything that follows, and the sections below have been updated to match.

| #   | Topic                     | Decision                                                                                                                                                                                                                                                                                                                                              | Affects                    |
| --- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| D1  | Text contrast             | Keep the current Figma colors. Recorded as a known accessibility trade-off to revisit later. No color changes                                                                                                                                                                                                                                         | §6, §10                    |
| D2  | Navigation order          | Me, Works, Experience on desktop and mobile. The mobile menu in Figma will be updated to match                                                                                                                                                                                                                                                        | §8, §9.1                   |
| D3  | Notion                    | Not added to the social icons. Social links are LinkedIn, Behance, GitHub                                                                                                                                                                                                                                                                             | §2, §5, §8                 |
| D4  | Work entries              | Card 2 label stays "Ju-Jutsu⁺". CES has no external link: no link icon in the CES detail. CES is the key case study                                                                                                                                                                                                                                   | §7, §8                     |
| D5  | Overlay structure         | All overlays share one structure (shell, sticky nav, sections). Nav items, labels and some details differ per overlay and come from content data                                                                                                                                                                                                      | §2, §7                     |
| D6  | `color/icon/strong`       | Must be `#1e1e1e` everywhere. A token update is planned; the change itself happens in the implementation stage                                                                                                                                                                                                                                        | §3                         |
| D7  | Widths and breakpoints    | Mobile design width is 390. Layouts stay fluid below it, down to 320 as a safety net. Breakpoints: 768, 1024, 1440. 480 is removed                                                                                                                                                                                                                    | §9.2, §9.3                 |
| D8  | New tokens                | The 8 proposed tokens are part of the plan (see §3, "Token update plan")                                                                                                                                                                                                                                                                              | §3                         |
| D9  | Language chip label       | Label stays "ua"; the locale code stays `uk`                                                                                                                                                                                                                                                                                                          | §8                         |
| D10 | Closing overlays          | Desktop overlays have no close button. They close with Esc, backdrop click and browser Back (URL sync). On mobile the overlay opens full screen like `overlay-me-mobile` (275:815): the site header (working burger), breadcrumbs, sections, footer. The first breadcrumb ("Me", "Works") is the exit control. No section nav or scroll-spy on mobile | §6, §9.3, §10              |
| D11 | Active nav item color     | `--color-text-primary` for every nav (header, mobile menu, overlay nav). For unspecified details like this, use the design system first                                                                                                                                                                                                               | §6                         |
| D12 | Fixed in Figma; postponed | The Cyrillic look-alike letters and the 129 px mobile footer gap are fixed in Figma. overlay-works content is postponed: it will follow a heading, subheading and photo format. Its implementation moves to a later stage                                                                                                                             | §1, §3, §7, §8, §10, order |

Related rule added to `AGENTS.md`: Latin text in Figma that contains Cyrillic look-alike characters or obvious typos is corrected in code without asking, and the fix is listed in the summary.

---

## 1. Frames

### Portfolio frames (inside section `107:329`)

| Frame                             | Size        | Node id                      | Purpose                                                                    |
| --------------------------------- | ----------- | ---------------------------- | -------------------------------------------------------------------------- |
| Main Page-desktop                 | 1440 × 2465 | `2:2`                        | One-page layout: hero (Me), Works, Experience, footer                      |
| header (instance on desktop page) | 1440 × 91   | `220:126` (master `220:75`)  | Sticky header: logo, anchor menu, language switcher                        |
| footer (instance on desktop page) | 1440 × 248  | `224:269` (master `220:76`)  | Logo, local time, menu, email, social icons, copyright                     |
| overlay-me-desktop                | 1200 × 2514 | `76:686`                     | "More" overlay: About, My hometown, Fav songs, Books, sticky side nav      |
| overlay-works-desktop             | 1200 × 1039 | `42:429`                     | Work detail overlay, CES only: header block, facts, cover, sticky side nav |
| main page-mobile                  | 390 × 3640  | `220:74`                     | Mobile one-page layout: header, hero, Works, Experience, footer            |
| header (mobile instance)          | 390 × 91    | `233:657` (master `233:585`) | Logo and menu (hamburger) button                                           |
| footer (mobile instance)          | 390 × 443   | `233:623` (master `233:621`) | Stacked footer                                                             |
| menu-overlay-mobile               | 390 × 800   | `233:666`                    | Full-screen mobile menu: close button, section links, language switcher    |

### Related nodes outside the section

| Node                                  | Size        | Node id                                                                     | Why it matters                                                                                               |
| ------------------------------------- | ----------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Frame 77 (overlay-me in page context) | 1440 × 2674 | `188:993`                                                                   | The only view of an overlay over the page: backdrop, insets 120 px left/right, 80 px top, panel 1200 px wide |
| polaroid_sign (component set)         | 424 × 1026  | `179:774` (Default `179:773`, Variant2 `179:775`)                           | Variant2 swaps the portrait for a different facial expression. The trigger is not documented (see §10)       |
| header (component set)                | 1480 × 291  | `233:586` (desktop `220:75`, mobile `233:585`)                              | Header variants                                                                                              |
| footer (component set)                | 1480 × 751  | `233:622` (desktop `220:76`, mobile `233:621`)                              | Footer variants                                                                                              |
| content-works (component set)         | 526 × 932   | `76:743` (`tag+subtitle` `76:742`, `subtitle` `76:744`, `default` `76:752`) | Older work-card variants with earlier copy. It may describe a hover state (see §10)                          |
| cover-works, mockup, Chrome - Light   | various     | `167:37`, `169:581`, `169:496`, `175:723`                                   | Source artwork for the work covers (phone and browser mockups)                                               |

Loose screenshots on the page (`Знімок екрана …`, `screencapture-…`, `IMG_4466`) and raw book or song covers (`130:127`–`130:134`) are reference material, not portfolio frames. The book and song covers belong to the ready-made Books and Fav Songs code.

A stray `akar-icons:behance-fill` frame (`21:281`, 24 × 24) floats on the desktop main page at x 1087, y 1866, outside any section. It looks like a leftover. Do not implement it.

### Page geometry

| Measure                           | Desktop (1440)                                    | Mobile (390)                                                              |
| --------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| Header height                     | 91 (padding 32 / 120)                             | 91 (padding 32 / 16)                                                      |
| Content column                    | 996 wide, centered (side margin 222)              | 358 wide (side padding 16)                                                |
| Header → hero                     | 48 (`--spacing-6xl`)                              | 0 (hero starts right under the header)                                    |
| Between sections (divider rhythm) | 80 (`--spacing-9xl`) above and below each divider | 48 (`--spacing-6xl`)                                                      |
| Last section → footer             | 80                                                | Follows the mobile section rhythm (the 129 px gap is fixed in Figma, D12) |

---

## 2. Section-to-component map

Proposed file layout: `src/components/<area>/<Component>/<Component>.tsx` + `.module.css`. Content comes from typed data in `src/content/*.ts` and copy from `messages/{en,uk,de}.json`.

### Layout and shared

| Component          | Responsibility                                                                                                                     | Props                                                                                            | Reused in                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `SiteHeader`       | Sticky, blurred header. Desktop: logo, `SectionNav`, `LanguageSwitcher`. Mobile: logo, menu button                                 | `activeSectionId: SectionId`                                                                     | Page                                                                                   |
| `Logo`             | ✨ + name, links to top                                                                                                            | `as?: 'a' \| 'span'`                                                                             | Header (desktop and mobile), footer                                                    |
| `SectionNav`       | Anchor links Me / Works / Experience (same order everywhere, D2) with an active state                                              | `items: NavItem[]`, `activeId?: SectionId`, `orientation: 'row' \| 'column'`, `size: 'm' \| 'l'` | Header (row, m), footer (row on desktop, column on mobile, m), mobile menu (column, l) |
| `LanguageSwitcher` | Locale chips ua/en/de (label "ua" for locale `uk`, D9). The current locale gets the subtle chip background                         | `currentLocale: Locale`                                                                          | Desktop header, mobile menu                                                            |
| `MobileMenu`       | Full-screen dialog with close button, `SectionNav`, `LanguageSwitcher`                                                             | `open: boolean`, `onClose(): void`                                                               | Mobile header                                                                          |
| `SectionHeading`   | `h2` with `.text-title-l`                                                                                                          | `id`, `children`                                                                                 | Works, Experience, overlay sections                                                    |
| `Divider`          | 1 px `--color-border-subtle` rule                                                                                                  | none                                                                                             | Main page (between sections), overlays, footer                                         |
| `LocationLabel`    | Pin icon + muted text                                                                                                              | `label: string`                                                                                  | Hero, overlay-me About, My hometown                                                    |
| `Polaroid`         | White frame (padding 20 / 16 / 60), photo, drop shadow, rotation                                                                   | `src`, `alt`, `rotation: number`, `priority?`                                                    | `PolaroidSign`, hometown collage                                                       |
| `PolaroidSign`     | 384 × 483 slot: rotated `Polaroid` with the portrait, plus the animated signature SVG. Scales down to its container below 390 (D7) | `variant: 'default' \| 'alt'`, `animateEntrance?: boolean`                                       | Hero, overlay-me About                                                                 |
| `SocialLinks`      | LinkedIn / Behance / GitHub links (no Notion, D3)                                                                                  | `variant: 'tile' \| 'inline'`, `links: SocialLink[]`                                             | Experience (tile 64 px), footer (inline 24 px)                                         |
| `SiteFooter`       | Logo, `LocalTime`, `SectionNav`, email link, `SocialLinks`, copyright                                                              | none                                                                                             | Page                                                                                   |
| `LocalTime`        | Client component: live HH:mm in `Europe/Berlin` + location                                                                         | `timeZone: string`, `locationLabel: string`                                                      | Footer                                                                                 |
| `useScrollSpy`     | Hook: IntersectionObserver → active section id                                                                                     | `ids: string[]`, `root?: Element \| null`                                                        | Header nav, overlay nav                                                                |

### Main page sections

| Component           | Responsibility                                                                     | Props                                          | Reused in                      |
| ------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------ |
| `HeroSection`       | Section `#me`: `PolaroidSign` + `AboutIntro` + "more" button that opens overlay-me | none                                           | Page                           |
| `AboutIntro`        | Greeting (`h1` on page, `h2` in overlay), location, 3-paragraph bio                | `headingLevel: 1 \| 2`                         | Hero, overlay-me About         |
| `WorksSection`      | Section `#works`: heading + grid of `WorkCard`                                     | `works: Work[]`                                | Page                           |
| `WorkCard`          | Button that opens the work's overlay: cover, `TitlePill`, description              | `work: Work`, `onOpen(slug): void`             | Works grid                     |
| `TitlePill`         | White pill "Name・Year" on the cover                                               | `label: string`                                | `WorkCard`                     |
| `WorkCover`         | Per-work cover artwork (image, gradient, mockup, logo)                             | `cover: WorkCover`, `size: 'card' \| 'detail'` | `WorkCard`, work overlay cover |
| `ExperienceSection` | Section `#experience`: role, period, 3 paragraphs, `SocialLinks` tile              | `roles: Role[]`                                | Page                           |

### Overlays: one shared structure (D5)

Every overlay is the same component tree. Only its content data differs.

```
Overlay (shell: dialog, backdrop, panel, scroller, URL sync)
├── OverlayNav            ← items from OverlayContent.nav
└── OverlaySection × n    ← id, divider, heading; body chosen by section kind
```

| Component          | Responsibility                                                                                                                                                                                                                                                                                 | Props                                                    | Reused in          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------ |
| `Overlay`          | Modal shell: `<dialog>`, backdrop, 1200 px panel (radius 40), own scroll container, focus trap, body scroll lock, `.animate-overlay` / `.animate-modal`. Closes on Esc, backdrop click and browser Back; no close button on desktop (D10). Full screen on mobile, exit through the breadcrumbs | `content: OverlayContent`, `onClose(): void`, `children` | Every overlay      |
| `OverlayNav`       | Sticky nav with scroll-spy inside the overlay scroller. Desktop: vertical, right-aligned, vertically centered `.text-title-s`. Not shown on mobile (D10)                                                                                                                                       | `items: OverlayNavItem[]`, `activeId`                    | Every overlay      |
| `OverlaySection`   | Section wrapper: `id` for scroll-spy, `Divider` before every section but the first, optional `SectionHeading`                                                                                                                                                                                  | `id`, `headingKey?`, `children`                          | Every overlay      |
| `useOverlayRoute`  | Reads and writes the overlay query param (`?overlay=me`, `?work=<slug>`). Opening pushes a history entry, so Back closes; Esc and backdrop click go back too                                                                                                                                   | none                                                     | Page               |
| `HometownCollage`  | 4 overlapping, rotated `Polaroid`s in a 894 × 470 area                                                                                                                                                                                                                                         | `photos: HometownPhoto[]`                                | overlay-me         |
| `FavSongsSlot`     | Mount point for the ready-made Fav Songs block (894 × 367 incl. heading)                                                                                                                                                                                                                       | none                                                     | overlay-me         |
| `BooksSlot`        | Mount point for the ready-made Books block (894 × 442 incl. heading)                                                                                                                                                                                                                           | none                                                     | overlay-me         |
| `WorkDetailHeader` | 120 px icon tile, title, one-line description, facts, and an external link icon **only when `liveUrl` is set** (not for CES, D4)                                                                                                                                                               | `work: Work`                                             | Work overlays      |
| `WorkFacts`        | 4 label/value columns: Year, Role, Project type, Team                                                                                                                                                                                                                                          | `facts: WorkFacts`                                       | `WorkDetailHeader` |
| `WorkStorySection` | **Later stage (D12).** Heading, subheading and photo                                                                                                                                                                                                                                           | `section: WorkStory`                                     | Work overlays      |

Content data (first cut):

```ts
type OverlayNavItem = { sectionId: string; labelKey: string };

type OverlaySectionData =
  | { kind: 'about-intro' } // overlay-me
  | { kind: 'hometown'; photos: HometownPhoto[] } // overlay-me
  | { kind: 'fav-songs' } // overlay-me, ready-made block
  | { kind: 'books' } // overlay-me, ready-made block
  | { kind: 'work-header'; workSlug: WorkSlug } // work overlays
  | { kind: 'work-story'; headingKey: string; subheadingKey: string; image: ImageData }; // later stage

type OverlayContent = {
  id: 'me' | `work-${WorkSlug}`;
  titleKey: string; // accessible name of the dialog
  nav: OverlayNavItem[];
  sections: ({ id: string; headingKey?: string } & OverlaySectionData)[];
};

type Work = {
  slug: WorkSlug;
  name: string;
  year: number;
  pillKey: string;
  descriptionKey: string;
  liveUrl?: string; // omitted for CES and Ju-Jutsu⁺
  icon: ImageData;
  cover: WorkCover; // { type: 'photo' | 'phone-mockup' | 'browser-mockup'; ... }
  facts: { year: number; roleKey: string; projectTypeKeys: string[]; teamKey: string };
  overlay: OverlayContent;
};

type SocialLink = { id: 'linkedin' | 'behance' | 'github'; href: string; labelKey: string };
type HometownPhoto = { src: string; altKey: string; rotation: number; x: number; y: number };
```

Per-overlay differences live only in data: nav items and labels, which section kinds appear, whether a section has a heading, and details such as the optional link icon.

---

## 3. Token mapping

### Figma variables → CSS custom properties

All variables returned by `get_variable_defs` on `107:329`:

| Figma variable                                                   | Value               | CSS token                                               | Status                                                                                                  |
| ---------------------------------------------------------------- | ------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `color/background/page`                                          | #ffffff             | `--color-background-page`                               | ✅                                                                                                      |
| `color/surface/raised`                                           | #ffffff             | `--color-surface-raised`                                | ✅                                                                                                      |
| `color/surface/subtle`                                           | #efeff1             | `--color-surface-subtle`                                | ✅                                                                                                      |
| `color/surface/header`                                           | #ffffffcc           | `--color-surface-header`                                | ✅                                                                                                      |
| `color/media/placeholder`                                        | #d9d9d9             | `--color-media-placeholder`                             | ✅                                                                                                      |
| `color/media/gradient-start`                                     | #fdcbf1             | `--color-media-gradient-start`                          | ✅ (Figma applies it with alpha, see missing table)                                                     |
| `color/media/gradient-end`                                       | #e6dee9             | `--color-media-gradient-end`                            | ✅ (same)                                                                                               |
| `color/text/strong`                                              | #000000             | `--color-text-strong`                                   | ✅                                                                                                      |
| `color/text/primary`                                             | #393939             | `--color-text-primary`                                  | ✅                                                                                                      |
| `color/text/secondary`                                           | #71717c             | `--color-text-secondary`                                | ✅                                                                                                      |
| `color/text/muted`                                               | #a1a1aa             | `--color-text-muted`                                    | ✅                                                                                                      |
| `color/text/inactive`                                            | #9f9faa             | `--color-text-inactive`                                 | ✅                                                                                                      |
| `color/text/disabled`                                            | #d0d0d4             | `--color-text-disabled`                                 | ✅                                                                                                      |
| `color/border/subtle`                                            | #efeff1             | `--color-border-subtle`                                 | ✅                                                                                                      |
| `color/icon/strong`                                              | **#1e1e1e**         | `--color-icon-strong` → `--gray-1000` (**#000000**)     | ⚠️ Mismatch. **#1e1e1e is correct (D6)**; update planned below                                          |
| `color/icon/muted`                                               | #a1a1aa             | `--color-icon-muted`                                    | ✅                                                                                                      |
| `color/icon/subtle`                                              | #b8b8bf             | `--color-icon-subtle`                                   | ✅                                                                                                      |
| `color/icon/decorative`                                          | #d9d9d9             | `--color-icon-decorative`                               | ✅                                                                                                      |
| `color/illustration/ink`                                         | #1e1e1e             | `--color-illustration-ink`                              | ✅                                                                                                      |
| `color/illustration/shadow`                                      | #c1c1c1             | `--color-illustration-shadow`                           | ✅                                                                                                      |
| `color/accent/book`                                              | #e6a3cc             | `--color-accent-book`                                   | ✅ (Books placeholder only)                                                                             |
| `color/brand/film-budget/background`                             | #ffc7ff             | `--color-brand-film-budget-background`                  | ✅                                                                                                      |
| `color/brand/film-budget/foreground`                             | #251851             | `--color-brand-film-budget-foreground`                  | ✅                                                                                                      |
| `gray/50` (primitive, used directly)                             | #efeff1             | `--gray-50`. Use `--color-surface-subtle` in components | ⚠️ Primitive bound in Figma on the polaroid photo placeholder and the CES icon tile                     |
| `semantic/spacing/spacing-xs … 10xl`                             | 4 … 120             | `--spacing-xs` … `--spacing-10xl`                       | ✅ (xs 4, md 8, lg 12, xl 16, 2xl 20, 3xl 24, 4xl 32, 5xl 40, 6xl 48, 7xl 56, 8xl 60, 9xl 80, 10xl 120) |
| `semantic/borderRadius/border-radius-xs/sm/2xl/3xl/4xl/5xl/full` | 4/6/20/24/32/40/999 | `--border-radius-*` (same names)                        | ✅                                                                                                      |
| `semantic/borderWidth/border-thin`                               | 1                   | `--border-thin`                                         | ✅                                                                                                      |
| `semantic/size/size-sm`, `size-lg`, `size-6xl`                   | 16, 24, 120         | `--size-sm`, `--size-lg`, `--size-6xl`                  | ✅                                                                                                      |

Unbound values that already have a token (bind them in Figma; use the token in code):

| Raw value                                        | Where                                                                                      | Token                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------- |
| 16                                               | Mobile side padding (hero, works, experience, footer, menu), work card description padding | `--spacing-xl`                        |
| 8                                                | Mobile work description padding, footer icon mask                                          | `--spacing-md`                        |
| 12                                               | Desktop work description left padding                                                      | `--spacing-lg`                        |
| 24                                               | Mobile social tile gap, Fav songs placeholder gap                                          | `--spacing-3xl`                       |
| 32                                               | Mobile menu language bar vertical padding                                                  | `--spacing-4xl`                       |
| 40                                               | Mobile footer gap                                                                          | `--spacing-5xl`                       |
| 64                                               | Social tile size                                                                           | `--size-5xl`                          |
| 12                                               | Mobile phone-mockup screen radius                                                          | `--border-radius-lg`                  |
| 16                                               | overlay-works phone screen bottom radius                                                   | `--border-radius-xl`                  |
| 20                                               | Title pill radius in `content-works` component set (main page uses `full`)                 | `--border-radius-full` (use this one) |
| #d9d9d9, #393939, #a1a1aa, #71717c, white, black | Hardcoded fills in the `content-works` set and the Fav songs placeholder                   | matching `--color-*` tokens           |

### Figma values with no matching token

| #   | Value                                                                                              | Where it is used                                                 | Suggestion                                                                                                                |
| --- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | `996px` content width                                                                              | Desktop main page column; overlay inner column (894 + gap + nav) | **New token** `--size-content-max` (D8)                                                                                   |
| 2   | `894px` overlay content width                                                                      | Overlay content column, dividers                                 | **New token** `--size-overlay-content` (D8)                                                                               |
| 3   | `1200px` overlay panel width                                                                       | Both overlays; Frame 77 shows it with 120 px insets on 1440      | **New token** `--size-overlay-max` (D8)                                                                                   |
| 4   | `585px` text measure                                                                               | Experience paragraph, overlay-works title block                  | **New token** `--size-measure` (D8). Keeps lines at about 75 characters                                                   |
| 5   | `26px` gap between content and nav                                                                 | overlay-me (`112:337`). overlay-works uses 24                    | Inconsistent. Normalize to `--spacing-3xl` (24) in the shared `Overlay` (D5) and fix it in Figma                          |
| 6   | `122px` column gap                                                                                 | Desktop footer row (`76:653`)                                    | Keep local: the two outer columns are `flex: 1`, so use `justify-content: space-between` and drop the gap                 |
| 7   | `176px` gap                                                                                        | overlay-works header row (`48:473`), between facts and link icon | Keep local: `justify-content: space-between` (only when a link icon is present)                                           |
| 8   | `0 2px 3.15px rgb(0 0 0 / 0.1)` drop shadow                                                        | Every polaroid (hero, overlay-me About, hometown)                | **New token** `--shadow-polaroid` (D8). The color equals `--black-10`                                                     |
| 9   | `backdrop-filter: blur(6px)`                                                                       | Header (desktop and mobile), mobile menu header                  | **New token** `--blur-header` (D8)                                                                                        |
| 10  | Polaroid frame `260 × 382`, photo inset 20/16/60                                                   | `Polaroid`                                                       | Keep local to the component (padding already uses `--spacing-2xl/xl/8xl`)                                                 |
| 11  | `384 × 483` polaroid_sign slot, signature `49 × 58` at 259/345                                     | `PolaroidSign`                                                   | Keep local: component geometry                                                                                            |
| 12  | Rotations −10.44° (portrait), −4.1° (signature), −11.83°, −3.11°, 6.99°, 1.86° (hometown)          | `PolaroidSign`, `HometownCollage`                                | Keep local, as data (`rotation` field) and not tokens                                                                     |
| 13  | Hometown collage area `894 × 470`, polaroid offsets (first at x −54, overflows the column)         | overlay-me `84:91`                                               | Keep local, as data                                                                                                       |
| 14  | Work cover `486 × 253` (desktop), `358 × 186` (mobile)                                             | `WorkCard`                                                       | Keep local as `aspect-ratio: 486 / 253`. Both frames use the same ratio (1.92)                                            |
| 15  | Cover gradient `149.34°`, stops 2.74 % / 3.37 % / 65.93 %, colors at **0.4 alpha**, over `#efeff1` | Blow Stress Away card cover                                      | **New token** `--gradient-media-cover` (D8), built with `color-mix()` from the gradient tokens + `--color-surface-subtle` |
| 16  | Cover gradient `171.82°`, stops 9.8 % / 88.6 %, colors at **0.2 alpha**                            | overlay-works CES cover                                          | **New token** `--gradient-media-detail` (D8), same approach                                                               |
| 17  | Image opacity `0.2`                                                                                | overlay-works "blue-waves-background"                            | Keep local, or bake the opacity into the exported asset                                                                   |
| 18  | Detail cover `894 × 435`                                                                           | overlay-works cover                                              | Keep local as `aspect-ratio`                                                                                              |
| 19  | `#529bd4`                                                                                          | CES logo fill inside the 120 px icon tile                        | Bake it into the exported CES icon (preferred), or add `--color-brand-ces`                                                |
| 20  | `14px` radius                                                                                      | Blow Stress Away phone screen (desktop card)                     | Part of the mockup artwork. Export the mockup as one image instead of rebuilding it                                       |
| 21  | `54px` logo size                                                                                   | FilmBudget logo on its cover (desktop and mobile)                | Snap to `--size-4xl` (56) or keep as artwork                                                                              |
| 22  | Mockup artwork geometry (phone 142 × 228, 247 × 397; browser 369 × 215; dynamic island 156 × 17)   | Work covers, overlay-works cover                                 | Export each mockup as a single image. Do not rebuild it in CSS                                                            |

**Total: 22 values without a token.** 8 become new tokens (#1–4, #8, #9, #15, #16). The rest stay local component geometry or artwork. The 129 px mobile footer gap from the first audit is fixed in Figma (D12) and no longer counted. Separately, 1 token value mismatch (`icon/strong`) and 1 primitive used directly (`gray/50`).

### Token update plan (implementation stage)

Tokens are exported from Figma and not edited by hand (`docs/design-system.md`). The preferred route: add the variables in Figma and re-export `design-tokens.css` and `.json`. The values below are the target.

| Token                     | Value                                                                                                                                                                                                                         | Layer    | Source        |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------- |
| `--color-icon-strong`     | `var(--gray-900)` (#1e1e1e), was `var(--gray-1000)`                                                                                                                                                                           | Semantic | D6            |
| `--size-content-max`      | `996px`                                                                                                                                                                                                                       | Semantic | D8, table #1  |
| `--size-overlay-content`  | `894px`                                                                                                                                                                                                                       | Semantic | D8, table #2  |
| `--size-overlay-max`      | `1200px`                                                                                                                                                                                                                      | Semantic | D8, table #3  |
| `--size-measure`          | `585px`                                                                                                                                                                                                                       | Semantic | D8, table #4  |
| `--shadow-polaroid`       | `0 2px 3.15px var(--black-10)`                                                                                                                                                                                                | Semantic | D8, table #8  |
| `--blur-header`           | `6px`                                                                                                                                                                                                                         | Semantic | D8, table #9  |
| `--gradient-media-cover`  | `linear-gradient(149.34deg, color-mix(in srgb, var(--color-media-gradient-start) 40%, transparent) 2.74%, … 3.37%, color-mix(in srgb, var(--color-media-gradient-end) 40%, transparent) 65.93%), var(--color-surface-subtle)` | Semantic | D8, table #15 |
| `--gradient-media-detail` | Same pattern at `171.82deg`, stops 9.8 % / 88.6 %, 20 % alpha, over `--color-surface-subtle`                                                                                                                                  | Semantic | D8, table #16 |

The `--size-*` names extend the existing size scale. If the Figma export groups layout widths separately (for example `--layout-*`), follow the export's naming.

---

## 4. Typography mapping

| Figma text style | Figma definition          | CSS class        | Used for                                                                                                                                   |
| ---------------- | ------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Title/title-l`  | Figtree 400, 24, LH "100" | `.text-title-l`  | Greeting "HI, I’m Oleksandra", section headings (Works, Experience, My hometown, Fav songs, Books), overlay-works title, mobile menu links |
| `Title/title-m`  | Figtree 400, 18, LH 1.5   | `.text-title-m`  | overlay-works fact labels (Year, Role, Project type, Team)                                                                                 |
| `Title/title-s`  | Figtree 400, 18, LH "100" | `.text-title-s`  | Role "Independent Designer", overlay nav links, song and book titles (placeholders)                                                        |
| `Body/body-l`    | Figtree 400, 16, LH 1.5   | `.text-body-l`   | Bio paragraphs, experience paragraphs, overlay-works fact values                                                                           |
| `Body/body-m`    | Figtree 400, 16, LH 1.2   | `.text-body-m`   | Logo name, header and footer menu, language chips, "more" button, footer email, overlay-works description                                  |
| `Body/body-s`    | Figtree 300, 16, LH "100" | `.text-body-s`   | Locations, work card descriptions, period "2024 – Present", footer local time, artist and author names (placeholders)                      |
| `Body/body-xs`   | Figtree 400, 14, LH "100" | `.text-body-xs`  | Work title pill ("CES・2026")                                                                                                              |
| `Body/body-2xs`  | Figtree 300, 14, LH "100" | `.text-body-2xs` | Copyright                                                                                                                                  |

Flags:

1. **Line height "100".** Figma reports `lineHeight: 100` for the "auto" styles, while the CSS uses `normal`. Rendered box heights (24 → 29, 18 → 22, 16 → 19, 14 → 17) equal about 1.2 × size, which matches Figtree's `normal`. So the classes agree with the canvas. Check this visually once the font loads, and switch to an explicit `1.2` if `normal` drifts between browsers.
2. **overlay-works description** (`42:436`) uses `body-m` followed by an empty second paragraph that adds 19 px. Do not reproduce the empty line. Use the container gap instead.
3. **Paragraph spacing** in the bio and experience text comes from empty lines inside one text node. Render real `<p>` elements with `margin-block-end: 1lh` (24 px), not `<br>`.
4. **Fav songs placeholder** text has no style bound and hardcoded colors. Ignore it; the block is replaced.
5. **Emoji ✨** in the logo takes the text color token but renders in the OS emoji font, so it looks different on each platform (see §10).
6. Every text style in the design maps to a class. No style is left unmatched.

---

## 5. Assets to export

Figma MCP asset URLs expire after 7 days. Export assets during implementation, not from this document. Put them in `public/images/…` and `src/assets/icons/…` (SVG as React components or `next/image`).

### Icons (SVG, `currentColor`, 24 px unless noted)

| Icon                       | Node ids                                     | Where                                                            | Decorative?                                         |
| -------------------------- | -------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------- |
| Location pin (16 px)       | `5:83`, `84:17`, `84:103`, `222:178`         | Hero, overlay-me About, My hometown                              | Yes (`aria-hidden`), text follows                   |
| LinkedIn                   | `21:279` (tile), `76:676` (footer, box fill) | Experience, footer                                               | No: link needs `aria-label` "LinkedIn"              |
| Behance                    | `21:282`, `76:670`                           | Experience, footer                                               | No: `aria-label`                                    |
| GitHub                     | `21:288`, `76:678`                           | Experience, footer                                               | No: `aria-label`                                    |
| External link              | `42:438`                                     | Work overlay header, only for works with `liveUrl` (not CES, D4) | No: link needs a name, for example "Open live site" |
| Menu (`ci:menu-duo-lg`)    | `I233:657;233:583`                           | Mobile header                                                    | No: button needs `aria-label`, `aria-expanded`      |
| Close (`akar-icons:cross`) | `224:373`                                    | Mobile menu                                                      | No: button needs `aria-label`                       |

The footer icons render in a light gray (`--color-icon-decorative` / `--color-icon-subtle`) and the Experience tiles render in the strong icon color (`--color-icon-strong`, #1e1e1e after D6). Use one icon set with `currentColor`, not two exports. The Behance and GitHub icons are built from clip-path groups in Figma. Export them flattened.

### Images

| Asset                                         | Node / file ref                                                                                        | Notes                                                                                              | Decorative?                                           |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Portrait (default)                            | `179:771` (`6e896.png`)                                                                                | Cropped inside the polaroid (130 % scale, offset)                                                  | No: alt "Portrait of Oleksandra Kokozei"              |
| Portrait (Variant2)                           | `179:779` (`91254.png`)                                                                                | Only if Variant2 is used                                                                           | No                                                    |
| Hometown photos ×4                            | `84:93`, `112:333`, `112:335`, `112:331`                                                               | Photo 1 is mirrored in Figma (`scaleY(-1) rotate(-179.81°)`). Export it already flipped            | No: short alt each (port, opera house, beach, street) |
| CES card cover (sea) + CES logo               | `57:539`, `57:542` (`14537.png`)                                                                       | **The sea layer came through the MCP with no image fill.** It may be a video or an unexported fill | Yes, when the card has visible text                   |
| Ju-Jutsu⁺ card cover (browser mockup)         | `179:767` "Chrome - Light 1"                                                                           | **No image in the MCP export.** Export it manually                                                 | Yes                                                   |
| Blow Stress Away card (phone mockup + screen) | `169:576` (`74413.png`), `169:575`, source `167:40`                                                    | The screen source is a video frame (`kling_…_VIDEO`). Confirm still image or looping video         | Yes                                                   |
| FilmBudget card (photo) + logo                | `59:546`, `59:552` (`12d31.svg`)                                                                       | **The photo came through with no image fill.** Logo is SVG                                         | Yes                                                   |
| overlay-works CES icon tile                   | `184:798` (`b58ba.png` mask + `#529bd4`)                                                               | Export the tile as one flattened image                                                             | Yes (title "CES" follows)                             |
| overlay-works cover: blue waves               | `199:1011` (`43cb9.png`, 20 % opacity)                                                                 | Bake the opacity in                                                                                | Yes                                                   |
| overlay-works cover: phone mockup and screen  | `199:1000` (`74413.png`, same frame as BSA), `199:1005` (`1a126.png`), `199:1007` (`ada13.svg` island) | Reuse the phone frame asset. Export the screen                                                     | Screen: no (alt describes the CES app); frame: yes    |
| Fav songs / Books covers                      | `130:127`–`130:134`                                                                                    | **Out of scope:** ready-made code brings its own                                                   | —                                                     |

Photos for the later work-story sections (D12) are not in Figma yet.

### Signature SVG

- Node `179:772` → `sign` (`8908e.svg`), 49 × 58, rotated −4.1°, placed at x 259, y 345 in the 384 × 483 slot (x 246 on mobile).
- It is decorative (`aria-hidden`): the name is already in the heading.
- The brief asks for an **animated handwritten signature**. A draw-on animation (`stroke-dasharray`/`stroke-dashoffset`) needs **stroke-based paths**. If the export is a filled outline, the designer needs to supply a centerline stroke version (see §10). Always render it fully drawn under `prefers-reduced-motion`.

---

## 6. Interactions and states

MCP read tools do not expose prototype reactions (connections, triggers). The list below comes from what the frames show (layers exported as `<button>`, component variants, in-context frames) and from the decisions above.

| Element                    | What Figma shows                                                                                                         | Implementation                                                                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nav active item (all navs) | Header: active "Me" = `--color-text-strong`, inactive = `--color-text-inactive`. Overlay navs: no active state drawn     | **Active = `--color-text-primary`** in header, mobile menu and overlay nav (D11). Inactive = `--color-text-inactive`. `aria-current="true"` on the active link                   |
| Header scroll-spy          | —                                                                                                                        | Scroll-spy on `#me`, `#works`, `#experience`                                                                                                                                     |
| Footer nav                 | All items `--color-text-inactive`, no active state                                                                       | Plain anchors                                                                                                                                                                    |
| Language switcher          | Current locale: `--color-surface-subtle` chip + `--color-text-primary`; others: no background + `--color-text-disabled`  | Links to `/`, `/uk`, `/de`. `aria-current="true"` on the current one. Colors kept as in Figma (D1)                                                                               |
| "more" button (hero)       | Exported as `<button>`, muted text, no background, pill padding                                                          | Opens overlay-me (`?overlay=me`)                                                                                                                                                 |
| Work card                  | Only the **CES** card (`57:496`) is a `<button>`. The other three are plain frames                                       | All four cards open their work overlay (stretched button in the card heading). Placeholder sections until D12                                                                    |
| Work card variants         | `content-works` set: `default` (cover only), `subtitle`, `tag+subtitle`                                                  | Possibly a hover reveal (pill + description appear). Unconfirmed, see §10                                                                                                        |
| Polaroid variants          | `polaroid_sign` Default ↔ Variant2 (different expression)                                                                | Possibly a hover or click easter egg. Unconfirmed                                                                                                                                |
| Overlay open               | Frame 77: page dimmed behind, panel 1200 wide, 120 px side inset, 80 px top inset, radius 40, header still visible above | `.animate-overlay` (backdrop) + `.animate-modal` (panel). Backdrop color: `--color-overlay-backdrop`. The frame shows it as a flat raster, so check the exact tint               |
| Overlay close (desktop)    | No close button                                                                                                          | **By design (D10):** Esc, backdrop click, browser Back. Opening pushes the query param; all three close paths return to the previous history entry. Focus returns to the trigger |
| Overlay close (mobile)     | Not designed                                                                                                             | **Decided (D10):** full screen, site header + breadcrumbs. The first crumb closes the overlay; Esc and Back work too                                                             |
| Overlay nav                | Vertically centered next to the content                                                                                  | Desktop: sticky at 50 % viewport height. Mobile: sticky top bar                                                                                                                  |
| Work link icon             | 24 px icon at top right (CES frame)                                                                                      | Rendered only when `liveUrl` exists; **not for CES** (D4). `target="_blank" rel="noopener noreferrer"`                                                                           |
| Mobile menu button / close | Hamburger in the mobile header; cross in `menu-overlay-mobile`                                                           | Toggles `MobileMenu` (dialog). Focus goes to the close button on open and back to the menu button on close                                                                       |
| Hover / focus / pressed    | **Not designed for any element**                                                                                         | Design system first (D11): a `:focus-visible` ring from tokens (for example `--border-default` in `--color-text-primary`). Hover states follow from the designer                 |

Because a dialog without a visible close button relies on keyboard and gestures, the first focusable element inside the overlay is its nav. Give the dialog an accessible name (`aria-labelledby` or `titleKey`), and add a visually hidden hint such as "Press Escape to close" through messages.

---

## 7. Overlays

All overlays share one structure (D5, see §2): shell, sticky nav, sections separated by dividers. The tables below are the content data for each one.

Shared geometry (desktop): panel 1200 wide, top padding 80, inner column 996 centered (102 px side padding). Content 894 + gap 24 (normalized from 26) + nav ~77. Sections are separated by `Divider` with 80 px (`--spacing-9xl`) above and below. Heading → content gap is 48 (`--spacing-6xl`).

### overlay-me (`76:686`), `?overlay=me`

| Order | Section id | Nav label | Section heading in Figma                  | Content                                                 | Size (in 894 column)                                                          |
| ----- | ---------- | --------- | ----------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1     | `about`    | About     | "HI, I’m Oleksandra" (same as hero)       | `PolaroidSign` + `AboutIntro` without the "more" button | 894 × 483                                                                     |
| 2     | `home`     | Home      | "My hometown" + location "Odesa, Ukraine" | `HometownCollage` (4 polaroids)                         | 894 × 582                                                                     |
| 3     | `music`    | Music     | "Fav songs"                               | **Slot for ready-made Fav Songs block**                 | 894 × 367 (heading 29 + gap 48 + content 290); starts at y 822 in `Frame 69`  |
| 4     | `books`    | Books     | "Books"                                   | **Slot for ready-made Books block**                     | 894 × 442 (heading 29 + gap 48 + content 365); starts at y 1349 in `Frame 69` |

Nav labels differ from the headings ("Home" vs "My hometown", "Music" vs "Fav songs"). Both go into messages separately.

### Work overlays (`42:429`), `?work=<slug>`

**Implementation moved to a later stage (D12).** The structure is fixed now so the shared `Overlay` supports it from the start.

| Order | Section id | Nav label | Content                                                                                                                                                                 |
| ----- | ---------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | `about`    | About     | Designed for CES: 120 px icon tile (radius 20), title (`title-l`), description (`body-m`), 4 facts, divider, cover 894 × 435 (radius 32). Link icon only with `liveUrl` |
| 2     | `goal`     | Goal      | Later stage: heading, subheading, photo                                                                                                                                 |
| 3     | `problem`  | Problem   | Later stage: heading, subheading, photo                                                                                                                                 |
| 4     | `result`   | Result    | Later stage: heading, subheading, photo                                                                                                                                 |

How the entries differ (data, not components):

| Work                 | Card pill                | Card cover composition                                   | Detail icon tile                            | Link icon                          | Facts in Figma                                                                     |
| -------------------- | ------------------------ | -------------------------------------------------------- | ------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
| CES (key case study) | "CES・2026"              | Sea photo + white CES logo, grey placeholder behind      | CES logo on `#529bd4`                       | **None** (D4)                      | Year 2026 · Role UI/UX Designer · Project type Admin Panel, Mobile App · Team Solo |
| Ju-Jutsu⁺            | "Ju-Jutsu⁺・2026"        | Browser mockup of the Ju-Jutsu site on the pink gradient | not designed                                | None                               | not designed                                                                       |
| Blow Stress Away     | "Blow Stress Away・2026" | Phone mockup on pink/purple gradient (0.4 alpha)         | not designed                                | https://blowstressaway.figma.site/ | not designed                                                                       |
| FilmBudget           | "FilmBudget・2025"       | Full-bleed swimmers photo + FilmBudget logo top right    | not designed (brand colors exist as tokens) | https://www.filmbudget.dk/en/      | not designed                                                                       |

Variation points: `icon`, `cover` (type `'photo' | 'phone-mockup' | 'browser-mockup'` + assets + optional logo), optional `liveUrl`, a variable-length `projectTypeKeys[]` (multi-line values), and the list of work-story sections.

---

## 8. Content inventory (en)

Copy as it should ship. Where Figma differs (typos, look-alike characters), the corrected text is used and the Figma text is noted, per the `AGENTS.md` rule. Message keys are suggestions.

### Header / navigation

| Key                              | Text                                    |
| -------------------------------- | --------------------------------------- |
| `common.logo`                    | ✨ Oleksandra Kokozei                   |
| `nav.me`                         | Me                                      |
| `nav.works`                      | Works                                   |
| `nav.experience`                 | Experience (Figma has a trailing space) |
| `locale.uk` (label)              | ua (locale code `uk`, D9)               |
| `locale.en`                      | en                                      |
| `locale.de`                      | de                                      |
| `nav.openMenu` / `nav.closeMenu` | (not in Figma; needed for aria-labels)  |

Order is Me, Works, Experience in the header, footer and mobile menu (D2).

### Hero (Me)

| Key              | Text                                                                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `me.greeting`    | Hi, I’m Oleksandra (Figma: "HI, Iʼm". Sentence case per owner; `ʼ` U+02BC normalized to `’` U+2019 like the rest of the copy)                                                                                                        |
| `me.location`    | Stuttgart, Germany                                                                                                                                                                                                                   |
| `me.bio.p1`      | I’m a UI/UX designer who loves the space where aesthetics, logic, and technology meet. I’m naturally curious and detail-obsessed, and I enjoy turning messy ideas into clear, intuitive experiences that feel effortless to use.     |
| `me.bio.p2`      | I love not only designing ideas, but bringing them to life which led me to explore AI engineering and turn concepts into functional digital experiences. I learn by making, experimenting, and asking too many “what if?” questions. |
| `me.bio.p3`      | At heart, I’m equal parts visual thinker, problem-solver, and curious builder with a soft spot for thoughtful details.                                                                                                               |
| `me.more`        | more                                                                                                                                                                                                                                 |
| `me.portraitAlt` | (not in Figma)                                                                                                                                                                                                                       |

### Works

| Key                            | Text                                                                |
| ------------------------------ | ------------------------------------------------------------------- |
| `works.heading`                | Works                                                               |
| `works.ces.pill`               | CES・2026                                                           |
| `works.ces.description`        | Admin platform for a complex maritime service ecosystem             |
| `works.jujutsu.pill`           | Ju-Jutsu⁺・2026 (Figma: "Ju -Jutsu⁺", stray space removed)          |
| `works.jujutsu.description`    | AI-assisted school platform for classes, schedules, and school life |
| `works.bsa.pill`               | Blow Stress Away・2026                                              |
| `works.bsa.description`        | Breath-controlled stress relief experiment powered by MediaPipe     |
| `works.filmbudget.pill`        | FilmBudget・2025                                                    |
| `works.filmbudget.description` | Film budgeting services into a clear web experience                 |

Outdated copy in the `content-works` component set: "Mobile App & Admin Panel design for marine company". Do not use it.

### Experience

| Key                                      | Text                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `experience.heading`                     | Experience                                                                                                                                                                                                                                                                                                                                                                                                |
| `experience.role`                        | Independent Designer                                                                                                                                                                                                                                                                                                                                                                                      |
| `experience.period`                      | 2024 – Present (Figma uses a hyphen; an en dash is the correct range mark)                                                                                                                                                                                                                                                                                                                                |
| `experience.p1`                          | Since 2024, I’ve worked independently with international clients on projects across film production, education, logistics, sports, wellness, and service-based businesses.                                                                                                                                                                                                                                |
| `experience.p2`                          | My experience includes corporate websites, conversion-focused landing pages, multi-screen web applications, CRM-style interfaces, dashboards.                                                                                                                                                                                                                                                             |
| `experience.p3`                          | Depending on the project, I work across information architecture, user flows, wireframes, responsive UI, design systems, reusable components, multilingual interfaces, developer handoff, and Webflow/Framer implementation. I also collaborate directly with clients and developers, adapt existing brand systems, and use AI-assisted development to turn selected concepts into functional prototypes. |
| `social.linkedin` / `behance` / `github` | (aria-labels, not in Figma)                                                                                                                                                                                                                                                                                                                                                                               |

### Footer

| Key                | Text                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `footer.localTime` | `{time}, Stuttgart, Germany` (Figma: "13:56 , Stuttgart Germany"; spacing and comma fixed). The time is live |
| `footer.email`     | oleksandra.kokozei.ux@gmail.com                                                                              |
| `footer.copyright` | © `{year}` Oleksandra Kokozei (current year)                                                                 |

### overlay-me

| Key                                                                                                                                                                                                                                                                                     | Text                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `overlayMe.title`                                                                                                                                                                                                                                                                       | (dialog name, not in Figma; for example "About me")      |
| `overlayMe.nav.*`                                                                                                                                                                                                                                                                       | About · Home · Music · Books                             |
| `overlayMe.hometown.heading`                                                                                                                                                                                                                                                            | My hometown                                              |
| `overlayMe.hometown.location`                                                                                                                                                                                                                                                           | Odesa, Ukraine                                           |
| `overlayMe.music.heading`                                                                                                                                                                                                                                                               | Fav songs                                                |
| `overlayMe.books.heading`                                                                                                                                                                                                                                                               | Books                                                    |
| `overlay.closeHint`                                                                                                                                                                                                                                                                     | (visually hidden, not in Figma; "Press Escape to close") |
| About section                                                                                                                                                                                                                                                                           | Reuses `me.greeting`, `me.location`, `me.bio.*`          |
| Placeholder content (Fav songs: Wicked Game / Chris Isaak; Raindance / Dave, Tems; Trance / Metro Boomin, Travis Scott, Young Thug. Books: Good Night, Mr. Holmes / Carole Nelson Douglas; The Like Switch / Jack Schafer & Marvin Karlins; The Design of Everyday Things / Don Norman) | Owned by the ready-made code. Listed for reference only  |

### Work overlays (CES, later stage)

| Key                              | Text                                                    |
| -------------------------------- | ------------------------------------------------------- |
| `overlayWorks.nav.*`             | About · Goal · Problem · Result                         |
| `overlayWorks.facts.year`        | Year                                                    |
| `overlayWorks.facts.role`        | Role                                                    |
| `overlayWorks.facts.projectType` | Project type                                            |
| `overlayWorks.facts.team`        | Team                                                    |
| `works.ces.title`                | CES                                                     |
| `works.ces.description`          | Admin platform for a complex maritime service ecosystem |
| `works.ces.facts`                | 2026 · UI/UX Designer · Admin Panel / Mobile App · Solo |
| `overlayWorks.openLiveSite`      | (aria-label, not in Figma; works with `liveUrl` only)   |
| Goal / Problem / Result          | Heading, subheading, photo alt per work. To be written  |

---

## 9. Responsive: desktop vs mobile, breakpoints, mobile brief

### 9.1 What changes between desktop (1440) and mobile (390)

| Section     | Desktop (`2:2`)                                                                                                                                          | Mobile (`220:74`)                                                                                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Header      | Padding 32 / 120. Logo left, nav centered, language chips right                                                                                          | Padding 32 / 16. Logo + 24 px menu button. Nav and language move into `menu-overlay-mobile`                                                                                                            |
| Mobile menu | —                                                                                                                                                        | Full screen, white. Close (×) top right. Links in `title-l`, left aligned, vertically centered, gap 24. Order Me / Works / Experience (D2; Figma to be updated). Language chips centered at the bottom |
| Hero        | Row, bottom-aligned: polaroid slot 384 × 483 + text column 486, gap 24. "more" right aligned                                                             | Column: polaroid slot full width × 483 (polaroid at x 17 instead of 30, signature at x 246), then text, gap 24. "more" right aligned. Top gap under header 0 instead of 48                             |
| Dividers    | 996 wide, 80 above and below                                                                                                                             | 358 wide (inset 16), 48 above and below                                                                                                                                                                |
| Works       | Heading → grid gap 48. 2 × 2 grid, cards 486 wide, cover 253 tall, row gap 24, column gap 24. Description padding 12 (left) / 8 (right, first card only) | Heading → list gap 40. Single column, cover 358 × 186 (same ratio). Gap 24 inside each pair, 32 between pairs (inconsistent; use one gap). Description padding 8. Descriptions wrap to two lines       |
| Work covers | CES logo centered; BSA phone 142 × 228; FilmBudget logo at x 416                                                                                         | Artwork scaled about 0.72. **FilmBudget logo stays at x 416, outside the 358 px card, so it is clipped.** Fix: anchor it top right                                                                     |
| Experience  | Text measure 585. Social tiles row                                                                                                                       | Text full width (358). Same tiles, gap 24                                                                                                                                                              |
| Footer      | Row: logo + time │ nav │ email + icons, gap 122 (space-between). Copyright centered below, gap 56                                                        | Column, gap 40: logo + time, nav (vertical, gap 12), email + icons. Copyright centered, gap 56. Gap above footer follows the section rhythm (D12)                                                      |

### 9.2 Breakpoints (D7)

Frame widths in the file: **390** (mobile page and menu), **1440** (desktop page), **1200** (overlay panel = 1440 − 2 × 120 inset). Content widths: 996 (desktop column), 894 (overlay content), 358 (mobile column).

| Name | Min width | Layout                                                                                                                          |
| ---- | --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| base | 0         | Mobile frame `220:74`, designed at **390**. Fluid below it down to **320** (safety net). `PolaroidSign` scales to the container |
| md   | 768       | Tablet. **Not designed** (see brief). Interim: mobile header and hero, 2-column works grid, desktop-style footer row            |
| lg   | 1024      | Desktop structure: inline header nav, hero row, 2 × 2 grid. Side padding `--spacing-5xl` (40); overlays with reduced insets     |
| xl   | 1440      | Pixel match with Figma: header padding 120, content 996 centered, overlay 1200 with 120 / 80 insets                             |

`sm` (480) is removed: the 390 frame is fully fluid (every block is full width minus 16), so nothing changes between 390 and 767.

Why these values hold against the layout:

- **Hero row needs ≥ 894 px of content**: 384 + 24 + 486. At 1024 with 40 px padding there are 944 px, which fits. With the Figma 120 px padding it would not (784 px).
- **Header row** at 1024 leaves room for logo (~150) + nav (~212) + chips (~167) ≈ 530.
- **Overlay** needs the 1200 panel + 2 × 120 insets = 1440 to match Figma. Below that, insets shrink before the panel does.
- **Works grid**: two columns work down to about 700 px of content (cards ≥ 340, cover height follows `aspect-ratio`).
- **320 safety net**: at 320 the column is 288 px, narrower than the 384 px polaroid slot. `PolaroidSign` scales to its container (for example `inline-size: 100%; aspect-ratio: 384 / 483` with inner geometry in percentages, or a container-query scale). No other block needs a fixed width.

Between `lg` and `xl`, side padding grows fluidly, for example `clamp(var(--spacing-5xl), …, var(--spacing-10xl))`. Content keeps `max-inline-size: var(--size-content-max)`. Update `src/styles/breakpoints.css` and `docs/design-system.md` in the first implementation PR, not in this one.

### 9.3 Mobile brief for the designer (screens not designed yet)

Main page (mobile) and the mobile menu are designed. The mobile menu only needs its order changed to Me / Works / Experience (D2). The list below covers the gaps, highest priority first.

**P1: Mobile overlay exit control. Affects every overlay.**

- _Decided (D10, stage 4.1):_ The overlay opens full screen like `275:815`: the site header with a working burger, breadcrumbs ("Me › More", "Works › <project>"), the sections 48 px apart, then the footer. The first breadcrumb closes the overlay. No section nav on mobile.
- _Was open:_ How the user leaves it. On desktop, Esc, backdrop and Back cover this. On a phone there is no Esc and no backdrop, and the Back gesture is not obvious to everyone.
- _Directions:_
  1. **Close (×) in the top bar**, in the same spot as the mobile menu's close button, with the section nav beside or under it. Consistent with the menu.
  2. **Back arrow (←) at the top left**. It reads as "return to the page" and matches the browser Back behavior.
  3. **Swipe down to dismiss** with a grab handle, plus one of the above as the visible fallback.
- Also decide: the nav style in the top bar (horizontal scrollable tabs, or a compact dropdown), and whether the page header stays hidden under the overlay.

**P2: overlay-me, "My hometown" collage.**

- _Problem:_ 4 overlapping, rotated 260 × 382 polaroids spread over a 894 × 470 area, with the first one overflowing the column by 54 px. At 358 px, even one polaroid barely fits.
- _Directions:_ (1) Horizontal scroll-snap carousel of polaroids, keeping the rotations. (2) A 2 × 2 "scattered" grid at ~0.6 scale with overlap. (3) A stacked deck: tap or swipe to bring the next photo to the front.

**P3: overlay-me, Fav songs and Books slots.**

- _Problem:_ Both ready-made blocks are rows of three 280 px items (888 px). They cannot sit side by side at 390.
- _Directions:_ (1) Horizontal scroll row with the next item peeking. (2) Vertical list with a smaller thumbnail on the left and title and artist on the right. (3) Keep the ready-made block's own responsive behavior; the designer only confirms the spacing around it. Check what the ready-made code already does before designing.

**P4: Tablet widths (768–1023), main page.**

- _Problem:_ Not designed. At this width the hero row (needs 894) does not fit, but the single-column mobile layout wastes space.
- _Directions:_ (1) Mobile layout with the 2-column works grid and the footer as a row. (2) Hero with a smaller polaroid (~280) beside the text. (3) Centered single column at ~600 px max width.
- Also decide whether the header shows the inline nav or the hamburger at 768.

**P5: Laptop widths (1024–1439), overlays.**

- _Problem:_ The Figma overlay insets only fit at 1440.
- _Directions:_ (1) Insets shrink fluidly from 120 to 40 while the panel stays max 1200. (2) Fixed 40 px insets below 1440. (3) The panel becomes full width with radius 0 below a threshold.

**Later stage (with the work overlays, D12):** mobile layout of the work header and facts (4 × 180 px columns), the 894 × 435 cover with a phone mockup, and the heading / subheading / photo story sections. The desktop design of those sections comes first.

---

## 10. Open questions and risks (by impact)

| #   | Risk / question                                                                                                                                                                                                                                                                                                                  | Impact                                                           | Handling                                                                                                                                        |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Mobile overlay exit control** (D10). Resolved in stage 4.1: the first breadcrumb closes the overlay                                                                                                                                                                                                                            | Usability of both overlays on mobile                             | Done. Revisit after usability checks on phones                                                                                                  |
| 2   | **Known accessibility trade-off: text contrast (D1).** `--color-text-inactive` #9f9faa 2.62:1 and `--color-text-muted` #a1a1aa 2.56:1 on white fall below WCAG 2.2 AA 4.5:1. Both are used for nav links, work descriptions and the "more" button. `--color-text-disabled` #d0d0d4 1.54:1 is used for interactive language chips | Lighthouse accessibility score; readability for low-vision users | **Kept as designed for now.** Revisit later. When it changes, it changes in Figma and the token export, not in component CSS                    |
| 3   | **Desktop overlays have no visible close control (D10).** Mouse users close via backdrop or Back; keyboard users via Esc                                                                                                                                                                                                         | Discoverability                                                  | Accessible dialog name, visually hidden "Press Escape to close" hint, focus return to the trigger. Watch in usability checks                    |
| 4   | **Work overlays postponed (D12).** Goal / Problem / Result content (heading, subheading, photo) and details for Ju-Jutsu⁺, Blow Stress Away and FilmBudget are not designed. CES is the key case study                                                                                                                           | Work cards have no destination at launch                         | Build the shared `Overlay` so work overlays plug in later. Decide what the cards do before then: disabled, CES only, or cards without an action |
| 5   | **Cover images missing from the MCP export.** CES sea, Ju-Jutsu browser shot and FilmBudget photo came back as empty fills (possibly video fills). The BSA screen source is a video frame                                                                                                                                        | Main-page visuals cannot match 1:1                               | Designer exports these manually (WebP/AVIF, 2×). Decide still image or looping video (video adds weight and needs reduced-motion handling)      |
| 6   | **Signature animation feasibility.** The export may be a filled outline, not a stroke path                                                                                                                                                                                                                                       | Hero "wow" detail                                                | Inspect the SVG when exporting. If it is filled, ask for a centerline stroke version, or use a clip-path wipe as fallback                       |
| 7   | **Undocumented variants.** `polaroid_sign` Variant2 (different expression) and `content-works` default / subtitle / tag+subtitle. Trigger unknown (hover? click?)                                                                                                                                                                | Interaction scope                                                | Ask. Build the default state first                                                                                                              |
| 8   | **No hover states** for any control                                                                                                                                                                                                                                                                                              | Perceived polish                                                 | Focus ring from the design system now (D11). Hover states from the designer                                                                     |
| 9   | **Token changes pending (D6, D8).** `--color-icon-strong` must become #1e1e1e; 8 new tokens; `gray/50` primitive bound in Figma                                                                                                                                                                                                  | Hardcoded values would break the token rule                      | Token update plan in §3, done as the first implementation PR via Figma re-export                                                                |
| 10  | **Mobile layout details in Figma.** FilmBudget logo clipped (x 416 in a 358 card); inconsistent card gaps (24 vs 32)                                                                                                                                                                                                             | Mobile polish                                                    | Implement the fixes noted in §9.1 and confirm with the designer                                                                                 |
| 11  | **Footer live clock.** The server-rendered time differs from the client time, causing a hydration mismatch                                                                                                                                                                                                                       | Console errors, layout jump                                      | Render the time client-only (`useEffect`) with a fixed-width placeholder; timezone `Europe/Berlin`                                              |
| 12  | **Emoji in the logo** (✨) renders differently per OS and is read aloud by screen readers                                                                                                                                                                                                                                        | Brand consistency                                                | `aria-hidden` on the emoji. Optionally replace it with an SVG sparkle (needs design)                                                            |

Resolved since the first audit: close button (D10), overlay routing (D10), mobile overlay exit (D10, breadcrumbs), content mismatches with the brief (D2–D4, D9), Cyrillic look-alikes and the 129 px gap (D12), active nav color (D11), `icon/strong` value (D6).

---

## Implementation order

1. **Tokens:** add the 8 new tokens and fix `--color-icon-strong` (§3 token update plan); update breakpoints to 768 / 1024 / 1440 (§9.2).
2. **Layout shell:** `SiteHeader` (desktop and mobile), `MobileMenu`, `SiteFooter`, `LocalTime`, `useScrollSpy`.
3. **Main page sections:** Hero (`PolaroidSign` without animation), Works, Experience. Content in data files and messages (en first).
4. **Shared overlay:** `Overlay`, `OverlayNav`, `OverlaySection`, `useOverlayRoute`, then overlay-me (with Fav Songs and Books slots).
5. **Motion:** signature animation, `.reveal` scroll animations, reduced-motion checks.
6. **Locales and responsive:** uk and de messages; tablet and mobile overlay work from the designer's answers to §9.3.
7. **Later stage:** work overlays (CES first, then the other three) with heading / subheading / photo story sections, plus their mobile layout.
