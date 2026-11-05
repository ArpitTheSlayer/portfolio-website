# Portfolio Redesign — "Signal" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the public portfolio's gradient/glass styling with the Signal paper-and-ink system and a matching dark theme, keeping every real fact, API route, database model and admin flow intact.

**Architecture:** Tokens and typography live in `app/globals.css` and `app/layout.tsx`. One semantic token layer is defined for light (`:root`) and dark (`.dark`) and mapped into Tailwind, so components never branch on theme. `next-themes` applies system preference or the stored choice before paint. Public content moves into typed modules (`lib/profile.ts`, `lib/projects.ts`). Shared presentational components (`Button`, `SectionLabel`, `WorkCard`, `Reveal`, `SocialLinks`, `ThemeToggle`) carry the visual system. Pages become server components except where interaction requires the client (projects fetch, contact form, copy buttons, navbar, reveals). Admin is pinned to the light palette via `[data-admin]`.

**Tech Stack:** Next.js 16.4.5 (App Router, Turbopack), React 19.3.1, TypeScript 5.9, Tailwind CSS 4.3.4, motion 13.5.1, lucide-react 1.68.0.

**Spec:** `docs/superpowers/specs/2026-11-05-portfolio-redesign-design.md`

**No test runner exists in this project.** Each task's gate is `npm run lint` plus `npm run build`, and the task-specific check listed in its final step. The final task adds visual, keyboard, contrast and admin checks.

## Global Constraints

- Two themes, one component tree. Light is paper-and-ink; dark is warm charcoal-and-frost. Components consume semantic utilities only (`bg-paper`, `text-ink`, `border-line`, `text-accent-ink`) and must not hardcode hex values or add colour `dark:` overrides.
- Keep `next-themes` and `ThemeProvider` (`attribute="class"`, `defaultTheme="system"`, `enableSystem`, `suppressHydrationWarning`). Add a shared `ThemeToggle`; do not remove the dependency.
- Light palette: `--paper #f3efe6`, `--paper-raised #ebe4d7`, `--paper-deep #e2d9ca`, `--ink #1b1815`, `--ink-soft #4c463f`, `--muted #6b6259`, `--line #d8d0c3`, `--line-strong #b9ae9d`, `--accent #c2401b`, `--accent-ink #b23a16`, `--ok #226b3b`.
- Dark palette: `--paper #141210`, `--paper-raised #1b1815`, `--paper-deep #0e0c0b`, `--ink #f2ede4`, `--ink-soft #c7beb2`, `--muted #9c9184`, `--line #2c2621`, `--line-strong #4b4238`, `--accent #e86a44`, `--accent-ink #f09172`, `--ok #6bd08f`.
- Admin stays on the light palette. Add `data-admin` to both admin roots; CSS pins it to light and the `dark:` variant is excluded inside it. `brand-*` aliases are fixed light values and are used by admin only.
- Fonts: Inter (UI/body) and Geist Mono (labels/metadata), both via `next/font`.
- Container `1312px`; gutters 64/48/40/24 at ≥1280 / 1024–1279 / 768–1023 / ≤767.
- Corners 0–2px on public pages. No gradients, glows, glass, shadows or rounded pills in either theme.
- Preserve every fact: name, role, location, availability, email, phone, socials, experience, achievements, education, project names, descriptions, links and screenshots. Rewrite only connective copy.
- No new runtime dependencies. `next-themes` is already installed and stays.
- Keep `lib/mongodb.ts`, `lib/auth.ts`, `lib/slug.ts`, `models/*`, `app/api/*` and `app/admin/*` functionally unchanged. Admin gets only the `data-admin` attribute needed to pin its theme.
- The working tree contains many pre-existing uncommitted files. `git add` only the paths listed in each task.
- After every task: `npm run lint` then `npm run build` must pass.
- Target WCAG 2.2 AA: 4.5:1 body text, 3:1 large text, visible focus, skip link, one `h1` per page, in both themes.

## Review Focus

These are the failure modes the spec implies but no task's build check proves. Each is pinned to a task step.

1. **Database unavailable at build or request time.** Home, projects index and case study must render the eight fallback projects instead of throwing. → Task 3, step 5.
2. **`prefers-reduced-motion: reduce`.** Sections must be visible immediately, with no transforms or delayed reveals. → Task 4, step 4 and Task 11, step 5.
3. **Keyboard-only use of the mobile drawer and theme toggle.** Focus must enter the drawer, cycle inside it, close on Escape, and return to the trigger; the toggle must have an action-based name. → Task 6, step 6 and Task 11, step 5.
4. **360px viewport.** Long project names, tag lines, email, phone, nav and form must not cause horizontal overflow. → Task 11, step 4.
5. **Admin after the token change.** Admin pages use `brand-*` classes; without fixed aliases they render unstyled. → Task 2, step 6.
6. **Theme flash and theme drift.** The resolved theme must be applied before paint, and both themes must use the same components and layout. → Task 2, steps 2 and 4 and Task 11, steps 3, 6.
7. **Dark contrast.** Every text token must be checked against the dark `--paper`, not the light one. → Task 2, step 7 and Task 11, step 8.

---

### Task 1: Commit the verified dependency bump

**Files:**
- Modify (already changed): `package.json`, `package-lock.json`

**Interfaces:**
- Consumes: nothing.
- Produces: a clean baseline so later diffs contain only redesign work.

- [ ] **Step 1: Confirm the dependency diff is the verified update**

Run: `git diff -- package.json`
Expected: Next `^16.3.4`, React/React DOM `^19.2.8`, `eslint-config-next ^16.3.4`, plus the pre-existing site dependencies (`lucide-react`, `mongoose`, `motion`, `react-markdown`, `remark-gfm`). No TypeScript 7, ESLint 10 or motion 14.

- [ ] **Step 2: Confirm lint and build still pass**

Run: `npm run lint` then `npm run build`
Expected: both exit 0; build lists 18 routes and reports Next.js 16.4.5.

- [ ] **Step 3: Commit only the dependency files**

```powershell
git add package.json package-lock.json
git commit -m "chore(deps): update packages within current majors"
```

---

### Task 2: Token system, themes, fonts and layout shell

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `components/ThemeToggle.tsx`
- Modify: `app/admin/page.tsx`, `app/admin/login/page.tsx` (add `data-admin` to the root element only)
- Keep: `package.json`, `package-lock.json` (`next-themes` stays)

**Interfaces:**
- Consumes: nothing.
- Produces: Tailwind utilities `bg-paper`, `bg-paper-raised`, `bg-paper-deep`, `text-ink`, `text-ink-soft`, `text-muted`, `border-line`, `border-line-strong`, `text-accent`, `text-accent-ink`, `text-ok`, `text-display`, `text-page`, `text-section`, `text-card`, `text-body-lg`, `text-label`, `text-meta`, `max-w-site`, `font-mono`; global `.skip-link`, focus ring, reduced-motion rules; a working light/dark theme; fixed legacy `brand-*` aliases and a light-pinned admin scope; `ThemeToggle`.

- [ ] **Step 1: Replace `app/globals.css`**

Remove the Google Fonts `@import` and the old `.dark` block. Keep `@import "tailwindcss";`. Write:

```css
@import "tailwindcss";

/* Admin opts out of the dark theme; its legacy dark: classes stay inert. */
@custom-variant dark (&:where(.dark, .dark *):not(:where([data-admin], [data-admin] *)));

:root {
  --paper: #f3efe6;
  --paper-raised: #ebe4d7;
  --paper-deep: #e2d9ca;
  --ink: #1b1815;
  --ink-soft: #4c463f;
  --muted: #6b6259;
  --line: #d8d0c3;
  --line-strong: #b9ae9d;
  --accent: #c2401b;
  --accent-ink: #b23a16;
  --ok: #226b3b;
  color-scheme: light;
}

.dark {
  --paper: #141210;
  --paper-raised: #1b1815;
  --paper-deep: #0e0c0b;
  --ink: #f2ede4;
  --ink-soft: #c7beb2;
  --muted: #9c9184;
  --line: #2c2621;
  --line-strong: #4b4238;
  --accent: #e86a44;
  --accent-ink: #f09172;
  --ok: #6bd08f;
  color-scheme: dark;
}

@theme inline {
  --color-paper: var(--paper);
  --color-paper-raised: var(--paper-raised);
  --color-paper-deep: var(--paper-deep);
  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-muted: var(--muted);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-accent: var(--accent);
  --color-accent-ink: var(--accent-ink);
  --color-ok: var(--ok);

  /* Legacy aliases. Admin still uses brand-*; public pages must not.
     Fixed light values so the pinned-light admin is predictable. */
  --color-brand-red: #b23a16;
  --color-brand-orange: #c2401b;
  --color-brand-cream: #f3efe6;
  --color-brand-cyan: #b23a16;
  --color-brand-dark: #1b1815;
  --color-brand-dark-surface: #2a2622;
  --color-brand-dark-border: #3f3831;
  --color-brand-light: #f3efe6;
  --color-brand-light-surface: #fbf8f2;
  --color-brand-light-border: #d8d0c3;

  --text-display: 4.75rem;
  --text-display--line-height: 1.03;
  --text-display--letter-spacing: -0.035em;
  --text-display--font-weight: 600;
  --text-page: 3.5rem;
  --text-page--line-height: 1.07;
  --text-page--letter-spacing: -0.03em;
  --text-page--font-weight: 600;
  --text-section: 2.5rem;
  --text-section--line-height: 1.1;
  --text-section--letter-spacing: -0.02em;
  --text-section--font-weight: 600;
  --text-card: 1.125rem;
  --text-card--line-height: 1.33;
  --text-card--letter-spacing: -0.01em;
  --text-body-lg: 1.03125rem;
  --text-body-lg--line-height: 1.64;
  --text-label: 0.59375rem;
  --text-label--line-height: 1.47;
  --text-label--letter-spacing: 0.16em;
  --text-meta: 0.625rem;
  --text-meta--line-height: 1.5;
  --text-meta--letter-spacing: 0.08em;

  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, "SFMono-Regular", monospace;

  --container-site: 1312px;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 96px;
}

body {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Admin is out of the visual redesign and stays on the light palette. */
[data-admin] {
  color-scheme: light;
  background: #f3efe6;
  color: #1b1815;
}

::selection {
  background: var(--accent);
  color: var(--paper);
}

:focus-visible {
  outline: 2px solid var(--accent-ink);
  outline-offset: 3px;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  background: var(--ink);
  color: var(--paper);
  padding: 12px 16px;
}
.skip-link:focus { left: 16px; top: 16px; }

/* Admin/login still uses the old logo filter. */
.brand-logo-filter { filter: invert(1) hue-rotate(180deg); }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Rewrite `app/layout.tsx`**

Import `Inter` and `Geist_Mono` from `next/font/google` with `variable: "--font-inter"` / `"--font-geist-mono"`, `subsets: ["latin"]`, `display: "swap"`. Keep `ThemeProvider` from `next-themes`. Export metadata and viewport:

```ts
export const metadata: Metadata = {
  title: { default: "Arpit Pandey — Frontend Developer", template: "%s — Arpit Pandey" },
  description:
    "Frontend developer in Raipur, India. Next.js, React and Tailwind CSS with a full-stack foundation in Node.js, Express, MySQL and MongoDB.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/logo.png", type: "image/png" }],
    apple: "/logo.png",
  },
  openGraph: {
    title: "Arpit Pandey — Frontend Developer",
    description:
      "Frontend developer in Raipur, India. Next.js, React and Tailwind CSS with a full-stack foundation.",
    type: "website",
    locale: "en_IN",
    siteName: "Arpit Pandey",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};
```

`<html lang="en" suppressHydrationWarning>`; body `className={inter.variable + " " + geistMono.variable + " bg-paper text-ink"}`. Wrap with:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
  <a href="#main" className="skip-link">Skip to content</a>
  {children}
</ThemeProvider>
```

The `suppressHydrationWarning` is required because `next-themes` sets the class before React hydrates.

- [ ] **Step 3: Keep the theme dependency**

Confirm `next-themes` remains in `package.json`. Do not run `npm uninstall`. It is the only safe way to apply the stored/system theme before first paint without a custom blocking script.

- [ ] **Step 4: Create `components/ThemeToggle.tsx`**

Client component using `next-themes` and a mounted guard:

```tsx
"use client";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};
const useMounted = () => useSyncExternalStore(emptySubscribe, () => true, () => false);

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={`grid size-11 place-items-center border border-line text-ink-soft transition-colors hover:border-ink hover:text-ink ${className}`}
    >
      {isDark ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
    </button>
  );
}
```

The server and first client render both show the moon, so hydration matches; the icon corrects after mount.

- [ ] **Step 5: Pin the admin pages to light**

In `app/admin/page.tsx` and `app/admin/login/page.tsx`, add `data-admin` to the outermost `<div>` that already has `min-h-screen`. Change nothing else. Verify the attribute exists twice:

```powershell
Select-String -Path app/admin/page.tsx,app/admin/login/page.tsx -Pattern "data-admin"
```

- [ ] **Step 6: Verify token contrast in both themes**

Run:

```powershell
node -e "const L=h=>{const c=h.replace('#','').match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]};const r=(a,b)=>((Math.max(L(a),L(b))+.05)/(Math.min(L(a),L(b))+.05)).toFixed(2);const sets={light:{bg:'#f3efe6',c:{ink:'#1b1815','ink-soft':'#4c463f',muted:'#6b6259','accent-ink':'#b23a16',accent:'#c2401b',ok:'#226b3b'}},dark:{bg:'#141210',c:{ink:'#f2ede4','ink-soft':'#c7beb2',muted:'#9c9184','accent-ink':'#f09172',accent:'#e86a44',ok:'#6bd08f'}}};for(const [t,s] of Object.entries(sets))for(const [n,c] of Object.entries(s.c))console.log(t,n,r(c,s.bg))"
```

Expected light: `ink 15.40`, `ink-soft 8.11`, `muted 5.20`, `accent-ink 5.21`, `accent 4.53`, `ok 5.66`.
Expected dark: `ink 16.03`, `ink-soft 10.18`, `muted 6.05`, `accent-ink 8.01`, `accent 5.85`, `ok 9.83`.

- [ ] **Step 7: Verify admin and the build**

Run: `npm run build`
Expected: pass. Open `/admin/login` later in Task 11 and confirm the panel is still legible (cream surface, dark text, orange accents) even while the public site is in dark mode.

- [ ] **Step 8: Commit**

```powershell
git add app/globals.css app/layout.tsx components/ThemeToggle.tsx app/admin/page.tsx app/admin/login/page.tsx
git commit -m "feat(design): add signal light and dark theme tokens"
```

---

### Task 3: Profile data, project loader and screenshot paths

**Files:**
- Create: `lib/profile.ts`
- Create: `lib/projects.ts`
- Modify: `lib/defaultProjects.ts` (two `src` values)

**Interfaces:**
- Consumes: `ProjectItem` from `lib/defaultProjects.ts`, `slugify` from `lib/slug.ts`.
- Produces:
  - `profile`, `experience`, `toolkit`, `education`, `about`, `SkillLevel`, `SocialLink` from `lib/profile.ts`.
  - `FEATURED_COUNT = 3`, `getProjects()`, `findProjectIndex(projects, slug)`, `findProject(projects, slug)`, `getProjectBySlug(slug)` from `lib/projects.ts`.

- [ ] **Step 1: Create `lib/profile.ts`**

Export typed constants. Copy facts from the current `app/page.tsx`; do not invent anything.

```ts
export type SkillLevel = "Advanced" | "Proficient" | "Intermediate";
export interface SocialLink { label: string; href: string; }
export interface ToolkitItem { name: string; level?: SkillLevel; }
export interface ToolkitGroup { label: string; items: ToolkitItem[]; }
export interface EducationItem {
  degree: string; institution: string; location: string; duration: string; score: string;
}
export interface ExperienceAchievement {
  title: string; description: string; url?: string; linkLabel?: string;
}

export const profile = {
  name: "Arpit Pandey",
  role: "Frontend Developer",
  location: "Raipur, Chhattisgarh, India",
  shortLocation: "Raipur, IN",
  availability: "Available for work",
  email: "arpitpandey.2001@gmail.com",
  phone: "+91-8318346405",
  phoneHref: "tel:+918318346405",
  cv: "/Resume.pdf",
  intro:
    "Frontend developer with a full-stack foundation. I turn complex requirements into responsive Next.js products — currently rebuilding the Digital Poonam platform and shipping AI-augmented tooling.",
  credentials: "MCA 9.34 CGPA · BCA 9.00 CGPA · 6+ PROJECTS SHIPPED",
  current: {
    role: "Frontend Developer",
    company: "Digital Poonam (Shree Shivam Venture)",
    period: "13 May 2026 — Present",
    location: "Raipur, Chhattisgarh",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/arpittheslayer" },
    { label: "LinkedIn", href: "https://linkedin.com/in/arpittheslayer" },
    { label: "Instagram", href: "https://instagram.com/arpittheslayer" },
  ] satisfies SocialLink[],
};
```

`experience`:

```ts
export const experience = {
  role: "Frontend Developer",
  company: "Digital Poonam (Shree Shivam Venture)",
  period: "13 May 2026 — Present",
  location: "Raipur, Chhattisgarh",
  achievements: [
    { title: "Next.js Framework Platform Migration", description: "Migrated the company’s main web platform layout to a modern Next.js framework (digitalpoonam.com) using AI and visual platforms to design high-end animations and content structure.", url: "https://digitalpoonam.com", linkLabel: "digitalpoonam.com" },
    { title: "AI-Driven Automated Product Listing Pipeline", description: "Built an AI-driven automated product listing pipeline that leverages internal inventory APIs and image parsing tools to generate structured data for ingestion into Shopify stores." },
    { title: "Interactive Stock Check & Lookup Dashboard", description: "Created a visual lookup interface and interactive Stock Check dashboard, mapping retail database API streams into a clean, responsive frontend layout." },
    { title: "Scalable Landing Pages & Workflows on Vercel", description: "Deployed scalable landing platforms (aibizzpro.com and marketing landing pages) on Vercel with integrated automated email and WhatsApp communication workflows.", url: "https://aibizzpro.com", linkLabel: "aibizzpro.com" },
    { title: "Full-Stack Startup Engineering", description: "Maintained core full-stack parameters; merged foundational coding with modern automation tools to support daily startup technical needs." },
  ] satisfies ExperienceAchievement[],
  technologies: ["Next.js", "React", "Shopify APIs", "AI Image Parsing", "Vercel", "WhatsApp API", "Tailwind CSS", "REST APIs"],
};
```

`toolkit` (keep the existing proficiency levels exactly):

```ts
export const toolkit: ToolkitGroup[] = [
  { label: "Frontend", items: [
    { name: "HTML5", level: "Advanced" }, { name: "CSS3", level: "Advanced" },
    { name: "JavaScript", level: "Proficient" }, { name: "React.js", level: "Proficient" },
    { name: "Next.js", level: "Proficient" }, { name: "Tailwind CSS", level: "Proficient" },
  ]},
  { label: "Backend", items: [
    { name: "Node.js", level: "Intermediate" }, { name: "Express.js", level: "Proficient" },
    { name: "MySQL", level: "Proficient" }, { name: "MongoDB", level: "Intermediate" },
  ]},
  { label: "Design", items: [{ name: "Figma", level: "Proficient" }] },
  { label: "Practice", items: [
    { name: "AI-augmented workflows" }, { name: "REST APIs" }, { name: "Responsive systems" },
  ]},
];
```

`education` (MCA first):

```ts
export const education: EducationItem[] = [
  { degree: "Master of Computer Applications (MCA)", institution: "MATS University", location: "Raipur, Chhattisgarh", duration: "July 2024 - July 2026", score: "9.34 CGPA" },
  { degree: "Bachelor of Computer Applications (BCA)", institution: "MATS University", location: "Raipur, Chhattisgarh", duration: "July 2022 - May 2024", score: "9.00 CGPA" },
  { degree: "Diploma in Computer Applications (DCA)", institution: "Kalinga University", location: "Raipur, Chhattisgarh", duration: "July 2020 - May 2021", score: "8.38 CGPA" },
];
```

`about` (70–90 words each; use this copy):

```ts
export const about = [
  {
    title: "The journey",
    body: "I started with a Diploma in Computer Applications, then a BCA and an MCA at MATS University, finishing with 9.34 and 9.00 CGPA. Alongside the degrees I kept building: small interfaces first, then full-stack apps, then production platforms. That mix of formal computer science and hands-on shipping is how I learned to read a requirement, question it, and turn it into something people can actually use.",
  },
  {
    title: "How I work",
    body: "I work close to the design and close to the data. A good interface is not decoration; it is the shortest honest path between a person and what they came to do. In practice that means understanding the API before styling the screen, keeping components small, testing at real widths, and trimming anything that does not help the reader. I use AI to move faster, but I review what it produces.",
  },
];
```

- [ ] **Step 2: Create `lib/projects.ts`**

Use React `cache` so metadata and page render share one query per request. Mirror the API route's ordering and fallback.

```ts
import { cache } from "react";
import { defaultProjects, type ProjectItem } from "./defaultProjects";
import { slugify } from "./slug";

export const FEATURED_COUNT = 3;

export const getProjects = cache(async (): Promise<ProjectItem[]> => {
  try {
    if (!process.env.MONGODB_URI) return defaultProjects;
    const { connectToDatabase } = await import("./mongodb");
    const Project = (await import("@/models/Project")).default;
    await connectToDatabase();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    if (!projects || projects.length === 0) return defaultProjects;
    return JSON.parse(JSON.stringify(projects)) as ProjectItem[];
  } catch (err) {
    console.warn("Using fallback projects data", err);
    return defaultProjects;
  }
});

export function findProjectIndex(projects: ProjectItem[], slug: string): number {
  return projects.findIndex(
    (p) =>
      p.slug === slug ||
      p._id === slug ||
      slugify(p.name) === slug ||
      p.name.toLowerCase() === slug.toLowerCase()
  );
}

export function findProject(projects: ProjectItem[], slug: string): ProjectItem | null {
  const index = findProjectIndex(projects, slug);
  return index === -1 ? null : projects[index];
}

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectItem | null> => {
  const projects = await getProjects();
  return findProject(projects, slug);
});
```

- [ ] **Step 3: Point the two commercial projects at the real captures**

In `lib/defaultProjects.ts`:
- Digital Poonam `src`: `/images/project-images/digital-poonam.png`
- AI Bizz Pro `src`: `/images/project-images/aibizzpro.png`

Leave every other field untouched.

- [ ] **Step 4: Verify the paths and the fallback**

Run: `Select-String -Path lib/defaultProjects.ts -Pattern "digital-poonam.png|aibizzpro.png"`
Expected: exactly two matches, one per project.

Run: `npm run lint` then `npm run build`
Expected: both pass. (Home is not using the loader yet, so the build is offline.)

- [ ] **Step 5: Commit**

```powershell
git add lib/profile.ts lib/projects.ts lib/defaultProjects.ts
git commit -m "feat(data): add profile model, project loader and live captures"
```

---

### Task 4: Shared primitives

**Files:**
- Modify: `components/Button.tsx`
- Create: `components/SectionLabel.tsx`
- Create: `components/Reveal.tsx`
- Create: `components/Proficiency.tsx`
- Create: `components/SocialLinks.tsx`

**Interfaces:**
- Consumes: `profile.socials` from `lib/profile.ts`.
- Produces:
  - `ButtonProps { text?, link?, onClick?, variant?: "primary" | "outline" | "text", className?, children?, type?, disabled? }`
  - `SectionLabel({ label, right?, className? })`
  - `Reveal({ children, className?, delay?, duration? })`
  - `Proficiency({ level })`
  - `SocialLinks({ className? })`

- [ ] **Step 1: Rewrite `Button.tsx` as a plain component**

No `"use client"`, no motion. Base classes:

```
inline-flex h-11 items-center justify-center gap-2 rounded-[2px] px-5 text-sm font-semibold tracking-[0.01em] transition-colors disabled:cursor-not-allowed disabled:opacity-50
```

Variants:
- `primary`: `bg-ink text-paper hover:bg-ink-soft`
- `outline`: `border border-line-strong text-ink hover:border-ink hover:bg-ink/5`
- `text`: `h-auto px-0 text-accent-ink underline-offset-4 hover:underline`

When `link` is set, render a Next `Link` with the same classes and the children/text. Otherwise render `<button type={type} disabled={disabled} onClick={onClick}>`. This removes the invalid button-inside-link nesting the current component has.

Keep the existing prop names so `app/admin/page.tsx` and `app/admin/login/page.tsx` compile unchanged. They only use `variant="primary"`.

- [ ] **Step 2: Create `SectionLabel.tsx`**

Server component. Render:

```tsx
<div className={`flex items-baseline justify-between gap-4 font-mono text-label uppercase text-muted ${className ?? ""}`}>
  <span>{label}</span>
  {right ? <span className="text-right">{right}</span> : null}
</div>
```

- [ ] **Step 3: Create `Reveal.tsx`**

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export default function Reveal({ children, className, delay = 0, duration = 0.3 }: {
  children: React.ReactNode; className?: string; delay?: number; duration?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Create `Proficiency.tsx`**

Server component. Render `<span className="text-sm font-normal text-muted">{level}</span>`; no pill, border or background. It takes `{ level: SkillLevel }` from `lib/profile.ts`.

- [ ] **Step 5: Create `SocialLinks.tsx`**

Server component. Map `profile.socials` to an inline `<ul>` of external links with `target="_blank"` and `rel="noopener noreferrer"`. Each link is `font-mono text-meta uppercase text-muted hover:text-accent-ink` plus `underline-offset-4 hover:underline`. Accept `className` for layout (`flex gap-4` etc.).

**Review Focus check:** the reduced-motion branch is the one that must be exercised in Task 11.

- [ ] **Step 6: Verify and commit**

Run: `npm run lint` then `npm run build`
Expected: pass; admin still compiles against `Button`.

```powershell
git add components/Button.tsx components/SectionLabel.tsx components/Reveal.tsx components/Proficiency.tsx components/SocialLinks.tsx
git commit -m "feat(ui): add signal button, label, reveal and social primitives"
```

---

### Task 5: Navbar and footer

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `components/Footer.tsx`

**Interfaces:**
- Consumes: `Button`, `SocialLinks`, `profile`, `ThemeToggle`.
- Produces: the shared header (`<header>` 72px sticky) and footer used by every public page, with the theme toggle reachable on desktop and in the drawer.

- [ ] **Step 1: Rewrite `Navbar.tsx`**

Client component. Delete the logo image, the bespoke theme toggle markup, the admin link, the `next-themes` import and the `Moon.svg` / `Sun.svg` image imports. Render the shared `<ThemeToggle />` instead.

Nav items, in order:

```ts
const navItems = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/contact" },
];
```

Header:
- `sticky top-0 z-40 h-[72px] border-b border-line bg-paper/95` (no blur).
- Inner `mx-auto flex h-full max-w-site items-center justify-between px-6 md:px-10 lg:px-16`.
- Wordmark Link to `/`: name at `text-[15px] font-semibold tracking-tight`, role underneath at `font-mono text-[9px] uppercase tracking-[0.16em] text-muted`.
- Desktop nav visible from `lg`; active item has a 1px accent underline (`after:` pseudo-element), inactive `text-ink-soft hover:text-ink`. Use `aria-current="page"` for the active item.
- Right side: availability dot (`size-1.5 rounded-full bg-ok`) and `Available for work` at `text-sm text-ink-soft`, hidden below `xl`; `<ThemeToggle />`; `Button text="Download CV" link="/Resume.pdf"`.
- Mobile trigger: 44×44 button, `aria-expanded`, `aria-controls="mobile-nav"`, `Menu`/`X` icons.

Mobile drawer:
- `id="mobile-nav"`, `fixed inset-x-0 top-[72px] bottom-0 z-30 bg-paper px-6 py-8 lg:hidden`.
- Lock body scroll while open; restore on close/unmount.
- On open, focus the first link. Trap Tab/Shift+Tab inside the panel. Escape closes. On close, focus returns to the trigger.
- Close on pathname change.
- Include the four nav links, `<ThemeToggle />`, the CV button, and the availability line.

Active state:
- `/projects` or `/projects/*` → Work.
- `/contact` → Contact.
- `/` → About/Experience based on scroll (`#about`, `#experience`), default Work? Use no active item on the hero; Work is a separate page. Keep the existing scroll listener, but only for `about` and `experience`.

**Review Focus check:** the focus trap and Escape behaviour are the keyboard gate.

- [ ] **Step 2: Rewrite `Footer.tsx`**

Server component (`"use client"` removed). Structure:
- `<footer className="mt-24 border-t border-line">`
- Container `mx-auto max-w-site px-6 py-14 md:px-10 lg:px-16`.
- Top grid `grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]`.
  - Column 1: `Arpit Pandey`, `Frontend Developer`, availability dot + text.
  - Column 2: `Navigate` — Work, About, Experience, Contact.
  - Column 3: `Elsewhere` — `<SocialLinks className="flex flex-col gap-2" />`.
  - Column 4: `Contact` — email link, phone link, CV link. Mono labels above each block.
- Bottom row `mt-12 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:justify-between`: `© {year} Arpit Pandey` and `Built with Next.js`.
- No logo tile, no gradients, no motion.

- [ ] **Step 3: Verify and commit**

Run: `npm run lint` then `npm run build`
Expected: pass. `Select-String -Path components/Navbar.tsx,components/Footer.tsx -Pattern "brand-|gradient|backdrop-blur|rounded-3xl"` returns nothing.

```powershell
git add components/Navbar.tsx components/Footer.tsx
git commit -m "feat(nav): rebuild header and footer for the signal system"
```

---

### Task 6: Home page

**Files:**
- Create: `components/WorkCard.tsx`
- Modify: `app/page.tsx` (full rewrite, server component)

**Interfaces:**
- Consumes: `getProjects`, `FEATURED_COUNT`; `profile`, `experience`, `toolkit`, `education`, `about`; `Navbar`, `Footer`, `Button`, `SectionLabel`, `Reveal`, `Proficiency`, `WorkCard`.
- Produces: `WorkCard({ project, href, index?, variant?, priority? })`, used by the home page and Task 7.

- [ ] **Step 1: Create `WorkCard.tsx`**

`variant="compact"` (home):
- Whole card is one `<Link href={href} className="group block">`.
- Image wrapper `relative aspect-[2.05/1] overflow-hidden border border-line bg-paper-deep`; `Image fill` with `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 416px"`, `className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.015]"`.
- Title + arrow row `mt-4 flex items-baseline justify-between gap-4`; title `text-card font-semibold group-hover:underline decoration-1 underline-offset-4`; arrow `↗` in `text-accent`, `transition-transform group-hover:translate-x-[3px]`.
- Meta line `mt-1 font-mono text-meta uppercase text-muted`: `project.tags?.slice(0, 2).join(" · ")`.

`variant="full"` (projects index):
- `<article className="group flex h-full flex-col">`; image wrapped in its own `<Link>`; title in a second `<Link>`; no link wraps the whole card.
- Index number `String(index + 1).padStart(2, "0")` in `font-mono text-meta text-accent-ink`.
- Name `text-card font-semibold`, description `mt-2 line-clamp-2 text-sm text-ink-soft`, tags joined by ` · ` in mono meta, and `Live ↗` / `Source ↗` external links in `text-accent-ink`.
- If neither link exists, show `Private project` in `text-muted`.

- [ ] **Step 2: Rewrite `app/page.tsx`**

Server component. Add `export const revalidate = 60;`. Import `profilePic from "@/assets/images/profile-pic.png"`. At the top:

```ts
const projects = await getProjects();
const featured = projects.slice(0, FEATURED_COUNT);
const count = `${String(featured.length).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
```

Render `<Navbar />`, `<main id="main">`, `<Footer />`. Sections in order:

1. **Hero** — `grid gap-12 pt-16 lg:grid-cols-12 lg:gap-16`.
   - Left `lg:col-span-7`: eyebrow `PORTFOLIO — 2026 / RAIPUR, IN` (`font-mono text-label uppercase text-muted`); `h1` with three lines `I build fast,` / `considered interfaces` / `for real products.` at `text-[42px] leading-[1.05] tracking-[-0.03em] sm:text-[56px] sm:leading-[1.04] lg:text-display`; intro `max-w-[610px] text-body-lg text-ink-soft`; buttons `View selected work` → `/#work` (primary) and `Download CV` → `/Resume.pdf` (outline); credentials in `font-mono text-meta uppercase text-muted`.
   - Right `lg:col-span-5`: portrait `relative aspect-[4/5] w-full max-w-[396px] overflow-hidden bg-paper-deep lg:ml-auto lg:aspect-[396/440]` with `Image src={profilePic} fill priority sizes="(max-width: 1024px) 80vw, 396px" className="object-cover"` and `alt="Arpit Pandey"`; caption `ARPIT PANDEY / DIGITAL POONAM`; `CURRENTLY` label; role + company; period + location. Use `profile.current`.
   - Wrap the left column in `<Reveal duration={0.36}>` and the portrait column in `<Reveal delay={0.12} duration={0.48}>`.

2. **Selected work** — `id="work"`, `border-t border-line pt-12 md:pt-16`.
   - `<SectionLabel label="Selected work" right={count} />`.
   - Grid `mt-8 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3`, map `featured` through `<WorkCard variant="compact" href={"/projects/" + (p.slug || slugify(p.name))} />`. Import `slugify` from `@/lib/slug`.
   - `All projects →` text link to `/projects`.

3. **Experience** — `id="experience"`, same rule. SectionLabel `Experience`. Role/company header, period and location, then the five achievements as `<li>` with `border-l-2 border-accent/40 pl-4`; title in `font-semibold text-ink`, description `text-ink-soft`, optional external link. Key technologies as a single `font-mono text-meta uppercase text-muted` line.

4. **Toolkit** — `id="toolkit"`. SectionLabel `Toolkit`. For each group: `grid gap-2 border-t border-line py-5 md:grid-cols-[200px_1fr]`. Label in mono; items as a wrapped `<ul>`; each item renders the name in `text-ink` followed by `<Proficiency level={item.level} />` when a level exists.

5. **Education** — `id="education"`. SectionLabel `Education`. Each item: `grid gap-2 border-t border-line py-5 md:grid-cols-[1fr_auto]`; degree `text-card font-semibold`, institution/location `text-sm text-ink-soft`, duration mono meta, score `font-mono text-sm text-accent-ink`.

6. **About** — `id="about"`. SectionLabel `About`. Two columns `grid gap-10 md:grid-cols-2`; `h3` `text-2xl font-semibold` + body `text-ink-soft`.

7. **Contact CTA** — `id="contact"`, `border-t border-line pt-12 md:pt-16`. SectionLabel `Contact`. Large email link (`text-[clamp(1.75rem,5vw,3.5rem)] font-semibold text-ink hover:text-accent-ink`) to `mailto:`. Phone and location lines. Availability dot + text. `<SocialLinks />`.

Use `text-balance`/`text-pretty` sparingly. No gradients, pills, shadows or blurred surfaces.

**Review Focus check:** the DB fallback is exercised by building without `MONGODB_URI` later; the code path must return `defaultProjects` rather than throw.

- [ ] **Step 3: Verify data and count**

Run: `Select-String -Path app/page.tsx -Pattern "03 / 06|dummy-landing-page"`
Expected: no matches.

Run: `npm run lint` then `npm run build`
Expected: pass; `/` is listed as a static/ISR route.

- [ ] **Step 4: Commit**

```powershell
git add app/page.tsx components/WorkCard.tsx
git commit -m "feat(home): rebuild landing page around proof and contact"
```

---

### Task 7: Projects index

**Files:**
- Create: `components/ProjectsList.tsx` (client)
- Modify: `app/projects/page.tsx` (server shell + metadata)

**Interfaces:**
- Consumes: `defaultProjects`, `ProjectItem`, `WorkCard`, `SectionLabel`.
- Produces: the `/projects` page; fetch behaviour unchanged.

- [ ] **Step 1: Move the fetch into `components/ProjectsList.tsx`**

Client component. Keep the current `useState(defaultProjects)` + `useEffect` fetch to `/api/projects` and the `data.success && Array.isArray(...)` guard exactly. Import `slugify` from `@/lib/slug`. Derive the slug with `project.slug || slugify(project.name) || project._id`.

Render:
- Header block: `<SectionLabel label="Selected work" right={count} />`, `h1` `Work, shipped.` at `text-[40px] leading-[1.08] tracking-[-0.03em] sm:text-page`, one-line intro `Selected projects from the last few years — commercial platforms, full-stack apps and UI builds.`
- `count` uses `String(projects.length).padStart(2, "0")`.
- Grid `mt-12 grid gap-x-8 gap-y-14 lg:grid-cols-2`, mapping to `<WorkCard variant="full" index={index} project={project} href={...} />`.
- No filters.

- [ ] **Step 2: Rewrite `app/projects/page.tsx` as a server component**

```ts
export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects by Arpit Pandey: commercial Next.js platforms, full-stack applications and responsive UI builds.",
};
```

Render `<Navbar />`, `<main id="main" className="mx-auto w-full max-w-site px-6 py-16 md:px-10 md:py-20 lg:px-16"><ProjectsList /></main>`, `<Footer />`.

- [ ] **Step 3: Verify and commit**

Run: `Select-String -Path app/projects/page.tsx,components/ProjectsList.tsx,components/WorkCard.tsx -Pattern "rounded-3xl|backdrop-blur|gradient"`
Expected: no matches.

Run: `npm run lint` then `npm run build`
Expected: pass.

```powershell
git add app/projects/page.tsx components/ProjectsList.tsx
git commit -m "feat(projects): rebuild the work index as an editorial grid"
```

---

### Task 8: Case study, carousel and markdown

**Files:**
- Modify: `app/projects/[slug]/page.tsx`
- Modify: `components/MediaCarousel.tsx`
- Modify: `components/MarkdownViewer.tsx`

**Interfaces:**
- Consumes: `getProjects`, `findProjectIndex`, `getProjectBySlug`.
- Produces: `/projects/[slug]` with previous/next navigation; carousel and markdown restyled without behaviour changes.

- [ ] **Step 1: Rewrite the case study page**

- `generateMetadata`: `const project = await getProjectBySlug(slug);` title `${project.name} — Project Case Study` (root template adds `— Arpit Pandey`); description `project.description`.
- Page: `const projects = await getProjects(); const index = findProjectIndex(projects, slug); if (index === -1) notFound(); const project = projects[index];`
- Previous = `index > 0 ? projects[index - 1] : null`, next = `index < projects.length - 1 ? projects[index + 1] : null`.
- Layout: `<main id="main">` with back link (`← All projects`), mono tags, `h1` at page-title scale, description `text-body-lg text-ink-soft`, live/source links using `Button` (`primary` / `outline`) or underlined text links.
- `<MediaCarousel mainImage={project.src} ... />`.
- Case study body as a bordered-top section, not a card: `<section className="mt-14 border-t border-line pt-10"><MarkdownViewer content={...} /></section>`. Keep the existing fallback markdown.
- Bottom navigation: `grid gap-6 border-t border-line pt-8 sm:grid-cols-2`; left/right links with mono labels `PREVIOUS` / `NEXT`, project names, and `←` / `→`. Keep an `All projects` link.
- `notFound()` behaviour unchanged.

- [ ] **Step 2: Restyle `MediaCarousel.tsx`**

Keep `parseVideoEmbed`, the media list construction, index state, lightbox and all controls. Replace styling only:
- Frame: `border border-line bg-paper-deep`, `rounded-none`.
- Nav buttons: `bg-paper-deep/90 text-ink border border-line-strong hover:border-accent hover:text-accent-ink` and `rounded-none`, 44×44.
- Counter badge: `bg-paper-deep/90 text-ink font-mono text-meta uppercase border border-line-strong`.
- Thumbnails: `rounded-none border-2`; selected `border-accent`, inactive `border-line opacity-60 hover:opacity-100`.
- Lightbox scrim: `bg-black/95 text-white` in both themes; close button `border-white/40 text-white hover:text-accent rounded-none`.
- Video/iframe: `rounded-none`.
- Use `useReducedMotion()` to set transition duration to `0` when reduced.

- [ ] **Step 3: Restyle `MarkdownViewer.tsx`**

Remove the ineffective `prose` classes. Map elements to tokens:
- `h1` `text-2xl font-semibold tracking-tight border-b border-line pb-3 mt-8 mb-4`
- `h2` `text-xl font-semibold text-accent-ink mt-8 mb-3`
- `h3` `text-lg font-semibold mt-6 mb-2`
- `p` `text-base leading-[1.65] text-ink-soft mb-4`
- `ul`/`ol` `pl-5 space-y-1.5 mb-4`
- `li` `marker:text-accent`
- `blockquote` `border-l-2 border-accent pl-4 italic text-ink-soft`
- `a` `text-accent-ink underline decoration-accent/40 underline-offset-4 hover:decoration-accent`
- inline `code` `bg-paper-deep px-1.5 py-0.5 font-mono text-xs text-ink`
- code block `border border-line bg-paper-deep text-ink`; language header `bg-paper-raised text-muted font-mono text-meta uppercase`
- table `border border-line`; `thead` `border-b border-line text-meta uppercase text-muted`; rows `divide-y divide-line`
- `hr` `border-line`
- empty state `text-sm text-muted`

- [ ] **Step 4: Verify and commit**

Run: `Select-String -LiteralPath "app/projects/[slug]/page.tsx","components/MediaCarousel.tsx","components/MarkdownViewer.tsx" -Pattern "brand-|dark:|backdrop-blur|rounded-3xl"`
Expected: no matches.

Run: `npm run lint` then `npm run build`
Expected: pass.

```powershell
git add app/projects/[slug]/page.tsx components/MediaCarousel.tsx components/MarkdownViewer.tsx
git commit -m "feat(case-study): restyle project detail, carousel and markdown"
```

---

### Task 9: Contact page

**Files:**
- Modify: `app/contact/page.tsx` (server + metadata)
- Create: `components/ContactForm.tsx` (client)
- Create: `components/ContactPanel.tsx` (client)

**Interfaces:**
- Consumes: `profile`, `Button`, `SectionLabel`, `SocialLinks`.
- Produces: `/contact`; POST body to `/api/contact` unchanged (`{ name, email, message }`).

- [ ] **Step 1: Create `ContactForm.tsx`**

Move the existing form state, `handleSubmit`, `/api/contact` fetch and response handling verbatim. Render:
- Visible `<label htmlFor="name">Your name</label>` etc.; inputs with `id`, `name`, `autoComplete`, `required`.
- Input classes: `w-full rounded-[2px] border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-accent-ink focus:outline-none focus:ring-2 focus:ring-accent-ink/25`.
- Submit `Button type="submit" variant="primary" disabled={isSubmitting}` with `Send` icon and `Sending…` state.
- Status `<div role="status" aria-live="polite">` with success `border-ok/30 bg-ok/5 text-ok` and error `border-accent/30 bg-accent/5 text-accent-ink`.
- Wrap in `<div className="border border-line p-6 md:p-8">`.

- [ ] **Step 2: Create `ContactPanel.tsx`**

Client component with copy state for email and phone. Use `navigator.clipboard.writeText` inside `try/catch`; on failure, show `Copy failed` for 2.5s. Keep `mailto:` and `tel:` links. Render:
- `EMAIL` mono label + email link + copy button; `PHONE` + phone link + copy button; `LOCATION` + `profile.location`; `STATUS` + availability dot/text.
- `<SocialLinks className="flex flex-col gap-2" />`.
- All interactive elements at least 44×44, with `aria-label` such as `Copy email address`.
- No card fills or shadows; separate blocks with `border-t border-line pt-5`.

- [ ] **Step 3: Rewrite `app/contact/page.tsx`**

Server component with metadata `{ title: "Contact", description: "Contact Arpit Pandey — frontend developer in Raipur, India." }`. Render Navbar, `main#main` with a header (`SectionLabel label="Contact"`, `h1` `Let’s talk.`, one-line intro), then `grid gap-10 lg:grid-cols-12`, `<div className="lg:col-span-7"><ContactForm /></div>` and `<div className="lg:col-span-5"><ContactPanel /></div>`, then Footer.

- [ ] **Step 4: Verify and commit**

Run: `Select-String -Path app/contact/page.tsx,components/ContactForm.tsx,components/ContactPanel.tsx -Pattern "brand-|gradient|backdrop-blur|rounded-3xl"`
Expected: no matches.

Run: `npm run lint` then `npm run build`
Expected: pass.

```powershell
git add app/contact/page.tsx components/ContactForm.tsx components/ContactPanel.tsx
git commit -m "feat(contact): rebuild contact page with accessible form"
```

---

### Task 10: Project memory files

**Files:**
- Create: `AGENTS.md`
- Create: `todo.txt`
- Create: `instructions.txt`

**Interfaces:**
- Consumes: the finished implementation.
- Produces: durable project context for future sessions and the owner's follow-up list.

- [ ] **Step 1: Write `AGENTS.md`**

Cover: stack and commands; route map; where profile/project data lives; the Signal token rules and both palettes; the `ThemeToggle` / `next-themes` setup; the legacy `brand-*` aliases and `[data-admin]` pin that keep admin on the light palette; no test runner; build/lint gates; the DB fallback; the screenshot paths; and the rule not to commit unrelated working-tree files.

- [ ] **Step 2: Write `todo.txt`**

List completed tasks and any remaining manual items (database `src` update, keyboard pass, admin smoke test).

- [ ] **Step 3: Write `instructions.txt`**

Tell the owner exactly what needs a human:
- If the live database already stores Digital Poonam / AI Bizz Pro records, update their `src` in `/admin` to the new captures.
- Run the keyboard pass on the mobile drawer and contact form.
- Run the admin CRUD smoke test.

- [ ] **Step 4: Commit**

```powershell
git add AGENTS.md todo.txt instructions.txt
git commit -m "docs: record project memory and manual follow-ups"
```

---

### Task 11: Full verification

**Files:** none (verification only).

- [ ] **Step 1: Static gates**

Run: `npm run lint`
Expected: exit 0, no warnings.

Run: `npm run build`
Expected: exit 0. Route list includes `/`, `/projects`, `/projects/[slug]`, `/contact`, `/admin`, `/admin/login` and all API routes.

- [ ] **Step 2: Fallback with no database**

```powershell
$env:MONGODB_URI = ""
npm run build
Remove-Item Env:MONGODB_URI
```

Expected: exit 0; `/` still builds using `defaultProjects`.

- [ ] **Step 3: Launch and capture**

Run `npm start` in the background. Capture light screenshots with Chrome:

```powershell
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$out = "$env:TEMP\opencode\signal"
New-Item -ItemType Directory -Force -Path $out | Out-Null
& $chrome --headless=new --disable-gpu --hide-scrollbars --window-size=1440,1400 --screenshot="$out\home-1440.png" "http://localhost:3000/"
& $chrome --headless=new --disable-gpu --hide-scrollbars --window-size=1024,1400 --screenshot="$out\home-1024.png" "http://localhost:3000/"
& $chrome --headless=new --disable-gpu --hide-scrollbars --window-size=390,1800 --screenshot="$out\home-390.png" "http://localhost:3000/"
& $chrome --headless=new --disable-gpu --hide-scrollbars --window-size=360,1800 --screenshot="$out\home-360.png" "http://localhost:3000/"
& $chrome --headless=new --disable-gpu --hide-scrollbars --window-size=360,1800 --screenshot="$out\projects-360.png" "http://localhost:3000/projects"
& $chrome --headless=new --disable-gpu --hide-scrollbars --window-size=360,1800 --screenshot="$out\contact-360.png" "http://localhost:3000/contact"
& $chrome --headless=new --disable-gpu --hide-scrollbars --window-size=1440,1400 --screenshot="$out\projects-1440.png" "http://localhost:3000/projects"
& $chrome --headless=new --disable-gpu --hide-scrollbars --window-size=1440,1400 --screenshot="$out\contact-1440.png" "http://localhost:3000/contact"
& $chrome --headless=new --disable-gpu --hide-scrollbars --window-size=1440,1400 --screenshot="$out\case-1440.png" "http://localhost:3000/projects/digital-poonam-web-platform"
```

`--force-dark-mode` makes Chrome report `prefers-color-scheme: dark`, so with `defaultTheme="system"` and a fresh profile it exercises the real system-preference path. Capture the dark set:

```powershell
$profile = "$env:TEMP\opencode\chrome-dark-profile"
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-dark-mode --user-data-dir=$profile --window-size=1440,1400 --screenshot="$out\home-1440-dark.png" "http://localhost:3000/"
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-dark-mode --user-data-dir=$profile --window-size=390,1800 --screenshot="$out\home-390-dark.png" "http://localhost:3000/"
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-dark-mode --user-data-dir=$profile --window-size=1440,1400 --screenshot="$out\projects-1440-dark.png" "http://localhost:3000/projects"
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-dark-mode --user-data-dir=$profile --window-size=360,1800 --screenshot="$out\projects-360-dark.png" "http://localhost:3000/projects"
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-dark-mode --user-data-dir=$profile --window-size=1440,1400 --screenshot="$out\contact-1440-dark.png" "http://localhost:3000/contact"
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-dark-mode --user-data-dir=$profile --window-size=1440,1400 --screenshot="$out\case-1440-dark.png" "http://localhost:3000/projects/digital-poonam-web-platform"
& $chrome --headless=new --disable-gpu --hide-scrollbars --force-dark-mode --user-data-dir=$profile --window-size=1440,1400 --screenshot="$out\admin-dark.png" "http://localhost:3000/admin/login"
```

Read each PNG. Light check: paper background, ink type, one accent use per view, real screenshots (Digital Poonam and AI Bizz Pro are different), no gradient/glow/glass, no card shadows, alignment to the container. Dark check: warm charcoal background (not pure black), frost type, the same layout and spacing, hairlines still visible, screenshots still separated from the background, and the admin screenshot still cream/ink (the public theme must not leak into admin).

- [ ] **Step 4: Narrow-width overflow**

Capture at `360×1600` for `/`, `/projects` and `/contact`. Check for horizontal scrollbars or clipped text. Inspect long items: `Digital Poonam Web Platform`, `AI Bizz Pro Platform`, the email address and the tag lines.

- [ ] **Step 5: Reduced motion and keyboard**

In Chrome DevTools, emulate `prefers-reduced-motion: reduce` and reload `/`. Confirm all sections are visible immediately with no transform. Tab through: skip link → header → nav → theme toggle → project cards → footer. The theme toggle must show a visible focus ring and expose an action-based name. Open the mobile drawer at ≤1023px: focus enters, Tab cycles, Escape closes, focus returns to the trigger.

- [ ] **Step 6: Theme behaviour**

In DevTools → Rendering, emulate `prefers-color-scheme: dark` with no stored theme (clear site data first). Load `/`: the page must be dark. Click the toggle: it must switch to light with an action-based accessible name. Reload: light must persist. Toggle back to dark, then navigate to `/projects` and `/contact`: dark must persist across navigation. Clear site data, reload: the OS preference must win again.

Hard-reload `/` while dark and confirm there is no visible flash of the paper background before the dark theme applies. Confirm the toggle is 44×44 and does not shift the header at any breakpoint.

- [ ] **Step 7: Admin smoke test**

Open `/admin/login`, sign in with the `ADMIN_SECRET` value from `.env`, then confirm: project list loads; create/edit/delete/reorder works; image upload works; messages list and delete work; logout works. Confirm the page is legible with the legacy aliases (no unstyled text) and stays cream/ink even when the public site is dark.

- [ ] **Step 8: Contrast spot-check**

Re-run the Task 2 Step 6 command. Confirm all light and dark values still pass. Confirm accent is not used for small text anywhere: `Get-ChildItem app,components -Recurse -Include *.tsx | Select-String -Pattern "text-accent(?![-\w])"` should only show decorative arrows or large text; small text uses `text-accent-ink`.

- [ ] **Step 9: Stop the server and report**

Stop the background `npm start`. Report the captured paths, the build output, and any manual items left in `instructions.txt`. Do not commit build artifacts or screenshots.
