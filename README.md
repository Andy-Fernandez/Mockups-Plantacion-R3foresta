# R3foresta Design System

A design system extracted from the **R3foresta PWA** — a mobile-first traceability app for community-led reforestation in Bolivia. It tracks the full lifecycle of a tree, from seed collection (`Recolección`) → nursery germination (`Vivero` / `Germinación`) → field planting (`Plantación`) → CO₂ accounting.

This system gives design agents the tokens, components, and product context they need to mock or extend R3foresta surfaces.

## Sources

- **Codebase:** `R3foresta/pwa-r3foresta` (default branch `main`) — React 19 + TypeScript + Vite 7 + Tailwind v3 + react-leaflet.
  - Tailwind tokens: `tailwind.config.js`
  - Global CSS / font: `src/index.css`
  - Custom inline-SVG icon set: `src/components/Icon.tsx`
  - Bottom-tab + FAB: `src/components/BottomNav.tsx`
  - Auth shell: `src/layouts/AuthLayout.tsx`, `src/modules/auth/LoginScreen.tsx`
  - Home dashboard: `src/modules/home/HomeScreen.tsx`, `src/data/home.ts`
  - Recolección flow: `src/modules/recolecciones/*`
  - Vivero flow: `src/modules/vivero/*`
- **Backend docs (referenced, not in this design system):** `R3foresta/Backend-r3foresta`, `R3foresta/r3foresta-docs`
- **Domain rules:** in-repo `DOMAIN_INDEX.md`, `AGENTS.md`, `FRONTEND_GUIDE.md`, `FRONTEND_AUDIT.md` (consulted, not copied — they're authoritative for backend contracts and not visual).

## What R3foresta is

A traceability-first PWA for forest-restoration field teams. Append-only events feed an auditable timeline; evidence (photos, lat/long, snapshots) is mandatory at key transitions; passkey/WebAuthn auth instead of passwords; offline-tolerant. The UI is in **Spanish (Bolivia)**, written for people doing real work in nurseries and field plots — not for office dashboards.

Core lifecycle:

```
Recolección  →  Consumo  →  Inicio (Vivero)  →  Embolsado  →  Adaptabilidad  →  Merma / Despacho  →  Cierre
```

## Index

| File | What it has |
|---|---|
| `README.md` | This file. Brand context, content & visual fundamentals, iconography. |
| `SKILL.md` | Agent Skill descriptor — load this to design with the R3foresta brand. |
| `colors_and_type.css` | CSS variables for colors, type ramp, radii, shadow, spacing. |
| `fonts/` | (Manrope is loaded from Google Fonts via `colors_and_type.css`.) |
| `assets/` | Logos, app icons, hero/section imagery, manifest. |
| `preview/` | Small cards rendered in the Design System tab. |
| `ui_kits/pwa/` | High-fidelity recreation of the PWA — Home, Login, Recolecciones list, Vivero detail. |

## Content fundamentals

**Language.** Spanish, Bolivian/general LATAM register. Operational, not marketing. Domain terms stay in Spanish even when English would be shorter (`Recolección`, `Vivero`, `Germinación`, `Plantación`, `Lote`, `Embolsado`, `Merma`, `Despacho`).

**Tone.** Direct, calm, instructional. Field-team-friendly. Sentences are short. No exclamation points. No second-person sales talk. The product behaves like an auditable logbook — the copy reflects that.

**Pronouns.** `tú` ("Necesitas completar tu perfil", "Tu nombre"). Never `usted`. Never `nosotros` for the product.

**Casing.**
- **Section titles** in sentence case: *"Indicadores clave"*, *"Fases en progreso"*, *"Actividad reciente"*.
- **State badges** in `UPPER_SNAKE_CASE` matching the backend enum: `BORRADOR`, `PENDIENTE_VALIDACION`, `VALIDADO`, `RECHAZADO`, `ABIERTO`, `CERRADO`, `ACTIVO`, `FINALIZADO`, `INICIO`, `EMBOLSADO`, `ADAPTABILIDAD`, `MERMA`, `DESPACHO`, `CIERRE_AUTOMATICO`. Don't title-case these.
- **Buttons** sentence case with strong verbs: *"Registrar recolección"*, *"Entrar con Passkey"*, *"Validar"*, *"Solicitar validación"*.
- **Brand** is always `R3foresta` (uppercase R + 3, no space). CO₂ uses the subscript ₂.

**Units & numbers.** Bolivia format — comma decimal: `20,6 T`, `86 ha`. Persistence is `UNIDAD` (no decimals) or `G` (1 decimal). UI may accept `kg` as input and label it accordingly, but `kg` and `GR` are never persisted. Plantas vivas always in `UNIDAD`.

**Emoji.** **Not used.** The only non-ASCII glyph in product copy is `CO₂`. Don't introduce emoji in new mocks.

**Vibe.** A nursery logbook with bank-grade audit. Forest-green chrome, white cards, photos as proof. Quietly serious. Never playful, never gamified.

**Examples (from the live app):**
- Hero: *"Trazabilidad viva — Monitorea cada fase y mantiene la sincronización al día."*
- Status: *"6 registros se cargarán cuando haya señal estable."*
- CTA: *"Entrar con Passkey"* / *"Crear cuenta con Passkey"*
- Empty state: *"No hay recolecciones — Aún no existen registros."*
- Warning: *"Necesitas completar tu perfil para acceder a todas las funcionalidades de la aplicación."*
- Microcopy: *"Biometría solo cuando sea necesario."* / *"Face ID / huella para confirmar alta."*

## Visual foundations

**Brand palette.** Forest greens. The Tailwind `brand` scale comes directly from `tailwind.config.js`:

| Token | Hex | Role |
|---|---|---|
| `brand-50` | `#f0f6f2` | Tint chips, hover surfaces on white |
| `brand-100` | `#d9e8dd` | Soft tinted backgrounds, icon containers |
| `brand-500` | `#1f613b` | Primary accent, FAB, focus ring |
| `brand-600` | `#164d2f` | Default buttons, bottom-nav fill |
| `brand-700` | `#0f3b23` | Body text on light, hero backgrounds |

Extended in product use (see `src/index.css`, `RecoleccionesScreen.tsx`, `AuthLayout.tsx`):
- App canvas: `#f6f7f3` → `#eef1eb` radial; auth canvas: layered `#081c13` → `#0c2a1e` → `#08140f` with emerald + lime blurred glow.
- A brighter accent green `#0f8351` is used for the Recolecciones list header (more saturated than `brand-500`).
- Semantic: amber-50/amber-200/amber-800 for *Perfil incompleto* warnings, red-50/red-500/red-700 for errors, emerald-50/emerald-700 and amber-50/amber-700 as the material badges (`SEMILLA` = emerald, `ESQUEJE` = amber), slate-100/slate-500/slate-700 for neutrals.

**Typography.** **Manrope** (Google Fonts) at weights 400 / 500 / 600 / 700; some buttons use `font-extrabold` (800). System fallback stack: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`. Body color on light surfaces is `#0f3b29`. Type tropes used heavily:

- Eyebrow: `text-xs uppercase tracking-[0.2em]` to `tracking-[0.28em]` in `brand-500` or `white/80`. Appears above almost every section/header.
- Big numerals in metrics: `text-xl font-semibold` with smaller helper line in `brand-500`.
- Hero titles: `text-2xl font-semibold tracking-tight`.
- Italic for scientific names in collection cards.

**Spacing & rhythm.** Mobile container is `max-w-md` (`448px`) centered, padded `px-5`. Bottom padding `pb-32` leaves room for the bottom-nav + floating FAB. Section spacing `mt-4` between blocks, `mt-6` / `mt-7` between major sections. Card internal padding `p-4` or `p-5`. Grid gaps `gap-3` / `gap-4`.

**Corner radii.** Generous and consistent. `rounded-2xl` (1rem) for cards and inputs, `rounded-3xl` (1.5rem) for hero/header blocks and the bottom nav, `rounded-[28px]` for the auth hero, `rounded-full` for pill chips, badges, FAB, icon-buttons, and segmented controls. Almost nothing is square.

**Shadows.** Single custom utility: `shadow-soft = 0 10px 30px rgba(0,0,0,0.06)`. Used on cards, FAB, inputs. The bottom-nav uses a tinted brand shadow `shadow-2xl shadow-brand-900/30`. Auth has full-bleed dark gradients instead of shadows.

**Backgrounds.** Light surfaces ride a soft radial gradient (`radial-gradient(circle at 30% 20%, #f2f7ef 0, #f6f7f3 40%, #eef1eb 100%)`). Auth and the hero block use full-bleed photography (canopy / forest) with a dark gradient overlay on top (`from-black/65 to-brand-900/90` or `from-brand-700/90 via-brand-700/70 to-brand-500/30`). Decorative blurred orbs (`bg-emerald-400/20 blur-[110px]`) sit behind dark hero content. No textures, no patterns, no skeuomorphic illustration.

**Imagery.** Photographic, **warm-cool natural** — green canopies, soil, hands working. Slightly desaturated, not punchy. Always overlaid with a dark gradient when type sits on top. Cards in lists carry small thumbnails of the user-uploaded evidence photo.

**Animation.** Restrained. Tailwind `transition` defaults; `duration-300` on the segmented Login toggle; `duration-500` on hover-zoom of section tiles (`group-hover:scale-105`). Loading is a CSS spinner (`animate-spin`). No bouncy springs, no parallax, no Lottie. Modals fade with `backdrop-blur-sm`.

**Hover states.** Light: `hover:shadow-md` or `hover:bg-slate-50` / `hover:bg-brand-50`. Dark/primary: `hover:bg-brand-700` (one step darker). Pills: `hover:border-brand-300`.

**Press states.** `active:scale-[0.97]` on important pills/CTAs, `active:scale-[0.99]` on full-width primary buttons, `active:bg-slate-100` on list rows. Subtle — not bouncy.

**Borders.** Mostly absent. When present: `border-slate-200` on form inputs, `border-brand-100` on outline pills, `border-amber-200` on warning banners, `border-l-4 border-red-500` on inline error blocks (this *is* the one left-accent treatment in the system — reserved for inline error blocks, not generic cards). Ring-style hairlines (`ring-1 ring-black/5`) substitute for borders on cards.

**Transparency & blur.** Used purposefully:
- Auth: blurred glow orbs (`blur-[110px]`/`[120px]`) for atmosphere.
- Bottom-nav overlay modal: `bg-black/40 backdrop-blur-[2px]`.
- Auth chips: `bg-white/15` / `bg-white/25 backdrop-blur` over photography.
- Profile-incomplete modal: `bg-black/50 backdrop-blur-sm` scrim.
Never on body content cards — those stay opaque white.

**Cards.** White, `rounded-2xl` or `rounded-3xl`, `shadow-soft`, often `ring-1 ring-black/5`. Internal layout is content-left, optional 96×96 thumbnail on the right (recolección cards). Status badges live on a bottom row as small pills.

**Pills & badges.** `rounded-full px-3 py-1 text-xs font-semibold` with optional `ring-1`. Material badges color-code: `SEMILLA` emerald, `ESQUEJE` amber, others slate. State badges follow a paired scheme (e.g. `VALIDADO` green, `PENDIENTE_VALIDACION` amber, `RECHAZADO` red, `BORRADOR` slate).

**Layout rules.** Mobile-first, single column, max-width 448px. Bottom-nav and FAB are `fixed` to the viewport. Headers either stick to the top with a `rounded-b-3xl` colored bar (Recolecciones) or float as plain rows over the canvas (Home). Lists scroll inside the column, with the bottom-nav guaranteed safe area via `pb-32`.

**Protection gradients vs capsules.** Type over photography always rides a dark gradient (capsule overlays are not used). Type over solid color uses no protection.

## Iconography

The PWA ships a **hand-rolled inline-SVG icon component** (`src/components/Icon.tsx`) — there is no icon font, no Heroicons, no Lucide, no emoji.

- **Style:** 24×24 viewBox, line-art, `strokeWidth="1.8"` (heavier 2 / 2.5 for `plus`, `arrow-left`, `check`), `strokeLinecap="round"`, `strokeLinejoin="round"`, `fill="none"` except for dots/filled markers.
- **Color:** rendered as `stroke-current` so the icon inherits the surrounding text color. Sizing is by Tailwind class (`h-5 w-5` typical, `h-4 w-4` inline with text, `h-8 w-8` in empty states).
- **Set (24 names):** `bell`, `dot`, `home`, `scan`, `report`, `user`, `search`, `leaf`, `vivero`, `cutting`, `plus`, `minus`, `arrow-left`, `pin`, `chevron-down`, `photo`, `info`, `balance`, `package`, `date`, `qr`, `trash`, `check`, `x`, `planting`, `map`. Domain-specific glyphs (`vivero`, `cutting`, `balance`, `planting`) are custom.
- **Usage rules:** never used decoratively in a vacuum — always sits in a tinted square (`bg-brand-100`/`bg-brand-50`) or beside text. Container is typically `rounded-xl` or `rounded-full`.
- **Logos:** the only raster brand mark is the leaf-on-green app icon in `assets/icon.jpg` and the maskable PNGs in `assets/icon-192.png`, `assets/icon-512.png`, `assets/apple-touch-icon.png` (from the PWA manifest).
- **Substitutions / extensions:** if a needed icon isn't in the set, draw it in the same style (24×24, 1.8 stroke, round caps/joins, `stroke-current`) before reaching for a CDN library. CDN fallback (if absolutely necessary) is **Lucide** — closest stroke language. Flag any substitution.
- **Emoji:** not used. Do not add.
- **Unicode glyphs:** only `CO₂` (subscript ₂). No arrows or symbols substituted for icons.

## Caveats / known limitations

- No real designer-supplied logo file; only the rasterized app-icon (`assets/icon.jpg`) and PWA maskables exist. A vector logo + wordmark would be a useful add.
- Component-state coverage in this kit reflects what's in the codebase as of the cited commit; the Vivero flow has additional event-specific forms (Embolsado / Merma / Despacho) that are abbreviated here.
- The `RecoleccionesScreen` uses a header green (`#0f8351`) brighter than `brand-500` — kept as a recoleccion-specific accent (`--accent-leaf`) but the design system should decide whether to canonize it or normalize toward `brand-500`.
- Manrope is used at runtime via Google Fonts CDN, not bundled. If offline-first matters, bundle the woff2.
