// Mirrors the real PWA: 5 nav tabs (Inicio · Recolección · Germinación · Plantación · Mapa)
// + a FAB floating above the nav at the right edge.
const NAV_TABS = [
  { key: 'home', label: 'Inicio', icon: 'home' },
  { key: 'recolecciones', label: 'Recolección', icon: 'leaf' },
  { key: 'vivero', label: 'Germinación', icon: 'vivero' },
  { key: 'planting', label: 'Plantación', icon: 'planting' },
  { key: 'map', label: 'Mapa', icon: 'map' },
];

const QUICK_ACTIONS = [
  { label: 'Registrar recolección', icon: 'package', target: 'recolecciones' },
  { label: 'Nuevo germinación', icon: 'vivero', target: 'vivero' },
  { label: 'Registrar plantación', icon: 'leaf', target: 'home' },
  { label: 'Actualizar CO₂', icon: 'balance', target: 'home' },
];

function BottomNav({ active, onNav }) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      {open && <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />}

      {/* Quick-actions sheet (above the nav) */}
      {open && (
        <div className="absolute inset-x-0 bottom-24 z-40 flex justify-center px-4">
          <div className="w-full max-w-md rounded-3xl bg-white text-brand-800 shadow-2xl ring-1 ring-black/5">
            <div className="flex items-center justify-between px-4 pt-4">
              <h3 className="text-sm font-semibold text-brand-800">Acciones rápidas</h3>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 text-brand-500 hover:bg-slate-100"><Icon name="x" className="h-5 w-5" /></button>
            </div>
            <div className="px-2 pb-2 pt-2 divide-y divide-slate-100">
              {QUICK_ACTIONS.map(q => (
                <button key={q.label} onClick={() => { setOpen(false); onNav(q.target); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-slate-50 active:bg-slate-100">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Icon name={q.icon} className="h-5 w-5" /></div>
                  <span className="text-sm font-semibold text-brand-800">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAB — floats above the nav, anchored to the right side of the column */}
      <button
        onClick={() => setOpen(v => !v)}
        className="absolute z-40 bottom-24 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-soft ring-4 ring-white active:scale-[0.97] transition hover:bg-brand-600"
        aria-label="Acciones rápidas"
      >
        <Icon name={open ? 'minus' : 'plus'} className="h-6 w-6" />
      </button>

      {/* Bottom nav — anchored to the bottom of the phone screen */}
      <div className="absolute inset-x-0 bottom-0 z-30 mb-3 flex justify-center pointer-events-none px-3">
        <nav className="pointer-events-auto flex w-full max-w-md items-stretch justify-between gap-1 rounded-3xl bg-brand-600 px-2 py-2 text-white shadow-2xl shadow-brand-900/30">
          {NAV_TABS.map(t => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onNav(t.key)}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-[10px] font-semibold transition ${isActive ? 'text-white' : 'text-white/70'}`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${isActive ? 'bg-white/20' : ''}`}>
                  <Icon name={t.icon} className="h-5 w-5" />
                </div>
                <span className="leading-tight">{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </React.Fragment>
  );
}
window.BottomNav = BottomNav;
