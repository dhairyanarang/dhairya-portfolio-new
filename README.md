# Dhairya Narang — Portfolio (Next.js)

A pixel-faithful Next.js 15 conversion of the original vanilla HTML portfolio.

## Stack
- **Next.js 15** (App Router, TypeScript)
- **GSAP 3** + Draggable + InertiaPlugin (all interactions preserved)
- **Space Grotesk** via `next/font/google`
- **Tailwind CSS v4** (utility layer only; all design CSS lives in `globals.css`)

## Setup

```bash
npm install
npm run dev
```

## Public assets

Copy these files from your original project into `/public/`:

| File | Used by |
|---|---|
| `dhairya-photo.png` | Polaroid photo |
| `good-problems-trigger.png` | Good Problems sticker |
| `contact-me-trigger2.png` | Contact sticker |
| `hero-tagline-decorative-lines.svg` | Hero tagline decorative lines |
| `Sparkle.svg` | Ask AI button icon |
| `send.svg` | AI panel send button |
| `reset-chat.svg` | AI panel reset button |
| `close.svg` | AI panel close button |

Until images are added, placeholder colored divs are shown.

## AI Chatbot

In `app/components/PortfolioCanvas.tsx`, set your Gemini API key:

```ts
const GEMINI_API_KEY = "your-key-here"
```

## Project structure

```
app/
  layout.tsx          ← Root layout with Space Grotesk font
  page.tsx            ← Renders <PortfolioCanvas />
  globals.css         ← All CSS (mirrors original styles exactly)
  components/
    PortfolioCanvas.tsx  ← All GSAP logic + JSX (client component)
public/               ← Put your images here
```

## What's preserved
- ✅ Canvas pan (drag + trackpad + scroll)
- ✅ Pinch/ctrl+wheel zoom
- ✅ "Find my way back" reset button
- ✅ DHAIRYA / NARANG hero word dragging with ghost cursor snap-back
- ✅ Polaroid draggable
- ✅ Project deck fan-on-hover + draggable
- ✅ Contact & Good Problems sticker draggables
- ✅ Good Problems side panel with shuffle
- ✅ Ask AI panel (Gemini API)
- ✅ Custom green cursor + label
- ✅ Tool stack + dock tooltips
- ✅ Entry animation (sessionStorage skip on revisit)
- ✅ Live IST clock
