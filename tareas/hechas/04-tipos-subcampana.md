# 04 — Tipos de subcampaña correctos

> **Estado de revisión:** Hecha en el mock visual.
> **Resumen:** el modelo mock quedó alineado a `REFORESTACION`, `ARBORIZACION` y `FORESTACION`; también existe badge visual para los 3 tipos y selector con cards en creación.
> **Alcance:** solo UI/UX mock con datos hardcodeados; sin lógica real ni persistencia.

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](../00-README.md).

**Prioridad:** Media
**Bloque:** A — Modelo

## Estado actual

`admin/AdminData.jsx` usa los tipos: `ARBORIZACION`, `REFORESTACION`, `COMUNIDAD`, `URBANA`.

`DashboardScreen.jsx` (función `TipoBadge`) discrimina entre `ARBORIZACION` (icono "building") y otros.

## Lo que dice la guía

> Sección 3.6 Paso 1: "Tipo: reforestación / arborización / forestación"
> Sección 4: "Badge de tipo de subcampaña: REFORESTACIÓN, ARBORIZACIÓN, FORESTACIÓN"

Solo 3 tipos: `REFORESTACION`, `ARBORIZACION`, `FORESTACION`.

Distinción semántica:
- **Reforestación:** replantar bosque donde antes había.
- **Arborización:** plantar en zona urbana.
- **Forestación:** crear bosque donde no había.

## Cambios concretos

### 1. Reemplazar tipos en mocks
- `COMUNIDAD` → `REFORESTACION` (en contexto rural/comunidad).
- `URBANA` → `ARBORIZACION` (ya está bien semánticamente).
- Agregar al menos 1 subcampaña con tipo `FORESTACION` para tener mock representativo.

### 2. Actualizar `TipoBadge`
- 3 estilos visuales distintos:
  - `REFORESTACION`: icono `trees` (canopy denso), verde brand.
  - `ARBORIZACION`: icono `building`, brand-700.
  - `FORESTACION`: icono `sprout` o `leaf`, emerald.

### 3. Selector en wizard "Crear subcampaña"
- Radio cards con icono + nombre + descripción corta de cada tipo.

## Archivos afectados

- `admin/AdminData.jsx` — campos `tipo` en SUBCAMPANAS_ADMIN.
- `admin/AdminShell.jsx` — si tiene `TipoBadge` o constantes; o donde esté.
- `admin/DashboardScreen.jsx` — `TipoBadge` (línea ~149-203).
- `admin/CrearCampanaScreen.jsx` / `CrearCampanaB.jsx` — selector de tipo en wizard.
- `admin/DetalleSubcampanaScreen.jsx` — header con tipo.

## Dependencias / orden

- Después de 02 (jerarquía).
- Puede ir en paralelo con 03, 05.

## Notas

- Eliminar lógica que diferencia "ARBORIZACION vs otros" en favor de los 3 tipos explícitos.
