# Deploy runbook — INCONSA

Everything code-side for going live is done (SEO structured data, dynamic sitemap,
robots, 301s from the old URLs, ISR caching, OG tags). The steps below are the ones
that need **your** accounts (Vercel, the domain registrar, Sanity, Resend).

The Nuxt app lives in **`web/`** (this is a monorepo — `studio/` is the CMS).

---

## 1. Deploy the website to Vercel

1. Go to https://vercel.com → **Add New… → Project** → import `Erzihark/inconsa`.
2. **Root Directory:** set to **`web`** (click *Edit* next to it). This is critical — the
   Nuxt app is not at the repo root.
3. **Framework preset:** Nuxt (auto-detected). Build command / output: leave default.
4. **Node.js version:** set to **22.x** (Settings → General → Node.js Version).
5. **Environment Variables** (Settings → Environment Variables) — add for **Production**
   *and* **Preview** (values from `web/.env.example`):
   | Name | Value |
   |------|-------|
   | `NUXT_PUBLIC_SITE_URL` | `https://www.inconsa.mx` |
   | `NUXT_PUBLIC_SANITY_PROJECT_ID` | `4sxos8s4` |
   | `NUXT_PUBLIC_SANITY_DATASET` | `production` |
   | `NUXT_CONTACT_TO_EMAIL` | `contacto@inconsa.mx` |
   | `NUXT_RESEND_API_KEY` | *(from step 4 below; optional to launch)* |
6. **Deploy.** You get a `*.vercel.app` preview URL. Verify it (see §6).

## 2. Allow the production domain in Sanity (CORS)

The browser refetches Sanity on client-side navigation, so the live origin must be
allow-listed. Initial page loads are server-rendered and never depend on this.

✅ **Both production hosts are already allow-listed** (added 2026-08-04, credentials
off). Current origins:

| Origin | Purpose |
|---|---|
| `http://localhost:3000` | `npm run dev` |
| `http://localhost:3333` | Sanity Studio |
| `https://www.inconsa.mx` | Production (canonical) |
| `https://inconsa.mx` | Apex, in case it ever serves directly instead of redirecting |

⚠️ **One still to add, after step 1: your `*.vercel.app` preview hostname.** It cannot
be added in advance because it does not exist until the first deploy. Without it a
preview renders correctly on first load (that page is server-rendered) and then fails
to fetch on the first internal link you click. That reads as a broken site but is only
the missing origin, so add it before you spend time debugging a preview:

```bash
npx sanity cors add https://<your-preview>.vercel.app --no-credentials
```

Run from `studio/`. Check the current list any time with `npx sanity cors list`, or
manage it at https://sanity.io/manage → project **inconsa** (`4sxos8s4`) → **API → CORS
origins**.

**Always leave "Allow credentials" unchecked.** The site only ever reads public
published content; enabling it would let that origin send tokens and cookies.

## 3. Point the domain at Vercel

1. Vercel → Project → **Settings → Domains** → add `www.inconsa.mx` **and** `inconsa.mx`
   (set the apex to redirect to `www`, or vice-versa — pick one canonical host; our
   `NUXT_PUBLIC_SITE_URL` uses `www`).
2. Vercel shows the DNS records to create. At your registrar / DNS host:
   - `www` → **CNAME** → `cname.vercel-dns.com`
   - apex `inconsa.mx` → **A** → `76.76.21.21` (or the ALIAS/ANAME Vercel shows)
3. Wait for propagation; Vercel provisions SSL automatically. Confirm both hosts serve
   HTTPS and the non-canonical one 301-redirects to the canonical one.

## 4. Contact form email (optional but recommended)

1. Create a Resend account (https://resend.com), verify a sending domain (e.g.
   `inconsa.mx`), create an API key.
2. Set `NUXT_RESEND_API_KEY` in Vercel and redeploy. Until then the form accepts
   submissions and logs them server-side (no email sent).

## 5. Deploy the Studio (client's editing URL)

```
cd studio && npx sanity deploy
```
Gives the client a hosted `*.sanity.studio` admin. (Local dev: `npm run dev` → :3333.)

## 6. Verify after going live

- `https://www.inconsa.mx/sitemap.xml` lists static pages **and** every project /
  category, in both ES and EN (hreflang alternates present).
- `https://www.inconsa.mx/robots.txt` allows crawling and points to the sitemap.
- View-source on `/` and a project page: one `application/ld+json` block with the
  `GeneralContractor` org, and `BreadcrumbList` on detail pages. Validate with Google's
  Rich Results Test.
- Old URLs 301 to new: `/acerca → /nosotros`, `/poltica-de-calidad →
  /politica-de-calidad`, `/proyectos/project-one-… → /proyectos`,
  `/mensaje-de-nuestro-fundador → /mensaje-del-fundador`.
- Lighthouse SEO ≥ 95; ES `/` and EN `/en` both render server-side.
- **Google Search Console:** add the property, submit `/sitemap.xml`.

## 7. Content freshness (ISR)

Pages are served via ISR and revalidate ~every 10 min (`routeRules` in
`nuxt.config.ts`), so CMS edits appear without a redeploy. To make edits appear
instantly you can later add a Sanity **webhook** hitting a Vercel on-demand
revalidation endpoint — not required for launch.
