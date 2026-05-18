---
name: r3foresta-design
description: Use this skill to generate well-branded interfaces and assets for R3foresta — the community forest-restoration traceability PWA. Contains essential design guidelines, colors, type, fonts, assets, and a UI kit recreation of the live product (Home, Auth, Recolecciones, Vivero). Use for production code or throwaway prototypes/mocks.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files (`colors_and_type.css`, `preview/`, `ui_kits/pwa/`, `assets/`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets out and create static HTML files for the user to view. If working on production code (the React/TS PWA), copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions (which screen, which lifecycle stage — Recolección / Vivero / Plantación — what fidelity, mobile or admin web), and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key facts to remember:
- Spanish (LATAM/Bolivia) UI copy. Use `tú`, never `usted`. No emoji. CO₂ uses subscript ₂.
- Mobile-first, max-width 448px, bottom-nav + FAB pattern.
- Brand palette is forest green (`#1f613b` / `#164d2f` / `#0f3b23`), Manrope display font, generous radii (`16–28px`), single `shadow-soft`.
- State badges are `UPPER_SNAKE_CASE` matching the backend enum (`VALIDADO`, `EMBOLSADO`, etc.) — never re-label.
- Icons are hand-rolled inline SVG (24×24, stroke 1.8, round caps). Don't substitute Heroicons/Lucide unless flagged.
- Events are append-only — never design "edit" or "delete" affordances for `EVENTO_LOTE_VIVERO` items.
- Evidence (photos) is mandatory at `INICIO`, `EMBOLSADO`, `MERMA`, `DESPACHO` — surface photo pickers in those forms.
