// PublicoShell.jsx — Átomos compartidos para vistas públicas de detalle (tarea 07).
// Sin acciones de admin. Solo lectura + trazabilidad + blockchain.

// ── Metadatos de tipos de evento ─────────────────────────────────────────────
const _TIPO_EV = {
  SUBCAMPANIA_ACTIVADA:             { label: 'Sub-campaña activada',   icon: 'flag',         cls: 'bg-emerald-50 text-emerald-700 ring-emerald-100' },
  PLANTACION_INICIAL:               { label: 'Plantación inicial',     icon: 'planting',     cls: 'bg-brand-50 text-brand-700 ring-brand-100'       },
  REPOSICION:                       { label: 'Reposición',             icon: 'refresh',      cls: 'bg-orange-50 text-orange-700 ring-orange-100'    },
  MORTANDAD_REPORTADA:              { label: 'Mortandad reportada',    icon: 'loss',         cls: 'bg-red-50 text-red-700 ring-red-100'             },
  ASIGNACION_VIVERO:                { label: 'Asignación de lote',     icon: 'package',      cls: 'bg-slate-100 text-slate-600 ring-slate-200'      },
  DEVOLUCION_A_VIVERO:              { label: 'Devolución a vivero',    icon: 'package',      cls: 'bg-slate-100 text-slate-600 ring-slate-200'      },
  SUBCAMPANIA_COMPLETADA:           { label: 'Sub-campaña completada', icon: 'check-circle', cls: 'bg-blue-50 text-blue-700 ring-blue-100'          },
  SUBCAMPANIA_FINALIZADA_PARCIAL:   { label: 'Cierre parcial',         icon: 'alert',        cls: 'bg-amber-50 text-amber-700 ring-amber-100'       },
  TRANSICION_A_MONITOREO_HISTORICO: { label: 'Transición a histórico', icon: 'layers',       cls: 'bg-slate-100 text-slate-600 ring-slate-200'      },
};

// ── TimelineEventos ───────────────────────────────────────────────────────────
// Lista vertical append-only de eventos. Las reposiciones se diferencian:
//   faseSubcampana MONITOREO_HISTORICO → badge gris "REPOSICIÓN HISTÓRICA"
//   cualquier otro → badge naranja "REPOSICIÓN"
function TimelineEventos({ eventos, mostrarBlockchain = true, mostrarSubcampana = false }) {
  if (!eventos || eventos.length === 0) {
    return (
      <div className="py-10 text-center">
        <Icon name="hash" className="h-8 w-8 text-slate-200 mx-auto mb-2" />
        <p className="text-[12px] text-slate-400">Sin eventos registrados</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-[18px] top-4 bottom-4 w-px bg-slate-100" />
      <div className="flex flex-col">
        {eventos.map((ev, i) => {
          const meta = _TIPO_EV[ev.tipo] || { label: ev.tipo, icon: 'dot', cls: 'bg-slate-100 text-slate-600 ring-slate-200' };

          const reposicionBadge = ev.tipo === 'REPOSICION'
            ? ev.faseSubcampana === 'MONITOREO_HISTORICO'
              ? <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.1em] text-slate-500 ring-1 ring-slate-200">REPOSICIÓN HISTÓRICA</span>
              : <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.1em] text-orange-700 ring-1 ring-orange-100">REPOSICIÓN</span>
            : null;

          return (
            <div key={ev.id} className={`relative flex gap-3 py-3.5 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
              {/* Nodo */}
              <div className="relative shrink-0 flex items-start justify-center" style={{ width: 36 }}>
                <div className={`z-10 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full ring-1 ${meta.cls}`}>
                  <Icon name={meta.icon} className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <p className="text-[9.5px] font-bold text-slate-400 leading-none">{ev.fecha}</p>
                    {mostrarSubcampana && ev.subcampanaNombre && (
                      <p className="text-[9px] font-bold text-brand-500 mt-0.5">{ev.subcampanaNombre}</p>
                    )}
                    <p className="text-[12px] font-extrabold text-slate-800 leading-snug mt-0.5">
                      {ev.descripcion}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {reposicionBadge}
                    {mostrarBlockchain && ev.tieneBlockchain && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-[0.1em] text-blue-600 ring-1 ring-blue-100">
                        <Icon name="link" className="h-2.5 w-2.5" />
                        on-chain
                      </span>
                    )}
                  </div>
                </div>

                {(ev.actorSnapshot || ev.cantidadArboles) && (
                  <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                    {ev.actorSnapshot && (
                      <span className="text-[10px] font-bold text-slate-500">{ev.actorSnapshot}</span>
                    )}
                    {ev.cantidadArboles && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[9.5px] font-extrabold text-brand-700">
                        <Icon name="trees" className="h-3 w-3" />
                        {fmtMiles(ev.cantidadArboles)} árboles
                      </span>
                    )}
                  </div>
                )}

                {ev.especiesSnapshot && ev.especiesSnapshot.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {ev.especiesSnapshot.map(e => (
                      <span key={e.especie}
                        className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                        <Icon name="leaf" className="h-2.5 w-2.5" />
                        {e.especie} · {e.cantidad}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── ContadorMantenimiento ─────────────────────────────────────────────────────
function ContadorMantenimiento({ mesesRestantes }) {
  if (!mesesRestantes) return null;
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-blue-50 ring-1 ring-blue-100 px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 shrink-0">
        <Icon name="shield" className="h-4 w-4 text-blue-700" />
      </div>
      <div className="min-w-0">
        <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-blue-600">
          Mantenimiento activo
        </p>
        <p className="text-[13.5px] font-extrabold text-blue-900 leading-tight">
          {mesesRestantes} meses restantes
        </p>
      </div>
    </div>
  );
}

// ── TrazabilidadCard ──────────────────────────────────────────────────────────
// Links placeholder hacia Vivero (M2) y Recolección (M1).
function TrazabilidadCard({ subcampana }) {
  const loteIds = subcampana.lotesIds || [];
  const lotes = loteIds
    .map(id => (window.LOTES_VIVERO || []).find(l => l.id === id))
    .filter(Boolean);

  return (
    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
        <Icon name="link" className="h-4 w-4 text-brand-600 shrink-0" />
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-brand-700">
          Trazabilidad del origen
        </p>
      </div>
      <div className="px-4 py-3 flex flex-col gap-2">
        {lotes.map(lote => (
          <div key={lote.id}
            className="flex items-center justify-between gap-3 rounded-xl bg-white ring-1 ring-slate-100 px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-400 mb-0.5">
                Módulo Vivero (M2)
              </p>
              <p className="text-[11.5px] font-extrabold text-slate-700 truncate">{lote.id}</p>
              <p className="text-[10px] font-bold text-slate-500">{lote.especie} · {lote.vivero}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold text-slate-500 ring-1 ring-slate-200 shrink-0">
              <Icon name="link" className="h-2.5 w-2.5" />
              próx.
            </span>
          </div>
        ))}

        <div className="flex items-center justify-between gap-3 rounded-xl bg-white ring-1 ring-slate-100 px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-slate-400 mb-0.5">
              Módulo Recolección (M1)
            </p>
            <p className="text-[11.5px] font-extrabold text-slate-700">Ver semillas de origen</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold text-slate-500 ring-1 ring-slate-200 shrink-0">
            <Icon name="link" className="h-2.5 w-2.5" />
            próx.
          </span>
        </div>
      </div>
    </div>
  );
}

// ── GaleriaFotos ──────────────────────────────────────────────────────────────
// Grilla 3 columnas con placeholders visuales (sin imágenes reales).
const _FOTO_GRADIENTS = [
  'from-brand-600 to-brand-800',
  'from-brand-500 to-brand-700',
  'from-emerald-600 to-brand-700',
  'from-brand-700 to-brand-900',
  'from-emerald-500 to-brand-600',
  'from-brand-400 to-brand-700',
];

function GaleriaFotos({ fotos, mostrarBlockchain = true }) {
  const [expanded, setExpanded] = React.useState(false);
  const visibles = expanded ? fotos : fotos.slice(0, 6);

  if (!fotos || fotos.length === 0) {
    return (
      <div className="py-10 text-center">
        <Icon name="photo" className="h-8 w-8 text-slate-200 mx-auto mb-2" />
        <p className="text-[12px] text-slate-400">Sin fotos registradas</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-1.5">
        {visibles.map((foto, i) => (
          <div key={foto.id}
            className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${_FOTO_GRADIENTS[i % _FOTO_GRADIENTS.length]} flex flex-col items-start justify-end p-2`}
            style={{ aspectRatio: '1' }}>
            <svg viewBox="0 0 60 60" className="absolute inset-0 w-full h-full opacity-15" aria-hidden="true">
              <path d="M30 8c6 6 12 10 12 18a12 12 0 0 1-24 0c0-8 6-12 12-18z" fill="white" />
              <path d="M30 26v28" stroke="white" strokeWidth="2" fill="none" />
            </svg>
            {mostrarBlockchain && foto.tieneBlockchain && (
              <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/80 ring-1 ring-white/40">
                <Icon name="link" className="h-2.5 w-2.5 text-white" />
              </div>
            )}
            {foto.tipo === 'REPOSICION' && (
              <div className="absolute top-1.5 left-1.5 flex items-center justify-center rounded-full bg-orange-400/80 px-1.5 py-0.5">
                <span className="text-[7px] font-extrabold text-white uppercase tracking-[0.08em]">repos.</span>
              </div>
            )}
            <p className="relative text-[8.5px] font-extrabold text-white/90 leading-tight">{foto.fecha}</p>
            <p className="relative text-[7.5px] font-bold text-white/70 leading-tight truncate w-full">{foto.operarioSnapshot}</p>
          </div>
        ))}
      </div>
      {fotos.length > 6 && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-2 flex w-full items-center justify-center gap-1 py-2.5 text-[10.5px] font-extrabold text-brand-600 rounded-xl bg-brand-50 hover:bg-brand-100 transition-colors">
          <Icon name={expanded ? 'chevron-down' : 'chevron-right'}
            className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Ver menos' : `Ver ${fotos.length - 6} fotos más`}
        </button>
      )}
    </div>
  );
}

// ── MiniBarrasEspecies ────────────────────────────────────────────────────────
// Composición real plantada (mixPlanificado[].plantados). Sin % planificado.
const _BARRA_COLORES = ['#1f613b', '#2e7d53', '#3d9a6b', '#4db884', '#5cd49b'];

function MiniBarrasEspecies({ subcampana }) {
  const mix = (subcampana.mixPlanificado || []).filter(m => (m.plantados || 0) > 0);
  const total = subcampana.plantados || 0;

  if (!mix.length || !total) {
    return (
      <div className="py-6 text-center">
        <Icon name="leaf" className="h-7 w-7 text-slate-200 mx-auto mb-2" />
        <p className="text-[12px] text-slate-400">Sin plantaciones registradas</p>
      </div>
    );
  }

  const sorted = [...mix].sort((a, b) => (b.plantados || 0) - (a.plantados || 0));

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((m, i) => {
        const pct = Math.round(((m.plantados || 0) / total) * 100);
        return (
          <div key={m.especie}>
            <div className="flex items-baseline justify-between mb-1">
              <div className="min-w-0 flex-1">
                <span className="text-[12px] font-extrabold text-slate-800">{m.especie}</span>
                {m.cientifico && (
                  <span className="ml-1.5 text-[9.5px] italic text-slate-400">{m.cientifico}</span>
                )}
              </div>
              <div className="flex items-baseline gap-1.5 shrink-0 ml-3">
                <span className="text-[12px] font-extrabold text-slate-700 tabular-nums">
                  {fmtMiles(m.plantados || 0)}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{pct}%</span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: _BARRA_COLORES[i % _BARRA_COLORES.length] }}
              />
            </div>
          </div>
        );
      })}
      <p className="text-[9.5px] text-slate-400">
        Composición real plantada · {fmtMiles(total)} árboles en total
      </p>
    </div>
  );
}

window.TimelineEventos       = TimelineEventos;
window.ContadorMantenimiento = ContadorMantenimiento;
window.TrazabilidadCard      = TrazabilidadCard;
window.GaleriaFotos          = GaleriaFotos;
window.MiniBarrasEspecies    = MiniBarrasEspecies;
