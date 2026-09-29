# AGENTS.md — Project rules for AI coding agents

## Project
One-page personal portfolio of Oleksandra Kokozei (UI/UX Designer & AI Engineer).
Public repository reviewed by recruiters: code quality, structure, and history matter.

## Stack
Next.js (App Router) + TypeScript (strict) + CSS Modules on top of CSS custom properties.
i18n: next-intl. Locales: en (default), uk, de. Hosting: Vercel. Domain: oleksandra-kokozei.com.
No Tailwind, no UI kits, no animation libraries unless explicitly approved.

## Sources of truth
- Visual design: Figma file vJCOCkFcnVJ9Pn4TFuRHV9 (node 107-329) via Figma MCP. Desktop must match 1:1.
- Design tokens: design-system/design-tokens.css (+ .json). Motion: design-system/animations.css.
- Product spec: docs/project-brief.md.
- Exceptions: Books and Fav Songs blocks in overlay-me are replaced by ready-made code; Figma shows only placeholders for them.

## Styling rules
- Use only token variables (--spacing-*, --color-*, --border-radius-*, --size-*, --motion-*) and typography classes (.text-body-*, .text-title-*).
- Never hardcode a value that exists as a token. If a Figma value has no token, flag it and propose a token instead of silently hardcoding it.
- Use utility animation classes from animations.css; always respect prefers-reduced-motion.

## Code rules
- Inspect relevant files before editing. Make the smallest safe change. No unrelated refactors.
- Small, focused, typed components. No `any`. Content lives in typed data files, never inline in JSX.
- All user-facing text goes through next-intl messages (en/uk/de). No hardcoded copy.
- Semantic HTML, keyboard support, visible focus, accessible names, alt text.
- No new dependencies without explaining why and asking first.
- Never commit. At the end of each task, propose a Conventional Commit message and list changed files.

## Validation
Before finishing, run: npm run lint, npm run typecheck, npm run build. Report results.
