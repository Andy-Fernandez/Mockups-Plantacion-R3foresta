// Crear campaña — wizard de 5 pasos
// Pasos: 1·Tipo y datos · 2·Zona en mapa · 3·Especies y meta · 4·Equipo y lotes · 5·Resumen

const CC_STEPS = [
  { n: 1, label: 'Datos' },
  { n: 2, label: 'Zona' },
  { n: 3, label: 'Especies' },
  { n: 4, label: 'Equipo' },
  { n: 5, label: 'Final' },
];

const CC_TITLES = {
  1: 'Datos de la campaña',
  2: 'Define la zona',
  3: 'Especies y meta',
  4: 'Asigna equipo y lotes',
  5: 'Revisa y publica',
};

function CCHeader({ paso, onBack }) {
  return (
    <header className="relative overflow-hidden rounded-b-3xl bg-brand-700 text-white shadow-soft">
      <img src="assets/hero-canopy.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-700/90 via-brand-700/85 to-brand-700" />
      <div className="relative px-5 pt-5 pb-4">
        <div className="flex items-center justify-between gap-2">
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition" aria-label="Volver">
            <Icon name="arrow-left" className="h-5 w-5" />
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-extrabold tracking-wide ring-1 ring-white/30">
            <Icon name="pencil" className="h-3 w-3" />
            BORRADOR
          </span>
        </div>
        <p className="mt-4 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/85">
          Nueva campaña · Paso {paso} de {CC_STEPS.length}
        </p>
        <h1 className="mt-0.5 text-[26px] font-extrabold leading-[1.1] tracking-tight">{CC_TITLES[paso]}</h1>
        <div className="mt-4 flex items-center gap-2">
          {CC_STEPS.map((s, i) => {
            const done = i + 1 < paso;
            const active = i + 1 === paso;
            return (
              <div key={s.n} className={`h-1.5 flex-1 rounded-full ${done || active ? 'bg-emerald-300' : 'bg-white/20'}`} />
            );
          })}
        </div>
      </div>
    </header>
  );
}

// ── STEP 1 · Datos ────────────────────────────────────────────────────────

function CCStepDatos({ tipo, nombre, zona, fechaInicio, fechaFin, coordinadora, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-2">Tipo de campaña</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: 'ARBORIZACION',  label: 'Arborización',  hint: 'Plantar en zona urbana',     icon: 'building' },
            { k: 'REFORESTACION', label: 'Reforestación', hint: 'Plantar en zona natural',    icon: 'trees' },
            { k: 'FORESTACION',   label: 'Forestación',   hint: 'Crear cobertura forestal',   icon: 'leaf' },
          ].map(t => {
            const isOn = t.k === tipo;
            return (
              <button key={t.k} onClick={() => onChange('tipo', t.k)}
                className={`flex flex-col items-center gap-1.5 rounded-3xl p-4 text-center shadow-soft transition ring-1 ${isOn ? 'bg-brand-600 text-white ring-brand-700' : 'bg-white text-brand-800 ring-black/5 hover:ring-brand-300'}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isOn ? 'bg-white/20' : 'bg-brand-50 text-brand-700'}`}>
                  <Icon name={t.icon} className="h-6 w-6" />
                </div>
                <p className="text-sm font-extrabold leading-tight">{t.label}</p>
                <p className={`text-[10.5px] font-semibold leading-snug ${isOn ? 'text-white/85' : 'text-slate-500'}`}>{t.hint}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5 space-y-3">
        <div>
          <label className="block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-1">Nombre</label>
          <input type="text" value={nombre} onChange={(e) => onChange('nombre', e.target.value)} placeholder="Arborización La Paz 2026"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-extrabold text-brand-800 placeholder:font-medium placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
        </div>

        <div>
          <label className="block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-1">Zona / comunidad</label>
          <input type="text" value={zona} onChange={(e) => onChange('zona', e.target.value)} placeholder="San Miguel · La Paz"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-extrabold text-brand-800 placeholder:font-medium placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-1">Inicio</label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-extrabold text-brand-800">
              <Icon name="date" className="h-4 w-4 text-slate-400" />
              {fechaInicio}
            </div>
          </div>
          <div>
            <label className="block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-1">Cierre estimado</label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-extrabold text-brand-800">
              <Icon name="date" className="h-4 w-4 text-slate-400" />
              {fechaFin}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-1">Coordinadora a cargo</label>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-[11px] font-extrabold text-brand-700">
              {coordinadora.iniciales}
            </div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-brand-800 leading-tight">{coordinadora.nombre}</p>
              <p className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">{coordinadora.rol}</p>
            </div>
            <button className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-extrabold text-brand-700 hover:bg-brand-100">Cambiar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STEP 2 · Zona en mapa ────────────────────────────────────────────────

function CCStepZona({ tieneZona, hectareas, onMarcar, onLimpiar }) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
        <p className="text-sm font-bold text-brand-700 leading-relaxed">
          Marca la zona donde se realizará la campaña. Puedes dibujar un polígono libre o cargar un archivo KML.
        </p>
      </div>

      {/* Map canvas — interactive feel */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-black/5">
        <div className="relative aspect-[4/3] w-full">
          <svg viewBox="0 0 320 240" className="absolute inset-0 h-full w-full">
            <defs>
              <pattern id="cc-topo" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="0" cy="0" r="20" fill="none" stroke="#cbd5c5" strokeWidth="0.55" opacity="0.5" />
              </pattern>
              <pattern id="cc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20h40M20 0v40" stroke="#cbd5c5" strokeWidth="0.4" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="320" height="240" fill="#eef2ed" />
            <rect width="320" height="240" fill="url(#cc-topo)" />
            <rect width="320" height="240" fill="url(#cc-grid)" />
            <path d="M0 160 Q 80 130 160 170 T 320 130" fill="none" stroke="#bcd0c6" strokeWidth="2" opacity="0.6" />
            <path d="M40 60 Q 100 30 200 50 T 300 100" fill="none" stroke="#bcd0c6" strokeWidth="1.5" opacity="0.5" />

            {tieneZona && (
              <React.Fragment>
                <path d="M55 60 L240 50 L275 130 L220 200 L80 195 L40 130 Z"
                      fill="rgba(31,97,59,0.18)" stroke="#1f613b" strokeWidth="2" strokeDasharray="5 3" />
                {/* vertex handles */}
                {[[55,60],[240,50],[275,130],[220,200],[80,195],[40,130]].map(([x,y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="6" fill="#fff" stroke="#1f613b" strokeWidth="2" />
                    <circle cx={x} cy={y} r="2" fill="#1f613b" />
                  </g>
                ))}
                {/* center label */}
                <g transform="translate(160, 130)">
                  <rect x="-30" y="-12" width="60" height="22" rx="11" fill="#fff" stroke="#1f613b" strokeWidth="1" />
                  <text x="0" y="3" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f3b23" style={{ fontFamily: 'Manrope, sans-serif' }}>{hectareas} ha</text>
                </g>
              </React.Fragment>
            )}
          </svg>

          {/* Map toolbar */}
          <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5">
            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-brand-700 shadow-soft ring-1 ring-black/5 hover:bg-brand-50"><Icon name="plus" className="h-4 w-4" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-brand-700 shadow-soft ring-1 ring-black/5 hover:bg-brand-50"><Icon name="minus" className="h-4 w-4" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-brand-700 shadow-soft ring-1 ring-black/5 hover:bg-brand-50"><Icon name="crosshair" className="h-4 w-4" /></button>
          </div>

          {/* Empty-state CTA on top */}
          {!tieneZona && (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand-700 shadow-soft ring-1 ring-black/5">
                <Icon name="pin" className="h-7 w-7" />
              </div>
              <p className="mt-2 text-sm font-extrabold text-brand-800">Aún no marcaste la zona</p>
              <p className="text-[11.5px] font-semibold text-slate-600 max-w-[240px]">Toca el mapa para empezar a dibujar el polígono de la campaña</p>
            </div>
          )}
        </div>

        {tieneZona && (
          <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 text-center">
            <div className="py-2.5">
              <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Área</p>
              <p className="text-sm font-extrabold text-brand-800 tabular-nums">{hectareas} ha</p>
            </div>
            <div className="py-2.5">
              <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Vértices</p>
              <p className="text-sm font-extrabold text-brand-800 tabular-nums">6</p>
            </div>
            <div className="py-2.5">
              <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Densidad sugerida</p>
              <p className="text-sm font-extrabold text-brand-800 tabular-nums">714/ha</p>
            </div>
          </div>
        )}
      </div>

      {tieneZona ? (
        <button onClick={onLimpiar} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-soft ring-1 ring-black/5 hover:ring-brand-300">
          <Icon name="trash" className="h-4 w-4" />
          Limpiar zona y empezar de nuevo
        </button>
      ) : (
        <button onClick={onMarcar} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-extrabold text-white shadow-soft hover:bg-brand-700">
          <Icon name="pin" className="h-4 w-4" />
          Marcar polígono ahora
        </button>
      )}
    </div>
  );
}

// ── STEP 3 · Especies y meta ─────────────────────────────────────────────

function CCStepEspecies({ meta, especies, onMeta, onTogglePct }) {
  const sumPct = especies.reduce((a, e) => a + e.pct, 0);
  const balanced = sumPct === 100;
  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-4 text-white shadow-soft">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Meta total</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            <p className="text-[44px] font-extrabold leading-none tracking-tight tabular-nums">{meta.toLocaleString('es-BO')}</p>
            <p className="text-sm font-extrabold text-white/80">árboles</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onMeta(Math.max(0, meta - 100))} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"><Icon name="minus" className="h-4 w-4" /></button>
            <button onClick={() => onMeta(meta + 100)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"><Icon name="plus" className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Mix planificado</p>
          <p className={`text-[11px] font-extrabold tabular-nums ${balanced ? 'text-emerald-700' : 'text-amber-700'}`}>
            {sumPct}% asignado {balanced ? '✓' : '· falta ' + Math.max(0, 100 - sumPct) + '%'}
          </p>
        </div>

        <div className="space-y-2">
          {especies.map(e => (
            <div key={e.especie} className="rounded-2xl bg-white px-3 py-3 shadow-soft ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-brand-800 leading-tight">{e.especie}</p>
                  <p className="text-[11px] italic text-slate-500">{e.cientifico}</p>
                  <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Vivero: <span className="text-brand-700">{e.viveroDisponible}</span> disponibles
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => onTogglePct(e.especie, Math.max(0, e.pct - 5))} className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100"><Icon name="minus" className="h-4 w-4" /></button>
                  <div className="flex w-16 flex-col items-center">
                    <p className="text-[22px] font-extrabold leading-none tabular-nums text-brand-800">{e.pct}%</p>
                  </div>
                  <button onClick={() => onTogglePct(e.especie, Math.min(100, e.pct + 5))} className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700"><Icon name="plus" className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10.5px] font-extrabold text-slate-500">
                <span>Equivale a <span className="tabular-nums text-brand-800">{Math.round(meta * e.pct / 100).toLocaleString('es-BO')}</span> árboles</span>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">{e.region}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-extrabold text-brand-700 shadow-soft ring-1 ring-black/5 hover:ring-brand-300">
          <Icon name="plus-circle" className="h-4 w-4" />
          Agregar otra especie del catálogo
        </button>
      </div>
    </div>
  );
}

window.CCHeader = CCHeader;
window.CCStepDatos = CCStepDatos;
window.CCStepZona = CCStepZona;
window.CCStepEspecies = CCStepEspecies;
window.CC_STEPS = CC_STEPS;
window.CC_TITLES = CC_TITLES;
