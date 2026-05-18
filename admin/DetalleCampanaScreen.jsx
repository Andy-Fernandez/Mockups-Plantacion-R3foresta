// Detalle de campaña — vista de gestión del coordinador.
// Header hero con estado · KPIs · mini-mapa · tabs (Resumen / Equipo / Lotes / Mapa)
// · acciones (pausar / reanudar / completar / cancelar / asignar)

function DCHeader({ campana, onBack, onMore }) {
  const isActiva = campana.estado === 'ACTIVA';
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
            <StateBadge estado={campana.estado} light />
            <button onClick={onMore} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition" aria-label="Más opciones">
              <Icon name="ellipsis" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mt-4 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/85">
          {campana.id}
        </p>
        <h1 className="mt-0.5 text-[26px] font-extrabold leading-[1.1] tracking-tight">{campana.nombre}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-white/85">
          <Icon name="pin" className="h-3.5 w-3.5" />
          {campana.zona}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Plantados / meta</p>
            <p className="mt-0.5 text-[40px] font-extrabold leading-none tracking-tight tabular-nums">
              {campana.plantados.toLocaleString('es-BO')}
              <span className="ml-1 text-base font-extrabold text-white/65">/ {campana.meta.toLocaleString('es-BO')}</span>
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] font-bold text-white/70">Avance</p>
            <p className="text-2xl font-extrabold tabular-nums">{Math.round(campana.plantados / campana.meta * 100)}%</p>
          </div>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-emerald-300" style={{ width: `${Math.round(campana.plantados / campana.meta * 100)}%` }} />
        </div>

        {isPausada && (
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-400/15 px-3 py-2.5 ring-1 ring-amber-300/40">
            <Icon name="pause" className="h-4 w-4 mt-0.5 text-amber-200 flex-shrink-0" />
            <p className="text-[11.5px] font-bold text-amber-100 leading-snug">
              <b className="text-white">Campaña pausada:</b> {campana.pausaMotivo || 'sin motivo registrado'}
            </p>
          </div>
        )}
      </div>
    </header>
  );
}

// Tabs
function DCTabs({ active, onChange }) {
  const tabs = [
    { k: 'resumen', label: 'Resumen' },
    { k: 'equipo',  label: 'Equipo' },
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

// ── Tab: Resumen ─────────────────────────────────────────────────────────

function DCResumen({ campana, onTabMapa, onTabEquipo, onTabLotes }) {
  const pct = Math.round(campana.plantados / campana.meta * 100);
  return (
    <div className="space-y-3">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Supervivencia</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{campana.supervivencia}%</p>
          <div className="mt-1.5"><Progress pct={campana.supervivencia} tone="emerald" height={6} /></div>
        </div>
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">CO₂ proyectado</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{campana.co2Proyectado} <span className="text-sm font-extrabold text-slate-400">T</span></p>
          <p className="mt-1 text-[10px] font-bold text-slate-500">Estimación con 10 años de crecimiento</p>
        </div>
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Área</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{campana.hectareas} <span className="text-sm font-extrabold text-slate-400">ha</span></p>
          <p className="mt-1 text-[10px] font-bold text-slate-500">{Math.round(campana.plantados / campana.hectareas)} árboles/ha actual</p>
        </div>
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Eventos</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{campana.eventosCount}</p>
          <p className="mt-1 text-[10px] font-bold text-slate-500">{campana.ultimoEvento}</p>
        </div>
      </div>

      {/* Calendario card */}
      <div className="flex items-center gap-3 rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Icon name="date" className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Calendario</p>
          <p className="text-sm font-extrabold text-brand-800">{campana.fechaInicio} → {campana.fechaFin}</p>
        </div>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-extrabold text-brand-700">{pct}%</span>
      </div>

      {/* Mini-mapa */}
      <button onClick={onTabMapa} className="block w-full text-left">
        <MiniMap
          polygon="M40 30 L260 20 L290 80 L240 140 L80 130 L30 90 Z"
          pins={[[80,55],[110,90],[150,45],[185,95],[220,60],[245,110],[100,115]]}
          highlight={[200, 80]}
          height={140}
          label={`${campana.hectareas} ha · ${campana.plantados} pines`}
        />
      </button>

      {/* Equipo + Lotes preview */}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={onTabEquipo} className="rounded-3xl bg-white p-3.5 text-left shadow-soft ring-1 ring-black/5 hover:ring-brand-300 transition">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Equipo</p>
            <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{campana.equipoCount}</p>
          <div className="mt-1.5"><AvatarPile items={PERSONAS.slice(0, campana.equipoCount)} max={5} size={6} /></div>
        </button>
        <button onClick={onTabLotes} className="rounded-3xl bg-white p-3.5 text-left shadow-soft ring-1 ring-black/5 hover:ring-brand-300 transition">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Lotes</p>
            <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{campana.lotesCount}</p>
          <p className="mt-1 text-[10.5px] font-bold text-slate-500">{LOTES_VIVERO.slice(0, campana.lotesCount).reduce((a, l) => a + l.saldo, 0)} plantas disponibles</p>
        </button>
      </div>

      {/* Coordinadora */}
      <div className="flex items-center gap-3 rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700">{campana.coordinadoraIniciales}</div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Coordinadora</p>
          <p className="text-sm font-extrabold text-brand-800">{campana.coordinadora}</p>
        </div>
        <button className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-extrabold text-brand-700 hover:bg-brand-100">Cambiar</button>
      </div>

      {/* Mix de especies */}
      <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Mix de especies</p>
        <div className="mt-2 space-y-2.5">
          {campana.mixPlanificado.map(e => {
            const pctReal = Math.round((e.plantados / campana.plantados) * 100) || 0;
            return (
              <div key={e.especie}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-extrabold text-brand-800">{e.especie}</p>
                  <p className="text-[11px] font-extrabold tabular-nums text-slate-500">
                    <span className="text-brand-800">{e.plantados.toLocaleString('es-BO')}</span> · {pctReal}% <span className="text-slate-400">/ {e.maxPct}% planif.</span>
                  </p>
                </div>
                <p className="text-[10.5px] italic text-slate-500 mb-1">{e.cientifico}</p>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-brand-200" style={{ width: `${e.maxPct}%` }} />
                  <div className="absolute inset-y-0 left-0 rounded-full bg-brand-600" style={{ width: `${Math.min(100, pctReal)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ── Tab: Equipo ──────────────────────────────────────────────────────────

function DCEquipo({ campana, onAsignar }) {
  // First N personas como miembros del equipo, plus la coordinadora primero.
  const miembros = [
    { ...PERSONAS.find(p => p.iniciales === campana.coordinadoraIniciales), aporte: null, esCoordinadora: true },
    ...PERSONAS.filter(p => p.rol === 'Operario').slice(0, campana.equipoCount - 1).map(p => ({ ...p, aporte: Math.round(p.plantadosTotal * 0.35) })),
  ].filter(Boolean);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">
          {miembros.length} personas asignadas
        </p>
        <button onClick={onAsignar} className="flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-[11px] font-extrabold text-white hover:bg-brand-700">
          <Icon name="plus" className="h-3.5 w-3.5" />
          Asignar
        </button>
      </div>

      <ul className="space-y-2">
        {miembros.map((m, i) => (
          <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-sm font-extrabold text-brand-700">{m.iniciales}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-extrabold text-brand-800 leading-tight truncate">{m.nombre}</p>
                {m.esCoordinadora && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-amber-700 ring-1 ring-amber-100">Coord.</span>}
              </div>
              <p className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">{m.rol}</p>
            </div>
            {m.aporte ? (
              <div className="text-right flex-shrink-0">
                <p className="text-base font-extrabold text-brand-800 tabular-nums">{m.aporte}</p>
                <p className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">en esta campaña</p>
              </div>
            ) : (
              <button className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><Icon name="ellipsis" className="h-4 w-4" /></button>
            )}
          </li>
        ))}
      </ul>

      <p className="text-center text-[11px] font-semibold text-slate-500 pt-2">
        Los aportes se calculan desde los eventos de plantación · append-only
      </p>
    </div>
  );
}

// ── Tab: Lotes ───────────────────────────────────────────────────────────

function DCLotes({ campana, onAsignar }) {
  const asignados = LOTES_VIVERO.slice(0, campana.lotesCount);
  const totalSaldo = asignados.reduce((a, l) => a + l.saldo, 0);
  const totalUsado = campana.plantados;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Lotes despachables</p>
          <p className="text-sm font-extrabold text-brand-800"><span className="tabular-nums">{totalSaldo}</span> plantas disponibles</p>
        </div>
        <button onClick={onAsignar} className="flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-[11px] font-extrabold text-white hover:bg-brand-700">
          <Icon name="plus" className="h-3.5 w-3.5" />
          Asignar
        </button>
      </div>

      {/* Saldo summary */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-4 text-white shadow-soft">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Saldo total de lotes</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <div>
            <p className="text-[36px] font-extrabold leading-none tracking-tight tabular-nums">{totalSaldo}</p>
            <p className="mt-1 text-[11px] font-bold text-white/80">disponibles para despachar</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-white/70">Ya despachadas</p>
            <p className="text-lg font-extrabold tabular-nums">{totalUsado.toLocaleString('es-BO')}</p>
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        {asignados.map(l => (
          <li key={l.id} className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Icon name="package" className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-brand-800 leading-tight">{l.especie}</p>
              <p className="text-[10.5px] italic text-slate-500">{l.cientifico}</p>
              <p className="mt-1 text-[10.5px] font-bold text-slate-400">
                <span className="text-brand-700">{l.id.split('-').slice(0,2).join('-')}</span> · {l.vivero} · {l.subetapa.replace('_', ' ')}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-extrabold text-brand-800 tabular-nums">{l.saldo}</p>
              <p className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">saldo</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Tab: Mapa ────────────────────────────────────────────────────────────

function DCMapa({ campana }) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-black/5">
        <div className="relative aspect-[4/3] w-full">
          <svg viewBox="0 0 320 240" className="absolute inset-0 h-full w-full">
            <defs>
              <pattern id="dc-topo" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="0" cy="0" r="20" fill="none" stroke="#cbd5c5" strokeWidth="0.55" opacity="0.5" />
              </pattern>
              <pattern id="dc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20h40M20 0v40" stroke="#cbd5c5" strokeWidth="0.4" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="320" height="240" fill="#eef2ed" />
            <rect width="320" height="240" fill="url(#dc-topo)" />
            <rect width="320" height="240" fill="url(#dc-grid)" />
            <path d="M0 160 Q 80 130 160 170 T 320 130" fill="none" stroke="#bcd0c6" strokeWidth="2" opacity="0.6" />
            <path d="M55 60 L240 50 L275 130 L220 200 L80 195 L40 130 Z"
                  fill="rgba(31,97,59,0.15)" stroke="#1f613b" strokeWidth="2" strokeDasharray="5 3" />

            {/* Density of pins ~ plantados */}
            {[
              [80,90],[100,75],[120,95],[140,80],[160,100],[180,75],[200,90],[220,70],[240,100],
              [85,130],[105,145],[125,125],[145,140],[165,130],[185,150],[205,135],[225,150],
              [95,170],[115,180],[135,165],[155,175],[175,180],[195,170],[215,180],
              [70,110],[245,135],[260,110],[60,165],
            ].map(([x,y], i) => (
              <circle key={i} cx={x} cy={y} r="2.5" fill="#1f613b" opacity="0.8" />
            ))}

            {/* Heat clusters */}
            <circle cx="150" cy="120" r="38" fill="#1f613b" opacity="0.06" />
            <circle cx="200" cy="80" r="28" fill="#1f613b" opacity="0.06" />

            {/* New today */}
            <g transform="translate(170, 130)">
              <circle r="14" fill="#f59e0b" opacity="0.2" />
              <circle r="9" fill="#f59e0b" opacity="0.35" />
              <circle r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
            </g>
          </svg>

          {/* Toolbar */}
          <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5">
            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-brand-700 shadow-soft ring-1 ring-black/5"><Icon name="plus" className="h-4 w-4" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-brand-700 shadow-soft ring-1 ring-black/5"><Icon name="minus" className="h-4 w-4" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-brand-700 shadow-soft ring-1 ring-black/5"><Icon name="layers" className="h-4 w-4" /></button>
          </div>

          {/* Legend */}
          <div className="absolute left-2.5 top-2.5 rounded-2xl bg-white/95 px-2.5 py-2 shadow-soft ring-1 ring-black/5">
            <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500 mb-1">Leyenda</p>
            <div className="space-y-0.5">
              <p className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-brand-800"><span className="h-2 w-2 rounded-full bg-brand-600" /> Plantación</p>
              <p className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-brand-800"><span className="h-2 w-2 rounded-full bg-amber-500" /> De hoy</p>
              <p className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-brand-800"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Polígono</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 text-center">
          <div className="py-2.5">
            <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Pines</p>
            <p className="text-sm font-extrabold text-brand-800 tabular-nums">{campana.plantados}</p>
          </div>
          <div className="py-2.5">
            <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Última act.</p>
            <p className="text-sm font-extrabold text-brand-800">{campana.ultimoEvento.split(' · ')[0]}</p>
          </div>
          <div className="py-2.5">
            <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Densidad</p>
            <p className="text-sm font-extrabold text-brand-800 tabular-nums">{Math.round(campana.plantados / campana.hectareas)} /ha</p>
          </div>
        </div>
      </div>

      <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-soft ring-1 ring-black/5 hover:ring-brand-300">
        <Icon name="download" className="h-4 w-4" />
        Exportar GeoJSON
      </button>
    </div>
  );
}

// ── More menu (bottom sheet) ─────────────────────────────────────────────

function DCMoreSheet({ open, estado, onClose, onAccion }) {
  if (!open) return null;
  const isActiva = estado === 'ACTIVA';
  const isPausada = estado === 'PAUSADA';
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-black/50 backdrop-blur-sm">
      <button className="flex-1" onClick={onClose} aria-label="Cerrar" />
      <div className="rounded-t-3xl bg-white px-5 pt-4 pb-7 shadow-2xl">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
        <h3 className="text-lg font-extrabold text-brand-800">Acciones de campaña</h3>
        <p className="text-xs font-medium text-slate-500">Estos cambios quedan en la auditoría · append-only.</p>

        <ul className="mt-3 divide-y divide-slate-100">
          <li>
            <button onClick={() => onAccion('editar')} className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-slate-50 rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon name="pencil" className="h-4 w-4" /></div>
              <div className="flex-1"><p className="text-sm font-extrabold text-brand-800">Editar campaña</p><p className="text-[11px] font-medium text-slate-500">Datos, zona, fechas, coordinadora</p></div>
              <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
            </button>
          </li>
          <li>
            <button onClick={() => onAccion('asignar')} className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-slate-50 rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Icon name="users" className="h-4 w-4" /></div>
              <div className="flex-1"><p className="text-sm font-extrabold text-brand-800">Asignar equipo y lotes</p><p className="text-[11px] font-medium text-slate-500">Agregar personas o lotes de vivero</p></div>
              <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
            </button>
          </li>
          {isActiva && (
            <li>
              <button onClick={() => onAccion('pausar')} className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-slate-50 rounded-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><Icon name="pause" className="h-4 w-4" /></div>
                <div className="flex-1"><p className="text-sm font-extrabold text-brand-800">Pausar campaña</p><p className="text-[11px] font-medium text-slate-500">El equipo no puede registrar mientras esté pausada</p></div>
                <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
              </button>
            </li>
          )}
          {isPausada && (
            <li>
              <button onClick={() => onAccion('reanudar')} className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-slate-50 rounded-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Icon name="play" className="h-4 w-4" /></div>
                <div className="flex-1"><p className="text-sm font-extrabold text-brand-800">Reanudar campaña</p><p className="text-[11px] font-medium text-slate-500">Vuelve a ACTIVA</p></div>
                <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
              </button>
            </li>
          )}
          {(isActiva || isPausada) && (
            <li>
              <button onClick={() => onAccion('completar')} className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-slate-50 rounded-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"><Icon name="flag" className="h-4 w-4" /></div>
                <div className="flex-1"><p className="text-sm font-extrabold text-brand-800">Marcar como completada</p><p className="text-[11px] font-medium text-slate-500">Cierra la campaña — sigue siendo consultable</p></div>
                <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
              </button>
            </li>
          )}
          <li>
            <button onClick={() => onAccion('export')} className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-slate-50 rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"><Icon name="download" className="h-4 w-4" /></div>
              <div className="flex-1"><p className="text-sm font-extrabold text-brand-800">Exportar reporte</p><p className="text-[11px] font-medium text-slate-500">PDF · CSV · GeoJSON</p></div>
              <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
            </button>
          </li>
          <li>
            <button onClick={() => onAccion('cancelar')} className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-slate-50 rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-700"><Icon name="x-circle" className="h-4 w-4" /></div>
              <div className="flex-1"><p className="text-sm font-extrabold text-red-700">Cancelar campaña</p><p className="text-[11px] font-medium text-slate-500">Requiere motivo · evento de auditoría</p></div>
              <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ── Confirm modal ────────────────────────────────────────────────────────

function DCConfirmModal({ accion, onClose, onConfirm }) {
  if (!accion) return null;
  const meta = {
    pausar:    { titulo: 'Pausar campaña', cta: 'Sí, pausar', tone: 'amber',
                 body: 'El equipo no podrá registrar plantaciones mientras esté pausada. Puedes reanudarla cuando quieras.',
                 motivoLabel: 'Motivo de pausa', motivo: 'Lluvias intensas' },
    reanudar:  { titulo: 'Reanudar campaña', cta: 'Sí, reanudar', tone: 'emerald',
                 body: 'La campaña volverá a ACTIVA y el equipo podrá registrar plantaciones de nuevo.', motivoLabel: null },
    completar: { titulo: 'Completar campaña', cta: 'Sí, completar', tone: 'brand',
                 body: 'La campaña se cierra y sigue siendo consultable. No se podrán registrar más plantaciones.',
                 motivoLabel: 'Nota de cierre', motivo: 'Meta de árboles plantados alcanzada' },
    cancelar:  { titulo: 'Cancelar campaña', cta: 'Sí, cancelar', tone: 'red',
                 body: 'La campaña pasa a estado CANCELADA. Esta acción queda registrada en la auditoría.',
                 motivoLabel: 'Motivo de cancelación', motivo: 'Reasignación de presupuesto' },
  }[accion];
  if (!meta) return null;
  const toneCta = {
    amber:   'bg-amber-500 hover:bg-amber-600',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    brand:   'bg-brand-600 hover:bg-brand-700',
    red:     'bg-red-600 hover:bg-red-700',
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
  const baseCampana = CAMPANAS_ADMIN.find(c => c.id === campanaId) || CAMPANAS_ADMIN[0];
  const campana = { ...baseCampana, estado: estadoOverride || baseCampana.estado };

  // Adjust plantados/avance by estado for visual realism.
  let displayed = campana;
  if (estadoOverride === 'COMPLETADA') {
    displayed = { ...campana, plantados: campana.meta, supervivencia: 89 };
  }

  return (
    <div data-screen-label="Detalle de campaña" className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-8">
        <DCHeader campana={displayed} onBack={() => { window.location.href = 'Dashboard admin.html'; }} onMore={() => onMoreOpen(true)} />

        <div className="px-5 space-y-4 mt-2">
          <DCTabs active={tab} onChange={onTab} />

          {tab === 'resumen' && <DCResumen campana={displayed} onTabMapa={() => onTab('mapa')} onTabEquipo={() => onTab('equipo')} onTabLotes={() => onTab('lotes')} />}
          {tab === 'equipo'  && <DCEquipo campana={displayed} onAsignar={() => { window.location.href = 'Asignar equipo y lotes.html'; }} />}
          {tab === 'lotes'   && <DCLotes campana={displayed} onAsignar={() => { window.location.href = 'Asignar equipo y lotes.html'; }} />}
          {tab === 'mapa'    && <DCMapa campana={displayed} />}
        </div>
      </div>

      <DCMoreSheet open={moreOpen} estado={displayed.estado} onClose={() => onMoreOpen(false)}
        onAccion={(a) => {
          onMoreOpen(false);
          if (a === 'asignar') { window.location.href = 'Asignar equipo y lotes.html'; return; }
          if (a === 'editar' || a === 'export') return;
          onAccion(a);
        }} />
      <DCConfirmModal accion={accion} onClose={() => onAccion(null)} onConfirm={() => onAccion(null)} />
    </div>
  );
}

window.DetalleCampanaScreen = DetalleCampanaScreen;
