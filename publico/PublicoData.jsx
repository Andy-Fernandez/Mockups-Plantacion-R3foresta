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

window.SUBCAMPANAS_PUBLICAS  = SUBCAMPANAS_PUBLICAS;
window.CAMPANAS_PUBLICAS     = CAMPANAS_PUBLICAS;
window.TOTALES_PUBLICOS      = TOTALES_PUBLICOS;
window.PLANTACIONES_PUBLICAS = PLANTACIONES_PUBLICAS;
window.fmtMiles              = fmtMiles;
