# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The import above is mandatory reading: this is a customized Next.js (16.2.9) with
> breaking changes from stock. Read the relevant guide in `node_modules/next/dist/docs/`
> before writing any Next.js code.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build (also runs full TypeScript typecheck)
npm run start    # serve the production build
npm run lint     # eslint (eslint-config-next: core-web-vitals + typescript)
```

There is no test suite. `npm run build` is the verification gate — it typechecks the whole project. After editing the dev server, prefer a clean restart (`rm -rf .next && npm run dev`) over relying on Fast Refresh; the heavy GSAP effect (see below) does not always survive HMR cleanly.

Path alias: `@/*` → repo root (e.g. `@/app/...`).

## Architecture

This is a **single-page portfolio**. The entire app is one large client component:

- `app/page.tsx` → renders `<PortfolioCanvas />` and nothing else.
- `app/layout.tsx` → root layout; loads the `Space_Grotesk` font as `--font-space-grotesk`. **No transforms on `html`/`body`** (the ghost cursor depends on this — see below).
- `app/globals.css` (~755 lines) → all styling, hand-written. Tailwind v4 is imported (`@import "tailwindcss"`) but the design is bespoke CSS, not utility classes. Colors are inline hex (no token system). Every interactive element uses `cursor: none` because the app draws its own cursor.
- `app/components/PortfolioCanvas.tsx` (~1100 lines) → the whole experience.

### The infinite canvas model

`#canvas` is a 4000×4000 element panned with GSAP `Draggable` (`type: 'x,y'`, inertia) and the wheel handler. Everything visible (hero words, polaroid, project deck, stickers) lives *inside* `#canvas` and moves with it. A handful of HUD elements (custom cursor, ghost cursor, fixed corners, tool stack, social dock) are **siblings of `#canvas` under `<body>`** and are `position: fixed` — they must stay locked to the viewport while the canvas pans.

### The one big effect

Almost all imperative behavior is set up in a single `useEffect` ("Main GSAP setup") in `PortfolioCanvas.tsx`. It creates **all** Draggables (canvas, both hero words via `makeHeroDraggable`, polaroid, deck, contact + Good-Problems stickers), every `addEventListener`, the intro timeline, the panels, and the ghost-cursor system. Its dependency array is `[shuffleGpOrder, loadContext]` (both `useCallback`).

**The cleanup must tear down everything it created** — kill every `Draggable`, remove every listener, clear intervals, cancel the ghost sequence (`ghostGenRef.current++` + `clearTyping()`), and honor the `effectCancelled` flag (the hero-word Draggables are created asynchronously from the intro timeline's `onComplete`). If cleanup is incomplete, Fast Refresh / Strict-Mode re-mounts **stack duplicate Draggables and stale animation closures** on the same DOM nodes, which then fight over pointer events (the historical "ghost cursor rides the canvas" bug). Keep this cleanup exhaustive when adding anything to the effect.

### Drag interaction rules (important, non-obvious)

- GSAP `Draggable` listens on **`pointerdown`**, not `mousedown`. Any child element that should be independently draggable without also panning the canvas must (a) `stopPropagation` on `pointerdown` *and* `mousedown`/`touchstart`, and (b) call `Draggable.get(canvas)?.disable()` in its `onDragStart` and `?.enable()` in its `onDragEnd`. Doing only `mousedown` stopPropagation is insufficient.
- Click-vs-drag is disambiguated by tracking drag distance and calling `e.preventDefault()` on the trailing `click` when distance exceeds a threshold.

### Ghost cursor

`#ghost-cursor` is the animated "Dhairya" assistant that flies in after you drag a hero word, snaps the word home, types a witty line, and exits. It is a `position: fixed` body-level sibling animated via **`left`/`top` (not `x`/`y` transforms)** so it stays in pure viewport space, and it is pinned to its own GPU layer (`transform: translateZ(0); will-change: transform; backface-visibility: hidden`) so the giant `will-change: transform` canvas layer cannot repaint it during a pan. It must remain fully independent of canvas movement. The sequence is a generation-guarded chain of `gsap.delayedCall`s; `ghostGenRef` is incremented to cancel a stale run.

### First-load animation

The intro timeline is gated on `sessionStorage['hasAnimated']`. On first visit it plays the full reveal and makes the hero words draggable in the timeline `onComplete`; on subsequent navigations it skips straight to the interactive state.

### AI chat panel

The "Ask AI" panel calls **Google Gemini (`gemini-1.5-flash`) REST API directly from the client**. There is no backend/API route. Two external dependencies, both client-side:
- `GIST_URL` (top of `PortfolioCanvas.tsx`) — a GitHub Gist holding the resume/context markdown, fetched and cached via `loadContext`.
- `GEMINI_API_KEY` (top of `PortfolioCanvas.tsx`) — currently an empty string placeholder; the panel is non-functional until a key is set. Note this key would be exposed to the browser as-is.

## Gotchas

- `app/components/PortfolioCanvas 2.tsx` is an **unreferenced duplicate** (a Finder copy). Nothing imports it — edits there have no effect. Edit `PortfolioCanvas.tsx`.
- Image assets live in `public/`. PNGs are rendered with `next/image`; SVGs use plain `<img>` (with the `@next/next/no-img-element` lint disabled inline).
