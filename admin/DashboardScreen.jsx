// Dashboard admin · R3foresta Plantación
// Mobile-first (max-w-md). Sections:
//   [Hero header] → [Periodo tabs] → [Hero metric árboles] → [Metrics grid]
//   → [Estado campañas (donut + list)] → [Campañas activas] → [Actividad reciente]

function DashboardHeader({ admin, hayAlertas, onAlertas }) {
  return (
    <header className="relative overflow-hidden rounded-b-3xl bg-brand-700 text-white shadow-soft">
      <img src="assets/hero-canopy.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-700/85 via-brand-700/85 to-brand-700" />
      <div className="relative px-5 pt-6 pb-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white text-xs font-extrabold tracking-wide ring-1 ring-white/25">
              {admin.iniciales}
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/75">Hola, {admin.nombre.split(' ')[0]}</p>
              <p className="text-sm font-extrabold leading-tight">{admin.rol}</p>
            </div>
          </div>
          <button onClick={onAlertas} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition" aria-label="Alertas">
            <Icon name="bell" className="h-5 w-5" />
            {hayAlertas && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-300 ring-2 ring-brand-700" />}
          </button>
        </div>

        <p className="mt-5 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/85">
          Programa de plantación · 2026
        </p>
        <h1 className="mt-1 text-[26px] font-extrabold leading-[1.1] tracking-tight">Resumen general</h1>
        <p className="mt-1 text-[13px] font-medium text-white/80 leading-snug">
          Métricas vivas del programa, campañas en curso y actividad reciente del equipo.
        </p>
      </div>
    </header>
  );
}

function PeriodoTabs({ value, onChange }) {
  const opts = [
    { key: 'mes',       label: 'Mes' },
    { key: 'trimestre', label: 'Trimestre' },
    { key: 'anio',      label: 'Año' },
    { key: 'historico', label: 'Histórico' },
  ];
  return (
    <div className="flex rounded-full bg-white p-1 shadow-soft ring-1 ring-black/5">
      {opts.map(o => {
        const isOn = o.key === value;
        return (
          <button key={o.key} onClick={() => onChange(o.key)}
            className={`flex-1 rounded-full px-2 py-2 text-[11.5px] font-extrabold tracking-wide transition ${isOn ? 'bg-brand-600 text-white shadow-soft' : 'text-brand-700 hover:bg-brand-50'}`}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function MetricCard({ label, value, unit, pct, target, tone = 'brand', icon, footer }) {
  const toneText = {
    brand:   'text-brand-700',
    emerald: 'text-emerald-700',
    amber:   'text-amber-700',
    blue:    'text-blue-700',
  }[tone];
  return (
    <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">{label}</p>
        {icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Icon name={icon} className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      <p className={`mt-1.5 text-[24px] font-extrabold leading-none tracking-tight tabular-nums ${toneText}`}>
        {value}<span className="text-sm font-extrabold text-slate-400 ml-1">{unit}</span>
      </p>
      {pct !== undefined && (
        <div className="mt-2">
          <Progress pct={pct} tone={tone} height={6} />
          <p className="mt-1 text-[10px] font-bold text-slate-400 tabular-nums">{pct}% de la meta {target ? `· ${target}` : ''}</p>
        </div>
      )}
      {footer && (
        <p className="mt-2 text-[11px] font-medium text-slate-500">{footer}</p>
      )}
    </div>
  );
}

function EstadosBreakdown({ data, total, onTap }) {
  const ordered = ['ACTIVA', 'PAUSADA', 'COMPLETADA', 'BORRADOR', 'CANCELADA'];
  const colorByKey = {
    ACTIVA:     '#10b981',
    PAUSADA:    '#f59e0b',
    COMPLETADA: '#94a3b8',
    BORRADOR:   '#8fb89e',
    CANCELADA:  '#ef4444',
  };
  const items = ordered.map(k => ({ key: k, value: data[k] || 0, color: colorByKey[k] })).filter(d => d.value > 0);
  return (
    <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
      <div className="flex items-baseline justify-between">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Estado de campañas</p>
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-slate-400">{total} total</p>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <StatesDonut data={items} size={92} stroke={14} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[20px] font-extrabold leading-none tabular-nums text-brand-800">{total}</p>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-brand-500">campañas</p>
          </div>
        </div>
        <ul className="flex-1 space-y-1.5 min-w-0">
          {items.map(it => (
            <li key={it.key} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: it.color }} />
              <span className="flex-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-700 truncate">{it.key}</span>
              <span className="text-sm font-extrabold tabular-nums text-brand-800">{it.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CampanaRow({ c, onTap }) {
  const pct = Math.round((c.plantados / c.meta) * 100);
  return (
    <button onClick={() => onTap && onTap(c)} className="block w-full text-left rounded-2xl bg-white p-3.5 shadow-soft ring-1 ring-black/5 hover:ring-brand-300 active:scale-[0.995] transition">
      <div className="flex items-start gap-2">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <Icon name={c.tipo === 'ARBORIZACION' ? 'building' : 'trees'} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <TipoBadge tipo={c.tipo} />
            <StateBadge estado={c.estado} />
          </div>
          <p className="mt-1 text-[14px] font-extrabold leading-tight text-brand-800 truncate">{c.nombre}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-slate-500 truncate">
            <Icon name="pin" className="h-3 w-3 text-slate-400" />
            {c.zona}
          </p>
        </div>
        <Icon name="chevron-right" className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
      </div>
      <div className="mt-3">
        <div className="flex items-baseline justify-between">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Avance</p>
          <p className="text-[11px] font-extrabold tabular-nums text-brand-800">
            {c.plantados.toLocaleString('es-BO')}<span className="text-slate-400"> / {c.meta.toLocaleString('es-BO')}</span>
            <span className="ml-1.5 text-brand-500">{pct}%</span>
          </p>
        </div>
        <div className="mt-1"><Progress pct={pct} tone={c.estado === 'PAUSADA' ? 'amber' : 'brand'} height={6} /></div>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[10px] font-extrabold text-brand-700">{c.coordinadoraIniciales}</span>
          <p className="text-[11px] font-semibold text-slate-500 truncate">{c.coordinadora}</p>
        </div>
        <p className="text-[10px] font-bold text-slate-400 flex-shrink-0">{c.equipoCount} pers. · {c.lotesCount} lotes</p>
      </div>
    </button>
  );
}

function ActividadRow({ a }) {
  const kindMeta = {
    PLANTACION: { icon: 'planting',     tone: 'bg-emerald-50 text-emerald-700' },
    CAMPANA:    { icon: 'plus-circle',  tone: 'bg-brand-50 text-brand-700' },
    EQUIPO:     { icon: 'users',        tone: 'bg-blue-50 text-blue-700' },
    PAUSA:      { icon: 'pause',        tone: 'bg-amber-50 text-amber-800' },
  }[a.kind] || { icon: 'dot', tone: 'bg-slate-50 text-slate-700' };
  return (
    <li className="flex items-start gap-3 px-3 py-2.5">
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl ${kindMeta.tone}`}>
        <Icon name={kindMeta.icon} className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-extrabold leading-tight text-brand-800">{a.label}</p>
        <p className="mt-0.5 text-[11px] font-semibold text-slate-500 truncate">{a.campana}</p>
      </div>
      <p className="text-[10.5px] font-bold text-slate-400 whitespace-nowrap pt-0.5">{a.tiempo}</p>
    </li>
  );
}

function DashboardScreen({ periodo, onPeriodo, filtroEstado, onFiltroEstado, hayAlertas, onNuevaCampana, onAbrirCampana }) {
  const campanas = filtroEstado === 'TODAS'
    ? CAMPANAS_ADMIN
    : CAMPANAS_ADMIN.filter(c => c.estado === filtroEstado);

  const totalCampanas = Object.values(CAMPANAS_ESTADOS).reduce((a, b) => a + b, 0);
  const m = METRICAS_GLOBALES;
  const pctArboles = Math.round((m.arbolesPlantados / m.arbolesMeta) * 100);
  const pctCO2 = Math.round((m.co2Toneladas / m.co2Meta) * 100);
  const pctHa  = Math.round((m.hectareas / m.hectareasMeta) * 100);

  return (
    <div data-screen-label="Dashboard admin" className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-28">
        <DashboardHeader admin={{ nombre: 'María López', rol: 'Coordinadora · Plantación', iniciales: 'ML' }} hayAlertas={hayAlertas} />

        <div className="px-5 pt-4 space-y-4">
          <PeriodoTabs value={periodo} onChange={onPeriodo} />

          {/* Hero metric — árboles plantados */}
          <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-4 text-white shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Árboles plantados</p>
                <p className="mt-1 text-[44px] font-extrabold leading-none tracking-tight tabular-nums">
                  {m.arbolesPlantados.toLocaleString('es-BO')}
                </p>
                <p className="mt-1 text-[11px] font-bold text-white/80">UNIDAD · acumulado del programa</p>
              </div>
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                <Icon name="trees" className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline justify-between text-[11px] font-extrabold">
                <span className="text-white/80">Meta {m.arbolesMeta.toLocaleString('es-BO')}</span>
                <span className="tabular-nums">{pctArboles}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-emerald-300" style={{ width: `${pctArboles}%` }} />
              </div>
              <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-200">
                <Icon name="trending" className="h-3.5 w-3.5" />
                +{(m.arbolesPlantados - m.arbolesAnioAnterior).toLocaleString('es-BO')} vs año anterior
              </p>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <MetricCard
              label="CO₂ proyectado" value={m.co2Toneladas} unit="T"
              pct={pctCO2} target={`${m.co2Meta} T`} icon="drop" tone="emerald" />
            <MetricCard
              label="Supervivencia" value={`${m.supervivenciaPct}`} unit="%"
              pct={m.supervivenciaPct} icon="shield" tone="brand"
              footer={`Meta ${m.supervivenciaMeta}% · +${m.supervivenciaPct - m.supervivenciaMeta} pts`} />
            <MetricCard
              label="Hectáreas" value={m.hectareas.toString().replace('.', ',')} unit="ha"
              pct={pctHa} target={`${m.hectareasMeta} ha`} icon="area" tone="amber" />
            <MetricCard
              label="Campañas activas" value={CAMPANAS_ESTADOS.ACTIVA} unit=""
              icon="planting" tone="brand"
              footer={`${CAMPANAS_ESTADOS.COMPLETADA} completadas · ${CAMPANAS_ESTADOS.PAUSADA} pausadas`} />
          </div>

          <EstadosBreakdown data={CAMPANAS_ESTADOS} total={totalCampanas} />

          {/* Campañas list */}
          <section>
            <div className="flex items-baseline justify-between">
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Campañas</p>
              <button className="text-[11px] font-extrabold text-brand-600 hover:text-brand-700">Ver todas</button>
            </div>
            <div className="mt-2 -mx-5 px-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              <div className="flex gap-1.5 pb-1.5 pr-2">
                {['TODAS', 'ACTIVA', 'PAUSADA', 'COMPLETADA', 'BORRADOR'].map(k => {
                  const isOn = k === filtroEstado;
                  return (
                    <button key={k} onClick={() => onFiltroEstado(k)}
                      className={`flex-shrink-0 rounded-full px-3 py-1.5 text-[11px] font-extrabold ring-1 transition ${isOn ? 'bg-brand-600 text-white ring-brand-700' : 'bg-white text-brand-700 ring-brand-100 hover:ring-brand-300'}`}>
                      {k}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-1 space-y-2">
              {campanas.length === 0 ? (
                <div className="rounded-3xl bg-white p-6 text-center shadow-soft ring-1 ring-black/5">
                  <Icon name="planting" className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-sm font-extrabold text-brand-800">Sin campañas en este estado</p>
                  <p className="text-[11px] font-semibold text-slate-500">Cambia el filtro o crea una nueva.</p>
                </div>
              ) : campanas.map(c => <CampanaRow key={c.id} c={c} onTap={onAbrirCampana} />)}
            </div>
          </section>

          {/* Actividad reciente */}
          <section className="rounded-3xl bg-white shadow-soft ring-1 ring-black/5">
            <header className="flex items-center justify-between px-4 pt-3.5 pb-2">
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Actividad reciente</p>
              <button className="text-[11px] font-extrabold text-brand-600 hover:text-brand-700">Todo</button>
            </header>
            <ul className="divide-y divide-slate-100 pb-1.5">
              {ACTIVIDAD_RECIENTE.map(a => <ActividadRow key={a.id} a={a} />)}
            </ul>
          </section>
        </div>
      </div>

      {/* FAB — crear campaña */}
      <button
        onClick={onNuevaCampana}
        className="absolute bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3.5 text-sm font-extrabold text-white shadow-soft ring-4 ring-white active:scale-[0.97] transition hover:bg-brand-700">
        <Icon name="plus" className="h-5 w-5" />
        Nueva campaña
      </button>
    </div>
  );
}

window.DashboardScreen = DashboardScreen;
