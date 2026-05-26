// HomePublicaScreen.jsx
// Vista pública sin login (RF-PLA-15). Transparencia y naturaleza.
// Sin BottomNav, sin referencias a usuario actual.
//
// Props:
//   mostrarPines       boolean
//   mostrarBlockchain  boolean
//   filtroMapa         'TODAS' | 'ACTIVAS' | 'MANTENIMIENTO'

// ── Hero / KPI ───────────────────────────────────────────────────────────────
function _HeroSection({ totales, mostrarBlockchain }) {
  const kpis = [
    {
      valor: fmtMiles(totales.arbolesPlantados),
      unidad: 'árboles',
      label: 'plantados',
      icon: 'trees',
    },
    {
      valor: totales.co2ToneladasEstimadas,
      unidad: 'T CO₂',
      label: 'captura estimada',
      icon: 'leaf',
      tooltip: 'Proyección basada en especies × cantidades × curvas promedio',
    },
    {
      valor: totales.subcampanasActivas,
      unidad: 'zonas',
      label: 'activas ahora',
      icon: 'flag',
    },
    {
      valor: totales.comunidadesAlcanzadas,
      unidad: 'comunidades',
      label: 'alcanzadas',
      icon: 'users',
    },
  ];

  return (
    <div className="relative bg-gradient-to-b from-brand-800 to-brand-900 px-5 pt-5 pb-7">
      {/* Decorative arc */}
      <div className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden" style={{ height: 220 }}>
        <svg viewBox="0 0 380 220" className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
          <ellipse cx="190" cy="-30" rx="220" ry="160" fill="white" />
        </svg>
      </div>

      {/* Title */}
      <div className="relative mb-5">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-300 mb-1">
          Programa de plantación · Bolivia 2026
        </p>
        <h1 className="text-[22px] font-extrabold text-white leading-[1.15] tracking-[-0.02em]">
          Plantación<br />urbana y nativa
        </h1>
        <p className="text-[12.5px] text-brand-200 mt-2 font-medium leading-snug">
          Datos verificables · Transparencia blockchain
        </p>
      </div>

      {/* KPI grid 2×2 */}
      <div className="relative grid grid-cols-2 gap-2.5">
        {kpis.map((k, i) => (
          <div key={i}
            className="rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm px-3.5 py-3">
            <div className="flex items-start justify-between mb-1">
              <Icon name={k.icon} className="h-4 w-4 text-brand-200 mt-0.5" />
              {k.tooltip && (
                <span className="text-[8.5px] font-bold text-brand-300 bg-white/10 px-1.5 py-0.5 rounded-full">
                  est.
                </span>
              )}
            </div>
            <p className="text-[24px] font-extrabold text-white leading-none tracking-[-0.03em]">
              {k.valor}
            </p>
            <p className="text-[10px] font-bold text-brand-200 mt-0.5 leading-tight">
              {k.unidad}
            </p>
            <p className="text-[9.5px] text-brand-300 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Blockchain badge */}
      {mostrarBlockchain && (
        <div className="relative mt-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white ring-1 ring-white/20">
            <Icon name="shield" className="h-3.5 w-3.5" />
            Verificable en blockchain
          </span>
        </div>
      )}
    </div>
  );
}

// ── Mapa ─────────────────────────────────────────────────────────────────────
function _MapaSection({ subcampanas, plantaciones, filtroMapa, mostrarPines, mostrarBlockchain }) {
  return (
    <div className="px-4 py-5">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
          Mapa interactivo
        </p>
        <span className="text-[10px] text-slate-400 font-bold">
          {subcampanas.filter(s => s.estado === 'ACTIVA').length} zonas activas
        </span>
      </div>
      <MapaPublico
        subcampanas={subcampanas}
        plantaciones={plantaciones}
        filtroMapa={filtroMapa}
        mostrarPines={mostrarPines}
        mostrarBlockchain={mostrarBlockchain}
      />
    </div>
  );
}

// ── Sub-campañas activas ──────────────────────────────────────────────────────
function _SubcampanasActivasSection({ subcampanas }) {
  const activas = subcampanas.filter(s => s.estado === 'ACTIVA');
  if (!activas.length) return null;

  return (
    <div className="px-4 pb-5">
      <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-brand-600 mb-3">
        Zonas en plantación activa
      </p>
      <div className="flex flex-col gap-2.5">
        {activas.map(sub => {
          const pct = sub.meta ? Math.round((sub.plantados / sub.meta) * 100) : 0;
          return (
            <div key={sub.id} className="rounded-2xl bg-white ring-1 ring-black/5 shadow-soft px-3.5 py-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 truncate">{sub.municipio}</p>
                  <p className="text-[13px] font-extrabold text-brand-800 leading-tight">{sub.nombre}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-[18px] font-extrabold text-brand-600 leading-none tabular-nums">{pct}%</span>
                </div>
              </div>
              <Progress pct={pct} tone="brand" height={6} />
              <div className="flex justify-between mt-1.5 text-[10px] text-slate-500">
                <span>
                  <span className="font-extrabold text-brand-700">{fmtMiles(sub.plantados)}</span>
                  {' '}/{' '}{fmtMiles(sub.meta)} árboles
                </span>
                {sub.coordinador && (
                  <span className="truncate max-w-[140px] text-right">{sub.coordinador}</span>
                )}
              </div>
              {sub.mixPlanificado && sub.mixPlanificado.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {sub.mixPlanificado.slice(0, 3).map(m => (
                    <span key={m.especie}
                      className="inline-flex items-center gap-0.5 rounded-full bg-brand-50 px-2 py-0.5 text-[9.5px] font-bold text-brand-600">
                      <Icon name="leaf" className="h-2.5 w-2.5" />
                      {m.especie}
                    </span>
                  ))}
                  {sub.mixPlanificado.length > 3 && (
                    <span className="text-[9.5px] text-slate-400 font-bold self-center">
                      +{sub.mixPlanificado.length - 3} más
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Mosaico de campañas ───────────────────────────────────────────────────────
function _CampanaCard({ campana, mostrarBlockchain }) {
  const [expandida, setExpandida] = React.useState(false);
  const visibleSubs = campana.subcampanas || [];

  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-soft overflow-hidden">
      {/* Header de campaña */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 mb-0.5 truncate">
              {campana.fechaInicio} – {campana.fechaFin}
            </p>
            <p className="text-[14px] font-extrabold text-brand-800 leading-tight">{campana.nombre}</p>
          </div>
          <StateBadge estado={campana.estado} compact />
        </div>

        {/* Org logos */}
        {campana.organizaciones && campana.organizaciones.length > 0 && (
          <div className="mb-3">
            <OrgInlineList items={campana.organizaciones} compact />
          </div>
        )}

        {/* Totales */}
        <div className="grid grid-cols-3 gap-2 bg-brand-50 rounded-xl p-2.5">
          <div className="text-center">
            <p className="text-[16px] font-extrabold text-brand-700 leading-none tabular-nums">
              {fmtMiles(campana.plantados)}
            </p>
            <p className="text-[9px] font-bold text-brand-500 mt-0.5">árboles</p>
          </div>
          <div className="text-center border-x border-brand-100">
            <p className="text-[16px] font-extrabold text-brand-700 leading-none tabular-nums">
              {campana.hectareas}
            </p>
            <p className="text-[9px] font-bold text-brand-500 mt-0.5">ha</p>
          </div>
          <div className="text-center">
            <p className="text-[16px] font-extrabold text-brand-700 leading-none tabular-nums">
              {visibleSubs.length}
            </p>
            <p className="text-[9px] font-bold text-brand-500 mt-0.5">zonas</p>
          </div>
        </div>
      </div>

      {/* Lista de sub-campañas */}
      <div className="border-t border-slate-100">
        {(expandida ? visibleSubs : visibleSubs.slice(0, 2)).map((sub, i) => {
          const pct = sub.meta ? Math.round((sub.plantados / sub.meta) * 100) : 0;
          return (
            <div key={sub.id}
              className={`px-4 py-2.5 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex-1 min-w-0 text-[11.5px] font-extrabold text-brand-800 truncate">
                  {sub.nombre}
                </span>
                {sub.faseMantenimiento
                  ? <FaseBadge fase={sub.faseMantenimiento} compact />
                  : <StateBadge estado={sub.estado} compact />
                }
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Progress pct={pct} tone={sub.estado === 'ACTIVA' ? 'brand' : 'blue'} height={5} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 tabular-nums whitespace-nowrap">
                  {fmtMiles(sub.plantados)}/{fmtMiles(sub.meta || 0)}
                </span>
              </div>
            </div>
          );
        })}
        {visibleSubs.length > 2 && (
          <button
            onClick={() => setExpandida(v => !v)}
            className="flex w-full items-center justify-center gap-1 py-2.5 text-[10.5px] font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors">
            <Icon name={expandida ? 'chevron-down' : 'chevron-right'}
              className={`h-3.5 w-3.5 transition-transform ${expandida ? 'rotate-180' : ''}`} />
            {expandida ? 'Ver menos' : `Ver ${visibleSubs.length - 2} zona${visibleSubs.length - 2 > 1 ? 's' : ''} más`}
          </button>
        )}
      </div>

      {/* Link a detalle (placeholder tarea 07) */}
      <div className="px-4 py-3 border-t border-slate-100">
        <button className="flex w-full items-center justify-between text-[11px] font-extrabold text-brand-600 hover:text-brand-800 transition-colors">
          <span>Ver detalle público</span>
          <Icon name="chevron-right" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function _MosaicoCampanasSection({ campanas, mostrarBlockchain }) {
  return (
    <div className="px-4 pb-5">
      <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-brand-600 mb-3">
        Campañas
      </p>
      <div className="flex flex-col gap-3">
        {campanas.map(c => (
          <_CampanaCard key={c.id} campana={c} mostrarBlockchain={mostrarBlockchain} />
        ))}
      </div>
    </div>
  );
}

// ── Sección de transparencia blockchain ───────────────────────────────────────
const _EVENTOS_BLOCKCHAIN = [
  { key: 'SUBCAMPANIA_ACTIVADA',        label: 'Sub-campaña activada',    icon: 'flag'    },
  { key: 'PLANTACION_INICIAL',          label: 'Plantación inicial',      icon: 'planting' },
  { key: 'REPOSICION',                  label: 'Reposición',              icon: 'refresh' },
  { key: 'SUBCAMPANIA_COMPLETADA',      label: 'Sub-campaña completada',  icon: 'check-circle' },
  { key: 'SUBCAMPANIA_FINALIZADA_PARCIAL', label: 'Cierre parcial',       icon: 'alert'   },
];

function _TransparenciaSection({ mostrarBlockchain }) {
  return (
    <div className="bg-brand-800 mx-0 px-5 py-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 shrink-0">
          <Icon name="shield" className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-300 mb-0.5">
            Transparencia
          </p>
          <p className="text-[13px] font-extrabold text-white leading-tight">
            Este proyecto vive en blockchain
          </p>
        </div>
      </div>

      <p className="text-[12px] text-brand-200 leading-relaxed mb-5">
        Todos los datos son auditables. Cada plantación tiene foto, GPS, especies y lote de
        origen verificables.
      </p>

      {mostrarBlockchain && (
        <>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-400 mb-2.5">
            Eventos anclados
          </p>
          <div className="flex flex-col gap-2">
            {_EVENTOS_BLOCKCHAIN.map(ev => (
              <div key={ev.key}
                className="flex items-center gap-2.5 rounded-xl bg-white/8 ring-1 ring-white/10 px-3 py-2">
                <Icon name={ev.icon} className="h-4 w-4 text-brand-300 shrink-0" />
                <span className="flex-1 text-[11px] font-bold text-white">{ev.label}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/25 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-blue-200 ring-1 ring-blue-400/30">
                  <Icon name="link" className="h-2.5 w-2.5" />
                  on-chain
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-5 rounded-xl bg-white/8 ring-1 ring-white/10 px-3 py-2.5">
        <p className="text-[10.5px] text-brand-300 leading-relaxed">
          El anclaje blockchain es complementario: si un evento no tiene anclaje, igual se
          muestra. Los datos de plantación son primarios.
        </p>
      </div>
    </div>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────
function HomePublicaScreen({ mostrarPines, mostrarBlockchain, filtroMapa }) {
  const totales   = window.TOTALES_PUBLICOS;
  const subcampanas  = window.SUBCAMPANAS_PUBLICAS;
  const campanas  = window.CAMPANAS_PUBLICAS;
  const plantaciones = window.PLANTACIONES_PUBLICAS;

  return (
    <div className="min-h-full bg-[#f4f8f4] pb-10">
      {/* ── Header sticky ── */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-brand-800 shadow-md">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <Icon name="leaf" className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-white leading-tight">R3foresta</p>
            <p className="text-[9px] font-bold text-brand-300 leading-none">Plantación</p>
          </div>
        </div>
        {mostrarBlockchain && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-brand-200 ring-1 ring-white/15">
            <Icon name="shield" className="h-3 w-3" />
            blockchain
          </span>
        )}
      </div>

      {/* ── Hero ── */}
      <_HeroSection totales={totales} mostrarBlockchain={mostrarBlockchain} />

      {/* ── Mapa ── */}
      <div className="bg-white mx-0 mt-0">
        <_MapaSection
          subcampanas={subcampanas}
          plantaciones={plantaciones}
          filtroMapa={filtroMapa}
          mostrarPines={mostrarPines}
          mostrarBlockchain={mostrarBlockchain}
        />
      </div>

      {/* ── Zonas activas ── */}
      <div className="bg-[#f4f8f4] pt-5">
        <_SubcampanasActivasSection subcampanas={subcampanas} />
      </div>

      {/* ── Mosaico campañas ── */}
      <div className="bg-[#f4f8f4]">
        <_MosaicoCampanasSection campanas={campanas} mostrarBlockchain={mostrarBlockchain} />
      </div>

      {/* ── Transparencia blockchain ── */}
      <_TransparenciaSection mostrarBlockchain={mostrarBlockchain} />
    </div>
  );
}

window.HomePublicaScreen = HomePublicaScreen;
