// DetalleSubcampanaPublicaScreen.jsx
// Detalle público de sub-campaña (sección 3.3, RF-PLA-15).
// Sin login. Lee ?id= de la URL. Muestra métricas vivas, mix real de
// especies, timeline, galería de fotos y trazabilidad hacia M1/M2.
//
// Props: mostrarBlockchain boolean

function DetalleSubcampanaPublicaScreen({ mostrarBlockchain }) {
  const id = React.useMemo(() => new URLSearchParams(window.location.search).get('id'), []);

  const sub = React.useMemo(() => {
    const lista = window.SUBCAMPANAS_PUBLICAS || [];
    return (id ? lista.find(s => s.id === id) : lista[0]) || null;
  }, [id]);

  const [tabActiva, setTabActiva] = React.useState('resumen');

  // Datos derivados de la sub-campaña
  const metricas    = sub ? metricasDeSub(sub.id) : { mortandad: 0, reposiciones: 0, vivosHoy: 0 };
  const eventos     = sub ? eventosDeSub(sub.id)  : [];
  const fotos       = sub ? fotosDeSub(sub.id)    : [];
  const plantaciones = React.useMemo(() =>
    (window.PLANTACIONES_PUBLICAS || []).filter(p => sub && p.subcampanaId === sub.id),
    [sub]
  );

  // Equipo (coordinador + operarios con aportes)
  const equipo = React.useMemo(() => {
    if (!sub) return { coordinador: null, operarios: [] };
    const ids = sub.equipoIds || [];
    const personas = ids.map(i => window.personaById(i)).filter(Boolean);
    const coordinador = sub.coordinadorId ? window.personaById(sub.coordinadorId) : null;
    const operarios = personas.filter(p => p.rol === 'Operario');
    return { coordinador, operarios };
  }, [sub]);

  // Campaña madre para el link de volver
  const campanaId = sub ? sub.campanaId : null;

  if (!sub) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-5 py-20 bg-[#f4f8f4]">
        <Icon name="alert" className="h-12 w-12 text-slate-200 mb-4" />
        <p className="text-[13px] font-extrabold text-slate-500">Sub-campaña no encontrada</p>
        <a href="Home publica.html"
          className="mt-5 text-[11px] font-extrabold text-brand-600">
          ← Volver al inicio
        </a>
      </div>
    );
  }

  const pct = sub.meta ? Math.round((sub.plantados / sub.meta) * 100) : 0;
  const supervivencia = sub.supervivencia;
  const semaforo = supervivencia == null ? null
    : supervivencia > 85 ? { cls: 'text-emerald-600', bg: 'bg-emerald-50 ring-emerald-100', dot: 'bg-emerald-500' }
    : supervivencia >= 70 ? { cls: 'text-amber-600',   bg: 'bg-amber-50 ring-amber-100',    dot: 'bg-amber-500'   }
    : { cls: 'text-red-600', bg: 'bg-red-50 ring-red-100', dot: 'bg-red-500' };

  const tipoMeta = window.TIPO_META?.[sub.tipo];
  const backHref = campanaId
    ? `Detalle publico campana.html?id=${campanaId}`
    : 'Home publica.html';

  const tabs = [
    { id: 'resumen',  label: 'Resumen',  icon: 'layers'  },
    { id: 'mapa',     label: 'Mapa',     icon: 'map'     },
    { id: 'timeline', label: 'Timeline', icon: 'hash'    },
    { id: 'galeria',  label: 'Galería',  icon: 'photo'   },
  ];

  return (
    <div className="min-h-full bg-[#f4f8f4]">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 py-3 bg-brand-800 shadow-md">
        <div className="flex items-center gap-2 min-w-0">
          <a href={backHref}
            className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25 shrink-0">
            <Icon name="arrow-left" className="h-4 w-4 text-white" />
          </a>
          <div className="min-w-0">
            <p className="text-[9.5px] font-extrabold text-brand-300 leading-none uppercase tracking-[0.14em]">Sub-campaña</p>
            <p className="text-[11px] font-extrabold text-white leading-tight truncate max-w-[175px]">{sub.nombre}</p>
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
        <div className="pointer-events-none absolute inset-x-0 top-0" style={{ height: 160 }}>
          <svg viewBox="0 0 380 160" className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
            <ellipse cx="190" cy="-20" rx="220" ry="130" fill="white" />
          </svg>
        </div>

        {/* Tipo + estado/fase */}
        <div className="relative flex flex-wrap items-center gap-1.5 mb-3">
          {tipoMeta && (
            <TipoBadge tipo={sub.tipo} light compact />
          )}
          {sub.faseMantenimiento
            ? <FaseBadge fase={sub.faseMantenimiento} mesesRestantes={sub.mesesRestantesMantenimiento} light />
            : <StateBadge estado={sub.estado} light />
          }
          {sub.municipio && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9.5px] font-bold text-white/80 ring-1 ring-white/20">
              <Icon name="pin" className="h-3 w-3" />
              {sub.municipio}
            </span>
          )}
        </div>

        {/* Nombre */}
        <p className="relative text-[21px] font-extrabold text-white leading-tight tracking-[-0.02em] mb-1">
          {sub.nombre}
        </p>

        {/* Cobertura + fechas */}
        <div className="relative flex flex-col gap-1 mb-4">
          {sub.cobertura && (
            <div className="flex items-center gap-1.5 text-[11px] text-brand-200 font-medium">
              <Icon name="area" className="h-3.5 w-3.5 text-brand-300 shrink-0" />
              {sub.cobertura.label}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[11px] text-brand-200 font-medium">
            <Icon name="date" className="h-3.5 w-3.5 text-brand-300 shrink-0" />
            {sub.fechaInicio} – {sub.fechaFin}
          </div>
        </div>

        {/* Barra de progreso grande */}
        <div className="relative mb-4">
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-300">
              Árboles plantados
            </span>
            <span className="text-[28px] font-extrabold text-white tabular-nums leading-none">{pct}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9.5px] text-brand-300 font-bold">{fmtMiles(sub.plantados)} plantados</span>
            <span className="text-[9.5px] text-brand-400 font-bold">meta {fmtMiles(sub.meta)}</span>
          </div>
        </div>

        {/* Contador de mantenimiento */}
        {sub.faseMantenimiento === 'MANTENIMIENTO_ACTIVO' && sub.mesesRestantesMantenimiento && (
          <div className="relative mb-4">
            <div className="flex items-center gap-2.5 rounded-2xl bg-white/10 ring-1 ring-white/20 px-4 py-2.5">
              <Icon name="shield" className="h-4 w-4 text-blue-300 shrink-0" />
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-blue-200">Mantenimiento activo</p>
                <p className="text-[13px] font-extrabold text-white leading-tight">
                  {sub.mesesRestantesMantenimiento} meses restantes
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Banner cierre parcial */}
        {sub.estado === 'FINALIZADA_PARCIAL' && sub.motivoCierreParcial && (
          <div className="relative mb-2">
            <div className="flex items-start gap-2.5 rounded-2xl bg-amber-400/20 ring-1 ring-amber-400/30 px-4 py-2.5">
              <Icon name="alert" className="h-4 w-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-amber-200">Cerrada parcialmente</p>
                <p className="text-[11.5px] font-bold text-white/90 leading-snug">{sub.motivoCierreParcial}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── KPIs strip ── */}
      <div className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Árboles vivos hoy */}
          <div className={`rounded-2xl ring-1 px-3.5 py-3 ${semaforo?.bg || 'bg-brand-50 ring-brand-100'}`}>
            <div className="flex items-start justify-between mb-1">
              <Icon name="trees" className={`h-4 w-4 mt-0.5 ${semaforo?.cls || 'text-brand-600'}`} />
              {semaforo && (
                <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.1em] ring-1 ${semaforo.bg}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${semaforo.dot}`} />
                  {supervivencia}%
                </span>
              )}
            </div>
            <p className={`text-[22px] font-extrabold leading-none tabular-nums ${semaforo?.cls || 'text-brand-700'}`}>
              {fmtMiles(metricas.vivosHoy)}
            </p>
            <p className="text-[9px] font-bold text-slate-500 mt-0.5">árboles vivos hoy</p>
          </div>

          {/* CO₂ estimada */}
          <div className="rounded-2xl bg-brand-50 ring-1 ring-brand-100 px-3.5 py-3">
            <div className="flex items-start justify-between mb-1">
              <Icon name="leaf" className="h-4 w-4 text-brand-600 mt-0.5" />
              <span className="text-[8px] font-bold text-brand-400 bg-brand-100 px-1 py-0.5 rounded-full">est.</span>
            </div>
            <p className="text-[22px] font-extrabold text-brand-700 leading-none tabular-nums">
              {sub.co2Proyectado}
            </p>
            <p className="text-[9px] font-bold text-slate-500 mt-0.5">T CO₂ captura est.</p>
          </div>

          {/* Mortandad acumulada */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 px-3.5 py-3">
            <div className="flex items-start justify-between mb-1">
              <Icon name="loss" className="h-4 w-4 text-red-400 mt-0.5" />
            </div>
            <p className="text-[22px] font-extrabold text-slate-700 leading-none tabular-nums">
              {fmtMiles(metricas.mortandad)}
            </p>
            <p className="text-[9px] font-bold text-slate-500 mt-0.5">mortandad acumulada</p>
          </div>

          {/* Reposiciones */}
          <div className="rounded-2xl bg-orange-50 ring-1 ring-orange-100 px-3.5 py-3">
            <div className="flex items-start justify-between mb-1">
              <Icon name="refresh" className="h-4 w-4 text-orange-500 mt-0.5" />
            </div>
            <p className="text-[22px] font-extrabold text-orange-700 leading-none tabular-nums">
              {fmtMiles(metricas.reposiciones)}
            </p>
            <p className="text-[9px] font-bold text-slate-500 mt-0.5">reposiciones realizadas</p>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="sticky top-[52px] z-10 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex">
          {tabs.map(tab => (
            <button key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors border-b-2
                ${tabActiva === tab.id
                  ? 'text-brand-700 border-brand-600'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}>
              <Icon name={tab.icon} className="h-3.5 w-3.5" />
              <span className="text-[8.5px] font-extrabold uppercase tracking-[0.1em]">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Resumen ── */}
      {tabActiva === 'resumen' && (
        <div className="px-4 py-5 flex flex-col gap-5">

          {/* Mix de especies real */}
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600 mb-3">
              Composición de especies
            </p>
            <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-soft px-4 py-4">
              <MiniBarrasEspecies subcampana={sub} />
            </div>
          </div>

          {/* Coordinador */}
          {equipo.coordinador && (
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600 mb-3">
                Coordinador/a
              </p>
              <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-soft px-4 py-3.5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-[13px] font-extrabold text-brand-700 shrink-0">
                  {equipo.coordinador.iniciales}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-extrabold text-brand-800 leading-tight">{equipo.coordinador.nombre}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{equipo.coordinador.rol}</p>
                </div>
              </div>
            </div>
          )}

          {/* Equipo operario */}
          {equipo.operarios.length > 0 && (
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600 mb-3">
                Equipo · {equipo.operarios.length} operario{equipo.operarios.length !== 1 ? 's' : ''}
              </p>
              <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-soft overflow-hidden">
                {equipo.operarios.map((op, i) => (
                  <div key={op.id}
                    className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-extrabold text-slate-600 shrink-0">
                      {op.iniciales}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-extrabold text-slate-800 leading-tight">{op.nombre}</p>
                      <p className="text-[9.5px] font-bold text-slate-400">{op.rol}</p>
                    </div>
                    {op.plantadosTotal != null && (
                      <div className="text-right shrink-0">
                        <p className="text-[12px] font-extrabold text-brand-700 tabular-nums">{fmtMiles(op.plantadosTotal)}</p>
                        <p className="text-[8.5px] font-bold text-slate-400">árboles</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trazabilidad */}
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600 mb-3">
              Origen de los árboles
            </p>
            <TrazabilidadCard subcampana={sub} />
          </div>
        </div>
      )}

      {/* ── Mapa ── */}
      {tabActiva === 'mapa' && (
        <div className="bg-white px-4 py-5">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
              Mapa de la zona
            </p>
            <span className="text-[9.5px] font-bold text-slate-400">
              {sub.cobertura?.label || sub.municipio}
            </span>
          </div>
          <MapaPublico
            subcampanas={[sub]}
            plantaciones={plantaciones}
            filtroMapa="TODAS"
            mostrarPines={true}
            mostrarBlockchain={mostrarBlockchain}
            subcampanaSeleccionadaId={sub.id}
          />
          {plantaciones.length > 0 && (
            <p className="mt-3 text-[9.5px] font-bold text-slate-400 text-center">
              {plantaciones.length} registro{plantaciones.length !== 1 ? 's' : ''} GPS de plantación
            </p>
          )}
        </div>
      )}

      {/* ── Timeline ── */}
      {tabActiva === 'timeline' && (
        <div className="px-4 py-5">
          <div className="flex items-baseline justify-between mb-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
              Historial de eventos
            </p>
            <span className="text-[9.5px] font-bold text-slate-400">{eventos.length} eventos</span>
          </div>
          <TimelineEventos
            eventos={eventos}
            mostrarBlockchain={mostrarBlockchain}
          />
        </div>
      )}

      {/* ── Galería ── */}
      {tabActiva === 'galeria' && (
        <div className="px-4 py-5">
          <div className="flex items-baseline justify-between mb-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
              Galería de fotos
            </p>
            <span className="text-[9.5px] font-bold text-slate-400">{fotos.length} fotos</span>
          </div>
          <GaleriaFotos fotos={fotos} mostrarBlockchain={mostrarBlockchain} />
          {fotos.length > 0 && (
            <div className="mt-4 rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3.5 py-3">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Las fotos son evidencia de campo registrada por el equipo operativo.
                Las marcadas <span className="font-extrabold text-blue-600">on-chain</span> tienen
                su hash anclado en blockchain y son auditables.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

window.DetalleSubcampanaPublicaScreen = DetalleSubcampanaPublicaScreen;
