# 08 — Reportar mortandad y registrar reposición (mobile, operario)

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta (faltan dos flows operativos críticos)
**Bloque:** B — Pantallas nuevas

## Estado actual

`plantacion/RegistrarPlantacionScreen.jsx` existe (flujo de plantación inicial). **No existen** los flows de mortandad ni reposición.

## Lo que dice la guía

### Reportar mortandad (sección 3.8.3)
- Selector de subcampaña.
- Selector del **grupo de plantación** (lista de registros previos con foto, fecha, ubicación).
- Al seleccionar grupo: muestra histórico ("plantados: 50, muertos reportados previamente: 10, vivos estimados: 40").
- **Captura de foto + GPS obligatorios** (la guía es explícita).
- Input: "¿Cuántos más murieron?" (delta).
- Selector de causa.
- Observación opcional.
- Confirmar.

### Registrar reposición (sección 3.8.4)
- Selector de subcampaña.
- Selector del grupo origen (debe tener mortandad reportada).
- Muestra "puedes reponer hasta X árboles".
- Captura de foto + GPS.
- Selección de especies con cantidades.
- **Selección de lote** entre los asignados con propósito `REPOSICION`.
- Confirmar.
- Visual: badge "REPOSICIÓN" prominente.

## Cambios concretos

### 1. Dos nuevos archivos HTML
- `Reportar mortandad.html`
- `Registrar reposicion.html`

### 2. Dos nuevos screen modules
- `plantacion/ReportarMortandadScreen.jsx`
- `plantacion/RegistrarReposicionScreen.jsx`

### 3. Reusar arquitectura de pasos
Seguir el patrón de `plantacion/PlantacionSteps.jsx`:
- `useState` para `step`, validación entre pasos, navegación back/next.
- Header con stepper, footer con CTA principal.

### 4. Modelo: agregar registros mock
En `plantacion/PlantacionData.jsx` o `admin/AdminData.jsx`:
- `MORTANDADES`: { id, subcampanaId, grupoOrigenId, cantidadMuertos, causa, fecha, fotoUrl, gps, operarioId, observaciones }.
- `REPOSICIONES`: { id, subcampanaId, grupoOrigenId, especies[], lotesUsados[], fecha, fotoUrl, gps, operarioId }.
- `CAUSAS_MORTANDAD`: catálogo (sequía, plaga, vandalismo, helada, otro).

### 5. Lógica clave
- "Vivos estimados" = plantados - mortandad acumulada.
- "Reponible" = mortandad acumulada - reposiciones acumuladas.
- Filtrar lotes por `proposito === 'REPOSICION'` (depende de tarea 05).

### 6. UX según guía
- Badge "REPOSICIÓN" naranja prominente en la pantalla y en el evento resultante.
- Botones grandes ≥48x48px (la guía es explícita en sección 6).
- Tono operativo, alta legibilidad para uso exterior.

## Archivos afectados / nuevos

- **Nuevo**: `Reportar mortandad.html`, `Registrar reposicion.html`.
- **Nuevo**: `plantacion/ReportarMortandadScreen.jsx`, `RegistrarReposicionScreen.jsx`.
- Extender `plantacion/PlantacionData.jsx` con catálogos y mock data.
- Agregar accesos rápidos en Home del operario (PWA Home): "Reportar mortandad", "Registrar reposición".

## Dependencias / orden

- Depende de 05 (propósito en asignaciones).
- Independiente del Bloque A demás.

## Notas

- El "grupo de plantación" es un registro previo de plantación. Modelo: cada evento `PLANTACION` tiene un id propio que después se referencia.
- "Semáforo de supervivencia" (verde >85%, ámbar 70-85%, rojo <70%) — usar al mostrar grupos previos.
