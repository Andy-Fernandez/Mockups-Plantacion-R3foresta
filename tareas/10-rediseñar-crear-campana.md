# 10 — Rediseñar wizard "Crear campaña"

> **Mockup hi-fi con énfasis funcional.** Separar nivel estratégico (campaña) de operativo (subcampaña). Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta (junto con 11, es la corrección arquitectónica más importante)
**Bloque:** C — Mejoras
**Referencia funcional:** RF-PLA-01 (campaña estratégica), sec. 2.1, 2.3, 3.1 procesos
**Rol:** Solo **ADMIN** puede crear campañas en MVP.

## Estado actual

`admin/CrearCampanaScreen.jsx` + `CrearCampanaA.jsx` + `CrearCampanaB.jsx` arman un wizard de Crear Campaña que **mete sub-campaña adentro y mezcla datos operativos** (tipo, polígono, meta, equipo, mix) en el mismo flujo.

## Lo que dicen los docs

> RF-PLA-01 + sec. 3.1 procesos

La campaña es **contenedor estratégico**, no operativo:
- Nombre obligatorio (recomendado: único en el sistema).
- Descripción opcional.
- Fechas estimadas globales opcionales (coherentes: fin >= inicio).
- 1 o más organizaciones asociadas (relación N:M con catálogo `ORGANIZACION`).
- **NO tiene polígono propio.**
- **NO tiene meta propia.**
- **NO tiene coordinador propio.**
- **NO tiene equipo propio.**
- **NO tiene mix de especies.**
- Estado **derivado** (no persistido) de sus sub-campañas.

Cualquier dato operativo (polígono, meta, coordinador, mix, asignaciones) vive en **sub-campaña** (tarea 11).

## Wizard objetivo: 3 pasos puros estratégicos

### Paso 1 — Datos generales
- Nombre (obligatorio, >= 3 chars).
- Descripción (opcional).
- Fechas estimadas globales (opcionales, coherentes si se cargan).

### Paso 2 — Organizaciones asociadas
- Selector múltiple del catálogo `ORGANIZACIONES` (ya existe en `AdminData.jsx`).
- Recomendado al menos 1 (validación blanda, no bloqueante).
- Botón "Crear nueva organización" — al click, abre un sub-modal con: nombre + tipo (`GOBIERNO/ONG/EMPRESA/FUNDACION`). En el mock puede ser placeholder visual.

### Paso 3 — Revisión + CTAs duales
- Resumen completo de los 2 pasos previos.
- Dos CTAs:
  - **"Crear campaña vacía"** → guarda y vuelve al Dashboard.
  - **"Crear campaña + agregar sub-campaña"** → guarda y encadena al wizard de tarea 11 con `campanaPadreId` preseleccionado.

## Cambios concretos

### 1. Reducir el wizard a 3 pasos reales
- Eliminar todo lo operativo del wizard actual: polígono, meta, equipo, mix, asignación de lotes.
- El wizard actual tiene 6 pasos (`Contexto / Zona / Especies / Lotes / Equipo / Resumen`); 5 de ellos pertenecen a subcampaña y se mueven a tarea 11.

### 2. Validación
- Nombre: obligatorio, >= 3 chars.
- Fechas: si se cargan, `fechaFin >= fechaInicio`. Pueden quedar vacías.
- Organizaciones: validación blanda con copy ("recomendamos al menos 1 para transparencia").

### 3. Encadenamiento al wizard de subcampaña (tarea 11)
- CTA "Crear y agregar sub-campaña" → `window.location.href = 'Crear subcampana.html?campanaId=<id>'`.

### 4. Limpiar archivos
- `CrearCampanaA.jsx` y `CrearCampanaB.jsx` son variantes del wizard actual de 6 pasos. Después de este refactor:
  - Si A y B son distintos enfoques visuales del wizard de **campaña** (3 pasos): alinearlos.
  - Si son distintos enfoques del wizard mezclado: mover todo a `admin/CrearSubcampanaScreen.jsx` (tarea 11) y dejar solo el wizard limpio acá.

## Archivos afectados

- `admin/CrearCampanaScreen.jsx` — refactor mayor (de 6 pasos mezclados a 3 pasos estratégicos).
- `admin/CrearCampanaA.jsx` / `CrearCampanaB.jsx` — alinear o eliminar.
- `Crear campaña.html` — verificar imports y tweaks panel (los pasos del tweaks panel hoy reflejan los 6 pasos mezclados — actualizar a 3).

## Dependencias / orden

- Depende de 02 ✅ (jerarquía) y 03 ✅ (organizaciones).
- Bloqueante para 11 (encadenamiento al wizard de subcampaña).

## Notas

- Mantener los markers `/*EDITMODE-BEGIN*/` que usa el tweaks-panel.
- Auditoría automática: el mock no necesita capturar `creado_por / creado_en / actualizado_por / actualizado_en`. Solo dejar nota en el doc del wizard.
