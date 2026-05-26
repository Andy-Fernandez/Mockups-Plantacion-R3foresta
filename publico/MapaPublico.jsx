// MapaPublico.jsx
// SVG estilizado para la vista pública. Sin Leaflet — coordenadas manuales.
// Se reusa en tarea 07 (Detalle de campaña pública).
//
// Props:
//   subcampanas      sub-campañas públicas (filtradas, no-BORRADOR)
//   plantaciones     PLANTACIONES_PUBLICAS con coords SVG
//   filtroMapa       'TODAS' | 'ACTIVAS' | 'MANTENIMIENTO'
//   mostrarPines     boolean
//   mostrarBlockchain boolean
//   subcampanaSeleccionadaId  string | null  (para drill-down externo, tarea 07)
//   onSelectSub      fn(sub | null)          (callback opcional)

// Posiciones de polígonos dentro del viewBox 0 0 360 210.
// Las zonas son ficticias pero representativas: izquierda = Hampaturi (altiplano),
// derecha = La Paz urbano.
const _POLIGS = {
  'SUB-007-A': { d: 'M 10 12 L 105 8 L 108 80 L 8 84 Z',       cx: 58,  cy: 46  },
  'SUB-007-B': { d: 'M 12 88 L 108 84 L 112 148 L 10 152 Z',   cx: 60,  cy: 118 },
  'SUB-014-B': { d: 'M 120 16 L 196 12 L 200 82 L 122 88 Z',   cx: 160, cy: 50  },
  'SUB-014-C': { d: 'M 125 92 L 215 86 L 220 138 L 128 144 Z', cx: 172, cy: 115 },
  'SUB-022-A': { d: 'M 118 148 L 208 142 L 212 188 L 116 192 Z', cx: 164, cy: 168 },
  'SUB-019-A': { d: 'M 220 86 L 305 80 L 310 146 L 224 152 Z', cx: 265, cy: 116 },
};

function _polyFill(sub) {
  if (sub.faseMantenimiento === 'MONITOREO_HISTORICO') return '#94a3b8';
  if (sub.faseMantenimiento === 'MANTENIMIENTO_ACTIVO') return '#3b82f6';
  if (sub.estado === 'ACTIVA') return '#1f613b';
  if (sub.estado === 'COMPLETADA') return '#3b82f6';
  return '#94a3b8';
}

function _passFilter(sub, filtro) {
  if (filtro === 'ACTIVAS') return sub.estado === 'ACTIVA';
  if (filtro === 'MANTENIMIENTO') return sub.faseMantenimiento === 'MANTENIMIENTO_ACTIVO';
  return true;
}

function _shortName(nombre) {
  if (!nombre) return '';
  const abbrev = { 'Etapa central · Av. Camacho': 'Av. Camacho', 'Etapa 2 · Pinar Sur': 'Pinar Sur' };
  return abbrev[nombre] || (nombre.length > 15 ? nombre.slice(0, 14) + '…' : nombre);
}

// ── Sub-componente: mini-card del pin seleccionado ───────────────────────────
function _PinCard({ pin, sub, mostrarBlockchain, onClose }) {
  return (
    <div className="mt-2 rounded-2xl bg-white p-3 ring-1 ring-black/5 shadow-soft">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-500 mb-0.5">{pin.fecha}</p>
          <p className="text-[13px] font-extrabold text-brand-800 leading-tight truncate">{pin.operarioSnapshot}</p>
          {sub && <p className="text-[10px] text-slate-400 mt-0.5 truncate">{sub.nombre}</p>}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {mostrarBlockchain && pin.tieneBlockchain && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-blue-700 ring-1 ring-blue-100">
              <Icon name="shield" className="h-3 w-3" />
              blockchain
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {pin.especies.map(e => (
          <span key={e.especie} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
            <Icon name="leaf" className="h-3 w-3" />
            {e.especie} · {e.cantidad}
          </span>
        ))}
      </div>
      <p className="text-[10px] text-slate-400">
        Lote origen: <span className="font-mono text-[9.5px] text-slate-500">{pin.loteOrigen}</span>
      </p>
      {!pin.tieneBlockchain && (
        <p className="text-[10px] text-slate-400 mt-1">Sin anclaje blockchain</p>
      )}
      <button onClick={onClose}
        className="mt-2 w-full text-center text-[10px] font-bold text-slate-400 py-1 hover:text-slate-600 transition-colors">
        cerrar
      </button>
    </div>
  );
}

// ── Sub-componente: panel del polígono seleccionado ──────────────────────────
function _PolyPanel({ sub, onClose }) {
  const avancePct = sub.meta ? Math.round((sub.plantados / sub.meta) * 100) : 0;
  return (
    <div className="mt-2 rounded-2xl bg-white p-3 ring-1 ring-black/5 shadow-soft">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-500 mb-0.5">{sub.municipio}</p>
          <p className="text-[13px] font-extrabold text-brand-800 leading-tight">{sub.nombre}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StateBadge estado={sub.estado} compact />
          {sub.faseMantenimiento && <FaseBadge fase={sub.faseMantenimiento} mesesRestantes={sub.mesesRestantesMantenimiento} compact />}
        </div>
      </div>
      {sub.coordinador && (
        <p className="text-[11px] text-slate-500 mb-2">
          <span className="font-bold text-brand-600">Coordinador/a:</span> {sub.coordinador}
        </p>
      )}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1">
          <Progress pct={avancePct} tone="brand" height={6} />
        </div>
        <span className="text-[10px] font-extrabold text-brand-700 tabular-nums whitespace-nowrap">
          {fmtMiles(sub.plantados)} / {fmtMiles(sub.meta || 0)}
        </span>
      </div>
      <div className="flex flex-wrap gap-3 text-[10px] text-slate-500 mt-1">
        <span><span className="font-bold text-brand-700">{sub.hectareas}</span> ha</span>
        {sub.supervivencia != null && (
          <span>Superv. <span className="font-bold text-emerald-600">{sub.supervivencia}%</span></span>
        )}
        <span>CO₂ est. <span className="font-bold text-brand-700">{sub.co2Proyectado} T</span></span>
      </div>
      <button onClick={onClose}
        className="mt-2 w-full text-center text-[10px] font-bold text-slate-400 py-1 hover:text-slate-600 transition-colors">
        cerrar
      </button>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
function MapaPublico({
  subcampanas,
  plantaciones,
  filtroMapa = 'TODAS',
  mostrarPines = true,
  mostrarBlockchain = true,
  subcampanaSeleccionadaId = null,
  onSelectSub = null,
}) {
  const [selSubId, setSelSubId] = React.useState(subcampanaSeleccionadaId);
  const [selPinId, setSelPinId] = React.useState(null);

  // Sync prop → state para uso externo (tarea 07)
  React.useEffect(() => { setSelSubId(subcampanaSeleccionadaId); }, [subcampanaSeleccionadaId]);

  const selSub = selSubId ? subcampanas.find(s => s.id === selSubId) : null;
  const selPin = selPinId ? plantaciones.find(p => p.id === selPinId) : null;
  const selPinSub = selPin ? subcampanas.find(s => s.id === selPin.subcampanaId) : null;

  const visibleSubs = subcampanas.filter(s => _POLIGS[s.id] && _passFilter(s, filtroMapa));
  const visiblePins = mostrarPines
    ? plantaciones.filter(p => {
        const sub = subcampanas.find(s => s.id === p.subcampanaId);
        return sub && _POLIGS[sub.id] && _passFilter(sub, filtroMapa);
      })
    : [];

  const handlePolyClick = (e, sub) => {
    e.stopPropagation();
    const next = selSubId === sub.id ? null : sub.id;
    setSelSubId(next);
    setSelPinId(null);
    onSelectSub && onSelectSub(next ? sub : null);
  };

  const handlePinClick = (e, pin) => {
    e.stopPropagation();
    setSelPinId(selPinId === pin.id ? null : pin.id);
    setSelSubId(null);
    onSelectSub && onSelectSub(null);
  };

  const clearSelection = () => {
    setSelSubId(null);
    setSelPinId(null);
    onSelectSub && onSelectSub(null);
  };

  return (
    <div>
      {/* ── SVG Map ── */}
      <div className="relative overflow-hidden rounded-2xl ring-1 ring-black/8 shadow-soft" onClick={clearSelection}>
        <svg viewBox="0 0 360 210" style={{ display: 'block', width: '100%' }}>
          <defs>
            <pattern id="topo-pub" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="0" cy="0" r="26" fill="none" stroke="#c8d5c2" strokeWidth="0.5" opacity="0.4" />
            </pattern>
            <pattern id="topo-pub-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M0 22h44M22 0v44" stroke="#c8d5c2" strokeWidth="0.3" opacity="0.3" />
            </pattern>
          </defs>

          {/* Background */}
          <rect width="360" height="210" fill="#eef2ed" />
          <rect width="360" height="210" fill="url(#topo-pub)" />
          <rect width="360" height="210" fill="url(#topo-pub-grid)" />

          {/* River */}
          <path d="M 0 108 Q 55 88 110 112 T 225 98 T 360 110"
            fill="none" stroke="#bcd0c6" strokeWidth="2" opacity="0.55" />

          {/* Zone separator */}
          <path d="M 115 0 L 115 210" stroke="#c0d0ba" strokeWidth="0.6"
            strokeDasharray="5 4" opacity="0.5" />

          {/* Zone labels */}
          <text x="57" y="202" textAnchor="middle" fontSize="7.5" fontWeight="800"
            fill="#4a7c5a" opacity="0.65" letterSpacing="0.06em" fontFamily="Manrope, system-ui, sans-serif">
            HAMPATURI
          </text>
          <text x="220" y="202" textAnchor="middle" fontSize="7.5" fontWeight="800"
            fill="#4a7c5a" opacity="0.65" letterSpacing="0.06em" fontFamily="Manrope, system-ui, sans-serif">
            LA PAZ URBANO
          </text>

          {/* ── Polígonos ── */}
          {visibleSubs.map(sub => {
            const poly = _POLIGS[sub.id];
            const fill = _polyFill(sub);
            const isSel = selSubId === sub.id;
            const isActiveSub = sub.estado === 'ACTIVA';
            return (
              <g key={sub.id} onClick={(e) => handlePolyClick(e, sub)} style={{ cursor: 'pointer' }}>
                {/* Sombra de selección */}
                {isSel && (
                  <path d={poly.d} fill="none" stroke={fill} strokeWidth="5"
                    strokeOpacity="0.2" strokeLinejoin="round" />
                )}
                <path
                  d={poly.d}
                  fill={fill}
                  fillOpacity={isSel ? 0.78 : 0.52}
                  stroke={fill}
                  strokeWidth={isSel ? 2.5 : 1.5}
                  strokeLinejoin="round"
                  strokeDasharray={isActiveSub ? 'none' : '6 3'}
                  strokeOpacity={0.9}
                />
                {/* Nombre */}
                <text x={poly.cx} y={poly.cy - 4}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="7" fontWeight="800" fill="white" opacity="0.96"
                  letterSpacing="0.01em" fontFamily="Manrope, system-ui, sans-serif"
                  style={{ pointerEvents: 'none' }}>
                  {_shortName(sub.nombre)}
                </text>
                {/* Plantados */}
                <text x={poly.cx} y={poly.cy + 6}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="6" fontWeight="700" fill="white" opacity="0.82"
                  fontFamily="Manrope, system-ui, sans-serif"
                  style={{ pointerEvents: 'none' }}>
                  {fmtMiles(sub.plantados)} árboles
                </text>
              </g>
            );
          })}

          {/* ── Pines GPS ── */}
          {visiblePins.map(pin => {
            const isSel = selPinId === pin.id;
            return (
              <g key={pin.id} onClick={(e) => handlePinClick(e, pin)} style={{ cursor: 'pointer' }}>
                {/* Sombra */}
                <circle cx={pin.svgX} cy={pin.svgY + 1.5} r={isSel ? 7.5 : 5.5}
                  fill="rgba(0,0,0,0.12)" />
                {/* Cuerpo del pin */}
                <circle cx={pin.svgX} cy={pin.svgY} r={isSel ? 7 : 5}
                  fill="white"
                  stroke={isSel ? '#0f3b23' : '#1f613b'}
                  strokeWidth={isSel ? 2 : 1.5} />
                <circle cx={pin.svgX} cy={pin.svgY} r={isSel ? 3 : 2}
                  fill={isSel ? '#0f3b23' : '#1f613b'} />
                {/* Indicador blockchain */}
                {mostrarBlockchain && pin.tieneBlockchain && (
                  <circle
                    cx={pin.svgX + (isSel ? 5 : 3.5)}
                    cy={pin.svgY - (isSel ? 5 : 3.5)}
                    r="2.5" fill="#3b82f6" stroke="white" strokeWidth="1" />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Leyenda ── */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2 px-1">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-500 opacity-75 flex-shrink-0" />
          ACTIVA
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-500 opacity-75 flex-shrink-0" />
          En mantenimiento
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
          <span className="h-2.5 w-2.5 rounded-sm bg-slate-400 opacity-75 flex-shrink-0" />
          Monitoreo histórico
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-white ring-1 ring-brand-600 flex-shrink-0" />
          Plantación GPS
        </span>
        {mostrarBlockchain && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
            <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            Anclado blockchain
          </span>
        )}
      </div>

      <p className="text-[10px] text-slate-400 mt-1.5 px-1">
        Toca un polígono para ver el resumen · Toca un pin para ver la plantación
      </p>

      {/* ── Panel: polígono seleccionado ── */}
      {selSub && <_PolyPanel sub={selSub} onClose={clearSelection} />}

      {/* ── Mini-card: pin seleccionado ── */}
      {selPin && <_PinCard pin={selPin} sub={selPinSub} mostrarBlockchain={mostrarBlockchain} onClose={() => setSelPinId(null)} />}
    </div>
  );
}

window.MapaPublico = MapaPublico;
