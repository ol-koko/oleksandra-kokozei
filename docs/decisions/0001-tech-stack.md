# 0001. Tech stack

- **Status:** Accepted
- **Date:** 2026-09-29

## Context

The portfolio is a single page with two modal overlays, three languages, and a design that must match Figma 1:1 on desktop, with a mobile design to follow. The repository is public and reviewed by recruiters, so the code has to be idiomatic, typed, and easy to follow. Design tokens already exist as CSS custom properties exported from Figma. Hosting is Vercel with a custom domain.

## Decision

- **Next.js 16 (App Router) + React 19.** Static prerendering of each locale, `next/font` for self-hosted Figtree, image optimization, and first-class Vercel support.
- **TypeScript in strict mode**, plus `noUncheckedIndexedAccess`. Message keys are typed from `en.json`.
- **CSS Modules on top of the exported CSS custom properties.** Component-scoped styles that consume tokens directly, with no build-time styling layer between Figma and code.
- **next-intl** for i18n: locale-prefixed routing (`as-needed`), typed messages, and Server Component support with static rendering via `next/root-params`.
- **ESLint (`eslint-config-next`) + Prettier**, enforced in **GitHub Actions** together with typecheck and build.
- Pinned versions: TypeScript 6.0 and ESLint 9, because `typescript-eslint` and the React, import, and a11y ESLint plugins do not yet support TypeScript 7 or ESLint 10.

## Alternatives considered

- **Astro.** Excellent for mostly static sites, but the overlays, scroll-spy, and signature animation are React-shaped interactivity, and Next.js is the more common stack for the roles this portfolio targets.
- **Tailwind CSS.** Fast to write, but it would duplicate the Figma token layer as a second config and move styling into class strings. Using the CSS variables directly keeps one source of truth.
- **CSS-in-JS (styled-components, Emotion).** Adds runtime cost and friction with Server Components for no gain over CSS Modules.
- **react-i18next / Next.js built-in i18n.** The built-in i18n routing is not available in the App Router; react-i18next needs more manual wiring for App Router routing and Server Components than next-intl.

## Consequences

- Every visual value must come from a token. Missing tokens are added to the design system rather than hardcoded.
- Breakpoints are a project convention (literal values in media queries) because CSS variables cannot be used in `@media`.
- The TypeScript and ESLint pins should be revisited when the ESLint plugin ecosystem supports newer majors.
- Locale detection is deliberately off until the geo-detection stage, so behaviour stays predictable: the URL alone decides the language.
