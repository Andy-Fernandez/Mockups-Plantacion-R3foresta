# 03 — Organizaciones asociadas

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta
**Bloque:** A — Modelo

## Estado actual

No existe el concepto de "organización" en `admin/AdminData.jsx`. Las campañas no referencian alcaldías, ONGs ni sponsors.

## Lo que dice la guía

> Sección 1, 2.4, 3.1, 3.2, 3.5, 7

- Catálogo `ORGANIZACION` con: `id`, `nombre`, `tipo` (alcaldía / ONG / empresa / fundación), `logoUrl`.
- Campaña referencia 1+ organizaciones por id.
- En el detalle público de campaña: mostrar logos.
- Wizard "Crear campaña" Paso 2: selector múltiple del catálogo + botón "Crear nueva organización".

Ejemplos del guide:
- Alcaldía La Paz + ONG VerdesAndinos.
- TIPNIS Foundation + Coca-Cola Bolivia.

## Cambios concretos

### 1. Agregar catálogo mock a `AdminData.jsx`
```js
const ORGANIZACIONES = [
  { id: 'org-1', nombre: 'Alcaldía La Paz',     tipo: 'GOBIERNO',  logoUrl: 'assets/logos/alcaldia-lp.svg' },
  { id: 'org-2', nombre: 'ONG VerdesAndinos',   tipo: 'ONG',       logoUrl: 'assets/logos/verdes-andinos.svg' },
  { id: 'org-3', nombre: 'TIPNIS Foundation',   tipo: 'FUNDACION', logoUrl: 'assets/logos/tipnis.svg' },
  { id: 'org-4', nombre: 'Coca-Cola Bolivia',   tipo: 'EMPRESA',   logoUrl: 'assets/logos/coca-cola.svg' },
];
```

### 2. Agregar `organizacionIds[]` a Campaña
- Cada campaña referencia 1+ organizaciones.
- Mockear los 2 ejemplos de la guía.

### 3. UI: chips/logos de organizaciones
- En `CampanaRow` del dashboard: mostrar avatares de organizaciones (similar a `AvatarPile` existente).
- En `DetalleCampanaScreen`: header con logos y nombres en línea.
- En la home pública (tarea 06): logos como social-proof.

### 4. Wizard Crear campaña Paso 2
- Selector múltiple del catálogo.
- Botón "Crear nueva organización" → mini-form (nombre + tipo + logo placeholder).
- Validación blanda: "Recomendamos al menos 1 organización asociada".

## Archivos afectados

- `admin/AdminData.jsx` — agregar catálogo + ids en campañas.
- `admin/DashboardScreen.jsx` / `admin/DetalleCampanaScreen.jsx` — render de logos.
- `admin/CrearCampanaScreen.jsx` (o `CrearCampanaA.jsx`) — Paso 2 de organizaciones.
- `assets/logos/` — directorio con SVGs placeholder (pueden ser shapes).

## Dependencias / orden

- Depende de 02 (Campaña adelgazada).
- Bloqueante para 06 (home pública), 07 (detalle público) y 10 (wizard crear campaña).
