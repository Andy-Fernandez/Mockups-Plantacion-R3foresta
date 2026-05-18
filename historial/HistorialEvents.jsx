// Event cards for the Historial del lote timeline.
// Each event has a distinct visual treatment (icon, marker color, accent strip)
// but they all share the same skeleton so the timeline reads as one rhythm.

const EVENT_THEME = {
  INICIO: {
    icon: 'package',
    tone: 'emerald',
    ring: 'ring-emerald-200',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500 ring-emerald-100',
    accent: 'bg-emerald-50',
  },
  EMBOLSADO: {
    icon: 'sprout',
    tone: 'brand',
    ring: 'ring-brand-200',
    chip: 'bg-brand-50 text-brand-700 ring-brand-200',
    dot: 'bg-brand-500 ring-brand-100',
    accent: 'bg-brand-50',
  },
  ADAPTABILIDAD: {
    icon: 'sun',
    tone: 'amber',
    ring: 'ring-amber-200',
    chip: 'bg-amber-50 text-amber-800 ring-amber-200',
    dot: 'bg-amber-500 ring-amber-100',
    accent: 'bg-amber-50',
  },
  MERMA: {
    icon: 'loss',
    tone: 'red',
    ring: 'ring-red-200',
    chip: 'bg-red-50 text-red-700 ring-red-200',
    dot: 'bg-red-500 ring-red-100',
    accent: 'bg-red-50',
  },
  DESPACHO: {
    icon: 'truck',
    tone: 'blue',
    ring: 'ring-blue-200',
    chip: 'bg-blue-50 text-blue-700 ring-blue-200',
    dot: 'bg-blue-500 ring-blue-100',
    accent: 'bg-blue-50',
  },
  CIERRE_AUTOMATICO: {
    icon: 'shield',
    tone: 'slate',
    ring: 'ring-slate-300',
    chip: 'bg-slate-100 text-slate-700 ring-slate-300',
    dot: 'bg-slate-500 ring-slate-100',
    accent: 'bg-slate-50',
  },
};

// ── Small reusables ──────────────────────────────────────────────────────────

function Field({ label, value, highlight }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-500">{label}</p>
      <p className={`mt-0.5 ${highlight ? 'text-lg font-extrabold text-brand-800' : 'text-sm font-bold text-brand-700'} leading-tight`}>{value}</p>
    </div>
  );
}

function SaldoBar({ antes, despues, tone = 'brand', positive = false }) {
  // Visual: antes → despues. Color reflects whether it's a gain (EMBOLSADO),
  // a loss (MERMA, DESPACHO), or no change (ADAPTABILIDAD — not shown).
  const arrow = positive ? '↑' : '↓';
  const arrowColor =
    tone === 'red' ? 'text-red-600'
    : tone === 'blue' ? 'text-blue-700'
    : tone === 'brand' ? 'text-brand-600'
    : 'text-slate-600';
  return (
    <div className="mt-3 flex items-stretch gap-2 rounded-2xl bg-white p-2.5 ring-1 ring-slate-200">
      <div className="flex-1 min-w-0 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Saldo antes</p>
        <p className="mt-0.5 text-lg font-extrabold text-slate-500 leading-none">{antes.toLocaleString('es-BO')}</p>
      </div>
      <div className={`flex items-center justify-center px-1 text-lg font-extrabold ${arrowColor}`}>{arrow}</div>
      <div className="flex-1 min-w-0 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-500">Saldo después</p>
        <p className="mt-0.5 text-lg font-extrabold text-brand-800 leading-none">{despues.toLocaleString('es-BO')}</p>
      </div>
    </div>
  );
}

function PhotoStrip({ fotos, onOpen, requiredHint }) {
  if (!fotos || fotos.length === 0) {
    return requiredHint ? (
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-800 ring-1 ring-amber-200">
        <Icon name="info" className="h-3.5 w-3.5" />
        Pendiente: este evento normalmente requiere evidencia.
      </div>
    ) : null;
  }
  const first = fotos[0];
  const extra = fotos.length - 1;
  return (
    <button
      onClick={onOpen}
      className="mt-3 flex w-full items-stretch gap-2 rounded-2xl bg-white p-1.5 text-left ring-1 ring-slate-200 hover:ring-brand-300 active:scale-[0.99] transition"
    >
      <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5">
        <img src={first.url} alt={first.titulo} className="h-full w-full object-cover" />
        {extra > 0 && (
          <div className="absolute inset-0 flex items-end justify-end p-1.5 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-extrabold text-brand-800 shadow-soft">+{extra}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 min-w-0 flex-col justify-center pr-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-500">Evidencia</p>
        <p className="mt-0.5 text-sm font-bold text-brand-700 truncate">{first.titulo}</p>
        <p className="text-[11px] font-medium text-slate-500 mt-0.5">
          {fotos.length} foto{fotos.length === 1 ? '' : 's'} · Toca para ver
        </p>
      </div>
      <div className="flex items-center pr-2 text-brand-500">
        <Icon name="chevron-right" className="h-4 w-4" />
      </div>
    </button>
  );
}

function Observacion({ text }) {
  if (!text) return null;
  return (
    <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Observación</p>
      <p className="mt-0.5 text-xs font-medium text-slate-700 leading-snug">{text}</p>
    </div>
  );
}

// ── Card shell ──────────────────────────────────────────────────────────────

function EventShell({ event, theme, children, isLast, onOpenGallery }) {
  return (
    <li className="relative pl-12 pb-5">
      {/* Spine */}
      {!isLast && <span className="absolute left-[19px] top-9 bottom-0 w-px bg-brand-100" />}
      {/* Marker */}
      <div className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-${theme.tone}-700 shadow-soft ring-1 ${theme.ring}`}>
        <Icon name={theme.icon} className="h-[18px] w-[18px]" />
      </div>

      <article className="rounded-2xl bg-white shadow-soft ring-1 ring-black/5 overflow-hidden">
        <header className="flex items-center justify-between gap-2 px-4 pt-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ring-1 ${theme.chip}`}>{event.kind}</span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-bold">{event.fecha} · {event.hora}</span>
          </div>
        </header>
        <div className="px-4 pt-1 pb-3">
          <h4 className="text-base font-extrabold text-brand-800 leading-tight">{event.label}</h4>
          {event.responsable && (
            <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <Icon name="user" className="h-3.5 w-3.5 text-slate-400" />
              {event.responsable}
            </p>
          )}
          {children}
          {event.fotos !== undefined && (
            <PhotoStrip
              fotos={event.fotos}
              onOpen={onOpenGallery}
              requiredHint={
                (event.kind === 'INICIO' || event.kind === 'EMBOLSADO' || event.kind === 'MERMA' || event.kind === 'DESPACHO')
                && event.fotos.length === 0
              }
            />
          )}
          <Observacion text={event.observacion} />
        </div>
      </article>
    </li>
  );
}

// ── Event-kind renderers ────────────────────────────────────────────────────

function EventInicio({ event, isLast, onOpenGallery }) {
  return (
    <EventShell event={event} theme={EVENT_THEME.INICIO} isLast={isLast} onOpenGallery={onOpenGallery}>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {event.fields.map(f => <Field key={f.label} {...f} />)}
        <div className="col-span-2 -mt-1">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 ring-1 ring-emerald-100">
            <Icon name="info" className="h-3.5 w-3.5 text-emerald-700 flex-shrink-0" />
            <p className="text-[11px] font-bold text-emerald-800 leading-snug">
              Aún no hay plantas vivas. El saldo nace en <span className="font-extrabold">EMBOLSADO</span>.
            </p>
          </div>
        </div>
      </div>
    </EventShell>
  );
}

function EventEmbolsado({ event, isLast, onOpenGallery }) {
  return (
    <EventShell event={event} theme={EVENT_THEME.EMBOLSADO} isLast={isLast} onOpenGallery={onOpenGallery}>
      <div className="mt-3 rounded-2xl bg-gradient-to-br from-brand-50 to-white p-3 ring-1 ring-brand-100">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Nacen las plantas vivas</p>
        <p className="mt-0.5 text-3xl font-extrabold text-brand-800 leading-none tracking-tight">{event.saldoDespues.toLocaleString('es-BO')}</p>
        <p className="mt-1 text-[11px] font-bold text-brand-600">UNIDAD · saldo inicial del lote</p>
      </div>
    </EventShell>
  );
}

function EventAdaptabilidad({ event, isLast, onOpenGallery }) {
  return (
    <EventShell event={event} theme={EVENT_THEME.ADAPTABILIDAD} isLast={isLast} onOpenGallery={onOpenGallery}>
      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-amber-50/70 p-3 ring-1 ring-amber-100">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white text-amber-700 ring-1 ring-amber-200">
          <Icon name={SUBETAPA_ICON[event.subetapaDestino]} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-700">Nueva subetapa</p>
          <p className="text-sm font-extrabold text-amber-900 truncate">
            {event.subetapaDestino}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-slate-500 ring-1 ring-slate-200">
          <Icon name="info" className="h-3 w-3" />
          No afecta saldo
        </div>
      </div>
    </EventShell>
  );
}

function EventMerma({ event, isLast, onOpenGallery }) {
  return (
    <EventShell event={event} theme={EVENT_THEME.MERMA} isLast={isLast} onOpenGallery={onOpenGallery}>
      <div className="mt-3 flex items-stretch gap-2">
        <div className="flex-1 rounded-2xl bg-red-50 px-3 py-2.5 ring-1 ring-red-100">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-red-700">Pérdida</p>
          <p className="mt-0.5 text-2xl font-extrabold text-red-700 leading-none">−{event.cantidad}</p>
          <p className="text-[10px] font-bold text-red-600 mt-1">UNIDAD</p>
        </div>
        <div className="flex-1 rounded-2xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Causa</p>
          <p className="mt-0.5 text-sm font-extrabold text-brand-800 leading-tight">{CAUSA_MERMA_LABEL[event.causa]}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{event.causa}</p>
        </div>
      </div>
      <SaldoBar antes={event.saldoAntes} despues={event.saldoDespues} tone="red" />
    </EventShell>
  );
}

function EventDespacho({ event, isLast, onOpenGallery }) {
  return (
    <EventShell event={event} theme={EVENT_THEME.DESPACHO} isLast={isLast} onOpenGallery={onOpenGallery}>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-blue-50 px-3 py-2.5 ring-1 ring-blue-100">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-700">Despachadas</p>
          <p className="mt-0.5 text-2xl font-extrabold text-blue-700 leading-none">{event.cantidad}</p>
          <p className="text-[10px] font-bold text-blue-600 mt-1">UNIDAD</p>
        </div>
        <div className="rounded-2xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Destino</p>
          <p className="mt-0.5 text-sm font-extrabold text-brand-800 leading-tight">{DESTINO_LABEL[event.destino]}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{event.destino}</p>
        </div>
      </div>
      <div className="mt-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Referencia</p>
            <p className="text-xs font-extrabold text-brand-800 truncate">{event.referencia}</p>
          </div>
          {event.comunidad && (
            <div className="min-w-0 text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Comunidad</p>
              <p className="text-xs font-extrabold text-brand-800 truncate">{event.comunidad}</p>
            </div>
          )}
        </div>
      </div>
      <SaldoBar antes={event.saldoAntes} despues={event.saldoDespues} tone="blue" />
      {event.blockchain && (
        <div className="mt-2 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200">
            <Icon name="link" className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Anclaje blockchain</p>
            <p className="text-[11px] font-bold text-brand-700 truncate">{event.blockchain.red} · {event.blockchain.hash}</p>
          </div>
        </div>
      )}
    </EventShell>
  );
}

function EventCierre({ event, isLast }) {
  const theme = EVENT_THEME.CIERRE_AUTOMATICO;
  return (
    <li className="relative pl-12 pb-2">
      <div className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-white shadow-soft ring-1 ring-slate-300`}>
        <Icon name={theme.icon} className="h-[18px] w-[18px]" />
      </div>
      <article className="rounded-2xl bg-gradient-to-br from-slate-50 to-white p-4 shadow-soft ring-1 ring-slate-200">
        <header className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-slate-700 text-white px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide">CIERRE_AUTOMATICO</span>
          <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-bold">{event.fecha} · {event.hora}</span>
        </header>
        <h4 className="mt-3 text-xl font-extrabold text-slate-800 leading-tight">{event.label}</h4>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Generado por el sistema
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Motivo</p>
            <p className="mt-0.5 text-sm font-extrabold text-slate-800 leading-tight">{MOTIVO_CIERRE_LABEL[event.motivo]}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{event.motivo}</p>
          </div>
          <div className="rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Evento detonante</p>
            <p className="mt-0.5 text-[11px] font-bold text-slate-700 leading-snug">{event.causaEvento}</p>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-100 px-3 py-2.5 ring-1 ring-slate-200">
          <Icon name="info" className="h-4 w-4 mt-0.5 text-slate-600 flex-shrink-0" />
          <p className="text-[12px] font-bold text-slate-700 leading-snug">
            El lote ya no admite nuevos eventos operativos.
          </p>
        </div>
      </article>
    </li>
  );
}

// ── Dispatcher ──────────────────────────────────────────────────────────────

function EventCard({ event, isLast, onOpenGallery }) {
  switch (event.kind) {
    case 'INICIO':         return <EventInicio event={event} isLast={isLast} onOpenGallery={onOpenGallery} />;
    case 'EMBOLSADO':      return <EventEmbolsado event={event} isLast={isLast} onOpenGallery={onOpenGallery} />;
    case 'ADAPTABILIDAD':  return <EventAdaptabilidad event={event} isLast={isLast} onOpenGallery={onOpenGallery} />;
    case 'MERMA':          return <EventMerma event={event} isLast={isLast} onOpenGallery={onOpenGallery} />;
    case 'DESPACHO':       return <EventDespacho event={event} isLast={isLast} onOpenGallery={onOpenGallery} />;
    case 'CIERRE_AUTOMATICO': return <EventCierre event={event} isLast={isLast} />;
    default: return null;
  }
}

Object.assign(window, { EventCard, EVENT_THEME });
