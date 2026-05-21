# 15 — Componentes recurrentes / patrones visuales

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](00-README.md).

**Prioridad:** Baja (transversal, hacer en paralelo)
**Bloque:** D — Componentes y copy

## Estado actual

Existen algunos átomos en `admin/AdminShell.jsx`: `StateBadge`, `Progress`, `MiniMap`, `AvatarPile`. Sin un set unificado de los componentes que pide la guía.

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

### 1. Consolidar átomos en `AdminShell.jsx` (o nuevo `Components.jsx`)
Componentes a crear/extender:
- `ProgressSubcampana` — ya tenemos `Progress`, asegurar variante grande para detalles.
- `MiniBarrasEspecies` — nuevo.
- `TarjetaPlantacion` — nuevo.
- `MapaPoligonos` — nuevo (tarea 06 lo crea, este lo formaliza).
- `Timeline` — reusar `historial/HistorialEvents.jsx` y generalizar.
- `EstadoBadge`, `FaseBadge`, `TipoBadge`, `PropositoBadge` — 4 badges distintos pero con tone API consistente.
- `ContadorMantenimiento` — "18 meses restantes" + icono reloj.
- `SemaforoSupervivencia` — píldora con color por umbral.

### 2. Duplicación entre módulos
Recordar (de CLAUDE.md): cada módulo (`admin/`, `plantacion/`, `historial/`, `publico/`) tiene su propio `Icon.jsx`. Los nuevos componentes recurrentes también deben duplicarse cuando se usen en otro módulo (convención del repo).

### 3. Preview cards
Crear archivos en `preview/` para mostrar cada componente aislado:
- `preview/badges.html`
- `preview/mini-barras-especies.html`
- `preview/timeline.html`
- `preview/mapa-poligonos.html`
- `preview/contador-mantenimiento.html`

### 4. Tokens visuales consistentes
Asegurar paleta:
- Verde brand: ACTIVA, PLANTACION_INICIAL.
- Azul: COMPLETADA, MANTENIMIENTO_ACTIVO.
- Ámbar: FINALIZADA_PARCIAL, semáforo medio.
- Naranja: REPOSICION.
- Gris/slate: BORRADOR, MONITOREO_HISTORICO.
- Rojo: semáforo bajo (alerta).

## Archivos afectados / nuevos

- `admin/AdminShell.jsx` — extender.
- `publico/` — duplicar átomos relevantes.
- `plantacion/` — duplicar átomos relevantes.
- `preview/*.html` — varios nuevos.

## Dependencias / orden

- Depende de 01, 04, 05.
- Se puede hacer transversal mientras otras tareas avanzan.

## Notas

- No premium-ar abstracción: si un átomo solo se usa en una pantalla, dejarlo inline.
- Los markers `/*EDITMODE-BEGIN*/` solo aplican en pantallas con tweaks panel, no en átomos.
