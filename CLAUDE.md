# CLAUDE.md — INCONSA project working notes

Living context for AI agents working on this repo. **Update the "Progress log" and
"Current status" whenever you make meaningful progress.** Keep it scannable.

## What this is

Redesign of [inconsa.mx](https://www.inconsa.mx/) — Grupo INCONSA, a Cancún construction
company (est. 2006) — into a bilingual (ES/EN), SEO-focused, **self-editable** website.
The client edits all content in **Sanity Studio** (no code); the public site is **Nuxt 4**.

Top priority: a client-editable **project showcase** (in-progress vs completed, with image
galleries). Also: downloadable CV/company-profile PDF, and a **Phase 2** machinery-leasing
section with its own distinct visual design. SEO is first-class.

## Stack

- **web/** — Nuxt 4 (Vue 3 + TS), SSR. Tailwind v4 (CSS-first `@theme`, via
  `@tailwindcss/vite`). `@nuxtjs/i18n` (ES default, EN under `/en`), `@nuxtjs/sanity`,
  `@nuxt/fonts` (self-hosted Bebas Neue / Roboto / Montserrat), `@nuxtjs/seo`.
  `@vueuse/motion` for animations.
- **studio/** — Sanity Studio (CMS). React 19 + styled-components 6.
- **Hosting:** Vercel (planned). Content served from Sanity CDN.

## Repo layout

```
web/     Nuxt app        (app/: pages, components, layouts, composables, utils, assets, types; i18n/locales)
studio/  Sanity Studio   (schemaTypes/{objects,documents}, structure.ts, scripts/seed.ts)
```

## Environment — IMPORTANT

- **Node:** global `node` is 20.18 (too old for Nuxt 4). Use **22.13.0** installed at
  `C:\nvm\v22.13.0`. In the non-interactive Bash tool: `export PATH="/c/nvm/v22.13.0:$PATH"`
  before node/npm. `nvm use` needs an admin shell. Pinned in `.nvmrc` + web `engines`.
- **Commands:** `cd web && npm run dev|build|preview`; `cd studio && npm run dev|deploy`.

## Sanity

- **projectId:** `4sxos8s4`, dataset `production` (public read). Studio: http://localhost:3333.
- Web reads it via `web/.env` → `NUXT_PUBLIC_SANITY_PROJECT_ID` (gitignored).
- **Seed:** `cd studio && npx sanity exec scripts/seed.ts --with-user-token` (idempotent).
  Seeds site settings + 4 services + 4 projects (text only; images added in Studio).
- **⚠️ Gotcha:** never use document `_id`s containing a dot (e.g. `project.foo`) — Sanity
  treats the pre-dot segment as a content-version/release namespace, making the doc
  invisible to public/anonymous reads. Use hyphens (`project-foo`).

## Content model (Sanity schemas)

`siteSettings` (singleton: company info, contact, socials, CV `localeFile`), `project`
(status in-progress/completed, cover + gallery, localized), `client`, `service` (4 groups),
`galleryImage`, and leasing: `machineCategory`, `machine`. Localized fields use
`localeString/Text/Block/File` ({es,en}, es required). GROQ queries: `web/app/utils/queries.ts`.

## Design system (construction theme — client-approved)

- Colors (Tailwind `@theme` in `web/app/assets/css/main.css`): `background #F5F5F5`,
  `ink #020C34` (navy), `accent #FED53F` (yellow), `danger #DB2525` (red), `surface #fff`.
- Fonts: `font-display` Bebas Neue (headings), `font-subtitle` Roboto, `font-body` Montserrat.
- Leasing theme is intentionally different (Phase 4) — darker/industrial, TBD.
- Aim: professional, bold, animated (scroll reveals, hover states), great UX, accessible.

## Git workflow (required)

Feature branch → push → **PR** → merge. Never commit straight to `master`. Default branch is
`master`; remote `origin` = github.com/Erzihark/inconsa.

## Current status

- ✅ Phase 0 scaffold, ✅ Phase 1 Sanity backend, ✅ Phase 2 Nuxt core — on `master`.
- ✅ Phase 3 construction showcase — on `feat/construction-site` (pushed).
- ✅ Phase 4 leasing (dark/industrial, distinct design) — on `feat/leasing` (stacked on
  construction-site). Also carries a cross-cutting hydration fix (see Data fetching).
- Sanity live + seeded (incl. 5 machine categories); all pages build (exit 0), render
  live data, and hydrate cleanly (0 console errors).

## Data fetching (IMPORTANT)

Use **`useSanityData(key, query, params)`** (`app/composables/useSanityData.ts`), NOT
`@nuxtjs/sanity`'s `useSanityQuery`. The latter renders on the server but does **not**
put data in the Nuxt payload, so the client refetches and hydrates with `null` →
site-wide v-if/v-else **hydration mismatches** + extra Sanity calls. `useSanityData`
wraps `useSanity().fetch` in `useAsyncData` with an explicit key (payload-hydrated).
Detail pages must include the slug in the key (e.g. `project-${slug}`).

## Animations & UI

- `@vueuse/motion` (`v-motion`) for scroll reveals + enter animations. Helpers:
  `Reveal.vue` (fade-up, `visible-once`), `SectionHeading.vue`, `PageHeader.vue` (navy
  blueprint band), `HomeHero.vue`, `StatCounter.vue` (count-up on view), marquee CSS.
- Cards: hover lift + image zoom + yellow corner accents. `ImageGallery.vue` = lightbox.
- Empty states are styled (navy placeholder with wordmark) so the site looks intentional
  before the client uploads images.
- ⚠️ Known minor: a benign Vue hydration-mismatch warning in console (from the motion
  directives applying initial styles). SSR HTML is complete/correct; no user/SEO impact.
  Revisit by moving reveals to a CSS + IntersectionObserver approach if desired.

## Phase 3 pages (all built)

home `/`, `/proyectos` (+ status filter), `/proyectos/[slug]`, `/servicios`, `/clientes`,
`/galeria`, `/contacto` (form → `server/api/contact.post.ts`, Resend when key set),
`/nosotros`, `/mensaje-del-fundador`, `/politica-de-calidad`, `/politica-de-privacidad`.
CV download wired in header/footer from `siteSettings.cv`.

## Progress log

- 2026-07-07 — Phases 0–2 built and verified (SSR ES `/` + EN `/en`, hreflang, lean
  build). Node 22.13 toolchain fix. Sanity schemas + seed authored.
- 2026-07-08 — Sanity live (`4sxos8s4`) + seeded; fixed dotted-id public-read issue.
  Built full Phase 3 (13 pages + animated components). Contact API + CV download.
- 2026-07-08 (cont.) — Replaced @vueuse/motion with CSS+IO reveals (no hydration
  mismatch). Built Phase 4 leasing (dark/orange, distinct) + seeded 5 categories.
  Diagnosed & fixed the payload-hydration bug (useSanityData). Console clean everywhere.

## Branch/PR state

`master` = Phases 0–2. `feat/construction-site` (pushed) = Phase 3 + reveal refactor.
`feat/leasing` (stacked on it) = Phase 4 + the payload-hydration fix. The token can't
open PRs — user opens them via compare links. Simplest: merge `feat/construction-site`
first, then `feat/leasing` (which contains everything incl. the hydration fix).

## Next steps

- Client (Studio): add project cover images, client logos, gallery photos, machine
  photos/specs, and the CV PDF — all appear automatically.
- Phase 5: SEO finalize (per-page schema.org, dynamic sitemap incl. slugs, 301s from old
  URLs), Vercel deploy + env, ISR + Sanity revalidate webhook, DNS cutover.
- Production: set NUXT_RESEND_API_KEY + verified sender for the contact form.
