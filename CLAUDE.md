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

- ✅ Phases 0–4 all merged to `master` (PR #1).
- ✅ Design v2 (professional polish pass) — on `feat/design-v2` (pushed): animation
  system v2, fixed dark header, cinematic heroes, diagonal cuts, marquees, richer cards,
  page transitions, favicon, and **placeholder photography seeded into Sanity**.
- ✅ Phase 5 SEO + deploy prep (code-side) — on `feat/seo-deploy` (stacked on design-v2):
  schema.org, dynamic sitemap, robots, 301s, ISR, OG, `DEPLOY.md` runbook.
- Sanity live + seeded (incl. 5 machine categories, 10 placeholder photos); all pages
  build (exit 0), render live data, and hydrate cleanly (0 console errors).

## SEO (Phase 5)

- **Structured data** (`app/composables/useSiteIdentity.ts`, called in `app.vue`):
  `GeneralContractor`/LocalBusiness/Organization from siteSettings (name, address,
  phone, email, socials, foundingDate). `defineBreadcrumb` on project + category detail.
  @nuxtjs/seo also emits WebSite/WebPage automatically.
- **Sitemap**: `server/api/__sitemap__/urls.ts` (defineSitemapEventHandler) returns
  project + machineCategory slugs with `_i18nTransform: true` → per-locale sitemaps with
  hreflang alternates. `/sitemap_index.xml` → `es-MX.xml` + `en-US.xml`.
- **Robots**: allow all, disallow `/api/`, references sitemap.
- **OG**: static `public/og-default.jpg` (1200×630) global default; project/category
  pages override with their cover image (Sanity CDN crop).
- **301 redirects** (nuxt.config `routeRules`) from the old site's URLs: `/acerca→
  /nosotros`, the two typo'd `/poltica-*` paths, `/mensaje-de-nuestro-fundador*`, and the
  4 old auto-generated `/proyectos/project-*` slugs → `/proyectos`. (radix3 route rules
  don't match partial-segment wildcards — old project slugs are listed explicitly.)
- **ISR**: `routeRules '/**': { isr: 600 }` (10-min revalidate); `/api/**` excluded.
- **Deploy**: see `DEPLOY.md` (Vercel root dir = `web/`, env vars, Sanity CORS, DNS,
  Studio deploy). Env template in `web/.env.example`.

## Data fetching (IMPORTANT)

Use **`useSanityData(key, query, params)`** (`app/composables/useSanityData.ts`), NOT
`@nuxtjs/sanity`'s `useSanityQuery`. The latter renders on the server but does **not**
put data in the Nuxt payload, so the client refetches and hydrates with `null` →
site-wide v-if/v-else **hydration mismatches** + extra Sanity calls. `useSanityData`
wraps `useSanity().fetch` in `useAsyncData` with an explicit key (payload-hydrated).
Detail pages must include the slug in the key (e.g. `project-${slug}`).

## Animations & UI (design v2)

- **Motion system** in `main.css`, all gated on `@media (scripting: enabled)` +
  `prefers-reduced-motion` (no hydration mismatch, crawlers see full content):
  `.rise` (entrance), `.reveal/-left/-right/-scale` (scroll reveals w/ blur),
  `.img-wipe` (panel wipe off images, `--wipe-color`), `.grow-line` (scaling rule),
  `.cut-b/.cut-t` (diagonal section edges), `.text-stroke` (outlined display type),
  `.bg-stripes` (hazard tape, `--stripe`), `.kenburns`, `.animate-marquee(-slow)`.
  `Reveal.vue` toggles `.in-view` via IntersectionObserver (`variant` prop).
- **Header**: fixed, transparent over heroes → solid on scroll (`useScrolled`),
  yellow underline nav, switches to steel/orange on `/arrendamiento*` routes.
- Cards: overlay titles on photos, ghost index numbers, corner accents/brackets,
  hover lifts/zooms. `ImageGallery.vue` = lightbox + hover captions. Page transitions
  via `app.pageTransition`. Favicon `web/public/favicon.svg`.
- **Placeholder photos** (Unsplash, free license) seeded into Sanity via
  `studio/scripts/seed-placeholders.ts` (idempotent; only fills empty fields) so the
  site looks finished — the client replaces them in the Studio. 10 assets named
  `ph-*.jpg`; projects have covers+galleries, categories have images, 8 standalone
  gallery docs (`galleryimg-ph-*`).

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
- 2026-07-14 — Design v2 polish pass (`feat/design-v2`): motion system v2 (directional
  blurred reveals, image wipes, diagonal cuts, outlined-text marquees, Ken Burns),
  fixed scroll-aware header (route-aware leasing accent), cinematic heroes, overlay
  project cards + ghost numbering, footer wordmark band, page transitions, favicon.
  Seeded 10 verified Unsplash placeholder photos into Sanity (projects/categories/
  gallery) + fix script for two mismapped photos. Verified: build green, 0 console
  errors, screenshots on all key pages.

## Branch/PR state

`master` = Phases 0–4 (PR #1 merged). `feat/design-v2` = design polish pass (pushed).
`feat/seo-deploy` (stacked on design-v2) = Phase 5 SEO + deploy prep. Merge order:
design-v2 → seo-deploy. The token can't open PRs — user opens them via compare links.

## Next steps

- Merge `feat/design-v2`, then `feat/seo-deploy`.
- Execute `DEPLOY.md`: Vercel deploy (root=`web/`) + env vars, Sanity CORS for the live
  domain, DNS cutover, Resend key, `sanity deploy` for the Studio, submit sitemap to GSC.
- Client (Studio): replace placeholder photos with real INCONSA photos; delete the
  `test-project` doc (it currently shows on the site + in the sitemap).

## Next steps

- Client (Studio): add project cover images, client logos, gallery photos, machine
  photos/specs, and the CV PDF — all appear automatically.
- Phase 5: SEO finalize (per-page schema.org, dynamic sitemap incl. slugs, 301s from old
  URLs), Vercel deploy + env, ISR + Sanity revalidate webhook, DNS cutover.
- Production: set NUXT_RESEND_API_KEY + verified sender for the contact form.
