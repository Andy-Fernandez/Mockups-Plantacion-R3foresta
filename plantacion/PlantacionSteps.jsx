// Header + step components for "Registrar plantación".
// Visual rhythm follows the rest of the kit: rounded-2xl/3xl cards on a #eef2ed canvas,
// brand-600 primary, white scrim cards, eyebrows in tracking-[0.18em] brand-500.

const STEPS = [
  { n: 1, label: 'Campaña' },
  { n: 2, label: 'Foto + GPS' },
  { n: 3, label: 'Especies' },
  { n: 4, label: 'Equipo' },
  { n: 5, label: 'Notas' },
  { n: 6, label: 'Confirmar' },
];

// ── Sticky header with title, step counter, progress bar, connection pill ──

function PlantHeader({ paso, conexion, onBack }) {
  const pct = ((paso - 1) / (STEPS.length - 1)) * 100;
  const current = STEPS[paso - 1];

  const conexionMeta = {
    online:  { label: 'En línea',         icon: 'signal',     tone: 'bg-emerald-400/20 text-emerald-100 ring-emerald-200/40' },
    sync:    { label: 'Sincronizando…',   icon: 'refresh',    tone: 'bg-amber-300/25 text-amber-100 ring-amber-200/40' },
    offline: { label: 'Sin señal · cola', icon: 'cloud-off',  tone: 'bg-white/15 text-white ring-white/30' },
  }[conexion] || { label: 'En línea', icon: 'signal', tone: 'bg-emerald-400/20 text-emerald-100 ring-emerald-200/40' };

  return (
    <header className="relative overflow-hidden rounded-b-3xl bg-brand-700 text-white shadow-soft">
      <img src="assets/plantacion.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-700/85 via-brand-700/85 to-brand-700" />

      <div className="relative px-5 pt-5 pb-4">
        <div className="flex items-center justify-between gap-2">
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition" aria-label="Volver">
            <Icon name="arrow-left" className="h-5 w-5" />
          </button>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold tracking-wide ring-1 ${conexionMeta.tone}`}>
            <Icon name={conexionMeta.icon} className="h-3.5 w-3.5" />
            {conexionMeta.label}
          </span>
        </div>

        <p className="mt-4 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/85">
          Plantación · Paso {paso} de {STEPS.length}
        </p>
        <h1 className="mt-0.5 text-[26px] font-extrabold leading-[1.1] tracking-tight">
          {current.n === 1 && 'Elige la campaña'}
          {current.n === 2 && 'Foto y ubicación'}
          {current.n === 3 && 'Especies plantadas'}
          {current.n === 4 && '¿Plantaste con alguien?'}
          {current.n === 5 && 'Observaciones'}
          {current.n === 6 && 'Confirma y registra'}
        </h1>

        <div className="mt-4 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const done = i + 1 < paso;
            const active = i + 1 === paso;
            return (
              <div key={s.n} className="flex flex-1 flex-col items-center gap-1">
                <div className={`h-1.5 w-full rounded-full ${done || active ? 'bg-emerald-300' : 'bg-white/20'}`} />
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}

// ── Sticky footer button — primary action of the step ─────────────────────

function StepFooter({ primary, onPrimary, secondary, onSecondary, disabled, tone = 'primary' }) {
  return (
    <div className="sticky bottom-0 -mx-5 px-5 pt-3 pb-5 bg-gradient-to-t from-[#eef2ed] via-[#eef2ed]/95 to-transparent">
      {secondary && (
        <button
          onClick={onSecondary}
          className="mb-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-soft ring-1 ring-black/5 hover:ring-brand-300 transition"
        >
          {secondary}
        </button>
      )}
      <button
        onClick={onPrimary}
        disabled={disabled}
        className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-base font-extrabold text-white shadow-soft transition active:scale-[0.99]
          ${disabled ? 'bg-slate-400/70 cursor-not-allowed' :
            tone === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-brand-600 hover:bg-brand-700'}`}
      >
        {primary}
      </button>
    </div>
  );
}

// ── STEP 1 · Campaña ──────────────────────────────────────────────────────

function StepCampana({ campanaId, onSelect, onNext }) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-brand-700 leading-relaxed">
        Hoy puedes plantar en estas campañas activas. Toca una tarjeta para continuar.
      </p>

      <div className="space-y-3">
        {CAMPANAS.map(c => {
          const isOn = c.id === campanaId;
          const pct = Math.round((c.plantados / c.meta) * 100);
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`block w-full text-left rounded-3xl bg-white p-4 shadow-soft transition ring-1 ${isOn ? 'ring-2 ring-brand-600' : 'ring-black/5 hover:ring-brand-300'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${isOn ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'}`}>
                  <Icon name="planting" className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] ${c.tipo === 'ARBORIZACION' ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-100' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'}`}>
                      {c.tipo}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{c.distanciaKm < 1 ? `${(c.distanciaKm * 1000).toFixed(0)} m` : `${c.distanciaKm} km`}</span>
                  </div>
                  <p className="mt-1 text-[15px] font-extrabold leading-tight text-brand-800">{c.nombre}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <Icon name="pin" className="h-3.5 w-3.5 text-slate-400" />
                    {c.zona}
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Avance</p>
                  <p className="text-xs font-extrabold text-brand-800">
                    {c.plantados.toLocaleString('es-BO')}<span className="text-slate-400"> / {c.meta.toLocaleString('es-BO')}</span>
                  </p>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-brand-50">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-2xl bg-brand-50 px-3 py-2">
                <p className="text-[11px] font-bold text-brand-700">
                  Tienes <span className="font-extrabold">{c.asignadosOperario}</span> árboles asignados para plantar hoy
                </p>
                <Icon name="chevron-right" className={`h-4 w-4 ${isOn ? 'text-brand-700' : 'text-brand-500'}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── STEP 2 · Foto + GPS ───────────────────────────────────────────────────

function StepFotoGps({ campana, fotos, onAddPhoto, gps, onRecaptureGps }) {
  const photos = PHOTOS_SAMPLE.slice(0, fotos);
  const gpsMeta = {
    capturando: { tone: 'bg-amber-50 text-amber-800 ring-amber-200', icon: 'crosshair', label: 'Activando GPS…', detail: 'Esperando señal estable' },
    capturado:  { tone: 'bg-emerald-50 text-emerald-800 ring-emerald-200', icon: 'check-circle', label: 'GPS capturado', detail: `±${GPS_FIX.accuracy} m · ${GPS_FIX.capturadoEn}` },
    'sin-senal':{ tone: 'bg-red-50 text-red-700 ring-red-200', icon: 'alert', label: 'Sin señal GPS', detail: 'Camina a un punto con cielo abierto' },
  }[gps];

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Campaña</p>
        <p className="mt-0.5 text-sm font-extrabold text-brand-800">{campana?.nombre}</p>
        <p className="text-xs font-semibold text-slate-500">{campana?.zona}</p>
      </div>

      {/* GPS status */}
      <div className={`flex items-center gap-3 rounded-2xl px-3 py-3 ring-1 ${gpsMeta.tone}`}>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-white/60">
          <Icon name={gpsMeta.icon} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold leading-tight">{gpsMeta.label}</p>
          <p className="text-[11px] font-semibold opacity-80">{gpsMeta.detail}</p>
        </div>
        {gps !== 'capturado' && (
          <button onClick={onRecaptureGps} className="flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-[11px] font-extrabold hover:bg-white">
            <Icon name="refresh" className="h-3.5 w-3.5" />
            Reintentar
          </button>
        )}
      </div>

      {/* Photo capture */}
      <div>
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-2">
          Evidencia fotográfica
        </p>

        {fotos === 0 ? (
          <button
            onClick={onAddPhoto}
            className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-3xl bg-white text-brand-700 shadow-soft ring-2 ring-dashed ring-brand-200 hover:ring-brand-400 transition"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
              <Icon name="camera" className="h-8 w-8" />
            </div>
            <span className="text-base font-extrabold">Tomar foto del grupo</span>
            <span className="text-[11px] font-semibold text-slate-500 px-8 text-center">Puedes tomar varias fotos del grupo plantado</span>
          </button>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {photos.map((p, i) => (
                <figure key={i} className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-soft">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img src={p.url} alt={p.label} className="h-full w-full object-cover" />
                  </div>
                  <figcaption className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-full bg-black/55 px-2 py-1 text-[10px] font-extrabold text-white backdrop-blur-sm">
                    <span className="inline-flex items-center gap-1">
                      <Icon name="pin" className="h-3 w-3" />
                      GPS ✓
                    </span>
                    <span>{['08:34','08:36','08:39'][i]}</span>
                  </figcaption>
                </figure>
              ))}

              {/* Add another */}
              <button
                onClick={onAddPhoto}
                className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1.5 rounded-2xl bg-white text-brand-700 shadow-soft ring-2 ring-dashed ring-brand-200 hover:ring-brand-400 transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50">
                  <Icon name="camera-plus" className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-extrabold">Agregar otra</span>
              </button>
            </div>
            <p className="text-[11px] font-semibold text-slate-500">{fotos} {fotos === 1 ? 'foto capturada' : 'fotos capturadas'} · GPS adjuntado en cada una</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── STEP 3 · Especies y cantidades ────────────────────────────────────────

function SpeciesRow({ esp, count, total, plantedSoFar, onChange }) {
  // Live %: count of this species / total this session.
  const realPct = total > 0 ? Math.round((count / total) * 100) : 0;
  const exceeds = total > 0 && realPct > esp.maxPct;

  return (
    <div className={`rounded-2xl bg-white px-3 py-3 shadow-soft ring-1 transition ${exceeds ? 'ring-amber-300' : 'ring-black/5'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-brand-800 leading-tight">{esp.especie}</p>
          <p className="text-[11px] italic text-slate-500">{esp.cientifico}</p>
        </div>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-extrabold text-brand-700">
          máx {esp.maxPct}%
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          onClick={() => onChange(Math.max(0, count - 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700 active:scale-[0.96] hover:bg-brand-100 transition"
          aria-label="Restar"
        >
          <Icon name="minus" className="h-5 w-5" />
        </button>

        <div className="flex flex-1 flex-col items-center">
          <p className="text-[28px] font-extrabold leading-none tracking-tight text-brand-800 tabular-nums">{count}</p>
          <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">UNIDAD</p>
        </div>

        <button
          onClick={() => onChange(count + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white active:scale-[0.96] hover:bg-brand-700 transition"
          aria-label="Sumar"
        >
          <Icon name="plus" className="h-5 w-5" />
        </button>
      </div>

      {/* % real vs % planificado */}
      <div className="mt-3">
        <div className="flex items-baseline justify-between">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">% de hoy</p>
          <p className={`text-[11px] font-extrabold tabular-nums ${exceeds ? 'text-amber-700' : 'text-brand-700'}`}>
            {realPct}% <span className="text-slate-400">/ {esp.maxPct}%</span>
          </p>
        </div>
        <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="absolute inset-y-0 left-0 rounded-full bg-brand-200" style={{ width: `${esp.maxPct}%` }} />
          <div className={`absolute inset-y-0 left-0 rounded-full ${exceeds ? 'bg-amber-500' : 'bg-brand-600'}`} style={{ width: `${Math.min(100, realPct)}%` }} />
        </div>
      </div>

      {exceeds && (
        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
          <Icon name="alert" className="h-3.5 w-3.5" />
          Pasaste el % planificado — puedes continuar igual
        </p>
      )}
    </div>
  );
}

function StepEspecies({ campana, counts, onChange }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-4 text-white shadow-soft">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Total esta plantación</p>
            <p className="mt-1 text-5xl font-extrabold leading-none tracking-tight tabular-nums">{total}</p>
            <p className="mt-1 text-[11px] font-bold text-white/80">UNIDAD · árboles en este registro</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-white/70">Asignados hoy</p>
            <p className="text-lg font-extrabold tabular-nums">{campana?.asignadosOperario}</p>
          </div>
        </div>
      </div>

      {campana?.mixPlanificado.map(esp => (
        <SpeciesRow
          key={esp.especie}
          esp={esp}
          count={counts[esp.especie] || 0}
          total={total}
          onChange={(v) => onChange(esp.especie, v)}
        />
      ))}
    </div>
  );
}

window.PlantHeader = PlantHeader;
window.StepFooter = StepFooter;
window.StepCampana = StepCampana;
window.StepFotoGps = StepFotoGps;
window.StepEspecies = StepEspecies;
window.STEPS = STEPS;
