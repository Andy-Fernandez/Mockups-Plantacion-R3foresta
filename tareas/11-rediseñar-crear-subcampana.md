# 11 — Wizard "Crear / editar sub-campaña"

> **Mockup hi-fi con énfasis funcional.** La sub-campaña es la unidad operativa real; aquí viven polígono, meta, coordinador, equipo y asignaciones. Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta
**Bloque:** C — Mejoras
**Referencia funcional:** RF-PLA-02 (crear/planificar BORRADOR), RF-PLA-03 (activar), sec. 3.2, 3.3, 2.10 procesos
**Rol:** Solo **ADMIN** puede crear sub-campañas en MVP. ADMIN asigna el coordinador inicial al activar.

## Estado actual

No hay un wizard dedicado de subcampaña — está mezclado dentro de `CrearCampanaScreen.jsx`. La subcampaña queda como un sub-form anidado.

## Lo que dicen los docs

> RF-PLA-02 + RF-PLA-03 + sec. 3.2, 3.3, 2.10, 2.13 procesos

La sub-campaña se crea siempre en `BORRADOR` y se activa después con un gate de validaciones:

**Campos del modelo:**
- `campania_id` obligatorio (campaña padre).
- `nombre` obligatorio.
- `tipo` obligatorio: `REFORESTACION / ARBORIZACION / FORESTACION`.
- `zona_id` del catálogo administrativo obligatoria.
- `coordinador` obligatorio **al activar** (membresía en `SUBCAMPANIA_EQUIPO` con `rol_en_subcampania = 'COORDINADOR'`). El usuario debe tener rol global `GENERAL`, `ADMIN` o `VALIDADOR`.
- `equipo` (operarios, miembros con `rol_en_subcampania = 'OPERARIO'`) opcional al crear, ampliable después en tarea 13.
- `poligono` (GeoJSON) obligatorio **al activar**.
- `hectareas` derivado del polígono — **no editable manualmente**.
- `meta` > 0.
- `fechas_estimadas` (inicio/fin) opcionales, solo futuras al crear.

**Estados:**
- En `BORRADOR`: edición libre, soft delete permitido, **NO acepta asignaciones ni plantaciones**.
- Transición `BORRADOR → ACTIVA` requiere todas las validaciones de activación.

**⚠️ Mix de especies con topes porcentuales: FUERA DEL MVP** (sec. 2.12 docs, decisión 2026-05-24).
No se planifica el mix. La composición real se registra al plantar en `REGISTRO_PLANTACION_DETALLE`. Si quieren un paso de "especies de interés" puede ser un selector multi sin %, solo informativo.

## Wizard objetivo

### Paso 1 — Datos generales
- Campaña padre (preseleccionada si viene de tarea 10).
- Nombre.
- Tipo (`REFORESTACION / ARBORIZACION / FORESTACION`).
- Zona/comunidad (selector del catálogo administrativo).
- Coordinador asignado (obligatorio al activar; opcional para guardar como BORRADOR).
- Fechas estimadas (opcionales, solo futuras).

### Paso 2 — Polígono y área
- Componente de mapa SVG para dibujar polígono (vértices por click).
- Área calculada **automáticamente** desde el polígono — no se ingresa manualmente.
- Obligatorio para activar, opcional para guardar como BORRADOR.

### Paso 3 — Meta
- Meta total de árboles (> 0).
- **Sin mix de especies con topes** (fuera de MVP).
- Opcionalmente: lista informativa de "especies que se prevén plantar" (selector multi sin porcentajes), solo para narrativa.

### Paso 4 — Equipo (opcional al crear)
- Selector múltiple de operarios. Materializa filas en `SUBCAMPANIA_EQUIPO` con `rol_en_subcampania = 'OPERARIO'`.
- Restricción: usuario `VOLUNTARIO` no se puede agregar al equipo (no aparece en el selector).

### Paso 5 — Asignación inicial de lotes (opcional al crear)
- Listado de lotes con saldo vivo disponible.
- Para cada lote: cantidad absoluta + **propósito** (default `PLANTACION_INICIAL`; ver tarea 05 ✅).
- Mostrar % equivalente del lote como **ayuda visual** ("estás asignando el 37,5% del lote") — NO se persiste.
- Barra de total asignado vs meta.
- **Activación con stock parcial permitida** (RF-PLA-03 + sec. 2.13): si total asignado < meta, se permite activar pero el sistema muestra advertencia visual clara con el % de cobertura. NO bloquea.

### Paso 6 — Revisión y activación
- Resumen completo.
- Si stock asignado < meta: advertencia visible "Solo el X% de la meta tiene stock asignado. Puedes activar igual y asignar más después" — no bloquea.
- Validación gate de activación (RF-PLA-03):
  - Polígono presente ✓
  - Coordinador asignado ✓
  - Meta > 0 ✓
  - Zona válida ✓
- Botones:
  - **"Guardar como borrador"** — solo requiere campaña padre + nombre.
  - **"Activar sub-campaña"** — requiere el gate completo. Si falta algo, deshabilitado con tooltip listando lo faltante.
- Al activar: congelar snapshots oficiales (`nombre_zona_snapshot`, `nombre_coordinador_snapshot`, `nombres_organizaciones_snapshot`) en el modelo mock.

## Cambios concretos

### 1. Nuevo módulo dedicado
- `admin/CrearSubcampanaScreen.jsx`.
- `Crear subcampana.html` como entry point.

### 2. Componente de mapa para dibujar polígono
- SVG estilizado en grilla.
- "Click para agregar vértice" — array de puntos.
- Cálculo de área aproximado (Shoelace) y conversión a hectáreas con escala mock.
- Sin Leaflet ni geocoding real.

### 3. Selector de lotes en Paso 5
- Lista de lotes con stock vivo.
- Input numérico con +/-.
- Toggle de propósito reusando `PropositoBadge` y la lógica de `propositosPermitidos()` ya en `AdminData.jsx`.
- Como esta sub-campaña aún está BORRADOR/no activada, **ambos propósitos permitidos al crear** (no se aplica el gate de cerrada).

### 4. Validación de activación
Implementar la función `puedeTransitionar()` ya existente en `AdminData.jsx` — el wizard solo debe llamarla y mostrar lo que devuelve.

### 5. Editar sub-campaña existente
- Mismo wizard pero pre-rellenado.
- Polígono editable solo en BORRADOR (post-ACTIVA queda congelado para preservar trazabilidad y snapshots).
- Coordinador editable vía flujo dedicado (tarea 13, cambio de coordinador).
- Equipo gestionable desde tab Equipo de Detalle (tarea 13).

## Archivos afectados / nuevos

- **Nuevo**: `Crear subcampana.html`, `admin/CrearSubcampanaScreen.jsx`.
- `admin/CrearCampanaScreen.jsx` — quitar lógica de subcampaña (tarea 10).
- `admin/AdminData.jsx` — agregar catálogo de zonas si no existe (usar `comunidad`/`municipio` actuales como base).

## Dependencias / orden

- Depende de 01–05 ✅.
- Encadenado desde 10.

## Notas

- La ventana de 3 años de mantenimiento es configurable a nivel sistema (mostrar como constante visible).
- La asignación de Paso 5 NO genera evento en M2 (sec. 9.1) — es solo una reserva lógica. Documentar en el resumen.
- Al activar, el sistema registra evento `SUBCAMPANIA_ACTIVADA` en `SUBCAMPANIA_HISTORIAL` — agregar al mock de historial.
