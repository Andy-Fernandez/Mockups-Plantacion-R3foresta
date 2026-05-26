# Tareas — alineación con la Guía de Mockups del Módulo 3 (Plantación)

> Referencias funcionales (fuente de verdad):
> - `r3foresta-docs/plantacion-module/00_Requerimientos_Modulo_3_Plantacion.json` (RF-PLA-01…17, enums, validaciones)
> - `r3foresta-docs/plantacion-module/02_Procesos_Modulo_3_Plantacion.md` (flujo, reglas)
> - `r3foresta-docs/plantacion-module/03_Mockups_Guia_Modulo_3_Plantacion.md` (guía visual)
> Última revisión cruzada: 2026-05-25

## ⚠️ Alcance: mockups visuales **con corrección funcional**

Este repo es un **prototipo hi-fi**: pantallas estáticas que muestran cómo se verá la UI. El énfasis es **lo funcional sobre lo visual** — la pantalla puede ser fea, pero los **conceptos, enums, gates y reglas** tienen que estar correctos según los Requerimientos/Procesos.

**Prioridad de cada tarea:**
1. **Conceptos correctos**: enums oficiales, gates de estado, propósitos, snapshots, append-only.
2. **Flujos completos**: si el doc dice "pre-confirmación obligatoria con 4 números", esa pantalla existe.
3. **Visual aceptable**: layout limpio, badges semánticos. No tiene que ser pixel-perfect.

**SÍ hacer:**
- Pantallas React+Tailwind con layout, tipografía, colores, badges, mapas estilizados.
- Datos hardcodeados en `*Data.jsx` (mock) pero **estructurados como el modelo real** del JSON de requerimientos.
- Enums **exactos** de los docs (`motivo_cierre_parcial`, `causa_mortandad_plantacion`, `motivo_devolucion_plantacion`, `proposito_asignacion`, etc.).
- Estados operativos exactos: `BORRADOR · ACTIVA · COMPLETADA · FINALIZADA_PARCIAL` y fases `NO_APLICA · MANTENIMIENTO_ACTIVO · MONITOREO_HISTORICO`.
- Gates visuales explícitos según rol (ADMIN / COORDINADOR / OPERARIO / VALIDADOR / VOLUNTARIO).
- Variantes con el tweaks-panel para mostrar distintos estados.

**NO hacer:**
- Cálculos derivados en vivo (totales, agregaciones, % calculados) — **hardcodear el resultado en `*Data.jsx`**.
- Integraciones reales (Leaflet, GPS, fetch, fotos del filesystem).
- Animaciones decorativas que no aporten al entendimiento (pulse innecesario, spinners "Registrando en blockchain ⛓️").
- Inventar valores de enum o campos que no estén en los docs.

**Regla mental:** "un dev abre el mockup y entiende qué objeto/evento crearía el backend al apretar este botón". Si sí → suficiente.

La producción real vive en `R3foresta/pwa-r3foresta`. Acá solo construimos los mockups que servirán de referencia para esa implementación.

## Roles del módulo (cross-cutting — referenciar en cada tarea)

| Rol | Puede |
|---|---|
| **ADMIN** | Crear campañas y subcampañas, asignar coordinador inicial, cerrar a FINALIZADA_PARCIAL, gestionar organizaciones. |
| **COORDINADOR** (membresía por subcampaña, no rol global) | Asignar/devolver lotes en su subcampaña, gestionar equipo, registrar plantaciones/reposiciones/mortandad. |
| **OPERARIO** (GENERAL miembro de SUBCAMPANIA_EQUIPO) | Registrar plantaciones, reposiciones y mortandad solo donde es parte del equipo. |
| **VALIDADOR** | Sin flujo especial en MVP. Puede ser COORDINADOR u OPERARIO de subcampañas. |
| **VOLUNTARIO** | Sin permisos operativos en M3 (no aparece en equipos). |

Ver `RF-PLA-17`. Cada pantalla debe **ocultar/deshabilitar** acciones no permitidas según el rol del tweak actual.

## Cómo leer esta carpeta

Cada archivo es **una tarea autocontenida** con: estado actual, qué dice la guía, cambios concretos, archivos afectados y dependencias. Los números son orden sugerido de ejecución (no jerarquía rígida).

## Diagnóstico al 2026-05-25

| Estado | Item | Tarea |
|---|---|---|
| ✅ | Estados operativos + fase de mantenimiento | 01 |
| ✅ | Jerarquía Campaña → Subcampaña | 02 |
| ✅ | Organizaciones asociadas (N:M) | 03 |
| ✅ | Tipos: REFORESTACION/ARBORIZACION/FORESTACION | 04 |
| ✅ | Propósito en asignaciones (PLANTACION_INICIAL/REPOSICION) + tab Asignaciones en Detalle sub-campaña | 05 |
| ❌ | Vista pública (Home + Detalle) | 06, 07 |
| ❌ | Mortandad + Reposición mobile (con pre-confirmación bloqueante) | 08 |
| ❌ | Pantalla FINALIZADA_PARCIAL | 09 |
| ⚠️ | Crear campaña — wizard actual mezcla campaña + subcampaña | 10 |
| ❌ | Crear subcampaña dedicada | 11 |
| ⚠️ | Dashboard sin tabs (Campañas/Subcampañas/Asignaciones/Alertas) | 12 |
| ⚠️ | Detalle subcampaña: faltan tabs Plantaciones · Mortandad/Reposiciones · Historial; falta gestión equipo (add/remove) y modal devolución | 13 |
| ⚠️ | Registrar plantación: falta selector de lote por especie filtrado por propósito | 14 |
| ⚠️ | Componentes recurrentes (Timeline, MiniBarrasEspecies, SemaforoSupervivencia) | 15 |
| ⚠️ | CO₂ naming: "capturado" → "proyectado/estimado" | 16 |

## Bloques de tareas

### Hechas
- [01 — Alinear estados y fase de mantenimiento](hechas/01-alinear-estados-y-fase.md)
- [02 — Jerarquía Campaña vs Subcampaña según guía](hechas/02-jerarquia-campana-subcampana.md)
- [03 — Organizaciones asociadas](hechas/03-organizaciones-asociadas.md)
- [04 — Tipos de subcampaña correctos](hechas/04-tipos-subcampana.md)
- [05 — Asignaciones con propósito](hechas/05-asignaciones-con-proposito.md)

### Bloque B — Pantallas nuevas
- [06 — Home pública con mapa interactivo](06-home-publica-con-mapa.md)
- [07 — Detalle público de subcampaña y campaña](07-detalle-publico.md)
- [08 — Reportar mortandad y registrar reposición (mobile)](08-mortandad-y-reposicion-mobile.md)
- [09 — Pantalla "Marcar FINALIZADA_PARCIAL"](09-finalizar-parcial.md)

### Bloque C — Mejoras a pantallas existentes
- [10 — Rediseñar wizard "Crear campaña"](10-rediseñar-crear-campana.md)
- [11 — Rediseñar wizard "Crear subcampaña"](11-rediseñar-crear-subcampana.md)
- [12 — Dashboard admin con tabs (Campañas / Subcampañas / Asignaciones / Alertas)](12-dashboard-admin-tabs.md)
- [13 — Detalle subcampaña: tabs faltantes + gestión equipo + devolución](13-detalle-subcampana-tabs.md)
- [14 — Registrar plantación: selector de lote por especie](14-registrar-plantacion-lote.md)

### Bloque D — Componentes y copy
- [15 — Componentes recurrentes (Timeline, MiniBarras, Semáforo)](15-componentes-recurrentes.md)
- [16 — CO₂ "estimado/proyectado" vs métrica física real](16-co2-naming.md)

## Orden de ejecución recomendado

1. **10 + 11 primero** (campaña vs subcampaña): el wizard actual mezcla los dos niveles. Es bloqueante para cualquier mejora en flujos de creación.
2. **09 en paralelo** (es una pantalla aislada, no depende de 10/11).
3. **14 + 08** (flows operativos críticos del operario): dependen del modelo de Asignaciones (✅ ya en 05).
4. **13** (tabs faltantes en detalle subcampaña): consolida lo de 05/08/09 en una sola vista.
5. **06 + 07** (vista pública): última, consume todo lo anterior.
6. **12** (dashboard tabs): se puede hacer en paralelo desde el inicio.
7. **15 + 16** (pulido transversal).

## No incluido (fuera de scope del mockup ni del MVP)

- Backend, blockchain real (solo badges visuales), autenticación, GPS real, integración con Vivero real.
- Offline-first (post-MVP).
- **Mix de especies con topes porcentuales por subcampaña** (decisión cerrada 2026-05-24, sec. 2.12 de procesos). La composición real se registra al plantar en `REGISTRO_PLANTACION_DETALLE`.
- Estados PAUSADA y CANCELADA (en enum pero sin flujo en MVP).
- Corrección de mortandad (sin reescritura en MVP — append-only puro).
- Salida de campo intermedia (entre vivero y plantación efectiva).
