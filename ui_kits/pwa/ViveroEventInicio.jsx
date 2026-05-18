// Vivero event — "Inicio de lote" — 5-step wizard (single scrollable form).
// Each step is a card. Header shows progress (N/5 LISTOS) with a segmented bar.
function ViveroEventInicio({ onNav }) {
  const [fecha, setFecha] = React.useState('2026-05-13');
  const [vivero] = React.useState({ name: 'Vivero Achumani', code: 'VIV-001', loc: 'Achumani / Zona Sur — Zona Sur' });
  const [origen] = React.useState({ name: 'Achachairú', code: 'REC-2026-057', date: '16 abr 2026', saldo: 1999, tipo: 'SEMILLA' });
  const [cantidad, setCantidad] = React.useState(1599.2);
  const [fotos, setFotos] = React.useState([{ id: 1, url: '../../assets/germinacion.jpg' }]);
  const [obs, setObs] = React.useState('');

  const pct = Math.min(100, Math.round((cantidad / origen.saldo) * 100));
  const setShortcut = (p) => setCantidad(Math.round((origen.saldo * p / 100) * 10) / 10);
  const completedSteps = [true, true, true, cantidad > 0, fotos.length > 0];
  const done = completedSteps.filter(Boolean).length;

  const Step = ({ n, title, sub, done, badge, children }) => (
    <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
      <header className="flex items-start gap-3">
        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${done ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
          {done ? <Icon name="check" className="h-5 w-5" /> : <span className="text-sm font-extrabold">{n}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-500">Paso {n} · 5</p>
          <h3 className="text-lg font-extrabold text-brand-800 leading-tight">{title}</h3>
          {sub && <p className="text-xs font-medium text-slate-500 mt-0.5">{sub}</p>}
        </div>
        {badge && <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200 flex-shrink-0">{badge}</span>}
      </header>
      <div className="mt-3">{children}</div>
    </section>
  );

  return (
    <div className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-32">

        <header className="sticky top-0 z-20 bg-[#eef2ed] px-5 pt-6 pb-3">
          <div className="flex items-start gap-3">
            <button onClick={() => onNav('viveroDetail')} className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-soft hover:bg-slate-50 transition" aria-label="Volver">
              <Icon name="arrow-left" className="h-5 w-5 text-brand-700" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-500">Nuevo lote · Vivero</p>
              <h1 className="text-2xl font-extrabold text-brand-800 leading-tight">Inicio de lote</h1>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-extrabold text-brand-800 leading-none">{done}/5</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-500 mt-1">Listos</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-1.5">
            {completedSteps.map((c, i) => (
              <div key={i} className={`h-1.5 rounded-full ${c ? 'bg-brand-500' : 'bg-slate-300'}`} />
            ))}
          </div>
        </header>

        <div className="space-y-3 px-5 pt-2">

          {/* PASO 1 — Fecha */}
          <Step n={1} title="Fecha de inicio" sub="Entre 03/05/2026 y 13/05/2026." done={true}>
            <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
              <Icon name="date" className="h-5 w-5 text-brand-500" />
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full border-none bg-transparent text-base font-bold text-brand-700 outline-none" />
            </label>
          </Step>

          {/* PASO 2 — Vivero */}
          <Step n={2} title="Vivero operativo" sub="Dónde se siembra este lote." done={true}>
            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-brand-800 truncate">{vivero.name}</p>
                  <p className="text-xs font-bold text-brand-500">{vivero.code}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                    <Icon name="pin" className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">{vivero.loc}</span>
                  </p>
                </div>
                <button className="flex-shrink-0 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-bold text-brand-600 hover:bg-brand-50 transition">Cambiar</button>
              </div>
            </div>
          </Step>

          {/* PASO 3 — Recolección origen */}
          <Step n={3} title="Recolección origen" sub="Origen validado con saldo disponible." done={true} badge="Lista">
            <div className="rounded-2xl bg-brand-50/60 p-3 ring-1 ring-brand-100">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-brand-800 truncate">{origen.name}</p>
                  <p className="text-xs font-bold text-brand-600">#{origen.code} · {origen.date}</p>
                </div>
                <button className="flex-shrink-0 rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50 transition">Quitar</button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-brand-100">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-500">Saldo</p>
                  <p className="text-base font-extrabold text-brand-800 mt-0.5">{origen.saldo.toLocaleString('es-BO')} gr</p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2 ring-1 ring-brand-100">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-500">Tipo</p>
                  <p className="text-base font-extrabold text-brand-800 mt-0.5">{origen.tipo}</p>
                </div>
              </div>
            </div>
          </Step>

          {/* PASO 4 — Cantidad inicial */}
          <Step n={4} title="Cantidad inicial" done={cantidad > 0}>
            <div className="rounded-2xl bg-gradient-to-br from-brand-50/70 to-white p-4 ring-1 ring-brand-100">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-500">Cantidad inicial en proceso</p>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <input type="number" step="0.1" value={cantidad} onChange={e => setCantidad(parseFloat(e.target.value) || 0)} className="w-full bg-transparent text-[40px] font-extrabold leading-none text-brand-800 outline-none tracking-tight" />
                <span className="text-base font-bold text-slate-500">gr</span>
              </div>
              <p className="mt-1 text-xs font-medium text-slate-500">Máximo 1 decimal.</p>
            </div>

            <div className="mt-3 px-1">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-bold text-brand-700">Usando {pct}% del saldo</span>
                <span className="font-bold text-brand-700">{cantidad} / {origen.saldo} gr</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-500 mb-2">Atajos rápidos</p>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 80, 100].map(p => (
                  <button key={p} onClick={() => setShortcut(p)} className={`rounded-2xl border bg-white px-2 py-2.5 text-sm font-extrabold transition ${pct === p ? 'border-brand-500 text-brand-700 ring-2 ring-brand-200' : 'border-slate-200 text-brand-700 hover:border-brand-300'}`}>
                    {p}%
                  </button>
                ))}
              </div>
            </div>
          </Step>

          {/* PASO 5 — Evidencia obligatoria */}
          <Step n={5} title="Evidencia obligatoria" sub="Adjunta entre 1 y 5 fotos del inicio del lote." done={fotos.length > 0} badge={`${fotos.length}/5`}>
            {fotos.length === 0 ? (
              <button className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/30 py-7 transition hover:bg-brand-50">
                <Icon name="photo" className="h-7 w-7 text-brand-500" />
                <span className="text-sm font-extrabold text-brand-700">Añadir fotos</span>
                <span className="text-[10px] font-medium text-slate-500">JPG o PNG · hasta 5 archivos · 5 MB c/u</span>
              </button>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {fotos.map(f => (
                  <div key={f.id} className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-black/5">
                    <img src={f.url} alt="" className="h-full w-full object-cover" />
                    <button onClick={() => setFotos(fotos.filter(x => x.id !== f.id))} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-soft hover:bg-red-600">
                      <Icon name="x" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {fotos.length < 5 && (
                  <button onClick={() => setFotos([...fotos, { id: Date.now(), url: '../../assets/plantacion.jpg' }])} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/30 text-brand-600 hover:bg-brand-50 transition">
                    <Icon name="plus" className="h-5 w-5" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">Añadir</span>
                  </button>
                )}
              </div>
            )}
          </Step>

          {/* Observaciones */}
          <section className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="report" className="h-5 w-5 text-brand-500" />
                <h3 className="text-base font-extrabold text-brand-800">Observaciones</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Opcional</span>
            </header>
            <textarea
              value={obs}
              onChange={e => setObs(e.target.value.slice(0, 500))}
              placeholder="Notas adicionales del inicio del lote…"
              rows={3}
              className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-brand-700 placeholder:text-slate-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
            <p className="mt-1 text-right text-[11px] font-bold text-slate-400">{obs.length}/500</p>
          </section>

          {/* CTA */}
          <div className="sticky bottom-24 mt-2 pt-2">
            {done === 5 ? (
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-4 text-base font-extrabold text-white shadow-soft hover:bg-brand-600 active:scale-[0.99] transition">
                <Icon name="check" className="h-5 w-5" />
                Registrar inicio de lote
              </button>
            ) : (
              <div className="rounded-full bg-white px-4 py-3 text-center text-sm font-bold text-brand-700 shadow-soft ring-1 ring-black/5">
                Falta {5 - done} paso{5 - done > 1 ? 's' : ''} por completar.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
window.ViveroEventInicio = ViveroEventInicio;
