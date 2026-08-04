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

## Contact pre-fill (context-aware)

CTAs link to `/contacto?topic=…&subject=…` via **`useContactLink()`** (e.g.
`contactLink('machine', loc(machine.name))`). The contact page resolves it with
**`useContactPrefill()`** and drops a ready-written message into the textarea. Topics:
`machine|machineCategory|leasing|project|projects|service|services|gallery|clients|about|
general`; a topic that needs a name but has none degrades (machine→leasing, project→
projects). Context-less links (header nav) fall back to inferring the topic from the
previous route (`history.state.back`, locale prefix stripped). Copy lives in i18n under
`contact.prefill.*` + `contact.prefillNote`.
Resolution runs **client-side in `onMounted`** so the ISR-cached HTML never contains a
pre-filled message (and no hydration mismatch). The hint under the textarea disappears
once the visitor edits the draft. The context also rides along to
`server/api/contact.post.ts`, which puts the subject in the email subject line.
`/contacto` keeps a clean canonical URL despite the query params.

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
- 2026-08-04 — Localized Sanity Studio's admin UI to Spanish (`feat/studio-spanish-locale`):
  added `@sanity/locale-es-es` plugin (`esESLocale()` in `sanity.config.ts`) and translated
  all schema `title`/`description` strings + `structure.ts` menu labels to Spanish (field
  *names* and select-list `value`s left unchanged — only human-facing labels). Sanity's
  hosted login screen (Google/GitHub/E-mail picker) stays in English — it's served outside
  the Studio bundle and isn't affected by this plugin. `tsc --noEmit` and `sanity build`
  both clean.
- 2026-07-14 — Design v2 polish pass (`feat/design-v2`): motion system v2 (directional
  blurred reveals, image wipes, diagonal cuts, outlined-text marquees, Ken Burns),
  fixed scroll-aware header (route-aware leasing accent), cinematic heroes, overlay
  project cards + ghost numbering, footer wordmark band, page transitions, favicon.
  Seeded 10 verified Unsplash placeholder photos into Sanity (projects/categories/
  gallery) + fix script for two mismapped photos. Verified: build green, 0 console
  errors, screenshots on all key pages.
- 2026-08-03 — Installed taste-skill and ran it as a design audit pass
  (`feat/taste-pass`, pushed). Stripped AI tells (scroll cue, index numerals on
  images, second marquee, eyebrow inflation, all em-dashes), rebuilt the home
  services row as an asymmetric bento, fixed empty grid cells on home + leasing,
  capped the services-page zigzag, tightened Bebas display tracking, and added a
  skip link, a branded 404, form `aria-live`, and Phosphor social marks. Build
  green, 0 console errors, screenshots on all key pages.
- 2026-08-04 — Context-aware contact pre-fill (see section above): `useContactLink` /
  `useContactPrefill`, wired into every "Solicitar cotización" CTA (machine, category,
  leasing, project, services, home) + history fallback for the header nav. Verified in
  ES/EN with Playwright: build green, correct drafts, no hydration warnings.
- 2026-08-04 — Performance pass (`perf/audit`). Lighthouse (mobile, simulated
  throttling) over all 26 routes, before → after: perf **68 → 90**, FCP
  **4.60s → 2.46s**, LCP **5.51s → 2.85s**, page weight **869 KB → 377 KB**.
  See "Performance" below. a11y/best-practices/SEO unchanged; 0 console errors.

## Performance

Measured with Lighthouse against `node .output/server/index.mjs` (mobile preset,
`throttlingMethod: 'simulate'`), every ES + EN route. What moved the numbers:

1. **`useSanityData` / `useSanityImage` no longer call `useSanity()`.** That
   composable statically imports `@sanity/core-loader` (visual editing), pulling
   `@sanity/client` + xstate + rxjs + comlink + an EventSource polyfill into the
   browser — ~240 kB of code the site never runs, since visual editing is off.
   They now hit Sanity's GROQ HTTP endpoint with `$fetch` (same endpoint the SDK
   calls) and read project/dataset from `useSanityConfig()`. Entry chunk
   **445 kB → 305 kB**; the Sanity SDK is now a lazy chunk nothing loads.
   ⚠️ If visual editing or `SanityImage` is ever enabled, revisit this.
2. **`nitro.compressPublicAssets`** (gzip + brotli). Assets were served
   uncompressed — Lighthouse flagged 426 KiB. Entry chunk is now 100 kB brotli.
   Vercel compresses at the edge anyway, but this fixes any other host.
3. **`preconnect` to `cdn.sanity.io`** in `app.head` — every page loads images
   from it; saves the DNS/TCP/TLS round trips before the LCP image.
4. **`fetchpriority="high"`** on the four hero images (`AppImage` gained the
   prop; set on HomeHero + the leasing/leasing-category/project heroes).
5. **Dropped font weight 500** from Roboto and Montserrat — no `font-medium`
   utility exists anywhere, and each weight is another set of woff2 subsets.
6. **`will-change: auto` on `.in-view`** so revealed elements release their
   compositor layers instead of holding them for the whole session.

Known, not fixed: **Sanity CORS does not include `https://www.inconsa.mx`** (only
`localhost:3000`). Initial page loads are unaffected (SSR), but client-side
navigation to a page that fetches will fail in production. Pre-existing —
`DEPLOY.md` lists it. Add the origin in Sanity → API → CORS origins.

TBT is noisy under simulated throttling (76–282 ms across identical runs of the
same route); FCP/LCP are stable to ±30 ms. Judge changes on FCP/LCP, not TBT.

## Design skills (taste-skill)

Installed from github.com/Leonxlnx/taste-skill via `npx skills add` → 13 skills in
`.agents/skills/` (symlinked into `.claude/skills/`). Payload is **gitignored**;
`skills-lock.json` is committed so the install is reproducible. The two that apply
here: **`design-taste-frontend`** (v2, the main anti-slop rulebook: dials, AI-tell bans,
pre-flight checklist) and **`redesign-existing-projects`** (audit-first upgrade of an
existing codebase). Re-run the install command to update.

Design read for this repo: *redesign - preserve*, dials `VARIANCE 7 / MOTION 7 /
DENSITY 4`. Brand tokens, IA, slugs and copy voice are fixed inputs (skill §11.C/11.F).
**Standing constraints from the pre-flight check** — keep these true in new work:
zero em-dashes in user-visible strings; max 1 eyebrow per 3 sections per page; max 1
marquee per page; no enumerating numerals overlaid on images; no scroll cues; grids
must have no empty trailing cell; max 2 consecutive image+text zigzag rows.

⚠️ Don't put `|` inside a page title string — `nuxt-seo-utils` treats it as the title
separator and truncates everything after it. Use a comma; the ` | Grupo INCONSA` suffix
comes from `titleTemplate` in `app.vue`.

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
