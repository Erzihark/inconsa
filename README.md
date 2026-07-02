# INCONSA

Redesign of [inconsa.mx](https://www.inconsa.mx/) — a Cancún-based construction company —
into a self-editable, bilingual (ES/EN), SEO-focused website.

## Monorepo layout

| Path      | What it is                                                        |
| --------- | ----------------------------------------------------------------- |
| `web/`    | Nuxt 4 front-end (SSR, i18n, Tailwind v4). Public site.           |
| `studio/` | Sanity Studio — the CMS the client uses to edit all content.      |

## Content model

The client edits everything in **Sanity Studio** (drag-and-drop image uploads, no code):

- **Projects** — in-progress / completed, description + image gallery (the priority feature)
- **Services**, **Clients**, standalone **Gallery** images
- **Site settings** — company info, contact, socials, downloadable CV/company profile (PDF)
- **Machinery leasing** (Phase 2) — categories + machines with hourly / per-project rental

## Getting started

```bash
# Front-end
cd web && npm install && npm run dev

# CMS
cd studio && npm install && npm run dev
```

The Nuxt app reads content from Sanity via `@nuxtjs/sanity`. Configure the Sanity project
id / dataset through environment variables (see `web/.env.example`).

## Workflow

Every change ships on a feature branch → push → pull request → merge. No direct commits to
`main`.
