// Shared data for the Plantación admin surfaces.
//
// Modelo jerárquico:
//   Programa (constante del tenant)
//     └─ Campaña paraguas (CAMPANAS_ADMIN)        — coordinación / agregación
//          └─ Sub-campaña (SUBCAMPANAS_ADMIN)     — ejecución (fuente primaria)
//
// La sub-campaña es la fuente única de verdad operativa. La campaña paraguas
// no escribe nunca su propia meta/plantados/equipo/mix — los recibe agregados
// de sus hijas al cargar el módulo.
//
// Sub-campaña ≡ Etapa: misma tabla técnica, discriminada por `tipo`
// (COMUNIDAD · ETAPA · URBANA). El label visible depende de `tipo`.

// ── Programa (constante por tenant) ──────────────────────────────────────
const PROGRAMA = {
  id: 'PRG-PLANTACION-2026',
  nombre: 'Programa de plantación',
  anio: 2026,
};

// ── Métricas globales del programa (Dashboard hero) ──────────────────────
const METRICAS_GLOBALES = {
  arbolesPlantados:     14238,
  arbolesMeta:          20000,
  arbolesAnioAnterior:   8920,
  supervivenciaPct:        87,
  supervivenciaMeta:       85,
  co2Toneladas:           235,
  co2Meta:                400,
  hectareas:             18.6,
  hectareasMeta:           30,
  especiesPlantadas:       12,
  especiesMeta:            18,
};

// ── Personas disponibles ─────────────────────────────────────────────────
const PERSONAS = [
  { id: 'op-1', nombre: 'Juan Mamani',    rol: 'Operario',     iniciales: 'JM', plantadosTotal: 1240 },
  { id: 'op-2', nombre: 'Rosa Quispe',    rol: 'Operario',     iniciales: 'RQ', plantadosTotal: 980 },
  { id: 'op-3', nombre: 'Carlos Apaza',   rol: 'Operario',     iniciales: 'CA', plantadosTotal: 745 },
  { id: 'op-4', nombre: 'Ana Condori',    rol: 'Operario',     iniciales: 'AC', plantadosTotal: 532 },
  { id: 'op-5', nombre: 'Pedro Mamani',   rol: 'Operario',     iniciales: 'PM', plantadosTotal: 410 },
  { id: 'op-6', nombre: 'Lucía Choque',   rol: 'Operario',     iniciales: 'LC', plantadosTotal: 320 },
  { id: 'op-7', nombre: 'Mario Villca',   rol: 'Operario',     iniciales: 'MV', plantadosTotal: 280 },
  { id: 'co-1', nombre: 'María López',    rol: 'Coordinadora', iniciales: 'ML', plantadosTotal: null },
  { id: 'co-2', nombre: 'Patricia Vargas',rol: 'Coordinadora', iniciales: 'PV', plantadosTotal: null },
  { id: 'co-3', nombre: 'Daniel Mendoza', rol: 'Coordinador',  iniciales: 'DM', plantadosTotal: null },
];

const personaById = (id) => PERSONAS.find(p => p.id === id) || null;

// ── Organizaciones asociadas a campañas paraguas ─────────────────────────
const ORGANIZACIONES = [
  { id: 'org-r3', nombre: 'R3foresta' },
  { id: 'org-gamlp', nombre: 'Gobierno Municipal de La Paz' },
  { id: 'org-hamp', nombre: 'Comunidad Hampaturi' },
  { id: 'org-jv', nombre: 'Junta vecinal' },
];

const organizacionById = (id) => ORGANIZACIONES.find(o => o.id === id) || null;

// ── Lotes de vivero ──────────────────────────────────────────────────────
const LOTES_VIVERO = [
  { id: 'VIV-000123-REC-000045', especie: 'Jacarandá', cientifico: 'Jacaranda mimosifolia', saldo: 320,  vivero: 'Vivero Achumani',  subetapa: 'SOL_DIRECTO',  edadDias: 142 },
  { id: 'VIV-000131-REC-000051', especie: 'Molle',     cientifico: 'Schinus molle',          saldo: 480,  vivero: 'Vivero Achumani',  subetapa: 'MEDIA_SOMBRA', edadDias: 98 },
  { id: 'VIV-000118-REC-000038', especie: 'Ceibo',     cientifico: 'Erythrina crista-galli', saldo: 210,  vivero: 'Vivero Achumani',  subetapa: 'SOL_DIRECTO',  edadDias: 168 },
  { id: 'VIV-000142-REC-000062', especie: 'Queñua',    cientifico: 'Polylepis incana',       saldo: 560,  vivero: 'Vivero Hampaturi', subetapa: 'SOL_DIRECTO',  edadDias: 187 },
  { id: 'VIV-000145-REC-000065', especie: 'Kewiña',    cientifico: 'Polylepis besseri',      saldo: 740,  vivero: 'Vivero Hampaturi', subetapa: 'SOL_DIRECTO',  edadDias: 192 },
  { id: 'VIV-000139-REC-000058', especie: 'Aliso',     cientifico: 'Alnus acuminata',        saldo: 290,  vivero: 'Vivero Hampaturi', subetapa: 'MEDIA_SOMBRA', edadDias: 105 },
];

// ── Catálogo de especies ─────────────────────────────────────────────────
const CATALOGO_ESPECIES = [
  { especie: 'Jacarandá', cientifico: 'Jacaranda mimosifolia',  region: 'Urbano La Paz', viveroDisponible: 320 },
  { especie: 'Molle',     cientifico: 'Schinus molle',          region: 'Urbano La Paz', viveroDisponible: 480 },
  { especie: 'Ceibo',     cientifico: 'Erythrina crista-galli', region: 'Urbano La Paz', viveroDisponible: 210 },
  { especie: 'Queñua',    cientifico: 'Polylepis incana',       region: 'Altiplano',     viveroDisponible: 560 },
  { especie: 'Kewiña',    cientifico: 'Polylepis besseri',      region: 'Altiplano',     viveroDisponible: 740 },
  { especie: 'Aliso',     cientifico: 'Alnus acuminata',        region: 'Valles',        viveroDisponible: 290 },
  { especie: 'Pino',      cientifico: 'Pinus radiata',          region: 'Altiplano',     viveroDisponible: 0   },
];

// ── Campañas paraguas (metadatos de coordinación) ────────────────────────
// Solo contienen información estratégica. Todo lo operativo vive en las
// sub-campañas y se deriva al vuelo en `selectCampanaAgregado()`.
const CAMPANAS_ADMIN = [
  {
    id: 'CAM-2026-014',
    programaId: 'PRG-PLANTACION-2026',
    nombre: 'Arborización La Paz 2026',
    organizacionIds: ['org-r3', 'org-gamlp'],
    descripcion: 'Campaña marco para coordinar comunidades, planificación territorial y metas de plantación urbana.',
    fechaInicioEstimadaISO: '2026-03-12',
    fechaFinEstimadaISO:    '2026-11-30',
  },
  {
    id: 'CAM-2026-007',
    programaId: 'PRG-PLANTACION-2026',
    nombre: 'Reforestación Hampaturi F1',
    organizacionIds: ['org-r3', 'org-hamp'],
    descripcion: 'Recuperación de bosque nativo altoandino con especies de Polylepis en cuenca alta.',
    fechaInicioEstimadaISO: '2026-01-08',
    fechaFinEstimadaISO:    '2026-12-20',
  },
  {
    id: 'CAM-2025-022',
    programaId: 'PRG-PLANTACION-2026',
    nombre: 'Achumani Norte',
    organizacionIds: ['org-r3', 'org-jv'],
    descripcion: 'Arborización de barrio en ladera, frente al parque urbano.',
    fechaInicioEstimadaISO: '2025-09-15',
    fechaFinEstimadaISO:    '2026-03-15',
  },
  {
    id: 'CAM-2025-019',
    programaId: 'PRG-PLANTACION-2026',
    nombre: 'Sopocachi Verde',
    organizacionIds: ['org-r3', 'org-gamlp'],
    descripcion: 'Plan de arborización en aceras de barrio céntrico.',
    fechaInicioEstimadaISO: '2025-03-01',
    fechaFinEstimadaISO:    '2025-12-20',
  },
];

// ── Sub-campañas (fuente primaria de la verdad operativa) ────────────────
const SUBCAMPANAS_ADMIN = [
  // ── CAM-2026-014 · Arborización La Paz · 4 hijas ──
  {
    id: 'SUB-014-A',
    campanaId: 'CAM-2026-014',
    tipo: 'COMUNIDAD',
    nombre: 'San Miguel',
    comunidad: 'San Miguel',
    municipio: 'La Paz · Sur',
    estado: 'BORRADOR',
    coordinadorId: 'co-1',
    coordinador: 'María López',
    coordinadorIniciales: 'ML',
    fechaInicio: '12 mar 2026',
    fechaFin:    '30 jun 2026',
    fechaInicioISO: '2026-03-12',
    fechaFinISO:    '2026-06-30',
    cobertura: { tipo: 'POLIGONO', label: 'Polígono San Miguel · 1,2 ha' },
    hectareas: 1.2,
    meta: 800,
    plantados: 0,
    supervivencia: null,
    co2Proyectado: 18,
    eventosCount: 2,
    ultimoEvento: 'creada hace 3 días',
    mixPlanificado: [
      { especie: 'Jacarandá', cientifico: 'Jacaranda mimosifolia', maxPct: 50, plantados: 0 },
      { especie: 'Molle',     cientifico: 'Schinus molle',         maxPct: 50, plantados: 0 },
    ],
    equipoIds: ['co-1', 'op-1', 'op-3'],
    lotesIds: ['VIV-000123-REC-000045'],
  },
  {
    id: 'SUB-014-B',
    campanaId: 'CAM-2026-014',
    tipo: 'COMUNIDAD',
    nombre: 'Achocalla',
    comunidad: 'Achocalla',
    municipio: 'La Paz · Sur',
    estado: 'ACTIVA',
    coordinadorId: 'co-1',
    coordinador: 'María López',
    coordinadorIniciales: 'ML',
    fechaInicio: '12 mar 2026',
    fechaFin:    '30 sep 2026',
    fechaInicioISO: '2026-03-12',
    fechaFinISO:    '2026-09-30',
    cobertura: { tipo: 'POLIGONO', label: 'Polígono Achocalla · 1,4 ha' },
    hectareas: 1.4,
    meta: 900,
    plantados: 720,
    supervivencia: 92,
    co2Proyectado: 22,
    eventosCount: 18,
    ultimoEvento: 'hace 2 horas · Juan Mamani · 12 árboles',
    mixPlanificado: [
      { especie: 'Jacarandá', cientifico: 'Jacaranda mimosifolia', maxPct: 40, plantados: 290 },
      { especie: 'Molle',     cientifico: 'Schinus molle',         maxPct: 40, plantados: 288 },
      { especie: 'Ceibo',     cientifico: 'Erythrina crista-galli',maxPct: 20, plantados: 142 },
    ],
    equipoIds: ['co-1', 'op-1', 'op-2', 'op-4'],
    lotesIds: ['VIV-000123-REC-000045', 'VIV-000131-REC-000051'],
  },
  {
    id: 'SUB-014-C',
    campanaId: 'CAM-2026-014',
    tipo: 'URBANA',
    nombre: 'Etapa central · Av. Camacho',
    comunidad: null,
    municipio: 'La Paz · Centro',
    estado: 'ACTIVA',
    coordinadorId: 'co-3',
    coordinador: 'Daniel Mendoza',
    coordinadorIniciales: 'DM',
    fechaInicio: '20 mar 2026',
    fechaFin:    '20 ago 2026',
    fechaInicioISO: '2026-03-20',
    fechaFinISO:    '2026-08-20',
    cobertura: { tipo: 'CALLES', label: '8 calles · 1,1 km' },
    hectareas: 0.8,
    meta: 700,
    plantados: 520,
    supervivencia: 89,
    co2Proyectado: 14,
    eventosCount: 11,
    ultimoEvento: 'ayer · Carlos Apaza · 28 árboles',
    mixPlanificado: [
      { especie: 'Molle', cientifico: 'Schinus molle',          maxPct: 60, plantados: 312 },
      { especie: 'Ceibo', cientifico: 'Erythrina crista-galli', maxPct: 40, plantados: 208 },
    ],
    equipoIds: ['co-3', 'op-3', 'op-5'],
    lotesIds: ['VIV-000131-REC-000051', 'VIV-000118-REC-000038'],
  },
  {
    id: 'SUB-014-D',
    campanaId: 'CAM-2026-014',
    tipo: 'COMUNIDAD',
    nombre: 'Mallasa',
    comunidad: 'Mallasa',
    municipio: 'La Paz · Sur',
    estado: 'BORRADOR',
    coordinadorId: null,
    coordinador: null,
    coordinadorIniciales: null,
    fechaInicio: '',
    fechaFin:    '',
    fechaInicioISO: '',
    fechaFinISO:    '',
    cobertura: null,
    hectareas: 0,
    meta: 600,
    plantados: 0,
    supervivencia: null,
    co2Proyectado: 0,
    eventosCount: 0,
    ultimoEvento: 'pendiente de configuración',
    mixPlanificado: [],
    equipoIds: [],
    lotesIds: [],
  },

  // ── CAM-2026-007 · Reforestación Hampaturi · 3 hijas ──
  {
    id: 'SUB-007-A',
    campanaId: 'CAM-2026-007',
    tipo: 'COMUNIDAD',
    nombre: 'Hampaturi Alto',
    comunidad: 'Hampaturi Alto',
    municipio: 'Hampaturi',
    estado: 'ACTIVA',
    coordinadorId: 'co-1',
    coordinador: 'María López',
    coordinadorIniciales: 'ML',
    fechaInicio: '08 ene 2026',
    fechaFin:    '20 dic 2026',
    fechaInicioISO: '2026-01-08',
    fechaFinISO:    '2026-12-20',
    cobertura: { tipo: 'POLIGONO', label: 'Polígono Alto · 5,8 ha' },
    hectareas: 5.8,
    meta: 2000,
    plantados: 1670,
    supervivencia: 86,
    co2Proyectado: 86,
    eventosCount: 32,
    ultimoEvento: 'hace 6 horas · Rosa Quispe · 45 árboles',
    mixPlanificado: [
      { especie: 'Queñua', cientifico: 'Polylepis incana',  maxPct: 50, plantados: 820 },
      { especie: 'Kewiña', cientifico: 'Polylepis besseri', maxPct: 50, plantados: 850 },
    ],
    equipoIds: ['co-1', 'op-2', 'op-4', 'op-5', 'op-7'],
    lotesIds: ['VIV-000142-REC-000062', 'VIV-000145-REC-000065'],
  },
  {
    id: 'SUB-007-B',
    campanaId: 'CAM-2026-007',
    tipo: 'COMUNIDAD',
    nombre: 'Hampaturi Bajo',
    comunidad: 'Hampaturi Bajo',
    municipio: 'Hampaturi',
    estado: 'ACTIVA',
    coordinadorId: 'co-2',
    coordinador: 'Patricia Vargas',
    coordinadorIniciales: 'PV',
    fechaInicio: '08 ene 2026',
    fechaFin:    '20 dic 2026',
    fechaInicioISO: '2026-01-08',
    fechaFinISO:    '2026-12-20',
    cobertura: { tipo: 'POLIGONO', label: 'Polígono Bajo · 4,6 ha' },
    hectareas: 4.6,
    meta: 2000,
    plantados: 1200,
    supervivencia: 82,
    co2Proyectado: 60,
    eventosCount: 22,
    ultimoEvento: 'hace 1 día · Pedro Mamani · 22 árboles',
    mixPlanificado: [
      { especie: 'Queñua', cientifico: 'Polylepis incana',  maxPct: 50, plantados: 580 },
      { especie: 'Kewiña', cientifico: 'Polylepis besseri', maxPct: 50, plantados: 620 },
    ],
    equipoIds: ['co-2', 'op-2', 'op-4', 'op-6'],
    lotesIds: ['VIV-000145-REC-000065', 'VIV-000139-REC-000058'],
  },
  {
    id: 'SUB-007-C',
    campanaId: 'CAM-2026-007',
    tipo: 'ETAPA',
    nombre: 'Etapa 2 · Pinar Sur',
    comunidad: 'Hampaturi Sur',
    municipio: 'Hampaturi',
    estado: 'BORRADOR',
    coordinadorId: 'co-2',
    coordinador: 'Patricia Vargas',
    coordinadorIniciales: 'PV',
    fechaInicio: '01 jul 2026',
    fechaFin:    '20 dic 2026',
    fechaInicioISO: '2026-07-01',
    fechaFinISO:    '2026-12-20',
    cobertura: { tipo: 'POLIGONO', label: 'Polígono Pinar Sur · 2,0 ha' },
    hectareas: 2.0,
    meta: 1000,
    plantados: 0,
    supervivencia: null,
    co2Proyectado: 14,
    eventosCount: 1,
    ultimoEvento: 'configurada hace 5 días',
    mixPlanificado: [
      { especie: 'Aliso', cientifico: 'Alnus acuminata', maxPct: 100, plantados: 0 },
    ],
    equipoIds: ['co-2', 'op-6', 'op-7'],
    lotesIds: ['VIV-000139-REC-000058'],
  },

  // ── CAM-2025-022 · Achumani Norte · 1 hija ──
  {
    id: 'SUB-022-A',
    campanaId: 'CAM-2025-022',
    tipo: 'COMUNIDAD',
    nombre: 'Achumani Norte',
    comunidad: 'Achumani',
    municipio: 'La Paz · Sur',
    estado: 'FINALIZADA_PARCIAL',
    faseMantenimiento: 'MANTENIMIENTO_ACTIVO',
    mesesRestantesMantenimiento: 26,
    coordinadorId: 'co-2',
    coordinador: 'Patricia Vargas',
    coordinadorIniciales: 'PV',
    fechaInicio: '15 sep 2025',
    fechaFin:    '15 mar 2026',
    fechaInicioISO: '2025-09-15',
    fechaFinISO:    '2026-03-15',
    cobertura: { tipo: 'POLIGONO', label: 'Polígono Achumani · 2,1 ha' },
    hectareas: 2.1,
    meta: 1200,
    plantados: 380,
    supervivencia: 71,
    co2Proyectado: 22,
    eventosCount: 11,
    ultimoEvento: 'cerrada parcialmente · 15 mar 2026',
    motivoCierreParcial: 'Lluvias intensas · cierre anticipado',
    mixPlanificado: [
      { especie: 'Jacarandá', cientifico: 'Jacaranda mimosifolia', maxPct: 60, plantados: 230 },
      { especie: 'Molle',     cientifico: 'Schinus molle',         maxPct: 40, plantados: 150 },
    ],
    equipoIds: ['co-2', 'op-3', 'op-5'],
    lotesIds: ['VIV-000123-REC-000045', 'VIV-000118-REC-000038'],
  },

  // ── CAM-2025-019 · Sopocachi Verde · 1 hija ──
  {
    id: 'SUB-019-A',
    campanaId: 'CAM-2025-019',
    tipo: 'COMUNIDAD',
    nombre: 'Sopocachi',
    comunidad: 'Sopocachi',
    municipio: 'La Paz · Centro',
    estado: 'COMPLETADA',
    faseMantenimiento: 'MONITOREO_HISTORICO',
    mesesRestantesMantenimiento: null,
    coordinadorId: 'co-1',
    coordinador: 'María López',
    coordinadorIniciales: 'ML',
    fechaInicio: '01 mar 2025',
    fechaFin:    '20 dic 2025',
    fechaInicioISO: '2025-03-01',
    fechaFinISO:    '2025-12-20',
    cobertura: { tipo: 'POLIGONO', label: 'Polígono Sopocachi · 1,8 ha' },
    hectareas: 1.8,
    meta: 800,
    plantados: 812,
    supervivencia: 89,
    co2Proyectado: 18,
    eventosCount: 31,
    ultimoEvento: 'completada 20 dic 2025',
    mixPlanificado: [
      { especie: 'Molle', cientifico: 'Schinus molle',          maxPct: 50, plantados: 410 },
      { especie: 'Ceibo', cientifico: 'Erythrina crista-galli', maxPct: 50, plantados: 402 },
    ],
    equipoIds: ['co-1', 'op-1', 'op-2', 'op-3', 'op-4'],
    lotesIds: ['VIV-000131-REC-000051', 'VIV-000118-REC-000038'],
  },
];

// ── Máquina de estados de sub-campaña (4 estados según guía Módulo 3) ────
// BORRADOR → ACTIVA (al activar wizard)
// ACTIVA   → COMPLETADA (automático al alcanzar meta)
// ACTIVA   → FINALIZADA_PARCIAL (manual admin, con motivo)
// Estados terminales: COMPLETADA, FINALIZADA_PARCIAL (append-only).
//
// Fase de mantenimiento (paralela, no es un estado): se activa al cerrar la
// sub-campaña. Empieza en MANTENIMIENTO_ACTIVO (3 años) y luego pasa a
// MONITOREO_HISTORICO.
const TRANSICIONES_SUBCAMPANA = {
  BORRADOR:           ['ACTIVA'],
  ACTIVA:             ['COMPLETADA', 'FINALIZADA_PARCIAL'],
  COMPLETADA:         [],
  FINALIZADA_PARCIAL: [],
};

// Devuelve { ok, faltantes[] } indicando si la transición es válida y qué falta.
function puedeTransitionar(sub, destino) {
  if (!TRANSICIONES_SUBCAMPANA[sub.estado]?.includes(destino)) {
    return { ok: false, faltantes: ['transición no permitida desde ' + sub.estado] };
  }
  const faltantes = [];
  if (destino === 'ACTIVA') {
    if (!sub.coordinadorId) faltantes.push('coordinador');
    if (!sub.fechaInicioISO || !sub.fechaFinISO) faltantes.push('fechas');
    if (!sub.meta) faltantes.push('meta');
    if (!sub.cobertura) faltantes.push('cobertura');
    if (!sub.mixPlanificado || sub.mixPlanificado.length === 0) faltantes.push('mix de especies');
  }
  return { ok: faltantes.length === 0, faltantes };
}

// Etiquetas de estado para sub-campaña (mismo set que ESTADO_META en AdminShell).
const ESTADO_SUBCAMPANA_META = {
  BORRADOR:           { label: 'BORRADOR',             short: 'BORRADOR',   tone: 'bg-slate-100 text-slate-700 ring-slate-200',     dot: 'bg-slate-400' },
  ACTIVA:             { label: 'ACTIVA',               short: 'ACTIVA',     tone: 'bg-emerald-50 text-emerald-800 ring-emerald-100', dot: 'bg-emerald-500' },
  COMPLETADA:         { label: 'META ALCANZADA',       short: 'COMPLETADA', tone: 'bg-blue-50 text-blue-800 ring-blue-100',          dot: 'bg-blue-500' },
  FINALIZADA_PARCIAL: { label: 'CERRADA PARCIALMENTE', short: 'PARCIAL',    tone: 'bg-amber-50 text-amber-800 ring-amber-100',       dot: 'bg-amber-500' },
};

// Etiquetas de fase de mantenimiento.
const FASE_MANTENIMIENTO_META = {
  MANTENIMIENTO_ACTIVO: { label: 'MANTENIMIENTO ACTIVO', short: 'MANT. ACTIVO', tone: 'bg-blue-50 text-blue-800 ring-blue-100',     dot: 'bg-blue-500' },
  MONITOREO_HISTORICO:  { label: 'MONITOREO HISTÓRICO',  short: 'HISTÓRICO',    tone: 'bg-slate-100 text-slate-700 ring-slate-200', dot: 'bg-slate-400' },
};

// Label de tipo (sub-campaña) — derivado del enum.
const TIPO_SUBCAMPANA_LABEL = {
  COMUNIDAD: 'COMUNIDAD',
  ETAPA:     'ETAPA',
  URBANA:    'URBANA',
};

// ── Selectores derivados ────────────────────────────────────────────────
function subcampanasDe(campanaId) {
  return SUBCAMPANAS_ADMIN.filter(s => s.campanaId === campanaId);
}

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function formatDateShort(iso) {
  if (!iso) return 'Sin fecha';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d.toString().padStart(2, '0')} ${MESES_CORTOS[m - 1]} ${y}`;
}

function zonaResumenDe(subs) {
  const zonas = Array.from(new Set(subs.map(s => s.comunidad || s.municipio).filter(Boolean)));
  if (zonas.length === 0) return 'Sin zona';
  if (zonas.length === 1) return zonas[0];
  if (zonas.length === 2) return `${zonas[0]} · ${zonas[1]}`;
  return `${zonas[0]} +${zonas.length - 1} zonas`;
}

function deriveCampanaEstado(subs) {
  if (!subs.length) {
    return { estado: 'BORRADOR', faseMantenimiento: null, mesesRestantesMantenimiento: null, cierreTipoPrincipal: null };
  }

  const anyActiva = subs.some(s => s.estado === 'ACTIVA');
  const allClosed = subs.every(s => s.estado === 'COMPLETADA' || s.estado === 'FINALIZADA_PARCIAL');
  const allHistorico = allClosed && subs.every(s => s.faseMantenimiento === 'MONITOREO_HISTORICO');
  const anyMantenimiento = allClosed && subs.some(s => s.faseMantenimiento === 'MANTENIMIENTO_ACTIVO');
  const cierreTipoPrincipal = subs.some(s => s.estado === 'FINALIZADA_PARCIAL') ? 'FINALIZADA_PARCIAL' : 'COMPLETADA';
  const mesesRestantesMantenimiento = anyMantenimiento
    ? Math.max(...subs.map(s => s.faseMantenimiento === 'MANTENIMIENTO_ACTIVO' ? (s.mesesRestantesMantenimiento || 0) : 0))
    : null;

  if (anyActiva) {
    return { estado: 'ACTIVA', faseMantenimiento: null, mesesRestantesMantenimiento: null, cierreTipoPrincipal };
  }
  if (allHistorico) {
    return { estado: 'MONITOREO_HISTORICO', faseMantenimiento: 'MONITOREO_HISTORICO', mesesRestantesMantenimiento: null, cierreTipoPrincipal };
  }
  if (anyMantenimiento) {
    return { estado: 'EN_MANTENIMIENTO', faseMantenimiento: 'MANTENIMIENTO_ACTIVO', mesesRestantesMantenimiento, cierreTipoPrincipal };
  }
  if (allClosed) {
    return { estado: cierreTipoPrincipal, faseMantenimiento: null, mesesRestantesMantenimiento: null, cierreTipoPrincipal };
  }
  return { estado: 'BORRADOR', faseMantenimiento: null, mesesRestantesMantenimiento: null, cierreTipoPrincipal };
}

// Agrega los valores operativos de las hijas en un objeto plano. El paraguas
// NO almacena estos valores; los recibe de aquí.
function selectCampanaAgregado(campanaId) {
  const c = CAMPANAS_ADMIN.find(x => x.id === campanaId);
  if (!c) return null;
  const subs = subcampanasDe(campanaId);
  const estadoDerivado = deriveCampanaEstado(subs);
  const organizacionLabels = (c.organizacionIds || []).map(id => organizacionById(id)?.nombre).filter(Boolean);

  const meta       = subs.reduce((a, s) => a + (s.meta || 0), 0);
  const plantados  = subs.reduce((a, s) => a + (s.plantados || 0), 0);
  const hectareas  = Math.round(subs.reduce((a, s) => a + (s.hectareas || 0), 0) * 10) / 10;
  const co2Proyectado = subs.reduce((a, s) => a + (s.co2Proyectado || 0), 0);
  const eventosCount  = subs.reduce((a, s) => a + (s.eventosCount || 0), 0);

  // Supervivencia ponderada por plantados (ignora hijas sin plantados).
  const supSum = subs.reduce((a, s) => a + ((s.supervivencia || 0) * (s.plantados || 0)), 0);
  const supervivencia = plantados ? Math.round(supSum / plantados) : null;

  // Equipo y lotes: unión (distinct).
  const equipoTotal = Array.from(new Set(subs.flatMap(s => s.equipoIds || [])));
  const lotesComprometidos = Array.from(new Set(subs.flatMap(s => s.lotesIds || [])));

  // Distribución de estados.
  const distribucionEstados = subs.reduce((acc, s) => {
    acc[s.estado] = (acc[s.estado] || 0) + 1;
    return acc;
  }, {});

  const coordinadoresPendientes = subs.filter(s => !s.coordinadorId).length;
  const comunidadesCubiertas = new Set(subs.map(s => s.comunidad).filter(Boolean)).size;
  const operariosCount = Array.from(new Set(
    subs.flatMap(s => (s.equipoIds || []).filter(id => personaById(id)?.rol === 'Operario'))
  )).length;

  // Último evento del paraguas: el más reciente entre las hijas (heurística:
  // hijas ACTIVA primero, ordenadas por su ultimoEvento textual).
  const ultimaActiva = subs
    .filter(s => s.estado === 'ACTIVA')
    .map(s => s.ultimoEvento).find(Boolean);
  const ultimoEvento = ultimaActiva || subs.map(s => s.ultimoEvento).find(Boolean) || '';

  // Mix agregado: sumar plantados por especie a través de hijas.
  const mixMap = {};
  subs.forEach(s => (s.mixPlanificado || []).forEach(m => {
    if (!mixMap[m.especie]) {
      mixMap[m.especie] = {
        especie: m.especie,
        cientifico: m.cientifico,
        plantados: 0,
        metaPlanificada: 0,
        plantadosObjetivo: 0,
      };
    }
    mixMap[m.especie].plantados += (m.plantados || 0);
    mixMap[m.especie].plantadosObjetivo += Math.round((s.meta || 0) * (m.maxPct / 100));
  }));
  const maxPctTotal = meta ? 100 : 0;
  const mixAgregado = Object.values(mixMap).map(m => ({
    ...m,
    pctReal: plantados ? Math.round((m.plantados / plantados) * 100) : 0,
    pctObjetivo: meta ? Math.round((m.plantadosObjetivo / meta) * 100) : 0,
  })).sort((a, b) => b.plantadosObjetivo - a.plantadosObjetivo);

  // Coordinador más frecuente entre hijas. Se usa solo como resumen visual.
  const coordCount = {};
  subs.forEach(s => { if (s.coordinadorId) coordCount[s.coordinadorId] = (coordCount[s.coordinadorId] || 0) + 1; });
  const coordTopId = Object.keys(coordCount).sort((a, b) => coordCount[b] - coordCount[a])[0] || null;
  const coordTop = coordTopId ? personaById(coordTopId) : null;

  return {
    ...c,
    fechaInicio: formatDateShort(c.fechaInicioEstimadaISO),
    fechaFin: formatDateShort(c.fechaFinEstimadaISO),
    zona: zonaResumenDe(subs),
    organizacion: organizacionLabels.join(' · '),
    organizaciones: organizacionLabels,
    estado: estadoDerivado.estado,
    faseMantenimiento: estadoDerivado.faseMantenimiento,
    mesesRestantesMantenimiento: estadoDerivado.mesesRestantesMantenimiento,
    cierreTipoPrincipal: estadoDerivado.cierreTipoPrincipal,
    // Derivados — agregados
    meta,
    plantados,
    avancePct: meta ? Math.round((plantados / meta) * 100) : 0,
    hectareas,
    supervivencia,
    co2Proyectado,
    eventosCount,
    ultimoEvento,
    equipoTotal,           // string[] de personaIds
    equipoCount: equipoTotal.length,
    operariosCount,
    lotesComprometidos,    // string[] de loteIds
    lotesCount: lotesComprometidos.length,
    distribucionEstados,
    coordinadoresPendientes,
    comunidadesCubiertas,
    mixAgregado,
    mixPlanificado: mixAgregado.map(m => ({
      especie: m.especie,
      cientifico: m.cientifico,
      maxPct: m.pctObjetivo || 0,
      plantados: m.plantados,
    })),
    coordinadorResumen: coordTop?.nombre || null,
    coordinadorResumenIniciales: coordTop?.iniciales || null,
    subcampanas: subs,
    subcampanasCount: subs.length,
  };
}

const CAMPANAS_ADMIN_AGREGADAS = CAMPANAS_ADMIN
  .map(c => selectCampanaAgregado(c.id))
  .filter(Boolean);

const CAMPANAS_ESTADOS = CAMPANAS_ADMIN_AGREGADAS.reduce((acc, c) => {
  acc[c.estado] = (acc[c.estado] || 0) + 1;
  return acc;
}, {});

const CAMPANAS_FASE_MANTENIMIENTO = CAMPANAS_ADMIN_AGREGADAS.reduce((acc, c) => {
  if (c.faseMantenimiento) acc[c.faseMantenimiento] = (acc[c.faseMantenimiento] || 0) + 1;
  return acc;
}, {});

// ── Actividad reciente (con breadcrumb campaña › sub-campaña) ───────────
const ACTIVIDAD_RECIENTE = [
  {
    id: 'a-1', kind: 'PLANTACION', label: 'Juan Mamani · 12 árboles',
    campanaId: 'CAM-2026-014', subcampanaId: 'SUB-014-B', tiempo: 'hace 2 h',
  },
  {
    id: 'a-2', kind: 'PLANTACION', label: 'Rosa Quispe · 45 árboles',
    campanaId: 'CAM-2026-007', subcampanaId: 'SUB-007-A', tiempo: 'hace 6 h',
  },
  {
    id: 'a-3', kind: 'PLANTACION', label: 'Carlos Apaza · 28 árboles',
    campanaId: 'CAM-2026-014', subcampanaId: 'SUB-014-C', tiempo: 'ayer',
  },
  {
    id: 'a-4', kind: 'CAMPANA', label: 'Nueva sub-campaña en borrador',
    campanaId: 'CAM-2026-014', subcampanaId: 'SUB-014-D', tiempo: 'hace 1 día',
  },
  {
    id: 'a-5', kind: 'EQUIPO', label: 'Ana Condori asignada al equipo',
    campanaId: 'CAM-2026-007', subcampanaId: 'SUB-007-A', tiempo: 'hace 2 días',
  },
  {
    id: 'a-6', kind: 'CIERRE_PARCIAL', label: 'Sub-campaña cerrada parcialmente · lluvias',
    campanaId: 'CAM-2025-022', subcampanaId: 'SUB-022-A', tiempo: 'hace 11 días',
  },
];

// Resolver breadcrumb legible a partir de IDs.
function breadcrumbActividad(a) {
  const c = selectCampanaAgregado(a.campanaId);
  const s = SUBCAMPANAS_ADMIN.find(x => x.id === a.subcampanaId);
  if (!c) return '';
  if (!s) return c.nombre;
  return `${c.nombre} › ${s.nombre}`;
}

// ── Exports al window ────────────────────────────────────────────────────
window.PROGRAMA = PROGRAMA;
window.METRICAS_GLOBALES = METRICAS_GLOBALES;
window.CAMPANAS_ESTADOS = CAMPANAS_ESTADOS;
window.CAMPANAS_FASE_MANTENIMIENTO = CAMPANAS_FASE_MANTENIMIENTO;
window.CAMPANAS_ADMIN = CAMPANAS_ADMIN;
window.CAMPANAS_ADMIN_AGREGADAS = CAMPANAS_ADMIN_AGREGADAS;
window.SUBCAMPANAS_ADMIN = SUBCAMPANAS_ADMIN;
window.ORGANIZACIONES = ORGANIZACIONES;
window.PERSONAS = PERSONAS;
window.LOTES_VIVERO = LOTES_VIVERO;
window.CATALOGO_ESPECIES = CATALOGO_ESPECIES;
window.ACTIVIDAD_RECIENTE = ACTIVIDAD_RECIENTE;
window.TRANSICIONES_SUBCAMPANA = TRANSICIONES_SUBCAMPANA;
window.ESTADO_SUBCAMPANA_META = ESTADO_SUBCAMPANA_META;
window.FASE_MANTENIMIENTO_META = FASE_MANTENIMIENTO_META;
window.TIPO_SUBCAMPANA_LABEL = TIPO_SUBCAMPANA_LABEL;
window.puedeTransitionar = puedeTransitionar;
window.subcampanasDe = subcampanasDe;
window.selectCampanaAgregado = selectCampanaAgregado;
window.breadcrumbActividad = breadcrumbActividad;
window.personaById = personaById;
