// Shared UI atoms for admin screens. Header w/ image, state chips,
// progress rings/bars, mini-map, etc. All mobile-first.

// Estados operativos de sub-campaña + estados derivados de campaña paraguas.
// `short` es para badges compactos (donut, listas densas); `label` para detalles.
const ESTADO_META = {
  BORRADOR:           { label: 'BORRADOR',             short: 'BORRADOR',   tone: 'bg-slate-100 text-slate-700 ring-slate-200',     icon: 'pencil',       dot: 'bg-slate-400' },
  ACTIVA:             { label: 'ACTIVA',               short: 'ACTIVA',     tone: 'bg-emerald-50 text-emerald-800 ring-emerald-100', icon: 'check-circle', dot: 'bg-emerald-500' },
  COMPLETADA:         { label: 'META ALCANZADA',       short: 'COMPLETADA', tone: 'bg-blue-50 text-blue-800 ring-blue-100',          icon: 'flag',         dot: 'bg-blue-500' },
  FINALIZADA_PARCIAL: { label: 'CERRADA PARCIALMENTE', short: 'PARCIAL',    tone: 'bg-amber-50 text-amber-800 ring-amber-100',       icon: 'flag',         dot: 'bg-amber-500' },
  EN_MANTENIMIENTO:   { label: 'EN MANTENIMIENTO',     short: 'MANTEN.',    tone: 'bg-cyan-50 text-cyan-800 ring-cyan-100',          icon: 'shield',       dot: 'bg-cyan-500' },
  MONITOREO_HISTORICO:{ label: 'MONITOREO HISTÓRICO',  short: 'HISTÓRICO',  tone: 'bg-slate-100 text-slate-700 ring-slate-200',      icon: 'archive',      dot: 'bg-slate-400' },
};

// Fase de mantenimiento (paralela al estado, solo en COMPLETADA / FINALIZADA_PARCIAL).
const FASE_META = {
  MANTENIMIENTO_ACTIVO: { label: 'MANTENIMIENTO ACTIVO', short: 'MANT. ACTIVO',  tone: 'bg-blue-50 text-blue-800 ring-blue-100',     dot: 'bg-blue-500', icon: 'shield' },
  MONITOREO_HISTORICO:  { label: 'MONITOREO HISTÓRICO',  short: 'HISTÓRICO',     tone: 'bg-slate-100 text-slate-700 ring-slate-200', dot: 'bg-slate-400', icon: 'archive' },
};

const TIPO_META = {
  ARBORIZACION:  { label: 'ARBORIZACIÓN',  tone: 'bg-amber-50 text-amber-800 ring-amber-100' },
  REFORESTACION: { label: 'REFORESTACIÓN', tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
  FORESTACION:   { label: 'FORESTACIÓN',   tone: 'bg-brand-50 text-brand-700 ring-brand-100' },
};

function StateBadge({ estado, light, compact }) {
  const m = ESTADO_META[estado];
  if (!m) return null;
  const text = compact ? m.short : m.label;
  if (light) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white ring-1 ring-white/30">
        <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
        {text}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] ring-1 ${m.tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {text}
    </span>
  );
}

// Badge de fase de mantenimiento, opcionalmente con contador "· 18m".
function FaseBadge({ fase, mesesRestantes, light, compact }) {
  const m = FASE_META[fase];
  if (!m) return null;
  const text = compact ? m.short : m.label;
  const sufijo = (fase === 'MANTENIMIENTO_ACTIVO' && mesesRestantes != null) ? ` · ${mesesRestantes}m` : '';
  const cls = light
    ? 'bg-white/20 text-white ring-white/30'
    : m.tone;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em] ring-1 ${cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {text}{sufijo}
    </span>
  );
}

function TipoBadge({ tipo }) {
  const m = TIPO_META[tipo];
  if (!m) return null;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.14em] ring-1 ${m.tone}`}>
      {m.label}
    </span>
  );
}

// Linear progress with optional secondary marker (goal vs current).
function Progress({ pct, tone = 'brand', height = 8 }) {
  const tones = {
    brand:   'bg-brand-600',
    emerald: 'bg-emerald-500',
    amber:   'bg-amber-500',
    blue:    'bg-blue-500',
    red:     'bg-red-500',
  };
  return (
    <div className="relative w-full overflow-hidden rounded-full bg-slate-100" style={{ height }}>
      <div className={`h-full rounded-full ${tones[tone]} transition-[width]`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}

// Donut for state distribution.
function StatesDonut({ data, size = 96, stroke = 14 }) {
  // data: [{ key, value, color }]
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#eef2ed" strokeWidth={stroke} />
      {data.map((d, i) => {
        const len = (d.value / total) * c;
        const seg = (
          <circle key={i}
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={d.color} strokeWidth={stroke}
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-acc}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            strokeLinecap="butt"
          />
        );
        acc += len;
        return seg;
      })}
    </svg>
  );
}

// Stylized SVG map. Optional polygon, pins, and "new" highlight.
function MiniMap({ polygon, pins, highlight, height = 140, label }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 shadow-soft">
      <div className="relative w-full" style={{ height }}>
        <svg viewBox="0 0 320 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <defs>
            <pattern id="topo-admin" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="0" cy="0" r="22" fill="none" stroke="#cbd5c5" strokeWidth="0.6" opacity="0.45" />
            </pattern>
            <pattern id="topo-admin-2" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20h40M20 0v40" stroke="#cbd5c5" strokeWidth="0.4" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="320" height="160" fill="#eef2ed" />
          <rect width="320" height="160" fill="url(#topo-admin)" />
          <rect width="320" height="160" fill="url(#topo-admin-2)" />
          {/* River-ish curve */}
          <path d="M0 110 Q 80 90 160 120 T 320 90" fill="none" stroke="#bcd0c6" strokeWidth="2" opacity="0.7" />
          {polygon && (
            <path d={polygon} fill="#d9e8dd" stroke="#1f613b" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.85" />
          )}
          {(pins || []).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="#1f613b" />
          ))}
          {highlight && (
            <g transform={`translate(${highlight[0]}, ${highlight[1]})`}>
              <circle r="14" fill="#f59e0b" opacity="0.2" />
              <circle r="9" fill="#f59e0b" opacity="0.35" />
              <circle r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
            </g>
          )}
        </svg>
        {label && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-brand-700 shadow-soft ring-1 ring-black/5">
            <Icon name="pin" className="h-3 w-3" />
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

// Avatar pile (used in dashboard cards + asignación).
function AvatarPile({ items, max = 4, size = 7 }) {
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  return (
    <div className="flex items-center">
      {shown.map((p, i) => (
        <span key={p.id || i}
          className={`flex h-${size} w-${size} items-center justify-center rounded-full bg-brand-50 text-[10px] font-extrabold text-brand-700 ring-2 ring-white`}
          style={{ marginLeft: i === 0 ? 0 : -8 }}>
          {p.iniciales}
        </span>
      ))}
      {rest > 0 && (
        <span className={`flex h-${size} w-${size} items-center justify-center rounded-full bg-slate-100 text-[10px] font-extrabold text-slate-600 ring-2 ring-white`}
              style={{ marginLeft: -8 }}>
          +{rest}
        </span>
      )}
    </div>
  );
}

window.StateBadge = StateBadge;
window.FaseBadge  = FaseBadge;
window.TipoBadge  = TipoBadge;
window.Progress   = Progress;
window.StatesDonut = StatesDonut;
window.MiniMap    = MiniMap;
window.AvatarPile = AvatarPile;
window.ESTADO_META = ESTADO_META;
window.FASE_META   = FASE_META;
