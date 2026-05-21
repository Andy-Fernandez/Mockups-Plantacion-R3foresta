# 09 — Pantalla "Marcar FINALIZADA_PARCIAL"

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](00-README.md).

**Prioridad:** Media
**Bloque:** B — Pantallas nuevas

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

### 3. Modelo: catálogo de motivos
```js
const MOTIVOS_FINALIZACION_PARCIAL = [
  'CAMBIO_DE_PRIORIDADES',
  'FALTA_DE_STOCK',
  'PROBLEMA_DE_ZONA',
  'CANCELACION_ORGANIZACION',
  'OTRO',
];
```

### 4. Disparadores de la pantalla
- Desde `admin/DetalleSubcampanaScreen.jsx`: botón "Marcar como FINALIZADA_PARCIAL" solo si:
  - Estado actual === `ACTIVA`.
  - Usuario es admin (en mock siempre lo es, pero dejar el gate semántico).
- Confirmación destructiva con doble paso.

### 5. UX patterns destructivos
- Color ámbar/rojo en el botón final.
- Modal/screen full con copy explicativo.
- Botón "Confirmar" deshabilitado hasta que el usuario:
  - Seleccione motivo.
  - (Opcional) escriba un texto de confirmación o tilde un checkbox de "Entiendo que no se puede deshacer".

### 6. Evento generado
Al confirmar, agregar evento al timeline de la subcampaña:
```js
{
  tipo: 'FINALIZACION_PARCIAL',
  fecha: '...',
  adminId: '...',
  motivo: '...',
  observaciones: '...',
  progresoAlCerrar: { plantados, meta, pct },
}
```

## Archivos afectados / nuevos

- **Nuevo**: `Finalizar parcial.html`, `admin/FinalizarParcialScreen.jsx`.
- `admin/DetalleSubcampanaScreen.jsx` — botón disparador.
- `admin/AdminData.jsx` — catálogo de motivos + ejemplo de subcampaña ya finalizada parcial.

## Dependencias / orden

- Depende de 01 (estados, especialmente `FINALIZADA_PARCIAL`).
- Independiente del resto.

## Notas

- Después de finalizar parcial, la subcampaña entra automáticamente a `MANTENIMIENTO_ACTIVO` (los 3 años cuentan desde la fecha de cierre).
- Las acciones de plantación inicial quedan bloqueadas; solo se permiten mortandad/reposición.
