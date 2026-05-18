// Crear campaña — wizard de 5 pasos
// Pasos: 1·Tipo y datos · 2·Zona en mapa · 3·Especies y meta · 4·Equipo y lotes · 5·Resumen

const CC_STEPS = [
  { n: 1, label: 'Zona' },
  { n: 2, label: 'Especies' },
  { n: 3, label: 'Lotes' },
  { n: 4, label: 'Equipo' },
  { n: 5, label: 'Final' },
];

const CC_TITLES = {
  1: 'Define la zona',
  2: 'Especies y meta',
  3: 'Plantas y lotes',
  4: 'Asigna equipo',
  5: 'Revisa y publica',
};

const SUBCAMPANA_COORDINADORES = PERSONAS.filter((p) => p.rol.toLowerCase().includes('coordin'));

function formatSubcampanaDate(value) {
  if (!value) return 'Pendiente';
  const [year, month, day] = value.split('-');
  const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${day} ${monthNames[Number(month) - 1]} ${year}`;
}

function getSubcampanaIssues(subcampana, generalRange) {
  if (!subcampana) return [];
  const issues = [];
  if (!subcampana.coordinadorId) issues.push('Sin coordinador');
  if (!subcampana.fechaInicio || !subcampana.fechaFin) {
    issues.push('Fechas pendientes');
    return issues;
  }
  if (subcampana.fechaInicio > subcampana.fechaFin) issues.push('Inicio mayor que cierre');
  if (generalRange) {
    if (subcampana.fechaInicio < generalRange.inicioISO || subcampana.fechaFin > generalRange.finISO) {
      issues.push('Fuera del rango de campaña');
    }
  }
  return issues;
}

function formatSubcampanaRange(subcampana) {
  if (!subcampana?.fechaInicio || !subcampana?.fechaFin) return 'Pendientes';
  return `${formatSubcampanaDate(subcampana.fechaInicio)} → ${formatSubcampanaDate(subcampana.fechaFin)}`;
}

function CCHeader({ paso, onBack, subcampanaNombre }) {
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
          Sub-campaña activa · Paso {paso} de {CC_STEPS.length}
        </p>
        <h1 className="mt-0.5 text-[26px] font-extrabold leading-[1.1] tracking-tight">{CC_TITLES[paso]}</h1>
        {subcampanaNombre && (
          <p className="mt-1 text-[12px] font-semibold text-white/80 leading-snug">
            {subcampanaNombre}
          </p>
        )}
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

function SubcampanaContextCard({
  campanaNombre,
  subcampana,
  generalFechaInicio,
  generalFechaFin,
  generalRange,
  onCoordinadorChange,
  onFechaChange,
}) {
  if (!subcampana) return null;
  const issues = getSubcampanaIssues(subcampana, generalRange);
  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Sub-campaña activa</p>
          <p className="mt-1 text-[17px] font-extrabold leading-tight text-brand-800">{subcampana.comunidadNombre}</p>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{campanaNombre}</p>
        </div>
        <SubcampanaStatusBadge estado={subcampana.estado} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2">
        <div className="rounded-2xl bg-[#f8fbf7] px-3 py-2.5">
          <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Coordinador</p>
          <select
            value={subcampana.coordinadorId || ''}
            onChange={(e) => onCoordinadorChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-brand-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100">
            <option value="">Seleccionar coordinador</option>
            {SUBCAMPANA_COORDINADORES.map((persona) => (
              <option key={persona.id} value={persona.id}>{persona.nombre}</option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl bg-[#f8fbf7] px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Fechas</p>
            <p className="text-[10px] font-bold text-slate-500">{generalFechaInicio} → {generalFechaFin}</p>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              type="date"
              value={subcampana.fechaInicio || ''}
              min={generalRange?.inicioISO}
              max={generalRange?.finISO}
              onChange={(e) => onFechaChange('fechaInicio', e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-brand-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <input
              type="date"
              value={subcampana.fechaFin || ''}
              min={generalRange?.inicioISO}
              max={generalRange?.finISO}
              onChange={(e) => onFechaChange('fechaFin', e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-brand-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <p className="mt-2 text-[10.5px] font-semibold text-slate-500">
            Rango seleccionado: {formatSubcampanaRange(subcampana)}
          </p>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-3 py-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-amber-700">Pendientes de esta sub-campaña</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {issues.map((issue) => (
              <span key={issue} className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-amber-700 ring-1 ring-amber-100">
                {issue}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CGHeader({ onBack }) {
  return (
    <header className="relative overflow-hidden rounded-b-3xl bg-brand-700 text-white shadow-soft">
      <img src="assets/hero-canopy.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-700/90 via-brand-700/85 to-brand-700" />
      <div className="relative px-5 pt-5 pb-5">
        <div className="flex items-center justify-between gap-2">
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition" aria-label="Volver">
            <Icon name="arrow-left" className="h-5 w-5" />
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-extrabold tracking-wide ring-1 ring-white/30">
            <Icon name="layers" className="h-3 w-3" />
            CAMPAÑA PARAGUAS
          </span>
        </div>
        <p className="mt-4 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/85">
          Inicio del flujo
        </p>
        <h1 className="mt-0.5 text-[26px] font-extrabold leading-[1.1] tracking-tight">Campaña general</h1>
        <p className="mt-1 text-[13px] font-medium text-white/80 leading-snug">
          Completa los datos principales.
        </p>
      </div>
    </header>
  );
}

function CrearCampanaGeneralScreen({
  tipo,
  nombre,
  organizacion,
  descripcion,
  fechaInicio,
  fechaFin,
  onChange,
  onContinue,
  onBack,
}) {
  const canContinue = tipo && nombre.trim().length > 2 && organizacion.trim().length > 2;

  return (
    <div data-screen-label="Campaña general" className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-4">
        <CGHeader onBack={onBack} />

        <div className="px-5 pt-4 space-y-4 flex-1">
          <CCStepDatos
            tipo={tipo}
            nombre={nombre}
            organizacion={organizacion}
            descripcion={descripcion}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
            onChange={onChange}
          />
        </div>

        <div className="px-5">
          <div className="sticky bottom-0 -mx-5 px-5 pt-3 pb-5 bg-gradient-to-t from-[#eef2ed] via-[#eef2ed]/95 to-transparent">
            <button
              onClick={onContinue}
              disabled={!canContinue}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-base font-extrabold text-white shadow-soft transition active:scale-[0.99]
                ${!canContinue ? 'bg-slate-400/70 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}>
              Guardar y continuar
              <Icon name="chevron-right" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubcampanaStatusBadge({ estado }) {
  const tone = {
    PENDIENTE: 'bg-amber-50 text-amber-700 ring-amber-100',
    EN_CONFIGURACION: 'bg-blue-50 text-blue-700 ring-blue-100',
    CONFIGURADA: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    ACTIVA: 'bg-brand-50 text-brand-700 ring-brand-100',
  }[estado] || 'bg-slate-50 text-slate-600 ring-slate-200';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[9.5px] font-extrabold uppercase tracking-[0.14em] ring-1 ${tone}`}>
      {estado.replace('_', ' ')}
    </span>
  );
}

function GestionSubcampanasScreen({
  tipo,
  nombre,
  organizacion,
  fechaInicio,
  fechaFin,
  fechaInicioISO,
  fechaFinISO,
  subcampanas,
  comunidadesDisponibles,
  comunidadQuery,
  pickerOpen,
  onComunidadQuery,
  onTogglePicker,
  onAddSubcampana,
  onConfigurar,
  onBack,
}) {
  const query = comunidadQuery.trim().toLowerCase();
  const comunidadesAgregadas = new Set(subcampanas.map((s) => s.comunidadId));
  const resultados = query.length < 2
    ? []
    : comunidadesDisponibles.filter((c) =>
        !comunidadesAgregadas.has(c.id) &&
        (c.nombre.toLowerCase().includes(query) || c.municipio.toLowerCase().includes(query) || c.perfil.toLowerCase().includes(query))
      ).slice(0, 6);

  return (
    <div data-screen-label="Subcampañas" className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-4">
        <header className="relative overflow-hidden rounded-b-3xl bg-brand-700 text-white shadow-soft">
          <img src="assets/hero-canopy.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-700/90 via-brand-700/85 to-brand-700" />
          <div className="relative px-5 pt-5 pb-5">
            <div className="flex items-center justify-between gap-2">
              <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition" aria-label="Volver">
                <Icon name="arrow-left" className="h-5 w-5" />
              </button>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-extrabold tracking-wide ring-1 ring-white/30">
                <Icon name="map" className="h-3 w-3" />
                SUB-CAMPAÑAS
              </span>
            </div>
            <p className="mt-4 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/85">
              Campaña general creada
            </p>
            <h1 className="mt-0.5 text-[26px] font-extrabold leading-[1.1] tracking-tight">{nombre}</h1>
            <p className="mt-1 text-[13px] font-medium text-white/80 leading-snug">
              Agrega comunidades una por una. Cada una se convertirá en una sub-campaña con configuración propia.
            </p>
          </div>
        </header>

        <div className="px-5 pt-4 space-y-4 flex-1">
          <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
            <div className="flex items-center gap-2 flex-wrap">
              <TipoBadge tipo={tipo} />
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-extrabold text-brand-700 ring-1 ring-brand-100">
                {subcampanas.length} sub-campaña{subcampanas.length === 1 ? '' : 's'}
              </span>
            </div>
            <p className="mt-2 text-sm font-extrabold text-brand-800">{organizacion}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{fechaInicio} → {fechaFin}</p>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Agregar comunidad</p>
                <p className="text-[11px] font-semibold text-slate-500">Cada comunidad tendrá su propio coordinador, fechas y configuración técnica.</p>
              </div>
              <button onClick={onTogglePicker} className="flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-[11px] font-extrabold text-white hover:bg-brand-700">
                <Icon name={pickerOpen ? 'minus' : 'plus'} className="h-3.5 w-3.5" />
                {pickerOpen ? 'Cerrar' : 'Agregar'}
              </button>
            </div>

            {pickerOpen && (
              <div className="space-y-2">
                <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Icon name="search" className="h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={comunidadQuery}
                      onChange={(e) => onComunidadQuery(e.target.value)}
                      placeholder="Buscar comunidad por nombre o municipio"
                      className="w-full bg-transparent text-sm font-semibold text-brand-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {query.length < 2 ? (
                  <div className="rounded-2xl border border-dashed border-brand-100 bg-[#f8fbf7] px-3 py-3">
                    <p className="text-sm font-extrabold text-brand-800">Escribe para buscar</p>
                    <p className="mt-0.5 text-[10.5px] font-semibold text-slate-500">Usaremos este selector para poblar la lista de sub-campañas.</p>
                  </div>
                ) : resultados.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3">
                    <p className="text-sm font-extrabold text-brand-800">Sin coincidencias</p>
                    <p className="mt-0.5 text-[10.5px] font-semibold text-slate-500">Prueba con otro nombre o municipio.</p>
                  </div>
                ) : (
                  resultados.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onAddSubcampana(c)}
                      className="flex w-full items-start gap-3 rounded-2xl bg-[#f8fbf7] px-3 py-3 text-left shadow-soft ring-1 ring-brand-100 transition hover:ring-brand-300">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                        <Icon name="pin" className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold leading-tight text-brand-800">{c.nombre}</p>
                        <p className="text-[10.5px] font-semibold text-slate-500">{c.municipio} · {c.perfil}</p>
                      </div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Icon name="plus" className="h-4 w-4" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {subcampanas.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-brand-100 bg-white px-5 py-8 text-center shadow-soft">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <Icon name="map" className="h-7 w-7" />
              </div>
              <p className="mt-3 text-base font-extrabold text-brand-800">Aún no hay sub-campañas</p>
              <p className="mt-1 text-[11.5px] font-semibold leading-relaxed text-slate-500">
                Agrega una comunidad para crear la primera card en estado pendiente.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {subcampanas.map((s, index) => {
                const issues = getSubcampanaIssues(s, { inicioISO: fechaInicioISO, finISO: fechaFinISO });
                return (
                <div key={s.id} className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Sub-campaña {index + 1}</p>
                      <p className="mt-1 text-[16px] font-extrabold leading-tight text-brand-800">{s.comunidadNombre}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{s.municipio}</p>
                    </div>
                    <SubcampanaStatusBadge estado={s.estado} />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-[#f8fbf7] px-3 py-2.5">
                      <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Progreso</p>
                      <p className="mt-1 text-sm font-extrabold text-brand-800">{s.progresoPaso}/5 pasos</p>
                    </div>
                    <div className="rounded-2xl bg-[#f8fbf7] px-3 py-2.5">
                      <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Coordinador</p>
                      <p className="mt-1 text-sm font-extrabold text-brand-800">{s.coordinador || 'Pendiente'}</p>
                    </div>
                  </div>

                  <div className="mt-2 rounded-2xl bg-[#f8fbf7] px-3 py-2.5">
                    <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Fechas</p>
                    <p className="mt-1 text-sm font-extrabold text-brand-800">{formatSubcampanaRange(s)}</p>
                  </div>

                  {issues.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {issues.map((issue) => (
                        <span key={issue} className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold text-amber-700 ring-1 ring-amber-100">
                          {issue}
                        </span>
                      ))}
                    </div>
                  )}

                  <button onClick={() => onConfigurar(s.id)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-extrabold text-white shadow-soft hover:bg-brand-700">
                    {s.estado === 'PENDIENTE' ? 'Configurar sub-campaña' : 'Continuar configuración'}
                    <Icon name="chevron-right" className="h-4 w-4" />
                  </button>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── STEP 1 · Datos ────────────────────────────────────────────────────────

function CCStepDatos({
  tipo,
  nombre,
  organizacion,
  descripcion,
  fechaInicio,
  fechaFin,
  onChange,
}) {
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
          <label className="block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-1">Organización asociada</label>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
            <Icon name="briefcase" className="h-4 w-4 text-slate-400" />
            <input type="text" value={organizacion} onChange={(e) => onChange('organizacion', e.target.value)} placeholder="Fundación R3foresta"
              className="w-full bg-transparent text-sm font-extrabold text-brand-800 placeholder:font-medium placeholder:text-slate-400 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500 mb-1">Descripción</label>
          <textarea value={descripcion} onChange={(e) => onChange('descripcion', e.target.value)} rows={3} placeholder="Objetivo de la campaña"
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-brand-800 placeholder:font-medium placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100" />
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
