# Architecture

## Overview

A statically rendered Next.js App Router site. Every locale is prerendered at build time; the only request-time code is the locale proxy.

```
Request ─▶ src/proxy.ts (next-intl) ─▶ /[locale] route ─▶ static HTML
                 │
                 └─ `/` is rewritten to the default locale (en); `/en` redirects to `/`
```

## Directory layout

| Path                      | Responsibility                                                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/[locale]/`       | Root layout (html `lang`, font, i18n provider, metadata), the page, and overlay routes (`me/`, `works/[slug]/`, `@modal/(.)…`)   |
| `src/app/globals.css`     | Imports design tokens, motion, and breakpoints; minimal reset and utilities                                                      |
| `src/components/`         | Shared, presentational components (no data fetching, no feature logic)                                                           |
| `src/features/i18n/`      | `routing.ts` (locales, prefix strategy), `request.ts` (messages per request), `navigation.ts` (locale-aware `Link`, `useRouter`) |
| `src/features/overlay/`   | Modal overlays: path routing and metadata, open/close state, focus trap, sticky nav, scroll-spy                                  |
| `src/features/signature/` | Animated handwritten signature for the Hero Polaroid                                                                             |
| `src/features/focus/`     | `moveFocus`: script focus for dialogs that shows a focus ring only after keyboard input                                          |
| `src/content/`            | Typed content data (links now; works and experience later)                                                                       |
| `src/styles/`             | Shared style modules: `breakpoints.css`, `fonts.ts`                                                                              |
| `messages/`               | Translations. `en.json` is the source of truth for keys                                                                          |
| `design-system/`          | Tokens and motion exported from Figma. Treated as read-only input                                                                |
| `public/media/`           | Static media (`covers/`, `works/`)                                                                                               |

## Key decisions

### Internationalization

- `next-intl` with `localePrefix: 'as-needed'`: English lives at `/`, other locales under a prefix.
- `localeDetection: false`: no `Accept-Language` negotiation. Geo-based detection (saved choice > Vercel geo > en) comes in a later stage and will live in the proxy.
- The locale is read with `next/root-params` in `request.ts` and the root layout, which keeps every page eligible for static rendering.
- Message keys are typed from `en.json` via `AppConfig` augmentation (`src/features/i18n/global.d.ts`). A missing or misspelled key fails the typecheck.
- `uk.json` and `de.json` mirror the English keys. Untranslated values are `"TODO"`.

### Content vs. copy

- **Copy** (anything a user reads) lives in `messages/*.json`.
- **Content data** (URLs, IDs, media paths, ordering) lives in `src/content/` as typed constants. Components combine the two: data provides the IDs, messages provide the labels.

### Styling

- CSS Modules for component styles, CSS custom properties for every value. See [design-system.md](design-system.md).
- No CSS framework, UI kit, or animation library.

### Rendering

- Pages are Server Components by default. Client Components are introduced only where interactivity is needed (overlays, scroll-spy, language switcher).

### Overlay routing

- Overlays have clean, shareable paths: `/me`, `/works/<slug>`, and `/works/<slug>/app` for a live app above its case (locale prefixes as usual). Old query URLs (`/?overlay=me`, `/?work=<slug>`) redirect with 308 in the proxy.
- **Direct visit:** `me/page.tsx` and `works/[slug]/page.tsx` render the page itself, with its own metadata (title, description, canonical, hreflang, Open Graph). Unknown or unpublished slugs are not in `generateStaticParams` and `dynamicParams` is off, so they are a 404.
- **Open from the page:** triggers are links. The `@modal` slot intercepts the path (`@modal/(.)works/[slug]`), so the page stays mounted and the browser gets a real history entry.
- **Rendering:** `OverlayHost` lives in the layout, outside the slot, and opens whatever the path names. The slot pages render nothing: the overlay must outlive its route to play the closing motion after Back. Next.js applies no metadata from the slot, so the host keeps the tab title in step.
- **Closing:** an overlay opened from the page steps back over its entry. After a direct visit, closing replaces the URL with the page path in place, without a reload.

### Overlay motion

- **Time-based reveal, like the Hero entrance** (`useOverlayReveal`). Content elements carry `data-reveal`: case icon, title, description, each fact, cover, private note; each story label, lead and body; photos and their captions; each grid photo, shelf item and hometown photo; section headers; the About portrait, greeting and bio paragraphs. Each one fades up once per open with `rise-in` (`--motion-duration-slow`, `--motion-easing-gentle`, `--dimension-4`). Elements that enter together rise 60 ms apart.
- **When:** the first screen waits for the panel's entrance. Everything else waits until it enters the scroller (IntersectionObserver with the scroller as root, ignoring the 40 px bottom fade). Content scrolled past during the overlay-me glide to Home is revealed on the way, so the glide lands on visible content.
- **No script, reduced motion:** script arms the scroller (`data-reveal-armed`) before the first paint, and only that hides the elements. Without script or with reduced motion nothing is armed and everything shows at once.
- **Closing** waits only for the closing motion of the backdrop, panel and scroller, never for reveals inside. AppOverlay and the Lightbox wait for finite, time-based animations only (`finiteAnimations`), so the looping shimmer never blocks them.
- Reveals never sit on the `<section>`, because the nav and scroll-spy measure sections.
- **Loading:** every overlay-me image (and the Hero portrait) goes through `LoadingImage` with the shimmer skeleton. The preloaded Hero photo is never hidden before load, so the LCP is not held back until hydration.

### Focus

- **One focus ring for the whole site.** It is defined in `globals.css`: `:focus-visible` gets an outline of `--border-default` in `--color-text-primary`, offset `--spacing-xxs`. The outline follows each element's border-radius. Elements without their own radius get `--border-radius-xs` through a zero-specificity `:where()` rule. Never remove it for keyboard users.
- **Script focus (dialogs) goes through `moveFocus`.** Browsers guess `:focus-visible` for focus moved by script. Safari never focuses a clicked or tapped button, so it guesses "keyboard" and shows the ring after a tap. `moveFocus` passes the real input: a `click` from Enter or Space has `detail` 0, a mouse or touch click has `detail` 1 or more. It uses `focusVisible` where supported. Otherwise it adds `data-pointer-focus`, which hides the ring until the next key press or blur.

### Signature animation

The Hero signature writes itself once on page load with CSS only. There is no JS and no animation library, and it stays a Server Component.

- **Technique.** The SVG (`src/features/signature/`) is a single stroke path exported from Figma in writing order. `pathLength="1"` normalizes its length, so `stroke-dasharray: 1 2` with `stroke-dashoffset` going from 1 to 0 reveals it from start to end. No JS measuring is needed.
- **Timing.** The keyframe stops copy the "End" keyframes of the Lottie reference's Stroke effect (a steady start, the fastest stretch mid-path, then a long slow finish), linear between stops. The 3.57 s reference is scaled to 2 s. The draw waits for the polaroid's `.animate-card` entrance (`--motion-duration-slow`) plus a short pause (`--motion-duration-fast`).
- **Exact final frame.** The dash pattern exists only inside the keyframes (`animation-fill-mode: backwards`). After the animation the path falls back to its static style, so the last frame is pixel-identical to the static signature even though browsers estimate `pathLength` with slight error.
- **Reduced motion.** `animation: none`, so the finished signature shows immediately.
- **Scope.** `PolaroidSign` opts in with `animateEntrance`. Only the stroke is animated, so there is no layout shift. The SVG stays `aria-hidden`.

## Quality gates

`npm run format:check`, `npm run lint`, `npm run typecheck`, and `npm run build` run in GitHub Actions on every pull request and on pushes to `main`. Vercel builds a preview for each pull request.
