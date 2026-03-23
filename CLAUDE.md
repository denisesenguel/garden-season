# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-page React app: a monthly planting calendar for a raised-bed garden (Hochbeet) in Germany. Built with Vite + React 19 + Tailwind CSS v4, deployable to GitHub Pages.

## Dev commands

```bash
npm install      # install dependencies
npm run dev      # start dev server at localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build locally
```

## Architecture

Stack: **Vite 6**, **React 19**, **Tailwind CSS v4** (`@tailwindcss/vite` plugin — no config file needed).

Source files in `src/`:

- **`src/hochbeet-data.js`** — all data: `months` (array of month names), `calendar` (array of 12 month objects with `vorziehen`, `pflanzen`, `ernten`, `tipp`, `beet`, `icon`), and `tagColors` (CSS class mappings for location badges).
- **`src/hochbeet-kalender.jsx`** — the React component. Imports everything from `hochbeet-data.js`. Contains two helper components (`Badge`, `Section`) and the default export `App`.
- **`src/main.jsx`** — entry point, renders `<App />` into `#root`.
- **`src/index.css`** — `@import "tailwindcss"` (Tailwind v4 entry).

Root files: `index.html`, `vite.config.js` (sets `base: '/garden-season/'` for GitHub Pages), `package.json`.

## GitHub Pages deployment

`vite.config.js` sets `base: '/garden-season/'` so assets resolve at `https://denisesenguel.github.io/garden-season/`.

Manual deploy: `npm run build`, then push `dist/` contents to the `gh-pages` branch (or use the `gh-pages` npm package).

## Data shape

Each entry in `calendar`:
```js
{
  month: string,
  icon: string,        // emoji
  vorziehen: [{ name, wo, tipp }],   // start indoors
  pflanzen:  [{ name, wo, tipp }],   // plant out
  ernten:    [{ name, tipp }],       // harvest
  tipp: string,        // monthly tip shown in amber banner
  beet: string | null, // short bed-status summary shown in card header
}
```

The `wo` field maps to keys in `tagColors` for colored badges.
