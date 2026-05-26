# 06 — Home pública con mapa interactivo

> **Mockup hi-fi con énfasis funcional.** Datos hardcodeados pero **estructurados como el modelo real**. Lo importante es que un dev entienda qué objeto/evento se mostraría. Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta (es la cara del proyecto)
**Bloque:** B — Pantallas nuevas
**Referencia funcional:** RF-PLA-15 (vista pública), RF-PLA-14 (historial), RF-PLA-16 (blockchain), sec. 2.2 (estado derivado de campaña), sec. 11 procesos
**Rol:** Sin login. Todo el contenido es público en MVP (carácter blockchain de transparencia).

## Estado actual

No existe pantalla pública en este repo. `ui_kits/pwa/` tiene la PWA del operario (Home, Login, Recolecciones, Vivero), pero no la **vista pública sin login**.

## Lo que dice la guía

> Sección 3.1: "PWA pública — Home sin autenticación"

Componentes:
1. **Hero/encabezado**: título del proyecto + totalizadores grandes:
   - Árboles plantados.
   - Captura estimada CO₂.
   - Subcampañas activas.
   - Comunidades alcanzadas.
2. **Mapa interactivo principal**:
   - Polígonos de subcampañas (ACTIVA verde, MANTENIMIENTO_ACTIVO azul, MONITOREO_HISTORICO gris).
   - Pines GPS dentro de polígonos por cada registro de plantación.
   - Click polígono → panel con resumen.
   - Click pin → mini-tarjeta (foto, fecha, especies, cantidad, operario, lote origen).
3. **Barras de progreso** de subcampañas activas.
4. **Mosaico de campañas** con sus subcampañas anidadas.
5. **Sección de transparencia**: "Este proyecto vive en blockchain. Todos los datos son auditables."

> Sección 8: "Tono visual" — limpia, moderna, transparencia y naturaleza.

## Cambios concretos

### 1. Crear nuevo archivo HTML
`Home publica.html` en la raíz del repo (sigue convención existente con espacios).

### 2. Estructura del módulo
Nuevo directorio `publico/`:
- `Icon.jsx` (copia del set actual, mismo estilo SVG).
- `tweaks-panel.jsx` (variantes de mock — switches: con/sin actividad, fase activa vs mantenimiento, etc.).
- `PublicoData.jsx` — combina datos de campañas/subcampañas adelgazados a vista pública.
- `MapaPublico.jsx` — componente clave reutilizable (también para tarea 07).
- `HomePublicaScreen.jsx` — pantalla principal.

> **Sin BottomNav** ni referencias a usuario (no hay login).

### 3. Filtrado funcional crítico (RF-PLA-15)
La vista pública **NO muestra**:
- Sub-campañas en `BORRADOR` (regla explícita: solo aparecen al tener al menos 1 `PLANTACION_INICIAL` registrada).
- Campañas vacías (sin sub-campañas, o con todas en BORRADOR).

La vista pública **SÍ muestra** todo lo demás (ACTIVA, COMPLETADA, FINALIZADA_PARCIAL, ambas fases de mantenimiento). MVP sin restricciones de privacidad sobre nombres de operarios o coordinadores.

### 4. Estado derivado de la campaña padre (sec. 2.2)
La campaña paraguas **no tiene estado propio persistido**: se calcula del set de sub-campañas:

| Sub-campañas | Campaña se muestra como |
|---|---|
| Al menos una `ACTIVA` | `ACTIVA` |
| Todas cerradas + al menos una en `MANTENIMIENTO_ACTIVO` | `EN_MANTENIMIENTO` |
| Todas en `MONITOREO_HISTORICO` | `MONITOREO_HISTORICO` |

Ya está implementado en `admin/AdminData.jsx :: deriveCampanaEstado()`. Reusar.

### 5. Snapshots oficiales (sec. 2.14)
Los nombres mostrados públicamente vienen de **snapshots congelados al activar la sub-campaña**:
- `nombre_zona_snapshot`
- `nombre_coordinador_snapshot`
- `nombres_organizaciones_snapshot[]`

Si en el mock se quiere visualizar la diferencia entre nombre vivo vs snapshot, agregar un tweak. Si no, simplemente hardcodear los snapshots como strings.

### 6. Componente `MapaPublico`
- SVG estilizado (no Leaflet — repo es CDN sin build).
- Polígonos `<path>` con fill según fase:
  - `ACTIVA` → brand-500 (verde brillante).
  - `MANTENIMIENTO_ACTIVO` → azul.
  - `MONITOREO_HISTORICO` → slate (gris).
- Pines `<circle>` o icono pin por cada `PLANTACION_INICIAL` registrada.
- Click polígono → panel lateral con resumen de sub-campaña.
- Click pin → mini-tarjeta con: foto, fecha, especies, cantidad, operario (nombre snapshot), lote origen.

### 7. Totalizadores hero
Cuatro KPIs grandes con copy **honesto** (RF-PLA-15 + tarea 16):
- "Árboles plantados" (acumulado sub-campañas no-BORRADOR).
- "Captura **estimada** de CO₂" (proyección, no medición).
- "Sub-campañas activas".
- "Comunidades alcanzadas".

NO usar el `CO2LiveHero` con animación "midiendo en tiempo real" — eso sugiere medición física. Aquí va una cifra estática con tooltip "proyección basada en especies × cantidades × curvas promedio".

### 8. Mosaico de campañas
Cards con:
- Logos de organizaciones asociadas (1 o N).
- Nombre de campaña + estado derivado.
- Lista de sub-campañas anidadas con barra de progreso individual.
- Total árboles agregados.
- Link al detalle público (tarea 07).

### 9. Badge "verificable en blockchain" (RF-PLA-16)
Eventos anclados llevan un badge visual con icono `link` o `shield`:
- Eventos candidatos: `SUBCAMPANIA_ACTIVADA`, `PLANTACION_INICIAL`, `REPOSICION`, `SUBCAMPANIA_COMPLETADA`, `SUBCAMPANIA_FINALIZADA_PARCIAL`.
- Tooltip: "Anclado en blockchain · ver verificación" → link placeholder.
- El anclaje es **complementario**: si un evento no tiene anclaje, igual se muestra.

### 10. Sección de transparencia
Bloque al pie:
> "Este proyecto vive en blockchain. Todos los datos son auditables. Cada plantación tiene foto, GPS, especies y lote de origen verificables."

## Archivos afectados / nuevos

- **Nuevo**: `Home publica.html`.
- **Nuevo**: `publico/Icon.jsx`, `BottomNav.jsx`, `tweaks-panel.jsx` (duplicados según convención del repo).
- **Nuevo**: `publico/PublicoData.jsx`, `MapaPublico.jsx`, `HomePublicaScreen.jsx`.
- Reusar atomos: `Progress`, `StateBadge`, `AvatarPile` (copiar desde `admin/AdminShell.jsx`).

## Dependencias / orden

- Depende de 01–05 (modelo completo: estados, jerarquía, organizaciones, tipos, asignaciones con propósito) — todas ✅ hechas.
- `MapaPublico` se reusa en tarea 07.

## Notas

- El mapa NO necesita ser interactivo geográfico real — basta un SVG con polígonos posicionados manualmente sobre un fondo estilizado (como la inspiración en `admin/AdminShell.jsx :: MiniMap`).
- Sin login: no debe haber referencias a usuario actual ni "mi historial".
- Los datos mock deben venir de `SUBCAMPANAS_ADMIN` + `CAMPANAS_ADMIN_AGREGADAS` (ya hidratadas con organizaciones, asignaciones, estado derivado).
- Drill-down hacia Vivero (M2) y Recolección (M1) son **links placeholder** — esos módulos viven fuera del repo.
