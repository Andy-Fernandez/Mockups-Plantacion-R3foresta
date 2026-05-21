# 07 — Detalle público de subcampaña y de campaña

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta (drill-down esencial del mapa público)
**Bloque:** B — Pantallas nuevas

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

### 3. Componentes reutilizables (probablemente en `publico/PublicoShell.jsx`)
- `MiniBarrasEspecies` — barras horizontales especie a especie con dos valores (real vs planificado).
- `TimelineEventos` — lista vertical append-only.
- `ContadorMantenimiento` — "X meses restantes".
- `TrazabilidadCard` — link out al origen.
- `GaleriaFotos` — grilla de fotos clickable.

### 4. Tono visual
- Más espaciado que las vistas admin.
- Menos densidad informativa.
- Más narrativa: "X árboles vivos hoy", "Capturando ~Y kg CO₂ / h".

### 5. Sin acciones de admin
- No mostrar botones de "Marcar finalizada parcial", "Asignar lotes", etc.
- Lectura pura + link a otras vistas públicas.

## Archivos afectados / nuevos

- **Nuevo**: `Detalle publico campana.html`, `Detalle publico subcampana.html`.
- **Nuevo**: `publico/DetalleCampanaPublicaScreen.jsx`, `DetalleSubcampanaPublicaScreen.jsx`.
- **Nuevo o extender**: `publico/PublicoShell.jsx` con atomos compartidos.
- Reusar `MapaPublico` (tarea 06).

## Dependencias / orden

- Depende de 06 (estructura `publico/`, mapa base).
- Depende de 01, 02 (modelo).

## Notas

- La trazabilidad apunta a un módulo de Vivero que vive fuera de este repo (módulo 2). En el mock, el link puede ser placeholder.
- El timeline aquí es **vista de lectura** (igual a `Historial del lote` pero a nivel subcampaña). Componente reutilizable de tarea 15.
