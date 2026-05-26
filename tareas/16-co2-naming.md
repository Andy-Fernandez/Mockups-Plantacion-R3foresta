# 16 — CO₂ "estimado/proyectado" vs métrica física real

> **Pulido de honestidad técnica.** Importante para un proyecto blockchain de transparencia: no decir "capturado" cuando es proyección.

**Prioridad:** Baja (pulido de copy)
**Bloque:** D — Componentes y copy
**Referencia funcional:** sec. 2.4, 3.1, 3.3, 7 procesos; RF-PLA-15 (vista pública). No es requerimiento explícito en el JSON, pero es coherencia con el espíritu del proyecto.
**Rol:** Cross-cutting (cualquier pantalla que muestre CO₂).

## Estado actual

Recién agregamos `CO2LiveHero` en `admin/DashboardScreen.jsx` con:
- Label: "CO₂ capturado · acumulado del programa"
- Contador en tiempo real (8 decimales)
- Texto: "midiendo ~2,88 kg / h en tiempo real"

Esto sugiere que el sistema **mide** captura física real, lo cual no es cierto en este módulo.

## Lo que dice la guía

> Sección 2.4, 3.1, 3.3, 7

La guía siempre habla de **"estimación / proyección"**, no medición:
- "Estimación de captura de carbono"
- "Captura estimada CO₂"
- "Captura estimada: 235 toneladas de CO₂ proyectadas"
- "captura estimada CO₂" en métricas de subcampaña

La captura real **no se mide** — se proyecta a partir de especies + cantidades plantadas + supervivencia, con tablas de absorción promedio por especie.

## Cambios concretos

### 1. Renombrar labels
- "CO₂ capturado" → **"CO₂ capturado (estimado)"** o **"Captura proyectada de CO₂"**.
- "midiendo ~2,88 kg / h en tiempo real" → **"proyección actualizada al segundo"** o **"~2,88 kg / h según modelo de captura"**.
- "Toneladas de CO₂ capturadas" → "Toneladas de CO₂ proyectadas".

### 2. Mantener la animación
La animación visual es buena (refuerza el storytelling de "está pasando ahora mismo"). Solo necesita honestidad semántica en el copy.

### 3. Pill alternativa
En vez de "Captura en vivo" como pill, considerar:
- "Modelo en vivo"
- "Proyección dinámica"
- "Estimación 2026"

Mantener el dot pulsante porque visualmente comunica "activo / vivo", pero el copy alrededor debe ser honesto.

### 4. Tooltip o nota al pie (opcional)
Pequeño icono `info` que al tap muestra:
> "Esta cifra es una proyección dinámica basada en las especies plantadas, cantidades y curvas de captura promedio por especie. No es una medición física directa."

## Archivos afectados

- `admin/DashboardScreen.jsx` — `CO2LiveHero` component.
- Cualquier otra pantalla que muestre CO₂ (futuro: detalle subcampaña, home pública).

## Dependencias / orden

- Independiente. Puede hacerse en cualquier momento.
- Bueno hacerlo antes de publicar mockups públicos (tarea 06, 07) para que el copy sea consistente desde el inicio.

## Notas

- El usuario explícitamente pidió "8 decimales y simular tiempo real". Esto no se cambia — solo se aclara conceptualmente con el copy alrededor.
- Esta tarea es de **honestidad técnica**, importante para un proyecto de transparencia blockchain.
