// Resumen del lote — "vista por defecto" del detalle de un lote de vivero.
// Lo que el operario necesita en 10 segundos:
//   ¿Está sano? — supervivencia, vivas/iniciales, tendencia de mermas
//   ¿Qué hago hoy? — próximos pasos accionables (solo ACTIVO)
//   ¿Qué pasó? — cronología por subetapa + últimos eventos
//   ¿Cómo cerró? — resumen de cierre (solo FINALIZADO)

// ─────────────────────────────────────────────────────────────
// Datos derivados
// ─────────────────────────────────────────────────────────────

function deriveSalud(lote, events) {
  // Material en G no entra en cuenta de "supervivencia" — eso vive en INICIO.
  // Las vivas iniciales nacen en EMBOLSADO.
  const vivasIniciales = lote.vivasIniciales;
  const mermas = lote.mermas;
  const despachadas = lote.despachadas;
  const disponibles = lote.disponibles;
  const supervivencia = vivasIniciales > 0
    ? Math.round(((vivasIniciales - mermas) / vivasIniciales) * 100)
    : 0;

  // Hoy simulado: 22 ene 2027 (sirve como ancla coherente con los datos mock).
  const hoy = lote.estado === 'FINALIZADO' ? new Date('2027-02-24') : new Date('2027-01-22');
  const inicio = new Date('2026-10-22');
  const diasEnVivero = Math.round((hoy - inicio) / (1000 * 60 * 60 * 24));

  // Última merma
  const lastMerma = [...events].reverse().find(e => e.kind === 'MERMA');
  let diasDesdeMerma = null;
  if (lastMerma) {
    // Parse "DD mmm YYYY" — coarsely
    const meses = { ene:0, feb:1, mar:2, abr:3, may:4, jun:5, jul:6, ago:7, sep:8, oct:9, nov:10, dic:11 };
    const [d, m, y] = lastMerma.fecha.split(' ');
    const dt = new Date(parseInt(y), meses[m], parseInt(d));
    diasDesdeMerma = Math.round((hoy - dt) / (1000 * 60 * 60 * 24));
  }

  return { vivasIniciales, mermas, despachadas, disponibles, supervivencia, diasEnVivero, diasDesdeMerma };
}

// Subetapa breakdown — coarse from the timeline. SOMBRA por defecto al inicio del EMBOLSADO.
function deriveSubetapas(lote, events) {
  // EMBOLSADO empieza en sombra siempre.
  const meses = { ene:0, feb:1, mar:2, abr:3, may:4, jun:5, jul:6, ago:7, sep:8, oct:9, nov:10, dic:11 };
  const parse = (s) => { const [d, m, y] = s.split(' '); return new Date(parseInt(y), meses[m], parseInt(d)); };

  const embolsado = events.find(e => e.kind === 'EMBOLSADO');
  if (!embolsado) return null;
  const startSombra = parse(embolsado.fecha);
  const adapt = events.filter(e => e.kind === 'ADAPTABILIDAD');
  const cierre = events.find(e => e.kind === 'CIERRE_AUTOMATICO');
  const hoy = cierre ? parse(cierre.fecha) : (lote.estado === 'FINALIZADO' ? new Date('2027-02-24') : new Date('2027-01-22'));

  // Sequence: SOMBRA → (adapt1) → MEDIA_SOMBRA → (adapt2) → SOL_DIRECTO → (today/cierre)
  const segments = [];
  let cursor = startSombra;
  let current = 'SOMBRA';
  for (const a of adapt) {
    const end = parse(a.fecha);
    segments.push({ subetapa: current, days: Math.max(1, Math.round((end - cursor) / (1000*60*60*24))) });
    cursor = end;
    current = a.subetapaDestino;
  }
  segments.push({ subetapa: current, days: Math.max(0, Math.round((hoy - cursor) / (1000*60*60*24))), ongoing: !cierre });

  const total = segments.reduce((s, x) => s + x.days, 0) || 1;
  return { segments, total, current };
}

// Próximos pasos demo — en producción vendrían del backend (cron, scheduling, etc.)
function deriveProximosPasos(lote) {
  if (lote.estado === 'FINALIZADO') return [];
  return [
    {
      id: 'p1',
      titulo: 'Inspección semanal',
      sub: 'Revisar estado fitosanitario y registrar evidencia.',
      due: 'Vence hoy',
      tone: 'urgent',
      icon: 'shield',
    },
    {
      id: 'p2',
      titulo: 'Riego matutino programado',
      sub: 'Sector A · cobertura completa · 5 min por bandeja.',
      due: 'Mañana 06:00',
      tone: 'pending',
      icon: 'date',
    },
    {
      id: 'p3',
      titulo: 'Despacho parcial a PLT-2027-005',
      sub: '180 unidades · Comunidad Charagua · plantación propia.',
      due: 'En 12 días',
      tone: 'future',
      icon: 'truck',
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// Subcomponentes
// ─────────────────────────────────────────────────────────────

function SaludCard({ salud, lote }) {
  const total = salud.vivasIniciales || 1;
  const seg = (n) => `${(n / total) * 100}%`;
  return (
    <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Salud del lote</p>
          <h3 className="mt-0.5 text-base font-extrabold text-brand-800">Supervivencia y composición actual</h3>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">En vivero</p>
          <p className="text-xl font-extrabold text-brand-800 leading-none mt-0.5">{salud.diasEnVivero}<span className="text-sm font-bold text-slate-500 ml-0.5">días</span></p>
        </div>
      </header>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Supervivencia</p>
          <p className="text-5xl font-extrabold text-brand-700 leading-none tracking-tight">{salud.supervivencia}%</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">Vivas hoy</p>
          <p className="text-2xl font-extrabold text-brand-800 leading-none">
            {(salud.vivasIniciales - salud.mermas).toLocaleString('es-BO')}
            <span className="text-sm font-bold text-slate-400"> / {salud.vivasIniciales.toLocaleString('es-BO')}</span>
          </p>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full ring-1 ring-black/5 bg-slate-100">
        {salud.disponibles > 0 && <div className="bg-brand-500" style={{ width: seg(salud.disponibles) }} title={`Disponibles ${salud.disponibles}`} />}
        {salud.despachadas > 0 && <div className="bg-blue-500" style={{ width: seg(salud.despachadas) }} title={`Despachadas ${salud.despachadas}`} />}
        {salud.mermas > 0 && <div className="bg-red-500" style={{ width: seg(salud.mermas) }} title={`Mermas ${salud.mermas}`} />}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><span className="h-2 w-2 rounded-full bg-brand-500" /><span className="text-brand-700">Disponibles · {salud.disponibles}</span></span>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><span className="h-2 w-2 rounded-full bg-blue-500" /><span className="text-blue-700">Despachadas · {salud.despachadas}</span></span>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><span className="h-2 w-2 rounded-full bg-red-500" /><span className="text-red-700">Mermas · {salud.mermas}</span></span>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-xl bg-brand-50 px-3 py-2 ring-1 ring-brand-100">
        <Icon name="info" className="h-3.5 w-3.5 mt-0.5 text-brand-600 flex-shrink-0" />
        <p className="text-[11px] font-bold text-brand-700 leading-snug">
          {salud.diasDesdeMerma !== null
            ? <>Última merma hace <span className="text-brand-800 font-extrabold">{salud.diasDesdeMerma} días</span>. Subetapa actual: <span className="text-brand-800 font-extrabold">{lote.subetapa}</span>.</>
            : <>Sin mermas registradas hasta hoy.</>
          }
        </p>
      </div>
    </section>
  );
}

function CierreCard({ lote, events, salud }) {
  const cierre = events.find(e => e.kind === 'CIERRE_AUTOMATICO');
  const motivoIcon =
    lote.motivoCierre === 'DESPACHO_TOTAL' ? 'truck'
    : lote.motivoCierre === 'PERDIDA_TOTAL' ? 'loss'
    : 'flag';
  const motivoTone =
    lote.motivoCierre === 'DESPACHO_TOTAL' ? 'blue'
    : lote.motivoCierre === 'PERDIDA_TOTAL' ? 'red'
    : 'amber';
  const toneBg = {
    blue: 'bg-blue-50 ring-blue-200 text-blue-700',
    red: 'bg-red-50 ring-red-200 text-red-700',
    amber: 'bg-amber-50 ring-amber-200 text-amber-800',
  }[motivoTone];

  return (
    <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
      <header className="flex items-center justify-between">
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-slate-500">Cierre del lote</p>
        <span className="rounded-full bg-slate-700 text-white px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide">FINALIZADO</span>
      </header>

      <div className={`mt-2 flex items-center gap-3 rounded-2xl ${toneBg} ring-1 px-3 py-3`}>
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-soft`}>
          <Icon name={motivoIcon} className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] opacity-80">Motivo</p>
          <p className="text-base font-extrabold leading-tight">{MOTIVO_CIERRE_LABEL[lote.motivoCierre]}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mt-0.5">{lote.motivoCierre}</p>
        </div>
        {cierre && (
          <div className="text-right">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] opacity-80">Cerrado</p>
            <p className="text-xs font-extrabold">{cierre.fecha}</p>
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Días activo</p>
          <p className="mt-0.5 text-lg font-extrabold text-brand-800 leading-none">{salud.diasEnVivero}</p>
        </div>
        <div className="rounded-2xl bg-blue-50 px-3 py-2.5 ring-1 ring-blue-100">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-700">Despachadas</p>
          <p className="mt-0.5 text-lg font-extrabold text-blue-700 leading-none">{lote.despachadas}</p>
        </div>
        <div className="rounded-2xl bg-red-50 px-3 py-2.5 ring-1 ring-red-100">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-red-700">Pérdidas</p>
          <p className="mt-0.5 text-lg font-extrabold text-red-700 leading-none">{lote.mermas}</p>
        </div>
      </div>

      {lote.motivoCierre !== 'PERDIDA_TOTAL' && (
        <button className="mt-3 flex w-full items-center justify-between rounded-2xl bg-brand-50 px-4 py-3 text-left ring-1 ring-brand-100 hover:bg-brand-100 transition">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-700 ring-1 ring-brand-100">
              <Icon name="planting" className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-500">Continúa en</p>
              <p className="text-sm font-extrabold text-brand-800">Plantación PLT-2027-003</p>
            </div>
          </div>
          <Icon name="chevron-right" className="h-4 w-4 text-brand-500" />
        </button>
      )}
    </section>
  );
}

function ProximosPasos({ pasos }) {
  if (pasos.length === 0) return null;
  return (
    <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Próximos pasos</p>
          <h3 className="mt-0.5 text-base font-extrabold text-brand-800">
            {pasos.length} acción{pasos.length === 1 ? '' : 'es'} pendiente{pasos.length === 1 ? '' : 's'}
          </h3>
        </div>
        <button className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-extrabold text-brand-700 hover:bg-brand-100">Ver todas</button>
      </header>

      <ul className="mt-3 divide-y divide-slate-100">
        {pasos.map(p => {
          const dueTone = p.tone === 'urgent'
            ? 'bg-red-50 text-red-700 ring-red-200'
            : p.tone === 'pending'
              ? 'bg-amber-50 text-amber-800 ring-amber-200'
              : 'bg-slate-100 text-slate-700 ring-slate-200';
          const markerTone = p.tone === 'urgent'
            ? 'bg-red-500'
            : p.tone === 'pending'
              ? 'bg-amber-500'
              : 'bg-slate-400';
          return (
            <li key={p.id}>
              <button className="flex w-full items-start gap-3 py-3 text-left hover:bg-slate-50 -mx-2 px-2 rounded-xl transition">
                <span className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-slate-200">
                  <span className={`h-3 w-3 rounded-full ${markerTone}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-brand-800 leading-tight">{p.titulo}</p>
                  <p className="mt-0.5 text-[11.5px] font-medium text-slate-500 leading-snug">{p.sub}</p>
                </div>
                <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ring-1 ${dueTone}`}>{p.due}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function QuickActions({ lote }) {
  const closed = lote.estado === 'FINALIZADO';
  const actions = [
    { key: 'merma', label: 'Merma', icon: 'loss' },
    { key: 'adapt', label: 'Subetapa', icon: 'sun' },
    { key: 'despacho', label: 'Despacho', icon: 'truck' },
    { key: 'foto', label: 'Evidencia', icon: 'photo' },
  ];
  if (closed) {
    return (
      <section className="rounded-3xl bg-slate-50 p-4 shadow-soft ring-1 ring-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-slate-600 ring-1 ring-slate-200">
            <Icon name="shield" className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-slate-700">Lote finalizado</p>
            <p className="text-[11px] font-medium text-slate-500">No admite nuevos eventos operativos.</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section>
      <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-2">Acciones rápidas</p>
      <div className="grid grid-cols-4 gap-2">
        {actions.map(a => (
          <button
            key={a.key}
            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white px-2 py-3 shadow-soft ring-1 ring-black/5 hover:ring-brand-300 active:scale-[0.97] transition"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon name={a.icon} className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-extrabold text-brand-700">{a.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SubetapasBar({ data }) {
  if (!data) return null;
  const SUBETAPA_BAR = {
    SOMBRA: 'bg-amber-300',
    MEDIA_SOMBRA: 'bg-amber-400',
    SOL_DIRECTO: 'bg-amber-500',
  };
  return (
    <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Tiempo en subetapas</p>
          <h3 className="mt-0.5 text-base font-extrabold text-brand-800">Recorrido de adaptabilidad</h3>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">Total {data.total}d</p>
      </header>

      {/* Stacked timeline */}
      <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-black/5">
        {data.segments.map((s, i) => (
          <div key={i} className={SUBETAPA_BAR[s.subetapa] || 'bg-slate-300'} style={{ width: `${(s.days / data.total) * 100}%` }} />
        ))}
      </div>

      <ul className="mt-3 space-y-2">
        {data.segments.map((s, i) => (
          <li key={i} className="flex items-center gap-2.5">
            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-amber-200 text-amber-700`}>
              <Icon name={SUBETAPA_ICON[s.subetapa]} className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-extrabold text-brand-800 truncate">{SUBETAPA_LABEL[s.subetapa]}</p>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={SUBETAPA_BAR[s.subetapa]} style={{ width: `${(s.days / data.total) * 100}%` }} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-brand-800 leading-none">{s.days}<span className="text-[11px] font-bold text-slate-500">d</span></p>
              {s.ongoing && <p className="text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-amber-700 mt-0.5">Actual</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function UltimosEventos({ events, onJumpHistorial }) {
  const recent = [...events].reverse().slice(0, 3);
  return (
    <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Últimos eventos</p>
          <h3 className="mt-0.5 text-base font-extrabold text-brand-800">Cronología reciente</h3>
        </div>
        <button onClick={onJumpHistorial} className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-extrabold text-brand-700 hover:bg-brand-100">
          Ver historial
          <Icon name="chevron-right" className="h-3 w-3" />
        </button>
      </header>

      <ul className="mt-3 space-y-2.5">
        {recent.map(e => {
          const theme = EVENT_THEME[e.kind];
          let detail = '';
          if (e.kind === 'EMBOLSADO') detail = `${e.saldoDespues} vivas iniciales`;
          else if (e.kind === 'ADAPTABILIDAD') detail = `→ ${e.subetapaDestino}`;
          else if (e.kind === 'MERMA') detail = `−${e.cantidad} · ${CAUSA_MERMA_LABEL[e.causa]}`;
          else if (e.kind === 'DESPACHO') detail = `${e.cantidad} → ${DESTINO_LABEL[e.destino]}`;
          else if (e.kind === 'INICIO') detail = e.fields?.[0]?.value || '';
          else if (e.kind === 'CIERRE_AUTOMATICO') detail = MOTIVO_CIERRE_LABEL[e.motivo];

          return (
            <li key={e.id} className="flex items-center gap-2.5">
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-soft ring-1 ${theme.ring} text-${theme.tone}-700`}>
                <Icon name={theme.icon} className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-extrabold ring-1 ${theme.chip}`}>{e.kind}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{e.fecha}</span>
                </div>
                <p className="mt-0.5 text-[12.5px] font-extrabold text-brand-800 truncate leading-tight">{e.label}</p>
                {detail && <p className="text-[11px] font-medium text-slate-500 truncate">{detail}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────────────────────

function ResumenView({ lote, events, audit, onToggleAudit, onJumpHistorial }) {
  const salud = React.useMemo(() => deriveSalud(lote, events), [lote, events]);
  const subetapas = React.useMemo(() => deriveSubetapas(lote, events), [lote, events]);
  const pasos = React.useMemo(() => deriveProximosPasos(lote), [lote]);
  const isClosed = lote.estado === 'FINALIZADO';

  return (
    <React.Fragment>
      {isClosed
        ? <CierreCard lote={lote} events={events} salud={salud} />
        : <SaludCard salud={salud} lote={lote} />
      }

      {!isClosed && <ProximosPasos pasos={pasos} />}

      <QuickActions lote={lote} />

      <OrigenCard origen={ORIGEN} />

      <IndicadoresRapidos lote={lote} />

      <SubetapasBar data={subetapas} />

      <UltimosEventos events={events} onJumpHistorial={onJumpHistorial} />

      <AuditoriaSection open={audit} onToggle={onToggleAudit} rows={AUDIT_ROWS} />

      <p className="text-center text-[11px] font-bold text-slate-400 pt-2">
        Eventos append-only · {lote.evidenciasTotal} evidencias asociadas
      </p>
    </React.Fragment>
  );
}

function EvidenciaPlaceholder() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon name="photo" className="h-7 w-7" />
      </div>
      <h3 className="mt-3 text-base font-extrabold text-brand-800">Galería de evidencias</h3>
      <p className="mt-1 text-[12.5px] font-medium text-slate-500 leading-snug">
        Próxima iteración. Aquí irán las fotos agrupadas por evento, con miniaturas y filtros por fecha.
      </p>
    </section>
  );
}

Object.assign(window, { ResumenView, EvidenciaPlaceholder });
