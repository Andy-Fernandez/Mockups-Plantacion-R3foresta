# 07 — Detalle público de subcampaña y de campaña

> **Mockup hi-fi con énfasis funcional.** Datos hardcodeados pero estructurados como el modelo real. Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta (drill-down esencial del mapa público)
**Bloque:** B — Pantallas nuevas
**Referencia funcional:** RF-PLA-14 (historial / cadena de custodia), RF-PLA-15 (vista pública), sec. 2.2 (estado derivado), sec. 2.14 (snapshots), sec. 11 procesos
**Rol:** Sin login.

## Estado actual

Tenemos `admin/DetalleCampanaScreen.jsx` y `admin/DetalleSubcampanaScreen.jsx`, pero son vistas **admin** (con acciones, edición, tabs operativas).

No existe vista **pública** (sin login, narrativa, transparente).

## Lo que dice la guía

### Detalle público de campaña (sección 3.2)
- Header: nombre, descripción, logos de organizaciones, fechas estimadas.
- Estado derivado (`ACTIVA / EN_MANTENIMIENTO / MONITOREO_HISTORICO`).
- Listado de subcampañas con barras de progreso individuales.
- Totalizadores agregados.
- Mapa con todos los polígonos de subcampañas.

### Detalle público de subcampaña (sección 3.3)
- Header: nombre, tipo, zona, estado operativo, fase de mantenimiento, fechas, polígono.
- **Barra de progreso grande**: árboles plantados / meta, %.
- Si `MANTENIMIENTO_ACTIVO`: contador "X meses restantes".
- **Mini-barras de mix de especies** (real vs planificado).
- Mapa con pines de plantaciones.
- **Timeline visual** de eventos (plantaciones, reposiciones, mortandad).
- Galería de fotos.
- Métricas: árboles vivos actuales, mortandad acumulada, reposiciones realizadas, captura estimada CO₂.
- **Trazabilidad**: link a "ver origen de estos árboles" → Vivero → Recolección.
- Equipo: coordinador + operarios con aportes.

## Cambios concretos

### 1. Dos pantallas nuevas en `publico/`
- `DetalleCampanaPublicaScreen.jsx`
- `DetalleSubcampanaPublicaScreen.jsx`

### 2. Archivos HTML
- `Detalle publico campana.html`
- `Detalle publico subcampana.html`

### 3. Estado derivado de campaña (sec. 2.2)
La cabecera del detalle de campaña muestra el estado **calculado** desde sus sub-campañas (`ACTIVA / EN_MANTENIMIENTO / MONITOREO_HISTORICO`). Ya está implementado en `admin/AdminData.jsx :: deriveCampanaEstado()`. Reusar.

### 4. Mix de especies real (sec. 2.12)
El detalle de sub-campaña muestra la **composición real plantada** (suma por especie desde `REGISTRO_PLANTACION_DETALLE` mock). **NO** hay barra de "% planificado" — el control de mix con topes está fuera del MVP (decisión 2026-05-24). Mostrar especies con cantidades + % calculado sobre el total plantado.

### 5. Snapshots oficiales (sec. 2.14)
Mostrar nombres congelados (no recalcular desde catálogos vivos):
- `nombre_zona_snapshot`
- `nombre_coordinador_snapshot`
- `nombres_organizaciones_snapshot[]`
- Por especie plantada: snapshots heredados del lote (científico, comercial, variedad).

### 6. Componentes reutilizables (en `publico/PublicoShell.jsx`)
- `TimelineEventos` — lista vertical **append-only**. Tipos de evento: `PLANTACION_INICIAL`, `REPOSICION`, `MORTANDAD_REPORTADA`, `ASIGNACION_VIVERO`, `DEVOLUCION_A_VIVERO`, `SUBCAMPANIA_ACTIVADA`, `SUBCAMPANIA_COMPLETADA`, `SUBCAMPANIA_FINALIZADA_PARCIAL`, `TRANSICION_A_MONITOREO_HISTORICO`.
- `ContadorMantenimiento` — "X meses restantes" en `MANTENIMIENTO_ACTIVO`. Calcular de `fecha_fin_mantenimiento` mock.
- `TrazabilidadCard` — links placeholder a Vivero (M2 lote) y Recolección (M1).
- `GaleriaFotos` — grilla de fotos clickable.
- `MiniBarrasEspecies` — solo composición **real** (no planificada).

### 7. Métricas mostradas en detalle sub-campaña
- Árboles vivos hoy = plantados + reposiciones − mortandad acumulada (calcular y hardcodear).
- Mortandad acumulada.
- Reposiciones realizadas (diferenciar visualmente las hechas en MANTENIMIENTO_ACTIVO vs MONITOREO_HISTORICO).
- Captura **estimada** de CO₂ (proyección, ver tarea 16).
- % supervivencia con semáforo (verde >85%, ámbar 70-85%, rojo <70%).

### 8. Drill-down (RF-PLA-14)
- Desde detalle subcampaña → link al lote de vivero específico (M2, placeholder).
- Desde detalle subcampaña → link a recolección origen (M1, placeholder).
- Desde detalle campaña → cada sub-campaña navegable.

### 9. Sin acciones de admin/operario
- No mostrar botones de "Marcar finalizada parcial", "Asignar lotes", "Registrar plantación", etc.
- Lectura pura. Solo navegación entre vistas públicas y drill-down a M1/M2.

### 10. Tono visual
- Más espaciado que las vistas admin, menos densidad.
- Narrativa honesta: "X árboles vivos hoy", "captura proyectada".
- No exagerar el lenguaje "en tiempo real" — todo es proyección (ver tarea 16).

## Archivos afectados / nuevos

- **Nuevo**: `Detalle publico campana.html`, `Detalle publico subcampana.html`.
- **Nuevo**: `publico/DetalleCampanaPublicaScreen.jsx`, `DetalleSubcampanaPublicaScreen.jsx`.
- **Nuevo o extender**: `publico/PublicoShell.jsx` con atomos compartidos.
- Reusar `MapaPublico` (tarea 06).

## Dependencias / orden

- Depende de 06 (estructura `publico/`, mapa base).
- Depende de 01–05 (modelo completo, ya hecho).
- Beneficia de 08 (mortandad/reposición) y 09 (finalizar parcial) para tener eventos del timeline.

## Notas

- La trazabilidad apunta a un módulo de Vivero que vive fuera de este repo (módulo 2). En el mock, el link puede ser placeholder.
- El timeline aquí es **vista de lectura append-only** (igual a `Historial del lote` pero a nivel subcampaña). Componente reutilizable de tarea 15.
- Las reposiciones se diferencian visualmente:
  - En `MANTENIMIENTO_ACTIVO`: badge "REPOSICIÓN" en naranja.
  - En `MONITOREO_HISTORICO`: badge "REPOSICIÓN HISTÓRICA" en gris.
- Badge "verificable en blockchain" en los eventos anclables (mismo set que en tarea 06).
