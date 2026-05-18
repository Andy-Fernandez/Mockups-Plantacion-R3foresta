const LOTES_VIVERO = [
  { codigo: 'V-2046', especie: 'Schinopsis brasiliensis', comun: 'Soto', vivas: 956, total: 1240, estado: 'ACTIVO', fase: 'EMBOLSADO', material: 'SEMILLA', ingreso: '12 oct 2026', adapt: 94, img: '../../assets/germinacion.jpg' },
  { codigo: 'V-2045', especie: 'Anadenanthera colubrina', comun: 'Curupaú', vivas: 720, total: 800, estado: 'ACTIVO', fase: 'ADAPTABILIDAD', material: 'SEMILLA', ingreso: '03 oct 2026', adapt: 90, img: '../../assets/plantacion.jpg' },
  { codigo: 'V-2044', especie: 'Tabebuia impetiginosa', comun: 'Tajibo', vivas: 312, total: 360, estado: 'ACTIVO', fase: 'INICIO', material: 'ESQUEJE', ingreso: '28 sep 2026', adapt: 86, img: '../../assets/co2.jpg' },
  { codigo: 'V-2042', especie: 'Cedrela fissilis', comun: 'Cedro', vivas: 0, total: 410, estado: 'FINALIZADO', fase: 'DESPACHO', material: 'SEMILLA', ingreso: '15 ago 2026', adapt: 100, img: '../../assets/germinacion.jpg' },
];

const FASE_TONE = {
  INICIO: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  EMBOLSADO: 'bg-brand-50 text-brand-700 ring-brand-200',
  ADAPTABILIDAD: 'bg-amber-50 text-amber-800 ring-amber-200',
  MERMA: 'bg-red-50 text-red-700 ring-red-200',
  DESPACHO: 'bg-blue-50 text-blue-700 ring-blue-200',
};
const ESTADO_TONE = {
  ACTIVO: 'bg-green-100 text-green-800',
  FINALIZADO: 'bg-slate-200 text-slate-600',
};

function ViveroListScreen({ onNav, onOpen }) {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const items = LOTES_VIVERO.filter(l =>
    (filter === 'all' || (filter === 'activos' && l.estado === 'ACTIVO') || (filter === 'finalizados' && l.estado === 'FINALIZADO')) &&
    (!query || (l.codigo + l.especie + l.comun).toLowerCase().includes(query.toLowerCase()))
  );
  return (
    <div className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-32">
        <header className="mb-3 rounded-b-3xl bg-[#0f8351] px-5 pb-12 pt-8 text-white shadow-soft">
          <div className="flex items-center gap-3">
            <button onClick={() => onNav('home')} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition" aria-label="Volver"><Icon name="arrow-left" className="h-5 w-5" /></button>
            <h1 className="flex-1 text-2xl font-extrabold leading-tight">Vivero</h1>
            <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition" aria-label="Nuevo lote"><Icon name="plus" className="h-5 w-5" /></button>
          </div>
          <p className="mt-1.5 ml-12 text-xs font-medium text-white/85">{items.length} lotes en seguimiento</p>
        </header>

        <div className="-mt-10 space-y-3 px-5">
          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-500 shadow-soft ring-1 ring-black/5">
            <Icon name="search" className="h-5 w-5 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Código, especie, fase" type="search" className="w-full min-w-0 border-none bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:font-medium placeholder:text-slate-400" />
          </label>

          <div className="flex gap-2">
            {[['all','Todos'],['activos','Activos'],['finalizados','Finalizados']].map(([k,l]) => (
              <button key={k} onClick={() => setFilter(k)} className={`flex-1 rounded-full border px-2 py-1.5 text-xs font-semibold transition ${filter === k ? 'border-brand-500 bg-brand-500 text-white shadow-soft' : 'border-brand-100 bg-white text-brand-600 hover:border-brand-300'}`}>{l}</button>
            ))}
          </div>

          <div className="space-y-3 pt-1">
            {items.map(l => {
              const pct = Math.round((l.vivas / l.total) * 100);
              return (
                <button key={l.codigo} onClick={() => onOpen(l)} className="w-full text-left">
                  <div className="rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5 active:scale-[0.99] transition">
                    <div className="flex gap-3">
                      <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${l.img})` }} />
                      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-brand-700">Lote {l.codigo}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ESTADO_TONE[l.estado]}`}>{l.estado}</span>
                        </div>
                        <p className="text-xs italic text-slate-500 truncate">{l.especie}</p>
                        <p className="text-xs font-semibold text-slate-600 truncate">{l.comun} · ingreso {l.ingreso}</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${FASE_TONE[l.fase]}`}>{l.fase}</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">{l.material}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2.5">
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-brand-500">Plantas vivas</span>
                          <span className="text-[11px] font-bold text-brand-700">{l.vivas.toLocaleString('es-BO')} / {l.total.toLocaleString('es-BO')}</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-brand-500">Adapt.</span>
                        <span className="text-sm font-extrabold text-brand-700 leading-none mt-0.5">{l.adapt}%</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            {items.length === 0 && (
              <div className="rounded-3xl bg-white px-4 py-8 text-center shadow-soft ring-1 ring-black/5">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100"><Icon name="vivero" className="h-8 w-8 text-slate-400" /></div>
                <p className="text-base font-bold text-slate-700">No hay lotes</p>
                <p className="mt-1 text-sm font-medium text-slate-500">No hay coincidencias con la búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
window.ViveroListScreen = ViveroListScreen;
