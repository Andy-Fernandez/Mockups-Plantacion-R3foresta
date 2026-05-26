// Crear campaña — composición del wizard

function CrearCampanaScreen({
  paso, onPaso,
  tipo, nombre, organizacion, organizacionesSeleccionadas, descripcion, fechaInicio, fechaFin, fechaInicioISO, fechaFinISO,
  subcampanaActiva,
  onSubcampanaTipo,
  onSubcampanaCoordinador, onSubcampanaFecha,
  tieneZona, hectareas, onTieneZona,
  meta, especies, onMeta, onTogglePct, onChangeBasic,
  equipoIds, lotesIds, onTogglePersona, onToggleLote,
  onBackToGeneral,
  confirmacion, onConfirmacion,
}) {
  const subcampanaReady = !!subcampanaActiva &&
    !!subcampanaActiva.coordinadorId &&
    !!subcampanaActiva.fechaInicio &&
    !!subcampanaActiva.fechaFin &&
    subcampanaActiva.fechaInicio <= subcampanaActiva.fechaFin &&
    subcampanaActiva.fechaInicio >= fechaInicioISO &&
    subcampanaActiva.fechaFin <= fechaFinISO;

  const canNext = (() => {
    if (paso === 1) return subcampanaReady;
    if (paso === 2) return tieneZona;
    if (paso === 3) return meta > 0 && especies.reduce((a, e) => a + e.pct, 0) === 100;
    if (paso === 4) return true;
    if (paso === 5) return true; // optional but encouraged
    if (paso === 6) return subcampanaReady;
    return true;
  })();

  const goNext = () => {
    if (paso < 6) onPaso(paso + 1);
    else onConfirmacion('guardando');
  };
  const goBack = () => {
    if (onBackToGeneral && paso <= 1) {
      onBackToGeneral();
      return;
    }
    if (paso > 1) onPaso(paso - 1);
  };

  return (
    <div data-screen-label="Crear campaña" className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-4">
        <CCHeader paso={paso} onBack={goBack} subcampanaNombre={subcampanaActiva?.comunidadNombre} />

        <div className="px-5 pt-4 space-y-4 flex-1">
          {paso === 1 && (
            <SubcampanaContextCard
              campanaNombre={nombre}
              subcampana={subcampanaActiva}
              generalFechaInicio={fechaInicio}
              generalFechaFin={fechaFin}
              generalRange={{ inicioISO: fechaInicioISO, finISO: fechaFinISO }}
              onTipoChange={onSubcampanaTipo}
              onCoordinadorChange={onSubcampanaCoordinador}
              onFechaChange={onSubcampanaFecha}
            />
          )}
          {paso === 2 && (
            <CCStepZona
              tieneZona={tieneZona} hectareas={hectareas}
              onMarcar={() => onTieneZona(true)}
              onLimpiar={() => onTieneZona(false)} />
          )}
          {paso === 3 && (
            <CCStepEspecies meta={meta} especies={especies} onMeta={onMeta} onTogglePct={onTogglePct} />
          )}
          {paso === 4 && (
            <CCStepLotes
              lotesIds={lotesIds}
              onToggleLote={onToggleLote} />
          )}
          {paso === 5 && (
            <CCStepEquipo
              equipoIds={equipoIds}
              onTogglePersona={onTogglePersona} />
          )}
          {paso === 6 && (
            <CCStepResumen
              tipo={tipo} nombre={nombre} organizacion={organizacion} organizacionesSeleccionadas={organizacionesSeleccionadas} descripcion={descripcion}
              fechaInicio={subcampanaActiva?.fechaInicio ? formatSubcampanaDate(subcampanaActiva.fechaInicio) : fechaInicio}
              fechaFin={subcampanaActiva?.fechaFin ? formatSubcampanaDate(subcampanaActiva.fechaFin) : fechaFin}
              hectareas={hectareas} meta={meta} especies={especies}
              equipoIds={equipoIds} lotesIds={lotesIds} />
          )}
        </div>

        <div className="px-5">
          <div className="sticky bottom-0 -mx-5 px-5 pt-3 pb-5 bg-gradient-to-t from-[#eef2ed] via-[#eef2ed]/95 to-transparent">
            {paso === 6 && (
              <button onClick={() => onConfirmacion('guardando')} className="mb-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-soft ring-1 ring-black/5 hover:ring-brand-300 transition">
                Guardar como BORRADOR
              </button>
            )}
            <button
              onClick={goNext}
              disabled={!canNext}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-base font-extrabold text-white shadow-soft transition active:scale-[0.99]
                ${!canNext ? 'bg-slate-400/70 cursor-not-allowed' :
                  paso === 6 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-brand-600 hover:bg-brand-700'}`}>
              {paso === 6 ? (
                <React.Fragment>
                  <Icon name="check-circle" className="h-5 w-5" />
                  Publicar campaña ACTIVA
                </React.Fragment>
              ) : (
                <React.Fragment>
                  Continuar
                  <Icon name="chevron-right" className="h-5 w-5" />
                </React.Fragment>
              )}
            </button>
          </div>
        </div>
      </div>

      {confirmacion !== 'idle' && (
        <CCSuccessOverlay
          phase={confirmacion}
          nombre={nombre}
          onContinue={() => { onConfirmacion('idle'); window.location.href = 'Dashboard admin.html'; }}
          onVerDetalle={() => { window.location.href = 'Detalle de campaña.html'; }} />
      )}
    </div>
  );
}

window.CrearCampanaScreen = CrearCampanaScreen;
