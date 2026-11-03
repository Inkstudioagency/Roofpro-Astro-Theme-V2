# RoofPro — Astro Roofing & Construction Theme

RoofPro is a modern, fully responsive **Astro** theme for roofing, construction,
and home-service businesses. It ships a complete marketing site plus dynamic
**Services** and **Works** (portfolio) collections with detail pages, and works
out of the box with bundled sample content — **no backend required**. An
optional **Strapi** CMS is included if you want an admin UI for editing content.

## ✨ Features

- ⚡ **Astro 7** — fast static output, zero JS by default
- 📱 Fully responsive pages: Home, About, Services, Our Work, Contact, 404
- 🗂️ Dynamic **Services** and **Works** collections with `[slug]` detail pages
- 📝 **Standalone by default** — content comes from bundled JSON (generated from
  simple CSV files); optional **Strapi v5** CMS for a full editing UI
- 🎬 Smooth interactions — nav, sliders, and scroll animations
- 🔍 SEO-ready — per-page titles, Open Graph & Twitter meta, favicons
- 🖼️ Self-hosted images and fonts
- 📄 **MIT licensed**

## 📁 Project structure

| Folder    | What it is                                              |
|-----------|---------------------------------------------------------|
| `Astro/`  | The theme — the site you build and deploy               |
| `cms/`    | Source `services.csv` / `Our Works.csv` for the content |
| `strapi/` | Optional **Strapi v5** CMS (Service + Work collections) |

## 🚀 Quick start

Requires **Node 22.12+**.

```sh
cd Astro
npm install
npm run dev        # http://localhost:4321
```

Build the static site:

```sh
npm run build      # outputs Astro/dist
npm run preview    # preview the production build
```

That's it — the site renders the bundled sample Services & Works with no extra
setup.

## 📝 Editing content

The site reads `Astro/src/data/services.json` and `works.json`, which are
generated from the CSV files in `cms/`. To change content (or reorder items):

1. Edit `cms/services.csv` or `cms/Our Works.csv`
   (**row order = display order** on the site).
2. Regenerate the bundled data:
   ```sh
   cd Astro
   node _gendata.mjs
   ```
3. Rebuild (`npm run build`) or let the dev server reload.

Each row becomes one Service / Work, with its own detail page at
`/services/<slug>` or `/our-works/<slug>`.

## 🗄️ Optional: Strapi CMS

Prefer editing in an admin UI instead of CSV? Run the included Strapi backend:

```sh
# 1) CMS — http://localhost:1337  (admin at /admin)
cd strapi
npm install
npm run develop

# 2) Front-end — http://localhost:4321
cd ../Astro
npm run dev
```

On first boot Strapi imports the CSVs (Services + Works) and grants public read
access to `/api/services` and `/api/works`. Point the theme at it by creating
`Astro/.env`:

```
STRAPI_URL=http://localhost:1337
```

When `STRAPI_URL` is set and reachable, live CMS data is used; otherwise the
theme falls back to the bundled JSON — so the build never breaks if the CMS is
offline.

## 🚢 Deploying

The Astro site is static and deploys to any static host. A step-by-step guide
for **GitHub → Vercel** (free) is in [`DEPLOY.md`](DEPLOY.md).

## 🎨 Customization

- **Design / styles** — `Astro/public/css/` and `Astro/src/styles`.
- **Navigation & branding** — `Astro/src/components/Header.astro` and
  `Footer.astro`; swap the logo in `Astro/public/images/`.
- **Pages** — add routes under `Astro/src/pages/`.
- **Interactions** — `Astro/public/js/site.js`.

## 📄 License

MIT — see [`Astro/LICENSE`](Astro/LICENSE). Design & build by
[Ink Studio](https://www.inks.studio/).
