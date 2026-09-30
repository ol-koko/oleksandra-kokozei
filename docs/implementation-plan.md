# Implementation plan: Figma audit

Audit of Figma file `vJCOCkFcnVJ9Pn4TFuRHV9`, section `107:329` ("Design Website"), made through Figma MCP reads only. It maps the design onto the existing stack (Next.js App Router, CSS Modules, `design-system/design-tokens.css`, next-intl) before any UI code is written.

Conventions used below:

- Node ids are written `123:456` (the URL form is `123-456`).
- "Desktop" means the 1440 px frames, "mobile" means the 390 px frames.
- A value is "unbound" when Figma shows a raw number that equals an existing token but is not linked to the variable. Unbound values map to tokens; they are not missing tokens.

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

| Measure                           | Desktop (1440)                                    | Mobile (390)                                       |
| --------------------------------- | ------------------------------------------------- | -------------------------------------------------- |
| Header height                     | 91 (padding 32 / 120)                             | 91 (padding 32 / 16)                               |
| Content column                    | 996 wide, centered (side margin 222)              | 358 wide (side padding 16)                         |
| Header → hero                     | 48 (`--spacing-6xl`)                              | 0 (hero starts right under the header)             |
| Between sections (divider rhythm) | 80 (`--spacing-9xl`) above and below each divider | 48 (`--spacing-6xl`)                               |
| Last section → footer             | 80                                                | 129 (no token, probably a canvas artifact; see §3) |

---

## 2. Section-to-component map

Proposed file layout: `src/components/<area>/<Component>/<Component>.tsx` + `.module.css`. Content comes from typed data in `src/content/*.ts` and copy from `messages/{en,uk,de}.json`.

### Layout and shared

| Component          | Responsibility                                                                                     | Props                                                                                            | Reused in                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `SiteHeader`       | Sticky, blurred header. Desktop: logo, `SectionNav`, `LanguageSwitcher`. Mobile: logo, menu button | `activeSectionId: SectionId`                                                                     | Page                                                                                   |
| `Logo`             | ✨ + name, links to top                                                                            | `as?: 'a' \| 'span'`                                                                             | Header (desktop and mobile), footer                                                    |
| `SectionNav`       | Anchor links Me / Works / Experience with an active state                                          | `items: NavItem[]`, `activeId?: SectionId`, `orientation: 'row' \| 'column'`, `size: 'm' \| 'l'` | Header (row, m), footer (row on desktop, column on mobile, m), mobile menu (column, l) |
| `LanguageSwitcher` | Locale chips ua/en/de. The current locale gets the subtle chip background                          | `currentLocale: Locale`                                                                          | Desktop header, mobile menu                                                            |
| `MobileMenu`       | Full-screen dialog with close button, `SectionNav`, `LanguageSwitcher`                             | `open: boolean`, `onClose(): void`                                                               | Mobile header                                                                          |
| `SectionHeading`   | `h2` with `.text-title-l`                                                                          | `id`, `children`                                                                                 | Works, Experience, overlay-me sections, overlay-works sections                         |
| `Divider`          | 1 px `--color-border-subtle` rule                                                                  | none                                                                                             | Main page (between sections), overlay-me, overlay-works, footer                        |
| `LocationLabel`    | Pin icon + muted text                                                                              | `label: string`                                                                                  | Hero, overlay-me About, My hometown                                                    |
| `Polaroid`         | White frame (padding 20 / 16 / 60), photo, drop shadow, rotation                                   | `src`, `alt`, `rotation: number`, `priority?`                                                    | `PolaroidSign`, hometown collage                                                       |
| `PolaroidSign`     | 384 × 483 slot: rotated `Polaroid` with the portrait, plus the animated signature SVG              | `variant: 'default' \| 'alt'`, `animateSignature?: boolean`                                      | Hero, overlay-me About                                                                 |
| `SocialLinks`      | LinkedIn / Behance / GitHub (+ Notion?) links                                                      | `variant: 'tile' \| 'inline'`, `links: SocialLink[]`                                             | Experience (tile 64 px), footer (inline 24 px)                                         |
| `SiteFooter`       | Logo, `LocalTime`, `SectionNav`, email link, `SocialLinks`, copyright                              | none                                                                                             | Page                                                                                   |
| `LocalTime`        | Client component: live HH:mm in `Europe/Berlin` + location                                         | `timeZone: string`, `locationLabel: string`                                                      | Footer                                                                                 |
| `useScrollSpy`     | Hook: IntersectionObserver → active section id                                                     | `ids: string[]`, `root?: Element \| null`                                                        | Header nav, both overlay navs                                                          |

### Main page sections

| Component           | Responsibility                                                                     | Props                                          | Reused in                       |
| ------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------- |
| `HeroSection`       | Section `#me`: `PolaroidSign` + `AboutIntro` + "more" button that opens overlay-me | none                                           | Page                            |
| `AboutIntro`        | Greeting (`h1` on page, `h2` in overlay), location, 3-paragraph bio                | `headingLevel: 1 \| 2`                         | Hero, overlay-me About          |
| `WorksSection`      | Section `#works`: heading + grid of `WorkCard`                                     | `works: Work[]`                                | Page                            |
| `WorkCard`          | Button that opens overlay-works: cover, `TitlePill`, description                   | `work: Work`, `onOpen(slug): void`             | Works grid                      |
| `TitlePill`         | White pill "Name・Year" on the cover                                               | `label: string`                                | `WorkCard`                      |
| `WorkCover`         | Per-work cover artwork (image, gradient, mockup, logo)                             | `cover: WorkCover`, `size: 'card' \| 'detail'` | `WorkCard`, overlay-works cover |
| `ExperienceSection` | Section `#experience`: role, period, 3 paragraphs, `SocialLinks` tile              | `roles: Role[]`                                | Page                            |

### Overlays

| Component          | Responsibility                                                                                                                                                                               | Props                                                                | Reused in                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------- |
| `Overlay`          | Modal shell: `<dialog>`, backdrop, 1200 px panel (radius 40), own scroll container, focus trap, Esc/backdrop close, restores focus, locks body scroll, `.animate-overlay` / `.animate-modal` | `open`, `onClose`, `labelledBy`, `nav: OverlayNavItem[]`, `children` | overlay-me, overlay-works |
| `OverlayNav`       | Sticky, vertically centered, right-aligned `.text-title-s` links with scroll-spy inside the overlay scroller                                                                                 | `items: { id; label }[]`, `activeId`                                 | Both overlays             |
| `OverlayMe`        | Sections About / Home / Music / Books                                                                                                                                                        | none                                                                 | Page                      |
| `HometownCollage`  | 4 overlapping, rotated `Polaroid`s in a 894 × 470 area                                                                                                                                       | `photos: HometownPhoto[]` (src, alt, rotation, x, y)                 | overlay-me                |
| `FavSongsSlot`     | Mount point for the ready-made Fav Songs block (894 × 367 incl. heading)                                                                                                                     | none                                                                 | overlay-me                |
| `BooksSlot`        | Mount point for the ready-made Books block (894 × 442 incl. heading)                                                                                                                         | none                                                                 | overlay-me                |
| `OverlayWorks`     | Detail for one work, selected by slug                                                                                                                                                        | `work: Work`                                                         | Page                      |
| `WorkDetailHeader` | 120 px icon tile, title, one-line description, external link icon                                                                                                                            | `work: Work`                                                         | overlay-works             |
| `WorkFacts`        | 4 label/value columns: Year, Role, Project type, Team                                                                                                                                        | `facts: WorkFacts`                                                   | overlay-works             |
| `WorkStorySection` | Goal / Problem / Result text blocks (not designed yet)                                                                                                                                       | `id`, `title`, `body`                                                | overlay-works             |

Data types (first cut): `Work { slug; name; year; titleKey; descriptionKey; liveUrl?; icon; cover: WorkCover; facts: { year; roleKey; projectTypeKeys[]; teamKey } }`, `SocialLink { id: 'linkedin' | 'behance' | 'github' | 'notion'; href; labelKey }`, `HometownPhoto { src; altKey; rotation; x; y }`.

The overlays open through URL state (`?overlay=me`, `?work=ces`) so they can be linked and the back button closes them. This needs confirmation (§10).

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
| `color/icon/strong`                                              | **#1e1e1e**         | `--color-icon-strong` → `--gray-1000` (**#000000**)     | ⚠️ **Value mismatch.** Re-export tokens or confirm which is correct                                     |
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

| #   | Value                                                                                              | Where it is used                                                 | Suggestion                                                                                                      |
| --- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | `996px` content width                                                                              | Desktop main page column; overlay inner column (894 + gap + nav) | New layout token `--size-content-max: 996px` (used as `max-inline-size`)                                        |
| 2   | `894px` overlay content width                                                                      | overlay-me and overlay-works content column, dividers            | New token `--size-overlay-content: 894px`, or derive it: 996 − nav column − gap                                 |
| 3   | `1200px` overlay panel width                                                                       | Both overlays; Frame 77 shows it with 120 px insets on 1440      | New token `--size-overlay-max: 1200px`                                                                          |
| 4   | `585px` text measure                                                                               | Experience paragraph, overlay-works title block                  | New token `--size-measure: 585px` (keeps line length about 75 characters)                                       |
| 5   | `26px` gap between content and nav                                                                 | overlay-me (`112:337`). overlay-works uses 24                    | Inconsistent. Normalize to `--spacing-3xl` (24) and fix it in Figma                                             |
| 6   | `122px` column gap                                                                                 | Desktop footer row (`76:653`)                                    | Keep local: the two outer columns are `flex: 1`, so use `justify-content: space-between` and drop the gap       |
| 7   | `176px` gap                                                                                        | overlay-works header row (`48:473`), between facts and link icon | Keep local: `justify-content: space-between`                                                                    |
| 8   | `0 2px 3.15px rgb(0 0 0 / 0.1)` drop shadow                                                        | Every polaroid (hero, overlay-me About, hometown)                | New token `--shadow-polaroid`. The color equals `--black-10`                                                    |
| 9   | `backdrop-filter: blur(6px)`                                                                       | Header (desktop and mobile), mobile menu header                  | New token `--blur-header: 6px`                                                                                  |
| 10  | Polaroid frame `260 × 382`, photo inset 20/16/60                                                   | `Polaroid`                                                       | Keep local to the component (padding already uses `--spacing-2xl/xl/8xl`)                                       |
| 11  | `384 × 483` polaroid_sign slot, signature `49 × 58` at 259/345                                     | `PolaroidSign`                                                   | Keep local: component geometry                                                                                  |
| 12  | Rotations −10.44° (portrait), −4.1° (signature), −11.83°, −3.11°, 6.99°, 1.86° (hometown)          | `PolaroidSign`, `HometownCollage`                                | Keep local, as data (`rotation` field) and not tokens                                                           |
| 13  | Hometown collage area `894 × 470`, polaroid offsets (first at x −54, overflows the column)         | overlay-me `84:91`                                               | Keep local, as data                                                                                             |
| 14  | Work cover `486 × 253` (desktop), `358 × 186` (mobile)                                             | `WorkCard`                                                       | Keep local as `aspect-ratio: 486 / 253`. Both frames use the same ratio (1.92)                                  |
| 15  | Cover gradient `149.34°`, stops 2.74 % / 3.37 % / 65.93 %, colors at **0.4 alpha**, over `#efeff1` | Blow Stress Away card cover                                      | New token `--gradient-media-cover` built with `color-mix()` from the gradient tokens + `--color-surface-subtle` |
| 16  | Cover gradient `171.82°`, stops 9.8 % / 88.6 %, colors at **0.2 alpha**                            | overlay-works CES cover                                          | Same approach: `--gradient-media-detail`, or one gradient token with an alpha parameter                         |
| 17  | Image opacity `0.2`                                                                                | overlay-works "blue-waves-background"                            | Keep local, or bake the opacity into the exported asset                                                         |
| 18  | Detail cover `894 × 435`                                                                           | overlay-works cover                                              | Keep local as `aspect-ratio`                                                                                    |
| 19  | `#529bd4`                                                                                          | CES logo fill inside the 120 px icon tile                        | Bake it into the exported CES icon (preferred), or add `--color-brand-ces`                                      |
| 20  | `14px` radius                                                                                      | Blow Stress Away phone screen (desktop card)                     | Part of the mockup artwork. Export the mockup as one image instead of rebuilding it                             |
| 21  | `54px` logo size                                                                                   | FilmBudget logo on its cover (desktop and mobile)                | Snap to `--size-4xl` (56) or keep as artwork                                                                    |
| 22  | `129px` content → footer gap                                                                       | Mobile main page (`220:74`)                                      | Probably a canvas artifact. Use `--spacing-6xl` (48) to match the mobile section rhythm and confirm it          |
| 23  | Mockup artwork geometry (phone 142 × 228, 247 × 397; browser 369 × 215; dynamic island 156 × 17)   | Work covers, overlay-works cover                                 | Export each mockup as a single image. Do not rebuild it in CSS                                                  |

**Total: 23 values without a token.** Of these, 6 are worth a new token (#1–4, #8, #9) and 2 are gradient tokens (#15–16). The rest stay local component geometry or artwork. Separately, 1 token value mismatch (`icon/strong`) and 1 primitive used directly (`gray/50`).

---

## 4. Typography mapping

| Figma text style | Figma definition          | CSS class        | Used for                                                                                                                                   |
| ---------------- | ------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Title/title-l`  | Figtree 400, 24, LH "100" | `.text-title-l`  | Greeting "HI, Iʼm Oleksandra", section headings (Works, Experience, My hometown, Fav songs, Books), overlay-works title, mobile menu links |
| `Title/title-m`  | Figtree 400, 18, LH 1.5   | `.text-title-m`  | overlay-works fact labels (Year, Role, Project type, Team)                                                                                 |
| `Title/title-s`  | Figtree 400, 18, LH "100" | `.text-title-s`  | Role "Independent Designer", overlay nav links, song and book titles (placeholders)                                                        |
| `Body/body-l`    | Figtree 400, 16, LH 1.5   | `.text-body-l`   | Bio paragraphs, experience paragraphs, overlay-works fact values                                                                           |
| `Body/body-m`    | Figtree 400, 16, LH 1.2   | `.text-body-m`   | Logo name, header and footer menu, language chips, "more" button, footer email, overlay-works description                                  |
| `Body/body-s`    | Figtree 300, 16, LH "100" | `.text-body-s`   | Locations, work card descriptions, period "2024 - Present", footer local time, artist and author names (placeholders)                      |
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

| Icon                       | Node ids                                     | Where                               | Decorative?                                         |
| -------------------------- | -------------------------------------------- | ----------------------------------- | --------------------------------------------------- |
| Location pin (16 px)       | `5:83`, `84:17`, `84:103`, `222:178`         | Hero, overlay-me About, My hometown | Yes (`aria-hidden`), text follows                   |
| LinkedIn                   | `21:279` (tile), `76:676` (footer, box fill) | Experience, footer                  | No: link needs `aria-label` "LinkedIn"              |
| Behance                    | `21:282`, `76:670`                           | Experience, footer                  | No: `aria-label`                                    |
| GitHub                     | `21:288`, `76:678`                           | Experience, footer                  | No: `aria-label`                                    |
| Notion                     | not in Figma                                 | Brief lists it                      | See §10                                             |
| External link              | `42:438`                                     | overlay-works header                | No: link needs a name, for example "Open live site" |
| Menu (`ci:menu-duo-lg`)    | `I233:657;233:583`                           | Mobile header                       | No: button needs `aria-label`, `aria-expanded`      |
| Close (`akar-icons:cross`) | `224:373`                                    | Mobile menu                         | No: button needs `aria-label`                       |

The footer icons render in a light gray (`--color-icon-decorative` / `--color-icon-subtle`) and the Experience tiles render in the strong icon color. Use one icon set with `currentColor`, not two exports. The Behance and GitHub icons are built from clip-path groups in Figma. Export them flattened.

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

### Signature SVG

- Node `179:772` → `sign` (`8908e.svg`), 49 × 58, rotated −4.1°, placed at x 259, y 345 in the 384 × 483 slot (x 246 on mobile).
- It is decorative (`aria-hidden`): the name is already in the heading.
- The brief asks for an **animated handwritten signature**. A draw-on animation (`stroke-dasharray`/`stroke-dashoffset`) needs **stroke-based paths**. If the export is a filled outline, the designer needs to supply a centerline stroke version (see §10). Always render it fully drawn under `prefers-reduced-motion`.

---

## 6. Interactions and states visible in Figma

MCP read tools do not expose prototype reactions (connections, triggers). The list below comes from what the frames show: layers exported as `<button>`, component variants, and in-context frames.

| Element                    | What Figma shows                                                                                                         | Implementation note                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header nav active item     | Active "Me" = `--color-text-strong` (#000); inactive = `--color-text-inactive` (#9f9faa)                                 | Scroll-spy on `#me`, `#works`, `#experience`. `aria-current="true"` on the active link                                                                                 |
| Footer nav                 | All items `--color-text-inactive`, no active state                                                                       | Plain anchors                                                                                                                                                          |
| Language switcher          | Current locale: `--color-surface-subtle` chip + `--color-text-primary`; others: no background + `--color-text-disabled`  | Links to `/`, `/uk`, `/de`. `aria-current="true"` on the current one. **Contrast issue, see §10**                                                                      |
| "more" button (hero)       | Exported as `<button>`, muted text, no background, pill padding                                                          | Opens overlay-me                                                                                                                                                       |
| Work card                  | Only the **CES** card (`57:496`) is a `<button>`. The other three are plain frames                                       | Make all four cards buttons that open overlay-works. The detail exists for CES only (see §7)                                                                           |
| Work card variants         | `content-works` set: `default` (cover only), `subtitle`, `tag+subtitle`                                                  | Possibly a hover reveal (pill + description appear). Unconfirmed, see §10                                                                                              |
| Polaroid variants          | `polaroid_sign` Default ↔ Variant2 (different expression)                                                                | Possibly a hover or click easter egg. Unconfirmed                                                                                                                      |
| Overlay open               | Frame 77: page dimmed behind, panel 1200 wide, 120 px side inset, 80 px top inset, radius 40, header still visible above | Use `.animate-overlay` (backdrop) + `.animate-modal` (panel). Backdrop color: `--color-overlay-backdrop`. The frame shows it as a flat raster, so check the exact tint |
| Overlay close              | **No close button in either desktop overlay**                                                                            | Needs a design. Esc and backdrop click in any case                                                                                                                     |
| Overlay nav                | All items `--color-text-inactive`. **No active state drawn.** Nav is vertically centered next to the content             | Assume active = `--color-text-strong`, same as the header. Sticky at 50 % viewport height                                                                              |
| overlay-works link icon    | 24 px icon at top right                                                                                                  | External link, `target="_blank" rel="noopener noreferrer"`                                                                                                             |
| Mobile menu button / close | Hamburger in the mobile header; cross in `menu-overlay-mobile`                                                           | Toggles `MobileMenu` (dialog). Focus goes to the close button on open and back to the menu button on close                                                             |
| Hover / focus / pressed    | **Not designed for any element**                                                                                         | Needs a design decision. Minimum: a visible `:focus-visible` ring from tokens                                                                                          |

---

## 7. Overlays

### overlay-me (`76:686`)

| Order | Section id | Nav label | Section heading in Figma                  | Content                                                 | Size (in 894 column)                                                          |
| ----- | ---------- | --------- | ----------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1     | `about`    | About     | "HI, Iʼm Oleksandra" (same as hero)       | `PolaroidSign` + `AboutIntro` without the "more" button | 894 × 483                                                                     |
| 2     | `home`     | Home      | "My hometown" + location "Odesa, Ukraine" | `HometownCollage` (4 polaroids)                         | 894 × 582                                                                     |
| 3     | `music`    | Music     | "Fav songs"                               | **Slot for ready-made Fav Songs block**                 | 894 × 367 (heading 29 + gap 48 + content 290); starts at y 822 in `Frame 69`  |
| 4     | `books`    | Books     | "Books"                                   | **Slot for ready-made Books block**                     | 894 × 442 (heading 29 + gap 48 + content 365); starts at y 1349 in `Frame 69` |

- Sections are separated by `Divider` with 80 px (`--spacing-9xl`) above and below. Heading → content gap is 48 (`--spacing-6xl`).
- Panel: 1200 wide, top padding 80, inner column 996 centered (102 px side padding). Content 894 + gap 26 (normalize to 24) + nav 77.
- Nav labels differ from the headings ("Home" vs "My hometown", "Music" vs "Fav songs"). Both go into messages separately.

### overlay-works (`42:429`)

| Order | Section id | Nav label | Content in Figma                                                                                                                           |
| ----- | ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1     | `about`    | About     | 120 px icon tile (radius 20), title (`title-l`), description (`body-m`), 4 facts, external link icon, divider, cover 894 × 435 (radius 32) |
| 2     | `goal`     | Goal      | **Not designed**                                                                                                                           |
| 3     | `problem`  | Problem   | **Not designed**                                                                                                                           |
| 4     | `result`   | Result    | **Not designed**                                                                                                                           |

Only **CES** has a detail frame. How the entries differ, based on the main-page cards and the brief:

| Work             | Card pill                | Card cover composition                                   | Detail icon tile                            | Live link                           | Facts in Figma                                                                     |
| ---------------- | ------------------------ | -------------------------------------------------------- | ------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------- |
| CES              | "CES・2026"              | Sea photo + white CES logo, grey placeholder behind      | CES logo on `#529bd4`                       | **Icon shown**, but brief says none | Year 2026 · Role UI/UX Designer · Project type Admin Panel, Mobile App · Team Solo |
| Ju-Jutsu⁺        | "Ju -Jutsu⁺・2026"       | Browser mockup of the Ju-Jutsu site on the pink gradient | not designed                                | none (brief)                        | not designed                                                                       |
| Blow Stress Away | "Blow Stress Away・2026" | Phone mockup on pink/purple gradient (0.4 alpha)         | not designed                                | https://blowstressaway.figma.site/  | not designed                                                                       |
| FilmBudget       | "FilmBudget・2025"       | Full-bleed swimmers photo + FilmBudget logo top right    | not designed (brand colors exist as tokens) | https://www.filmbudget.dk/en/       | not designed                                                                       |

Model differences as data, not components: `icon`, `cover` (type `'photo' | 'phone-mockup' | 'browser-mockup'` + assets + optional logo), optional `liveUrl` (hide the link icon when it is missing), and a variable-length `projectType[]` (multi-line values).

---

## 8. Content inventory (en)

Copy exactly as in Figma, with problems marked ⚠️. Message keys are suggestions.

### Header / navigation

| Key                              | Text                                   |
| -------------------------------- | -------------------------------------- |
| `common.logo`                    | ✨ Oleksandra Kokozei                  |
| `nav.me`                         | Me                                     |
| `nav.works`                      | Works                                  |
| `nav.experience`                 | Experience ⚠️ trailing space in Figma  |
| `locale.uk` (label)              | ua ⚠️ locale code is `uk`              |
| `locale.en`                      | en                                     |
| `locale.de`                      | de                                     |
| `nav.openMenu` / `nav.closeMenu` | (not in Figma; needed for aria-labels) |

Mobile menu order is **Me, Experience, Works**, while the header and footer order is Me, Works, Experience ⚠️.

### Hero (Me)

| Key              | Text                                                                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `me.greeting`    | HI, Iʼm Oleksandra ⚠️ uses `ʼ` (U+02BC); the rest of the copy uses `’` (U+2019)                                                                                                                                                      |
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
| `works.ces.pill`               | CES・2026 ⚠️ first letter is Cyrillic "С" (U+0421) in Figma         |
| `works.ces.description`        | Admin platform for a complex maritime service ecosystem             |
| `works.jujutsu.pill`           | Ju -Jutsu⁺・2026 ⚠️ stray space before the hyphen                   |
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
| `experience.period`                      | 2024 - Present (use an en dash "2024 – Present" in code?)                                                                                                                                                                                                                                                                                                                                                 |
| `experience.p1`                          | Since 2024, I’ve worked independently with international clients on projects across film production, education, logistics, sports, wellness, and service-based businesses.                                                                                                                                                                                                                                |
| `experience.p2`                          | My experience includes corporate websites, conversion-focused landing pages, multi-screen web applications, CRM-style interfaces, dashboards.                                                                                                                                                                                                                                                             |
| `experience.p3`                          | Depending on the project, I work across information architecture, user flows, wireframes, responsive UI, design systems, reusable components, multilingual interfaces, developer handoff, and Webflow/Framer implementation. I also collaborate directly with clients and developers, adapt existing brand systems, and use AI-assisted development to turn selected concepts into functional prototypes. |
| `social.linkedin` / `behance` / `github` | (aria-labels, not in Figma)                                                                                                                                                                                                                                                                                                                                                                               |

### Footer

| Key                | Text                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `footer.localTime` | 13:56 , Stuttgart Germany ⚠️ space before the comma, no comma after Stuttgart; the time is live |
| `footer.email`     | oleksandra.kokozei.ux@gmail.com                                                                 |
| `footer.copyright` | © 2026 Оleksandra Kokozei ⚠️ "О" is Cyrillic (U+041E); use the current year                     |

### overlay-me

| Key                                                                                                                                                                                                                                                                                     | Text                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `overlayMe.nav.*`                                                                                                                                                                                                                                                                       | About · Home · Music · Books                            |
| `overlayMe.hometown.heading`                                                                                                                                                                                                                                                            | My hometown                                             |
| `overlayMe.hometown.location`                                                                                                                                                                                                                                                           | Odesa, Ukraine                                          |
| `overlayMe.music.heading`                                                                                                                                                                                                                                                               | Fav songs                                               |
| `overlayMe.books.heading`                                                                                                                                                                                                                                                               | Books                                                   |
| About section                                                                                                                                                                                                                                                                           | Reuses `me.greeting`, `me.location`, `me.bio.*`         |
| Placeholder content (Fav songs: Wicked Game / Chris Isaak; Raindance / Dave, Tems; Trance / Metro Boomin, Travis Scott, Young Thug. Books: Good Night, Mr. Holmes / Carole Nelson Douglas; The Like Switch / Jack Schafer & Marvin Karlins; The Design of Everyday Things / Don Norman) | Owned by the ready-made code. Listed for reference only |

### overlay-works (CES)

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
| `overlayWorks.openLiveSite`      | (aria-label, not in Figma)                              |
| `overlayWorks.close`             | (not in Figma)                                          |

---

## 9. Responsive: desktop vs mobile, breakpoints, mobile brief

### 9.1 What changes between desktop (1440) and mobile (390)

| Section     | Desktop (`2:2`)                                                                                                                                          | Mobile (`220:74`)                                                                                                                                                                                |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Header      | Padding 32 / 120. Logo left, nav centered, language chips right                                                                                          | Padding 32 / 16. Logo + 24 px menu button. Nav and language move into `menu-overlay-mobile`                                                                                                      |
| Mobile menu | —                                                                                                                                                        | Full screen, white. Close (×) top right. Links in `title-l`, left aligned, vertically centered, gap 24. Order Me / Experience / Works. Language chips centered at the bottom                     |
| Hero        | Row, bottom-aligned: polaroid slot 384 × 483 + text column 486, gap 24. "more" right aligned                                                             | Column: polaroid slot full width × 483 (polaroid at x 17 instead of 30, signature at x 246), then text, gap 24. "more" right aligned. Top gap under header 0 instead of 48                       |
| Dividers    | 996 wide, 80 above and below                                                                                                                             | 358 wide (inset 16), 48 above and below                                                                                                                                                          |
| Works       | Heading → grid gap 48. 2 × 2 grid, cards 486 wide, cover 253 tall, row gap 24, column gap 24. Description padding 12 (left) / 8 (right, first card only) | Heading → list gap 40. Single column, cover 358 × 186 (same ratio). Gap 24 inside each pair, 32 between pairs (inconsistent; use one gap). Description padding 8. Descriptions wrap to two lines |
| Work covers | CES logo centered; BSA phone 142 × 228; FilmBudget logo at x 416                                                                                         | Artwork scaled about 0.72. **FilmBudget logo stays at x 416, outside the 358 px card, so it is clipped.** Fix: anchor it top right                                                               |
| Experience  | Text measure 585. Social tiles row                                                                                                                       | Text full width (358). Same tiles, gap 24                                                                                                                                                        |
| Footer      | Row: logo + time │ nav │ email + icons, gap 122 (space-between). Copyright centered below, gap 56                                                        | Column, gap 40: logo + time, nav (vertical, gap 12), email + icons. Copyright centered, gap 56                                                                                                   |

### 9.2 Breakpoints from the real frame widths

Frame widths in the file: **390** (mobile page and menu), **1440** (desktop page), **1200** (overlay panel = 1440 − 2 × 120 inset). Content widths: 996 (desktop column), 894 (overlay content), 358 (mobile column).

Current convention (`docs/design-system.md`): `sm 480 · md 768 · lg 1024 · xl 1440`.

Checks against the layout:

- **480 has no design meaning.** The 390 mobile frame is fully fluid (every block is full width minus 16), so nothing changes between 390 and ~767. It adds a query with no layout change.
- **Hero row needs ≥ 894 px of content**: 384 + 24 + 486. At 1024 with the Figma 120 px padding there are only 784 px, so the row breaks. With `--spacing-5xl` (40) padding at 1024, there are 944 px, which fits.
- **Header row** at 1024 with 120 padding leaves 784 px for logo (~150) + nav (~212) + chips (~167) ≈ 530, which fits.
- **Overlay** needs the 1200 panel + 2 × 120 insets = 1440 to match Figma. Below that, insets must shrink before the panel does: 996 column + 2 × 102 padding = 1200.
- **Works grid**: two columns work down to about 700 px of content (cards ≥ 340, cover height follows `aspect-ratio`).

Recommendation:

| Name   | Min width | Change vs today | Layout                                                                                                                      |
| ------ | --------- | --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| base   | 0         | —               | Mobile frame `220:74`, fluid. Check down to 320 px (polaroid slot, see brief)                                               |
| ~~sm~~ | ~~480~~   | **Remove**      | No design difference from base                                                                                              |
| md     | 768       | Keep            | Tablet. **Not designed.** Interim: mobile header and hero, 2-column works grid, desktop-style footer row                    |
| lg     | 1024      | Keep            | Desktop structure: inline header nav, hero row, 2 × 2 grid. Side padding `--spacing-5xl` (40); overlays with reduced insets |
| xl     | 1440      | Keep            | Pixel match with Figma: header padding 120, content 996 centered, overlay 1200 with 120 / 80 insets                         |

Between `lg` and `xl`, side padding grows fluidly, for example `clamp(var(--spacing-5xl), …, var(--spacing-10xl))`. Content keeps `max-inline-size: var(--size-content-max)`. Update `src/styles/breakpoints.css` and `docs/design-system.md` in the first implementation PR, not in this one.

### 9.3 Mobile brief for the designer (screens not designed yet)

Main page (mobile) and the mobile menu are designed. The list below covers only the gaps, highest priority first.

**P1: Overlay shell on mobile (insets, sticky nav, close). Affects both overlays.**

- _Problem:_ Desktop overlays are a 1200 px card with 120 / 80 insets, radius 40, and a 77 px vertical nav column to the right of the content. At 390 the insets alone would take most of the width, and there is no room for a side nav column. Neither overlay has a close button at any width.
- _Directions:_
  1. **Full-screen sheet.** No insets, no radius (or radius only on top). Sticky top bar holding the close (×) and a horizontal, scrollable tab row (About · Home · Music · Books) with scroll-spy underline or color.
  2. **Bottom sheet** that slides up to ~95 % height with a grab handle, radius 40 on top. Section nav as a sticky segmented control at the bottom, within thumb reach.
  3. **Full-screen, no section nav.** Close button + a section progress indicator only. This relies on scrolling, since each overlay has just 4 sections.
- Also decide: whether the page header stays visible above the overlay (it does in Frame 77 on desktop), and the backdrop tint.

**P2: overlay-me, "My hometown" collage.**

- _Problem:_ 4 overlapping, rotated 260 × 382 polaroids spread over a 894 × 470 area, with the first one overflowing the column by 54 px. At 358 px, even one polaroid barely fits.
- _Directions:_ (1) Horizontal scroll-snap carousel of polaroids, keeping the rotations. (2) A 2 × 2 "scattered" grid at ~0.6 scale with overlap. (3) A stacked deck: tap or swipe to bring the next photo to the front.

**P3: overlay-me, Fav songs and Books slots.**

- _Problem:_ Both ready-made blocks are rows of three 280 px items (888 px). They cannot sit side by side at 390.
- _Directions:_ (1) Horizontal scroll row with the next item peeking. (2) Vertical list with a smaller thumbnail on the left and title and artist on the right. (3) Keep the ready-made block's own responsive behavior; the designer only confirms the spacing around it. Check what the ready-made code already does before designing.

**P4: overlay-works, header block and facts.**

- _Problem:_ The header row puts the icon, title and description on the left and the link icon 176 px away on the right. Facts are 4 columns of 180 px (792 px).
- _Directions (facts):_ (1) 2 × 2 grid. (2) Label/value rows (a definition list). (3) Horizontal scroller of fact chips.
- _Directions (link):_ (1) Link icon beside the title. (2) A full-width "Visit site" button under the description. (3) A link in the sticky top bar.

**P5: overlay-works, cover.**

- _Problem:_ The 894 × 435 cover with a centered 247 × 397 phone mockup would shrink the phone to ~100 px wide at 358.
- _Directions:_ (1) Taller aspect ratio on mobile (for example 4:5) so the mockup stays readable. (2) Crop the background and show the mockup at full height. (3) Replace it with a plain screenshot, no device frame.

**P6: overlay-works, Goal / Problem / Result, and the other three works.**

- Not designed at any width. The desktop design has to come first. On mobile, decide the text measure and how images inside these sections behave.

**P7: Tablet widths (768–1023), main page.**

- _Problem:_ Not designed. At this width the hero row (needs 894) does not fit, but the single-column mobile layout wastes space.
- _Directions:_ (1) Mobile layout with the 2-column works grid and the footer as a row. (2) Hero with a smaller polaroid (~280) beside the text. (3) Centered single column at ~600 px max width.
- Also decide whether the header shows the inline nav or the hamburger at 768.

**P8: Small phones (320–389).**

- _Problem:_ The polaroid slot is a fixed 384 × 483 box with a 324 px rotated polaroid. At 320 (288 px column) it overflows.
- _Directions:_ (1) Scale the whole `PolaroidSign` to the container width. (2) Reduce the rotation and size below 390. (3) Accept overflow and let it bleed to the edge.

**P9: Laptop widths (1024–1439), overlays.**

- _Problem:_ The Figma overlay insets only fit at 1440.
- _Directions:_ (1) Insets shrink fluidly from 120 to 40 while the panel stays max 1200. (2) Fixed 40 px insets below 1440. (3) The panel becomes full width with radius 0 below a threshold.

---

## 10. Open questions and risks (by impact)

| #   | Risk / question                                                                                                                                                                                                                                                                                                                                                                                                                                      | Impact                                                            | Proposed handling                                                                                                                           |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **overlay-works is incomplete.** Only CES is designed, and only its About block. Goal / Problem / Result have nav labels but no content or layout. The other three works have no detail design or copy                                                                                                                                                                                                                                               | Blocks the whole overlay-works feature                            | Build the shell and the About block from CES. Keep Goal / Problem / Result as typed text sections behind content that must be written first |
| 2   | **No close button and no backdrop spec for desktop overlays.** Frame 77 shows the backdrop only as a flat raster                                                                                                                                                                                                                                                                                                                                     | Accessibility and usability of both overlays                      | Ask for a close button design. Until then, implement Esc and backdrop close, and put a visually minimal close button first in focus order   |
| 3   | **Contrast failures (WCAG 2.2 AA).** `--color-text-inactive` #9f9faa ≈ 2.6:1 and `--color-text-muted` #a1a1aa ≈ 2.6:1 on white. Both are used for nav links, work descriptions and the "more" button. `--color-text-disabled` #d0d0d4 ≈ 1.5:1 is used for **interactive** language chips                                                                                                                                                             | Legal and quality bar in the brief; recruiters may run Lighthouse | The designer picks darker values (≥ 4.5:1 for text). Needs a token re-export, so do not override in code                                    |
| 4   | **Cover images missing from the MCP export.** CES sea, Ju-Jutsu browser shot and FilmBudget photo came back as empty fills (possibly video fills). The BSA screen source is a video frame                                                                                                                                                                                                                                                            | Main-page visuals cannot match 1:1                                | Designer exports these manually (WebP/AVIF, 2×). Decide still image or looping video (video adds weight and needs reduced-motion handling)  |
| 5   | **Content mismatches with the brief.** (a) Card 2 is "Ju-Jutsu⁺", while the brief says "AI-assisted school platform", and the description matches the brief. (b) CES shows a live-link icon, but the brief says no live site. (c) Notion is in the brief but not in Figma. (d) Cyrillic "С" in "СES" and "О" in "Оleksandra" (breaks search, translation, screen readers). (e) "ua" label vs `uk` locale. (f) Mobile menu order differs from desktop | Wrong content ships                                               | Resolve each in the content PR. Fix (d) in Figma too                                                                                        |
| 6   | **Signature animation feasibility.** The export may be a filled outline, not a stroke path                                                                                                                                                                                                                                                                                                                                                           | Hero "wow" detail                                                 | Inspect the SVG when exporting. If it is filled, ask for a centerline stroke version, or use a clip-path wipe as fallback                   |
| 7   | **Undocumented variants.** `polaroid_sign` Variant2 (different expression) and `content-works` default / subtitle / tag+subtitle. Trigger unknown (hover? click?)                                                                                                                                                                                                                                                                                    | Interaction scope                                                 | Ask. Build the default state first                                                                                                          |
| 8   | **No hover / focus / pressed states** for any control                                                                                                                                                                                                                                                                                                                                                                                                | Keyboard accessibility, perceived polish                          | Define `:focus-visible` from tokens now. Designer adds hover states                                                                         |
| 9   | **Token mismatch** `color/icon/strong` #1e1e1e (Figma) vs `--color-icon-strong` #000 (CSS); `gray/50` primitive used in Figma                                                                                                                                                                                                                                                                                                                        | Small visual drift in icons                                       | Re-export tokens from Figma, since tokens are not edited by hand                                                                            |
| 10  | **Missing layout tokens** (996, 894, 1200, 585, shadow, blur, cover gradients), 8 in total                                                                                                                                                                                                                                                                                                                                                           | Hardcoded values would break the token rule                       | Add them to the Figma variables and re-export before the first UI PR                                                                        |
| 11  | **Mobile layout bugs in Figma.** FilmBudget logo clipped (x 416 in a 358 card); inconsistent card gaps (24 vs 32); 129 px gap before the mobile footer                                                                                                                                                                                                                                                                                               | Mobile polish                                                     | Implement the fixes noted in §9.1 and confirm with the designer                                                                             |
| 12  | **Footer live clock.** The server-rendered time differs from the client time, causing a hydration mismatch                                                                                                                                                                                                                                                                                                                                           | Console errors, layout jump                                       | Render the time client-only (`useEffect`) with a fixed-width placeholder; timezone `Europe/Berlin`                                          |
| 13  | **Emoji in the logo** (✨) renders differently per OS and is read aloud by screen readers                                                                                                                                                                                                                                                                                                                                                            | Brand consistency                                                 | `aria-hidden` on the emoji. Optionally replace it with an SVG sparkle (needs design)                                                        |
| 14  | **Overlay routing** (URL state vs local state) not specified                                                                                                                                                                                                                                                                                                                                                                                         | Shareable links, back-button behavior                             | Proposal: query params (`?overlay=me`, `?work=ces`). Confirm                                                                                |
| 15  | **Copy details:** "2024 - Present" hyphen, "Iʼm" apostrophe variant, "Experience " trailing space, empty paragraph in the overlay-works description                                                                                                                                                                                                                                                                                                  | Minor typography                                                  | Normalize in the messages files                                                                                                             |

---

## Suggested implementation order

1. Token PR: add the missing tokens (§3), fix `icon/strong`, update breakpoints (§9.2).
2. Layout shell: `SiteHeader` (desktop and mobile), `MobileMenu`, `SiteFooter`, `LocalTime`, `useScrollSpy`.
3. Main page sections: Hero (`PolaroidSign` without animation), Works, Experience. Content in data files and messages (en first).
4. `Overlay` shell + `OverlayNav`, then overlay-me (with Fav Songs and Books slots), then overlay-works for CES.
5. Signature animation, `.reveal` scroll animations, reduced-motion checks.
6. uk and de messages; responsive work from the designer's answers to §9.3.
