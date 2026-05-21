# 11 — Wizard "Crear / editar subcampaña"

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta
**Bloque:** C — Mejoras

## Estado actual

No hay un wizard dedicado de subcampaña — está mezclado dentro de `CrearCampanaScreen.jsx`. La subcampaña queda como un sub-form anidado.

## Lo que dice la guía

> Sección 3.6: "Crear / editar subcampaña (admin)"

**Wizard de 6 pasos**:

### Paso 1 — Datos generales
- Campaña padre (preseleccionada si viene de tarea 10).
- Nombre.
- Tipo (REFORESTACION / ARBORIZACION / FORESTACION) — ver tarea 04.
- Zona/comunidad (selector jerárquico del catálogo).
- Coordinador asignado (**obligatorio**).
- Fechas estimadas (solo futuras).

### Paso 2 — Polígono
- Mapa para dibujar polígono (obligatorio para activar).
- Vista previa con área calculada en hectáreas.
- **NO hay input manual de área** — siempre calculada del polígono.

### Paso 3 — Meta y especies
- Meta total de árboles.
- Mix de especies: agregar especies del catálogo, asignar % máximo a cada una.
- Validación visual: suma de % no debe pasar 100%.

### Paso 4 — Equipo (opcional al crear)
- Selector múltiple de operarios.

### Paso 5 — Asignación inicial de lotes (opcional al crear)
- Listado de lotes con stock vivo.
- Para cada lote: cantidad absoluta + **propósito** (default `PLANTACION_INICIAL`, ver tarea 05).
- Mostrar % equivalente del lote ("estás asignando el 37,5% del lote").
- Barra de total asignado vs meta.

### Paso 6 — Revisión y activación
- Resumen completo.
- Si stock asignado < meta: advertencia clara pero permite activar.
- Botones: "Guardar como borrador" / "Activar subcampaña".

## Cambios concretos

### 1. Nuevo módulo dedicado
- `admin/CrearSubcampanaScreen.jsx` (separar del flow de campaña).
- `Crear subcampana.html` como entry point.

### 2. Componente de mapa para dibujar polígono
- SVG estilizado en grilla.
- "Click para agregar vértice" — array de puntos.
- Cálculo de área aproximado por algoritmo del polígono (Shoelace).
- Conversión a hectáreas con escala mock.

### 3. Mix de especies
- Especies del catálogo (Jacarandá, Molle, Ceibo, Queñua, Kewiña, Aliso — sección 7 guía).
- Cada especie con slider de % máximo.
- Barra visual que muestra suma actual; rojo si pasa 100%.

### 4. Selector de lotes en Paso 5
- Lista filtrada por especies compatibles con el mix.
- Cada lote muestra stock vivo, especie, vivero origen.
- Input numérico con +/-.
- Toggle de propósito (default PLANTACION_INICIAL para nuevo, REPOSICION solo si subcampaña ya está cerrada).

### 5. Validación de activación
Para `ACTIVA`:
- Polígono dibujado.
- Meta > 0.
- Coordinador asignado.
- Fechas estimadas.

Para `BORRADOR`:
- Solo nombre + campaña padre.

## Archivos afectados / nuevos

- **Nuevo**: `Crear subcampana.html`, `admin/CrearSubcampanaScreen.jsx`.
- `admin/CrearCampanaScreen.jsx` — quitar lógica de subcampaña.
- `admin/AdminData.jsx` — catálogo de especies, zonas.

## Dependencias / orden

- Depende de 01, 02, 03, 04, 05.
- Encadenado desde 10.

## Notas

- "Editar subcampaña" usa el mismo wizard pero pre-rellenado y limitado por estado actual (no se puede cambiar polígono después de ACTIVA).
- La validación de Paso 2 (polígono obligatorio) solo aplica al intentar pasar a `ACTIVA`, no a `BORRADOR`.
