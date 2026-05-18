// Mock data for "Historial del lote" — R3foresta Vivero.
// Numbers reflect the trazabilidad conceptual model:
//   - INICIO records material in proceso (G or UNIDAD). NO saldo vivo yet.
//   - EMBOLSADO is where saldo vivo nace.
//   - ADAPTABILIDAD doesn't move saldo — only subetapa.
//   - MERMA reduces saldo.
//   - DESPACHO reduces saldo (output to plantación / donación / venta).
//   - CIERRE_AUTOMATICO is system-generated, no operator action.

const LOTE_ACTIVO = {
  codigo: 'VIV-000123-REC-000045',
  comun: 'Soto',
  cientifico: 'Schinopsis brasiliensis',
  estado: 'ACTIVO',
  vivero: 'Vivero Achumani',
  subetapa: 'SOMBRA',           // SOMBRA · MEDIA_SOMBRA · SOL_DIRECTO
  motivoCierre: null,
  // Métricas derivadas
  materialInicial: { valor: '2,5', unidad: 'G' },
  vivasIniciales: 500,
  mermas: 80,
  despachadas: 100,
  disponibles: 320,
  evidenciasTotal: 11,
};

const LOTE_FINALIZADO_DESPACHO = {
  ...LOTE_ACTIVO,
  estado: 'FINALIZADO',
  subetapa: 'SOL_DIRECTO',
  motivoCierre: 'DESPACHO_TOTAL',
  despachadas: 420,
  disponibles: 0,
  evidenciasTotal: 14,
};

const LOTE_FINALIZADO_PERDIDA = {
  ...LOTE_ACTIVO,
  estado: 'FINALIZADO',
  subetapa: 'MEDIA_SOMBRA',
  motivoCierre: 'PERDIDA_TOTAL',
  mermas: 500,
  despachadas: 0,
  disponibles: 0,
  evidenciasTotal: 13,
};

const LOTE_FINALIZADO_MIXTO = {
  ...LOTE_ACTIVO,
  estado: 'FINALIZADO',
  subetapa: 'SOL_DIRECTO',
  motivoCierre: 'MIXTO',
  mermas: 180,
  despachadas: 320,
  disponibles: 0,
  evidenciasTotal: 14,
};

const LOTE_VARIANTS = {
  ACTIVO: LOTE_ACTIVO,
  DESPACHO_TOTAL: LOTE_FINALIZADO_DESPACHO,
  PERDIDA_TOTAL: LOTE_FINALIZADO_PERDIDA,
  MIXTO: LOTE_FINALIZADO_MIXTO,
};

const ORIGEN = {
  codigo: 'REC-000045',
  comunidad: 'Comunidad Charagua',
  fecha: '16 abr 2026',
  recolector: 'Camila Rojas',
  tipo: 'SEMILLA',                // SEMILLA · ESQUEJE
  cantidad: '2,5',
  unidad: 'G',
};

// Event mocks. `kind` is the backend enum — never re-label.
// `saldoAntes`/`saldoDespues` only on events that move saldo vivo.
const PHOTO_GERM = 'assets/germinacion.jpg';
const PHOTO_HERO = 'assets/hero-canopy.jpg';
const PHOTO_PLANT = 'assets/plantacion.jpg';
const PHOTO_CO2 = 'assets/co2.jpg';

const BASE_EVENTS = [
  {
    id: 'evt-1',
    kind: 'INICIO',
    label: 'Inicio del lote',
    fecha: '22 oct 2026',
    hora: '08:42',
    responsable: 'Camila Rojas',
    vivero: 'Vivero Achumani',
    fields: [
      { label: 'Material ingresado', value: '2,5 G' },
      { label: 'Sustrato', value: 'Sustrato A · turba + perlita' },
    ],
    observacion: 'Ingreso completo de la recolección REC-000045. Semillas en buen estado.',
    fotos: [
      { url: PHOTO_GERM, titulo: 'Material en bandejas', fecha: '22 oct 2026' },
      { url: PHOTO_CO2, titulo: 'Etiquetado del lote', fecha: '22 oct 2026' },
    ],
  },
  {
    id: 'evt-2',
    kind: 'EMBOLSADO',
    label: 'Embolsado',
    fecha: '03 nov 2026',
    hora: '15:10',
    responsable: 'Pedro Mamani',
    fields: [
      { label: 'Plantas vivas iniciales', value: '500', highlight: true },
    ],
    saldoAntes: 0,
    saldoDespues: 500,
    observacion: '500 bolsas etiquetadas y dispuestas en sombra. Riego inicial completado.',
    fotos: [
      { url: PHOTO_GERM, titulo: 'Bolsas etiquetadas', fecha: '03 nov 2026' },
      { url: PHOTO_PLANT, titulo: 'Riego inicial', fecha: '03 nov 2026' },
      { url: PHOTO_HERO, titulo: 'Vista general', fecha: '03 nov 2026' },
    ],
  },
  {
    id: 'evt-3',
    kind: 'ADAPTABILIDAD',
    label: 'Pasa a MEDIA_SOMBRA',
    fecha: '24 nov 2026',
    hora: '09:00',
    responsable: 'Luz Sánchez',
    subetapaDestino: 'MEDIA_SOMBRA',
    observacion: 'Adaptación gradual a luz solar tras 3 semanas en sombra. Plantas con primer par de hojas verdaderas.',
    fotos: [
      { url: PHOTO_GERM, titulo: 'Bandejas en media sombra', fecha: '24 nov 2026' },
    ],
  },
  {
    id: 'evt-4',
    kind: 'MERMA',
    label: 'Merma por sequía',
    fecha: '05 dic 2026',
    hora: '11:25',
    responsable: 'Pedro Mamani',
    causa: 'SEQUIA',                    // PLAGA · ENFERMEDAD · SEQUIA · DANO_FISICO · MUERTE_NATURAL · OTRO
    cantidad: 80,
    saldoAntes: 500,
    saldoDespues: 420,
    observacion: 'Falla del sistema de riego durante el fin de semana. Confirmado por inspección visual.',
    fotos: [
      { url: PHOTO_PLANT, titulo: 'Plantas afectadas', fecha: '05 dic 2026' },
      { url: PHOTO_HERO, titulo: 'Sistema de riego', fecha: '05 dic 2026' },
      { url: PHOTO_GERM, titulo: 'Detalle hojas secas', fecha: '05 dic 2026' },
    ],
  },
  {
    id: 'evt-5',
    kind: 'ADAPTABILIDAD',
    label: 'Pasa a SOL_DIRECTO',
    fecha: '18 dic 2026',
    hora: '07:40',
    responsable: 'Luz Sánchez',
    subetapaDestino: 'SOL_DIRECTO',
    observacion: 'Plantas listas para fortalecimiento a pleno sol antes de despacho.',
    fotos: [],
  },
  {
    id: 'evt-6',
    kind: 'DESPACHO',
    label: 'Despacho a Plantación',
    fecha: '11 ene 2027',
    hora: '06:15',
    responsable: 'Camila Rojas',
    destino: 'PLANTACION_PROPIA',       // PLANTACION_PROPIA · DONACION_COMUNIDAD · VENTA · OTRO
    referencia: 'PLT-2027-003',
    comunidad: 'Comunidad Charagua',
    cantidad: 100,
    saldoAntes: 420,
    saldoDespues: 320,
    blockchain: {
      hash: '0x9c4f…a821',
      red: 'Polygon',
    },
    observacion: 'Primer despacho parcial. Camión salió 06:15, llegada estimada 09:30.',
    fotos: [
      { url: PHOTO_PLANT, titulo: 'Carga del camión', fecha: '11 ene 2027' },
      { url: PHOTO_HERO, titulo: 'Salida del vivero', fecha: '11 ene 2027' },
    ],
  },
];

const EVENT_CIERRE_DESPACHO = {
  id: 'evt-7',
  kind: 'CIERRE_AUTOMATICO',
  label: 'Lote finalizado',
  fecha: '24 feb 2027',
  hora: '17:02',
  motivo: 'DESPACHO_TOTAL',
  causaEvento: 'DESPACHO #DSP-2027-019 · 320 unidades',
};

const EVENT_CIERRE_PERDIDA = {
  ...EVENT_CIERRE_DESPACHO,
  motivo: 'PERDIDA_TOTAL',
  causaEvento: 'MERMA #MRM-2027-008 · 320 unidades por PLAGA',
};

const EVENT_CIERRE_MIXTO = {
  ...EVENT_CIERRE_DESPACHO,
  motivo: 'MIXTO',
  causaEvento: 'DESPACHO #DSP-2027-019 + MERMA #MRM-2027-008',
};

const CIERRE_BY_MOTIVO = {
  DESPACHO_TOTAL: EVENT_CIERRE_DESPACHO,
  PERDIDA_TOTAL: EVENT_CIERRE_PERDIDA,
  MIXTO: EVENT_CIERRE_MIXTO,
};

// Auditoría / detalle técnico (colapsado por defecto).
const AUDIT_ROWS = [
  ['lote_vivero_id',     'lv_01HZX7C8K2Q3R4N5M6P7V8W9'],
  ['recoleccion_id',     'rec_01HZX2A4B6C8D0E2F4G6H8J0'],
  ['vivero_id',          'viv_01HZW5T7Y9Z1B3D5F7H9K1'],
  ['created_at',         '2026-10-22T08:42:11.204-04:00'],
  ['updated_at',         '2027-01-11T06:15:47.881-04:00'],
  ['responsable_id',     'usr_01HZX3K5M7N9P1Q3R5S7T9'],
  ['ingest_transaction', 'tx_v1:09f8c3a4b5e6d7c8a9b0c1d2e3f4a5b6'],
  ['evidencia_hash_root','sha256:8e2af0…b1c9d7'],
  ['blockchain_red',     'Polygon'],
  ['blockchain_tx',      '0x9c4f1d3a4b5e6d7c8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a821'],
  ['metadata_version',   'v2026.10'],
];

const FILTERS = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'INICIO', label: 'Inicio' },
  { key: 'EMBOLSADO', label: 'Embolsado' },
  { key: 'ADAPTABILIDAD', label: 'Adaptabilidad' },
  { key: 'MERMA', label: 'Mermas' },
  { key: 'DESPACHO', label: 'Despachos' },
  { key: 'CIERRE_AUTOMATICO', label: 'Cierre' },
];

const SUBETAPA_LABEL = {
  SOMBRA: 'Sombra',
  MEDIA_SOMBRA: 'Media sombra',
  SOL_DIRECTO: 'Sol directo',
};

const SUBETAPA_ICON = {
  SOMBRA: 'shade',
  MEDIA_SOMBRA: 'half-shade',
  SOL_DIRECTO: 'sun',
};

const MOTIVO_CIERRE_LABEL = {
  DESPACHO_TOTAL: 'Despacho total',
  PERDIDA_TOTAL: 'Pérdida total',
  MIXTO: 'Cierre mixto',
};

const CAUSA_MERMA_LABEL = {
  PLAGA: 'Plaga',
  ENFERMEDAD: 'Enfermedad',
  SEQUIA: 'Sequía',
  DANO_FISICO: 'Daño físico',
  MUERTE_NATURAL: 'Muerte natural',
  OTRO: 'Otro',
};

const DESTINO_LABEL = {
  PLANTACION_PROPIA: 'Plantación propia',
  DONACION_COMUNIDAD: 'Donación a comunidad',
  VENTA: 'Venta',
  OTRO: 'Otro',
};

Object.assign(window, {
  LOTE_VARIANTS, ORIGEN,
  BASE_EVENTS, CIERRE_BY_MOTIVO,
  AUDIT_ROWS, FILTERS,
  SUBETAPA_LABEL, SUBETAPA_ICON, MOTIVO_CIERRE_LABEL, CAUSA_MERMA_LABEL, DESTINO_LABEL,
});
