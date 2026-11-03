# RoofPro — Astro Roofing & Construction Theme

RoofPro is a modern, fully responsive **Astro** theme for roofing, construction,
and home-service businesses. It ships a marketing site (home, about, services,
contact) plus dynamic **Services** and **Works** collections with `[slug]`
detail pages — and it works out of the box with bundled sample content, **no
backend required**.

## ✨ Features

- ⚡ **Astro 7** static site — fast, zero-JS-by-default output
- 📱 Fully responsive, accessible pages
- 🧩 Reusable components: `Layout`, `Header`, `Footer`, `WorkCard`, `ServiceCards`
- 🗂️ **Dynamic content** for Services & Works with `[slug]` detail pages
- 📝 **Standalone** by default (bundled JSON), or plug in the optional Strapi CMS
- 🎬 Smooth interactions — nav, sliders, scroll animations
- 🔍 SEO-friendly: per-page titles, Open Graph & Twitter meta, favicons
- 🖼️ Self-hosted images & fonts

## 🚀 Getting started

Requires **Node 22.12+**.

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # -> ./dist
npm run preview
```

The site renders the bundled sample Services & Works with no extra setup.

## 📁 Structure

```
public/
  css/               # stylesheets (the design)
  js/site.js         # interactions runtime (nav, sliders, scroll animations)
  images/  fonts/    # self-hosted assets
src/
  components/        # Header, Footer, WorkCard, ServiceCards
  data/              # bundled Services & Works JSON (content source)
  layouts/Layout.astro
  lib/strapi.js      # content loader (bundled JSON, or live Strapi if set)
  pages/             # routes
  styles/            # global.css
_gendata.mjs         # regenerates src/data/*.json from ../cms/*.csv
```

### Routes

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About |
| `/services` | Services listing |
| `/services/[slug]` | Service detail |
| `/our-work` | Works listing |
| `/our-works/[slug]` | Project detail |
| `/contact` | Contact |
| `/404` | Not found |

## 📝 Content

Content comes from `src/data/services.json` and `works.json`, generated from
`../cms/services.csv` and `../cms/Our Works.csv`. Edit the CSVs (row order =
display order), then run `node _gendata.mjs` to regenerate the JSON.

## 🗄️ Optional: Strapi CMS

The theme reads `src/data/*.json` by default, so no backend is required. To
manage Services & Works from an admin UI, run the included [Strapi](https://strapi.io)
backend (see `../strapi`) and create a `.env` file (see `.env.example`):

```
STRAPI_URL=http://localhost:1337
```

The loader (`src/lib/strapi.js`) reads the `service` and `work` collection types
via the public REST API. Live CMS data is used when reachable; otherwise the
theme falls back to the bundled JSON.

## 🎨 Customization

- **Design** — `public/css/`.
- **Branding** — `src/components/Header.astro` / `Footer.astro`; replace the
  logo in `public/images/`.
- **Content** — the CSVs in `../cms/`, or the Strapi admin.
- **Interactions** — `public/js/site.js`.

## 📄 License

MIT — see `LICENSE`. Design & build by [Ink Studio](https://www.inks.studio/).
