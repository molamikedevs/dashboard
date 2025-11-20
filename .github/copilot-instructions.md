<!-- .github/copilot-instructions.md: Guidance for AI coding agents working on this repository -->
# Copilot instructions for the `dashboard` Next.js app

Keep instructions concise and action-oriented. This project is a Next.js 13+ "app"-router TypeScript project (see `app/`, `layout.tsx`, `page.tsx`) that uses Appwrite as a backend client. Below are the repository-specific facts, conventions, and examples that help an AI agent be productive quickly.

## Quick facts
- **Framework:** Next.js (app router) — see `app/` and `next.config.ts`.
- **Scripts:** use `npm run dev`, `npm run build`, `npm run start`, and `npm run lint` (defined in `package.json`).
- **Styling:** Tailwind + PostCSS (see `postcss.config.mjs`, `globals.css`).
- **Backend SDK:** `appwrite` (client wrapper in `lib/appwrite.ts`).
- **Types:** global types under `types/` (`index.d.ts`).

## Architecture & important files
- `app/` — Next.js app directory; prefer editing server components by default. If a file contains `"use client"` at the top, treat it as a client component.
- `app/layout.tsx` — global layout and providers (root-level rendering context).
- `app/page.tsx` and `app/dashboard/` — primary routes; match changes to route files when adding pages.
- `components/` — UI building blocks. Examples: `components/sidenav.tsx`, `components/acme-logo.tsx`.
- `ui/` — small presentational components used across pages (e.g., `ui/login-form.tsx`, `ui/button.tsx`).
- `lib/` — domain helpers and API clients. Notable: `lib/appwrite.ts` and `lib/appwtite.actions.ts` (note: file name contains a typo `appwtite`; preserve existing filename when editing).
- `public/` — static assets (icons, images, customers folder).

## Conventions and patterns
- App router rules: Use file-system routes in `app/`. Add `layout.tsx` when introducing nested UI state across sibling pages.
- Server vs client: Files without `"use client"` are server components and may import server-only modules. Use `"use client"` when adding hooks, state, or browser-only APIs.
- Data fetching: prefer Next.js server actions / fetch inside server components; client components call helpers in `lib/` (e.g., Appwrite wrappers) and pass results via props.
- Appwrite usage: `lib/appwrite.ts` centralizes SDK setup. Follow its patterns for authentication, session checks, and queries rather than creating new SDK instances inline.

## Testing, linting, and formatting
- Lint: run `npm run lint` (uses `eslint`, config in `eslint.config.mjs`). There is no dedicated test runner in `package.json` — do not invent tests without asking.

## Common tasks & examples
- Add a new page: create `app/<route>/page.tsx` and `app/<route>/layout.tsx` if shared layout is needed. Export default React component.
- Use an existing UI component: import from `components/` or `ui/`. Prefer `ui/*` for small controls and `components/*` for larger, composed widgets.
- Calling Appwrite: import the client from `lib/appwrite.ts` and use the functions exported there. Example: `import { client, databases } from '@/lib/appwrite'` (match the existing exports).

## Files to inspect when making changes
- `app/layout.tsx` — global context and providers
- `lib/appwrite.ts` — Appwrite client setup and common helpers
- `lib/appwtite.actions.ts` — action helpers that interact with Appwrite (preserve filename)
- `components/sidenav.tsx`, `ui/login-form.tsx` — patterns for client components and prop drilling
- `package.json`, `postcss.config.mjs`, `tailwind.config` — dev tooling and build behavior

## Safety and code style
- Keep changes minimal and consistent with existing TypeScript and component styles.
- Avoid changing public API shapes (exports from `lib/`) unless you update all call sites.
- Preserve file-level naming even if it contains typos (e.g., `appwtite.actions.ts`) unless the user asks to rename — renames touch many imports.

## When in doubt
- If uncertain about a runtime or build behavior, prefer reading `package.json` and `next.config.ts` and run `npm run dev` locally.
- Ask the maintainer before adding new global dependencies; this repo has limited devDependencies and relies on Next/Tailwind.

---
If you'd like, I can: run the lint script, search for all Appwrite usages to refactor into a single helper, or add a short PR checklist. Which would you prefer next?
