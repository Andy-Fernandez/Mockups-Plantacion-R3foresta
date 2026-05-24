# 02 — Jerarquía Campaña vs Subcampaña según guía

> **Estado de revisión:** Hecha en el mock visual.
> **Resumen:** la campaña paraguas quedó como contenedor estratégico y las pantallas activas ahora consumen un agregado derivado desde sus subcampañas. `Asignar` también pasó a trabajar sobre subcampaña, no sobre campaña.
> **Alcance:** solo UI/UX mock con datos hardcodeados; sin lógica real ni persistencia.

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](../00-README.md).

**Prioridad:** Crítica
**Bloque:** A — Modelo

## Estado actual

`CAMPANAS_ADMIN` en `admin/AdminData.jsx` mezcla ambos niveles: cada "campaña" trae `meta`, `plantados`, `coordinadora`, `equipoCount`, `lotesCount`, `mixPlanificado`, `cobertura` (polígono).

`SUBCAMPANAS_ADMIN` también existe con datos similares. Hay duplicación conceptual.

## Lo que dice la guía

> Sección 1: "Arquitectura de dos niveles"

- **Campaña:** contenedor **estratégico**.
  - Campos: `nombre`, `descripción`, `organizaciones[]`, `fechasEstimadas` (opcionales).
  - **NO tiene** polígono, meta propia, coordinador, equipo, lotes, mix de especies, estado propio.
  - Estado derivado de las subcampañas.

- **Subcampaña:** unidad **operativa**.
  - Campos: `nombre`, `tipo`, `zona`, `coordinadorId`, `polígono` (área calculada), `meta`, `mixEspecies[]`, `equipo[]`, `lotesAsignados[]`, `estado`, `faseMantenimiento`, `fechas`.
  - 1 a N por campaña.

## Cambios concretos

### 1. Adelgazar el modelo de Campaña
Mover de Campaña a Subcampaña (o eliminar de Campaña):
- `meta`, `plantados`, `avancePct`
- `coordinadora`, `coordinadorId`
- `equipoCount`, `lotesCount`
- `hectareas`, `cobertura`
- `mixPlanificado`
- `tipo` (la guía pone tipo en subcampaña, no en campaña)

Campaña queda con:
- `id`, `nombre`, `descripcion`, `organizacionIds[]`, `fechaInicioEstimada`, `fechaFinEstimada`.

### 2. Engordar el modelo de Subcampaña
Asegurar que cada subcampaña tenga todos los campos operativos: polígono, meta, coordinador obligatorio, mix de especies, etc.

### 3. Estado derivado de Campaña
Calcular desde las subcampañas hijas:
- Si alguna está ACTIVA → campaña `ACTIVA`.
- Si todas COMPLETADA/FINALIZADA_PARCIAL y al menos una en MANTENIMIENTO_ACTIVO → `EN_MANTENIMIENTO`.
- Si todas en MONITOREO_HISTORICO → `MONITOREO_HISTORICO`.

### 4. Métricas agregadas de Campaña
Calcular sumando subcampañas:
- Total plantados, total meta, % avance.
- Hectáreas totales.
- CO₂ estimado.
- Total operarios involucrados.

## Archivos afectados

- `admin/AdminData.jsx` — refactor mayor.
- `admin/DashboardScreen.jsx` — `CampanaRow` usa muchas métricas de la campaña que ahora son agregadas.
- `admin/DetalleCampanaScreen.jsx` — vista de campaña paraguas, debe mostrar las subcampañas como contenido principal.
- `admin/AsignarScreen.jsx` — asignar lote es siempre a subcampaña, no a campaña.

## Dependencias / orden

- Después de 01 (estados).
- Antes de 06, 07, 10, 11.

## Notas

- En `CLAUDE.md` ya se anticipaba esta migración pero quedó a medias. Esta tarea la termina.
- `subcampanasResumen()` en `DashboardScreen.jsx` ya muestra agregación de hijas, mantener esa lógica.
