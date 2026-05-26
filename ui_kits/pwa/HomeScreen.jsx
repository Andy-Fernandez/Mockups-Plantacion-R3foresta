const HOME_HERO = { title: 'Trazabilidad viva', subtitle: 'Monitorea cada fase y mantiene la sincronización al día.', badge: '82% sincronizado', image: '../../assets/hero-canopy.jpg' };
const HOME_METRICS = [
  { label: 'Plantaciones activas', value: '12', helper: 'en 4 fincas' },
  { label: 'Listos para trasplantar', value: '120', helper: 'Semana 48' },
  { label: 'CO₂ estimado', value: '20,6 T', helper: '+1,4 T este mes' },
  { label: 'Superficie monitoreada', value: '86 ha', helper: 'Satélite al día' },
];
const HOME_SECTIONS = [
  { label: 'Recolección', target: 'recolecciones', image: '../../assets/germinacion.jpg', stat: '24 lotes', detail: 'Último ingreso hace 1h' },
  { label: 'Germinación', target: 'vivero', image: '../../assets/germinacion.jpg', stat: '120 plántulas', detail: '78% con riego hoy' },
  { label: 'Plantación', target: 'home', image: '../../assets/plantacion.jpg', stat: '3 predios activos', detail: '42% de meta semanal' },
  { label: 'CO₂', target: 'home', image: '../../assets/co2.jpg', stat: '20,6 T capturadas', detail: 'Actualizado cada 24h' },
];
const HOME_RECENT = [
  { title: 'Trasplante programado', time: '09:30', meta: 'Lote Alto Verde · 36 plántulas' },
  { title: 'Riego completado', time: '08:10', meta: 'Germinación · Sector B' },
  { title: 'Captura de CO₂', time: 'Ayer', meta: '+0,3 T estimadas' },
];
const HOME_OPERATIVE_SHORTCUTS = [
  { label: 'Reportar mortandad', href: '../../Reportar%20mortandad.html', icon: 'loss', detail: 'Foto + GPS + causa obligatoria', tone: 'from-red-500/90 to-orange-500/85' },
  { label: 'Registrar reposición', href: '../../Registrar%20reposicion.html', icon: 'refresh', detail: 'Solo lotes con propósito REPOSICION', tone: 'from-orange-500/90 to-amber-500/85' },
];

function HomeScreen({ onNav, profileIncomplete }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-5 pb-32 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="rounded-full bg-white/90 p-2 shadow-sm hover:shadow-soft" aria-label="Menú">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-brand-700"><path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-500">Panel</p>
            <div className="text-2xl font-semibold tracking-tight text-brand-700">R3foresta</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full bg-white/90 p-2 shadow-sm hover:shadow-soft" aria-label="Notificaciones"><Icon name="bell" className="h-5 w-5 text-brand-700" /></button>
          <button onClick={() => onNav('profile')} className="relative rounded-full bg-white/90 p-2 shadow-sm hover:shadow-soft" aria-label="Perfil">
            <Icon name="user" className="h-5 w-5 text-brand-700" />
            {profileIncomplete && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 border-2 border-white"></span>}
          </button>
        </div>
      </header>

      <section className="mt-4">
        <div className="relative overflow-hidden rounded-3xl bg-brand-700 text-white shadow-soft">
          <img src={HOME_HERO.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-700/90 via-brand-700/70 to-brand-500/30" />
          <div className="relative p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-white/70">Seguimiento</p>
            <h1 className="mt-1 text-2xl font-semibold leading-tight">{HOME_HERO.title}</h1>
            <p className="mt-2 text-sm text-white/85">{HOME_HERO.subtitle}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              <Icon name="dot" className="h-3 w-3 text-emerald-200" />
              <span>{HOME_HERO.badge}</span>
            </div>
          </div>
        </div>
      </section>

      {profileIncomplete && (
        <section className="mt-4">
          <button className="w-full flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm font-medium text-amber-800 shadow-soft hover:bg-amber-100 transition">
            <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-200 text-amber-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            </span>
            <div className="flex flex-col text-left">
              <span className="font-semibold">Perfil incompleto</span>
              <span className="text-xs font-normal text-amber-600">Necesitas completar tu perfil para acceder a todas las funcionalidades de la aplicación.</span>
            </div>
            <span className="ml-auto mt-1"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></span>
          </button>
        </section>
      )}

      <section className="mt-4">
        <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-brand-700 shadow-soft">
          <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Icon name="dot" className="h-3 w-3 text-brand-600" />
          </span>
          <div className="flex flex-col">
            <span>Elementos pendientes de sincronización</span>
            <span className="text-xs font-normal text-brand-500">6 registros se cargarán cuando haya señal estable.</span>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-brand-700">Accesos operativos</h2>
          <span className="text-xs text-brand-500">Mantenimiento</span>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3">
          {HOME_OPERATIVE_SHORTCUTS.map((item) => (
            <button
              key={item.label}
              onClick={() => { window.location.href = item.href; }}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.tone} p-4 text-left text-white shadow-soft transition active:scale-[0.99]`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_42%)]" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/75">Captura crítica</p>
                  <h3 className="mt-1 text-lg font-semibold leading-tight">{item.label}</h3>
                  <p className="mt-2 text-xs font-medium text-white/85">{item.detail}</p>
                </div>
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <Icon name={item.icon} className="h-5 w-5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-brand-700">Indicadores clave</h2>
          <span className="text-xs text-brand-500">Actualizado hace 12 min</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {HOME_METRICS.map(m => (
            <div key={m.label} className="rounded-2xl bg-white px-4 py-4 text-brand-700 shadow-soft">
              <div className="text-xl font-semibold leading-tight">{m.value}</div>
              <p className="mt-1 text-sm font-medium text-brand-600">{m.label}</p>
              <p className="mt-1 text-xs text-brand-500">{m.helper}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-brand-700">Fases en progreso</h2>
          <button className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 shadow-soft">Ver mapa</button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4">
          {HOME_SECTIONS.map(s => (
            <button key={s.label} onClick={() => onNav(s.target)} className="group relative h-44 overflow-hidden rounded-2xl text-left shadow-soft active:scale-[0.99] transition">
              <img src={s.image} alt={s.label} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="relative flex h-full flex-col justify-between p-4 text-white">
                <div className="inline-flex w-fit items-center rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold">{s.stat}</div>
                <div>
                  <h3 className="text-lg font-semibold leading-tight">{s.label}</h3>
                  <p className="mt-1 text-xs text-white/80">{s.detail}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-7 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-brand-700">Actividad reciente</h2>
          <span className="text-xs text-brand-500">Hoy</span>
        </div>
        <div className="mt-3 space-y-3">
          {HOME_RECENT.map(r => (
            <div key={r.title} className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-soft">
              <div className="flex h-10 w-12 flex-col items-center justify-center rounded-xl bg-brand-100 text-[11px] font-semibold text-brand-700">{r.time}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-brand-700">{r.title}</p>
                <p className="text-xs text-brand-500">{r.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
window.HomeScreen = HomeScreen;
