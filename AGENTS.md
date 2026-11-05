# Portfolio Website — Project Memory

## Stack and commands

- Next.js 16.4.5 (App Router, Turbopack), React 19.3.1, TypeScript 5.9, Tailwind CSS 4.3.4.
- Commands: `npm run dev`, `npm run build`, `npm run lint` (eslint).
- No test runner. Gates are `npm run lint` and `npm run build` plus the visual/keyboard checks in Task 11 of the plan.
- MongoDB via Mongoose. Data layer lives in `lib/mongodb.ts`, `models/*`, `app/api/*`.

## Route map

- Public: `/`, `/projects`, `/projects/[slug]`, `/contact`.
- Admin (unchanged flow): `/admin`, `/admin/login`.
- API: `/api/projects`, `/api/projects/[id]`, `/api/projects/by-slug/[slug]`, `/api/projects/reorder`, `/api/contact`, `/api/contact/[id]`, `/api/upload`, `/api/upload/migrate-existing`, `/api/images/[id]`, `/api/admin/*`.

## Data and profile

- Profile, experience, toolkit, education and about copy: `lib/profile.ts`.
- Project loader (server, cached per request, DB with `defaultProjects` fallback): `lib/projects.ts`.
- Fallback project data: `lib/defaultProjects.ts`. Digital Poonam and AI Bizz Pro now use `/images/project-images/digital-poonam.png` and `aibizzpro.png`.
- Home reads projects on the server with `revalidate = 60`. Projects index keeps the client fetch to `/api/projects`.

## Signal design tokens

- Tokens are semantic CSS variables in `app/globals.css`, defined per theme and mapped through `@theme inline`.
- Light: `:root` — paper `#f3efe6`, ink `#1b1815`, accent `#c2401b`, accent-ink `#b23a16`, ok `#226b3b`.
- Dark: `.dark` — paper `#141210`, ink `#f2ede4`, accent `#e86a44`, accent-ink `#f09172`, ok `#6bd08f`.
- Components must use semantic utilities only (`bg-paper`, `text-ink`, `border-line`, `text-accent-ink`). No hardcoded hex and no colour `dark:` overrides.
- `next-themes` with `defaultTheme="system"` and `enableSystem`; `ThemeToggle` is the only toggle. Admin is pinned to light via `[data-admin]`.
- Legacy `brand-*` aliases are fixed light values used only by admin. Public pages must not use them.

## Important rules

- Preserve all real facts. No invented metrics, years, clients or outcomes.
- Admin flows stay functionally unchanged. Only `data-admin` was added to the admin roots.
- Do not commit unrelated working-tree files. Stage only the paths each task names.
- The working tree contains many pre-existing uncommitted files; never wipe the tree with `git clean`.
