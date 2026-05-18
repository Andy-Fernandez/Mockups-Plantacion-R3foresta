# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **hi-fi prototype/mockup repo** for the R3foresta Plantación admin/operator surfaces. It is **not** the production PWA — production lives at `R3foresta/pwa-r3foresta` (React 19 + TS + Vite). This repo recreates screens visually using React via CDN + Babel-standalone + Tailwind via CDN, with no build step.

The repo's primary purpose is to design and iterate on Plantación admin screens before they ship into the real PWA. It also doubles as a **design system reference** (see [README.md](README.md) and [SKILL.md](SKILL.md), which are authoritative for brand/copy rules).

## How to run

There is no build system, no package.json, no test runner. Open any of the top-level HTML files directly in a browser:

- `Dashboard admin.html`, `Detalle de campaña.html`, `Crear campaña.html`, `Asignar equipo y lotes.html`, `Registrar plantación.html`, `Historial del lote.html`
- `ui_kits/pwa/index.html` — clickable recreation of the live PWA's four core screens
- `preview/*.html` — small isolated cards demonstrating individual tokens (colors, type, spacing, components)

Each HTML file is self-contained: it pulls React/Babel/Tailwind from a CDN, imports [colors_and_type.css](colors_and_type.css), inlines a Tailwind config that mirrors the design tokens, then `<script type="text/babel" src="...">` loads the JSX components from a sibling directory.

## Repository shape

One screen module per top-level HTML file. Each module's JSX lives in a parallel subdirectory:

| HTML file | Module dir | Notes |
|---|---|---|
| `Dashboard admin.html`, `Detalle de campaña.html`, `Crear campaña.html`, `Asignar equipo y lotes.html` | [admin/](admin/) | Shares `AdminData.jsx` + `AdminShell.jsx` (atoms: `StateBadge`, `Progress`, `MiniMap`, `AvatarPile`). Each screen gets its own `*Screen.jsx`. |
| `Registrar plantación.html` | [plantacion/](plantacion/) | Field-operator flow. `PlantacionData.jsx` + `PlantacionSteps*.jsx`. |
| `Historial del lote.html` | [historial/](historial/) | Lote timeline. |
| `ui_kits/pwa/index.html` | [ui_kits/pwa/](ui_kits/pwa/) | Mobile PWA recreation — Home, Login, Recolecciones, Vivero. |

**Every module dir has its own copy of `Icon.jsx`, `BottomNav.jsx`, and `tweaks-panel.jsx`.** These are intentional duplicates, not shared modules — keep them in sync manually when you change icon sets or nav atoms. [admin/Icon.jsx](admin/Icon.jsx) is the most up-to-date superset.

## The "tweaks panel" host protocol

Every prototype mounts a floating sidebar of variants on the left ("sidebar" with `seg-*` IDs) **plus** a hidden `TweaksPanel` from `tweaks-panel.jsx`. The `TWEAK_DEFAULTS` object is wrapped in `/*EDITMODE-BEGIN*/ ... /*EDITMODE-END*/` markers — those markers let an external host (the design tool that consumes these prototypes) parse, mutate, and persist the variant state. **Do not remove those comment markers.**

The tweaks panel listens for `__activate_edit_mode` / `__deactivate_edit_mode` postMessages and emits `__edit_mode_available` / `__edit_mode_set_keys` / `__edit_mode_dismissed`. The sidebar's segmented buttons (`<button data-val="…">`) are wired in `App()`'s `useEffect` to call `setTweak(key, value)`, then the visible `.on` class is toggled from the current tweak state. New variant pickers should follow this pattern (give the container an `id="seg-*"`, give each button a `data-val=...`).

## Visual / brand rules (load-bearing — don't drift)

[README.md](README.md) and [SKILL.md](SKILL.md) are the source of truth. Critical points:

- **Spanish (LATAM/Bolivia)** UI copy. Use `tú`, never `usted`. No emoji. CO₂ uses subscript ₂.
- **State badges are `UPPER_SNAKE_CASE`** matching the backend enum (`VALIDADO`, `EMBOLSADO`, `ACTIVA`, `PENDIENTE_VALIDACION`, etc.) — never re-cased to Title Case.
- **Numbers**: Bolivia format with comma decimal (`20,6 T`, `86 ha`). `UNIDAD` for whole counts, `G` for grams (1 decimal). Plantas vivas always `UNIDAD`.
- **Icons**: hand-rolled inline SVG (24×24, `strokeWidth="1.8"`, `stroke="currentColor"`, `fill="none"`, round caps/joins). The set is in each `Icon.jsx`. **No Heroicons / Lucide / emoji** — if a glyph is missing, draw a new one in the same style.
- **Brand palette** is forest green; the Tailwind config is duplicated inline in every HTML file. If you add/edit a brand color in [colors_and_type.css](colors_and_type.css), update the inline `tailwind.config` in every `*.html` to match.
- **Events are append-only.** Never design `edit` or `delete` affordances on event rows in Vivero/Plantación timelines.
- **Evidence (photos) is mandatory** at `INICIO`, `EMBOLSADO`, `MERMA`, `DESPACHO` transitions — always surface a photo picker on those forms.

## Domain model (in flux)

The Plantación domain is currently mid-migration from a **flat "Campaña"** model to a **hierarchical Programa → Campaña (paraguas) → Sub-campaña (ejecutable)** model. As of now:

- [admin/AdminData.jsx](admin/AdminData.jsx) `CAMPANAS_ADMIN` still treats a campaign as a single executable unit (it carries `meta`, `plantados`, `coordinadora`, `equipoCount`, `lotesCount`, `mixPlanificado` directly).
- [admin/CrearCampanaScreen.jsx](admin/CrearCampanaScreen.jsx) is the first surface to model the new hierarchy: a "Campaña general" holds a list of `Sub-campañas`, each with its own coordinator/zone/dates/mix.
- Dashboard, Detalle, and Asignar still assume the old flat model.

When extending admin screens, expect Sub-campaña to be the **operational/executable** unit (state, equipo, lotes, mapa, eventos) and Campaña paraguas to be the **coordination/aggregation** unit (sums/distributions across sub-campañas). Avoid building new screens that re-cement the flat model.

State machine for sub-campañas (per current design discussion): `PENDIENTE → EN_CONFIGURACION → CONFIGURADA → ACTIVA ⇄ PAUSADA → COMPLETADA`, with `CANCELADA` reachable from most states under confirmation. `ACTIVA` requires coordinator + dates + zona + meta to be set.

## Common gotchas

- The Tailwind brand config is duplicated inline in **every** HTML file — drift between files is a real risk.
- `Icon.jsx`, `BottomNav.jsx`, `tweaks-panel.jsx` are duplicated in every module dir. If you add an icon, add it everywhere it's used.
- File names contain spaces and non-ASCII (`Crear campaña.html`) — quote paths in shell commands.
- The `RecoleccionesScreen` uses `#0f8351` (`--accent-leaf`), brighter than `brand-500` — kept as an intentional one-off, not a token to reuse elsewhere.
- Manrope loads from Google Fonts CDN at runtime; no offline bundle.
