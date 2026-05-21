# 01 — Alinear estados de subcampaña y fase de mantenimiento

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](00-README.md).

**Prioridad:** Crítica (base para todo lo demás)
**Bloque:** A — Modelo

## Estado actual

`admin/AdminData.jsx` define 7 estados: `PENDIENTE`, `EN_CONFIGURACION`, `CONFIGURADA`, `ACTIVA`, `PAUSADA`, `COMPLETADA`, `CANCELADA`.
También hay una máquina de transiciones en `TRANSICIONES_SUBCAMPANA` que las conecta.

`AdminShell.jsx` y `DashboardScreen.jsx` también usan estos estados.

## Lo que dice la guía

> Sección 1: "Estados operativos de subcampaña"
- `BORRADOR` — en planificación
- `ACTIVA` — operativa, recibe plantaciones
- `COMPLETADA` — meta alcanzada (cierre automático)
- `FINALIZADA_PARCIAL` — cerrada antes de meta (cierre manual del admin)

Más una **fase de mantenimiento paralela**:
- `MANTENIMIENTO_ACTIVO` — primeros 3 años post-cierre
- `MONITOREO_HISTORICO` — 3+ años post-cierre

## Cambios concretos

### 1. Reducir el set de estados
- Eliminar: `PENDIENTE`, `EN_CONFIGURACION`, `CONFIGURADA`, `PAUSADA`, `CANCELADA`.
- Mantener: `BORRADOR`, `ACTIVA`, `COMPLETADA`.
- Agregar: `FINALIZADA_PARCIAL`.
- Colapsar todos los actuales sub-borradores en un solo `BORRADOR`.

### 2. Agregar campo `faseMantenimiento` independiente
- Tipo: `null | 'MANTENIMIENTO_ACTIVO' | 'MONITOREO_HISTORICO'`.
- `null` mientras está BORRADOR o ACTIVA.
- Calculado a partir de `fechaCierre` + 3 años.

### 3. Reescribir transiciones
```
BORRADOR  → ACTIVA            (al activar wizard)
ACTIVA    → COMPLETADA         (automático al llegar a meta)
ACTIVA    → FINALIZADA_PARCIAL (manual admin, con motivo)
COMPLETADA / FINALIZADA_PARCIAL → (no transiciones, append-only)
```

### 4. Estilos de badges
- `BORRADOR`: gris/neutral.
- `ACTIVA`: verde brillante.
- `COMPLETADA`: azul (badge "META ALCANZADA").
- `FINALIZADA_PARCIAL`: ámbar (badge "CERRADA PARCIALMENTE").
- `MANTENIMIENTO_ACTIVO`: azul con contador "X meses restantes".
- `MONITOREO_HISTORICO`: gris.

## Archivos afectados

- `admin/AdminData.jsx` — modelo + datos mock.
- `admin/AdminShell.jsx` — `ESTADOS_META`, `StateBadge`.
- `admin/DashboardScreen.jsx` — `EstadosBreakdown`, filtros.
- `admin/DetalleCampanaScreen.jsx` — filtros y badges.
- `admin/DetalleSubcampanaScreen.jsx` — header y acciones.
- `admin/CrearCampanaScreen.jsx` — wizard cierra en BORRADOR o ACTIVA.

## Dependencias / orden

- Hacer **antes** que cualquier tarea de Bloque B/C.
- No depende de nada previo.

## Notas

- En `CAMPANAS_ESTADOS` del dashboard cambiar 5 categorías → 4 (BORRADOR/ACTIVA/COMPLETADA/FINALIZADA_PARCIAL) y agregar el donut/breakdown de fase de mantenimiento por separado, o como segundo donut.
- La campaña paraguas no tiene estado propio: su estado derivado se calcula desde las subcampañas (sección 3.2 de la guía).
