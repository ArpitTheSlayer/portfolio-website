# Portfolio Redesign — "Signal"

**Date:** 2026-11-05
**Status:** Awaiting approval
**Direction chosen:** 01 — Signal (from `design/portfolio-redesign-directions.figcraft`)

## Intent

The current site is a practice build. It works, but it reads as an AI-generated portfolio: three competing brand colours, gradient headings, glow blobs, glass cards and eleven identical skill tiles. It asks a visitor to admire the effects before it tells them who Arpit is and what he has shipped.

This redesign turns the public site into a hiring argument. The primary reader is a hiring manager or recruiter screening for a frontend role, usually in under a minute, often on the first page. They should get four things immediately: who this is, what he does, proof that he has shipped real work, and how to reach him. The design should be distinctive enough to be remembered, but every visual decision must make the evidence easier to read, not harder.

## Goals

- Within the first viewport: name, role, location, availability, the strongest proof, and one clear action.
- Within one scroll: three real projects with screenshots, stack and links.
- Contact and CV reachable in at most two clicks from any page.
- A coherent visual identity that does not depend on gradient text or decorative effects to feel designed.
- Honest, specific content only. No invented metrics, years, clients or outcomes.
- Accessible, fast and legible at every breakpoint.

## Non-goals

- No new backend features, API endpoints, database models or admin flows.
- No CMS/schema changes; the existing `Project` / `Message` / `Media` models and admin panel stay as they are.
- No blog, testimonials, client logos, pricing or services pages.
- No full redesign of the admin dashboard. It keeps its current layout and behaviour; it may inherit updated shared colours and button styling.
- No new photography or generated imagery. Use the existing portrait, the existing project screenshots, and the freshly captured live-site screenshots for Digital Poonam and AI Bizz Pro (`public/images/project-images/digital-poonam.png` and `aibizzpro.png`, both 1600×800).
- No dark mode in this release (decision explained below).

## Anti-goals

A redesign that fails even if it looks good:

- Gradient-clipped headlines, glow blobs, glassmorphism, floating badges or a rainbow of accent colours.
- Entrance animations that delay reading, long stagger chains, or motion required to understand content.
- Skill grids that repeat the same card shape eleven times with proficiency pills.
- Decorative "years of experience" or project counts that the data does not support.
- A hero that hides the work below three screens of self-description.
- A design that collapses into tiny centred text on mobile.

## Constraints

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4.
- Keep the existing MongoDB data layer, API routes, auth, upload handling and admin panel working.
- Keep `defaultProjects` as the fallback so pages render without a database.
- Preserve all real personal data: name, role, location, availability, email, phone, socials, experience, achievements, education, project names, descriptions, links and screenshots. Wording can be tightened; facts cannot change.
- Keep `public/Resume.pdf` as the CV target.
- The site must pass `npm run lint` and `npm run build`.
- Target WCAG 2.2 AA.
- Public pages must remain usable with JavaScript disabled for reading (content is server-rendered); the form and mobile menu may require JavaScript.

## Approaches considered

### 01 — Signal (chosen)

Warm paper, near-black type, one vermilion accent. Large left-aligned statement, portrait, and three real project thumbnails in the first viewport. Mono labels give a technical edge without turning the page into a terminal. Sharp corners, hairline rules, no shadows.

**Why it wins:** it balances a memorable identity with hiring-manager scanning. Role, proof, work and contact are all above or just below the fold. It extends cleanly to the projects index and case studies.

**Trade-off:** the large type consumes space, so copy must be short and edited hard.

### 02 — Ledger (rejected)

White, cobalt, monospaced labels, a stats band and a project index table. The most scannable and the most obviously "serious engineer" of the three.

**Why it lost:** it reads like a CV/dossier and leaves little personality. It would also tempt invented metrics to fill the table.

### 03 — Atelier (rejected)

Cream and terracotta, Playfair Display headline, italic emphasis, asymmetric portrait. The most crafted and memorable.

**Why it lost:** the serif and warmth read more designer than frontend engineer, and scanning is slower. The hiring manager is the primary reader, not a design client.

## The design

### Art direction

An editorial technical portfolio: warm off-white paper, ink-black type, one vermilion accent, generous whitespace, a strict grid and a single photographic portrait. Emphasis comes from scale, position and rules — not from colour effects. Project screenshots provide the colour.

Key rules:

- The page background is paper. There are no full-width dark bands, gradients or blurred surfaces.
- Cards are flat: image, hairline rule, text. No glass, no shadow, no rounded pills.
- Accent is used for at most one thing per view: a label, an arrow, a hover underline, one word.
- Mono type is reserved for labels, metadata and numbers.
- Every section starts with a hairline rule and an optional mono label.
- Corners are 0–2px. If a radius is not needed, use 0.

### Design tokens

```css
/* Colour */
--paper: #f3efe6;
--paper-raised: #ebe4d7;
--paper-deep: #e2d9ca;
--ink: #1b1815;
--ink-soft: #4c463f;
--muted: #6b6259;        /* 5.2:1 on paper */
--line: #d8d0c3;
--line-strong: #b9ae9d;
--accent: #c2401b;       /* decorative / large text */
--accent-ink: #b23a16;   /* small text on paper, 5.21:1 */
--ok: #226b3b;           /* availability, 5.66:1 */
```

No other hues. No opacity-based text colours for body copy; use the solid tokens above.

```css
/* Shape and elevation */
--radius-xs: 0px;
--radius-sm: 2px;
--border: 1px;
--shadow: none;

/* Spacing (4px base) */
--space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
--space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
--space-9: 96px; --space-10: 128px;

/* Layout */
--container: 1312px;
--gutter-desktop: 64px;
--gutter-tablet: 40px;
--gutter-mobile: 24px;
--header-height: 72px;
```

### Typography

Production fonts: **Inter** for all UI and body text, **Geist Mono** for labels and metadata. Both are loaded with `next/font` (Geist Mono is already configured). The FigCraft mockups use Cascadia Code as a stand-in for Geist Mono.

| Role | Size / line-height | Weight | Tracking | Notes |
|---|---|---|---|---|
| Display (hero) | 76 / 78 px | 600 | −0.035em | 56/58 at ≤1024, 42/44 at ≤640 |
| Page title | 56 / 60 px | 600 | −0.03em | Projects and contact pages |
| Section title | 40 / 44 px | 600 | −0.02em | |
| Card title | 18 / 24 px | 600 | −0.01em | |
| Body large | 16.5 / 27 px | 400 | 0 | Hero intro |
| Body | 16 / 26 px | 400 | 0 | |
| Small | 14 / 22 px | 400 | 0 | |
| Nav | 13 / 20 px | 400 | 0.01em | |
| Button | 13 / 18 px | 600 | 0.01em | |
| Mono label | 9.5 / 14 px | 400 | 0.16em | Uppercase |
| Mono meta | 10 / 15 px | 400 | 0.08em | Uppercase |

Limits: hero headline ≤ 3 lines at desktop and ≤ 4 at mobile. Intro paragraph ≤ 3 lines at desktop. Section intros ≤ 2 lines.

### Layout and page structure

#### Header

- Height 72px, sticky at the top, paper background at 96% opacity with a hairline bottom border. No blur.
- Left: wordmark "Arpit Pandey" (15px semibold) over "Frontend Developer" (9px mono, muted).
- Centre: Work / About / Experience / Contact.
- Right: availability dot + "Available for work" (hidden below 1200), CV button (black, 40px tall).
- Below 1024: availability and CV move into the drawer; the header shows wordmark + menu button only.
- Active section uses a 1px accent underline, not a pill.

#### Home page

1. **Hero** — 12-column grid, 7/5 split, 64px top padding.
   - Left: mono eyebrow "PORTFOLIO — 2026 / RAIPUR, IN"; three-line display headline; intro paragraph (max 610px); primary black button "View selected work" and outlined "Download CV"; credentials line "MCA 9.34 CGPA · BCA 9.00 CGPA · 6+ PROJECTS SHIPPED".
   - Right: portrait, 396×440 desktop, 4:5 crop, clipped square frame; mono caption; "Currently" block with role, company, dates and location.
   - Hero content is real and editable in one data object at the top of the page file.

2. **Selected work** — mono label "Selected work", count "03 / 08" derived from the project data (never hardcoded), three cards in a row (416px wide, 112px image, 2.05:1 crop).
   - Each card: real screenshot, project name, stack line, accent arrow.
   - Featured set: Digital Poonam, AI Bizz Pro, Tomato (the first three by `order`), with an "All projects" text link. Both commercial projects now use real live-site captures, not the shared placeholder.
   - Entire card is one link; hover moves the arrow 3px and underlines the title.

3. **Experience** — rule + mono label. One role: Frontend Developer, Digital Poonam, May 2026 — Present, Raipur. The five existing achievements are listed with a thin accent left rule, not checkmarks in cards. The key technologies appear as a mono line.

4. **Toolkit** — replaces the eleven skill cards. Four rows, label left and items right:
   - Frontend: HTML5, CSS3, JavaScript, React.js, Next.js, Tailwind CSS
   - Backend: Node.js, Express.js, MySQL, MongoDB
   - Design: Figma
   - Practice: AI-augmented workflows, REST APIs, responsive systems
   - Proficiency is shown as a small word after the name where it adds information (Advanced / Proficient / Intermediate), not as a coloured pill.

5. **Education** — three editorial rows: degree, institution, location, dates, score. MCA first. Score in accent mono. No cards.

6. **About** — two short columns: "The journey" and "How I work". Trim the existing copy to roughly 70–90 words each. Include MCA 9.34 and BCA 9.00 inline, not as badges.

7. **Contact CTA** — rule, large email link (`arpitpandey.2001@gmail.com`), phone, location, availability, socials. This replaces a separate "hire me" card.

8. **Footer** — nav, email, socials, copyright, CV link. No logo tile.

#### Projects index (`/projects`)

- Page header: mono label "Selected work", title "Work, shipped.", one-line intro, count.
- Two-column grid at ≥1024, one column below. Cards: 2.05:1 screenshot, index number, name, one-line description, tags as plain mono text separated by middots, live/repo links.
- No filter UI in this release; eight projects fit on one page.
- Projects keep their existing real data and API behavior.

#### Project case study (`/projects/[slug]`)

- Back link, mono tags, page title, description, live/repo links.
- Full-width cover image, then the markdown body rendered by `MarkdownViewer`, restyled for paper/ink.
- Gallery/carousel keeps existing functionality (images, videos, lightbox) but adopts square corners, hairline controls and the new tokens.
- Next/previous project links at the bottom.
- `notFound()` behavior unchanged.

#### Contact (`/contact`)

- Page header: mono label, title, one-line intro.
- 12-column split: form (7) and direct contact (5).
- Form: labelled fields, 1px borders, 2px radius, accent focus ring, inline success/error message. Submission behavior and API unchanged.
- Direct contact: email and phone with copy buttons, location, availability, socials.
- No decorative card backgrounds; the form sits in a hairline-bordered panel.

#### Admin

- No flow or layout redesign. Shared tokens and the updated `Button` may change its appearance slightly; that is acceptable. All CRUD, auth, upload and message behavior must remain identical.

### Components

Create or replace these public components:

- `Navbar` — sticky header, desktop nav, mobile drawer, active section, CV link.
- `Footer` — editorial footer.
- `Button` — variants: `primary` (black), `outline` (1px line), `text` (accent inline link with arrow). All 2px radius, 40–48px height.
- `SectionLabel` — mono uppercase label with optional count/right slot.
- `WorkCard` — screenshot + title + stack + arrow, used on home and projects index.
- `Proficiency` — optional inline small label, not a pill.
- `ContactForm` — extracted from the contact page, same API call and validation.
- `Reveal` — small client wrapper for section entrance, respecting `prefers-reduced-motion`.

Delete or stop using the old gradient/glow patterns. Old SVG and image assets may remain in the repo if unused by the new pages; remove imports, not necessarily files.

### Motion

- Hero: opacity 0→1 and translateY 12px→0, 360ms, ease-out. Portrait 480ms. No stagger over 90ms.
- Sections: a single 300ms fade/12px rise when 20% visible, once.
- Hover: title underline 120ms; arrow translateX 3px 160ms; image scale 1.015 over 500ms.
- No parallax, no looping animation, no glow pulsing.
- `prefers-reduced-motion: reduce` disables all transforms and reveals content immediately.

### Responsive behaviour

- ≥1280: container 1312, gutter 64, hero 7/5, work 3 columns.
- 1024–1279: gutter 48, hero 7/5, display 64, work 3 columns with smaller gaps.
- 768–1023: gutter 40, hero stacks (text then portrait at 60% width), nav collapses to drawer, work 2 columns, toolkit rows stack labels above items.
- ≤767: gutter 24, display 42, single column, work 1 column, portrait full width at 4:5, education rows stack, contact form above direct contact, footer stacks.
- Minimum supported width: 360px.
- Tap targets ≥44×44px.

### Accessibility

- Body text and small labels meet 4.5:1; large text meets 3:1. Tokens above are verified against `--paper`.
- Visible `:focus-visible` ring: 2px `--accent-ink` offset 3px.
- Skip link to `#main`.
- One `h1` per page; sections use `h2`/`h3` in order.
- Mobile drawer traps focus, closes on Escape and restores focus to the trigger.
- Form labels are real `<label for>` elements; errors use `aria-live="polite"`.
- Images have meaningful alt text; decorative images use `alt=""`.
- Availability is conveyed by text, not colour alone.
- Links are underlined on hover/focus and distinguishable by more than colour.

### Content rules

- Keep all factual data exactly as it is. Rewrite only connective/marketing copy.
- Do not claim years of experience, client counts, revenue, performance percentages or "production platforms" counts unless they exist in the data.
- "6+ projects shipped" is supported by the eight real projects listed.
- "AI-augmented" stays because it is already part of the real role description.
- Project descriptions, READMEs, tags, links and screenshots come from the existing data source.

### Technical approach

- Keep the App Router structure and all API/data code intact.
- Update `app/globals.css`: replace brand tokens with the new token set; remove gradient/glow utilities; set paper background and ink text; keep Tailwind v4 `@theme` usage.
- Update `app/layout.tsx`: Inter + Geist Mono via `next/font`, paper background, metadata (`Arpit Pandey — Frontend Developer`), Open Graph basics. Remove `ThemeProvider` and `next-themes` usage.
- Rewrite `app/page.tsx` as a server component. Extract only the mobile menu and reveal animations into small client components. Hero/credential/experience/education/toolkit data stays in a typed object at the top of the file (or a local `lib/profile.ts` if it improves clarity).
- Home project data: read the same project source as the rest of the site on the server, with `revalidate = 60` and the existing `defaultProjects` fallback when the database is unavailable. Admin edits and reorders appear on the home page within one minute without a redeploy. The projects index keeps its current client-side fetch so admin changes appear there immediately.
- Rewrite `components/Navbar.tsx`, `Footer.tsx`, `Button.tsx`; add `SectionLabel`, `WorkCard`, `ContactForm`, `Reveal` as needed.
- Restyle `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`, `app/contact/page.tsx`, `components/MediaCarousel.tsx`, `components/MarkdownViewer.tsx`.
- Update the `src` for Digital Poonam and AI Bizz Pro in `lib/defaultProjects.ts` to the new captures. If the live database already has these records, update their `src` through the admin panel (or a one-off update) so the database does not keep pointing at `dummy-landing-page.png`; the fallback must be correct either way.
- Keep `lib/defaultProjects.ts` in shape otherwise, along with `lib/mongodb.ts`, `lib/auth.ts`, `lib/slug.ts`, `models/*`, `app/api/*`, and admin pages functionally unchanged.
- Remove the theme toggle and `next-themes` dependency if nothing else uses it. Remove `Moon.svg` / `Sun.svg` imports.
- Use `next/image` for all raster images with correct `sizes`; portrait gets `priority`; project covers lazy-load.
- Metadata: per-page titles/descriptions; case study metadata already exists and stays.
- Do not add new runtime dependencies unless required (none are expected).

### Light-only decision

The current site ships a light/dark toggle. This redesign is a paper-and-ink system; a dark variant would double the surface area and invite exactly the kind of decorative inconsistency the redesign removes. The release is light-only and the toggle is removed. This is a reversible call: a dark mode can be added later as a separate, deliberate token set.

## Decisions left to the builder

- Exact spacing within the token scale, as long as the layout matches the mockup's rhythm.
- Final line-level copy, subject to the content rules.
- Mobile drawer transition details and focus-management implementation.
- Whether section reveals use `motion/react` or a small IntersectionObserver/CSS helper; either is acceptable if the motion spec is met.
- Precise hover treatment for project images, within the motion spec.
- Whether profile/experience/education data lives inline in `app/page.tsx` or in a typed `lib/profile.ts`.

## Verification

- `npm run lint` and `npm run build` pass.
- All public pages render with no database connection (fallback data).
- Visual check at 1440, 1280, 1024, 768, 390 and 360 widths.
- Keyboard pass: skip link, nav, drawer, project cards, form, copy buttons.
- Contrast spot-check for every text token on paper.
- Reduced-motion pass.
- Admin: login, project create/edit/delete/reorder, image upload, message list, delete, logout all still work.
- No console errors; images have dimensions and alt text; no layout shift from the hero portrait.
- The two new captures render on the home cards, the projects index and both case studies, and the old `dummy-landing-page.png` is no longer used for Digital Poonam or AI Bizz Pro.
