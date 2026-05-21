# 06 — Home pública con mapa interactivo

> **Solo mockup visual** — pantallas estáticas con datos hardcodeados en `*Data.jsx`. Sin lógica real, sin transiciones funcionales, sin cálculos en vivo. La idea es mostrar **cómo se ve**, no cómo funciona. Detalle en [00-README.md](00-README.md).

**Prioridad:** Alta (es la cara del proyecto según la guía)
**Bloque:** B — Pantallas nuevas

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
- `BottomNav.jsx` (opcional — quizá no aplica si no hay login).
- `tweaks-panel.jsx` (variantes de mock).
- `PublicoData.jsx` — combina datos de campañas/subcampañas adelgazados a vista pública.
- `MapaPublico.jsx` — componente clave reutilizable (también para tarea 07).
- `HomePublicaScreen.jsx` — pantalla principal.

### 3. Componente `MapaPublico`
- SVG estilizado (no Leaflet por estar en CDN sin build).
- Polígonos como `<path>` con fill según fase.
- Pines como `<circle>` o icono pin pequeño.
- Click → state que abre `MiniTarjeta` flotante.

### 4. Totalizadores hero
Reutilizar el `CO2LiveHero` que ya construimos, adaptado para tono público (más narrativo).

### 5. Mosaico de campañas
Cards con: logo de organizaciones, nombre, total árboles, % avance agregado, link a detalle.

## Archivos afectados / nuevos

- **Nuevo**: `Home publica.html`.
- **Nuevo**: `publico/Icon.jsx`, `BottomNav.jsx`, `tweaks-panel.jsx` (duplicados según convención del repo).
- **Nuevo**: `publico/PublicoData.jsx`, `MapaPublico.jsx`, `HomePublicaScreen.jsx`.
- Reusar atomos: `Progress`, `StateBadge`, `AvatarPile` (copiar desde `admin/AdminShell.jsx`).

## Dependencias / orden

- Depende de 01, 02, 03, 04 (modelo de datos correcto antes de mostrarlo público).
- `MapaPublico` se reusará en tarea 07.

## Notas

- El mapa NO necesita ser interactivo geográfico real — basta un SVG con polígonos posicionados manualmente sobre un fondo estilizado (como la inspiración en `admin/AdminShell.jsx` `MiniMap`).
- Sin login: no debe haber referencias a usuario actual ni "mi historial".
