import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// theme_color and background_color mirror --app-shell-background in
// src/index.css. This file cannot read CSS variables, so keep them in step
// by hand (index.html too).
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // A fixed port of our own. 5173 is shared with other local Vite apps, and
  // a service worker from one of them would keep serving its cached shell
  // on that origin. strictPort fails loudly instead of hopping ports.
  //
  // /api is passed through to the backend, so the app calls its own origin.
  // That is what makes it work from a phone over a forwarded port or tunnel:
  // only this port needs forwarding, with no CORS or http/https mismatch.
  server: {
    port: 5180,
    strictPort: true,
    proxy: { "/api": "http://localhost:5002" },
  },
  preview: {
    port: 4180,
    strictPort: true,
    proxy: { "/api": "http://localhost:5002" },
  },
  optimizeDeps: {
    // Only reached through `virtual:pwa-register`, which the dev dep scan
    // cannot follow. Found late, it forces a re-optimise and a full reload.
    include: ["workbox-window"],
  },
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      // "prompt": a new build waits until the user accepts UpdatePrompt, so
      // a checkout in progress is never reloaded out from under them.
      registerType: "prompt",
      // Registered by hand in src/lib/offline/swUpdate.ts.
      injectRegister: false,
      includeAssets: ["favicon.ico", "icon.svg", "apple-touch-icon-180x180.png"],
      manifest: {
        name: "Acocie Stores",
        short_name: "Acocie",
        description: "Shop from local vendors on Acocie Stores.",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "any",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Precache the app shell only. API responses are not cached here:
        // TanStack Query owns data, and anything per-user (cart, orders)
        // must never be served from a shared cache.
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            // Product photos: served from the cache once seen, so browsing
            // is instant and works offline. Cross-origin (S3, placeholders)
            // responses are opaque, hence status 0.
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 300, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
});
