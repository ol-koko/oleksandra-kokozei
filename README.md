# Oleksandra Kokozei — Portfolio

One-page portfolio of Oleksandra Kokozei, UI/UX Designer & Design Engineer. Designed in Figma and implemented 1:1 in Next.js with a token-based design system and three languages (English, Ukrainian, German).

**Live:** [oleksandra-kokozei.com](https://oleksandra-kokozei.com)

> **Status:** project foundation. The page UI is built in the next stages; the site currently serves a placeholder.

<!-- TODO: add screenshots (desktop + mobile) once the UI stage lands. -->

| Desktop                   | Mobile                    |
| ------------------------- | ------------------------- |
| _Screenshot coming soon._ | _Screenshot coming soon._ |

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) and React 19
- TypeScript (strict)
- CSS Modules on top of CSS custom properties (design tokens exported from Figma)
- [next-intl](https://next-intl.dev) for i18n: `en` (default), `uk`, `de`
- ESLint, Prettier, GitHub Actions CI
- Hosted on [Vercel](https://vercel.com)

## Getting started

Requires Node.js 24 (see `.nvmrc`).

```bash
nvm use
npm ci
npm run dev
```

Open http://localhost:3000. English is served at `/`, Ukrainian at `/uk`, German at `/de`.

## Scripts

| Script                 | What it does                                        |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Start the development server                        |
| `npm run build`        | Create a production build                           |
| `npm run start`        | Serve the production build                          |
| `npm run lint`         | Run ESLint                                          |
| `npm run typecheck`    | Generate Next.js route types and run `tsc --noEmit` |
| `npm run format`       | Format the codebase with Prettier                   |
| `npm run format:check` | Check formatting without writing (used in CI)       |

## Project structure

```
design-system/        Design tokens (CSS + JSON) and motion styles exported from Figma
docs/                 Project brief, architecture, design system, AI workflow, ADRs
messages/             next-intl messages: en (source of truth), uk, de
public/media/         Static media: work covers and project assets
src/
  app/[locale]/       Localized root layout and pages (App Router)
  components/         Shared, presentational UI components
  content/            Typed content data (links, works, experience)
  features/
    i18n/             Routing, request config, typed navigation
    overlay/          Modal overlays with sticky nav and scroll-spy
    signature/        Animated handwritten signature
  styles/             Global style modules: breakpoints, fonts
  proxy.ts            Legacy overlay redirects, locale detection, next-intl routing
```

See [docs/architecture.md](docs/architecture.md) for details.

## Languages and locale detection

English is served without a prefix (`/`, `/works/ces`); German lives under `/de`. Ukrainian (`/uk`) is translated but currently disabled, see below. A visitor who opens an unprefixed URL is redirected once (307, path and query kept, e.g. `/works/ces` → `/de/works/ces`) using this order:

1. **Saved choice:** the `NEXT_LOCALE` cookie, if present. `en` keeps English.
2. **Country:** Vercel's `x-vercel-ip-country` header. `DE`, `AT`, `CH` → `de` (and `UA` → `uk` once Ukrainian is enabled).
3. **English** for everyone else.

URLs with a locale prefix are never redirected, and neither are search engine crawlers; every page lists its hreflang alternates with `x-default` pointing to the English path.

### Ukrainian is disabled

Figtree has no Cyrillic glyphs, so Ukrainian stays off until a Cyrillic font is chosen. The translations stay in `messages/uk.json`. While it is off:

- the language switcher shows only en and de, and hreflang alternates and Open Graph locales list only en and de;
- visitors from Ukraine get English, and a saved `NEXT_LOCALE=uk` counts as no choice;
- any `/uk/...` URL redirects with 307 (temporary) to the same path in English.

**To re-enable it**, change one line in `src/features/i18n/routing.ts`:

```ts
const enabledLocales = ['en', 'uk', 'de'] as const satisfies readonly SupportedLocale[];
```

Everything above (switcher, detection, redirects, alternates, static pages) follows from that list.

### Cookie

`NEXT_LOCALE` is a functional preference cookie. It is set only when the visitor picks a language in the switcher (including `en`), stores just the locale code, lasts one year, is `SameSite=Lax` and is not used for tracking, so it needs no consent banner.

### Simulating a country locally

There is no Vercel geo header in local development. Set `DEV_COUNTRY` to simulate one (ignored in production builds):

```bash
DEV_COUNTRY=DE npm run dev   # / redirects to /de
DEV_COUNTRY=UA npm run dev   # / stays English while uk is disabled
```

Against a production build (`npm run build && npm run start`), send the header instead: `curl -sI -H 'x-vercel-ip-country: AT' http://localhost:3000/me`. Clear the `NEXT_LOCALE` cookie to test detection again in a browser.

Ukrainian and German copy is listed for review in [docs/translations-review.md](docs/translations-review.md).

## Performance

<!-- TODO: add Lighthouse scores for the production URL once the UI stage lands. -->

| Performance | Accessibility | Best Practices | SEO   |
| ----------- | ------------- | -------------- | ----- |
| _TBD_       | _TBD_         | _TBD_          | _TBD_ |

## Documentation

- [Project brief](docs/project-brief.md)
- [Architecture](docs/architecture.md)
- [Design system](docs/design-system.md)
- [AI-assisted workflow](docs/ai-workflow.md)
- [ADR 0001: Tech stack](docs/decisions/0001-tech-stack.md)

## Links

- [LinkedIn](https://www.linkedin.com/in/oleksandra-kokozei/)
- [Behance](https://www.behance.net/aadb28ef)
- [Notion](https://app.notion.com/p/Oleksandra-Kokozei-1ffe5002eb4f806f85d1edf781bbdabe)
- [GitHub](https://github.com/ol-koko)

## License

The **source code** is licensed under the [MIT License](LICENSE).

All **content and media** (texts, photos, work covers, videos, and the visual design) are © Oleksandra Kokozei, all rights reserved. They are not covered by the MIT License and may not be reused without permission.
