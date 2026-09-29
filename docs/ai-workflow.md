# AI-assisted workflow

This project is built with AI coding agents working under explicit, versioned rules. The goal is speed without losing design fidelity or code quality.

## Tools

| Tool            | Role                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Figma MCP**   | Gives the agent structured access to the Figma file: layer metadata, design context, variables, and screenshots           |
| **Claude Code** | Coding agent that plans, implements, and validates changes in this repository                                             |
| **AGENTS.md**   | Project rules every agent must follow: stack, sources of truth, styling, code, and Git workflow. `CLAUDE.md` points to it |

## Loop

1. **Scope.** One task per branch (`feat/`, `fix/`, `chore/`, `docs/`, `refactor/`).
2. **Read the design.** The agent pulls the relevant Figma node through the MCP server (`get_metadata`, `get_design_context`, `get_screenshot`) and maps every value to an existing token. Values without a token are flagged, not hardcoded.
3. **Plan.** The agent proposes a plan (files, dependencies, commits) and waits for approval.
4. **Implement.** Small, typed components; copy through next-intl; content in typed data files.
5. **Validate.** `npm run lint`, `npm run typecheck`, and `npm run build` must pass locally, then in CI.
6. **Review.** The agent opens a pull request from the template. A human reviews the Vercel preview against Figma and merges.

## Guardrails

- The agent never commits to `main`, never force-pushes, and never merges.
- New dependencies require an explanation and approval.
- `reference/` (third-party materials used for inspiration) and `.env*` files are never committed.

## Stages

<!-- TODO: fill in as each stage lands, with a note on what the agent did well and what needed correction. -->

| Stage                 | Status      | Notes |
| --------------------- | ----------- | ----- |
| Project foundation    | In progress |       |
| Desktop UI            | Planned     |       |
| Overlays + scroll-spy | Planned     |       |
| Signature animation   | Planned     |       |
| Geo locale detection  | Planned     |       |
| Mobile                | Planned     |       |
