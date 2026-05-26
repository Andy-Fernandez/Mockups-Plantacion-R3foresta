# 13 — Detalle de sub-campaña: tabs faltantes + gestión equipo + devolución

> **Mockup hi-fi con énfasis funcional.** Pantalla central de gestión operativa. Tras tarea 05 ya tiene tab Asignaciones; faltan Plantaciones, Mortandad/Reposiciones, Historial, gestión add/remove en Equipo, y modal de devolución. Detalle en [00-README.md](00-README.md).

**Prioridad:** Media
**Bloque:** C — Mejoras
**Referencia funcional:** RF-PLA-04, 05, 12, 14 + cross-cutting estados operativos. Sec. 3.7 procesos.
**Rol:** ADMIN y COORDINADOR de la sub-campaña. OPERARIOS ven una versión read-only (sin acciones de gestión).

## Estado actual

`admin/DetalleSubcampanaScreen.jsx` tiene 4 tabs:
- ✅ `Resumen` (con métricas, mix mostrado **real** sin topes)
- ✅ `Equipo` (lista de miembros, falta add/remove)
- ✅ `Asignaciones` (hecho en tarea 05 con `PropositoBadge`, `EstadoAsignacionBadge`, barra de consumo, botón "Devolver al vivero" placeholder)
- ✅ `Mapa`

**Faltan:**
- `Plantaciones` (listado de registros)
- `Mortandad y reposiciones` (registros + semáforo de supervivencia)
- `Historial` (timeline append-only)
- Add/remove operarios en tab Equipo (RF-PLA-12)
- Modal completo de devolución con motivo (RF-PLA-05)

## Lo que dice la guía

> Sección 3.7: "Detalle de subcampaña (admin/coordinador)"

**Header:**
- Estado operativo + fase de mantenimiento (badges separados).
- Acciones según estado:
  - `ACTIVA`: "Marcar como FINALIZADA_PARCIAL" (solo admin, con confirmación + motivo) — ver tarea 09.
  - `COMPLETADA` / `FINALIZADA_PARCIAL`: "Asignar más lotes para reposición".

**6 tabs:**

1. **Resumen** — progreso, mapa con pines, métricas clave, fechas (incluyendo `fecha_fin_mantenimiento`).
2. **Plantaciones** — listado con filtros (operario, fecha, especie, lote). Cada fila expandible con fotos, GPS, cantidades por especie y lote origen.
3. **Asignaciones** — tabla con propósito, cantidad asignada/consumida/devuelta/disponible. Botones "Asignar más", "Devolver al vivero".
4. **Mortandad y reposiciones** — registros con % supervivencia y semáforo (verde >85%, ámbar 70-85%, rojo <70%).
5. **Equipo** — coordinador + operarios con aportes individuales. Botones "Agregar operario" / "Remover" (con confirmación).
6. **Historial** — timeline append-only completo.

## Cambios concretos

### 1. Estructura final de tabs
```
[ Resumen ]  [ Plantaciones ]  [ Asign. ]  [ Mortandad ]  [ Equipo ]  [ Historial ]
```

En mobile (max-w-md) los tabs scrollean horizontalmente.

> El tab "Mapa" actual se puede integrar dentro de "Resumen" como sección destacada (ya hay un mini-mapa ahí). Si se quiere mantener como tab separado, está OK.

### 2. Tab "Plantaciones" (nuevo)
Lista filtrable de `REGISTRO_PLANTACION` de esta sub-campaña.
- Filtros: operario, fecha, especie, lote origen.
- Row colapsado: fecha, operario (snapshot del nombre), cantidad total plantada, foto miniatura.
- Row expandido: GPS (con mini-mapa), breakdown por especie con cantidades, **lote origen por especie**, observaciones, badge "verificable en blockchain" si está anclado.
- Diferenciar visualmente plantaciones iniciales vs reposiciones (badge naranja "REPOSICIÓN" en estas últimas).
- **Append-only**: sin botones de editar ni borrar.

### 3. Tab "Asignaciones" (ya hecho ✅ en tarea 05)
Pendiente solo:
- **Modal completo de devolución** al click en "Devolver al vivero" (RF-PLA-05):
  - Cantidad a devolver (≤ `cantidad_disponible`).
  - Selector de **motivo de devolución** del enum oficial (ver abajo).
  - Observaciones opcional. Obligatoria si `motivo === OTRO`.
  - Confirmar.
  - Genera evento `DEVOLUCION_A_VIVERO` append-only (mockear en `AdminData.jsx`).
  - Solo ADMIN o COORDINADOR pueden devolver.

#### `motivo_devolucion_plantacion` (sec. 13 docs — usar **exactamente estos**)
```
SOBRANTE_OPERATIVO · ERROR_PLANIFICACION · CAMBIO_SUBCAMPANIA ·
CIERRE_SUBCAMPANIA · PROBLEMAS_CALIDAD_LOTE · CONDICIONES_CAMPO_NO_APTAS ·
ACCESO_RESTRINGIDO · CANCELACION_ACTIVIDAD · REASIGNACION_PRIORIDAD · OTRO
```

### 4. Tab "Mortandad y reposiciones" (nuevo)
Dos sub-secciones colapsables:

#### Mortandades reportadas
- Lista cronológica de `MORTANDAD_REPORTADA`.
- Por registro: grupo origen (link), fecha, cantidad delta, causa (badge), responsable (snapshot), foto miniatura, GPS.
- Por grupo: % supervivencia con **semáforo** (verde >85%, ámbar 70-85%, rojo <70%).

#### Reposiciones registradas
- Lista cronológica de `REPOSICION`.
- Por registro: grupo origen, fecha, especies/cantidades, lotes origen, responsable, foto.
- Diferenciar visualmente reposiciones en `MANTENIMIENTO_ACTIVO` vs `MONITOREO_HISTORICO`.

### 5. Tab "Equipo" — añadir gestión (RF-PLA-12)
- Coordinador destacado arriba (con badge "COORD.").
- Lista de operarios con conteo de plantaciones aportadas (snapshot del nombre).
- **"Agregar operario"** (ADMIN o COORDINADOR):
  - Modal de selección desde `PERSONAS` (excluye VOLUNTARIO).
  - Solo permitido si sub-campaña en estado no terminal (ACTIVA / COMPLETADA / FINALIZADA_PARCIAL).
  - **NO permitido en BORRADOR** (la sub-campaña no opera).
- **"Remover operario"** (ADMIN o COORDINADOR):
  - Confirmación.
  - Los registros previos del operario permanecen intactos (append-only).
- **NO se puede remover al coordinador** desde aquí (debe usarse flujo de "cambio de coordinador", fuera de MVP visual).
- Cada acción genera evento `EQUIPO_AMPLIADO` / `EQUIPO_REDUCIDO` en `SUBCAMPANIA_HISTORIAL`.

### 6. Tab "Historial" (timeline append-only)
Timeline visual de `SUBCAMPANIA_HISTORIAL` + `EVENTO_PLANTACION` agregados:
- `BORRADOR_CREADO`
- `SUBCAMPANIA_ACTIVADA`
- `EQUIPO_AMPLIADO` / `EQUIPO_REDUCIDO`
- `COORDINADOR_CAMBIADO`
- `ASIGNACION_VIVERO`
- `DEVOLUCION_A_VIVERO`
- `PLANTACION_INICIAL`
- `MORTANDAD_REPORTADA`
- `REPOSICION`
- `SUBCAMPANIA_COMPLETADA` (auto)
- `SUBCAMPANIA_FINALIZADA_PARCIAL` (manual)
- `TRANSICION_A_MONITOREO_HISTORICO` (auto por fecha)

Cada evento con: icono por tipo, fecha, usuario (snapshot), descripción corta. Badge "anclado en blockchain" en los eventos anclables.

Reusar `historial/HistorialEvents.jsx` o crear `TimelineSubcampana.jsx` similar. Ver tarea 15.

### 7. Header — acciones según estado y rol
- **ACTIVA** + rol ADMIN: botón "Marcar como FINALIZADA_PARCIAL" (tarea 09).
- **COMPLETADA / FINALIZADA_PARCIAL** + ADMIN/COORDINADOR: botón "Asignar más lotes para reposición" (preselecciona propósito REPOSICION en tarea de Asignar).
- **MANTENIMIENTO_ACTIVO**: contador "X meses restantes" (visualizar el `mesesRestantesMantenimiento` ya mock).

## Archivos afectados

- `admin/DetalleSubcampanaScreen.jsx` — agregar 3 tabs + modal devolución + gestión equipo.
- `admin/AdminData.jsx` — extender con:
  - `REGISTROS_PLANTACION` mock (los grupos plantados, ver tarea 08).
  - `MORTANDADES_MOCK` (después de tarea 08).
  - `REPOSICIONES_MOCK` (después de tarea 08).
  - `SUBCAMPANIA_HISTORIAL_MOCK` (eventos del timeline).
  - `MOTIVO_DEVOLUCION_PLANTACION` enum.
- Posible nuevo: `admin/TimelineSubcampana.jsx`.

## Dependencias / orden

- Depende de 01, 02, 05 ✅, 09 (botón "Marcar parcial" requiere pantalla).
- Beneficia de 08 (mortandad/reposiciones) — el tab Mortandad necesita esos datos.
- Puede ir en paralelo con 12.

## Notas

- El header debe mostrar ambos badges (estado + fase de mantenimiento) cuando aplique. No mezclar.
- Las acciones disponibles cambian por **estado** y por **rol** — usar el tweak de rol (ADMIN/COORDINADOR/OPERARIO) para mostrar las variantes.
- Append-only es clave: ningún tab debe ofrecer editar/borrar eventos. Solo agregar.
