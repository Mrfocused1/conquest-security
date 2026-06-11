# Conquest Security — Admin CMS

A premium, dark-luxury enterprise CMS for managing the Conquest Security website. Built with **Vite + React + TypeScript + Tailwind CSS**.

Designed in the spirit of Vercel, Stripe, Linear, and Sanity Studio: minimal, glassy, monochromatic, and fast.

## Features

- **Desktop dashboard** — 280px sidebar (Dashboard, Site Content + sub-sections, Pages, Blog, Media, Forms, Settings, Users, Audit Log), sticky top bar with search/notifications/profile, 4 overview metric cards.
- **Three-column content editor** — content form (left) · real-time live homepage preview (center) · section settings panel with logo upload, size slider, position, visibility toggles, and advanced/delete (right).
- **Section management** — drag-and-drop reordering, Published/Draft badges, edit/duplicate/more actions, add new section.
- **Mobile dashboard** — "Welcome back" header, 2×2 metrics, Quick Actions, Recent Changes, sticky top bar + bottom tab bar (Dashboard / Content / Media / Settings / Profile) + slide-in drawer.
- **Mobile content editor** — dedicated edit screens with **Content / Design / Settings** tabs, live preview, character counters, and auto-save indicator.
- **Shared state** — the live preview and every editor (desktop + mobile) read from one CMS store, so edits reflect everywhere instantly.
- Accessible: semantic roles, `aria-*` on switches/nav, keyboard-focusable controls, and `prefers-reduced-motion` support.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5180
```

```bash
npm run build    # type-check + production build to /dist
npm run preview  # preview the production build
```

## Tech

- Vite 5 · React 18 · TypeScript 5 · Tailwind CSS 3
- State via a lightweight React Context (`src/store/cms.tsx`) — no external state lib.

## Project structure

```
src/
  App.tsx                  # desktop + mobile composition and routing
  store/cms.tsx            # shared CMS content/design/visibility/SEO state
  data/nav.ts              # nav, sections, metrics, quick actions
  components/
    Sidebar / TopNav / MetricCard
    ContentEditor          # form + live preview + section settings
    LivePreview            # real-time homepage hero preview
    SettingsPanel          # logo / visibility / advanced
    SectionList            # drag-and-drop section manager
    Placeholder            # scaffolded modules (Media, Users, Audit, …)
    ui/                     # Toggle, Field, Select primitives
    mobile/                 # MobileTopBar, MobileDashboard, MobileEditor, BottomNav
```

## Scope notes

The **Dashboard** and the **Hero content editor** (desktop + mobile) are built in full depth. Other modules — Media Library, Users, Audit Logs, Blog, Pages, Forms — are scaffolded as routed placeholders wired into the same design system, ready to build out next.

The live "View Live Site" links point at the companion marketing site running locally on `http://localhost:8755`.
