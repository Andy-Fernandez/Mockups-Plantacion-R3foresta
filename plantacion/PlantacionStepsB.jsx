// Steps 4–6 of "Registrar plantación" + the post-confirm success animation.

// ── STEP 4 · Co-responsables ──────────────────────────────────────────────

function StepEquipo({ selected, onToggle }) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
        <p className="text-sm font-bold text-brand-700 leading-relaxed">
          Selecciona a tus compañeras y compañeros que plantaron contigo hoy. Cada uno verá este registro en su historial.
        </p>
      </div>

      <ul className="space-y-2">
        {EQUIPO.map(p => {
          const isOn = selected.includes(p.id);
          return (
            <li key={p.id}>
              <button
                onClick={() => onToggle(p.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition shadow-soft ring-1 ${isOn ? 'bg-brand-600 text-white ring-brand-700' : 'bg-white text-brand-800 ring-black/5 hover:ring-brand-300'}`}
              >
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-extrabold tracking-wide ${isOn ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-700'}`}>
                  {p.iniciales}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold leading-tight">{p.nombre}</p>
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${isOn ? 'text-white/75' : 'text-brand-500'}`}>{p.rol}</p>
                </div>
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${isOn ? 'bg-white text-brand-700' : 'bg-slate-100 text-slate-400'}`}>
                  {isOn ? <Icon name="check" className="h-4 w-4" /> : <Icon name="plus" className="h-4 w-4" />}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="text-center text-[11px] font-semibold text-slate-500">
        Este paso es opcional · puedes saltarlo
      </p>
    </div>
  );
}

// ── STEP 5 · Observaciones ────────────────────────────────────────────────

function StepObservaciones({ value, onChange }) {
  const SUGERENCIAS = [
    'Suelo húmedo, condiciones óptimas',
    'Algunos brotes con estrés hídrico',
    'Terreno con pendiente moderada',
    'Reposición planificada en 2 semanas',
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Notas de campo</p>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          placeholder="Cómo encontraste el terreno, observaciones técnicas, condiciones climáticas…"
          className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-brand-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <p className="mt-1 text-right text-[10px] font-bold text-slate-400">{value.length}/500</p>
      </div>

      <div>
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-2">Sugerencias rápidas</p>
        <div className="flex flex-wrap gap-1.5">
          {SUGERENCIAS.map(s => (
            <button
              key={s}
              onClick={() => onChange(value ? `${value} ${s}` : s)}
              className="rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-brand-700 ring-1 ring-brand-100 hover:ring-brand-300 transition"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] font-semibold text-slate-500">
        Opcional · esto se guarda como nota libre en el evento
      </p>
    </div>
  );
}

// ── STEP 6 · Confirmar ────────────────────────────────────────────────────

function SummaryRow({ icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl ${accent || 'bg-brand-50 text-brand-700'}`}>
        <Icon name={icon} className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">{label}</p>
        <p className="text-sm font-extrabold text-brand-800 truncate">{value}</p>
      </div>
    </div>
  );
}

function StepConfirmar({ campana, counts, fotos, equipo, observaciones, conexion }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const especiesUsadas = Object.entries(counts).filter(([, v]) => v > 0).map(([k, v]) => `${v} ${k}`).join(' · ') || '—';
  const equipoLabel = equipo.length === 0 ? 'Solo tú' : equipo.map(id => EQUIPO.find(e => e.id === id)?.iniciales).join(' · ');
  const photos = PHOTOS_SAMPLE.slice(0, fotos);

  return (
    <div className="space-y-3">
      {/* Hero summary */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-brand-800 px-4 py-4 text-white shadow-soft">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-white/80">Vas a registrar</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[44px] font-extrabold leading-none tracking-tight tabular-nums">{total}</p>
            <p className="mt-1 text-[11px] font-bold text-white/85">árboles en {Object.values(counts).filter(v => v > 0).length} especies</p>
          </div>
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <Icon name="planting" className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3 rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/15">
          <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Campaña</p>
          <p className="text-sm font-extrabold leading-tight">{campana?.nombre}</p>
          <p className="text-[11px] font-bold text-white/80">{campana?.zona}</p>
        </div>
      </div>

      {/* Mini map preview */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-black/5">
        <div className="relative aspect-[16/8] w-full">
          <svg viewBox="0 0 320 160" className="absolute inset-0 h-full w-full">
            <defs>
              <pattern id="topo" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="0" cy="0" r="22" fill="none" stroke="#cbd5c5" strokeWidth="0.6" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="320" height="160" fill="#eef2ed" />
            <rect width="320" height="160" fill="url(#topo)" />
            {/* Polígono campaña */}
            <path d="M40 30 L260 20 L290 80 L240 140 L80 130 L30 90 Z" fill="#d9e8dd" stroke="#1f613b" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.85" />
            {/* Pines previos */}
            {[[100, 60], [140, 85], [180, 50], [200, 110], [80, 100]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3" fill="#1f613b" />
            ))}
            {/* Pin nuevo (animado) */}
            <g transform="translate(160, 80)">
              <circle r="14" fill="#f59e0b" opacity="0.2" />
              <circle r="9" fill="#f59e0b" opacity="0.35" />
              <circle r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
            </g>
          </svg>
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-brand-700 shadow-soft ring-1 ring-black/5">
            <Icon name="crosshair" className="h-3 w-3" />
            {GPS_FIX.lat.toFixed(4)}, {GPS_FIX.lng.toFixed(4)}
          </div>
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-500/95 px-2 py-1 text-[9.5px] font-extrabold uppercase tracking-wider text-white shadow-soft">
            Nuevo
          </div>
        </div>
      </div>

      {/* Summary rows */}
      <div className="divide-y divide-slate-100 rounded-3xl bg-white shadow-soft ring-1 ring-black/5">
        <SummaryRow icon="leaf" label="Especies plantadas" value={especiesUsadas} />
        <SummaryRow icon="camera" label="Evidencia fotográfica" value={`${fotos} ${fotos === 1 ? 'foto' : 'fotos'} con GPS`} />
        <SummaryRow icon="users" label="Co-responsables" value={equipoLabel} />
        {observaciones && <SummaryRow icon="note" label="Observaciones" value={observaciones} />}
      </div>

      {conexion === 'offline' && (
        <div className="flex items-start gap-3 rounded-2xl border-l-4 border-amber-500 bg-amber-50 px-3 py-3">
          <Icon name="cloud-off" className="h-4 w-4 mt-0.5 text-amber-700 flex-shrink-0" />
          <div>
            <p className="text-[12px] font-extrabold text-amber-800">Sin conexión</p>
            <p className="text-[11px] font-medium text-amber-700 leading-snug">
              Se guardará localmente y se sincronizará cuando vuelva la señal. Tu registro queda asegurado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Success / saving animation overlay ────────────────────────────────────

function SuccessOverlay({ phase, campana, total, onContinue }) {
  // phase: 'guardando' | 'exito'
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-brand-700/95 backdrop-blur-sm px-6 text-center text-white">
      <img src={assetPath('plantacion.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="relative flex flex-col items-center">
        {phase === 'guardando' ? (
          <React.Fragment>
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-white/15" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-300 border-t-transparent animate-spin" />
              <Icon name="planting" className="h-9 w-9 text-emerald-200" />
            </div>
            <p className="mt-6 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/80">Registrando…</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">Guardando tu plantación</p>
            <p className="mt-2 text-sm font-semibold text-white/80">No cierres la app · esto puede tardar unos segundos</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-400/20 ring-4 ring-emerald-300/40">
              <Icon name="check-circle" className="h-12 w-12 text-emerald-200" />
            </div>
            <p className="mt-6 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-emerald-200">Plantación registrada</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">¡Bien hecho, {ME.nombre.split(' ')[0]}!</p>
            <p className="mt-2 text-sm font-semibold text-white/85 max-w-[280px] leading-relaxed">
              <span className="font-extrabold text-white">{total}</span> árboles agregados al registro de
              <span className="font-extrabold text-white"> {campana?.nombre}</span>.
            </p>

            <div className="mt-6 grid w-full max-w-[280px] grid-cols-2 gap-2">
              <div className="rounded-2xl bg-white/10 px-3 py-2.5 ring-1 ring-white/15">
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Hoy plantaste</p>
                <p className="text-xl font-extrabold tabular-nums">{HOY.plantadosHoy + total}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2.5 ring-1 ring-white/15">
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Campañas</p>
                <p className="text-xl font-extrabold tabular-nums">{HOY.campanasHoy}</p>
              </div>
            </div>

            <button onClick={onContinue} className="mt-6 flex w-full max-w-[280px] items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-soft active:scale-[0.99] hover:bg-brand-50">
              Registrar otra plantación
            </button>
            <button onClick={onContinue} className="mt-2 text-[12px] font-extrabold text-white/80 hover:text-white">
              Ver mi historial del día
            </button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

window.StepEquipo = StepEquipo;
window.StepObservaciones = StepObservaciones;
window.StepConfirmar = StepConfirmar;
window.SuccessOverlay = SuccessOverlay;
