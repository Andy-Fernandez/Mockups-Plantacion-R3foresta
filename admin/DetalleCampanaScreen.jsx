// Detalle de campaña — vista de COORDINACIÓN (campaña paraguas).
//
// Esta pantalla agrega/resume los datos de sus sub-campañas. NO ejecuta:
// asignar equipo, asignar lotes, cambiar mix, pausar — esas acciones viven
// en el detalle de sub-campaña. Aquí solo se LEE el agregado y se NAVEGA
// hacia abajo.
//
// Tabs (preservadas para compatibilidad con el host):
//   resumen → KPIs agregados + cobertura + lista de sub-campañas + actividad
//   equipo  → recursos · personas agregadas de todas las hijas
//   lotes   → recursos · lotes comprometidos + mix agregado
//   mapa    → cobertura geográfica con polígonos por sub-campaña

// ── Atoms locales ───────────────────────────────────────────────────────

// Badge propio de sub-campaña (más estados que ESTADO_META de campaña).
function SubcampanaBadge({ estado }) {
  const m = ESTADO_SUBCAMPANA_META[estado];
  if (!m) return null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] ring-1 ${m.tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function TipoSubBadge({ tipo }) {
  if (!tipo) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-700 ring-1 ring-brand-100">
      {TIPO_SUBCAMPANA_LABEL[tipo] || tipo}
    </span>
  );
}

// ── Header hero ─────────────────────────────────────────────────────────

function DCHeader({ campana, onBack, onMore }) {
  const isPausada = campana.estado === 'PAUSADA';
  return (
    <header className="relative overflow-hidden rounded-b-3xl bg-brand-700 text-white shadow-soft">
      <img src="assets/plantacion.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-brand-700/95" />
      <div className="relative px-5 pt-5 pb-5">
        <div className="flex items-center justify-between gap-2">
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition" aria-label="Volver">
            <Icon name="arrow-left" className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <TipoBadge tipo={campana.tipo} />
            <StateBadge estado={campana.estado} light />
            <button onClick={onMore} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition" aria-label="Más opciones">
              <Icon name="ellipsis" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mt-4 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/85">
          Campaña paraguas · {campana.id}
        </p>
        <h1 className="mt-0.5 text-[26px] font-extrabold leading-[1.1] tracking-tight">{campana.nombre}</h1>
        <p className="mt-1 text-[12.5px] font-medium text-white/85">{campana.organizacion}</p>

        <p className="mt-2 flex items-center gap-3 text-[11.5px] font-bold text-white/80">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="date" className="h-3.5 w-3.5" />
            {campana.fechaInicio} → {campana.fechaFin}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="pin" className="h-3.5 w-3.5" />
            {campana.zona}
          </span>
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Plantados agregados</p>
            <p className="mt-0.5 text-[40px] font-extrabold leading-none tracking-tight tabular-nums">
              {campana.plantados.toLocaleString('es-BO')}
              <span className="ml-1 text-base font-extrabold text-white/65">/ {campana.meta.toLocaleString('es-BO')}</span>
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] font-bold text-white/70">Avance</p>
            <p className="text-2xl font-extrabold tabular-nums">{campana.avancePct}%</p>
          </div>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-emerald-300" style={{ width: `${campana.avancePct}%` }} />
        </div>

        {/* Subtítulo paraguas: conteo y distribución de hijas */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-extrabold tracking-wide ring-1 ring-white/20">
            <Icon name="trees" className="h-3 w-3" />
            {campana.subcampanasCount} sub-campañas
          </span>
          {Object.entries(campana.distribucionEstados || {}).map(([k, v]) => {
            const dot = ESTADO_SUBCAMPANA_META[k]?.dot || 'bg-white/60';
            return (
              <span key={k} className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.14em] ring-1 ring-white/20">
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                {v} {k.replace('_', ' ').toLowerCase()}
              </span>
            );
          })}
        </div>

        {isPausada && (
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-400/15 px-3 py-2.5 ring-1 ring-amber-300/40">
            <Icon name="pause" className="h-4 w-4 mt-0.5 text-amber-200 flex-shrink-0" />
            <p className="text-[11.5px] font-bold text-amber-100 leading-snug">
              <b className="text-white">Paraguas pausado:</b> sus sub-campañas están en pausa. {campana.pausaMotivo || ''}
            </p>
          </div>
        )}
      </div>
    </header>
  );
}

// ── Tabs ────────────────────────────────────────────────────────────────

function DCTabs({ active, onChange }) {
  const tabs = [
    { k: 'resumen', label: 'Resumen' },
    { k: 'equipo',  label: 'Recursos' },
    { k: 'lotes',   label: 'Lotes' },
    { k: 'mapa',    label: 'Mapa' },
  ];
  return (
    <div className="sticky top-0 z-20 -mx-5 px-5 pt-3 pb-2 bg-[#eef2ed]/95 backdrop-blur-sm">
      <div className="flex rounded-full bg-white p-1 shadow-soft ring-1 ring-black/5">
        {tabs.map(t => {
          const isOn = t.k === active;
          return (
            <button key={t.k} onClick={() => onChange(t.k)}
              className={`flex-1 rounded-full px-3 py-2 text-[12px] font-extrabold tracking-wide transition ${isOn ? 'bg-brand-600 text-white shadow-soft' : 'text-brand-700 hover:bg-brand-50'}`}>
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── SubcampanaRow (clave) ───────────────────────────────────────────────

function SubcampanaRow({ s, onTap }) {
  const pct = s.meta ? Math.round((s.plantados / s.meta) * 100) : 0;
  const isPend = s.estado === 'PENDIENTE' || s.estado === 'EN_CONFIGURACION';
  const isConfigurada = s.estado === 'CONFIGURADA';

  // Calcular faltantes si quiere pasar a ACTIVA — solo informativo.
  const guard = isConfigurada ? puedeTransitionar(s, 'ACTIVA') : null;

  return (
    <button onClick={() => onTap && onTap(s)} className="block w-full text-left rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-black/5 hover:ring-brand-300 active:scale-[0.995] transition">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <TipoSubBadge tipo={s.tipo} />
            <SubcampanaBadge estado={s.estado} />
          </div>
          <p className="mt-1 text-[14px] font-extrabold leading-tight text-brand-800 truncate">{s.nombre}</p>
          {s.municipio && (
            <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-slate-500 truncate">
              <Icon name="pin" className="h-3 w-3 text-slate-400" />
              {s.municipio}
            </p>
          )}
        </div>
        <Icon name="chevron-right" className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
      </div>

      {/* PENDIENTE / EN_CONFIG: mostrar faltantes en lugar de stats */}
      {isPend ? (
        <div className="mt-2.5 rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-100">
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wide text-amber-800">
            <Icon name="info" className="h-3.5 w-3.5" />
            Falta para configurar
          </p>
          <p className="mt-0.5 text-[11.5px] font-bold text-amber-900 leading-snug">
            {!s.coordinadorId && 'coordinador · '}
            {(!s.fechaInicioISO || !s.fechaFinISO) && 'fechas · '}
            {!s.cobertura && 'zona · '}
            {(!s.mixPlanificado || s.mixPlanificado.length === 0) && 'mix · '}
            {(!s.equipoIds || s.equipoIds.length === 0) && 'equipo · '}
            {(!s.lotesIds || s.lotesIds.length === 0) && 'lotes'}
          </p>
        </div>
      ) : (
        <>
          {/* Coordinador + fechas + área */}
          <div className="mt-2.5 flex items-center gap-2">
            {s.coordinadorIniciales && (
              <>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[10px] font-extrabold text-brand-700">
                  {s.coordinadorIniciales}
                </span>
                <p className="text-[11px] font-semibold text-slate-600 truncate flex-1">{s.coordinador}</p>
              </>
            )}
            <p className="text-[10.5px] font-bold text-slate-400 whitespace-nowrap">
              {s.hectareas} ha
            </p>
          </div>

          {/* Avance */}
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Avance</p>
              <p className="text-[11px] font-extrabold tabular-nums text-brand-800">
                {s.plantados.toLocaleString('es-BO')}<span className="text-slate-400"> / {s.meta.toLocaleString('es-BO')}</span>
                <span className="ml-1.5 text-brand-500">{pct}%</span>
              </p>
            </div>
            <div className="mt-1"><Progress pct={pct} tone={s.estado === 'PAUSADA' ? 'amber' : 'brand'} height={6} /></div>
          </div>

          <div className="mt-2 text-[10.5px] font-bold text-slate-500">
            {s.equipoIds?.length || 0} pers. · {s.lotesIds?.length || 0} lotes · {s.eventosCount || 0} eventos
          </div>

          {guard && !guard.ok && (
            <p className="mt-1.5 text-[10.5px] font-bold text-amber-800">
              Para activar falta: {guard.faltantes.join(', ')}
            </p>
          )}
        </>
      )}
    </button>
  );
}

// ── Tab: Resumen (default) ──────────────────────────────────────────────

function DCResumen({ campana, onTabMapa, onAbrirSub, onNuevaSub }) {
  const [filtro, setFiltro] = React.useState('TODAS');
  const subs = filtro === 'TODAS'
    ? campana.subcampanas
    : campana.subcampanas.filter(s => s.estado === filtro);

  // Orden: bloqueadas primero, luego activas, luego completadas
  const orden = { PENDIENTE: 0, EN_CONFIGURACION: 1, CONFIGURADA: 2, ACTIVA: 3, PAUSADA: 4, COMPLETADA: 5, CANCELADA: 6 };
  const subsOrdenadas = [...subs].sort((a, b) => (orden[a.estado] || 99) - (orden[b.estado] || 99));

  return (
    <div className="space-y-3">
      {/* KPIs agregados (2 cols) */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Supervivencia pond.</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">
            {campana.supervivencia != null ? `${campana.supervivencia}%` : '—'}
          </p>
          {campana.supervivencia != null && <div className="mt-1.5"><Progress pct={campana.supervivencia} tone="emerald" height={6} /></div>}
        </div>
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">CO₂ proyectado</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{campana.co2Proyectado} <span className="text-sm font-extrabold text-slate-400">T</span></p>
          <p className="mt-1 text-[10px] font-bold text-slate-500">Agregado de sub-campañas</p>
        </div>
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Hectáreas</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{campana.hectareas} <span className="text-sm font-extrabold text-slate-400">ha</span></p>
          <p className="mt-1 text-[10px] font-bold text-slate-500">{campana.comunidadesCubiertas} comunidad{campana.comunidadesCubiertas !== 1 ? 'es' : ''}</p>
        </div>
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Eventos</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{campana.eventosCount}</p>
          <p className="mt-1 text-[10px] font-bold text-slate-500 truncate">{campana.ultimoEvento || 'sin actividad'}</p>
        </div>
      </div>

      {/* Alerta de coordinadores pendientes */}
      {campana.coordinadoresPendientes > 0 && (
        <div className="flex items-start gap-2 rounded-2xl bg-amber-50 px-3 py-2.5 ring-1 ring-amber-100">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-700">
            <Icon name="info" className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-extrabold text-amber-900">
              {campana.coordinadoresPendientes} sub-campaña{campana.coordinadoresPendientes > 1 ? 's' : ''} sin coordinador
            </p>
            <p className="text-[10.5px] font-bold text-amber-800">No pueden activarse hasta asignar uno.</p>
          </div>
        </div>
      )}

      {/* Cobertura mini (tap → tab mapa) */}
      <button onClick={onTabMapa} className="block w-full text-left">
        <ParaguasMiniMap campana={campana} />
      </button>

      {/* Sub-campañas — sección principal */}
      <section className="pt-1">
        <div className="flex items-baseline justify-between">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Sub-campañas</p>
          <p className="text-[10.5px] font-bold text-slate-400">{subsOrdenadas.length} de {campana.subcampanasCount}</p>
        </div>

        {/* Filtros chip */}
        <div className="mt-2 -mx-5 px-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-1.5 pb-1.5 pr-2">
            {['TODAS', 'PENDIENTE', 'EN_CONFIGURACION', 'CONFIGURADA', 'ACTIVA', 'PAUSADA', 'COMPLETADA'].map(k => {
              const isOn = k === filtro;
              const count = k === 'TODAS' ? campana.subcampanasCount : (campana.distribucionEstados?.[k] || 0);
              if (k !== 'TODAS' && count === 0) return null;
              return (
                <button key={k} onClick={() => setFiltro(k)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-wide ring-1 transition ${isOn ? 'bg-brand-600 text-white ring-brand-700' : 'bg-white text-brand-700 ring-brand-100 hover:ring-brand-300'}`}>
                  {k.replace('_', ' ')}
                  <span className={`tabular-nums ${isOn ? 'text-white/85' : 'text-slate-400'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-1 space-y-2">
          {subsOrdenadas.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 text-center shadow-soft ring-1 ring-black/5">
              <p className="text-sm font-extrabold text-brand-800">Sin sub-campañas en este estado</p>
              <p className="text-[11px] font-semibold text-slate-500">Cambia el filtro o crea una nueva.</p>
            </div>
          ) : subsOrdenadas.map(s => <SubcampanaRow key={s.id} s={s} onTap={onAbrirSub} />)}
        </div>

        {/* CTA secundaria: nueva sub-campaña */}
        <button onClick={onNuevaSub} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-soft ring-1 ring-dashed ring-brand-300 hover:bg-brand-50">
          <Icon name="plus" className="h-4 w-4" />
          Agregar sub-campaña
        </button>
      </section>

      {/* Actividad reciente filtrada por esta campaña */}
      <ActividadDeCampana campanaId={campana.id} />
    </div>
  );
}

// ── Mini-mapa: polígonos por sub-campaña, coloreados por estado ─────────

function ParaguasMiniMap({ campana }) {
  // Coordenadas mock por hija — distribución sintética para mostrar la idea.
  const layoutByCount = (n) => {
    const presets = {
      1: [[160, 75]],
      2: [[100, 70], [220, 80]],
      3: [[80, 70], [170, 60], [240, 90]],
      4: [[70, 60], [150, 50], [230, 75], [120, 110]],
      5: [[60, 55], [140, 45], [225, 70], [100, 100], [200, 115]],
    };
    return presets[Math.min(n, 5)] || presets[5];
  };
  const positions = layoutByCount(campana.subcampanas.length);
  const colorByEstado = {
    ACTIVA:           '#10b981',
    PAUSADA:          '#f59e0b',
    COMPLETADA:       '#94a3b8',
    CONFIGURADA:      '#1f613b',
    EN_CONFIGURACION: '#3b82f6',
    PENDIENTE:        '#cbd5e1',
    CANCELADA:        '#ef4444',
  };
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 shadow-soft">
      <div className="relative w-full" style={{ height: 160 }}>
        <svg viewBox="0 0 320 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <defs>
            <pattern id="pmap-topo" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="0" cy="0" r="20" fill="none" stroke="#cbd5c5" strokeWidth="0.55" opacity="0.5" />
            </pattern>
            <pattern id="pmap-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20h40M20 0v40" stroke="#cbd5c5" strokeWidth="0.4" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="320" height="160" fill="#eef2ed" />
          <rect width="320" height="160" fill="url(#pmap-topo)" />
          <rect width="320" height="160" fill="url(#pmap-grid)" />
          <path d="M0 110 Q 80 90 160 120 T 320 90" fill="none" stroke="#bcd0c6" strokeWidth="2" opacity="0.6" />
          {campana.subcampanas.map((s, i) => {
            const [cx, cy] = positions[i] || [160, 80];
            const fill = colorByEstado[s.estado] || '#94a3b8';
            const r = Math.max(8, Math.min(22, Math.sqrt(s.hectareas || 1) * 8));
            return (
              <g key={s.id}>
                <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity="0.18" stroke={fill} strokeWidth="1.5" strokeDasharray={s.estado === 'PENDIENTE' ? '4 3' : '0'} />
                <circle cx={cx} cy={cy} r="3" fill={fill} />
              </g>
            );
          })}
        </svg>
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-brand-700 shadow-soft ring-1 ring-black/5">
          <Icon name="pin" className="h-3 w-3" />
          Cobertura agregada · {campana.hectareas} ha
        </div>
        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-700 shadow-soft ring-1 ring-black/5">
          Tap para ver detalle <Icon name="chevron-right" className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}

// ── Actividad de esta campaña ───────────────────────────────────────────

function ActividadDeCampana({ campanaId }) {
  const items = ACTIVIDAD_RECIENTE.filter(a => a.campanaId === campanaId);
  if (items.length === 0) return null;
  return (
    <section className="rounded-3xl bg-white shadow-soft ring-1 ring-black/5">
      <header className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Actividad reciente</p>
      </header>
      <ul className="divide-y divide-slate-100 pb-1.5">
        {items.map(a => {
          const sub = SUBCAMPANAS_ADMIN.find(s => s.id === a.subcampanaId);
          const kindMeta = {
            PLANTACION: { icon: 'planting',    tone: 'bg-emerald-50 text-emerald-700' },
            CAMPANA:    { icon: 'plus-circle', tone: 'bg-brand-50 text-brand-700' },
            EQUIPO:     { icon: 'users',       tone: 'bg-blue-50 text-blue-700' },
            PAUSA:      { icon: 'pause',       tone: 'bg-amber-50 text-amber-800' },
          }[a.kind] || { icon: 'dot', tone: 'bg-slate-50 text-slate-700' };
          return (
            <li key={a.id} className="flex items-start gap-3 px-3 py-2.5">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl ${kindMeta.tone}`}>
                <Icon name={kindMeta.icon} className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-extrabold leading-tight text-brand-800">{a.label}</p>
                {sub && (
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-brand-700 truncate">
                    <Icon name="chevron-right" className="h-3 w-3 text-slate-400" />
                    {sub.nombre}
                  </p>
                )}
              </div>
              <p className="text-[10.5px] font-bold text-slate-400 whitespace-nowrap pt-0.5">{a.tiempo}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ── Tab: Recursos (Equipo agregado) ─────────────────────────────────────

function DCEquipo({ campana }) {
  // Agrupar miembros por sub-campaña y total.
  const todos = campana.equipoTotal.map(personaById).filter(Boolean);
  const coordinadores = todos.filter(p => p.rol.startsWith('Coord'));
  const operarios = todos.filter(p => !p.rol.startsWith('Coord'));

  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-4 text-white shadow-soft">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Equipo agregado</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <div>
            <p className="text-[36px] font-extrabold leading-none tracking-tight tabular-nums">{todos.length}</p>
            <p className="mt-1 text-[11px] font-bold text-white/80">personas en {campana.subcampanasCount} sub-campañas</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-white/70">Coordinadores</p>
            <p className="text-lg font-extrabold tabular-nums">{coordinadores.length}</p>
          </div>
        </div>
        <p className="mt-3 text-[10.5px] font-bold text-white/70 leading-snug">
          La asignación se hace a nivel de sub-campaña. Para mover o agregar personas, abre la sub-campaña.
        </p>
      </div>

      {/* Coordinadores por sub-campaña */}
      <section>
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-2">Coordinadores por sub-campaña</p>
        <ul className="space-y-2">
          {campana.subcampanas.map(s => {
            const coord = s.coordinadorId ? personaById(s.coordinadorId) : null;
            return (
              <li key={s.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <SubcampanaBadge estado={s.estado} />
                  </div>
                  <p className="mt-1 text-sm font-extrabold text-brand-800 leading-tight truncate">{s.nombre}</p>
                </div>
                {coord ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-extrabold text-brand-700">{coord.iniciales}</span>
                    <div className="text-right">
                      <p className="text-[12px] font-extrabold text-brand-800 leading-tight">{coord.nombre}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{coord.rol}</p>
                    </div>
                  </div>
                ) : (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-[10.5px] font-extrabold text-amber-800 ring-1 ring-amber-100">
                    Sin asignar
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Operarios involucrados */}
      <section>
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-2">Operarios involucrados ({operarios.length})</p>
        <ul className="grid grid-cols-2 gap-2">
          {operarios.map(p => (
            <li key={p.id} className="flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-soft ring-1 ring-black/5">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-extrabold text-brand-700">{p.iniciales}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-extrabold text-brand-800 leading-tight truncate">{p.nombre}</p>
                <p className="text-[10px] font-bold text-slate-500">{p.plantadosTotal?.toLocaleString('es-BO') || '—'} plantados</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-[11px] font-semibold text-slate-500 pt-2">
        Los aportes individuales viven en la sub-campaña · append-only
      </p>
    </div>
  );
}

// ── Tab: Lotes (Recursos · lotes + mix) ─────────────────────────────────

function DCLotes({ campana }) {
  const lotes = campana.lotesComprometidos.map(id => LOTES_VIVERO.find(l => l.id === id)).filter(Boolean);
  const totalSaldo = lotes.reduce((a, l) => a + l.saldo, 0);

  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-4 text-white shadow-soft">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Saldo agregado</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <div>
            <p className="text-[36px] font-extrabold leading-none tracking-tight tabular-nums">{totalSaldo.toLocaleString('es-BO')}</p>
            <p className="mt-1 text-[11px] font-bold text-white/80">en {lotes.length} lotes comprometidos</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-white/70">Ya plantado</p>
            <p className="text-lg font-extrabold tabular-nums">{campana.plantados.toLocaleString('es-BO')}</p>
          </div>
        </div>
        <p className="mt-3 text-[10.5px] font-bold text-white/70 leading-snug">
          Los lotes se asignan a sub-campañas individuales. Aquí solo se ven los comprometidos en total.
        </p>
      </div>

      <ul className="space-y-2">
        {lotes.map(l => {
          // Sub-campañas que tienen este lote.
          const usadoPor = campana.subcampanas.filter(s => s.lotesIds?.includes(l.id));
          return (
            <li key={l.id} className="rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Icon name="package" className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-brand-800 leading-tight">{l.especie}</p>
                  <p className="text-[10.5px] italic text-slate-500">{l.cientifico}</p>
                  <p className="mt-1 text-[10.5px] font-bold text-slate-400">
                    <span className="text-brand-700">{l.id.split('-').slice(0,2).join('-')}</span> · {l.vivero}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-extrabold text-brand-800 tabular-nums">{l.saldo}</p>
                  <p className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">saldo</p>
                </div>
              </div>
              {usadoPor.length > 0 && (
                <p className="mt-2 text-[10px] font-bold text-slate-500">
                  Usado por: <span className="text-brand-700">{usadoPor.map(s => s.nombre).join(' · ')}</span>
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {/* Mix agregado */}
      <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Mix agregado vs objetivo</p>
        <div className="mt-2 space-y-2.5">
          {campana.mixAgregado.map(m => (
            <div key={m.especie}>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-extrabold text-brand-800">{m.especie}</p>
                <p className="text-[11px] font-extrabold tabular-nums text-slate-500">
                  <span className="text-brand-800">{m.plantados.toLocaleString('es-BO')}</span> · {m.pctReal}% <span className="text-slate-400">/ {m.pctObjetivo}% obj.</span>
                </p>
              </div>
              <p className="text-[10.5px] italic text-slate-500 mb-1">{m.cientifico}</p>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="absolute inset-y-0 left-0 rounded-full bg-brand-200" style={{ width: `${m.pctObjetivo}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-brand-600" style={{ width: `${Math.min(100, m.pctReal)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Tab: Mapa (cobertura agregada) ──────────────────────────────────────

function DCMapa({ campana }) {
  const colorByEstado = {
    ACTIVA:           '#10b981',
    PAUSADA:          '#f59e0b',
    COMPLETADA:       '#94a3b8',
    CONFIGURADA:      '#1f613b',
    EN_CONFIGURACION: '#3b82f6',
    PENDIENTE:        '#cbd5e1',
    CANCELADA:        '#ef4444',
  };
  // Layout sintético de polígonos.
  const polys = campana.subcampanas.map((s, i) => {
    const baseX = 50 + (i % 3) * 90;
    const baseY = 50 + Math.floor(i / 3) * 80;
    const w = Math.max(40, Math.min(70, (s.hectareas || 1) * 14));
    const h = Math.max(30, Math.min(50, (s.hectareas || 1) * 10));
    return {
      sub: s,
      d: `M${baseX} ${baseY} L${baseX + w} ${baseY - 5} L${baseX + w + 5} ${baseY + h - 5} L${baseX + w - 10} ${baseY + h + 5} L${baseX - 5} ${baseY + h - 10} Z`,
      cx: baseX + w / 2,
      cy: baseY + h / 2,
    };
  });
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-black/5">
        <div className="relative aspect-[4/3] w-full">
          <svg viewBox="0 0 320 240" className="absolute inset-0 h-full w-full">
            <defs>
              <pattern id="dcp-topo" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="0" cy="0" r="20" fill="none" stroke="#cbd5c5" strokeWidth="0.55" opacity="0.5" />
              </pattern>
              <pattern id="dcp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20h40M20 0v40" stroke="#cbd5c5" strokeWidth="0.4" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="320" height="240" fill="#eef2ed" />
            <rect width="320" height="240" fill="url(#dcp-topo)" />
            <rect width="320" height="240" fill="url(#dcp-grid)" />
            <path d="M0 200 Q 80 170 160 210 T 320 170" fill="none" stroke="#bcd0c6" strokeWidth="2" opacity="0.6" />

            {polys.map(p => {
              const fill = colorByEstado[p.sub.estado] || '#94a3b8';
              return (
                <g key={p.sub.id}>
                  <path d={p.d} fill={fill} fillOpacity="0.2" stroke={fill} strokeWidth="2" strokeDasharray={p.sub.estado === 'PENDIENTE' ? '5 3' : '0'} />
                  <circle cx={p.cx} cy={p.cy} r="3" fill={fill} />
                </g>
              );
            })}
          </svg>

          {/* Leyenda */}
          <div className="absolute left-2.5 top-2.5 rounded-2xl bg-white/95 px-2.5 py-2 shadow-soft ring-1 ring-black/5">
            <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500 mb-1">Leyenda</p>
            <div className="space-y-0.5">
              <p className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-brand-800"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Activa</p>
              <p className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-brand-800"><span className="h-2 w-2 rounded-full bg-brand-600" /> Configurada</p>
              <p className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-brand-800"><span className="h-2 w-2 rounded-full bg-amber-500" /> Pausada</p>
              <p className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-brand-800"><span className="h-2 w-2 rounded-full bg-slate-300" /> Pendiente</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 text-center">
          <div className="py-2.5">
            <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Polígonos</p>
            <p className="text-sm font-extrabold text-brand-800 tabular-nums">{polys.length}</p>
          </div>
          <div className="py-2.5">
            <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Cobertura</p>
            <p className="text-sm font-extrabold text-brand-800 tabular-nums">{campana.hectareas} ha</p>
          </div>
          <div className="py-2.5">
            <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Densidad</p>
            <p className="text-sm font-extrabold text-brand-800 tabular-nums">
              {campana.hectareas ? Math.round(campana.plantados / campana.hectareas) : 0} /ha
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-[11.5px] font-semibold text-slate-500">
        Para editar la zona de una sub-campaña, ábrela individualmente.
      </p>
    </div>
  );
}

// ── More sheet (acciones a nivel paraguas) ──────────────────────────────

function DCMoreSheet({ open, estado, onClose, onAccion }) {
  if (!open) return null;
  const puedeCompletar = estado === 'ACTIVA' || estado === 'PAUSADA';
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-black/50 backdrop-blur-sm">
      <button className="flex-1" onClick={onClose} aria-label="Cerrar" />
      <div className="rounded-t-3xl bg-white px-5 pt-4 pb-7 shadow-2xl">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
        <h3 className="text-lg font-extrabold text-brand-800">Acciones de coordinación</h3>
        <p className="text-xs font-medium text-slate-500">El pause/reanudar y la asignación de equipo/lotes viven en la sub-campaña.</p>

        <ul className="mt-3 divide-y divide-slate-100">
          <li>
            <button onClick={() => onAccion('nueva-sub')} className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-slate-50 rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon name="plus" className="h-4 w-4" /></div>
              <div className="flex-1"><p className="text-sm font-extrabold text-brand-800">Agregar sub-campaña</p><p className="text-[11px] font-medium text-slate-500">Nueva comunidad, etapa o tramo urbano</p></div>
              <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
            </button>
          </li>
          <li>
            <button onClick={() => onAccion('editar')} className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-slate-50 rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon name="pencil" className="h-4 w-4" /></div>
              <div className="flex-1"><p className="text-sm font-extrabold text-brand-800">Editar campaña paraguas</p><p className="text-[11px] font-medium text-slate-500">Nombre, organización, rango general</p></div>
              <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
            </button>
          </li>
          {puedeCompletar && (
            <li>
              <button onClick={() => onAccion('completar')} className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-slate-50 rounded-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"><Icon name="flag" className="h-4 w-4" /></div>
                <div className="flex-1"><p className="text-sm font-extrabold text-brand-800">Cerrar campaña</p><p className="text-[11px] font-medium text-slate-500">Requiere que todas las sub-campañas estén COMPLETADAS</p></div>
                <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
              </button>
            </li>
          )}
          <li>
            <button onClick={() => onAccion('export')} className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-slate-50 rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"><Icon name="download" className="h-4 w-4" /></div>
              <div className="flex-1"><p className="text-sm font-extrabold text-brand-800">Exportar reporte agregado</p><p className="text-[11px] font-medium text-slate-500">PDF · CSV · GeoJSON · suma de sub-campañas</p></div>
              <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
            </button>
          </li>
          <li>
            <button onClick={() => onAccion('cancelar')} className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-slate-50 rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-700"><Icon name="x-circle" className="h-4 w-4" /></div>
              <div className="flex-1"><p className="text-sm font-extrabold text-red-700">Cancelar campaña paraguas</p><p className="text-[11px] font-medium text-slate-500">Cancela también todas las sub-campañas · doble confirmación</p></div>
              <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ── Confirm modal (sin pausar/reanudar — esos viven en sub-campaña) ────

function DCConfirmModal({ accion, onClose, onConfirm }) {
  if (!accion) return null;
  const meta = {
    completar: { titulo: 'Cerrar campaña paraguas', cta: 'Sí, cerrar', tone: 'brand',
                 body: 'La campaña deja de recibir nuevas sub-campañas y queda consultable. Solo procede si todas las hijas están COMPLETADAS.',
                 motivoLabel: 'Nota de cierre', motivo: 'Programa anual cumplido' },
    cancelar:  { titulo: 'Cancelar campaña paraguas', cta: 'Sí, cancelar todo', tone: 'red',
                 body: 'Se cancelan la campaña Y todas sus sub-campañas. Esta acción no se revierte y queda registrada en la auditoría.',
                 motivoLabel: 'Motivo de cancelación', motivo: 'Reasignación de presupuesto' },
  }[accion];
  if (!meta) return null;
  const toneCta = {
    brand: 'bg-brand-600 hover:bg-brand-700',
    red:   'bg-red-600 hover:bg-red-700',
  }[meta.tone];
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-5">
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
        <h3 className="text-lg font-extrabold text-brand-800">{meta.titulo}</h3>
        <p className="mt-1 text-[13px] font-medium text-slate-600 leading-relaxed">{meta.body}</p>

        {meta.motivoLabel && (
          <div className="mt-3">
            <label className="block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-1">{meta.motivoLabel}</label>
            <input type="text" defaultValue={meta.motivo}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-extrabold text-brand-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          </div>
        )}

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-200">
            Cancelar
          </button>
          <button onClick={onConfirm} className={`flex-[1.5] rounded-2xl px-4 py-3 text-sm font-extrabold text-white shadow-soft ${toneCta}`}>
            {meta.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────

function DetalleCampanaScreen({ campanaId, estadoOverride, tab, onTab, moreOpen, onMoreOpen, accion, onAccion }) {
  // Agregamos en cada render para reflejar estadoOverride al vuelo.
  const baseAgg = selectCampanaAgregado(campanaId) || selectCampanaAgregado(CAMPANAS_ADMIN[0].id);
  const campana = { ...baseAgg, estado: estadoOverride || baseAgg.estado };

  // Override visual: si el host pide COMPLETADA, mostrar como cerrada.
  let displayed = campana;
  if (estadoOverride === 'COMPLETADA') {
    displayed = { ...campana, plantados: campana.meta, avancePct: 100, supervivencia: campana.supervivencia || 89 };
  }

  const onAbrirSub = (s) => {
    window.location.href = `Detalle sub-campaña.html?subcampanaId=${encodeURIComponent(s.id)}`;
  };
  const onNuevaSub = () => { window.location.href = 'Crear campaña.html'; };

  return (
    <div data-screen-label="Detalle de campaña paraguas" className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-28">
        <DCHeader
          campana={displayed}
          onBack={() => { window.location.href = 'Dashboard admin.html'; }}
          onMore={() => onMoreOpen(true)}
        />

        <div className="px-5 space-y-4 mt-2">
          <DCTabs active={tab} onChange={onTab} />

          {tab === 'resumen' && <DCResumen campana={displayed} onTabMapa={() => onTab('mapa')} onAbrirSub={onAbrirSub} onNuevaSub={onNuevaSub} />}
          {tab === 'equipo'  && <DCEquipo campana={displayed} />}
          {tab === 'lotes'   && <DCLotes campana={displayed} />}
          {tab === 'mapa'    && <DCMapa campana={displayed} />}
        </div>
      </div>

      {/* FAB — agregar sub-campaña (acción primaria del paraguas) */}
      <button
        onClick={onNuevaSub}
        className="absolute bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3.5 text-sm font-extrabold text-white shadow-soft ring-4 ring-white active:scale-[0.97] transition hover:bg-brand-700">
        <Icon name="plus" className="h-5 w-5" />
        Sub-campaña
      </button>

      <DCMoreSheet
        open={moreOpen}
        estado={displayed.estado}
        onClose={() => onMoreOpen(false)}
        onAccion={(a) => {
          onMoreOpen(false);
          if (a === 'nueva-sub') { onNuevaSub(); return; }
          if (a === 'editar' || a === 'export') return;
          onAccion(a);
        }}
      />
      <DCConfirmModal accion={accion} onClose={() => onAccion(null)} onConfirm={() => onAccion(null)} />
    </div>
  );
}

window.DetalleCampanaScreen = DetalleCampanaScreen;
