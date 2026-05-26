// PublicoData.jsx
// Vista pública (RF-PLA-15): filtra datos para mostrar solo sub-campañas
// no-BORRADOR y expone totalizadores del hero y registros de plantación
// con coordenadas SVG para el mapa estilizado.
//
// Regla: sub-campañas en BORRADOR nunca aparecen públicamente.
// Campañas paraguas sin hijas visibles tampoco se muestran.

// ── Filtrado público ──────────────────────────────────────────────────────────
const SUBCAMPANAS_PUBLICAS = SUBCAMPANAS_ADMIN.filter(s => s.estado !== 'BORRADOR');

const CAMPANAS_PUBLICAS = CAMPANAS_ADMIN_AGREGADAS
  .map(c => ({
    ...c,
    subcampanas: (c.subcampanas || []).filter(s => s.estado !== 'BORRADOR'),
  }))
  .filter(c => c.subcampanas.length > 0);

// ── Totalizadores hero ────────────────────────────────────────────────────────
const _totalPlantados   = SUBCAMPANAS_PUBLICAS.reduce((a, s) => a + (s.plantados || 0), 0);
const _totalCo2         = SUBCAMPANAS_PUBLICAS.reduce((a, s) => a + (s.co2Proyectado || 0), 0);
const _totalActivas     = SUBCAMPANAS_PUBLICAS.filter(s => s.estado === 'ACTIVA').length;
const _totalComunidades = new Set(
  SUBCAMPANAS_PUBLICAS.map(s => s.comunidad || s.municipio).filter(Boolean)
).size;

const TOTALES_PUBLICOS = {
  arbolesPlantados:      _totalPlantados,   // 5302
  co2ToneladasEstimadas: _totalCo2,         // 222
  subcampanasActivas:    _totalActivas,      // 4
  comunidadesAlcanzadas: _totalComunidades, // 6
};

// ── Formato Bolivia (miles con punto) ─────────────────────────────────────────
function fmtMiles(n) {
  if (n == null || isNaN(n)) return '0';
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ── Mock de registros de plantación ──────────────────────────────────────────
// Cada registro tiene coordenadas SVG (svgX, svgY) posicionadas dentro del
// polígono de su sub-campaña en el mapa estilizado (viewBox 0 0 360 210).
// Los snapshots de nombre usan los valores congelados al activar la sub-campaña
// (sec. 2.14) — en el mock coinciden con los valores actuales.
const PLANTACIONES_PUBLICAS = [
  // ── SUB-007-A · Hampaturi Alto (ACTIVA) ────────────────────────────────────
  { id: 'PLT-001', subcampanaId: 'SUB-007-A', fecha: '08 ene 2026', operarioSnapshot: 'Rosa Quispe',   especies: [{ especie: 'Queñua', cantidad: 45 }],                                          loteOrigen: 'VIV-000142', svgX: 35,  svgY: 35,  tieneBlockchain: true  },
  { id: 'PLT-002', subcampanaId: 'SUB-007-A', fecha: '15 ene 2026', operarioSnapshot: 'Rosa Quispe',   especies: [{ especie: 'Kewiña', cantidad: 38 }],                                          loteOrigen: 'VIV-000145', svgX: 65,  svgY: 50,  tieneBlockchain: true  },
  { id: 'PLT-003', subcampanaId: 'SUB-007-A', fecha: '22 ene 2026', operarioSnapshot: 'Pedro Mamani',  especies: [{ especie: 'Queñua', cantidad: 52 }],                                          loteOrigen: 'VIV-000142', svgX: 85,  svgY: 40,  tieneBlockchain: false },
  { id: 'PLT-004', subcampanaId: 'SUB-007-A', fecha: '01 feb 2026', operarioSnapshot: 'Ana Condori',   especies: [{ especie: 'Kewiña', cantidad: 30 }],                                          loteOrigen: 'VIV-000145', svgX: 48,  svgY: 65,  tieneBlockchain: true  },
  { id: 'PLT-005', subcampanaId: 'SUB-007-A', fecha: '08 feb 2026', operarioSnapshot: 'Pedro Mamani',  especies: [{ especie: 'Queñua', cantidad: 41 }, { especie: 'Kewiña', cantidad: 22 }],     loteOrigen: 'VIV-000142', svgX: 80,  svgY: 68,  tieneBlockchain: false },
  // ── SUB-007-B · Hampaturi Bajo (ACTIVA) ────────────────────────────────────
  { id: 'PLT-006', subcampanaId: 'SUB-007-B', fecha: '10 ene 2026', operarioSnapshot: 'Pedro Mamani',  especies: [{ especie: 'Kewiña', cantidad: 40 }],                                          loteOrigen: 'VIV-000145', svgX: 38,  svgY: 105, tieneBlockchain: true  },
  { id: 'PLT-007', subcampanaId: 'SUB-007-B', fecha: '20 ene 2026', operarioSnapshot: 'Ana Condori',   especies: [{ especie: 'Queñua', cantidad: 35 }],                                          loteOrigen: 'VIV-000142', svgX: 68,  svgY: 118, tieneBlockchain: false },
  { id: 'PLT-008', subcampanaId: 'SUB-007-B', fecha: '01 feb 2026', operarioSnapshot: 'Lucía Choque',  especies: [{ especie: 'Queñua', cantidad: 28 }, { especie: 'Kewiña', cantidad: 18 }],     loteOrigen: 'VIV-000145', svgX: 88,  svgY: 108, tieneBlockchain: true  },
  { id: 'PLT-009', subcampanaId: 'SUB-007-B', fecha: '12 feb 2026', operarioSnapshot: 'Mario Villca',  especies: [{ especie: 'Queñua', cantidad: 45 }],                                          loteOrigen: 'VIV-000142', svgX: 52,  svgY: 135, tieneBlockchain: false },
  // ── SUB-014-B · Achocalla (ACTIVA) ─────────────────────────────────────────
  { id: 'PLT-010', subcampanaId: 'SUB-014-B', fecha: '12 mar 2026', operarioSnapshot: 'Juan Mamani',   especies: [{ especie: 'Jacarandá', cantidad: 30 }, { especie: 'Molle', cantidad: 25 }],   loteOrigen: 'VIV-000123', svgX: 140, svgY: 38,  tieneBlockchain: true  },
  { id: 'PLT-011', subcampanaId: 'SUB-014-B', fecha: '20 mar 2026', operarioSnapshot: 'Ana Condori',   especies: [{ especie: 'Ceibo', cantidad: 20 }],                                           loteOrigen: 'VIV-000118', svgX: 162, svgY: 52,  tieneBlockchain: true  },
  { id: 'PLT-012', subcampanaId: 'SUB-014-B', fecha: '28 mar 2026', operarioSnapshot: 'Juan Mamani',   especies: [{ especie: 'Jacarandá', cantidad: 25 }],                                       loteOrigen: 'VIV-000123', svgX: 152, svgY: 70,  tieneBlockchain: false },
  { id: 'PLT-013', subcampanaId: 'SUB-014-B', fecha: '05 abr 2026', operarioSnapshot: 'Rosa Quispe',   especies: [{ especie: 'Molle', cantidad: 35 }, { especie: 'Jacarandá', cantidad: 12 }],   loteOrigen: 'VIV-000123', svgX: 180, svgY: 44,  tieneBlockchain: true  },
  // ── SUB-014-C · Av. Camacho (ACTIVA) ───────────────────────────────────────
  { id: 'PLT-014', subcampanaId: 'SUB-014-C', fecha: '25 mar 2026', operarioSnapshot: 'Carlos Apaza',  especies: [{ especie: 'Molle', cantidad: 28 }],                                           loteOrigen: 'VIV-000131', svgX: 148, svgY: 108, tieneBlockchain: false },
  { id: 'PLT-015', subcampanaId: 'SUB-014-C', fecha: '01 abr 2026', operarioSnapshot: 'Pedro Mamani',  especies: [{ especie: 'Ceibo', cantidad: 22 }],                                           loteOrigen: 'VIV-000118', svgX: 172, svgY: 118, tieneBlockchain: true  },
  { id: 'PLT-016', subcampanaId: 'SUB-014-C', fecha: '10 abr 2026', operarioSnapshot: 'Carlos Apaza',  especies: [{ especie: 'Molle', cantidad: 18 }, { especie: 'Ceibo', cantidad: 10 }],       loteOrigen: 'VIV-000131', svgX: 195, svgY: 105, tieneBlockchain: true  },
  // ── SUB-022-A · Achumani Norte (FINALIZADA_PARCIAL + MANTENIMIENTO_ACTIVO) ─
  { id: 'PLT-017', subcampanaId: 'SUB-022-A', fecha: '15 sep 2025', operarioSnapshot: 'Carlos Apaza',  especies: [{ especie: 'Jacarandá', cantidad: 50 }],                                       loteOrigen: 'VIV-000123', svgX: 148, svgY: 162, tieneBlockchain: true  },
  { id: 'PLT-018', subcampanaId: 'SUB-022-A', fecha: '30 sep 2025', operarioSnapshot: 'Pedro Mamani',  especies: [{ especie: 'Molle', cantidad: 35 }],                                           loteOrigen: 'VIV-000118', svgX: 172, svgY: 168, tieneBlockchain: false },
  // ── SUB-019-A · Sopocachi (COMPLETADA + MONITOREO_HISTORICO) ───────────────
  { id: 'PLT-019', subcampanaId: 'SUB-019-A', fecha: '05 mar 2025', operarioSnapshot: 'Juan Mamani',   especies: [{ especie: 'Molle', cantidad: 45 }, { especie: 'Ceibo', cantidad: 40 }],       loteOrigen: 'VIV-000131', svgX: 240, svgY: 108, tieneBlockchain: true  },
  { id: 'PLT-020', subcampanaId: 'SUB-019-A', fecha: '20 abr 2025', operarioSnapshot: 'Rosa Quispe',   especies: [{ especie: 'Molle', cantidad: 30 }],                                           loteOrigen: 'VIV-000131', svgX: 262, svgY: 120, tieneBlockchain: true  },
  { id: 'PLT-021', subcampanaId: 'SUB-019-A', fecha: '15 may 2025', operarioSnapshot: 'Juan Mamani',   especies: [{ especie: 'Ceibo', cantidad: 25 }],                                           loteOrigen: 'VIV-000118', svgX: 248, svgY: 132, tieneBlockchain: false },
  { id: 'PLT-022', subcampanaId: 'SUB-019-A', fecha: '10 jun 2025', operarioSnapshot: 'Ana Condori',   especies: [{ especie: 'Molle', cantidad: 40 }],                                           loteOrigen: 'VIV-000131', svgX: 282, svgY: 100, tieneBlockchain: true  },
];

// ── Métricas de detalle por sub-campaña ──────────────────────────────────────
// vivosHoy = plantados + reposiciones - mortandad (consistente con supervivencia)
const METRICAS_DETALLE = {
  'SUB-014-B': { mortandad: 78,  reposiciones: 20,  vivosHoy: 662 },
  'SUB-014-C': { mortandad: 72,  reposiciones: 15,  vivosHoy: 463 },
  'SUB-007-A': { mortandad: 274, reposiciones: 40,  vivosHoy: 1436 },
  'SUB-007-B': { mortandad: 246, reposiciones: 30,  vivosHoy: 984  },
  'SUB-022-A': { mortandad: 135, reposiciones: 25,  vivosHoy: 270  },
  'SUB-019-A': { mortandad: 119, reposiciones: 30,  vivosHoy: 723  },
};

// ── Timeline de eventos por sub-campaña ───────────────────────────────────────
// Tipos: SUBCAMPANIA_ACTIVADA, PLANTACION_INICIAL, REPOSICION, MORTANDAD_REPORTADA,
//        ASIGNACION_VIVERO, SUBCAMPANIA_COMPLETADA, SUBCAMPANIA_FINALIZADA_PARCIAL,
//        TRANSICION_A_MONITOREO_HISTORICO
// faseSubcampana en REPOSICION diferencia badge visual (ACTIVA / MANTENIMIENTO_ACTIVO / MONITOREO_HISTORICO)
const _ev = (id, subcampanaId, tipo, fecha, fechaISO, descripcion, opts) => ({
  id, subcampanaId, tipo, fecha, fechaISO, descripcion,
  actorSnapshot:    (opts && opts.actor)    || null,
  cantidadArboles:  (opts && opts.cantidad) || null,
  especiesSnapshot: (opts && opts.especies) || null,
  loteOrigen:       (opts && opts.lote)     || null,
  faseSubcampana:   (opts && opts.fase)     || null,
  tieneBlockchain:  (opts && opts.bc)       || false,
});

const EVENTOS_TIMELINE = [
  // ── SUB-014-B · Achocalla (ACTIVA) ─────────────────────────────────────────
  _ev('ev-014b-1','SUB-014-B','ASIGNACION_VIVERO',    '10 mar 2026','2026-03-10','Lote VIV-000123 asignado (Jacarandá, Molle)',{lote:'VIV-000123',bc:false}),
  _ev('ev-014b-2','SUB-014-B','SUBCAMPANIA_ACTIVADA', '12 mar 2026','2026-03-12','Sub-campaña activada',{bc:true}),
  _ev('ev-014b-3','SUB-014-B','PLANTACION_INICIAL',   '12 mar 2026','2026-03-12','Plantación inicial',{actor:'Juan Mamani',  cantidad:55, especies:[{especie:'Jacarandá',cantidad:30},{especie:'Molle',cantidad:25}],lote:'VIV-000123',bc:true}),
  _ev('ev-014b-4','SUB-014-B','PLANTACION_INICIAL',   '20 mar 2026','2026-03-20','Plantación inicial',{actor:'Ana Condori',  cantidad:20, especies:[{especie:'Ceibo',cantidad:20}],lote:'VIV-000131',bc:false}),
  _ev('ev-014b-5','SUB-014-B','PLANTACION_INICIAL',   '28 mar 2026','2026-03-28','Plantación inicial',{actor:'Juan Mamani',  cantidad:25, especies:[{especie:'Jacarandá',cantidad:25}],lote:'VIV-000123',bc:true}),
  _ev('ev-014b-6','SUB-014-B','MORTANDAD_REPORTADA',  '02 abr 2026','2026-04-02','28 árboles muertos · falta de riego',{cantidad:28,bc:false}),
  _ev('ev-014b-7','SUB-014-B','PLANTACION_INICIAL',   '05 abr 2026','2026-04-05','Plantación inicial',{actor:'Rosa Quispe',  cantidad:47, especies:[{especie:'Molle',cantidad:35},{especie:'Jacarandá',cantidad:12}],lote:'VIV-000123',bc:true}),
  _ev('ev-014b-8','SUB-014-B','PLANTACION_INICIAL',   '25 may 2026','2026-05-25','Plantación inicial',{actor:'Juan Mamani',  cantidad:45, especies:[{especie:'Jacarandá',cantidad:45}],lote:'VIV-000123',bc:true}),

  // ── SUB-014-C · Av. Camacho (ACTIVA) ───────────────────────────────────────
  _ev('ev-014c-1','SUB-014-C','ASIGNACION_VIVERO',    '18 mar 2026','2026-03-18','Lote VIV-000131 asignado (Molle, Ceibo)',{lote:'VIV-000131',bc:false}),
  _ev('ev-014c-2','SUB-014-C','SUBCAMPANIA_ACTIVADA', '20 mar 2026','2026-03-20','Sub-campaña activada',{bc:true}),
  _ev('ev-014c-3','SUB-014-C','PLANTACION_INICIAL',   '25 mar 2026','2026-03-25','Plantación inicial',{actor:'Carlos Apaza', cantidad:28, especies:[{especie:'Molle',cantidad:28}],lote:'VIV-000131',bc:false}),
  _ev('ev-014c-4','SUB-014-C','PLANTACION_INICIAL',   '01 abr 2026','2026-04-01','Plantación inicial',{actor:'Pedro Mamani', cantidad:22, especies:[{especie:'Ceibo',cantidad:22}],lote:'VIV-000118',bc:true}),
  _ev('ev-014c-5','SUB-014-C','PLANTACION_INICIAL',   '10 abr 2026','2026-04-10','Plantación inicial',{actor:'Carlos Apaza', cantidad:28, especies:[{especie:'Molle',cantidad:18},{especie:'Ceibo',cantidad:10}],lote:'VIV-000131',bc:true}),
  _ev('ev-014c-6','SUB-014-C','MORTANDAD_REPORTADA',  '20 abr 2026','2026-04-20','15 árboles muertos · vandalismo registrado',{cantidad:15,bc:false}),
  _ev('ev-014c-7','SUB-014-C','PLANTACION_INICIAL',   '05 may 2026','2026-05-05','Plantación inicial',{actor:'Pedro Mamani', cantidad:35, especies:[{especie:'Molle',cantidad:35}],lote:'VIV-000131',bc:true}),

  // ── SUB-007-A · Hampaturi Alto (ACTIVA) ────────────────────────────────────
  _ev('ev-007a-1','SUB-007-A','ASIGNACION_VIVERO',    '06 ene 2026','2026-01-06','Lote VIV-000142 asignado (Queñua)',{lote:'VIV-000142',bc:false}),
  _ev('ev-007a-2','SUB-007-A','SUBCAMPANIA_ACTIVADA', '08 ene 2026','2026-01-08','Sub-campaña activada',{bc:true}),
  _ev('ev-007a-3','SUB-007-A','PLANTACION_INICIAL',   '08 ene 2026','2026-01-08','Plantación inicial',{actor:'Rosa Quispe',  cantidad:45, especies:[{especie:'Queñua',cantidad:45}],lote:'VIV-000142',bc:true}),
  _ev('ev-007a-4','SUB-007-A','PLANTACION_INICIAL',   '15 ene 2026','2026-01-15','Plantación inicial',{actor:'Rosa Quispe',  cantidad:38, especies:[{especie:'Kewiña',cantidad:38}],lote:'VIV-000145',bc:true}),
  _ev('ev-007a-5','SUB-007-A','PLANTACION_INICIAL',   '22 ene 2026','2026-01-22','Plantación inicial',{actor:'Pedro Mamani', cantidad:52, especies:[{especie:'Queñua',cantidad:52}],lote:'VIV-000142',bc:false}),
  _ev('ev-007a-6','SUB-007-A','MORTANDAD_REPORTADA',  '05 feb 2026','2026-02-05','45 árboles muertos · heladas nocturnas',{cantidad:45,bc:false}),
  _ev('ev-007a-7','SUB-007-A','PLANTACION_INICIAL',   '08 feb 2026','2026-02-08','Plantación inicial',{actor:'Ana Condori',  cantidad:30, especies:[{especie:'Kewiña',cantidad:30}],lote:'VIV-000145',bc:true}),
  _ev('ev-007a-8','SUB-007-A','PLANTACION_INICIAL',   '01 abr 2026','2026-04-01','Plantación inicial',{actor:'Mario Villca', cantidad:117,especies:[{especie:'Queñua',cantidad:62},{especie:'Kewiña',cantidad:55}],lote:'VIV-000142',bc:true}),
  _ev('ev-007a-9','SUB-007-A','PLANTACION_INICIAL',   '20 may 2026','2026-05-20','Plantación inicial',{actor:'Rosa Quispe',  cantidad:45, especies:[{especie:'Queñua',cantidad:45}],lote:'VIV-000142',bc:true}),

  // ── SUB-007-B · Hampaturi Bajo (ACTIVA) ────────────────────────────────────
  _ev('ev-007b-1','SUB-007-B','ASIGNACION_VIVERO',    '06 ene 2026','2026-01-06','Lote VIV-000145 asignado (Kewiña)',{lote:'VIV-000145',bc:false}),
  _ev('ev-007b-2','SUB-007-B','SUBCAMPANIA_ACTIVADA', '08 ene 2026','2026-01-08','Sub-campaña activada',{bc:true}),
  _ev('ev-007b-3','SUB-007-B','PLANTACION_INICIAL',   '10 ene 2026','2026-01-10','Plantación inicial',{actor:'Pedro Mamani', cantidad:40, especies:[{especie:'Kewiña',cantidad:40}],lote:'VIV-000145',bc:true}),
  _ev('ev-007b-4','SUB-007-B','PLANTACION_INICIAL',   '20 ene 2026','2026-01-20','Plantación inicial',{actor:'Ana Condori',  cantidad:35, especies:[{especie:'Queñua',cantidad:35}],lote:'VIV-000142',bc:false}),
  _ev('ev-007b-5','SUB-007-B','MORTANDAD_REPORTADA',  '10 feb 2026','2026-02-10','38 árboles muertos · heladas nocturnas',{cantidad:38,bc:false}),
  _ev('ev-007b-6','SUB-007-B','PLANTACION_INICIAL',   '12 feb 2026','2026-02-12','Plantación inicial',{actor:'Lucía Choque', cantidad:46, especies:[{especie:'Queñua',cantidad:28},{especie:'Kewiña',cantidad:18}],lote:'VIV-000145',bc:true}),
  _ev('ev-007b-7','SUB-007-B','REPOSICION',           '15 abr 2026','2026-04-15','Reposición de marras',{actor:'Mario Villca', cantidad:25, especies:[{especie:'Queñua',cantidad:15},{especie:'Kewiña',cantidad:10}],lote:'VIV-000145',fase:'ACTIVA',bc:true}),
  _ev('ev-007b-8','SUB-007-B','PLANTACION_INICIAL',   '01 may 2026','2026-05-01','Plantación inicial',{actor:'Mario Villca', cantidad:45, especies:[{especie:'Queñua',cantidad:45}],lote:'VIV-000142',bc:true}),

  // ── SUB-022-A · Achumani Norte (FINALIZADA_PARCIAL + MANTENIMIENTO_ACTIVO) ─
  _ev('ev-022a-1','SUB-022-A','SUBCAMPANIA_ACTIVADA',          '15 sep 2025','2025-09-15','Sub-campaña activada',{bc:true}),
  _ev('ev-022a-2','SUB-022-A','PLANTACION_INICIAL',            '15 sep 2025','2025-09-15','Plantación inicial',{actor:'Carlos Apaza',cantidad:50,especies:[{especie:'Jacarandá',cantidad:50}],lote:'VIV-000123',bc:true}),
  _ev('ev-022a-3','SUB-022-A','PLANTACION_INICIAL',            '30 sep 2025','2025-09-30','Plantación inicial',{actor:'Pedro Mamani',cantidad:35,especies:[{especie:'Molle',cantidad:35}],lote:'VIV-000118',bc:false}),
  _ev('ev-022a-4','SUB-022-A','MORTANDAD_REPORTADA',           '15 dic 2025','2025-12-15','42 árboles muertos · lluvias intensas',{cantidad:42,bc:false}),
  _ev('ev-022a-5','SUB-022-A','SUBCAMPANIA_FINALIZADA_PARCIAL','15 mar 2026','2026-03-15','Cierre parcial · lluvias intensas continuadas',{bc:true}),
  _ev('ev-022a-6','SUB-022-A','REPOSICION',                   '10 abr 2026','2026-04-10','Reposición en mantenimiento',{actor:'Ana Condori', cantidad:18,especies:[{especie:'Jacarandá',cantidad:18}],lote:'VIV-000123',fase:'MANTENIMIENTO_ACTIVO',bc:true}),
  _ev('ev-022a-7','SUB-022-A','REPOSICION',                   '05 may 2026','2026-05-05','Reposición en mantenimiento',{actor:'Carlos Apaza',cantidad:15,especies:[{especie:'Molle',cantidad:15}],lote:'VIV-000118',fase:'MANTENIMIENTO_ACTIVO',bc:false}),

  // ── SUB-019-A · Sopocachi (COMPLETADA + MONITOREO_HISTORICO) ───────────────
  _ev('ev-019a-1','SUB-019-A','SUBCAMPANIA_ACTIVADA',              '01 mar 2025','2025-03-01','Sub-campaña activada',{bc:true}),
  _ev('ev-019a-2','SUB-019-A','PLANTACION_INICIAL',                '05 mar 2025','2025-03-05','Plantación inicial',{actor:'Juan Mamani',  cantidad:85,especies:[{especie:'Molle',cantidad:45},{especie:'Ceibo',cantidad:40}],lote:'VIV-000131',bc:true}),
  _ev('ev-019a-3','SUB-019-A','PLANTACION_INICIAL',                '20 abr 2025','2025-04-20','Plantación inicial',{actor:'Rosa Quispe',  cantidad:30,especies:[{especie:'Molle',cantidad:30}],lote:'VIV-000131',bc:true}),
  _ev('ev-019a-4','SUB-019-A','PLANTACION_INICIAL',                '15 may 2025','2025-05-15','Plantación inicial',{actor:'Juan Mamani',  cantidad:25,especies:[{especie:'Ceibo',cantidad:25}],lote:'VIV-000118',bc:false}),
  _ev('ev-019a-5','SUB-019-A','MORTANDAD_REPORTADA',               '15 jun 2025','2025-06-15','35 árboles muertos · sequía',{cantidad:35,bc:false}),
  _ev('ev-019a-6','SUB-019-A','REPOSICION',                       '20 jul 2025','2025-07-20','Reposición de marras',{actor:'Ana Condori',  cantidad:30,especies:[{especie:'Molle',cantidad:18},{especie:'Ceibo',cantidad:12}],lote:'VIV-000131',fase:'ACTIVA',bc:false}),
  _ev('ev-019a-7','SUB-019-A','PLANTACION_INICIAL',                '15 sep 2025','2025-09-15','Plantación inicial',{actor:'Juan Mamani',  cantidad:40,especies:[{especie:'Molle',cantidad:40}],lote:'VIV-000131',bc:true}),
  _ev('ev-019a-8','SUB-019-A','SUBCAMPANIA_COMPLETADA',            '20 dic 2025','2025-12-20','Sub-campaña completada exitosamente',{bc:true}),
  _ev('ev-019a-9','SUB-019-A','TRANSICION_A_MONITOREO_HISTORICO',  '05 ene 2026','2026-01-05','Transición a fase de monitoreo histórico',{bc:true}),
];

// ── Fotos mock por sub-campaña ────────────────────────────────────────────────
// Sin imágenes reales — el componente GaleriaFotos renderiza placeholders visuales.
const FOTOS_PUBLICAS = [
  {id:'f-014b-1',subcampanaId:'SUB-014-B',fecha:'12 mar 2026',operarioSnapshot:'Juan Mamani',  tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-014b-2',subcampanaId:'SUB-014-B',fecha:'20 mar 2026',operarioSnapshot:'Ana Condori',  tipo:'PLANTACION_INICIAL',tieneBlockchain:false},
  {id:'f-014b-3',subcampanaId:'SUB-014-B',fecha:'05 abr 2026',operarioSnapshot:'Rosa Quispe',  tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-014b-4',subcampanaId:'SUB-014-B',fecha:'25 may 2026',operarioSnapshot:'Juan Mamani',  tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-014c-1',subcampanaId:'SUB-014-C',fecha:'25 mar 2026',operarioSnapshot:'Carlos Apaza', tipo:'PLANTACION_INICIAL',tieneBlockchain:false},
  {id:'f-014c-2',subcampanaId:'SUB-014-C',fecha:'01 abr 2026',operarioSnapshot:'Pedro Mamani', tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-014c-3',subcampanaId:'SUB-014-C',fecha:'10 abr 2026',operarioSnapshot:'Carlos Apaza', tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-007a-1',subcampanaId:'SUB-007-A',fecha:'08 ene 2026',operarioSnapshot:'Rosa Quispe',  tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-007a-2',subcampanaId:'SUB-007-A',fecha:'15 ene 2026',operarioSnapshot:'Rosa Quispe',  tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-007a-3',subcampanaId:'SUB-007-A',fecha:'08 feb 2026',operarioSnapshot:'Ana Condori',  tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-007a-4',subcampanaId:'SUB-007-A',fecha:'01 abr 2026',operarioSnapshot:'Mario Villca', tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-007a-5',subcampanaId:'SUB-007-A',fecha:'20 may 2026',operarioSnapshot:'Rosa Quispe',  tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-007b-1',subcampanaId:'SUB-007-B',fecha:'10 ene 2026',operarioSnapshot:'Pedro Mamani', tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-007b-2',subcampanaId:'SUB-007-B',fecha:'12 feb 2026',operarioSnapshot:'Lucía Choque', tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-007b-3',subcampanaId:'SUB-007-B',fecha:'15 abr 2026',operarioSnapshot:'Mario Villca', tipo:'REPOSICION',        tieneBlockchain:true },
  {id:'f-022a-1',subcampanaId:'SUB-022-A',fecha:'15 sep 2025',operarioSnapshot:'Carlos Apaza', tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-022a-2',subcampanaId:'SUB-022-A',fecha:'30 sep 2025',operarioSnapshot:'Pedro Mamani', tipo:'PLANTACION_INICIAL',tieneBlockchain:false},
  {id:'f-022a-3',subcampanaId:'SUB-022-A',fecha:'10 abr 2026',operarioSnapshot:'Ana Condori',  tipo:'REPOSICION',        tieneBlockchain:true },
  {id:'f-019a-1',subcampanaId:'SUB-019-A',fecha:'05 mar 2025',operarioSnapshot:'Juan Mamani',  tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-019a-2',subcampanaId:'SUB-019-A',fecha:'20 abr 2025',operarioSnapshot:'Rosa Quispe',  tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
  {id:'f-019a-3',subcampanaId:'SUB-019-A',fecha:'15 sep 2025',operarioSnapshot:'Juan Mamani',  tipo:'PLANTACION_INICIAL',tieneBlockchain:true },
];

function eventosDeSub(subcampanaId) {
  return EVENTOS_TIMELINE.filter(e => e.subcampanaId === subcampanaId);
}
function fotosDeSub(subcampanaId) {
  return FOTOS_PUBLICAS.filter(f => f.subcampanaId === subcampanaId);
}
function metricasDeSub(subcampanaId) {
  return METRICAS_DETALLE[subcampanaId] || { mortandad: 0, reposiciones: 0, vivosHoy: 0 };
}

window.SUBCAMPANAS_PUBLICAS  = SUBCAMPANAS_PUBLICAS;
window.CAMPANAS_PUBLICAS     = CAMPANAS_PUBLICAS;
window.TOTALES_PUBLICOS      = TOTALES_PUBLICOS;
window.PLANTACIONES_PUBLICAS = PLANTACIONES_PUBLICAS;
window.fmtMiles              = fmtMiles;
window.METRICAS_DETALLE      = METRICAS_DETALLE;
window.EVENTOS_TIMELINE      = EVENTOS_TIMELINE;
window.FOTOS_PUBLICAS        = FOTOS_PUBLICAS;
window.eventosDeSub          = eventosDeSub;
window.fotosDeSub            = fotosDeSub;
window.metricasDeSub         = metricasDeSub;
