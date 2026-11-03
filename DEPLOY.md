# Deploying RoofPro to Vercel (free) via GitHub

The **Astro site** (`Astro/`) is a static build — it deploys to Vercel's free
tier and works entirely from the bundled data in `Astro/src/data/*.json` (which
is generated from the CSVs). **You do not need to host Strapi** for the public
site to work.

> Strapi cannot run on Vercel (it needs a long-running server + database).
> Vercel only hosts the static front-end. To edit content, edit the CSVs (or run
> Strapi locally), rebuild, and push — Vercel auto-redeploys. See "Updating
> content" below.

---

## 1. Push the repo to GitHub

The project is already a git repository with an initial commit. Create an empty
repo on GitHub (no README/license), then:

```powershell
cd "Roofpro Astro Theme"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

(If you use SSH, use the `git@github.com:...` URL instead.)

## 2. Import the project into Vercel

1. Go to <https://vercel.com> → sign in with GitHub → **Add New… → Project**.
2. Select your repo.
3. **IMPORTANT — set the Root Directory to `Astro`** (click *Edit* next to Root
   Directory and choose the `Astro` folder). This is a monorepo, so Vercel must
   build the front-end folder, not the repo root.
4. Framework Preset: **Astro** (auto-detected). Leave the defaults:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Click **Deploy**.

That's it — Vercel builds and gives you a free URL like
`https://<project>.vercel.app`.

## 3. (Optional) Set the canonical site URL

For correct canonical/OG URLs and a sitemap, update `Astro/astro.config.mjs`
after you know your Vercel URL:

```js
site: 'https://<project>.vercel.app',
```

Commit and push — Vercel redeploys automatically.

## 4. (Optional) Custom domain

In Vercel → your project → **Settings → Domains**, add a domain you own, or use
the free `*.vercel.app` subdomain. Vercel provisions HTTPS automatically.

---

## Updating content later

The public site reads `Astro/src/data/*.json`, generated from the CSVs in `cms/`.

**To change Works/Services content or order:**

1. Edit `cms/Our Works.csv` (works) or `cms/services.csv` (services) — row order
   controls display order.
2. Regenerate the bundled data:
   ```powershell
   cd Astro
   node _gendata.mjs
   ```
3. Commit and push:
   ```powershell
   git add cms Astro/src/data
   git commit -m "Update CMS content"
   git push
   ```
   Vercel redeploys on push.

**Prefer editing in the Strapi admin?** Run Strapi locally
(`cd strapi && npm run develop`), edit content, then mirror it back to the CSVs
(or just keep the CSV as the source of truth). The important part is that
whatever the public build uses lives in `Astro/src/data/*.json`, which is
committed to the repo.

---

## Notes

- `.env` files (including `strapi/.env` secrets) are gitignored and are **not**
  pushed — Vercel doesn't need them for the static build.
- `node_modules`, `dist`, `.astro`, and `strapi/.tmp` are gitignored; Vercel
  installs and builds fresh.
- Node 22.12+ is required (declared in `Astro/package.json` engines); Vercel
  uses a compatible Node 22 by default.
