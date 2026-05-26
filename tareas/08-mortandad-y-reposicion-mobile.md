# 08 — Reportar mortandad y registrar reposición (mobile, operario)

> **Mockup hi-fi con énfasis funcional.** Estos flows tienen reglas estrictas (pre-confirmación bloqueante, append-only, foto+GPS obligatorios). El mock debe mostrar todas. Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta (faltan dos flows operativos críticos)
**Bloque:** B — Pantallas nuevas
**Referencia funcional:** RF-PLA-09 (mortandad), RF-PLA-10 (reposición), RF-PLA-13 (evidencia + GPS), sec. 3.9 y 3.10 procesos
**Rol:** OPERARIO miembro del equipo, COORDINADOR de la sub-campaña, o ADMIN. Mismo permiso para los tres.

## Estado actual

`plantacion/RegistrarPlantacionScreen.jsx` existe (flujo de plantación inicial). **No existen** los flows de mortandad ni reposición.

## Lo que dicen los docs

### Reportar mortandad (RF-PLA-09 + sec. 3.9 procesos)

Campos obligatorios:
- `registro_plantacion_id` (grupo afectado).
- `fecha_reporte` no futura, sin restricción retroactiva fuerte.
- `responsable_id` obligatorio (miembro del equipo, coordinador o admin).
- `cantidad_muerta_delta > 0` (delta desde el último reporte, no acumulado).
- `causa_mortandad` obligatoria del enum (ver abajo).
- Latitud/Longitud obligatorias (6 decimales).
- Foto **mínimo 1**.

Validaciones funcionales:
- `cantidad_muerta_acumulada + delta <= plantado_inicial + reposiciones_acumuladas` del grupo.
- GPS dentro del polígono de la sub-campaña con tolerancia (default 50m). Fuera de tolerancia → bloqueado.
- Permitido en estados: `ACTIVA`, `COMPLETADA`, `FINALIZADA_PARCIAL`.
- Permitido en fase: `MANTENIMIENTO_ACTIVO` y `MONITOREO_HISTORICO`.

UX obligatoria:
- Mostrar al usuario el **histórico del grupo** antes de confirmar (plantado_inicial, muertos previos, vivos estimados) para evitar doble conteo.
- Append-only: no se permite editar ni borrar mortandad reportada.

### Registrar reposición (RF-PLA-10 + sec. 3.10 procesos)

Campos obligatorios:
- `registro_plantacion_origen_id` (grupo que se repone).
- `subcampania_id` heredado del grupo origen.
- `responsable_id` obligatorio (miembro de `SUBCAMPANIA_EQUIPO`).
- `co_responsables_ids` opcional (subconjunto del equipo).
- `fecha_reposicion` no futura, hasta 10 días retroactivo.
- Lat/Lng obligatorios.
- Foto mínimo 1.
- Lista de especies con cantidad y `lote_vivero_origen` por especie.
- `es_reposicion = true`.

Validaciones funcionales:
- El grupo origen **debe tener mortandad reportada previamente** (sino no se permite reposición).
- `cantidad_total_repuesta <= cantidad_muerta_acumulada - cantidad_repuesta_acumulada` del grupo.
- Lotes seleccionables: **solo asignaciones con `proposito === 'REPOSICION'`** activas en la sub-campaña (filtro habilitado tras tarea 05).
- GPS dentro del polígono con tolerancia (igual que plantación).
- Permitido en estados: `ACTIVA`, `COMPLETADA`, `FINALIZADA_PARCIAL`.
- Permitido en fase: `MANTENIMIENTO_ACTIVO` y `MONITOREO_HISTORICO`.

**Especie libre** (RN-VIV-60): no se exige que la especie repuesta coincida con la del grupo origen. El grupo puede quedar con composición mixta.

**UX pre-confirmación obligatoria (bloqueante, no advertencia)**: antes de confirmar el sistema muestra:
- `cantidad_plantada_inicial`
- `cantidad_muerta_acumulada`
- `cantidad_repuesta_acumulada`
- `cantidad_pendiente_reposicion = muerta - repuesta`

Si la cantidad ingresada **excede** `cantidad_pendiente_reposicion`, el sistema **bloquea** el registro (no es advertencia opcional, es un gate hard).

Las reposiciones **NO avanzan la meta** de la sub-campaña, solo el saldo vivo del grupo origen.

Diferenciación visual:
- Reposiciones en `MANTENIMIENTO_ACTIVO`: badge naranja prominente "REPOSICIÓN".
- Reposiciones en `MONITOREO_HISTORICO`: badge gris "REPOSICIÓN HISTÓRICA".

## Catálogos exactos de los docs

### `causa_mortandad_plantacion` (RF-PLA-09)
16 valores cerrados — usar **exactamente estos**:
```
SEQUIA · EXCESO_AGUA · HELADA · GRANIZO · PLAGA · ENFERMEDAD ·
SUELO_INADECUADO · FALTA_MANTENIMIENTO · DANO_MECANICO · PASTOREO ·
VANDALISMO · INCENDIO · COMPETENCIA_MALEZA · TRASPLANTE_DEFICIENTE ·
DESCONOCIDA · OTRO
```
Con `OTRO` se acompaña de texto libre en observaciones.

## Cambios concretos

### 1. Dos nuevos archivos HTML
- `Reportar mortandad.html`
- `Registrar reposicion.html`

### 2. Dos nuevos screen modules
- `plantacion/ReportarMortandadScreen.jsx`
- `plantacion/RegistrarReposicionScreen.jsx`

### 3. Reusar arquitectura de pasos
Seguir el patrón de `plantacion/PlantacionSteps.jsx`:
- `useState` para `step`, navegación back/next.
- Header con stepper, footer con CTA principal.

### 4. Modelo: agregar registros mock
En `plantacion/PlantacionData.jsx` (o `admin/AdminData.jsx`):
- `REGISTROS_PLANTACION` — grupos plantados (referencia: `registro_plantacion_id`).
- `MORTANDADES` mock con todos los campos del enum, distintas causas para mostrar variedad.
- `REPOSICIONES` mock vinculadas a grupos con mortandad previa, con lotes propósito-REPOSICION del modelo.
- Reusar `CAUSAS_MORTANDAD_PLANTACION` como const exportada con los 16 valores exactos.

### 5. Cálculos a hardcodear (no en vivo)
- "Vivos estimados" del grupo = `plantado_inicial + reposiciones_acumuladas - mortandad_acumulada`.
- "Reponible" = `mortandad_acumulada - reposiciones_acumuladas`.

### 6. Pasos de "Reportar mortandad"
1. Selector de sub-campaña (preseleccionada si viene desde la tarjeta).
2. Selector del grupo de plantación (lista con foto, fecha, GPS, cantidad).
3. **Histórico del grupo** (visible antes de input, para evitar doble conteo):
   - Plantados al inicio: N
   - Reposiciones acumuladas: M
   - Mortandad acumulada previa: K
   - Vivos estimados: N + M − K
4. Captura de foto (mínimo 1) + GPS automático con indicador.
5. Input "¿Cuántos más murieron?" (delta).
6. Selector de causa (catálogo enum).
7. Observación opcional.
8. Confirmar.

### 7. Pasos de "Registrar reposición"
1. Selector de sub-campaña.
2. Selector del **grupo origen** — filtrado a grupos con mortandad reportada.
3. **Pre-confirmación de cantidades (bloqueante)**:
   - `plantado_inicial`, `muerta_acumulada`, `repuesta_acumulada`, `pendiente_reposicion = muerta − repuesta`.
4. Captura de foto (mínimo 1) + GPS.
5. Selección de especies con cantidades.
6. Para cada especie: **selector de lote** filtrado por `proposito === 'REPOSICION'` activo en esta sub-campaña.
   - Si solo hay 1 lote → preselección.
   - Si hay N → cantidad por lote.
7. Co-responsables (subset del equipo).
8. Confirmar — bloquea si `total > pendiente_reposicion`.

Visual: badge "REPOSICIÓN" naranja prominente en header y en el evento resultante.

### 8. Accesos rápidos en Home del operario
Agregar en `ui_kits/pwa/index.html` o `plantacion/`: "Reportar mortandad" + "Registrar reposición".

## Archivos afectados / nuevos

- **Nuevo**: `Reportar mortandad.html`, `Registrar reposicion.html`.
- **Nuevo**: `plantacion/ReportarMortandadScreen.jsx`, `RegistrarReposicionScreen.jsx`.
- Extender `plantacion/PlantacionData.jsx` con `REGISTROS_PLANTACION`, `MORTANDADES`, `REPOSICIONES`, `CAUSAS_MORTANDAD_PLANTACION`.
- Considerar mover los catálogos a `admin/AdminData.jsx` si se reusan en Detalle subcampaña (tab Mortandad/Reposiciones, tarea 13).

## Dependencias / orden

- Depende de **05 ✅** (propósito en asignaciones — filtrar lotes por `REPOSICION`).
- Beneficia a 07 (timeline público) y 13 (tab Mortandad/Reposiciones).

## Notas

- "Grupo de plantación" = `REGISTRO_PLANTACION`. Cada plantación inicial es un grupo único referenciable por id.
- Semáforo de supervivencia (verde >85%, ámbar 70-85%, rojo <70%) al mostrar grupos previos.
- **No** mostrar opciones de "editar mortandad" o "corregir delta": eventos append-only en MVP.
- **No** simular animación "Registrando en blockchain ⛓️" como bloqueante — el anclaje es complementario (RF-PLA-16) y no bloquea el registro. Si se quiere mostrar, que sea un badge post-confirmación.
