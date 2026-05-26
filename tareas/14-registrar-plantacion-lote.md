# 14 — Registrar plantación: selector de lote por especie + gates funcionales

> **Mockup hi-fi con énfasis funcional.** Flow más crítico operativamente. Reglas estrictas: foto+GPS obligatorios, GPS dentro del polígono, append-only, selección explícita de lote con propósito. Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta
**Bloque:** C — Mejoras
**Referencia funcional:** RF-PLA-06 (plantación inicial), RF-PLA-13 (evidencia + GPS), sec. 3.6, 2.8 procesos.
**Rol:** OPERARIO miembro del equipo, COORDINADOR de la sub-campaña, o ADMIN.

## Estado actual

`plantacion/RegistrarPlantacionScreen.jsx` + `PlantacionSteps.jsx` + `PlantacionStepsB.jsx` implementan el flow con 6 pasos (StepCampana / FotoGps / Especies / Equipo / Observaciones / Confirmar). **No tiene** selector de lote por especie ni filtro por propósito.

## Lo que dicen los docs

> RF-PLA-06 + RF-PLA-13 + sec. 3.6, 2.8, 2.16, 9.2 procesos

**Gates funcionales (bloqueantes):**
- La sub-campaña destino debe estar **`ACTIVA`** (no permitido en BORRADOR, COMPLETADA, FINALIZADA_PARCIAL).
- `responsable_id` debe ser miembro de `SUBCAMPANIA_EQUIPO` (sea COORDINADOR u OPERARIO).
- `co_responsables_ids` deben ser subconjunto del equipo.
- `fecha_plantacion` no futura, hasta **10 días retroactivo**.
- Latitud/Longitud obligatorias (6 decimales).
- **GPS dentro del polígono** de la sub-campaña con tolerancia configurable (default 50m).
  - Fuera del polígono pero dentro de tolerancia → permitido **con advertencia visual**.
  - Fuera de tolerancia → **bloqueado**.
- Foto mínimo 1.
- Para cada especie: cantidad > 0 y `lote_vivero_origen` seleccionado.
- Cada lote seleccionado debe tener **asignación ACTIVA con propósito `PLANTACION_INICIAL`** a esta sub-campaña.
- Cantidad por lote ≤ `saldo_asignado_disponible` de esa asignación.

**Efectos colaterales (al confirmar, mock):**
- Crear `REGISTRO_PLANTACION` append-only con snapshots oficiales (subcampania, zona, responsable, especies por lote).
- Por cada lote afectado: generar atómicamente un `DESPACHO` en `EVENTO_LOTE_VIVERO` (sec. 9.2) — en el mock, solo agregar al historial mock.
- Si suma total ≥ meta_total → disparar cierre automático a `COMPLETADA` (sec. 3.7).

**Append-only**: NO se permite editar ni borrar registros en MVP.

## Pasos del flow objetivo

### Paso 1 — Selección de sub-campaña
- Lista filtrada a sub-campañas donde el usuario es miembro del equipo y estado === ACTIVA.
- Si entró desde la tarjeta, preseleccionada.
- Si no hay sub-campañas elegibles, copy explicativo: "No estás asignado a ninguna sub-campaña activa".

### Paso 2 — Captura de fotos + GPS
- Botón grande para tomar foto.
- Permite varias fotos.
- GPS automático con tres estados visuales:
  - "Activando GPS..."
  - "GPS capturado ✓ — dentro del polígono"
  - "⚠ GPS dentro de tolerancia (a 35m del polígono)" (advertencia, permite continuar)
  - "✗ GPS fuera del área permitida (bloqueado)"
- Mini-mapa con pin + polígono dibujado.

### Paso 3 — Especies, cantidades y **selección de lote por especie**
- Lista de especies disponibles (las que tienen asignaciones con propósito `PLANTACION_INICIAL` activas en esta sub-campaña).
- Por cada especie:
  - Input de cantidad con +/-.
  - **Selector de lote**: filtra `ASIGNACIONES_ADMIN` por `subcampanaId === sub.id && proposito === 'PLANTACION_INICIAL' && estado === 'ACTIVA' && cantidadDisponible > 0 && lote.especie === esta_especie`.
  - Si hay 1 lote → **preselección automática**, mostrar como info: "Lote VIV-000123 · 240 disponibles".
  - Si hay N lotes → operario indica cantidad por lote (split).
  - Stock disponible por lote visible en línea.
  - Si la cantidad por lote excede disponible → error inline + bloqueo de avance.

### Paso 4 — Co-responsables (opcional)
- "¿Plantaste con alguien más?"
- Selector múltiple del **equipo de esta sub-campaña** (no del catálogo global).

### Paso 5 — Observaciones (opcional)

### Paso 6 — Fecha de plantación
- Default: hoy.
- Validación: no futura, máximo 10 días en el pasado.
- Si en el rango inválido → mostrar el error inline.

### Paso 7 — Confirmar
- Resumen:
  - Sub-campaña + breadcrumb campaña.
  - Cantidad total + breakdown por especie y por lote.
  - GPS + estado de validación.
  - Fotos miniatura.
  - Co-responsables.
- Botón grande "Registrar plantación".
- **Bloqueado** si: foto falta, GPS fuera de tolerancia, alguna especie sin lote o cantidad > disponible, fecha fuera de rango.

> Si en el mock se quiere mostrar el cierre automático a COMPLETADA: agregar variante en el tweak donde la cantidad total cierra la sub-campaña, y el confirm muestra un toast "Meta alcanzada — sub-campaña COMPLETADA".

## Cambios concretos

### 1. Refactor del Paso 3
Eliminar el step actual que solo pide especies+cantidades. Reemplazar por selector de lote por especie según arriba.

### 2. Validaciones visuales (no funcionales reales, solo el aspecto)
- Stock disponible por lote visible en línea.
- Si la suma de cantidad por lote no coincide con el total ingresado → error visible.
- Sin barra de "mix planificado" porque el control de topes está fuera del MVP (sec. 2.12). Si se quiere mostrar la composición real acumulada de la sub-campaña, OK como info adicional.

### 3. Validación GPS contra polígono
Mostrar visualmente con el mini-mapa del Paso 2:
- Polígono dibujado.
- Pin GPS posicionado.
- Tres estados visuales según tweak: dentro / tolerancia / fuera.

### 4. Resumen en Paso 7
- Mini-mapa con el pin GPS.
- Lista compacta: "120 árboles · 3 especies · 2 lotes origen".
- Botón grande "Registrar plantación".

### 5. Estado post-confirmación
- Mostrar "Plantación registrada ✓" con badge "verificable en blockchain" (RF-PLA-16).
- **No** simular spinner bloqueante "Registrando en blockchain ⛓️" como obligatorio: el anclaje es complementario.

## Archivos afectados

- `plantacion/RegistrarPlantacionScreen.jsx` — flow principal.
- `plantacion/PlantacionSteps.jsx` / `PlantacionStepsB.jsx` — pasos individuales (refactor del paso de especies).
- `plantacion/PlantacionData.jsx` — agregar lotes asignados con propósito; importar `ASIGNACIONES_ADMIN` de `AdminData.jsx` o duplicar dataset si es necesario.

## Dependencias / orden

- Depende de **05 ✅** (propósito en asignaciones — filtros por `PLANTACION_INICIAL`).
- Independiente del resto del Bloque C.

## Notas

- Mantener el "tono operativo": botones grandes (≥48×48px), alto contraste, mínimas decoraciones.
- La selección de lote es **conceptualmente nueva** en el módulo — antes solo se elegían especies y cantidades.
- Feedback háptico (`navigator.vibrate(50)`) es nice-to-have, no requisito.
- El mock no necesita simular el `DESPACHO` automático en M2 — solo dejar nota en el doc de que al confirmar se generaría.
