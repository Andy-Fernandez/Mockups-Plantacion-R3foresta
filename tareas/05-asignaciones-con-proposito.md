# 05 — Asignaciones con propósito (PLANTACION_INICIAL / REPOSICION)

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta
**Bloque:** A — Modelo

## Estado actual

`admin/AsignarScreen.jsx` permite asignar equipo y lotes a una subcampaña, pero **no hay concepto de "propósito"** en el modelo. Una asignación es solo {lote, cantidad}.

No hay distinción entre lotes asignados para arrancar plantación vs lotes asignados para reposición de árboles muertos.

## Lo que dice la guía

> Sección 3.6 Paso 5, 3.7 tab Asignaciones, 3.8.2 Paso 3, 3.10

Toda asignación lote → subcampaña tiene **propósito**:
- `PLANTACION_INICIAL` (verde) — para arrancar la subcampaña.
- `REPOSICION` (naranja) — para reponer árboles muertos en subcampañas ya cerradas.

Regla clave: **`PLANTACION_INICIAL` no se permite en subcampañas COMPLETADA o FINALIZADA_PARCIAL**. Solo `REPOSICION`.

> Sección 3.8.2 Paso 3: al registrar plantación, el operario elige el lote desde los asignados con propósito `PLANTACION_INICIAL`.
> Sección 3.8.4: al registrar reposición, el operario elige lote desde los asignados con propósito `REPOSICION`.

## Cambios concretos

### 1. Modelo: agregar `proposito` a cada asignación
```js
const ASIGNACIONES = [
  {
    id: 'asig-001',
    subcampanaId: 'sub-001',
    loteId: 'VIV-000123-REC-000045',
    proposito: 'PLANTACION_INICIAL',
    cantidadAsignada: 300,
    cantidadConsumida: 180,
    cantidadDevuelta: 0,
    cantidadDisponible: 120,
    fechaAsignacion: '...',
  },
  // ...
];
```

### 2. Badge de propósito
- `PLANTACION_INICIAL`: verde (bg-emerald-50, ring-emerald-100).
- `REPOSICION`: naranja (bg-orange-50, ring-orange-100).

### 3. Validación en flujo de asignación
- En `AsignarScreen` y wizard de subcampaña, exigir elegir propósito al asignar.
- Si subcampaña está `COMPLETADA` o `FINALIZADA_PARCIAL`, deshabilitar `PLANTACION_INICIAL` con tooltip explicativo.

### 4. Filtros en flujos del operario
- "Registrar plantación" filtra lotes con `proposito === 'PLANTACION_INICIAL'`.
- "Registrar reposición" filtra con `proposito === 'REPOSICION'`.

### 5. Tabla de asignaciones en Detalle de subcampaña
- Columnas: Lote, Especie principal, **Propósito**, Asignada, Consumida, Devuelta, Disponible.
- Botones: "Asignar más", "Devolver al vivero".

## Archivos afectados

- `admin/AdminData.jsx` — modelo nuevo `ASIGNACIONES`.
- `admin/AsignarScreen.jsx` — UI para elegir propósito.
- `admin/DetalleSubcampanaScreen.jsx` — tab Asignaciones.
- `plantacion/RegistrarPlantacionScreen.jsx` y `PlantacionSteps.jsx` — filtrar lotes por propósito.
- Nuevo: `plantacion/ReportarMortandadScreen.jsx` y `RegistrarReposicionScreen.jsx` (tarea 08).

## Dependencias / orden

- Depende de 01 (estados) y 02 (jerarquía).
- Bloqueante para 08 (mortandad/reposición) y 14 (mejorar registrar plantación).
