# INCONSA Studio (Sanity CMS)

The admin the client uses to edit all site content. Content types: **site settings**
(company info, contact, socials, CV/profile PDF), **projects** (in-progress / completed,
with image galleries), **clients**, **services**, standalone **gallery** images, and the
Phase 2 **leasing** types (machine categories + machines).

All text fields are localized (`{ es, en }`) with Spanish as the base language.

## One-time setup

Requires Node ≥ 22.13 (`nvm use` the version in the repo `.nvmrc`).

1. **Log in and create a project** (opens a browser):
   ```bash
   npx sanity login
   npx sanity init --env        # create a new project + write .env with the ids
   ```
   or create the project at https://www.sanity.io/manage and copy its id.

2. **Configure env** — copy `.env.example` to `.env` and fill in:
   ```
   SANITY_STUDIO_PROJECT_ID=<your project id>
   SANITY_STUDIO_DATASET=production
   ```

3. **Seed starter content** (site settings, services, projects migrated from the old
   site — no images):
   ```bash
   npx sanity exec scripts/seed.ts --with-user-token
   ```

## Everyday commands

```bash
npm run dev      # local Studio at http://localhost:3333
npm run deploy   # publish the Studio to https://<name>.sanity.studio (the client's admin URL)
```

## CORS / frontend access

Add the Nuxt app's origins so it can read content:
```bash
npx sanity cors add http://localhost:3000
npx sanity cors add https://<production-domain>
```
The frontend reads via the CDN using the same `projectId` / `dataset`.
