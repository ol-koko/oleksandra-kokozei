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
| `src/app/[locale]/`       | Root layout (html `lang`, font, i18n provider, metadata) and the page                                                            |
| `src/app/globals.css`     | Imports design tokens, motion, and breakpoints; minimal reset and utilities                                                      |
| `src/components/`         | Shared, presentational components (no data fetching, no feature logic)                                                           |
| `src/features/i18n/`      | `routing.ts` (locales, prefix strategy), `request.ts` (messages per request), `navigation.ts` (locale-aware `Link`, `useRouter`) |
| `src/features/overlay/`   | Modal overlays: open/close state, focus trap, sticky nav, scroll-spy                                                             |
| `src/features/signature/` | Animated handwritten signature for the Hero Polaroid                                                                             |
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

- Pages are Server Components by default. Client Components are introduced only where interactivity is needed (overlays, scroll-spy, language switcher, signature animation).

## Quality gates

`npm run format:check`, `npm run lint`, `npm run typecheck`, and `npm run build` run in GitHub Actions on every pull request and on pushes to `main`. Vercel builds a preview for each pull request.
