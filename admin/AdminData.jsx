// Shared data for the Plantación admin surfaces.
// Datos del brief: Arborización La Paz 2026 (3000 árboles, San Miguel) +
// Reforestación Hampaturi Fase 1 (5000 árboles, Hampaturi).

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
};

// ── Conteo de campañas por estado ────────────────────────────────────────
const CAMPANAS_ESTADOS = {
  ACTIVA: 4,
  PAUSADA: 1,
  COMPLETADA: 7,
  BORRADOR: 2,
  CANCELADA: 1,
};

// ── Lista de campañas (para Dashboard, Detalle, Asignación) ─────────────
const CAMPANAS_ADMIN = [
  {
    id: 'CAM-2026-014',
    nombre: 'Arborización La Paz 2026',
    tipo: 'ARBORIZACION',
    estado: 'ACTIVA',
    zona: 'San Miguel · La Paz',
    coordinadora: 'María López',
    coordinadoraIniciales: 'ML',
    fechaInicio: '12 mar 2026',
    fechaFin:    '30 nov 2026',
    meta: 3000,
    plantados: 1240,
    supervivencia: 91,
    co2Proyectado: 75,        // toneladas
    hectareas: 4.2,
    equipoCount: 6,
    lotesCount: 3,
    eventosCount: 28,
    ultimoEvento: 'hace 2 horas · Juan Mamani · 12 árboles',
    mixPlanificado: [
      { especie: 'Jacarandá', cientifico: 'Jacaranda mimosifolia', maxPct: 40, plantados: 510 },
      { especie: 'Molle',     cientifico: 'Schinus molle',          maxPct: 40, plantados: 478 },
      { especie: 'Ceibo',     cientifico: 'Erythrina crista-galli', maxPct: 20, plantados: 252 },
    ],
  },
  {
    id: 'CAM-2026-007',
    nombre: 'Reforestación Hampaturi F1',
    tipo: 'REFORESTACION',
    estado: 'ACTIVA',
    zona: 'Comunidad Hampaturi',
    coordinadora: 'María López',
    coordinadoraIniciales: 'ML',
    fechaInicio: '08 ene 2026',
    fechaFin:    '20 dic 2026',
    meta: 5000,
    plantados: 2870,
    supervivencia: 84,
    co2Proyectado: 160,
    hectareas: 12.4,
    equipoCount: 12,
    lotesCount: 5,
    eventosCount: 54,
    ultimoEvento: 'hace 6 horas · Rosa Quispe · 45 árboles',
    mixPlanificado: [
      { especie: 'Queñua', cientifico: 'Polylepis incana',  maxPct: 40, plantados: 1150 },
      { especie: 'Kewiña', cientifico: 'Polylepis besseri', maxPct: 40, plantados: 1100 },
      { especie: 'Aliso',  cientifico: 'Alnus acuminata',   maxPct: 20, plantados:  620 },
    ],
  },
  {
    id: 'CAM-2025-022',
    nombre: 'Achumani Norte',
    tipo: 'ARBORIZACION',
    estado: 'PAUSADA',
    zona: 'Achumani · La Paz',
    coordinadora: 'Patricia Vargas',
    coordinadoraIniciales: 'PV',
    fechaInicio: '15 sep 2025',
    fechaFin:    '15 mar 2026',
    meta: 1200,
    plantados: 380,
    supervivencia: 71,
    co2Proyectado: 22,
    hectareas: 2.1,
    equipoCount: 4,
    lotesCount: 2,
    eventosCount: 11,
    ultimoEvento: 'hace 11 días · pausa por lluvias',
    pausaMotivo: 'Lluvias intensas · revisar 12 mar',
  },
  {
    id: 'CAM-2025-019',
    nombre: 'Sopocachi Verde',
    tipo: 'ARBORIZACION',
    estado: 'COMPLETADA',
    zona: 'Sopocachi · La Paz',
    coordinadora: 'María López',
    coordinadoraIniciales: 'ML',
    fechaInicio: '01 mar 2025',
    fechaFin:    '20 dic 2025',
    meta: 800,
    plantados: 812,
    supervivencia: 89,
    co2Proyectado: 18,
    hectareas: 1.8,
    equipoCount: 5,
    lotesCount: 2,
    eventosCount: 31,
    ultimoEvento: 'completada 20 dic 2025',
  },
];

// ── Personas disponibles para asignar a una campaña ──────────────────────
const PERSONAS = [
  { id: 'op-1', nombre: 'Juan Mamani',    rol: 'Operario',     iniciales: 'JM', plantadosTotal: 1240 },
  { id: 'op-2', nombre: 'Rosa Quispe',    rol: 'Operario',     iniciales: 'RQ', plantadosTotal: 980 },
  { id: 'op-3', nombre: 'Carlos Apaza',   rol: 'Operario',     iniciales: 'CA', plantadosTotal: 745 },
  { id: 'op-4', nombre: 'Ana Condori',    rol: 'Operario',     iniciales: 'AC', plantadosTotal: 532 },
  { id: 'op-5', nombre: 'Pedro Mamani',   rol: 'Operario',     iniciales: 'PM', plantadosTotal: 410 },
  { id: 'co-1', nombre: 'María López',    rol: 'Coordinadora', iniciales: 'ML', plantadosTotal: null },
  { id: 'co-2', nombre: 'Patricia Vargas',rol: 'Coordinadora', iniciales: 'PV', plantadosTotal: null },
];

// ── Lotes de vivero disponibles para despachar a plantación ─────────────
const LOTES_VIVERO = [
  { id: 'VIV-000123-REC-000045', especie: 'Jacarandá', cientifico: 'Jacaranda mimosifolia', saldo: 320,  vivero: 'Vivero Achumani',  subetapa: 'SOL_DIRECTO',  edadDias: 142 },
  { id: 'VIV-000131-REC-000051', especie: 'Molle',     cientifico: 'Schinus molle',          saldo: 480,  vivero: 'Vivero Achumani',  subetapa: 'MEDIA_SOMBRA', edadDias: 98 },
  { id: 'VIV-000118-REC-000038', especie: 'Ceibo',     cientifico: 'Erythrina crista-galli', saldo: 210,  vivero: 'Vivero Achumani',  subetapa: 'SOL_DIRECTO',  edadDias: 168 },
  { id: 'VIV-000142-REC-000062', especie: 'Queñua',    cientifico: 'Polylepis incana',       saldo: 560,  vivero: 'Vivero Hampaturi', subetapa: 'SOL_DIRECTO',  edadDias: 187 },
  { id: 'VIV-000145-REC-000065', especie: 'Kewiña',    cientifico: 'Polylepis besseri',      saldo: 740,  vivero: 'Vivero Hampaturi', subetapa: 'SOL_DIRECTO',  edadDias: 192 },
  { id: 'VIV-000139-REC-000058', especie: 'Aliso',     cientifico: 'Alnus acuminata',        saldo: 290,  vivero: 'Vivero Hampaturi', subetapa: 'MEDIA_SOMBRA', edadDias: 105 },
];

// ── Catálogo de especies disponibles para sugerir al crear campaña ──────
const CATALOGO_ESPECIES = [
  { especie: 'Jacarandá', cientifico: 'Jacaranda mimosifolia',  region: 'Urbano La Paz', viveroDisponible: 320 },
  { especie: 'Molle',     cientifico: 'Schinus molle',          region: 'Urbano La Paz', viveroDisponible: 480 },
  { especie: 'Ceibo',     cientifico: 'Erythrina crista-galli', region: 'Urbano La Paz', viveroDisponible: 210 },
  { especie: 'Queñua',    cientifico: 'Polylepis incana',       region: 'Altiplano',     viveroDisponible: 560 },
  { especie: 'Kewiña',    cientifico: 'Polylepis besseri',      region: 'Altiplano',     viveroDisponible: 740 },
  { especie: 'Aliso',     cientifico: 'Alnus acuminata',        region: 'Valles',        viveroDisponible: 290 },
  { especie: 'Pino',      cientifico: 'Pinus radiata',          region: 'Altiplano',     viveroDisponible: 0   },
];

// ── Actividad reciente del programa (Dashboard) ─────────────────────────
const ACTIVIDAD_RECIENTE = [
  { id: 'a-1', kind: 'PLANTACION', label: 'Juan Mamani · 12 árboles',                campana: 'Arborización La Paz 2026', tiempo: 'hace 2 h' },
  { id: 'a-2', kind: 'PLANTACION', label: 'Rosa Quispe · 45 árboles',                campana: 'Reforestación Hampaturi F1', tiempo: 'hace 6 h' },
  { id: 'a-3', kind: 'CAMPANA',    label: 'Nueva campaña en borrador',               campana: 'Cota Cota Verde', tiempo: 'hace 1 día' },
  { id: 'a-4', kind: 'EQUIPO',     label: 'Ana Condori asignada al equipo',          campana: 'Reforestación Hampaturi F1', tiempo: 'hace 2 días' },
  { id: 'a-5', kind: 'PAUSA',      label: 'Campaña pausada por lluvias',             campana: 'Achumani Norte', tiempo: 'hace 11 días' },
];

window.METRICAS_GLOBALES = METRICAS_GLOBALES;
window.CAMPANAS_ESTADOS = CAMPANAS_ESTADOS;
window.CAMPANAS_ADMIN = CAMPANAS_ADMIN;
window.PERSONAS = PERSONAS;
window.LOTES_VIVERO = LOTES_VIVERO;
window.CATALOGO_ESPECIES = CATALOGO_ESPECIES;
window.ACTIVIDAD_RECIENTE = ACTIVIDAD_RECIENTE;
