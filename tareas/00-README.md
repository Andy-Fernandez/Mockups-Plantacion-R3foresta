# Tareas — alineación con la Guía de Mockups del Módulo 3 (Plantación)

> Referencia: `r3foresta-docs/plantacion-module/03_Mockups_Guia_Modulo_3_Plantacion.md`
> Fecha de análisis: 2026-05-21

## ⚠️ Alcance: SOLO mockups visuales

Este repo es un **prototipo hi-fi puro**: pantallas estáticas que muestran **cómo se verá** la UI, no cómo funcionará.

**SÍ hacer:**
- Pantallas React+Tailwind con layout, tipografía, colores, badges, mapas estilizados.
- Datos hardcodeados en `*Data.jsx` (mock).
- Animaciones visuales decorativas (pulse, fade, hover, contadores tipo eye-candy).
- Variantes con el tweaks-panel para mostrar distintos estados visuales.

**NO hacer:**
- Lógica de negocio real (máquinas de estado, validaciones funcionales, reglas).
- Flujo de datos real (formularios que persistan, navegación con estado real).
- Cálculos derivados en vivo (totales, agregaciones, % calculados) — **hardcodear el resultado**.
- Integraciones (mapas reales tipo Leaflet, GPS real, fetch a APIs, fotos reales).
- Validaciones funcionales — solo mostrar el **aspecto visual** del estado de error/éxito.

**Regla mental:** "si lo congelo como screenshot, ¿se entiende la idea?". Si sí → suficiente.

La producción real vive en `R3foresta/pwa-r3foresta`. Acá solo construimos los mockups que servirán de referencia para esa implementación.

## Cómo leer esta carpeta

Cada archivo es **una tarea autocontenida** con: estado actual, qué dice la guía, cambios concretos, archivos afectados y dependencias. Los números son orden sugerido de ejecución (no jerarquía rígida).

## Diagnóstico resumido

| Estado | Item |
|---|---|
| ✅ | Estética: mobile-first, paleta verde, jerarquía visual |
| ✅ | Pantallas base: Dashboard, Crear campaña, Detalles, Asignar, Registrar plantación, Historial |
| ✅ | Concepto de jerarquía Campaña → Subcampaña ya modelado en código |
| ✅ | Estados operativos alineados al mock actual: BORRADOR, ACTIVA, COMPLETADA, FINALIZADA_PARCIAL |
| ✅ | Fase de mantenimiento visible como eje paralelo en el mock actual |
| ⚠️ | Falta concepto de "organizaciones asociadas" |
| ⚠️ | Tipos de subcampaña no coinciden (URBANA/COMUNIDAD vs guía REFORESTACION/ARBORIZACION/FORESTACION) |
| ⚠️ | Falta propósito en asignaciones (PLANTACION_INICIAL / REPOSICION) |
| ❌ | Faltan 5 pantallas: Home pública mapa, Detalle público subcampaña, Mortandad, Reposición, Finalizar parcial |

## Bloques de tareas

### Hechas
- [01 — Alinear estados y fase de mantenimiento](hechas/01-alinear-estados-y-fase.md)

### Bloque A — Alinear modelo de datos (base para todo lo demás)
- [02 — Jerarquía Campaña vs Subcampaña según guía](02-jerarquia-campana-subcampana.md)
- [03 — Organizaciones asociadas](03-organizaciones-asociadas.md)
- [04 — Tipos de subcampaña correctos](04-tipos-subcampana.md)
- [05 — Asignaciones con propósito](05-asignaciones-con-proposito.md)

### Bloque B — Pantallas nuevas
- [06 — Home pública con mapa interactivo](06-home-publica-con-mapa.md)
- [07 — Detalle público de subcampaña y campaña](07-detalle-publico.md)
- [08 — Reportar mortandad y registrar reposición (mobile)](08-mortandad-y-reposicion-mobile.md)
- [09 — Pantalla "Marcar FINALIZADA_PARCIAL"](09-finalizar-parcial.md)

### Bloque C — Mejoras a pantallas existentes
- [10 — Rediseñar wizard "Crear campaña"](10-rediseñar-crear-campana.md)
- [11 — Rediseñar wizard "Crear subcampaña"](11-rediseñar-crear-subcampana.md)
- [12 — Dashboard admin con tabs (Campañas / Subcampañas / Asignaciones / Alertas)](12-dashboard-admin-tabs.md)
- [13 — Detalle subcampaña: 6 tabs según guía](13-detalle-subcampana-tabs.md)
- [14 — Registrar plantación: selector de lote por especie](14-registrar-plantacion-lote.md)

### Bloque D — Componentes y copy
- [15 — Componentes recurrentes (badges, mini-barras, timeline, mapa)](15-componentes-recurrentes.md)
- [16 — CO₂ "estimado/proyectado" vs métrica física real](16-co2-naming.md)

## Orden de ejecución recomendado

1. **Primero Bloque A** (modelo): sin esto, cualquier UI nueva nace desalineada.
2. **Bloque B en paralelo con C** una vez que el modelo está estable.
3. **Bloque D** al final como pulido transversal.

## No incluido (fuera de scope del mockup)

- Backend, blockchain real, autenticación, GPS real, integración con Vivero real.
- Offline-first (la guía lo marca como post-MVP).
