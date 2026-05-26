// DetalleCampanaPublicaScreen.jsx
// Detalle público de campaña paraguas (sección 3.2, RF-PLA-15).
// Sin login. Lee ?id= de la URL. Estado derivado, lista de sub-campañas,
// mapa con todos los polígonos, timeline de eventos agregados.
//
// Props: mostrarBlockchain boolean

function DetalleCampanaPublicaScreen({ mostrarBlockchain }) {
  const id = React.useMemo(() => new URLSearchParams(window.location.search).get('id'), []);

  const campana = React.useMemo(() => {
    const lista = window.CAMPANAS_PUBLICAS || [];
    return (id ? lista.find(c => c.id === id) : lista[0]) || null;
  }, [id]);

  const [tabActiva, setTabActiva] = React.useState('resumen');

  // Sub-campañas visibles (no BORRADOR ya filtradas por PublicoData)
  const subcampanas = campana ? (campana.subcampanas || []) : [];

  // Plantaciones de esta campaña para el mapa
  const plantaciones = React.useMemo(() =>
    (window.PLANTACIONES_PUBLICAS || []).filter(p =>
      subcampanas.some(s => s.id === p.subcampanaId)
    ),
    [subcampanas]
  );

  // Timeline mezclado: todos los eventos de las hijas, orden cronológico inverso.
  // Enriquecer cada evento con el nombre de la sub-campaña para contexto.
  const eventosAll = React.useMemo(() => {
    const evs = subcampanas.flatMap(s => {
      const nombre = s.nombre;
      return (eventosDeSub(s.id) || []).map(ev => ({ ...ev, subcampanaNombre: nombre }));
    });
    return evs.sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));
  }, [subcampanas]);

  if (!campana) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-5 py-20 bg-[#f4f8f4]">
        <Icon name="alert" className="h-12 w-12 text-slate-200 mb-4" />
        <p className="text-[13px] font-extrabold text-slate-500">Campaña no encontrada</p>
        <a href="Home publica.html"
          className="mt-5 text-[11px] font-extrabold text-brand-600">
          ← Volver al inicio
        </a>
      </div>
    );
  }

  const pct = campana.meta ? Math.round((campana.plantados / campana.meta) * 100) : 0;
  const kpis = [
    { valor: campana.hectareas,   unidad: 'ha',     label: 'superficie',   icon: 'area'    },
    { valor: subcampanas.length,  unidad: 'zonas',  label: 'sub-campañas', icon: 'flag'    },
    { valor: campana.supervivencia != null ? campana.supervivencia + '%' : '—',
                                  unidad: '',        label: 'supervivencia', icon: 'trending'},
    { valor: campana.co2Proyectado, unidad: 'T CO₂', label: 'cap. est.',   icon: 'leaf', est: true },
  ];

  const tabs = [
    { id: 'resumen',  label: 'Resumen',  icon: 'layers' },
    { id: 'mapa',     label: 'Mapa',     icon: 'map'    },
    { id: 'timeline', label: 'Timeline', icon: 'hash'   },
  ];

  return (
    <div className="min-h-full bg-[#f4f8f4]">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 py-3 bg-brand-800 shadow-md">
        <div className="flex items-center gap-2 min-w-0">
          <a href="Home publica.html"
            className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 shrink-0">
            <Icon name="arrow-left" className="h-4 w-4 text-white" />
          </a>
          <div className="min-w-0">
            <p className="text-[9.5px] font-extrabold text-brand-300 leading-none uppercase tracking-[0.14em]">Campaña</p>
            <p className="text-[11px] font-extrabold text-white leading-tight truncate max-w-[180px]">
              {campana.nombre}
            </p>
          </div>
        </div>
        {mostrarBlockchain && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-brand-200 ring-1 ring-white/15 shrink-0">
            <Icon name="shield" className="h-3 w-3" />
            blockchain
          </span>
        )}
      </div>

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-b from-brand-800 to-brand-900 px-5 pt-5 pb-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0" style={{ height: 180 }}>
          <svg viewBox="0 0 380 180" className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
            <ellipse cx="190" cy="-20" rx="220" ry="140" fill="white" />
          </svg>
        </div>

        {/* Estado derivado */}
        <div className="relative flex flex-wrap gap-1.5 mb-3">
          {campana.faseMantenimiento
            ? <FaseBadge fase={campana.faseMantenimiento} mesesRestantes={campana.mesesRestantesMantenimiento} light />
            : <StateBadge estado={campana.estado} light />
          }
          {campana.zona && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9.5px] font-bold text-white/80 ring-1 ring-white/20">
              <Icon name="pin" className="h-3 w-3" />
              {campana.zona}
            </span>
          )}
        </div>

        {/* Nombre + descripción */}
        <p className="relative text-[21px] font-extrabold text-white leading-tight tracking-[-0.02em] mb-1.5">
          {campana.nombre}
        </p>
        {campana.descripcion && (
          <p className="relative text-[12px] text-brand-200 font-medium leading-snug mb-4">
            {campana.descripcion}
          </p>
        )}

        {/* Organizaciones */}
        {campana.organizaciones && campana.organizaciones.length > 0 && (
          <div className="relative mb-4">
            <OrgInlineList items={campana.organizaciones} light compact />
          </div>
        )}

        {/* Fechas */}
        <div className="relative flex items-center gap-2 mb-4 text-[11px] text-brand-200 font-medium">
          <Icon name="date" className="h-3.5 w-3.5 text-brand-300 shrink-0" />
          {campana.fechaInicio} – {campana.fechaFin}
        </div>

        {/* Barra de progreso */}
        <div className="relative mb-5">
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-300">Progreso total</span>
            <span className="text-[24px] font-extrabold text-white tabular-nums leading-none">{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9.5px] text-brand-300 font-bold">{fmtMiles(campana.plantados)} plantados</span>
            <span className="text-[9.5px] text-brand-400 font-bold">meta {fmtMiles(campana.meta)}</span>
          </div>
        </div>

        {/* KPI grid 2×2 */}
        <div className="relative grid grid-cols-2 gap-2">
          {kpis.map((k, i) => (
            <div key={i} className="rounded-xl bg-white/10 ring-1 ring-white/15 px-3 py-2.5">
              <div className="flex items-start justify-between mb-1">
                <Icon name={k.icon} className="h-3.5 w-3.5 text-brand-300 mt-0.5" />
                {k.est && (
                  <span className="text-[7.5px] font-bold text-brand-300 bg-white/10 px-1 py-0.5 rounded-full">est.</span>
                )}
              </div>
              <p className="text-[20px] font-extrabold text-white leading-none tabular-nums">{k.valor}</p>
              {k.unidad && <p className="text-[8.5px] font-bold text-brand-200 mt-0.5">{k.unidad}</p>}
              <p className="text-[8.5px] text-brand-300 mt-0.5">{k.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="sticky top-[52px] z-10 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex">
          {tabs.map(tab => (
            <button key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors border-b-2
                ${tabActiva === tab.id
                  ? 'text-brand-700 border-brand-600'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}>
              <Icon name={tab.icon} className="h-4 w-4" />
              <span className="text-[9.5px] font-extrabold uppercase tracking-[0.1em]">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Resumen ── */}
      {tabActiva === 'resumen' && (
        <div className="px-4 py-5">

          {/* Distribución de estados */}
          {campana.distribucionEstados && Object.keys(campana.distribucionEstados).some(e => e !== 'BORRADOR') && (
            <div className="mb-6">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600 mb-3">
                Estado de las zonas
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(campana.distribucionEstados)
                  .filter(([e]) => e !== 'BORRADOR')
                  .map(([estado, count]) => {
                    const m = window.ESTADO_META?.[estado];
                    return (
                      <div key={estado}
                        className="rounded-xl bg-white ring-1 ring-black/5 shadow-sm px-3 py-2.5 flex items-center gap-2.5">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${m?.dot || 'bg-slate-300'}`} />
                        <div className="min-w-0">
                          <p className="text-[17px] font-extrabold text-slate-800 leading-none">{count}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-0.5 truncate">{m?.short || estado}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Listado de sub-campañas */}
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600 mb-3">
            Sub-campañas · {subcampanas.length}
          </p>
          <div className="flex flex-col gap-2.5">
            {subcampanas.map(sub => {
              const pctSub = sub.meta ? Math.round((sub.plantados / sub.meta) * 100) : 0;
              const barColor = sub.estado === 'ACTIVA' ? '#1f613b' : '#3b82f6';
              return (
                <a key={sub.id}
                  href={`Detalle publico subcampana.html?id=${sub.id}`}
                  className="block rounded-2xl bg-white ring-1 ring-black/5 shadow-soft px-4 py-3.5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="text-[9.5px] font-bold text-slate-400 truncate">{sub.municipio}</p>
                      <p className="text-[13px] font-extrabold text-brand-800 leading-tight">{sub.nombre}</p>
                    </div>
                    <div className="shrink-0">
                      {sub.faseMantenimiento
                        ? <FaseBadge fase={sub.faseMantenimiento} compact />
                        : <StateBadge estado={sub.estado} compact />
                      }
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{ width: `${Math.min(pctSub, 100)}%`, backgroundColor: barColor }} />
                    </div>
                    <span className="text-[10.5px] font-extrabold text-slate-600 tabular-nums whitespace-nowrap">
                      {pctSub}%
                    </span>
                  </div>
                  <div className="flex justify-between text-[9.5px] text-slate-500 mb-2">
                    <span>
                      <span className="font-extrabold text-brand-700">{fmtMiles(sub.plantados)}</span>
                      {' '}/{' '}{fmtMiles(sub.meta)} árboles
                    </span>
                    {sub.coordinador && (
                      <span className="truncate max-w-[120px] text-right">{sub.coordinador}</span>
                    )}
                  </div>

                  {sub.mixPlanificado && sub.mixPlanificado.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {sub.mixPlanificado.slice(0, 3).map(m => (
                        <span key={m.especie}
                          className="inline-flex items-center gap-0.5 rounded-full bg-brand-50 px-2 py-0.5 text-[9px] font-bold text-brand-600">
                          <Icon name="leaf" className="h-2.5 w-2.5" />
                          {m.especie}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 text-[10px] font-extrabold text-brand-500">
                    <span>Ver detalle</span>
                    <Icon name="chevron-right" className="h-3.5 w-3.5" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Mapa ── */}
      {tabActiva === 'mapa' && (
        <div className="bg-white px-4 py-5">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
              Mapa de la campaña
            </p>
            <span className="text-[9.5px] font-bold text-slate-400">
              {subcampanas.length} zona{subcampanas.length !== 1 ? 's' : ''}
            </span>
          </div>
          <MapaPublico
            subcampanas={subcampanas}
            plantaciones={plantaciones}
            filtroMapa="TODAS"
            mostrarPines={true}
            mostrarBlockchain={mostrarBlockchain}
          />
        </div>
      )}

      {/* ── Timeline ── */}
      {tabActiva === 'timeline' && (
        <div className="px-4 py-5">
          <div className="flex items-baseline justify-between mb-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
              Historial de eventos
            </p>
            <span className="text-[9.5px] font-bold text-slate-400">{eventosAll.length} eventos</span>
          </div>
          <TimelineEventos
            eventos={eventosAll}
            mostrarBlockchain={mostrarBlockchain}
            mostrarSubcampana={true}
          />
        </div>
      )}
    </div>
  );
}

window.DetalleCampanaPublicaScreen = DetalleCampanaPublicaScreen;
