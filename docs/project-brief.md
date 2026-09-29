# Project brief

## Product

A one-page personal portfolio for **Oleksandra Kokozei**, UI/UX Designer & AI Engineer, based in Stuttgart, Germany. The site presents who she is, selected works, and professional experience. The repository itself is public and part of the portfolio: recruiters review its code quality, structure, and commit history.

- Live URL: https://oleksandra-kokozei.com
- Design source: Figma file `vJCOCkFcnVJ9Pn4TFuRHV9`, node `107-329` ("Design Website")

## Page structure

The page has a header, three sections, and a footer.

| Section    | Content                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Header     | Logo, anchor menu (Me, Works, Experience), language switcher (en, uk, de)                          |
| Me (Hero)  | Polaroid with an animated handwritten signature, greeting, location, short bio, "More" button      |
| Works      | Grid of work cards, each with a cover, a title pill (project and year), and a one-line description |
| Experience | Role and period, description, social links                                                         |
| Footer     | Logo, local time and location, menu, email, social icons, copyright                                |

## Overlays

Two fixed modal overlays open on top of the page. Each has a sticky in-overlay navigation with scroll-spy that highlights the section currently in view.

- **overlay-me**, opened by "More" in Me. Sections: About, Home (hometown photos), Music (favourite songs), Books.
  The Music and Books blocks are implemented from ready-made code; Figma shows only placeholders for them.
- **overlay-works**, opened by any work card. Sections: About (title, year, role, project type, team, link), Goal, Problem, Result.

## Works

| Work                                                                              | Live site                          |
| --------------------------------------------------------------------------------- | ---------------------------------- |
| CES: admin platform for a complex maritime service ecosystem                      | —                                  |
| AI-assisted school platform for classes, schedules, and school life               | —                                  |
| Blow Stress Away: breath-controlled stress relief experiment powered by MediaPipe | https://blowstressaway.figma.site/ |
| Film Budget: film budgeting services in a clear web experience                    | https://www.filmbudget.dk/en/      |

## Social links

- LinkedIn: https://www.linkedin.com/in/oleksandra-kokozei/
- Behance: https://www.behance.net/aadb28ef
- Notion: https://app.notion.com/p/Oleksandra-Kokozei-1ffe5002eb4f806f85d1edf781bbdabe
- GitHub: https://github.com/ol-koko

## Localization

- Locales: `en` (default), `uk`, `de`.
- URLs: English at `/`, Ukrainian at `/uk`, German at `/de`.
- Planned detection priority: saved user choice > Vercel geo (UA → `uk`, DE → `de`) > `en`. Not implemented yet; until then the locale comes from the URL only.

## Responsive strategy

The desktop layout is implemented first and must match Figma 1:1. A mobile design will follow in Figma. Layouts stay fluid from the start: no fixed page widths, and all spacing and sizes come from design tokens. Breakpoints are defined in [design-system.md](design-system.md#breakpoints).

## Quality bar

- Semantic HTML, keyboard support, visible focus, accessible names, alt text.
- `prefers-reduced-motion` respected for every animation.
- All copy goes through i18n messages; all content lives in typed data files.
- Lighthouse scores published in the README once the UI is done.

## Hosting

Vercel, connected to this GitHub repository. Pull requests get preview deployments; `main` deploys to production at the custom domain.
