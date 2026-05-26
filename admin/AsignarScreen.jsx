// Asignar equipo y lotes — modal-style fullscreen screen.
// Header con sub-campaña destino · tabs Equipo / Lotes · listas seleccionables
// · footer pegajoso con seleccionados y CTA de confirmar.

function AsignarHeader({ sub, campana, onBack }) {
  return (
    <header className="bg-white shadow-soft">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition" aria-label="Cerrar">
            <Icon name="x" className="h-5 w-5 text-brand-700" />
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-700">
            <Icon name="users" className="h-3.5 w-3.5" />
            Asignación
          </span>
        </div>
        <p className="mt-3 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Asignar a</p>
        <h1 className="mt-0.5 text-[22px] font-extrabold leading-tight tracking-tight text-brand-800">{sub.nombre}</h1>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Icon name="pin" className="h-3 w-3 text-slate-400" />
          {sub.cobertura?.label || sub.municipio} · {campana.nombre}
        </p>
      </div>
    </header>
  );
}

function AsignarTabs({ tab, onTab, counts }) {
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-100">
      <div className="px-5 pb-2 pt-1">
        <div className="flex rounded-full bg-[#eef2ed] p-1 ring-1 ring-black/5">
          {[
            { k: 'equipo', label: 'Equipo', icon: 'users',   count: counts.equipo },
            { k: 'lotes',  label: 'Lotes',  icon: 'package', count: counts.lotes  },
          ].map(o => {
            const isOn = o.k === tab;
            return (
              <button key={o.k} onClick={() => onTab(o.k)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-extrabold tracking-wide transition ${isOn ? 'bg-brand-600 text-white shadow-soft' : 'text-brand-700 hover:bg-brand-50'}`}>
                <Icon name={o.icon} className="h-3.5 w-3.5" />
                {o.label}
                <span className={`rounded-full px-1.5 py-0 text-[10px] font-extrabold tabular-nums ${isOn ? 'bg-white/20' : 'bg-white text-brand-700'}`}>{o.count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-soft ring-1 ring-black/5">
      <Icon name="search" className="h-4 w-4 text-slate-400" />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-transparent text-sm font-medium text-brand-800 placeholder:text-slate-400 focus:outline-none" />
      {value && (
        <button onClick={() => onChange('')} className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
          <Icon name="x" className="h-3 w-3 text-slate-500" />
        </button>
      )}
    </div>
  );
}

function FilterChips({ value, onChange, options }) {
  return (
    <div className="-mx-5 px-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
      <div className="flex gap-1.5 pb-1 pr-2">
        {options.map(o => {
          const isOn = o.k === value;
          return (
            <button key={o.k} onClick={() => onChange(o.k)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-[11px] font-extrabold ring-1 transition ${isOn ? 'bg-brand-600 text-white ring-brand-700' : 'bg-white text-brand-700 ring-brand-100 hover:ring-brand-300'}`}>
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Persona row ──────────────────────────────────────────────────────────

function PersonaRow({ p, isOn, onToggle, yaAsignada }) {
  return (
    <li>
      <button onClick={() => onToggle(p.id)}
        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition shadow-soft ring-1 ${isOn ? 'bg-brand-600 text-white ring-brand-700' : 'bg-white text-brand-800 ring-black/5 hover:ring-brand-300'}`}>
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${isOn ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-700'}`}>{p.iniciales}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-extrabold leading-tight">{p.nombre}</p>
            {yaAsignada && (
              <span className={`rounded-full px-1.5 py-0 text-[9px] font-extrabold uppercase tracking-[0.14em] ${isOn ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'}`}>
                ya en el equipo
              </span>
            )}
          </div>
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
}

// ── Selector de propósito (PLANTACION_INICIAL / REPOSICION) ─────────────
// Toggle segmentado embebido en una fila de lote seleccionada. Bloquea la
// opción PLANTACION_INICIAL cuando la sub-campaña está cerrada.

function PropositoToggle({ value, onChange, permitidos }) {
  const opciones = [
    { k: 'PLANTACION_INICIAL', label: 'Inicial',     icon: 'sprout' },
    { k: 'REPOSICION',         label: 'Reposición',  icon: 'refresh' },
  ];
  return (
    <div className="rounded-2xl bg-white/15 p-1 ring-1 ring-white/20">
      <div className="flex gap-1">
        {opciones.map((o) => {
          const isOn = o.k === value;
          const disabled = !permitidos.includes(o.k);
          return (
            <button
              key={o.k}
              type="button"
              onClick={() => { if (!disabled) onChange(o.k); }}
              disabled={disabled}
              title={disabled && o.k === 'PLANTACION_INICIAL'
                ? 'Solo reposición está permitida en sub-campañas cerradas'
                : undefined}
              className={`flex-1 flex items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.12em] transition
                ${disabled ? 'opacity-40 cursor-not-allowed text-white/60'
                  : isOn
                    ? (o.k === 'PLANTACION_INICIAL' ? 'bg-emerald-400 text-emerald-900 ring-1 ring-emerald-200' : 'bg-orange-300 text-orange-900 ring-1 ring-orange-200')
                    : 'text-white/85 hover:bg-white/10'}`}>
              <Icon name={o.icon} className="h-3.5 w-3.5" />
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Lote row ─────────────────────────────────────────────────────────────

function LoteRow({ l, isOn, onToggle, recomendado, proposito, onProposito, propositosPermitidosLote }) {
  const propMeta = isOn ? PROPOSITO_ASIGNACION_META[proposito] : null;
  return (
    <li
      className={`overflow-hidden rounded-2xl shadow-soft ring-1 transition
        ${isOn ? 'bg-brand-600 text-white ring-brand-700' : 'bg-white text-brand-800 ring-black/5 hover:ring-brand-300'}`}>
      <button type="button" onClick={() => onToggle(l.id)} className="flex w-full items-start gap-3 px-3 py-3 text-left">
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${isOn ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
          <Icon name="package" className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-extrabold leading-tight">{l.especie}</p>
            {recomendado && !isOn && <span className="rounded-full bg-amber-50 px-1.5 py-0 text-[9px] font-extrabold uppercase tracking-[0.14em] text-amber-800 ring-1 ring-amber-100">Sugerido</span>}
            {isOn && propMeta && (
              <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0 text-[9px] font-extrabold uppercase tracking-[0.14em] ring-1
                ${proposito === 'PLANTACION_INICIAL' ? 'bg-emerald-400/20 text-emerald-100 ring-emerald-300/30' : 'bg-orange-400/20 text-orange-100 ring-orange-300/30'}`}>
                <Icon name={propMeta.icon} className="h-3 w-3" />
                {propMeta.short}
              </span>
            )}
          </div>
          <p className={`text-[10.5px] italic ${isOn ? 'text-white/85' : 'text-slate-500'}`}>{l.cientifico}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10.5px] font-bold">
            <span className={isOn ? 'text-white/85' : 'text-brand-700'}>
              {l.id.split('-').slice(0,2).join('-')}
            </span>
            <span className={isOn ? 'text-white/60' : 'text-slate-400'}>·</span>
            <span className={isOn ? 'text-white/85' : 'text-slate-500'}>{l.vivero}</span>
            <span className={isOn ? 'text-white/60' : 'text-slate-400'}>·</span>
            <span className={isOn ? 'text-white/85' : 'text-slate-500'}>{l.subetapa.replace('_', ' ')}</span>
            <span className={isOn ? 'text-white/60' : 'text-slate-400'}>·</span>
            <span className={isOn ? 'text-white/85' : 'text-slate-500'}>{l.edadDias}d</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <p className={`text-lg font-extrabold leading-none tabular-nums ${isOn ? 'text-white' : 'text-brand-800'}`}>{l.saldo}</p>
          <p className={`text-[9px] font-extrabold uppercase tracking-wider ${isOn ? 'text-white/70' : 'text-slate-400'}`}>plantas</p>
          <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full ${isOn ? 'bg-white text-brand-700' : 'bg-slate-100 text-slate-400'}`}>
            {isOn ? <Icon name="check" className="h-4 w-4" /> : <Icon name="plus" className="h-4 w-4" />}
          </div>
        </div>
      </button>
      {isOn && (
        <div className="px-3 pb-3 -mt-1">
          <p className="mb-1 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-white/75">Propósito de la asignación</p>
          <PropositoToggle
            value={proposito}
            onChange={(v) => onProposito(l.id, v)}
            permitidos={propositosPermitidosLote}
          />
        </div>
      )}
    </li>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────

function EmptyState({ tipo, query }) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-soft ring-1 ring-black/5">
      <Icon name={tipo === 'equipo' ? 'users' : 'package'} className="mx-auto h-10 w-10 text-slate-300" />
      <p className="mt-2 text-sm font-extrabold text-brand-800">
        {query ? `Sin resultados para "${query}"` : `Sin ${tipo === 'equipo' ? 'personas' : 'lotes'} disponibles`}
      </p>
      <p className="mt-1 text-[11px] font-semibold text-slate-500">
        {query ? 'Prueba con otra búsqueda o limpia los filtros.' : 'Cambia el filtro o vuelve más tarde.'}
      </p>
    </div>
  );
}

// ── Asignar Screen ───────────────────────────────────────────────────────

function AsignarScreen({
  subcampanaId, tab, onTab,
  equipoSeleccionados, lotesSeleccionados,
  onTogglePersona, onToggleLote,
  query, onQuery,
  filtro, onFiltro,
  confirmando, onConfirmar,
}) {
  const sub = SUBCAMPANAS_ADMIN.find(s => s.id === subcampanaId) || SUBCAMPANAS_ADMIN[0];
  const campana = selectCampanaAgregado(sub.campanaId) || CAMPANAS_ADMIN_AGREGADAS[0];
  const yaAsignados = sub.equipoIds || [];

  // Propósito por lote — estado interno: si la sub-campaña está cerrada,
  // todos los nuevos lotes arrancan en REPOSICION; si está ACTIVA, en
  // PLANTACION_INICIAL.
  const permitidosSub = propositosPermitidos(sub.estado);
  const propositoDefault = permitidosSub[0] || 'PLANTACION_INICIAL';
  const [lotesProposito, setLotesProposito] = React.useState({});

  // Asegura un propósito válido para cada lote seleccionado.
  React.useEffect(() => {
    setLotesProposito((prev) => {
      const next = { ...prev };
      let changed = false;
      lotesSeleccionados.forEach((id) => {
        if (!next[id] || !permitidosSub.includes(next[id])) {
          next[id] = propositoDefault;
          changed = true;
        }
      });
      // Limpia los que ya no están seleccionados.
      Object.keys(next).forEach((id) => {
        if (!lotesSeleccionados.includes(id)) {
          delete next[id];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [lotesSeleccionados.join('|'), sub.estado]);

  const setProposito = (loteId, value) => {
    setLotesProposito((prev) => ({ ...prev, [loteId]: value }));
  };

  const tabCounts = { equipo: equipoSeleccionados.length, lotes: lotesSeleccionados.length };
  const totalSeleccionados = tabCounts.equipo + tabCounts.lotes;
  const lotesObjs = LOTES_VIVERO.filter(l => lotesSeleccionados.includes(l.id));
  const saldoLotes = lotesObjs.reduce((a, l) => a + l.saldo, 0);
  const breakdown = lotesObjs.reduce((acc, l) => {
    const p = lotesProposito[l.id] || propositoDefault;
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  const subCerrada = sub.estado === 'COMPLETADA' || sub.estado === 'FINALIZADA_PARCIAL';
  const subBorrador = sub.estado === 'BORRADOR';

  // Filtered lists
  const personasFiltradas = PERSONAS.filter(p => {
    if (filtro === 'operario'     && p.rol !== 'Operario') return false;
    if (filtro === 'coordinadora' && p.rol !== 'Coordinadora') return false;
    if (filtro === 'noasignados' && yaAsignados.includes(p.id)) return false;
    if (query && !p.nombre.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const lotesFiltrados = LOTES_VIVERO.filter(l => {
    if (filtro === 'campana_match') {
      const especies = (sub.mixPlanificado || []).map(m => m.especie);
      if (!especies.includes(l.especie)) return false;
    }
    if (filtro === 'sol' && l.subetapa !== 'SOL_DIRECTO') return false;
    if (query && !(`${l.especie} ${l.cientifico} ${l.vivero}`.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  return (
    <div data-screen-label="Asignar equipo y lotes" className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col">
        <AsignarHeader sub={sub} campana={campana} onBack={() => { window.location.href = `Detalle sub-campaña.html?subcampanaId=${encodeURIComponent(sub.id)}`; }} />
        <AsignarTabs tab={tab} onTab={onTab} counts={tabCounts} />

        <div className="px-5 pt-3 pb-32 space-y-3 flex-1">
          {/* Banner contextual de propósito según estado de sub-campaña */}
          {tab === 'lotes' && subCerrada && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-orange-50 px-3 py-2.5 ring-1 ring-orange-100">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                <Icon name="refresh" className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-orange-800">Solo reposición</p>
                <p className="mt-0.5 text-[11.5px] font-semibold leading-snug text-orange-900/80">
                  La sub-campaña está {sub.estado === 'COMPLETADA' ? 'completada' : 'cerrada parcialmente'}. Las nuevas asignaciones solo se aceptan con propósito <b>reposición</b> para mantenimiento.
                </p>
              </div>
            </div>
          )}
          {tab === 'lotes' && subBorrador && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <Icon name="alert" className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-700">Sub-campaña en borrador</p>
                <p className="mt-0.5 text-[11.5px] font-semibold leading-snug text-slate-600">
                  Las asignaciones se aceptan cuando la sub-campaña se active. Puedes prepararlas igualmente.
                </p>
              </div>
            </div>
          )}

          <SearchBar value={query} onChange={onQuery}
            placeholder={tab === 'equipo' ? 'Buscar persona…' : 'Buscar lote, especie o vivero…'} />

          {tab === 'equipo' ? (
            <FilterChips value={filtro} onChange={onFiltro}
              options={[
                { k: 'todos',         label: 'Todos' },
                { k: 'operario',      label: 'Operarios' },
                { k: 'coordinadora',  label: 'Coordinadoras' },
                { k: 'noasignados',   label: 'No asignados' },
              ]} />
          ) : (
            <FilterChips value={filtro} onChange={onFiltro}
              options={[
                { k: 'todos',          label: 'Todos los lotes' },
                { k: 'campana_match',  label: `Especies de ${sub.nombre.split(' ')[0]}` },
                { k: 'sol',            label: 'Listos (sol directo)' },
              ]} />
          )}

          {tab === 'equipo' ? (
            personasFiltradas.length === 0 ? (
              <EmptyState tipo="equipo" query={query} />
            ) : (
              <ul className="space-y-2">
                {personasFiltradas.map(p => (
                  <PersonaRow key={p.id} p={p}
                    isOn={equipoSeleccionados.includes(p.id)}
                    onToggle={onTogglePersona}
                    yaAsignada={yaAsignados.includes(p.id)} />
                ))}
              </ul>
            )
          ) : (
            lotesFiltrados.length === 0 ? (
              <EmptyState tipo="lotes" query={query} />
            ) : (
              <ul className="space-y-2">
                {lotesFiltrados.map(l => {
                  const especiesSub = (sub.mixPlanificado || []).map(m => m.especie);
                  const recomendado = especiesSub.includes(l.especie) && l.subetapa === 'SOL_DIRECTO';
                  const isOn = lotesSeleccionados.includes(l.id);
                  return (
                    <LoteRow key={l.id} l={l}
                      isOn={isOn}
                      onToggle={onToggleLote}
                      recomendado={recomendado}
                      proposito={lotesProposito[l.id] || propositoDefault}
                      onProposito={setProposito}
                      propositosPermitidosLote={permitidosSub.length ? permitidosSub : ['PLANTACION_INICIAL', 'REPOSICION']} />
                  );
                })}
              </ul>
            )
          )}
        </div>

        {/* Footer */}
        <div className="absolute inset-x-0 bottom-0 z-30">
          <div className="px-5 pb-5 pt-3 bg-gradient-to-t from-[#eef2ed] via-[#eef2ed]/95 to-transparent">
            <div className="rounded-2xl bg-white px-3.5 py-2.5 shadow-soft ring-1 ring-black/5 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Vas a asignar</p>
                  <p className="text-sm font-extrabold text-brand-800">
                    <span className="tabular-nums">{equipoSeleccionados.length}</span> personas · <span className="tabular-nums">{lotesSeleccionados.length}</span> lotes
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500">Saldo total</p>
                  <p className="text-sm font-extrabold text-brand-800 tabular-nums">{saldoLotes} plantas</p>
                </div>
              </div>
              {lotesSeleccionados.length > 0 && (breakdown.PLANTACION_INICIAL || breakdown.REPOSICION) && (
                <div className="mt-2 flex items-center gap-1.5 border-t border-slate-100 pt-2">
                  {breakdown.PLANTACION_INICIAL > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-800 ring-1 ring-emerald-100">
                      <Icon name="sprout" className="h-3 w-3" />
                      {breakdown.PLANTACION_INICIAL} inicial
                    </span>
                  )}
                  {breakdown.REPOSICION > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-orange-800 ring-1 ring-orange-100">
                      <Icon name="refresh" className="h-3 w-3" />
                      {breakdown.REPOSICION} reposición
                    </span>
                  )}
                </div>
              )}
            </div>
            <button onClick={onConfirmar}
              disabled={totalSeleccionados === 0}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-base font-extrabold text-white shadow-soft transition active:scale-[0.99]
                ${totalSeleccionados === 0 ? 'bg-slate-400/70 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}>
              <Icon name="check-circle" className="h-5 w-5" />
              Confirmar asignación
            </button>
          </div>
        </div>
      </div>

      {/* Confirm overlay */}
      {confirmando !== 'idle' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-brand-700/95 backdrop-blur-sm px-6 text-center text-white">
          <img src="assets/hero-canopy.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
          <div className="relative flex flex-col items-center">
            {confirmando === 'guardando' ? (
              <React.Fragment>
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-white/15" />
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-300 border-t-transparent animate-spin" />
                  <Icon name="users" className="h-9 w-9 text-emerald-200" />
                </div>
                <p className="mt-6 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/80">Asignando…</p>
                <p className="mt-1 text-2xl font-extrabold tracking-tight">Guardando cambios</p>
                <p className="mt-2 text-sm font-semibold text-white/80">Notificando al equipo</p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-400/20 ring-4 ring-emerald-300/40">
                  <Icon name="check-circle" className="h-12 w-12 text-emerald-200" />
                </div>
                <p className="mt-6 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-emerald-200">Asignación completa</p>
                <p className="mt-1 text-3xl font-extrabold tracking-tight">¡Listo!</p>
                <p className="mt-2 text-sm font-semibold text-white/85 max-w-[280px] leading-relaxed">
                  <span className="font-extrabold text-white">{equipoSeleccionados.length}</span> personas y
                  <span className="font-extrabold text-white"> {lotesSeleccionados.length}</span> lotes asignados a
                  <span className="font-extrabold text-white"> {sub.nombre}</span>.
                </p>
                <button onClick={() => { window.location.href = `Detalle sub-campaña.html?subcampanaId=${encodeURIComponent(sub.id)}`; }}
                  className="mt-6 flex w-full max-w-[280px] items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-soft active:scale-[0.99] hover:bg-brand-50">
                  Volver al detalle
                </button>
              </React.Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

window.AsignarScreen = AsignarScreen;
