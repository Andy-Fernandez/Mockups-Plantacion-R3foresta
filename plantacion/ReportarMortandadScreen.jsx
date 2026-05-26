const MORTANDAD_STEPS = [
  { n: 1, label: 'Subcampaña' },
  { n: 2, label: 'Grupo' },
  { n: 3, label: 'Histórico' },
  { n: 4, label: 'Foto + GPS' },
  { n: 5, label: 'Delta' },
  { n: 6, label: 'Causa' },
  { n: 7, label: 'Notas' },
  { n: 8, label: 'Confirmar' },
];

function mortandadTitle(paso) {
  return [
    '',
    'Elige la sub-campaña',
    'Ubica el grupo afectado',
    'Revisa el histórico',
    'Captura evidencia',
    '¿Cuántos más murieron?',
    'Selecciona la causa',
    'Observación',
    'Confirma el reporte',
  ][paso];
}

function mortandadHumanize(value) {
  return value.replaceAll('_', ' ');
}

function mortandadTone(pct) {
  const tone = supervivenciaTone(pct);
  if (tone === 'ok') return { pill: 'bg-emerald-50 text-emerald-800 ring-emerald-100', bar: 'bg-emerald-500' };
  if (tone === 'warn') return { pill: 'bg-amber-50 text-amber-800 ring-amber-100', bar: 'bg-amber-500' };
  return { pill: 'bg-red-50 text-red-700 ring-red-100', bar: 'bg-red-500' };
}

function mortandadGpsStatus(gps) {
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
      detail: 'Esperando señal estable',
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
      label: 'Fuera de tolerancia',
      detail: `Bloqueado · el punto quedó a 73 m del polígono (${GPS_TOLERANCIA_METROS} m máx.)`,
    },
  }[gps];
}

function MortandadMetric({ label, value, tone = 'bg-brand-50 text-brand-800' }) {
  return (
    <div className={`rounded-2xl px-3 py-2.5 ${tone}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function MortandadPhotoBlock({ fotos, onFotos, title }) {
  const photos = PHOTOS_SAMPLE.slice(0, fotos);
  return fotos === 0 ? (
    <button
      onClick={() => onFotos(Math.min(3, fotos + 1))}
      className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-3xl bg-white text-brand-700 shadow-soft ring-2 ring-dashed ring-brand-200 transition hover:ring-brand-400"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
        <Icon name="camera" className="h-8 w-8" />
      </div>
      <span className="text-base font-extrabold">{title}</span>
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
              <span>{['08:41', '08:44', '08:49'][index]}</span>
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

function MortandadOverlay({ phase, delta, onDone }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-brand-800/95 px-6 text-center text-white">
      <img src={assetPath('plantacion.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="relative flex max-w-[280px] flex-col items-center">
        {phase === 'guardando' ? (
          <React.Fragment>
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-white/15" />
              <div className="absolute inset-0 rounded-full border-4 border-red-300 border-t-transparent animate-spin" />
              <Icon name="loss" className="h-9 w-9 text-red-200" />
            </div>
            <p className="mt-6 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-white/80">Registrando…</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">Guardando el reporte</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-400/20 ring-4 ring-red-300/35">
              <Icon name="check-circle" className="h-12 w-12 text-red-200" />
            </div>
            <p className="mt-6 text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-red-200">Mortandad reportada</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">+{delta} árboles registrados</p>
            <button onClick={onDone} className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-soft">
              Registrar otro reporte
            </button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

function ReportarMortandadScreen({
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
  delta,
  onDelta,
  causa,
  onCausa,
  observaciones,
  onObservaciones,
  conexion,
  confirmacion,
  onConfirmacion,
}) {
  const sub = subcampanaById(subcampaniaId) || SUBCAMPANIAS_OPERATIVAS[0];
  const grupos = registrosDeSubcampana(sub.id);
  const resumen = resumenRegistro(registroId) || grupos[0]?.resumen;
  const gpsStatus = mortandadGpsStatus(gps);
  const canNext = (
    (paso === 1 && !!subcampaniaId) ||
    (paso === 2 && !!registroId) ||
    paso === 3 ||
    (paso === 4 && fotos > 0 && gps === 'capturado') ||
    (paso === 5 && !!resumen && delta > 0 && delta <= resumen.maxNuevaMortandad) ||
    (paso === 6 && !!causa) ||
    (paso === 7 && (causa !== 'OTRO' || observaciones.trim().length > 0)) ||
    paso === 8
  );

  React.useEffect(() => {
    if (confirmacion !== 'guardando') return undefined;
    const id = window.setTimeout(() => onConfirmacion('exito'), 900);
    return () => window.clearTimeout(id);
  }, [confirmacion, onConfirmacion]);

  let content = null;

  if (paso === 1) {
    content = (
      <div className="space-y-4">
        <p className="text-sm font-medium leading-relaxed text-brand-700">
          Elige una sub-campaña operativa. La maqueta muestra solo estados permitidos para reportar mortandad.
        </p>
        <div className="space-y-3">
          {SUBCAMPANIAS_OPERATIVAS.map((item) => {
            const isOn = item.id === subcampaniaId;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSubcampaniaId(item.id);
                  onRegistroId(registrosDeSubcampana(item.id)[0]?.id || '');
                }}
                className={`w-full rounded-3xl bg-white p-4 text-left shadow-soft ring-1 transition ${isOn ? 'ring-2 ring-brand-600' : 'ring-black/5 hover:ring-brand-300'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isOn ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700'}`}>
                    <Icon name="loss" className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-brand-800">{item.nombre}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">{campanaById(item.campanaId)?.nombre} · {item.zona}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-brand-700 ring-1 ring-brand-100">{item.estado}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-700 ring-1 ring-slate-200">{mortandadHumanize(item.fase)}</span>
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

  if (paso === 2) {
    content = (
      <div className="space-y-4">
        <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
          <p className="text-sm font-bold leading-relaxed text-brand-700">
            El histórico aparece en el siguiente paso para evitar doble conteo. Aquí solo eliges el grupo exacto.
          </p>
        </div>
        <div className="space-y-3">
          {grupos.map((item) => {
            const tone = mortandadTone(item.resumen.supervivenciaPct);
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
                        <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{item.fechaPlantacionLabel} · {fmtCoords(item.lat, item.lng)}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ring-1 ${tone.pill}`}>
                        {item.resumen.supervivenciaPct}%
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <MortandadMetric label="Plantado" value={item.plantadoInicial} />
                      <MortandadMetric label="Vivos hoy" value={item.resumen.vivosEstimados} />
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
        <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-brand-800 px-4 py-4 text-white shadow-soft">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Histórico del grupo</p>
          <p className="mt-1 text-2xl font-extrabold">{resumen.registro.nombreGrupo}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <MortandadMetric label="Plantados al inicio" value={resumen.plantadoInicial} tone="bg-white/10 text-white ring-1 ring-white/15" />
            <MortandadMetric label="Reposiciones" value={resumen.reposicionesAcumuladas} tone="bg-white/10 text-white ring-1 ring-white/15" />
            <MortandadMetric label="Mortandad previa" value={resumen.mortandadAcumulada} tone="bg-white/10 text-white ring-1 ring-white/15" />
            <MortandadMetric label="Vivos estimados" value={resumen.vivosEstimados} tone="bg-white/10 text-white ring-1 ring-white/15" />
          </div>
        </div>
        <div className="rounded-3xl border-l-4 border-red-500 bg-red-50 px-4 py-3">
          <p className="text-sm font-extrabold text-red-800">Append-only</p>
          <p className="mt-1 text-[12px] font-medium leading-relaxed text-red-700">
            No hay opción de editar ni borrar. Si te equivocas, se corrige con otro evento.
          </p>
        </div>
      </div>
    );
  }

  if (paso === 4 && resumen) {
    content = (
      <div className="space-y-4">
        <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Grupo seleccionado</p>
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
        <MortandadPhotoBlock fotos={fotos} onFotos={onFotos} title="Tomar foto del daño" />
      </div>
    );
  }

  if (paso === 5 && resumen) {
    const invalid = delta <= 0 || delta > resumen.maxNuevaMortandad;
    content = (
      <div className="space-y-4">
        <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-700 px-4 py-4 text-white shadow-soft">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/80">Límite funcional</p>
          <p className="mt-1 text-5xl font-extrabold">{resumen.maxNuevaMortandad}</p>
          <p className="mt-1 text-[11px] font-bold text-white/80">máximo que puedes reportar hoy</p>
        </div>
        <div className={`rounded-3xl bg-white p-4 shadow-soft ring-1 ${invalid ? 'ring-red-200' : 'ring-black/5'}`}>
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => onDelta(Math.max(0, delta - 1))} className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-700"><Icon name="minus" className="h-5 w-5" /></button>
            <div className="flex-1 text-center">
              <p className="text-[34px] font-extrabold text-brand-800">{delta}</p>
              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-brand-500">delta nuevo</p>
            </div>
            <button onClick={() => onDelta(delta + 1)} className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white"><Icon name="plus" className="h-5 w-5" /></button>
          </div>
        </div>
        {invalid && <div className="rounded-3xl border-l-4 border-red-500 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-700">El delta debe ser mayor a 0 y no puede superar {resumen.maxNuevaMortandad}.</div>}
      </div>
    );
  }

  if (paso === 6) {
    content = (
      <div className="space-y-4">
        <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
          <p className="text-sm font-bold leading-relaxed text-brand-700">
            Usa el catálogo cerrado. Si eliges <b>OTRO</b>, el siguiente paso te exigirá una observación.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CAUSAS_MORTANDAD_PLANTACION.map((item) => {
            const isOn = item === causa;
            return (
              <button
                key={item}
                onClick={() => onCausa(item)}
                className={`rounded-2xl px-3 py-3 text-left text-[11px] font-extrabold uppercase tracking-[0.08em] ring-1 transition ${isOn ? 'bg-brand-600 text-white ring-brand-700' : 'bg-white text-brand-700 ring-black/5 hover:ring-brand-300'}`}
              >
                {mortandadHumanize(item)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (paso === 7) {
    content = (
      <div className="space-y-4">
        {causa === 'OTRO' && (
          <div className="rounded-3xl border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-[12px] font-medium text-amber-700">
            Esta causa requiere una observación escrita.
          </div>
        )}
        <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-black/5">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Observación</p>
          <textarea
            value={observaciones}
            onChange={(event) => onObservaciones(event.target.value)}
            rows={5}
            placeholder="Qué viste en campo, por qué cuentas este delta, evidencia de terreno…"
            className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-brand-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>
    );
  }

  if (paso === 8 && resumen) {
    content = (
      <div className="space-y-3">
        <div className="rounded-3xl bg-gradient-to-br from-red-700 to-brand-800 px-4 py-4 text-white shadow-soft">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/80">Vas a reportar</p>
          <p className="mt-1 text-[44px] font-extrabold">{delta}</p>
          <p className="mt-1 text-[11px] font-bold text-white/85">árboles muertos adicionales</p>
        </div>
        <div className="divide-y divide-slate-100 rounded-3xl bg-white shadow-soft ring-1 ring-black/5">
          <div className="px-4 py-3"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Grupo</p><p className="text-sm font-extrabold text-brand-800">{resumen.registro.nombreGrupo}</p></div>
          <div className="px-4 py-3"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Causa</p><p className="text-sm font-extrabold text-brand-800">{mortandadHumanize(causa)}</p></div>
          <div className="px-4 py-3"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Evidencia</p><p className="text-sm font-extrabold text-brand-800">{fotos} {fotos === 1 ? 'foto' : 'fotos'} · {gps === 'capturado' ? 'GPS válido' : 'GPS bloqueado'}</p></div>
          <div className="px-4 py-3"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Vivos estimados después</p><p className="text-sm font-extrabold text-brand-800">{resumen.vivosEstimados - delta}</p></div>
          {observaciones && <div className="px-4 py-3"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-brand-500">Observación</p><p className="text-sm font-extrabold text-brand-800">{observaciones}</p></div>}
        </div>
      </div>
    );
  }

  return (
    <div data-screen-label="Reportar mortandad" className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-4">
        <PlantHeader
          paso={paso}
          conexion={conexion}
          onBack={() => paso > 1 && onPaso(paso - 1)}
          steps={MORTANDAD_STEPS}
          eyebrow="Mortandad"
          titleByStep={mortandadTitle}
          heroImage={assetPath('plantacion.jpg')}
        />

        <div className="flex-1 space-y-4 px-5 pt-4">{content}</div>

        <div className="px-5">
          <StepFooter
            primary={paso === 8 ? <React.Fragment><Icon name="check-circle" className="h-5 w-5" />Reportar mortandad (+{delta || 0})</React.Fragment> : <React.Fragment>Continuar<Icon name="chevron-right" className="h-5 w-5" /></React.Fragment>}
            tone={paso === 8 ? 'success' : 'primary'}
            disabled={!canNext}
            onPrimary={() => {
              if (paso < MORTANDAD_STEPS.length) onPaso(paso + 1);
              else onConfirmacion('guardando');
            }}
            secondary={paso === 7 && causa !== 'OTRO' ? <React.Fragment>Omitir nota<Icon name="chevron-right" className="h-4 w-4" /></React.Fragment> : null}
            onSecondary={() => onPaso(8)}
          />
        </div>
      </div>

      {confirmacion !== 'idle' && (
        <MortandadOverlay
          phase={confirmacion}
          delta={delta}
          onDone={() => {
            onConfirmacion('idle');
            onPaso(1);
          }}
        />
      )}
    </div>
  );
}

window.ReportarMortandadScreen = ReportarMortandadScreen;
