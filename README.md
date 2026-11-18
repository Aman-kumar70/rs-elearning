# RS & IP Interactive Guide

Interactive guide to remote sensing and digital image processing, built with React, Vite, and React Router.

## Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The deployable output is written to `dist/`.

## Routes

- `/`
- `/remote-sensing/intro`
- `/remote-sensing/fundamentals`
- `/remote-sensing/signatures`
- `/remote-sensing/platforms`
- `/remote-sensing/resolution`
- `/remote-sensing/interpretation`
- `/remote-sensing/missions-data`
- `/image-processing/basics`
- `/image-processing/preprocessing`
- `/image-processing/enhancement`
- `/image-processing/classification`
- `/image-processing/python-lab`
- `/applications`
- `/quiz`

Legacy `.html` URLs redirect to their clean routes. Unknown routes render a Not Found page.

## Architecture

- `src/pages/` — one React page component per chapter.
- `src/controllers/` — imperative canvas/widget logic from the original pages, mounted and cleaned up through React lifecycles.
- `src/components/` — shared UI, the Three.js globe, and the six-stage remote-sensing animation.
- `src/layout/` — shared nav, footer, page navigation, and route layout.
- `css/style.css` — the existing site design system, reused for the migrated components.
- `public/assets/` — images and the local Earth texture.

## Deployment

`vercel.json` rewrites nested routes to `index.html` so direct visits and refreshes work with client-side routing. Vercel builds with `npm run build` and serves `dist/`.
