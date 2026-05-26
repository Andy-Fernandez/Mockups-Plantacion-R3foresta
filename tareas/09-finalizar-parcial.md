# 09 — Pantalla "Marcar FINALIZADA_PARCIAL"

> **Mockup hi-fi con énfasis funcional.** Acción destructiva con gate de rol y motivos del enum oficial. Detalle en [00-README.md](00-README.md).

**Prioridad:** Media
**Bloque:** B — Pantallas nuevas
**Referencia funcional:** RF-PLA-08 (cierre manual), sec. 3.8 procesos, sec. 13 catálogos cerrados
**Rol:** Solo **ADMIN** puede ejecutar esta acción. Coordinador NO puede.

## Estado actual

No existe la acción "FINALIZADA_PARCIAL" en el código. Solo existe `CANCELADA` que se descarta en tarea 01.

## Lo que dice la guía

> Sección 3.11

- **Solo accesible si la subcampaña está `ACTIVA`** (solo admin, no coordinador).
- Muestra el progreso actual: "Has plantado 700 de 1000 árboles, 70%".
- **Advertencia clara**: "Esta acción cierra la subcampaña antes de alcanzar la meta. Después solo podrás registrar mantenimiento (mortandad y reposiciones). No se puede deshacer ni reabrir. Si quieres continuar plantando, deberás crear una nueva subcampaña."
- Selector de motivo (catálogo + OTRO).
- Campo de observaciones.
- Confirmación con texto explícito (escribir el nombre de la subcampaña, p. ej.).

## Cambios concretos

### 1. Nuevo archivo HTML
`Finalizar parcial.html`

### 2. Nuevo screen module
`admin/FinalizarParcialScreen.jsx`

### 3. Modelo: catálogo `motivo_cierre_parcial` (sec. 13 docs — usar **exactamente estos**)
```js
const MOTIVO_CIERRE_PARCIAL = [
  'FALTA_STOCK',
  'PROBLEMAS_CLIMATICOS',
  'CANCELACION_CONVENIO',
  'CONFLICTO_SOCIAL',
  'ACCESO_RESTRINGIDO',
  'CAMBIO_PRIORIDAD_INSTITUCIONAL',
  'RIESGO_OPERATIVO',
  'META_REDEFINIDA',
  'CIERRE_ADMINISTRATIVO',
  'OTRO',
];
```
> ⚠️ Los valores son los oficiales del enum `motivo_cierre_parcial` (`r3foresta-docs/.../00_Requerimientos`). No inventar otros. `OTRO` se acompaña de texto en observaciones.

### 4. Disparadores de la pantalla
- Desde `admin/DetalleSubcampanaScreen.jsx`: botón "Marcar como FINALIZADA_PARCIAL" solo si:
  - `sub.estado === 'ACTIVA'` (gate hard — no aparece en otros estados).
  - Rol del usuario actual === `ADMIN`. En mock, el rol viene de un tweak (ADMIN / COORDINADOR / OPERARIO). Si no es ADMIN, el botón **no aparece** (no solo deshabilitado, oculto).
- Doble confirmación destructiva.

### 5. Campos del formulario
- **Progreso al cerrar** (lectura): "Has plantado X de Y árboles, Z%".
- **Selector de motivo** (`motivo_cierre_parcial` enum, obligatorio).
- **Observaciones** (texto libre, opcional). Si `motivo === 'OTRO'`, observaciones se vuelve obligatorio.
- **Checkbox de confirmación obligatorio**: "Entiendo que esta acción no se puede deshacer ni reabrir. Si aparece stock nuevo, se crea una nueva sub-campaña."
- (Opcional, UX defensiva): "Escribe el nombre de la sub-campaña para confirmar". Solo si quieren más fricción.

### 6. UX patterns destructivos
- Color ámbar en el botón final (no rojo — no es destrucción de datos, es cierre operativo).
- Modal full-screen o pantalla dedicada con copy explicativo claro.
- Botón "Confirmar cierre parcial" deshabilitado hasta:
  - Motivo seleccionado.
  - Checkbox de confirmación tildado.
  - (Si motivo === OTRO) observaciones con texto.

### 7. Evento generado (a mockear en `AdminData.jsx`)
Al confirmar, agregar al historial mock de la sub-campaña:
```js
{
  tipo: 'SUBCAMPANIA_FINALIZADA_PARCIAL',
  fecha_evento: '2026-05-25T15:30:00Z',
  usuario_id: '<admin>',
  motivo_cierre_parcial: '<enum>',
  observaciones: '<texto>',
  progreso_al_cerrar: { plantados, meta, pct },
  fecha_cierre_operativo: '2026-05-25',
  fecha_fin_mantenimiento: '2029-05-25',  // +3 años
}
```

### 8. Comportamiento post-cierre (visualizar en sub-campaña tras cierre)
- Estado: `FINALIZADA_PARCIAL`.
- Fase de mantenimiento: pasa automáticamente a `MANTENIMIENTO_ACTIVO` (3 años de ventana configurable).
- Acciones bloqueadas: registrar plantación inicial, asignar con propósito PLANTACION_INICIAL.
- Acciones permitidas: reportar mortandad, registrar reposición, asignar con propósito REPOSICION, devolver al vivero.
- **No hay reapertura** — el copy debe ser explícito.

## Archivos afectados / nuevos

- **Nuevo**: `Finalizar parcial.html`, `admin/FinalizarParcialScreen.jsx`.
- `admin/DetalleSubcampanaScreen.jsx` — botón disparador en `DSCMoreSheet` (ya existe la estructura; agregar entrada con gate de rol).
- `admin/AdminData.jsx` — agregar `MOTIVO_CIERRE_PARCIAL` y un ejemplo de sub-campaña ya finalizada parcial (ya hay `SUB-022-A`).

## Dependencias / orden

- Depende de 01 (estados ✅).
- Independiente del resto.

## Notas

- La ventana de 3 años de mantenimiento es **configurable a nivel sistema**. En el mock, hardcodearla como constante visible (ej. `MANTENIMIENTO_VENTANA_ANOS = 3`).
- En el mock actual ya existe `SUB-022-A` (Achumani Norte) como ejemplo de sub-campaña FINALIZADA_PARCIAL en MANTENIMIENTO_ACTIVO — usarla como referencia para qué muestra el detalle post-cierre.
- Mostrar en el sheet "Más opciones" del Detalle un visual distinto si el usuario no es ADMIN (la opción no aparece para coordinador/operario).
