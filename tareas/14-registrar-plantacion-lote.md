# 14 — Registrar plantación: selector de lote por especie

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta (es el flow más crítico operativamente según la guía)
**Bloque:** C — Mejoras

## Estado actual

`plantacion/RegistrarPlantacionScreen.jsx` + `PlantacionSteps.jsx` + `PlantacionStepsB.jsx` implementan el flow. No verificado si tiene selector de lote por especie según la guía.

## Lo que dice la guía

> Sección 3.8.2 — "Registrar plantación (flujo principal)"

**6 pasos:**

### Paso 1 — Selección de subcampaña
- Si entró desde la tarjeta, preseleccionada.

### Paso 2 — Captura de fotos + GPS
- Botón gigante para tomar foto.
- Permite varias fotos.
- GPS automático con indicador "GPS capturado ✓" o "Activando GPS...".

### Paso 3 — Especies, cantidades y selección de lote
- Lista de especies disponibles para la subcampaña (basadas en el mix planificado).
- Para cada especie:
  - Input de cantidad con +/-.
  - **Selector de lote de origen** (entre los asignados con `PLANTACION_INICIAL` a esta subcampaña).
  - Si solo hay un lote disponible, se preselecciona.
  - Si hay varios, el operario indica cantidad por lote.
- Validación visual: stock disponible por lote.
- Si la especie excede su % máximo: advertencia visible pero permite continuar.

### Paso 4 — Co-responsables (opcional)
- "¿Plantaste con alguien más?"
- Selector múltiple del equipo.

### Paso 5 — Observaciones (opcional)

### Paso 6 — Confirmar
- Resumen: subcampaña, cantidad total, especies, lotes, ubicación en mini-mapa, fotos.
- Botón "Registrar plantación".

> Sección 6: "Selector de lote optimizado: si hay un solo lote disponible, preseleccionarlo."

## Cambios concretos

### 1. Auditar pasos actuales
Verificar que estén los 6 pasos. Si no, completar.

### 2. Paso 3 — selector de lote por especie
- Para cada especie del mix:
  - Mostrar lotes asignados a esa subcampaña con `proposito === 'PLANTACION_INICIAL'` y stock vivo de esa especie.
  - Si hay 1 lote → preseleccionado, mostrar como info ("Lote VIV-000123 · 240 disponibles").
  - Si hay N lotes → split de cantidad por lote.

### 3. Validaciones visuales
- Stock disponible por lote visible en línea.
- Si la suma de "cantidad" por lote no coincide con el total ingresado → error visible.
- Mix planificado: barra horizontal mostrando "estás plantando 40% Jacarandá (máx 35%)" — advertencia pero permite.

### 4. Resumen en Paso 6
- Mini-mapa con el pin GPS capturado.
- Lista compacta: "120 árboles · 3 especies · 2 lotes origen".
- Botón grande "Registrar plantación".

### 5. Estado intermedio "Guardando..."
- Después de confirmar, mostrar spinner + texto "Registrando en blockchain... ⛓️" (estético, en línea con la guía de transparencia).
- Luego "Plantación registrada ✓".

## Archivos afectados

- `plantacion/RegistrarPlantacionScreen.jsx` — flow principal.
- `plantacion/PlantacionSteps.jsx` / `PlantacionStepsB.jsx` — pasos individuales.
- `plantacion/PlantacionData.jsx` — agregar lotes asignados con propósito.

## Dependencias / orden

- Depende de 05 (propósito en asignaciones).
- Independiente del resto del Bloque C.

## Notas

- Mantener el "tono operativa": botones grandes, alto contraste, mínimas decoraciones.
- La selección de lote es **conceptualmente nueva** en el módulo — antes solo se elegían especies y cantidades.
- Considerar agregar feedback háptico (en JS: `navigator.vibrate(50)`) al confirmar — bueno para uso exterior.
