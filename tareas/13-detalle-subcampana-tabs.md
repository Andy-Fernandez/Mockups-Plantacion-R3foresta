# 13 — Detalle de subcampaña: 6 tabs según guía

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](00-README.md).

**Prioridad:** Media
**Bloque:** C — Mejoras

## Estado actual

`admin/DetalleSubcampanaScreen.jsx` existe pero no se verificó contenido completo. Probablemente le faltan tabs o tiene tabs distintos a los de la guía.

## Lo que dice la guía

> Sección 3.7: "Detalle de subcampaña (admin/coordinador)"

**Header:**
- Estado operativo + fase de mantenimiento (badges separados).
- Acciones según estado:
  - `ACTIVA`: "Marcar como FINALIZADA_PARCIAL" (solo admin, con confirmación + motivo) — ver tarea 09.
  - `COMPLETADA` / `FINALIZADA_PARCIAL`: "Asignar más lotes para reposición".

**6 tabs:**

1. **Resumen** — progreso, mapa con pines, métricas clave, fechas (incluyendo `fecha_fin_mantenimiento`).
2. **Plantaciones** — listado con filtros (operario, fecha, especie, lote). Cada fila expandible con fotos, GPS, cantidades por especie y lote origen.
3. **Asignaciones** — tabla con propósito, cantidad asignada/consumida/devuelta/disponible. Botones "Asignar más", "Devolver al vivero".
4. **Mortandad y reposiciones** — registros con % supervivencia y semáforo (verde >85%, ámbar 70-85%, rojo <70%).
5. **Equipo** — coordinador + operarios con aportes individuales. Botones "Agregar operario" / "Remover" (con confirmación).
6. **Historial** — timeline append-only completo.

## Cambios concretos

### 1. Auditar pantalla actual
Revisar qué tabs ya existen y cuáles faltan. Probablemente faltan: Asignaciones, Mortandad y reposiciones.

### 2. Estructura de tabs
Reusar el patrón de tabs ya existente. En mobile probablemente con scroll horizontal.

### 3. Tab "Plantaciones"
- Lista filtrable.
- Cada row colapsada muestra: fecha, operario (avatar+nombre), cantidad total, foto miniatura.
- Expandible muestra: GPS, breakdown por especie, lote origen, observaciones.

### 4. Tab "Asignaciones"
- Tabla con badges de propósito (ver tarea 05).
- Acciones inline: "Asignar más", "Devolver".

### 5. Tab "Mortandad y reposiciones"
- Dos sub-secciones: Mortandades reportadas / Reposiciones registradas.
- Cada registro con badge de causa y semáforo de supervivencia del grupo.

### 6. Tab "Equipo"
- Coordinador destacado arriba.
- Lista de operarios con conteo de plantaciones aportadas.
- Botón "Agregar operario" → modal de selección desde catálogo PERSONAS.
- "Remover" con confirmación.

### 7. Tab "Historial" (timeline append-only)
- Reusar `historial/HistorialEvents.jsx` o crear `TimelineSubcampana` similar.
- Eventos: PLANTACION, MORTANDAD, REPOSICION, ASIGNACION, DEVOLUCION, ACTIVACION, FINALIZACION_PARCIAL.

## Archivos afectados

- `admin/DetalleSubcampanaScreen.jsx` — refactor principal.
- `admin/AdminData.jsx` — datasets de eventos, plantaciones, asignaciones, mortandades.
- Posible nuevo: `admin/TimelineSubcampana.jsx`.

## Dependencias / orden

- Depende de 01, 02, 05, 09.
- Puede ir en paralelo con 12.

## Notas

- El header debe mostrar ambos badges (estado + fase de mantenimiento) cuando aplique. No mezclar.
- Las acciones de "Marcar finalizada parcial" solo aparecen si `estado === 'ACTIVA'`.
