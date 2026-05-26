// Mock data for Plantación flows.
// Keep it small and editable: this is only for prototype screens.

function assetPath(file) {
  return `${window.PLANTACION_ASSET_PREFIX || 'assets/'}${file}`;
}

const CAMPANAS = [
  {
    id: 'CAM-2026-014',
    nombre: 'Arborización La Paz 2026',
    tipo: 'ARBORIZACION',
    zona: 'San Miguel · La Paz',
    coordinadora: 'Ing. María López',
    meta: 3000,
    plantados: 1240,
    asignadosOperario: 80,
    distanciaKm: 0.4,
    mixPlanificado: [
      { especie: 'Jacarandá', cientifico: 'Jacaranda mimosifolia', maxPct: 40 },
      { especie: 'Molle', cientifico: 'Schinus molle', maxPct: 40 },
      { especie: 'Ceibo', cientifico: 'Erythrina crista-galli', maxPct: 20 },
    ],
  },
  {
    id: 'CAM-2026-007',
    nombre: 'Reforestación Hampaturi Fase 1',
    tipo: 'REFORESTACION',
    zona: 'Comunidad Hampaturi',
    coordinadora: 'Ing. María López',
    meta: 5000,
    plantados: 2870,
    asignadosOperario: 120,
    distanciaKm: 18.2,
    mixPlanificado: [
      { especie: 'Queñua', cientifico: 'Polylepis incana', maxPct: 40 },
      { especie: 'Kewiña', cientifico: 'Polylepis besseri', maxPct: 40 },
      { especie: 'Aliso', cientifico: 'Alnus acuminata', maxPct: 20 },
    ],
  },
];

const EQUIPO = [
  { id: 'op-2', nombre: 'Rosa Quispe', rol: 'Operario', iniciales: 'RQ' },
  { id: 'op-3', nombre: 'Carlos Apaza', rol: 'Operario', iniciales: 'CA' },
  { id: 'op-4', nombre: 'Ana Condori', rol: 'Operario', iniciales: 'AC' },
  { id: 'op-5', nombre: 'Pedro Mamani', rol: 'Operario', iniciales: 'PM' },
  { id: 'op-6', nombre: 'Lucía Choque', rol: 'Operario', iniciales: 'LC' },
  { id: 'op-7', nombre: 'Mario Villca', rol: 'Operario', iniciales: 'MV' },
  { id: 'co-1', nombre: 'María López', rol: 'Coordinadora', iniciales: 'ML' },
  { id: 'co-2', nombre: 'Patricia Vargas', rol: 'Coordinadora', iniciales: 'PV' },
];

const ME = { id: 'op-1', nombre: 'Juan Mamani', rol: 'Operario', iniciales: 'JM' };

const PHOTOS_SAMPLE = [
  { url: assetPath('plantacion.jpg'), label: 'Grupo plantado #1' },
  { url: assetPath('germinacion.jpg'), label: 'Detalle base de árbol' },
  { url: assetPath('co2.jpg'), label: 'Vista de la zona' },
];

const GPS_FIX = { lat: -16.5158, lng: -68.0833, accuracy: 4, capturadoEn: '08:34' };
const GPS_TOLERANCIA_METROS = 50;

const HOY = { plantadosHoy: 87, campanasHoy: 2, ultimoRegistro: '08:12' };

const CAUSAS_MORTANDAD_PLANTACION = [
  'SEQUIA',
  'EXCESO_AGUA',
  'HELADA',
  'GRANIZO',
  'PLAGA',
  'ENFERMEDAD',
  'SUELO_INADECUADO',
  'FALTA_MANTENIMIENTO',
  'DANO_MECANICO',
  'PASTOREO',
  'VANDALISMO',
  'INCENDIO',
  'COMPETENCIA_MALEZA',
  'TRASPLANTE_DEFICIENTE',
  'DESCONOCIDA',
  'OTRO',
];

const SUBCAMPANIAS_OPERATIVAS = [
  {
    id: 'SUB-007-B',
    campanaId: 'CAM-2026-007',
    nombre: 'Hampaturi Bajo',
    zona: 'Quebrada sur · Hampaturi',
    estado: 'ACTIVA',
    fase: 'MANTENIMIENTO_ACTIVO',
    equipoIds: ['co-2', 'op-4', 'op-6', 'op-7'],
  },
  {
    id: 'SUB-022-A',
    campanaId: 'CAM-2026-014',
    nombre: 'Achumani Norte',
    zona: 'Ladera norte · Achumani',
    estado: 'FINALIZADA_PARCIAL',
    fase: 'MANTENIMIENTO_ACTIVO',
    equipoIds: ['co-2', 'op-2', 'op-3', 'op-4'],
  },
  {
    id: 'SUB-019-A',
    campanaId: 'CAM-2026-014',
    nombre: 'Sopocachi Verde',
    zona: 'Eje patrimonial · Sopocachi',
    estado: 'COMPLETADA',
    fase: 'MONITOREO_HISTORICO',
    equipoIds: ['co-1', 'op-2', 'op-3', 'op-5'],
  },
];

const REGISTROS_PLANTACION = [
  {
    id: 'REG-007B-01',
    subcampaniaId: 'SUB-007-B',
    campanaId: 'CAM-2026-007',
    nombreGrupo: 'Ladera baja · Fila 2',
    responsableId: 'op-6',
    fechaPlantacionLabel: '12 feb 2026',
    fotoUrl: assetPath('plantacion.jpg'),
    lat: -16.454281,
    lng: -68.094512,
    plantadoInicial: 88,
  },
  {
    id: 'REG-007B-02',
    subcampaniaId: 'SUB-007-B',
    campanaId: 'CAM-2026-007',
    nombreGrupo: 'Quebrada oeste · Fila 4',
    responsableId: 'op-7',
    fechaPlantacionLabel: '01 mar 2026',
    fotoUrl: assetPath('germinacion.jpg'),
    lat: -16.45288,
    lng: -68.097201,
    plantadoInicial: 64,
  },
  {
    id: 'REG-022A-01',
    subcampaniaId: 'SUB-022-A',
    campanaId: 'CAM-2026-014',
    nombreGrupo: 'Talud norte · Segmento A',
    responsableId: 'op-3',
    fechaPlantacionLabel: '15 sep 2025',
    fotoUrl: assetPath('plantacion.jpg'),
    lat: -16.521104,
    lng: -68.062114,
    plantadoInicial: 72,
  },
  {
    id: 'REG-019A-01',
    subcampaniaId: 'SUB-019-A',
    campanaId: 'CAM-2026-014',
    nombreGrupo: 'Av. Ecuador · Cuadra 3',
    responsableId: 'op-2',
    fechaPlantacionLabel: '05 mar 2025',
    fotoUrl: assetPath('co2.jpg'),
    lat: -16.511811,
    lng: -68.126742,
    plantadoInicial: 95,
  },
];

const MORTANDADES = [
  {
    id: 'MOR-007B-01',
    registroPlantacionId: 'REG-007B-01',
    fechaReporteLabel: '18 abr 2026',
    responsableId: 'op-7',
    cantidadMuertaDelta: 14,
    causaMortandad: 'HELADA',
    observaciones: 'Helada nocturna en la fila baja.',
  },
  {
    id: 'MOR-007B-02',
    registroPlantacionId: 'REG-007B-02',
    fechaReporteLabel: '23 abr 2026',
    responsableId: 'op-6',
    cantidadMuertaDelta: 6,
    causaMortandad: 'SEQUIA',
    observaciones: 'Sector con baja retención de humedad.',
  },
  {
    id: 'MOR-022A-01',
    registroPlantacionId: 'REG-022A-01',
    fechaReporteLabel: '15 dic 2025',
    responsableId: 'op-2',
    cantidadMuertaDelta: 18,
    causaMortandad: 'EXCESO_AGUA',
    observaciones: 'Encharcamiento después de lluvia sostenida.',
  },
  {
    id: 'MOR-022A-02',
    registroPlantacionId: 'REG-022A-01',
    fechaReporteLabel: '28 mar 2026',
    responsableId: 'op-3',
    cantidadMuertaDelta: 8,
    causaMortandad: 'COMPETENCIA_MALEZA',
    observaciones: 'Maleza cerró la base de varios individuos.',
  },
  {
    id: 'MOR-019A-01',
    registroPlantacionId: 'REG-019A-01',
    fechaReporteLabel: '15 jun 2025',
    responsableId: 'op-2',
    cantidadMuertaDelta: 15,
    causaMortandad: 'SEQUIA',
    observaciones: 'Sin riego durante tres semanas.',
  },
];

const REPOSICIONES = [
  {
    id: 'REP-022A-01',
    registroPlantacionOrigenId: 'REG-022A-01',
    fechaReposicionLabel: '10 abr 2026',
    responsableId: 'op-4',
    coResponsablesIds: ['op-2'],
    especies: [
      { especie: 'Jacarandá', cantidad: 8, loteViveroOrigen: 'VIV-000123-REP-01' },
      { especie: 'Molle', cantidad: 4, loteViveroOrigen: 'VIV-000123-REP-01' },
    ],
  },
  {
    id: 'REP-019A-01',
    registroPlantacionOrigenId: 'REG-019A-01',
    fechaReposicionLabel: '20 jul 2025',
    responsableId: 'op-3',
    coResponsablesIds: ['op-2'],
    especies: [
      { especie: 'Molle', cantidad: 9, loteViveroOrigen: 'VIV-000131-REP-03' },
      { especie: 'Ceibo', cantidad: 6, loteViveroOrigen: 'VIV-000118-REP-02' },
    ],
  },
];

const LOTES_REPOSICION_ACTIVOS = [
  {
    id: 'VIV-000142-REP-04',
    subcampaniaId: 'SUB-007-B',
    proposito: 'REPOSICION',
    estado: 'ACTIVA',
    especie: 'Queñua',
    cantidadDisponible: 35,
    vivero: 'Vivero Hampaturi',
  },
  {
    id: 'VIV-000145-REP-02',
    subcampaniaId: 'SUB-007-B',
    proposito: 'REPOSICION',
    estado: 'ACTIVA',
    especie: 'Kewiña',
    cantidadDisponible: 28,
    vivero: 'Vivero Hampaturi',
  },
  {
    id: 'VIV-000123-REP-01',
    subcampaniaId: 'SUB-022-A',
    proposito: 'REPOSICION',
    estado: 'ACTIVA',
    especie: 'Jacarandá / Molle',
    cantidadDisponible: 48,
    vivero: 'Vivero Achumani',
  },
  {
    id: 'VIV-000131-REP-03',
    subcampaniaId: 'SUB-019-A',
    proposito: 'REPOSICION',
    estado: 'ACTIVA',
    especie: 'Molle',
    cantidadDisponible: 9,
    vivero: 'Vivero Achumani',
  },
  {
    id: 'VIV-000118-REP-02',
    subcampaniaId: 'SUB-019-A',
    proposito: 'REPOSICION',
    estado: 'ACTIVA',
    especie: 'Ceibo',
    cantidadDisponible: 10,
    vivero: 'Vivero Achumani',
  },
  {
    id: 'VIV-000170-REP-01',
    subcampaniaId: 'SUB-019-A',
    proposito: 'REPOSICION',
    estado: 'ACTIVA',
    especie: 'Tarco',
    cantidadDisponible: 12,
    vivero: 'Vivero Cotahuma',
  },
];

function personById(id) {
  return EQUIPO.find((item) => item.id === id) || (ME.id === id ? ME : null);
}

function campanaById(id) {
  return CAMPANAS.find((item) => item.id === id) || null;
}

function subcampanaById(id) {
  return SUBCAMPANIAS_OPERATIVAS.find((item) => item.id === id) || null;
}

function registroById(id) {
  return REGISTROS_PLANTACION.find((item) => item.id === id) || null;
}

function mortandadesDeRegistro(registroId) {
  return MORTANDADES.filter((item) => item.registroPlantacionId === registroId);
}

function reposicionesDeRegistro(registroId) {
  return REPOSICIONES.filter((item) => item.registroPlantacionOrigenId === registroId);
}

function totalReposicionEspecies(especies) {
  return (especies || []).reduce((acc, item) => acc + (item.cantidad || 0), 0);
}

function resumenRegistro(registroId) {
  const registro = registroById(registroId);
  if (!registro) return null;
  const mortandades = mortandadesDeRegistro(registroId);
  const reposiciones = reposicionesDeRegistro(registroId);
  const plantadoInicial = registro.plantadoInicial;
  const mortandadAcumulada = mortandades.reduce((acc, item) => acc + item.cantidadMuertaDelta, 0);
  const reposicionesAcumuladas = reposiciones.reduce((acc, item) => acc + totalReposicionEspecies(item.especies), 0);
  const vivosEstimados = plantadoInicial + reposicionesAcumuladas - mortandadAcumulada;
  const reponible = Math.max(0, mortandadAcumulada - reposicionesAcumuladas);
  const maxNuevaMortandad = Math.max(0, plantadoInicial + reposicionesAcumuladas - mortandadAcumulada);
  const supervivenciaPct = plantadoInicial > 0 ? Math.round((vivosEstimados / plantadoInicial) * 100) : 0;
  return {
    registro,
    mortandades,
    reposiciones,
    plantadoInicial,
    mortandadAcumulada,
    reposicionesAcumuladas,
    vivosEstimados,
    reponible,
    maxNuevaMortandad,
    supervivenciaPct,
  };
}

function supervivenciaTone(pct) {
  if (pct > 85) return 'ok';
  if (pct >= 70) return 'warn';
  return 'risk';
}

function registrosDeSubcampana(subcampaniaId) {
  return REGISTROS_PLANTACION
    .filter((item) => item.subcampaniaId === subcampaniaId)
    .map((item) => ({ ...item, resumen: resumenRegistro(item.id) }));
}

function registrosConMortandadDeSubcampana(subcampaniaId) {
  return registrosDeSubcampana(subcampaniaId).filter((item) => item.resumen?.mortandadAcumulada > 0);
}

function lotesReposicionDeSubcampania(subcampaniaId) {
  return LOTES_REPOSICION_ACTIVOS.filter((item) => item.subcampaniaId === subcampaniaId && item.estado === 'ACTIVA');
}

function fmtCoords(lat, lng) {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

window.assetPath = assetPath;
window.CAMPANAS = CAMPANAS;
window.EQUIPO = EQUIPO;
window.ME = ME;
window.PHOTOS_SAMPLE = PHOTOS_SAMPLE;
window.GPS_FIX = GPS_FIX;
window.GPS_TOLERANCIA_METROS = GPS_TOLERANCIA_METROS;
window.HOY = HOY;
window.CAUSAS_MORTANDAD_PLANTACION = CAUSAS_MORTANDAD_PLANTACION;
window.SUBCAMPANIAS_OPERATIVAS = SUBCAMPANIAS_OPERATIVAS;
window.REGISTROS_PLANTACION = REGISTROS_PLANTACION;
window.MORTANDADES = MORTANDADES;
window.REPOSICIONES = REPOSICIONES;
window.LOTES_REPOSICION_ACTIVOS = LOTES_REPOSICION_ACTIVOS;
window.personById = personById;
window.campanaById = campanaById;
window.subcampanaById = subcampanaById;
window.registroById = registroById;
window.totalReposicionEspecies = totalReposicionEspecies;
window.resumenRegistro = resumenRegistro;
window.supervivenciaTone = supervivenciaTone;
window.registrosDeSubcampana = registrosDeSubcampana;
window.registrosConMortandadDeSubcampana = registrosConMortandadDeSubcampana;
window.lotesReposicionDeSubcampania = lotesReposicionDeSubcampania;
window.fmtCoords = fmtCoords;
