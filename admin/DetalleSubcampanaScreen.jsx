// Detalle de sub-campaña — vista operativa.
//
// Esta pantalla es la unidad ejecutable real: aquí viven el estado,
// el equipo, los lotes, el mapa y el avance de plantación.

function DSCBadge({ estado }) {
  const m = ESTADO_SUBCAMPANA_META[estado];
  if (!m) return null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] ring-1 ${m.tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function DSCHeader({ sub, campana, onBack, onMore }) {
  const pct = sub.meta ? Math.round((sub.plantados / sub.meta) * 100) : 0;
  const isPausada = sub.estado === 'PAUSADA';
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
            <TipoBadge tipo={campana?.tipo} />
            <DSCBadge estado={sub.estado} />
            <button onClick={onMore} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition" aria-label="Más opciones">
              <Icon name="ellipsis" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="mt-4 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/85">
          {campana?.nombre || 'Campaña'} › {sub.id}
        </p>
        <h1 className="mt-0.5 text-[26px] font-extrabold leading-[1.1] tracking-tight">{sub.nombre}</h1>
        <p className="mt-1 text-[12.5px] font-medium text-white/85">
          {sub.comunidad || sub.municipio || (campana?.zona || '')}
        </p>

        <p className="mt-2 flex items-center gap-3 text-[11.5px] font-bold text-white/80 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="date" className="h-3.5 w-3.5" />
            {sub.fechaInicio || 'Pendiente'} → {sub.fechaFin || 'Pendiente'}
          </span>
          {sub.cobertura?.label && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="pin" className="h-3.5 w-3.5" />
              {sub.cobertura.label}
            </span>
          )}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Plantados / meta</p>
            <p className="mt-0.5 text-[40px] font-extrabold leading-none tracking-tight tabular-nums">
              {sub.plantados.toLocaleString('es-BO')}
              <span className="ml-1 text-base font-extrabold text-white/65">/ {sub.meta.toLocaleString('es-BO')}</span>
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] font-bold text-white/70">Avance</p>
            <p className="text-2xl font-extrabold tabular-nums">{pct}%</p>
          </div>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-emerald-300" style={{ width: `${pct}%` }} />
        </div>

        {isPausada && sub.motivoPausa && (
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-400/15 px-3 py-2.5 ring-1 ring-amber-300/40">
            <Icon name="pause" className="h-4 w-4 mt-0.5 text-amber-200 flex-shrink-0" />
            <p className="text-[11.5px] font-bold text-amber-100 leading-snug">
              <b className="text-white">Sub-campaña pausada:</b> {sub.motivoPausa}
            </p>
          </div>
        )}
      </div>
    </header>
  );
}

function DSCTabs({ active, onChange }) {
  const tabs = [
    { k: 'resumen', label: 'Resumen' },
    { k: 'equipo', label: 'Equipo' },
    { k: 'lotes', label: 'Lotes' },
    { k: 'mapa', label: 'Mapa' },
  ];
  return (
    <div className="sticky top-0 z-20 -mx-5 px-5 pt-3 pb-2 bg-[#eef2ed]/95 backdrop-blur-sm">
      <div className="flex rounded-full bg-white p-1 shadow-soft ring-1 ring-black/5">
        {tabs.map((t) => {
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

function DSCResumen({ sub, campana, onTabMapa }) {
  const equipo = (sub.equipoIds || []).map(personaById).filter(Boolean);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Supervivencia</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{sub.supervivencia != null ? `${sub.supervivencia}%` : '—'}</p>
          {sub.supervivencia != null && <div className="mt-1.5"><Progress pct={sub.supervivencia} tone="emerald" height={6} /></div>}
        </div>
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">CO₂ proyectado</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{sub.co2Proyectado} <span className="text-sm font-extrabold text-slate-400">T</span></p>
          <p className="mt-1 text-[10px] font-bold text-slate-500">Estimación de esta sub-campaña</p>
        </div>
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Área</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{sub.hectareas} <span className="text-sm font-extrabold text-slate-400">ha</span></p>
          <p className="mt-1 text-[10px] font-bold text-slate-500">{sub.cobertura?.tipo || 'Pendiente de definir'}</p>
        </div>
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Eventos</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{sub.eventosCount}</p>
          <p className="mt-1 text-[10px] font-bold text-slate-500 truncate">{sub.ultimoEvento || 'sin actividad'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-extrabold text-brand-700">
          {sub.coordinadorIniciales || '—'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Coordinador</p>
          <p className="text-sm font-extrabold text-brand-800">{sub.coordinador || 'Pendiente'}</p>
          <p className="mt-0.5 text-[10.5px] font-semibold text-slate-500 truncate">{campana?.nombre}</p>
        </div>
      </div>

      <button onClick={onTabMapa} className="block w-full text-left">
        <MiniMap
          polygon="M40 30 L260 20 L290 80 L240 140 L80 130 L30 90 Z"
          pins={sub.plantados > 0 ? [[90,65],[130,88],[185,74],[225,104]] : [[160,80]]}
          height={140}
          label={sub.cobertura?.label || `${sub.hectareas} ha`}
        />
      </button>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Equipo</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{equipo.length}</p>
          {equipo.length > 0 && <div className="mt-1.5"><AvatarPile items={equipo} max={5} size={6} /></div>}
        </div>
        <div className="rounded-3xl bg-white p-3.5 shadow-soft ring-1 ring-black/5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Lotes</p>
          <p className="mt-1 text-2xl font-extrabold text-brand-800 tabular-nums">{(sub.lotesIds || []).length}</p>
          <p className="mt-1 text-[10.5px] font-bold text-slate-500">
            {((sub.lotesIds || []).map(id => LOTES_VIVERO.find(l => l.id === id)).filter(Boolean).reduce((a, l) => a + l.saldo, 0)).toLocaleString('es-BO')} plantas
          </p>
        </div>
      </div>

      <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Mix de especies</p>
        <div className="mt-2 space-y-2.5">
          {(sub.mixPlanificado || []).length === 0 ? (
            <p className="text-[11px] font-semibold text-slate-500">Sin mix configurado.</p>
          ) : (
            sub.mixPlanificado.map((e) => {
              const pctReal = sub.plantados ? Math.round((e.plantados / sub.plantados) * 100) : 0;
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
            })
          )}
        </div>
      </section>
    </div>
  );
}

function DSCEquipo({ sub }) {
  const equipo = (sub.equipoIds || []).map(personaById).filter(Boolean);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">{equipo.length} personas asignadas</p>
        <button onClick={() => { window.location.href = 'Asignar equipo y lotes.html'; }} className="flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-[11px] font-extrabold text-white hover:bg-brand-700">
          <Icon name="plus" className="h-3.5 w-3.5" />
          Asignar
        </button>
      </div>
      <ul className="space-y-2">
        {equipo.map((m) => (
          <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-sm font-extrabold text-brand-700">{m.iniciales}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-extrabold text-brand-800 leading-tight truncate">{m.nombre}</p>
                {m.id === sub.coordinadorId && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-amber-700 ring-1 ring-amber-100">Coord.</span>}
              </div>
              <p className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">{m.rol}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-base font-extrabold text-brand-800 tabular-nums">{m.plantadosTotal?.toLocaleString('es-BO') || '—'}</p>
              <p className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">histórico</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DSCLotes({ sub }) {
  const lotes = (sub.lotesIds || []).map(id => LOTES_VIVERO.find(l => l.id === id)).filter(Boolean);
  const totalSaldo = lotes.reduce((a, l) => a + l.saldo, 0);
  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-4 text-white shadow-soft">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Saldo asignado</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <div>
            <p className="text-[36px] font-extrabold leading-none tracking-tight tabular-nums">{totalSaldo.toLocaleString('es-BO')}</p>
            <p className="mt-1 text-[11px] font-bold text-white/80">en {lotes.length} lotes</p>
          </div>
          <button onClick={() => { window.location.href = 'Asignar equipo y lotes.html'; }} className="rounded-2xl bg-white/15 px-3 py-2 text-[11px] font-extrabold text-white hover:bg-white/20">
            Ajustar
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {lotes.map((l) => (
          <li key={l.id} className="rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Icon name="package" className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-brand-800 leading-tight">{l.especie}</p>
                <p className="text-[10.5px] italic text-slate-500">{l.cientifico}</p>
                <p className="mt-1 text-[10.5px] font-bold text-slate-400">
                  <span className="text-brand-700">{l.id.split('-').slice(0, 2).join('-')}</span> · {l.vivero}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-extrabold text-brand-800 tabular-nums">{l.saldo.toLocaleString('es-BO')}</p>
                <p className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider">saldo</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DSCMapa({ sub }) {
  return (
    <div className="space-y-3">
      <MiniMap
        polygon="M40 30 L260 20 L290 80 L240 140 L80 130 L30 90 Z"
        pins={sub.plantados > 0 ? [[90,65],[130,88],[185,74],[225,104]] : [[160,80]]}
        height={220}
        label={sub.cobertura?.label || `${sub.hectareas} ha`}
      />
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-white p-3 text-center shadow-soft ring-1 ring-black/5">
          <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Cobertura</p>
          <p className="mt-1 text-sm font-extrabold text-brand-800">{sub.hectareas} ha</p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-soft ring-1 ring-black/5">
          <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Meta</p>
          <p className="mt-1 text-sm font-extrabold text-brand-800">{sub.meta}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-soft ring-1 ring-black/5">
          <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Densidad</p>
          <p className="mt-1 text-sm font-extrabold text-brand-800">{sub.hectareas ? Math.round(sub.plantados / Math.max(sub.hectareas, 1)) : 0}/ha</p>
        </div>
      </div>
    </div>
  );
}

function DSCMoreSheet({ open, sub, onClose, onEstado }) {
  if (!open) return null;
  const transiciones = TRANSICIONES_SUBCAMPANA[sub.estado] || [];
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-black/50 backdrop-blur-sm">
      <button className="flex-1" onClick={onClose} aria-label="Cerrar" />
      <div className="rounded-t-3xl bg-white px-5 pt-4 pb-7 shadow-2xl">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
        <h3 className="text-lg font-extrabold text-brand-800">Acciones de sub-campaña</h3>
        <p className="text-xs font-medium text-slate-500">Aquí sí vive el cambio de estado operativo.</p>

        <ul className="mt-3 divide-y divide-slate-100">
          <li>
            <button onClick={() => { window.location.href = 'Asignar equipo y lotes.html'; }} className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-slate-50 rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon name="users" className="h-4 w-4" /></div>
              <div className="flex-1"><p className="text-sm font-extrabold text-brand-800">Asignar equipo y lotes</p><p className="text-[11px] font-medium text-slate-500">Ajusta recursos de esta sub-campaña</p></div>
              <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
            </button>
          </li>
          {transiciones.map((destino) => {
            const guard = puedeTransitionar(sub, destino);
            return (
              <li key={destino}>
                <button
                  onClick={() => guard.ok && onEstado(destino)}
                  disabled={!guard.ok}
                  className={`flex w-full items-center gap-3 px-1 py-3 text-left rounded-xl ${guard.ok ? 'hover:bg-slate-50' : 'opacity-60 cursor-not-allowed'}`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"><Icon name="check-circle" className="h-4 w-4" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-extrabold text-brand-800">Cambiar a {destino.replace('_', ' ')}</p>
                    <p className="text-[11px] font-medium text-slate-500">
                      {guard.ok ? 'Transición permitida' : `Falta: ${guard.faltantes.join(', ')}`}
                    </p>
                  </div>
                  <Icon name="chevron-right" className="h-4 w-4 text-slate-400" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function DetalleSubcampanaScreen({ subcampanaId, tab, onTab, moreOpen, onMoreOpen, estadoOverride, onEstadoOverride }) {
  const base = SUBCAMPANAS_ADMIN.find((s) => s.id === subcampanaId) || SUBCAMPANAS_ADMIN[0];
  const campana = CAMPANAS_ADMIN.find((c) => c.id === base.campanaId) || CAMPANAS_ADMIN[0];
  const sub = { ...base, estado: estadoOverride || base.estado };

  return (
    <div data-screen-label="Detalle de sub-campaña" className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-28">
        <DSCHeader
          sub={sub}
          campana={campana}
          onBack={() => { window.location.href = 'Detalle de campaña.html'; }}
          onMore={() => onMoreOpen(true)}
        />

        <div className="px-5 space-y-4 mt-2">
          <DSCTabs active={tab} onChange={onTab} />
          {tab === 'resumen' && <DSCResumen sub={sub} campana={campana} onTabMapa={() => onTab('mapa')} />}
          {tab === 'equipo' && <DSCEquipo sub={sub} />}
          {tab === 'lotes' && <DSCLotes sub={sub} />}
          {tab === 'mapa' && <DSCMapa sub={sub} />}
        </div>
      </div>

      <DSCMoreSheet
        open={moreOpen}
        sub={sub}
        onClose={() => onMoreOpen(false)}
        onEstado={(destino) => {
          onEstadoOverride(destino);
          onMoreOpen(false);
        }}
      />
    </div>
  );
}

window.DetalleSubcampanaScreen = DetalleSubcampanaScreen;
