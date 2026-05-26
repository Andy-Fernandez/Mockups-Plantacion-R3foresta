const REPOSICION_STEPS = [
  { n: 1, label: 'Subcampaña' },
  { n: 2, label: 'Grupo origen' },
  { n: 3, label: 'Pre-check' },
  { n: 4, label: 'Foto + GPS' },
  { n: 5, label: 'Especies' },
  { n: 6, label: 'Lotes' },
  { n: 7, label: 'Equipo' },
  { n: 8, label: 'Confirmar' },
];

function reposicionTitle(paso) {
  return [
    '',
    'Elige la sub-campaña',
    'Selecciona el grupo origen',
    'Valida el pendiente',
    'Captura evidencia',
    'Define cantidades',
    'Revisa los lotes',
    'Co-responsables',
    'Confirma la reposición',
  ][paso];
}

function reposicionBadge(sub) {
  if (sub?.fase === 'MONITOREO_HISTORICO') {
    return {
      label: 'REPOSICIÓN HISTÓRICA',
      tone: 'bg-slate-100 text-slate-700 ring-slate-200',
      heroTone: 'from-slate-700 to-slate-800',
    };
  }
  return {
    label: 'REPOSICIÓN',
    tone: 'bg-orange-50 text-orange-800 ring-orange-100',
    heroTone: 'from-orange-500 to-amber-500',
  };
}

function reposicionGpsStatus(gps) {
  return {
    capturado: {
      tone: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
      icon: 'check-circle',
      label: 'GPS dentro del polígono',
      detail: `${fmtCoords(GPS_FIX.lat, GPS_FIX.lng)} · tolerancia ${GPS_TOLERANCIA_METROS} m`,
    },
    capturando: {
      tone: 'bg-amber-50 text-amber-800 ring-amber-200',
      icon: 'crosshair',
      label: 'Activando GPS…',
      detail: 'Esperando precisión suficiente',
    },
    'sin-senal': {
      tone: 'bg-red-50 text-red-700 ring-red-200',
      icon: 'alert',
      label: 'Sin señal GPS',
      detail: 'Sin GPS válido no se puede continuar',
    },
    'fuera-poligono': {
      tone: 'bg-red-50 text-red-700 ring-red-200',
      icon: 'alert',
      label: 'GPS fuera del polígono',
      detail: `Bloqueado · el punto quedó a 68 m del polígono (${GPS_TOLERANCIA_METROS} m máx.)`,
    },
  }[gps];
}

function reposicionTotal(especies) {
  return (especies || []).reduce((acc, item) => acc + (item.cantidad || 0), 0);
}

function reposicionAllocationOk(especies, subcampaniaId) {
  const lotes = lotesReposicionDeSubcampania(subcampaniaId);
  return (especies || []).every((item) => {
    const lotesItem = item.lotes || [];
    const totalLotes = lotesItem.reduce((acc, lote) => acc + (lote.cantidad || 0), 0);
    if (item.cantidad === 0) return totalLotes === 0;
    if (totalLotes !== (item.cantidad || 0)) return false;
    return lotesItem.every((loteUso) => {
      const lote = lotes.find((candidate) => candidate.id === loteUso.loteId);
      return lote && loteUso.cantidad <= lote.cantidadDisponible;
    });
  });
}

function reposicionSync(item) {
  if ((item.lotes || []).length !== 1) return item;
  return {
    ...item,
    lotes: item.lotes.map((lote) => ({ ...lote, cantidad: item.cantidad })),
  };
}

function reposicionTeam(subcampaniaId) {
  const sub = subcampanaById(subcampaniaId);
  return EQUIPO.filter((person) => sub?.equipoIds.includes(person.id));
}

function ReposicionPhotoBlock({ fotos, onFotos }) {
  const photos = PHOTOS_SAMPLE.slice(0, fotos);
  return fotos === 0 ? (
    <button
      onClick={() => onFotos(Math.min(3, fotos + 1))}
      className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-3xl bg-white text-brand-700 shadow-soft ring-2 ring-dashed ring-brand-200 transition hover:ring-brand-400"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
        <Icon name="camera" className="h-8 w-8" />
      </div>
      <span className="text-base font-extrabold">Tomar foto de la reposición</span>
      <span className="px-8 text-center text-[11px] font-semibold text-slate-500">Mínimo 1 foto con GPS enlazado</span>
    </button>
  ) : (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {photos.map((item, index) => (
          <figure key={index} className="relative overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-black/5">
            <img src={item.url} alt={item.label} className="aspect-[4/3] w-full object-cover" />
            <figcaption className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-full bg-black/55 px-2 py-1 text-[10px] font-extrabold text-white">
              <span className="inline-flex items-center gap-1"><Icon name="pin" className="h-3 w-3" />GPS ✓</span>
              <span>{['09:04', '09:07', '09:11'][index]}</span>
            </figcaption>
          </figure>
        ))}
        <button
          onClick={() => onFotos(Math.min(3, fotos + 1))}
          className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1.5 rounded-2xl bg-white text-brand-700 shadow-soft ring-2 ring-dashed ring-brand-200 transition hover:ring-brand-400"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50">
            <Icon name="camera-plus" className="h-5 w-5" />
          </div>
          <span className="text-[11px] font-extrabold">Agregar otra</span>
        </button>
      </div>
      <p className="text-[11px] font-semibold text-slate-500">{fotos} {fotos === 1 ? 'foto' : 'fotos'} listas</p>
    </div>
  );
}

function ReposicionOverlay({ phase, badgeLabel, total, onDone }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-brand-800/95 px-6 text-center text-white">
      <img src={assetPath('plantacion.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="relative flex max-w-[280px] flex-col items-center">
        {phase === 'guardando' ? (
          <React.Fragment>
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-white/15" />
              <div className="absolute inset-0 rounded-full border-4 border-orange-300 border-t-transparent animate-spin" />
              <Icon name="refresh" className="h-9 w-9 text-orange-200" />
            </div>
            <p className="mt-6 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/80">Registrando…</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">Guardando la reposición</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-400/20 ring-4 ring-orange-300/35">
              <Icon name="check-circle" className="h-12 w-12 text-orange-200" />
            </div>
            <p className="mt-6 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-orange-200">{badgeLabel}</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">{total} árboles repuestos</p>
            <button onClick={onDone} className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-soft">
              Registrar otra reposición
            </button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

function RegistrarReposicionScreen({
  paso,
  onPaso,
  subcampaniaId,
  onSubcampaniaId,
  registroId,
  onRegistroId,
  fotos,
  onFotos,
  gps,
  onGps,
  especies,
  onEspecies,
  coResponsables,
  onCoResponsables,
  conexion,
  confirmacion,
  onConfirmacion,
}) {
  const sub = subcampanaById(subcampaniaId) || SUBCAMPANIAS_OPERATIVAS[0];
  const grupos = registrosConMortandadDeSubcampana(sub.id);
  const resumen = resumenRegistro(registroId) || grupos[0]?.resumen;
  const badge = reposicionBadge(sub);
  const gpsStatus = reposicionGpsStatus(gps);
  const total = reposicionTotal(especies);
  const allocationOk = reposicionAllocationOk(especies, sub.id);
  const hardBlocked = !!resumen && total > resumen.reponible;
  const team = reposicionTeam(sub.id);
  const canNext = (
    (paso === 1 && !!subcampaniaId) ||
    (paso === 2 && !!registroId) ||
    paso === 3 ||
    (paso === 4 && fotos > 0 && gps === 'capturado') ||
    (paso === 5 && total > 0) ||
    (paso === 6 && allocationOk) ||
    paso === 7 ||
    (paso === 8 && !hardBlocked && allocationOk && gps === 'capturado' && total > 0)
  );

  React.useEffect(() => {
    if (confirmacion !== 'guardando') return undefined;
    const id = window.setTimeout(() => onConfirmacion('exito'), 900);
    return () => window.clearTimeout(id);
  }, [confirmacion, onConfirmacion]);

  let content = null;

  if (paso === 1) {
    const subcampanias = SUBCAMPANIAS_OPERATIVAS.filter((item) => registrosConMortandadDeSubcampana(item.id).length > 0);
    content = (
      <div className="space-y-4">
        <p className="text-sm font-medium leading-relaxed text-brand-700">
          Solo aparecen sub-campañas con mortandad previa reportada. La reposición suma saldo vivo, pero no mueve la meta.
        </p>
        <div className="space-y-3">
          {subcampanias.map((item) => {
            const isOn = item.id === subcampaniaId;
            const itemBadge = reposicionBadge(item);
            const registros = registrosConMortandadDeSubcampana(item.id);
            const pendiente = registros.reduce((acc, registro) => acc + (registro.resumen?.reponible || 0), 0);
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSubcampaniaId(item.id);
                  onRegistroId(registros[0]?.id || '');
                }}
                className={`w-full rounded-3xl bg-white p-4 text-left shadow-soft ring-1 transition ${isOn ? 'ring-2 ring-brand-600' : 'ring-black/5 hover:ring-brand-300'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isOn ? 'bg-brand-600 text-white' : 'bg-orange-50 text-orange-700'}`}>
                    <Icon name="refresh" className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] ring-1 ${itemBadge.tone}`}>
                        {itemBadge.label}
                      </span>
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-brand-700 ring-1 ring-brand-100">
                        {item.estado}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-extrabold text-brand-800">{item.nombre}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">{item.zona}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-brand-50 px-3 py-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Grupos</p>
                    <p className="mt-1 text-lg font-extrabold text-brand-800">{registros.length}</p>
                  </div>
                  <div className="rounded-2xl bg-brand-50 px-3 py-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Pendiente</p>
                    <p className="mt-1 text-lg font-extrabold text-brand-800">{pendiente}</p>
                  </div>
                  <div className="rounded-2xl bg-brand-50 px-3 py-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Lotes REP</p>
                    <p className="mt-1 text-lg font-extrabold text-brand-800">{lotesReposicionDeSubcampania(item.id).length}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (paso === 2) {
    content = (
      <div className="space-y-4">
        <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
          <p className="text-sm font-bold leading-relaxed text-brand-700">
            Elige un grupo con mortandad previa. Los casos sin pendiente ya no aparecen en esta lista.
          </p>
        </div>
        <div className="space-y-3">
          {grupos.map((item) => {
            const isOn = item.id === registroId;
            return (
              <button
                key={item.id}
                onClick={() => onRegistroId(item.id)}
                className={`w-full overflow-hidden rounded-3xl bg-white text-left shadow-soft ring-1 transition ${isOn ? 'ring-2 ring-brand-600' : 'ring-black/5 hover:ring-brand-300'}`}
              >
                <div className="flex gap-3 p-4">
                  <img src={item.fotoUrl} alt={item.nombreGrupo} className="h-24 w-24 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-extrabold text-brand-800">{item.nombreGrupo}</p>
                        <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{item.fechaPlantacionLabel}</p>
                      </div>
                      <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-extrabold text-orange-700 ring-1 ring-orange-100">
                        Reponible {item.resumen.reponible}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-2xl bg-brand-50 px-3 py-2">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Muerta</p>
                        <p className="mt-1 text-base font-extrabold text-brand-800">{item.resumen.mortandadAcumulada}</p>
                      </div>
                      <div className="rounded-2xl bg-brand-50 px-3 py-2">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">Repuesta</p>
                        <p className="mt-1 text-base font-extrabold text-brand-800">{item.resumen.reposicionesAcumuladas}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (paso === 3 && resumen) {
    content = (
      <div className="space-y-4">
        <div className={`rounded-3xl bg-gradient-to-br ${badge.heroTone} px-4 py-4 text-white shadow-soft`}>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Gate bloqueante</p>
          <p className="mt-1 text-2xl font-extrabold">{resumen.registro.nombreGrupo}</p>
          <p className="mt-1 text-[11px] font-semibold text-white/80">La reposición no puede superar el pendiente de este grupo</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Plantado inicial', resumen.plantadoInicial],
            ['Muerta acumulada', resumen.mortandadAcumulada],
            ['Repuesta acumulada', resumen.reposicionesAcumuladas],
            ['Pendiente', resumen.reponible],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl bg-white px-4 py-4 shadow-soft ring-1 ring-black/5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">{label}</p>
              <p className="mt-2 text-3xl font-extrabold text-brand-800">{value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border-l-4 border-orange-500 bg-orange-50 px-4 py-3">
          <p className="text-sm font-extrabold text-orange-800">Hard gate</p>
          <p className="mt-1 text-[12px] font-medium leading-relaxed text-orange-700">
            Si ingresas más de {resumen.reponible}, el botón final queda bloqueado.
          </p>
        </div>
      </div>
    );
  }

  if (paso === 4 && resumen) {
    content = (
      <div className="space-y-4">
        <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Grupo origen</p>
          <p className="mt-1 text-sm font-extrabold text-brand-800">{resumen.registro.nombreGrupo}</p>
          <p className="text-xs font-semibold text-slate-500">{fmtCoords(resumen.registro.lat, resumen.registro.lng)}</p>
        </div>
        <div className={`flex items-center gap-3 rounded-2xl px-3 py-3 ring-1 ${gpsStatus.tone}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/60">
            <Icon name={gpsStatus.icon} className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold">{gpsStatus.label}</p>
            <p className="text-[11px] font-semibold opacity-80">{gpsStatus.detail}</p>
          </div>
          {gps !== 'capturado' && <button onClick={() => onGps('capturado')} className="rounded-full bg-white/75 px-3 py-1 text-[11px] font-extrabold">Reintentar</button>}
        </div>
        <ReposicionPhotoBlock fotos={fotos} onFotos={onFotos} />
      </div>
    );
  }

  if (paso === 5 && resumen) {
    content = (
      <div className="space-y-4">
        <div className={`rounded-3xl bg-gradient-to-br ${badge.heroTone} px-4 py-4 text-white shadow-soft`}>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Total a reponer</p>
              <p className="mt-1 text-5xl font-extrabold leading-none tracking-tight">{total}</p>
              <p className="mt-1 text-[11px] font-bold text-white/80">Pendiente disponible: {resumen.reponible}</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-3 py-2 ring-1 ring-white/15">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">No avanza meta</p>
              <p className="text-sm font-extrabold">Solo saldo vivo</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {especies.map((item, index) => (
            <div key={item.id} className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-brand-800">{item.especie}</p>
                  <p className="text-[11px] font-semibold text-slate-500">Especie libre permitida por la maqueta</p>
                </div>
                <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-extrabold text-orange-700 ring-1 ring-orange-100">
                  {item.lotes?.length === 1 ? '1 lote' : `${item.lotes?.length || 0} lotes`}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  onClick={() => onEspecies(especies.map((current, currentIndex) => currentIndex === index ? reposicionSync({ ...current, cantidad: Math.max(0, current.cantidad - 1) }) : current))}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-700"
                >
                  <Icon name="minus" className="h-5 w-5" />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-[28px] font-extrabold leading-none tracking-tight text-brand-800">{item.cantidad}</p>
                  <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">UNIDAD</p>
                </div>
                <button
                  onClick={() => onEspecies(especies.map((current, currentIndex) => currentIndex === index ? reposicionSync({ ...current, cantidad: current.cantidad + 1 }) : current))}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white"
                >
                  <Icon name="plus" className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {hardBlocked && (
          <div className="rounded-3xl border-l-4 border-red-500 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-700">
            Ingresaste {total}, pero el grupo solo tiene {resumen.reponible} pendientes.
          </div>
        )}
      </div>
    );
  }

  if (paso === 6) {
    const lotes = lotesReposicionDeSubcampania(sub.id);
    const oneLot = lotes.length === 1;
    content = (
      <div className="space-y-4">
        <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
          <p className="text-sm font-bold leading-relaxed text-brand-700">
            Solo se muestran lotes activos con propósito <b>REPOSICION</b> para esta sub-campaña.
          </p>
        </div>
        <div className="space-y-3">
          {especies.map((item) => (
            <div key={item.id} className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold text-brand-800">{item.especie}</p>
                  <p className="text-[11px] font-semibold text-slate-500">{item.cantidad} árboles a reponer</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ring-1 ${oneLot ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-orange-50 text-orange-700 ring-orange-100'}`}>
                  {oneLot ? 'Preselección automática' : 'Cantidad por lote'}
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {(item.lotes || []).map((loteUso) => {
                  const lote = lotes.find((candidate) => candidate.id === loteUso.loteId);
                  if (!lote) return null;
                  return (
                    <div key={lote.id} className="rounded-2xl bg-brand-50 px-3 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[12px] font-extrabold text-brand-800">{lote.id}</p>
                          <p className="text-[11px] font-semibold text-slate-500">{lote.especie} · {lote.vivero}</p>
                        </div>
                        <span className="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-brand-700 ring-1 ring-brand-100">
                          {loteUso.cantidad} / {lote.cantidadDisponible}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {!allocationOk && (
          <div className="rounded-3xl border-l-4 border-red-500 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-700">
            La suma por lote debe coincidir exactamente con la cantidad de cada especie.
          </div>
        )}
      </div>
    );
  }

  if (paso === 7) {
    content = (
      <div className="space-y-4">
        <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
          <p className="text-sm font-bold leading-relaxed text-brand-700">
            Los co-responsables son opcionales, pero deben pertenecer al equipo operativo de la sub-campaña.
          </p>
        </div>
        <ul className="space-y-2">
          {team.map((person) => {
            const isOn = coResponsables.includes(person.id);
            return (
              <li key={person.id}>
                <button
                  onClick={() => onCoResponsables(isOn ? coResponsables.filter((item) => item !== person.id) : [...coResponsables, person.id])}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left shadow-soft ring-1 transition ${isOn ? 'bg-orange-500 text-white ring-orange-600' : 'bg-white text-brand-800 ring-black/5 hover:ring-brand-300'}`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold tracking-wide ${isOn ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-700'}`}>
                    {person.iniciales}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold">{person.nombre}</p>
                    <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${isOn ? 'text-white/75' : 'text-brand-500'}`}>{person.rol}</p>
                  </div>
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full ${isOn ? 'bg-white text-orange-700' : 'bg-slate-100 text-slate-400'}`}>
                    {isOn ? <Icon name="check" className="h-4 w-4" /> : <Icon name="plus" className="h-4 w-4" />}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (paso === 8 && resumen) {
    const responsables = coResponsables.length === 0
      ? 'Solo tú'
      : coResponsables.map((id) => personById(id)?.iniciales).join(' · ');
    const speciesText = especies
      .filter((item) => item.cantidad > 0)
      .map((item) => `${item.cantidad} ${item.especie}`)
      .join(' · ');
    content = (
      <div className="space-y-3">
        <div className={`rounded-3xl bg-gradient-to-br ${badge.heroTone} px-4 py-4 text-white shadow-soft`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/80">Vas a registrar</p>
              <p className="mt-1 text-[44px] font-extrabold leading-none tracking-tight">{total}</p>
              <p className="mt-1 text-[11px] font-bold text-white/85">árboles repuestos</p>
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-extrabold tracking-[0.14em] ring-1 ring-white/20">
              {badge.label}
            </span>
          </div>
        </div>
        {hardBlocked && (
          <div className="rounded-3xl border-l-4 border-red-500 bg-red-50 px-4 py-3">
            <p className="text-sm font-extrabold text-red-800">Bloqueado por cantidades</p>
            <p className="mt-1 text-[12px] font-medium leading-relaxed text-red-700">
              Ingresaste {total}, pero el grupo solo tiene {resumen.reponible} pendientes.
            </p>
          </div>
        )}
        {!allocationOk && (
          <div className="rounded-3xl border-l-4 border-red-500 bg-red-50 px-4 py-3">
            <p className="text-sm font-extrabold text-red-800">Distribución inconsistente</p>
            <p className="mt-1 text-[12px] font-medium leading-relaxed text-red-700">
              La suma por lote debe coincidir con la cantidad de cada especie.
            </p>
          </div>
        )}
        <div className="divide-y divide-slate-100 rounded-3xl bg-white shadow-soft ring-1 ring-black/5">
          <div className="px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Grupo</p>
            <p className="text-sm font-extrabold text-brand-800">{resumen.registro.nombreGrupo}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Especies</p>
            <p className="text-sm font-extrabold text-brand-800">{speciesText || 'Sin especies'}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Evidencia</p>
            <p className="text-sm font-extrabold text-brand-800">{fotos} {fotos === 1 ? 'foto' : 'fotos'} · {gps === 'capturado' ? 'GPS válido' : 'GPS bloqueado'}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Co-responsables</p>
            <p className="text-sm font-extrabold text-brand-800">{responsables}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Vivos estimados después</p>
            <p className="text-sm font-extrabold text-brand-800">{resumen.vivosEstimados + total}</p>
          </div>
        </div>
        {conexion === 'offline' && (
          <div className="rounded-3xl border-l-4 border-amber-500 bg-amber-50 px-4 py-3">
            <p className="text-sm font-extrabold text-amber-800">Queda en cola</p>
            <p className="mt-1 text-[12px] font-medium leading-relaxed text-amber-700">
              La maqueta muestra el caso offline, pero no hay envío real.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div data-screen-label="Registrar reposición" className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-4">
        <PlantHeader
          paso={paso}
          conexion={conexion}
          onBack={() => paso > 1 && onPaso(paso - 1)}
          steps={REPOSICION_STEPS}
          eyebrow="Reposición"
          titleByStep={reposicionTitle}
          heroImage={assetPath('plantacion.jpg')}
          badges={[{ label: badge.label, tone: badge.tone, icon: 'refresh' }]}
        />

        <div className="flex-1 space-y-4 px-5 pt-4">{content}</div>

        <div className="px-5">
          <StepFooter
            primary={paso === 8 ? <React.Fragment><Icon name="check-circle" className="h-5 w-5" />Registrar reposición ({total || 0})</React.Fragment> : <React.Fragment>Continuar<Icon name="chevron-right" className="h-5 w-5" /></React.Fragment>}
            tone={paso === 8 ? 'success' : 'primary'}
            disabled={!canNext}
            onPrimary={() => {
              if (paso < REPOSICION_STEPS.length) onPaso(paso + 1);
              else onConfirmacion('guardando');
            }}
          />
        </div>
      </div>

      {confirmacion !== 'idle' && (
        <ReposicionOverlay
          phase={confirmacion}
          badgeLabel={badge.label}
          total={total}
          onDone={() => {
            onConfirmacion('idle');
            onPaso(1);
          }}
        />
      )}
    </div>
  );
}

window.RegistrarReposicionScreen = RegistrarReposicionScreen;
window.REPOSICION_STEPS = REPOSICION_STEPS;
