// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://roofpro.example.com',
  build: {
    // Emit bundled CSS as external /_astro/*.css files (do not inline).
    inlineStylesheets: 'never',
  },
  vite: {
    server: {
      // Allow any host (e.g. cloudflared *.trycloudflare.com tunnels).
      allowedHosts: true,
      host: true,
    },
  },
});
