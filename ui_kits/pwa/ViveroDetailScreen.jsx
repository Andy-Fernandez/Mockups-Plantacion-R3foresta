const VIVERO_EVENTS = [
  { kind: 'INICIO', label: 'Inicio del lote', when: '12 oct 2026 · 08:42', author: 'Camila R.', body: 'Ingreso al vivero · 1 240 unidades · sustrato A.', photo: '../../assets/germinacion.jpg' },
  { kind: 'EMBOLSADO', label: 'Embolsado', when: '24 oct 2026 · 15:10', author: 'Pedro M.', body: '980 bolsas etiquetadas. Riego inicial completado.' },
  { kind: 'ADAPTABILIDAD', label: 'Adaptabilidad', when: '02 nov 2026 · 09:00', author: 'Luz S.', body: '94% supervivencia tras una semana en sombra parcial.' },
  { kind: 'MERMA', label: 'Merma registrada', when: '05 nov 2026 · 11:25', author: 'Pedro M.', body: '24 unidades descartadas por estrés hídrico.' },
];

const EVENT_TONE = {
  INICIO: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  EMBOLSADO: 'bg-brand-50 text-brand-700 ring-brand-200',
  ADAPTABILIDAD: 'bg-amber-50 text-amber-800 ring-amber-200',
  MERMA: 'bg-red-50 text-red-700 ring-red-200',
  DESPACHO: 'bg-blue-50 text-blue-700 ring-blue-200',
};

function ViveroDetailScreen({ onNav, lote }) {
  const codigo = lote?.codigo ?? 'V-2046';
  const especie = lote?.especie ?? 'Schinopsis brasiliensis';
  const comun = lote?.comun ?? 'Soto';
  return (
    <div className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-32">
        <header className="relative overflow-hidden rounded-b-3xl text-white shadow-soft">
          <img src="../../assets/germinacion.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-brand-700/90" />
          <div className="relative px-5 pt-8 pb-7">
            <div className="flex items-center gap-2">
              <button onClick={() => onNav('recolecciones')} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition" aria-label="Volver"><Icon name="arrow-left" className="h-5 w-5" /></button>
              <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wide">VIVERO · ACTIVO</span>
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-white/85">Lote {codigo}</p>
            <h1 className="mt-1 text-3xl font-extrabold leading-tight">{comun}</h1>
            <p className="mt-1 text-sm italic text-white/90">{especie}</p>
          </div>
        </header>

        <div className="-mt-6 space-y-4 px-5">
          <div className="grid grid-cols-3 gap-2">
            {[['Plantas vivas','956','UNIDAD'],['Adaptabilidad','94%','7d'],['Merma','24','UNIDAD']].map(([l,v,u]) => (
              <div key={l} className="rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-brand-500 font-bold">{l}</p>
                <p className="mt-1 text-lg font-extrabold text-brand-700 leading-none">{v}</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-1">{u}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-brand-700">Eventos del lote</h2>
              <span className="text-[10px] uppercase tracking-[0.18em] text-brand-500 font-bold">Append-only</span>
            </div>

            <ol className="mt-3 space-y-3">
              {VIVERO_EVENTS.map((e, i) => (
                <li key={i} className="relative pl-7">
                  <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-brand-500" />
                  {i < VIVERO_EVENTS.length - 1 && <span className="absolute left-[11px] top-4 bottom-0 w-px bg-slate-200" />}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ring-1 ${EVENT_TONE[e.kind] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>{e.kind}</span>
                    <span className="text-[11px] font-semibold text-slate-500">{e.when}</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-brand-700">{e.label}</p>
                  <p className="text-xs text-slate-600 leading-snug">{e.body}</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">{e.author}</p>
                  {e.photo && <div className="mt-2 h-20 w-32 rounded-lg bg-cover bg-center ring-1 ring-black/5" style={{ backgroundImage: `url(${e.photo})` }} />}
                </li>
              ))}
            </ol>

            <button className="mt-4 w-full rounded-2xl bg-brand-600 px-4 py-3 text-sm font-extrabold text-white shadow-soft hover:bg-brand-700 active:scale-[0.99] transition" onClick={() => onNav('viveroInicio')}>
              Registrar evento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
window.ViveroDetailScreen = ViveroDetailScreen;
