# Acocie PWA

The buyer-facing Progressive Web App for Acocie Stores. Vendors use the
separate dashboard; both talk to `acocie-stores-ecommerce-api`.

React 19 · TypeScript · Vite · `vite-plugin-pwa` · Tailwind CSS 4 ·
React Router · TanStack Query · Zustand · Axios. Package manager is **pnpm**.

## Commands

| Command               | Does                                          |
| --------------------- | --------------------------------------------- |
| `pnpm dev`            | Dev server on `:5180` (service worker on too) |
| `pnpm build`          | Type-check, then production build             |
| `pnpm preview`        | Serve the production build                    |
| `pnpm lint`           | oxlint                                        |
| `pnpm format`         | Prettier                                      |
| `pnpm generate-icons` | Rebuild the PWA icons from `public/icon.svg`  |

Copy `.env.example` to `.env.local` and point `VITE_ACOCIE_API_URL` at the API.

## Structure

`src/` is organised by business domain, not by technical layer.

| Layer                          | Holds                                                                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                         | Composition only: providers, router, app layout, NavBar.                                                                                 |
| `pages/<Route>/index.tsx`      | Thin route-level composition. A page never imports another page.                                                                         |
| `features/<domain>/`           | Everything one domain owns: `api/`, `queries/`, `mutations/`, `types/`, `components/`, `hooks/`, `store/`. E.g. `auth`, `catalog`, `cart`. |
| `components/{layout,feedback}` | Generic UI with no domain knowledge.                                                                                                     |
| `lib/{api,query,offline}`      | Generic infrastructure: the HTTP client, the query client, service-worker updates.                                                       |
| `config/`                      | App config and the static route table (`routes.ts`, which also drives the TabBar).                                                       |

A feature imports only itself and the shared layers (`components`, `lib`,
`config`). Pages compose features.

## PWA notes

- The service worker precaches the app shell only. API data is TanStack
  Query's job; per-user responses (cart, orders) are never cached by the
  service worker.
- Updates use `registerType: "prompt"`: a new build waits for the user to tap
  Reload in `UpdatePrompt`.
- `theme_color` / `background_color` in `vite.config.ts` and `index.html`
  mirror `--app-shell-background` in `src/index.css`. Keep them in step.
