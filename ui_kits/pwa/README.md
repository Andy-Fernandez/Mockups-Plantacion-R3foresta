# R3foresta PWA — UI kit

A clickable, hi-fi recreation of the R3foresta PWA's core screens.

## Files
- `index.html` — entry; wires React + Tailwind CDN, loads all components, renders an iPhone-sized frame with screen routing.
- `Icon.jsx` — full inline-SVG icon set (mirrors `src/components/Icon.tsx`).
- `BottomNav.jsx` — bottom tab bar + FAB with quick-actions overlay.
- `HomeScreen.jsx` — dashboard: hero, profile-incomplete banner, sync notice, indicators, phases-in-progress tiles, recent activity.
- `LoginScreen.jsx` — passkey-only login/register with segmented toggle on a forest-canopy hero.
- `RecoleccionesScreen.jsx` — green header, search, material filter pills, recolección cards.
- `ViveroDetailScreen.jsx` — Vivero lote detail with append-only event timeline.

## Screens to click through
1. Login → "Entrar con Passkey" → Home.
2. Home → tap a "Fases en progreso" tile → Recolecciones / Vivero list.
3. Recolecciones → tap a card → Vivero detail (stand-in detail view).
4. Bottom-nav FAB → quick-actions menu.

## Scope
- All UI is mock — no real navigation guards, no real WebAuthn, no real API calls.
- Vivero/Plantación/CO₂ flows are abbreviated. The detail view shows the timeline pattern that's reused for every lote.
