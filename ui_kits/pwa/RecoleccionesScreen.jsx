const RECOLECCIONES = [
  { id: 'r1', codigo: 'R-2046', especie: 'Schinopsis brasiliensis', comun: 'Soto', material: 'SEMILLA', estado: 'VALIDADO', cantidad: '2,4 kg', semillas: '1 240', fecha: '03 nov 2026', autor: 'Camila Rojas', img: '../../assets/germinacion.jpg' },
  { id: 'r2', codigo: 'R-2045', especie: 'Anadenanthera colubrina', comun: 'Curupaú', material: 'SEMILLA', estado: 'PENDIENTE_VALIDACION', cantidad: '1,8 kg', semillas: '920', fecha: '03 nov 2026', autor: 'Pedro Mamani', img: '../../assets/plantacion.jpg' },
  { id: 'r3', codigo: 'R-2044', especie: 'Tabebuia impetiginosa', comun: 'Tajibo', material: 'ESQUEJE', estado: 'BORRADOR', cantidad: '46 u', semillas: '—', fecha: '02 nov 2026', autor: 'Luz Soliz', img: '../../assets/co2.jpg' },
  { id: 'r4', codigo: 'R-2043', especie: 'Cedrela fissilis', comun: 'Cedro', material: 'SEMILLA', estado: 'RECHAZADO', cantidad: '0,9 kg', semillas: '410', fecha: '01 nov 2026', autor: 'Camila Rojas', img: '../../assets/germinacion.jpg' },
];

const MATERIAL_PILL = {
  SEMILLA: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  ESQUEJE: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
};
const STATE_PILL = {
  VALIDADO: 'bg-green-100 text-green-800',
  PENDIENTE_VALIDACION: 'bg-amber-100 text-amber-800',
  BORRADOR: 'bg-slate-100 text-slate-700',
  RECHAZADO: 'bg-red-100 text-red-800',
};

function RecoleccionesScreen({ onNav, onOpen }) {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const items = RECOLECCIONES.filter(r =>
    (filter === 'all' || r.material === filter) &&
    (!query || (r.codigo + r.especie + r.comun).toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-32">
        <header className="mb-3 rounded-b-3xl bg-[#0f8351] px-5 pb-12 pt-8 text-white shadow-soft">
          <div className="flex items-center gap-3">
            <button onClick={() => onNav('home')} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition" aria-label="Volver"><Icon name="arrow-left" className="h-5 w-5" /></button>
            <h1 className="flex-1 text-2xl font-extrabold leading-tight truncate">Recolecciones</h1>
            <button className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-amber-900 hover:bg-amber-300 active:scale-[0.95] transition" aria-label="Validar">
              <Icon name="check" className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1.5 ml-12 text-xs font-medium text-white/85">{items.length} registros encontrados</p>
        </header>

        <div className="-mt-10 space-y-3 px-5">
          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-500 shadow-soft ring-1 ring-black/5">
            <Icon name="search" className="h-5 w-5 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Código, especie, ubicación" type="search" className="w-full min-w-0 border-none bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:font-medium placeholder:text-slate-400" />
          </label>

          <div className="flex gap-2">
            {[['all','Todos'],['SEMILLA','Semilla'],['ESQUEJE','Esqueje']].map(([k,l]) => (
              <button key={k} onClick={() => setFilter(k)} className={`flex-1 rounded-full border px-2 py-1.5 text-xs font-semibold transition ${filter === k ? 'border-brand-500 bg-brand-500 text-white shadow-soft' : 'border-brand-100 bg-white text-brand-600 hover:border-brand-300'}`}>{l}</button>
            ))}
          </div>

          <div className="space-y-3">
            {items.map(r => (
              <button key={r.id} onClick={() => onOpen(r)} className="w-full text-left">
                <div className="flex gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5">
                  <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${r.img})` }} />
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-brand-700">Lote {r.codigo}</p>
                      <span className="text-[11px] text-slate-400">{r.fecha}</span>
                    </div>
                    <p className="text-xs italic text-slate-500 truncate">{r.especie}</p>
                    <p className="text-xs font-semibold text-slate-600">{r.comun} · {r.cantidad} · {r.semillas} sem.</p>
                    <p className="text-[11px] font-medium text-slate-400">{r.autor}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${MATERIAL_PILL[r.material]}`}>{r.material}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATE_PILL[r.estado]}`}>{r.estado}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
            {items.length === 0 && (
              <div className="rounded-3xl bg-white px-4 py-8 text-center shadow-soft ring-1 ring-black/5">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100"><Icon name="package" className="h-8 w-8 text-slate-400" /></div>
                <p className="text-base font-bold text-slate-700">No hay recolecciones</p>
                <p className="mt-1 text-sm font-medium text-slate-500">No hay coincidencias con la búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
window.RecoleccionesScreen = RecoleccionesScreen;
