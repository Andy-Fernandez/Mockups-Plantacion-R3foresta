# 12 — Dashboard admin con tabs operativas

> **Mockup hi-fi con énfasis funcional.** Visión de comando central — KPIs reales del módulo + tabs operativas + alertas accionables. Detalle en [00-README.md](00-README.md).

**Prioridad:** Media
**Bloque:** C — Mejoras
**Referencia funcional:** Cross-cutting de RF-PLA-01…17. Vista de comando del ADMIN.
**Rol:** ADMIN principalmente. COORDINADOR ve versión filtrada (solo sus sub-campañas).

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
[ Campañas ]  [ Sub-campañas ]  [ Asignaciones ]  [ Alertas ]
```

Cada tab muestra una vista distinta:

#### Tab "Campañas"
- Lista actual con sub-campañas anidadas en cada row.
- Mostrar logos de organizaciones asociadas y **estado derivado** (sec. 2.2 docs).
- Acción inline: "Ver detalle" + "Agregar sub-campaña".

#### Tab "Sub-campañas"
- Tabla plana de **todas** las sub-campañas (sin agrupar por campaña).
- Columnas: nombre, campaña padre, tipo, estado, fase mantenimiento, coordinador (snapshot), % avance, eventos recientes.
- Filtros: por estado operativo, por fase de mantenimiento, por zona, por coordinador.
- Sort: por % avance, por fecha de cierre, por nombre.

#### Tab "Asignaciones"
Reusa `ASIGNACIONES_ADMIN` ya en `AdminData.jsx` (creado en tarea 05).
- Columnas: sub-campaña destino, lote, especie principal, **propósito** (badge), cantidad asignada, consumida, devuelta, disponible, estado (ACTIVA/AGOTADA/DEVUELTA), fecha asignación.
- Filtros: por propósito, por estado, por sub-campaña.
- Acción inline: "Devolver al vivero" (solo si `estado === ACTIVA && cantidad_disponible > 0`).
- Reusa `PropositoBadge` y `EstadoAsignacionBadge` ya en `AdminShell.jsx`.

#### Tab "Alertas"
Sub-campañas con problemas accionables. Reglas concretas:
| Tipo | Regla | Color |
|---|---|---|
| Sin coordinador | `coordinadorId === null` en sub-campaña ACTIVA | rojo |
| Stock crítico | `stock_asignado_pendiente < 30% meta` en ACTIVA | ámbar |
| Mantenimiento por vencer | `fase === MANTENIMIENTO_ACTIVO && meses_restantes < 3` | ámbar |
| Supervivencia baja | `supervivencia < 70%` en cualquier estado | rojo |
| Asignación inactiva | asignación ACTIVA sin consumo en >30 días en sub-campaña ACTIVA | ámbar |
| Meta alcanzable | `(plantados + saldo_disponible) >= meta * 0.95` en ACTIVA | verde — info, no alerta |

Cada alerta es clickable → navega al detalle de la sub-campaña.

### 4. CTAs visibles
Tres botones globales (FAB o barra superior):
- **"Crear campaña"** (ADMIN only) → tarea 10.
- **"Crear sub-campaña"** (ADMIN only) → tarea 11. Si no hay campañas, el botón muestra "Crear campaña primero".
- **"Asignar lotes"** (ADMIN o COORDINADOR de la sub-campaña destino) → pantalla `Asignar equipo y lotes.html`.

### 5. Vista del COORDINADOR
- Mismo dashboard pero las tabs "Campañas" y "Sub-campañas" filtran a **solo** sus sub-campañas (donde es COORDINADOR).
- Tab "Alertas" filtra igual.
- CTAs visibles: solo "Asignar lotes" (no puede crear campañas ni sub-campañas).

En el mock, usar un tweak de "Rol actual" (ADMIN / COORDINADOR) para alternar entre vistas.

## Archivos afectados

- `admin/DashboardScreen.jsx` — refactor del layout: insertar tabs entre el hero y el contenido actual.
- `admin/AdminData.jsx` — generar `ALERTAS` mock (lista de items con tipo, sub-campaña, mensaje, severidad). Las asignaciones ya existen tras tarea 05.

## Dependencias / orden

- Depende de 01, 02 ✅, 05 ✅.
- Puede ir en paralelo con 13.

## Notas

- En mobile (max-w-md), los tabs son scrolleables horizontalmente — ya hay precedente.
- La actividad reciente queda como sección al final, independiente de los tabs.
- Las alertas son **vista**, no notificaciones push. No bloquean nada.
- Los KPIs en el hero deben usar copy honesto de CO₂ (ver tarea 16).
