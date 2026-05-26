# 15 — Componentes recurrentes / patrones visuales

> **Mockup hi-fi.** Consolidar atomos reusables para evitar drift entre pantallas. Detalle en [00-README.md](00-README.md).

**Prioridad:** Baja (transversal, hacer en paralelo de las demás)
**Bloque:** D — Componentes y copy

## Estado actual

Tras tareas 03 y 05 existen los siguientes atomos en `admin/AdminShell.jsx`:
- ✅ `StateBadge` (estados operativos)
- ✅ `FaseBadge` (fase de mantenimiento con contador opcional)
- ✅ `TipoBadge` (REFORESTACION/ARBORIZACION/FORESTACION)
- ✅ `PropositoBadge` (PLANTACION_INICIAL/REPOSICION) — tarea 05
- ✅ `EstadoAsignacionBadge` (ACTIVA/AGOTADA/DEVUELTA) — tarea 05
- ✅ `Progress`, `StatesDonut`, `MiniMap`, `AvatarPile`, `OrgLogo`, `OrgLogoPile`, `OrgInlineList`

**Faltan:**
- `MiniBarrasEspecies` — composición real (sin topes planificados, sec. 2.12).
- `TimelineEventos` — append-only para historiales.
- `SemaforoSupervivencia` — píldora con umbrales (verde/ámbar/rojo).
- `ContadorMantenimiento` — "X meses restantes".
- `TarjetaPlantacion` — foto + cantidad + lote + fecha + ubicación.
- `MapaPoligonos` — componente avanzado (lo crea tarea 06).

## Lo que dice la guía

> Sección 4: "Componentes recurrentes / patrones visuales"

Lista canónica:

1. **Barra de progreso de subcampaña** — visual y atractiva. Plantados / meta + %.
2. **Mini-barras de especies** — barras horizontales: % real vs % planificado.
3. **Tarjetas de plantación** — foto + cantidad + especie + lote origen + fecha + ubicación.
4. **Mapa con polígonos y pines** — reutilizado en home pública, detalle, dashboard.
5. **Timeline append-only** — lista vertical con icono por tipo de evento.
6. **Badge de estado operativo** — ACTIVA, COMPLETADA, FINALIZADA_PARCIAL, BORRADOR.
7. **Badge de fase de mantenimiento** — MANTENIMIENTO_ACTIVO (azul), MONITOREO_HISTORICO (gris).
8. **Badge de tipo de subcampaña** — REFORESTACIÓN, ARBORIZACIÓN, FORESTACIÓN.
9. **Badge de propósito de asignación** — PLANTACION_INICIAL (verde), REPOSICION (naranja).
10. **Contador de mantenimiento** — "X meses restantes".

> Sección 5: "Estados y feedback visual"

- Semáforo de supervivencia: verde >85%, ámbar 70-85%, rojo <70%.

## Cambios concretos

### 1. Componentes a crear (los que faltan)
En `admin/AdminShell.jsx` (o nuevo `Components.jsx` si crece):

- `MiniBarrasEspecies({ especies })` — solo composición **real plantada** (sec. 2.12 sin topes):
  ```
  Jacarandá  ████░░░░░░░░  240 (35%)
  Molle      ██░░░░░░░░░░  120 (18%)
  ```

- `TimelineEventos({ events })` — append-only. Cada evento con:
  - Icono por tipo (`PLANTACION_INICIAL`, `REPOSICION`, `MORTANDAD_REPORTADA`, `ASIGNACION_VIVERO`, `DEVOLUCION_A_VIVERO`, `SUBCAMPANIA_ACTIVADA`, etc.).
  - Fecha (`formatDateShort`).
  - Usuario (snapshot).
  - Cantidad/breakdown corto.
  - Badge "anclado en blockchain" opcional.

- `SemaforoSupervivencia({ pct })` — píldora con umbrales: verde >85%, ámbar 70-85%, rojo <70%, gris si no aplica.

- `ContadorMantenimiento({ mesesRestantes })` — "X meses restantes" + icono `shield`. Si meses < 3, color de alerta.

- `TarjetaPlantacion({ registro })` — para listados de plantaciones (tab Plantaciones en tarea 13). Foto miniatura + cantidad + especie + lote origen + fecha + GPS.

### 2. Componentes ya consolidados (no tocar)
- `StateBadge`, `FaseBadge`, `TipoBadge`, `PropositoBadge`, `EstadoAsignacionBadge` — API consistente con `tone`/`light`/`compact`.
- Mantener la regla: badges siempre con `bg-* text-* ring-*` + dot opcional.

### 2. Duplicación entre módulos
Recordar (de CLAUDE.md): cada módulo (`admin/`, `plantacion/`, `historial/`, `publico/`) tiene su propio `Icon.jsx`. Los nuevos componentes recurrentes también deben duplicarse cuando se usen en otro módulo (convención del repo).

### 3. Preview cards (opcional)
Crear preview cards solo para los componentes nuevos:
- `preview/mini-barras-especies.html`
- `preview/timeline.html`
- `preview/semaforo-supervivencia.html`
- `preview/contador-mantenimiento.html`

Las badges ya consolidadas no necesitan preview nuevo (ya están en `preview/`).

### 4. Tokens visuales consistentes
Paleta semántica del módulo:
| Token | Uso |
|---|---|
| Brand-500/600 | ACTIVA, PLANTACION_INICIAL |
| Blue | COMPLETADA, MANTENIMIENTO_ACTIVO |
| Amber | FINALIZADA_PARCIAL, semáforo medio (70-85%), DEVUELTA |
| Orange | REPOSICION |
| Slate/gray | BORRADOR, MONITOREO_HISTORICO, AGOTADA |
| Red | Semáforo bajo (<70%), alertas críticas |
| Emerald | Plantación exitosa, supervivencia alta (>85%) |

## Archivos afectados / nuevos

- `admin/AdminShell.jsx` — extender con componentes nuevos.
- `publico/` — duplicar atomos relevantes (convención del repo, ver CLAUDE.md).
- `plantacion/` — duplicar atomos relevantes.
- `preview/*.html` — preview cards nuevos.

## Dependencias / orden

- Las badges (PropositoBadge, EstadoAsignacionBadge) ya están consolidadas tras tarea 05.
- TimelineEventos depende de los datasets mock de eventos (tareas 08, 13).
- Se puede hacer transversal mientras otras tareas avanzan.

## Notas

- No premium-ar abstracción: si un átomo solo se usa en una pantalla, dejarlo inline.
- Los markers `/*EDITMODE-BEGIN*/` solo aplican en pantallas con tweaks panel, no en átomos.
- Mantener convención de duplicación entre módulos (`admin/`, `publico/`, `plantacion/`, `historial/`) — cada uno tiene su `Icon.jsx` y atomos paralelos. No abstraer a `shared/`.
