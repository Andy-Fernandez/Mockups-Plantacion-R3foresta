// Historial del lote — Vivero · R3foresta
// Mobile-first screen (max-w-md). Single scroll. The page is structured as:
//   [Hero header] → [Tabs (sticky)] → [Origen] → [Indicadores] → [Filtros]
//   → [Timeline] → [Detalle técnico colapsable]
// External state (lote variant, subetapa, audit expanded, gallery modal) is driven
// by the Tweaks panel in Historial del lote.html.

function StateChip({ label, kind = 'default', icon }) {
  // kind: default | active | finalizado | warn
  const tones = {
    default: 'bg-white/15 text-white ring-white/30',
    active:   'bg-emerald-400/25 text-white ring-emerald-200/60',
    finalizado: 'bg-white/95 text-brand-700 ring-white/80',
    warn: 'bg-amber-300/30 text-amber-100 ring-amber-200/50',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold tracking-wide ring-1 ${tones[kind]}`}>
      {icon && <Icon name={icon} className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}

function Hero({ lote }) {
  const isClosed = lote.estado === 'FINALIZADO';
  return (
    <header className="relative overflow-hidden rounded-b-3xl text-white shadow-soft">
      <img src="assets/germinacion.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-brand-700/95" />
      <div className="relative px-5 pt-6 pb-6">
        <div className="flex items-center justify-between gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition" aria-label="Volver">
            <Icon name="arrow-left" className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <StateChip label={`VIVERO · ${lote.estado}`} kind={isClosed ? 'finalizado' : 'active'} />
          </div>
        </div>

        <p className="mt-5 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/85">
          Lote {lote.codigo}
        </p>
        <h1 className="mt-1 text-[28px] font-extrabold leading-[1.05] tracking-tight">{lote.comun}</h1>
        <p className="mt-0.5 text-sm italic text-white/85">{lote.cientifico}</p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            <StateChip label={lote.vivero} icon="vivero" />
            <StateChip label={lote.subetapa} icon={SUBETAPA_ICON[lote.subetapa]} kind="warn" />
            {isClosed && (
              <StateChip
                label={lote.motivoCierre}
                kind="finalizado"
                icon={
                  lote.motivoCierre === 'DESPACHO_TOTAL' ? 'truck'
                  : lote.motivoCierre === 'PERDIDA_TOTAL' ? 'loss'
                  : 'flag'
                }
              />
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Saldo vivo</p>
            <p className="mt-0.5 text-[42px] font-extrabold leading-none tracking-tight">{lote.disponibles}</p>
            <p className="mt-0.5 text-[10px] font-bold text-white/70 uppercase tracking-wider">plantas · UNIDAD</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// Segmented control sitting on top of the hero/canvas boundary
function Tabs({ active, onChange }) {
  const tabs = [
    { key: 'resumen', label: 'Resumen' },
    { key: 'historial', label: 'Historial' },
    { key: 'evidencia', label: 'Evidencia' },
  ];
  return (
    <div className="sticky top-0 z-20 -mx-5 px-5 pt-3 pb-2 bg-[#eef2ed]/95 backdrop-blur-sm">
      <div className="flex rounded-full bg-white p-1 shadow-soft ring-1 ring-black/5">
        {tabs.map(t => {
          const isOn = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`flex-1 rounded-full px-3 py-2 text-[12px] font-extrabold tracking-wide transition ${isOn ? 'bg-brand-600 text-white shadow-soft' : 'text-brand-700 hover:bg-brand-50'}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OrigenCard({ origen }) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
      <header className="flex items-center justify-between">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">
          Origen del lote
        </p>
        <button className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-extrabold text-brand-700 hover:bg-brand-100 active:scale-[0.98] transition">
          Ver ficha
          <Icon name="chevron-right" className="h-3.5 w-3.5" />
        </button>
      </header>

      <div className="mt-2 flex items-start gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <Icon name="leaf" className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-extrabold text-brand-800 leading-tight">{origen.codigo}</p>
          <p className="text-sm font-bold text-brand-700 truncate">{origen.comunidad}</p>
          <p className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1"><Icon name="date" className="h-3.5 w-3.5 text-slate-400" />{origen.fecha}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="inline-flex items-center gap-1"><Icon name="user" className="h-3.5 w-3.5 text-slate-400" />{origen.recolector}</span>
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-emerald-50 px-3 py-2.5 ring-1 ring-emerald-100">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">Tipo material</p>
          <p className="mt-0.5 text-sm font-extrabold text-emerald-800">{origen.tipo}</p>
        </div>
        <div className="rounded-2xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Cantidad consumida</p>
          <p className="mt-0.5 text-sm font-extrabold text-brand-800">{origen.cantidad} {origen.unidad}</p>
        </div>
      </div>
    </section>
  );
}

function IndicadoresRapidos({ lote }) {
  const small = [
    { label: 'Material inicial', value: `${lote.materialInicial.valor}`, unit: lote.materialInicial.unidad, hint: 'En INICIO' },
    { label: 'Plantas vivas iniciales', value: lote.vivasIniciales.toLocaleString('es-BO'), unit: 'UNIDAD', hint: 'En EMBOLSADO' },
    { label: 'Mermas acumuladas', value: lote.mermas.toLocaleString('es-BO'), unit: 'UNIDAD', tone: 'red' },
    { label: 'Despachadas', value: lote.despachadas.toLocaleString('es-BO'), unit: 'UNIDAD', tone: 'blue' },
  ];
  return (
    <section>
      <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-2">
        Indicadores rápidos
      </p>
      {/* Hero stat: Disponibles */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-4 text-white shadow-soft">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Disponibles ahora</p>
            <p className="mt-1 text-5xl font-extrabold leading-none tracking-tight">{lote.disponibles}</p>
            <p className="mt-1 text-[11px] font-bold text-white/80">UNIDAD · saldo vivo actual</p>
          </div>
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <Icon name="balance" className="h-6 w-6" />
          </div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {small.map(s => {
          const toneText =
            s.tone === 'red' ? 'text-red-700'
            : s.tone === 'blue' ? 'text-blue-700'
            : 'text-brand-800';
          return (
            <div key={s.label} className="rounded-2xl bg-white px-3 py-2.5 shadow-soft ring-1 ring-black/5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">{s.label}</p>
              <p className={`mt-0.5 text-xl font-extrabold leading-none ${toneText}`}>{s.value}</p>
              <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {s.unit}{s.hint ? ` · ${s.hint}` : ''}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FiltersRow({ active, onChange, counts, onOpenSecondary, secondaryCount }) {
  return (
    <section>
      <div className="-mx-5 px-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-2 pb-1 pr-2">
          {FILTERS.map(f => {
            const isOn = f.key === active;
            const count = counts[f.key];
            return (
              <button
                key={f.key}
                onClick={() => onChange(f.key)}
                className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-extrabold transition ring-1 ${isOn ? 'bg-brand-600 text-white ring-brand-700 shadow-soft' : 'bg-white text-brand-700 ring-brand-100 hover:ring-brand-300'}`}
              >
                {f.label}
                {count !== undefined && (
                  <span className={`rounded-full px-1.5 py-0 text-[10px] font-extrabold ${isOn ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600'}`}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <button
        onClick={onOpenSecondary}
        className="mt-2 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-2.5 text-[12px] font-bold text-brand-700 shadow-soft ring-1 ring-black/5 hover:ring-brand-300 transition"
      >
        <span className="flex items-center gap-2">
          <Icon name="filter" className="h-4 w-4 text-brand-500" />
          Más filtros — fecha, responsable, evidencia
        </span>
        <span className="flex items-center gap-1">
          {secondaryCount > 0 && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-extrabold text-brand-700">{secondaryCount} activos</span>}
          <Icon name="chevron-right" className="h-4 w-4 text-brand-500" />
        </span>
      </button>
    </section>
  );
}

function Timeline({ events, onOpenGallery }) {
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Cronología del lote</p>
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Append-only</p>
      </div>
      <ol className="mt-3">
        {events.map((e, i) => (
          <EventCard key={e.id} event={e} isLast={i === events.length - 1} onOpenGallery={() => onOpenGallery(e)} />
        ))}
      </ol>
    </section>
  );
}

function AuditoriaSection({ open, onToggle, rows }) {
  return (
    <section className={`rounded-3xl bg-white shadow-soft ring-1 ring-black/5 transition ${open ? '' : ''}`}>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
            <Icon name="hash" className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-slate-500">Detalle técnico</p>
            <p className="text-sm font-extrabold text-brand-800">Auditoría · IDs y anclajes</p>
          </div>
        </div>
        <Icon name="chevron-down" className={`h-5 w-5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-slate-100 px-4 py-3">
          <p className="text-[11px] font-medium text-slate-500 leading-snug">
            Datos de trazabilidad para auditoría. Solo lectura.
          </p>
          <dl className="mt-3 divide-y divide-slate-100">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3 py-2">
                <dt className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-slate-500 flex-shrink-0">{k}</dt>
                <dd className="text-[11px] font-bold text-brand-800 truncate text-right font-mono" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>{v}</dd>
              </div>
            ))}
          </dl>
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-[11px] font-extrabold text-slate-700 hover:bg-slate-200 transition">
            <Icon name="report" className="h-4 w-4" />
            Exportar JSON de auditoría
          </button>
        </div>
      )}
    </section>
  );
}

function GalleryModal({ event, onClose }) {
  if (!event) return null;
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-black/85 backdrop-blur-sm">
      <header className="flex items-center justify-between px-4 pt-5 pb-3 text-white">
        <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25" aria-label="Cerrar">
          <Icon name="arrow-left" className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/80">{event.kind}</p>
          <p className="text-sm font-extrabold">{event.label}</p>
        </div>
        <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25" aria-label="Cerrar">
          <Icon name="x" className="h-5 w-5" />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto px-4 pt-1 pb-6">
        {event.fotos.length === 0 ? (
          <p className="mt-10 text-center text-sm font-bold text-white/70">Sin evidencias para este evento.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {event.fotos.map((f, i) => (
              <figure key={i} className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img src={f.url} alt={f.titulo} className="h-full w-full object-cover" />
                </div>
                <figcaption className="px-3 py-2.5 text-white">
                  <p className="text-sm font-extrabold leading-tight">{f.titulo}</p>
                  <p className="mt-0.5 text-[11px] font-bold text-white/70 uppercase tracking-wider">
                    {f.fecha} · {event.responsable || 'Sistema'}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SecondaryFiltersSheet({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-black/50 backdrop-blur-sm">
      <button className="flex-1" onClick={onClose} aria-label="Cerrar" />
      <div className="rounded-t-3xl bg-white px-5 pt-4 pb-7 shadow-2xl">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
        <h3 className="text-lg font-extrabold text-brand-800">Más filtros</h3>
        <p className="text-xs font-medium text-slate-500">Refina el historial sin perder el contexto.</p>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-1.5">Rango de fechas</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
                <p className="text-[10px] font-bold text-slate-500">Desde</p>
                <p className="text-sm font-extrabold text-brand-800">22 oct 2026</p>
              </div>
              <div className="rounded-2xl bg-white px-3 py-2.5 ring-1 ring-slate-200">
                <p className="text-[10px] font-bold text-slate-500">Hasta</p>
                <p className="text-sm font-extrabold text-brand-800">Hoy</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-1.5">Responsable</p>
            <div className="flex flex-wrap gap-1.5">
              {['Todos', 'Camila Rojas', 'Pedro Mamani', 'Luz Sánchez'].map((r, i) => (
                <button key={r} className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold ring-1 transition ${i === 0 ? 'bg-brand-600 text-white ring-brand-700' : 'bg-white text-brand-700 ring-brand-100'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-1.5">Evidencia</p>
            <div className="flex gap-2">
              {['Cualquiera', 'Con foto', 'Sin foto'].map((r, i) => (
                <button key={r} className={`flex-1 rounded-2xl px-3 py-2 text-[12px] font-extrabold ring-1 transition ${i === 1 ? 'bg-brand-600 text-white ring-brand-700' : 'bg-white text-brand-700 ring-brand-100'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-200">
            Limpiar
          </button>
          <button onClick={onClose} className="flex-[2] rounded-2xl bg-brand-600 px-4 py-3 text-sm font-extrabold text-white shadow-soft hover:bg-brand-700">
            Aplicar (3)
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main composition ───────────────────────────────────────────────────────

function HistorialScreen({ variant, audit, openGallery, openFilters, onCloseGallery, onCloseFilters, onOpenGallery, onOpenFilters, onToggleAudit, initialTab }) {
  const [activeTab, setActiveTab] = React.useState(initialTab || 'resumen');
  React.useEffect(() => { if (initialTab) setActiveTab(initialTab); }, [initialTab]);
  const [filter, setFilter] = React.useState('TODOS');

  const lote = LOTE_VARIANTS[variant] || LOTE_VARIANTS.ACTIVO;

  // Compose timeline based on variant.
  const events = React.useMemo(() => {
    const base = [...BASE_EVENTS];
    if (lote.estado === 'FINALIZADO') {
      // Tweak data slightly to reflect motivo de cierre.
      if (lote.motivoCierre === 'PERDIDA_TOTAL') {
        // Replace despacho with massive merma
        const idx = base.findIndex(e => e.kind === 'DESPACHO');
        if (idx >= 0) {
          base[idx] = {
            id: 'evt-6b', kind: 'MERMA', label: 'Merma masiva por plaga',
            fecha: '20 feb 2027', hora: '14:00',
            responsable: 'Pedro Mamani',
            causa: 'PLAGA', cantidad: 420,
            saldoAntes: 420, saldoDespues: 0,
            observacion: 'Infestación severa detectada. Pérdida total del lote restante.',
            fotos: [
              { url: 'assets/plantacion.jpg', titulo: 'Daño por plaga', fecha: '20 feb 2027' },
              { url: 'assets/germinacion.jpg', titulo: 'Detalle hojas', fecha: '20 feb 2027' },
            ],
          };
        }
      } else if (lote.motivoCierre === 'MIXTO') {
        // Add an extra small merma + keep despacho.
        base.push({
          id: 'evt-6c', kind: 'MERMA', label: 'Merma final',
          fecha: '15 feb 2027', hora: '10:30',
          responsable: 'Luz Sánchez',
          causa: 'MUERTE_NATURAL', cantidad: 100,
          saldoAntes: 320, saldoDespues: 220,
          observacion: 'Plantas debilitadas no aptas para despacho.',
          fotos: [{ url: 'assets/germinacion.jpg', titulo: 'Plantas descartadas', fecha: '15 feb 2027' }],
        });
        base.push({
          id: 'evt-6d', kind: 'DESPACHO', label: 'Despacho final',
          fecha: '24 feb 2027', hora: '06:00',
          responsable: 'Camila Rojas',
          destino: 'DONACION_COMUNIDAD',
          referencia: 'DSP-2027-019',
          comunidad: 'Comunidad San Antonio',
          cantidad: 220, saldoAntes: 220, saldoDespues: 0,
          observacion: 'Donación a la comunidad vecina. Cierre del lote.',
          fotos: [{ url: 'assets/plantacion.jpg', titulo: 'Entrega', fecha: '24 feb 2027' }],
        });
      } else {
        // DESPACHO_TOTAL: bump first despacho to full remaining
        const idx = base.findIndex(e => e.kind === 'DESPACHO');
        if (idx >= 0) {
          base[idx] = {
            ...base[idx],
            cantidad: 420,
            saldoAntes: 420,
            saldoDespues: 0,
            observacion: 'Despacho total a plantación. Cierra el lote.',
          };
        }
      }
      base.push(CIERRE_BY_MOTIVO[lote.motivoCierre]);
    }
    return base;
  }, [variant, lote.estado, lote.motivoCierre]);

  // Filter counts (always reflect raw timeline).
  const counts = React.useMemo(() => {
    const c = { TODOS: events.length };
    for (const e of events) c[e.kind] = (c[e.kind] || 0) + 1;
    return c;
  }, [events]);

  const filtered = filter === 'TODOS' ? events : events.filter(e => e.kind === filter);

  return (
    <div data-screen-label="Historial del lote" className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-32">
        <Hero lote={lote} />

        <div className="px-5 space-y-4">
          <Tabs active={activeTab} onChange={setActiveTab} />

          {activeTab === 'historial' && (
            <React.Fragment>
              <OrigenCard origen={ORIGEN} />

              <IndicadoresRapidos lote={lote} />

              <FiltersRow
                active={filter}
                onChange={setFilter}
                counts={counts}
                onOpenSecondary={onOpenFilters}
                secondaryCount={3}
              />

              <Timeline events={filtered} onOpenGallery={onOpenGallery} />

              <AuditoriaSection open={audit} onToggle={onToggleAudit} rows={AUDIT_ROWS} />

              <p className="text-center text-[11px] font-bold text-slate-400 pt-2">
                Eventos append-only · {lote.evidenciasTotal} evidencias asociadas
              </p>
            </React.Fragment>
          )}

          {activeTab === 'resumen' && (
            <ResumenView
              lote={lote}
              events={events}
              audit={audit}
              onToggleAudit={onToggleAudit}
              onJumpHistorial={() => setActiveTab('historial')}
            />
          )}

          {activeTab === 'evidencia' && (
            <EvidenciaPlaceholder />
          )}
        </div>
      </div>

      <GalleryModal event={openGallery} onClose={onCloseGallery} />
      <SecondaryFiltersSheet open={openFilters} onClose={onCloseFilters} />
    </div>
  );
}

window.HistorialScreen = HistorialScreen;
Object.assign(window, {
  Hero, Tabs, OrigenCard, IndicadoresRapidos,
  FiltersRow, Timeline, AuditoriaSection,
  GalleryModal, SecondaryFiltersSheet, StateChip,
});
