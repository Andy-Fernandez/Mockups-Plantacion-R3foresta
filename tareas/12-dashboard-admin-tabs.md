# 12 — Dashboard admin con tabs operativas

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](00-README.md).

**Prioridad:** Media
**Bloque:** C — Mejoras

## Estado actual

`admin/DashboardScreen.jsx` tiene un layout vertical con:
- Hero unificado CO₂ + árboles (recién agregado).
- Tabs de período (mes/trimestre/año/histórico).
- Grid 2x2 de KPIs.
- Donut de estados.
- Listado de campañas con filtros por estado.
- Actividad reciente.

**No tiene** los tabs operativos que pide la guía.

## Lo que dice la guía

> Sección 3.4: "Dashboard del administrador"

**KPIs superiores:** total árboles, subcampañas activas, en mantenimiento, asignaciones pendientes.

**Tabs:**
- **Campañas:** tabla con subcampañas anidadas, organizaciones, estado derivado.
- **Subcampañas:** tabla plana con todas, coordinadores, % avance, fase de mantenimiento.
- **Asignaciones:** tabla de vivero → subcampaña con propósito.
- **Alertas:** subcampañas próximas a cerrar, mantenimientos pendientes, etc.

**Botones:** "Crear campaña", "Crear subcampaña", "Asignar lotes".

## Cambios concretos

### 1. Mantener el hero unificado actual
El hero CO₂ + árboles ya cubre la sección "totalizadores grandes" del guide y se reusa.

### 2. Reorganizar los KPIs superiores
Cambiar el grid 2x2 actual a los 4 KPIs específicos de la guía:
- Total árboles plantados (ya en hero, redundante — mover a otro lugar o reemplazar este slot).
- Subcampañas ACTIVAS.
- Subcampañas en MANTENIMIENTO_ACTIVO.
- Asignaciones pendientes (sin consumir).

### 3. Agregar tabs principales bajo el hero
```
[ Campañas ]  [ Subcampañas ]  [ Asignaciones ]  [ Alertas ]
```

Cada tab muestra una vista distinta:
- **Campañas:** lo que hoy es el listado (con subcampañas anidadas en cada row).
- **Subcampañas:** vista plana, ordenada por % avance o por fecha.
- **Asignaciones:** tabla nueva (depende de tarea 05).
- **Alertas:** lista de subcampañas con problemas:
  - Sin coordinador.
  - Stock asignado < 50% de meta.
  - Mantenimiento próximo a terminar (faltan <3 meses).
  - Supervivencia <70%.

### 4. CTAs visibles
Tres botones globales:
- "Crear campaña" (FAB actual — mantener).
- "Crear subcampaña".
- "Asignar lotes".

## Archivos afectados

- `admin/DashboardScreen.jsx` — refactor del layout.
- `admin/AdminData.jsx` — generar dataset de alertas y asignaciones.

## Dependencias / orden

- Depende de 01, 02, 05.
- Puede ir en paralelo con 13.

## Notas

- En mobile (max-w-md), los tabs son scrolleables horizontalmente — ya hay precedente con el filtro de estado actual.
- La actividad reciente queda como sección al final, independiente de los tabs.
