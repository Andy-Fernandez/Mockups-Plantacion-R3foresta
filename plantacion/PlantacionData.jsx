// Mock data for "Registrar plantación" — R3foresta Plantación (Módulo 3).
// Operator-facing flow. Numbers match the brief examples:
//   - "Arborización La Paz 2026" — arborización — 3000 árboles · Cota Cota / San Miguel / Hernán
//   - "Reforestación Hampaturi Fase 1" — reforestación — 5000 árboles · Queñua/Kewiña/otras
// Species mix is the campaign's *planificado* — the operator sees the planned %
// alongside the live tally so they can stay within bounds.

const CAMPANAS = [
  {
    id: 'CAM-2026-014',
    nombre: 'Arborización La Paz 2026',
    tipo: 'ARBORIZACION',
    zona: 'San Miguel · La Paz',
    coordinadora: 'Ing. María López',
    meta: 3000,
    plantados: 1240,
    asignadosOperario: 80, // disponibles para plantar hoy
    distanciaKm: 0.4,
    mixPlanificado: [
      { especie: 'Jacarandá', cientifico: 'Jacaranda mimosifolia', maxPct: 40 },
      { especie: 'Molle',     cientifico: 'Schinus molle',          maxPct: 40 },
      { especie: 'Ceibo',     cientifico: 'Erythrina crista-galli', maxPct: 20 },
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
      { especie: 'Queñua', cientifico: 'Polylepis incana',  maxPct: 40 },
      { especie: 'Kewiña', cientifico: 'Polylepis besseri', maxPct: 40 },
      { especie: 'Aliso',  cientifico: 'Alnus acuminata',   maxPct: 20 },
    ],
  },
];

// Members of the active campaign team — used in step 4 (co-responsables).
const EQUIPO = [
  { id: 'op-2', nombre: 'Rosa Quispe',  rol: 'Operario',     iniciales: 'RQ' },
  { id: 'op-3', nombre: 'Carlos Apaza', rol: 'Operario',     iniciales: 'CA' },
  { id: 'op-4', nombre: 'Ana Condori',  rol: 'Operario',     iniciales: 'AC' },
  { id: 'co-1', nombre: 'María López',  rol: 'Coordinadora', iniciales: 'ML' },
];

// User of the app (operario actual).
const ME = { id: 'op-1', nombre: 'Juan Mamani', rol: 'Operario', iniciales: 'JM' };

// Sample photo evidences — re-uses what the project ships.
const PHOTOS_SAMPLE = [
  { url: 'assets/plantacion.jpg', label: 'Grupo plantado #1' },
  { url: 'assets/germinacion.jpg', label: 'Detalle base de árbol' },
  { url: 'assets/co2.jpg', label: 'Vista de la zona' },
];

// GPS reading (mock).
const GPS_FIX = {
  lat: -16.5158,
  lng: -68.0833,
  accuracy: 4,        // meters
  capturadoEn: '08:34',
};

// Today's running tally — feeds the "Mi historial del día" mini-card.
const HOY = {
  plantadosHoy: 87,
  campanasHoy: 2,
  ultimoRegistro: '08:12',
};

window.CAMPANAS = CAMPANAS;
window.EQUIPO = EQUIPO;
window.ME = ME;
window.PHOTOS_SAMPLE = PHOTOS_SAMPLE;
window.GPS_FIX = GPS_FIX;
window.HOY = HOY;
