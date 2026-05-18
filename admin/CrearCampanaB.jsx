// Crear campaña — pasos 4, 5 + overlay de éxito

// ── STEP 3 · Lotes ───────────────────────────────────────────────────────

function formatSubetapaLabel(subetapa) {
  return subetapa.replace('_', ' ');
}

function CCStepLotes({ lotesIds, onToggleLote }) {
  const lotesSel = LOTES_VIVERO.filter(l => lotesIds.includes(l.id));
  const lotesSaldoTotal = lotesSel.reduce((a, l) => a + l.saldo, 0);
  const viveros = Array.from(new Set(LOTES_VIVERO.map(l => l.vivero)));
  const resumenEspecies = lotesSel.reduce((acc, lote) => {
    const current = acc[lote.especie] || {
      especie: lote.especie,
      cientifico: lote.cientifico,
      plantas: 0,
      lotes: 0,
      viveros: new Set(),
    };
    current.plantas += lote.saldo;
    current.lotes += 1;
    current.viveros.add(lote.vivero);
    acc[lote.especie] = current;
    return acc;
  }, {});
  const especiesSeleccionadas = Object.values(resumenEspecies).sort((a, b) => b.plantas - a.plantas);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Lotes seleccionados</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <p className="text-xl font-extrabold text-brand-800 tabular-nums">{lotesSel.length}</p>
              <p className="text-[10.5px] font-bold text-slate-500">· {lotesSaldoTotal.toLocaleString('es-BO')} plantas</p>
            </div>
          </div>
          <div className="rounded-2xl bg-[#f8fbf7] px-3 py-2 text-right">
            <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Viveros</p>
            <p className="mt-1 text-lg font-extrabold text-brand-800 tabular-nums">{viveros.length}</p>
          </div>
        </div>

        {especiesSeleccionadas.length === 0 ? (
          <p className="mt-3 text-[11px] font-semibold text-slate-500">
            Selecciona lotes y aquí verás cuántas plantas ya tienes por especie.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-2">
            {especiesSeleccionadas.map((item) => (
              <div key={item.especie} className="rounded-2xl bg-[#f8fbf7] px-3 py-2.5 ring-1 ring-brand-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-brand-800 leading-tight">{item.especie}</p>
                    <p className="text-[10.5px] italic text-slate-500">{item.cientifico}</p>
                  </div>
                  <p className="text-lg font-extrabold text-brand-800 tabular-nums">{item.plantas.toLocaleString('es-BO')}</p>
                </div>
                <p className="mt-1 text-[10.5px] font-semibold text-slate-500">
                  {item.lotes} lote{item.lotes === 1 ? '' : 's'} · {Array.from(item.viveros).join(' · ')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {viveros.map((vivero) => {
          const lotesVivero = LOTES_VIVERO
            .filter((l) => l.vivero === vivero)
            .sort((a, b) => {
              const aOn = lotesIds.includes(a.id) ? 1 : 0;
              const bOn = lotesIds.includes(b.id) ? 1 : 0;
              if (aOn !== bOn) return bOn - aOn;
              return b.saldo - a.saldo;
            });
          const lotesSelVivero = lotesVivero.filter((l) => lotesIds.includes(l.id));
          const plantasSelVivero = lotesSelVivero.reduce((acc, l) => acc + l.saldo, 0);

          return (
            <section key={vivero} className="rounded-3xl bg-white p-3 shadow-soft ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-3 px-1 pb-2">
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Vivero</p>
                  <p className="mt-1 text-base font-extrabold text-brand-800">{vivero}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Cargado</p>
                  <p className="mt-1 text-sm font-extrabold text-brand-800 tabular-nums">
                    {plantasSelVivero.toLocaleString('es-BO')} <span className="text-[10px] font-bold text-slate-500">plantas</span>
                  </p>
                  <p className="text-[10px] font-semibold text-slate-500">
                    {lotesSelVivero.length}/{lotesVivero.length} lotes
                  </p>
                </div>
              </div>

              <ul className="space-y-2">
                {lotesVivero.map((l) => {
                  const isOn = lotesIds.includes(l.id);
                  return (
                    <li key={l.id}>
                      <button
                        onClick={() => onToggleLote(l.id)}
                        className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition shadow-soft ring-1 ${isOn ? 'bg-brand-600 text-white ring-brand-700' : 'bg-[#f8fbf7] text-brand-800 ring-brand-100 hover:ring-brand-300'}`}>
                        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${isOn ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                          <Icon name="package" className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-extrabold leading-tight">{l.especie}</p>
                            {isOn && (
                              <span className="rounded-full bg-white/15 px-1.5 py-0 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white ring-1 ring-white/20">
                                Seleccionado
                              </span>
                            )}
                          </div>
                          <p className={`text-[10.5px] italic ${isOn ? 'text-white/85' : 'text-slate-500'}`}>{l.cientifico}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10.5px] font-bold">
                            <span className={isOn ? 'text-white/85' : 'text-brand-700'}>
                              {l.id.split('-').slice(0, 2).join('-')}
                            </span>
                            <span className={isOn ? 'text-white/60' : 'text-slate-400'}>·</span>
                            <span className={isOn ? 'text-white/85' : 'text-slate-500'}>{formatSubetapaLabel(l.subetapa)}</span>
                            <span className={isOn ? 'text-white/60' : 'text-slate-400'}>·</span>
                            <span className={isOn ? 'text-white/85' : 'text-slate-500'}>{l.edadDias} días</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <p className={`text-lg font-extrabold leading-none tabular-nums ${isOn ? 'text-white' : 'text-brand-800'}`}>{l.saldo.toLocaleString('es-BO')}</p>
                          <p className={`text-[9px] font-extrabold uppercase tracking-wider ${isOn ? 'text-white/70' : 'text-slate-400'}`}>plantas</p>
                          <div className={`flex h-7 w-7 items-center justify-center rounded-full ${isOn ? 'bg-white text-brand-700' : 'bg-slate-100 text-slate-400'}`}>
                            {isOn ? <Icon name="check" className="h-4 w-4" /> : <Icon name="plus" className="h-4 w-4" />}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ── STEP 4 · Equipo ──────────────────────────────────────────────────────

function CCStepEquipo({ equipoIds, onTogglePersona }) {
  const equipoSel = PERSONAS.filter(p => equipoIds.includes(p.id));

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Equipo asignado</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-xl font-extrabold text-brand-800 tabular-nums">{equipoSel.length}</p>
          {equipoSel.length > 0 && <AvatarPile items={equipoSel} max={4} size={7} />}
        </div>
      </div>

      <ul className="space-y-2">
        {PERSONAS.map(p => {
          const isOn = equipoIds.includes(p.id);
          return (
            <li key={p.id}>
              <button onClick={() => onTogglePersona(p.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition shadow-soft ring-1 ${isOn ? 'bg-brand-600 text-white ring-brand-700' : 'bg-white text-brand-800 ring-black/5 hover:ring-brand-300'}`}>
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${isOn ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-700'}`}>{p.iniciales}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold leading-tight">{p.nombre}</p>
                  <p className={`text-[10.5px] font-bold uppercase tracking-wider ${isOn ? 'text-white/75' : 'text-brand-500'}`}>
                    {p.rol}{p.plantadosTotal ? ` · ${p.plantadosTotal.toLocaleString('es-BO')} plantados` : ''}
                  </p>
                </div>
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${isOn ? 'bg-white text-brand-700' : 'bg-slate-100 text-slate-400'}`}>
                  {isOn ? <Icon name="check" className="h-4 w-4" /> : <Icon name="plus" className="h-4 w-4" />}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── STEP 5 · Resumen ─────────────────────────────────────────────────────

function CCStepResumen({ tipo, nombre, organizacion, descripcion, fechaInicio, fechaFin, hectareas, meta, especies, equipoIds, lotesIds }) {
  const equipo = PERSONAS.filter(p => equipoIds.includes(p.id));
  const lotes = LOTES_VIVERO.filter(l => lotesIds.includes(l.id));
  const lotesSaldo = lotes.reduce((a, l) => a + l.saldo, 0);
  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-brand-800 p-4 text-white shadow-soft">
        <div className="flex items-center gap-2 flex-wrap">
          <TipoBadge tipo={tipo} />
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] ring-1 ring-white/30">
            <Icon name="pencil" className="h-3 w-3" />
            Borrador
          </span>
        </div>
        <h2 className="mt-2 text-[22px] font-extrabold leading-tight tracking-tight">{nombre}</h2>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-white/85">
          <Icon name="briefcase" className="h-3.5 w-3.5" />
          {organizacion}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/10 p-2.5 ring-1 ring-white/15">
            <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Meta</p>
            <p className="text-xl font-extrabold tabular-nums">{meta.toLocaleString('es-BO')}</p>
            <p className="text-[10px] font-bold text-white/70">árboles</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-2.5 ring-1 ring-white/15">
            <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Zona</p>
            <p className="text-xl font-extrabold tabular-nums">{hectareas} <span className="text-sm font-extrabold text-white/70">ha</span></p>
            <p className="text-[10px] font-bold text-white/70">6 vértices</p>
          </div>
        </div>
      </div>

      <MiniMap
        polygon="M40 30 L260 20 L290 80 L240 140 L80 130 L30 90 Z"
        pins={[[100,60],[140,85],[180,50],[200,110],[80,100]]}
        height={130}
        label={`${hectareas} ha`}
      />

      <div className="divide-y divide-slate-100 rounded-3xl bg-white shadow-soft ring-1 ring-black/5">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon name="date" className="h-4 w-4" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Calendario</p>
            <p className="text-sm font-extrabold text-brand-800">{fechaInicio} → {fechaFin}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon name="briefcase" className="h-4 w-4" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Organización asociada</p>
            <p className="text-sm font-extrabold text-brand-800 leading-tight">{organizacion}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon name="note" className="h-4 w-4" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Descripción</p>
            <p className="text-sm font-semibold text-brand-800 leading-relaxed">{descripcion || 'Sin descripción registrada.'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Icon name="leaf" className="h-4 w-4" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Especies ({especies.length})</p>
            <p className="text-sm font-extrabold text-brand-800 leading-tight">
              {especies.map(e => `${e.pct}% ${e.especie}`).join(' · ')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Icon name="users" className="h-4 w-4" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Equipo ({equipo.length})</p>
            {equipo.length === 0 ? (
              <p className="text-sm font-extrabold text-amber-700">Sin equipo asignado</p>
            ) : (
              <div className="flex items-center gap-2">
                <AvatarPile items={equipo} max={5} size={7} />
                <p className="text-[11px] font-semibold text-slate-500 truncate">{equipo.map(p => p.nombre.split(' ')[0]).join(', ')}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-start gap-3 px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><Icon name="package" className="h-4 w-4" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Lotes asignados ({lotes.length})</p>
            <p className="text-sm font-extrabold text-brand-800">{lotesSaldo.toLocaleString('es-BO')} plantas disponibles</p>
            <p className="text-[11px] font-semibold text-slate-500 truncate">{lotes.map(l => l.especie).join(' · ') || '—'}</p>
          </div>
        </div>
      </div>

      {meta > lotesSaldo && (
        <div className="flex items-start gap-3 rounded-2xl border-l-4 border-amber-500 bg-amber-50 px-3 py-3">
          <Icon name="alert" className="h-4 w-4 mt-0.5 text-amber-700 flex-shrink-0" />
          <div>
            <p className="text-[12px] font-extrabold text-amber-800">Saldo de lotes insuficiente</p>
            <p className="text-[11px] font-medium text-amber-700 leading-snug">
              Tu meta ({meta.toLocaleString('es-BO')}) supera lo disponible en lotes asignados ({lotesSaldo.toLocaleString('es-BO')}).
              Puedes publicar igual; asigna más lotes desde el detalle.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Overlay éxito ────────────────────────────────────────────────────────

function CCSuccessOverlay({ phase, nombre, onContinue, onVerDetalle }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-brand-700/95 backdrop-blur-sm px-6 text-center text-white">
      <img src="assets/hero-canopy.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="relative flex flex-col items-center">
        {phase === 'guardando' ? (
          <React.Fragment>
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-white/15" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-300 border-t-transparent animate-spin" />
              <Icon name="sparkle" className="h-10 w-10 text-emerald-200" />
            </div>
            <p className="mt-6 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/80">Publicando…</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">Creando tu campaña</p>
            <p className="mt-2 text-sm font-semibold text-white/80">Esto puede tardar unos segundos</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-400/20 ring-4 ring-emerald-300/40">
              <Icon name="check-circle" className="h-12 w-12 text-emerald-200" />
            </div>
            <p className="mt-6 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-emerald-200">Campaña publicada</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight max-w-[280px] leading-tight">{nombre}</p>
            <p className="mt-2 text-sm font-semibold text-white/85 max-w-[280px] leading-relaxed">
              Está <b>ACTIVA</b>. El equipo asignado verá la campaña en su app y podrá empezar a registrar plantaciones.
            </p>
            <button onClick={onVerDetalle} className="mt-6 flex w-full max-w-[280px] items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-soft active:scale-[0.99] hover:bg-brand-50">
              Ver detalle de la campaña
            </button>
            <button onClick={onContinue} className="mt-2 text-[12px] font-extrabold text-white/80 hover:text-white">
              Volver al dashboard
            </button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

window.CCStepEquipo = CCStepEquipo;
window.CCStepResumen = CCStepResumen;
window.CCSuccessOverlay = CCSuccessOverlay;
