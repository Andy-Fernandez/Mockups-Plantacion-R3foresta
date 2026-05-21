# 10 — Rediseñar wizard "Crear campaña"

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta
**Bloque:** C — Mejoras

## Estado actual

`admin/CrearCampanaScreen.jsx` + `CrearCampanaA.jsx` + `CrearCampanaB.jsx` arman un wizard de Crear Campaña que **mete sub-campaña adentro y mezcla datos operativos** (tipo, polígono, meta, equipo, mix) en el mismo flujo.

## Lo que dice la guía

> Sección 3.5: "Crear campaña (admin)"

**Wizard simple de 3 pasos.** Solo datos estratégicos:

### Paso 1 — Datos generales
- Nombre obligatorio.
- Descripción opcional.
- Fechas estimadas globales opcionales (solo futuras).

### Paso 2 — Organizaciones asociadas
- Selector múltiple del catálogo `ORGANIZACION`.
- 1 o más, recomendado al menos 1.
- Botón "Crear nueva organización".

### Paso 3 — Revisión
- Resumen.
- Dos CTAs:
  - "Crear campaña vacía" (sin subcampañas).
  - "Crear campaña y agregar subcampaña" (encadena al wizard de tarea 11).

**No se crean polígonos, metas, coordinadores ni mix de especies en este wizard.** Eso es responsabilidad del wizard de subcampaña.

## Cambios concretos

### 1. Reducir el wizard a 3 pasos reales
- Eliminar todo lo operativo (polígono, meta, equipo, mix, asignación de lotes).
- Solo: nombre, descripción, fechas estimadas, organizaciones.

### 2. Validación
- Nombre: obligatorio, >= 3 chars.
- Fechas: solo futuras, fechaFin >= fechaInicio.
- Organizaciones: blanda ("recomendamos al menos 1").

### 3. Encadenamiento
- CTA "Crear campaña y agregar subcampaña" → navega al wizard de tarea 11 con `campanaPadreId` preseleccionado.

### 4. Limpiar archivos
- Decidir: ¿`CrearCampanaA.jsx` y `CrearCampanaB.jsx` son variantes de mock que se mantienen como segmented options del tweaks panel, o se eliminan?
- Si son variantes, alinearlas con el nuevo wizard de 3 pasos.

## Archivos afectados

- `admin/CrearCampanaScreen.jsx` — refactor mayor.
- `admin/CrearCampanaA.jsx` / `CrearCampanaB.jsx` — alinear o eliminar.
- `Crear campaña.html` — verificar imports y tweaks panel.

## Dependencias / orden

- Depende de 02 (jerarquía) y 03 (organizaciones).
- Bloqueante para 11 (encadenamiento).

## Notas

- Esta es probablemente la mejora más grande de UX: el wizard actual es agobiante; el de la guía es de 3 pasos cortos.
- Mantener los markers `/*EDITMODE-BEGIN*/` que usa el tweaks-panel.
