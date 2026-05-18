// Crear campaña — composición del wizard

function CrearCampanaScreen({
  paso, onPaso,
  tipo, nombre, comunidades, comunidadIds, fechaInicio, fechaFin, coordinadora,
  comunidadQuery, comunidadLoading, comunidadResults, onComunidadQuery,
  tieneZona, hectareas, onTieneZona,
  meta, especies, onMeta, onTogglePct, onChangeBasic, onToggleComunidad,
  equipoIds, lotesIds, onTogglePersona, onToggleLote,
  asignacionTab, onAsignacionTab,
  confirmacion, onConfirmacion,
}) {

  const canNext = (() => {
    if (paso === 1) return tipo && nombre.trim().length > 2 && comunidadIds.length > 0;
    if (paso === 2) return tieneZona;
    if (paso === 3) return meta > 0 && especies.reduce((a, e) => a + e.pct, 0) === 100;
    if (paso === 4) return true; // optional but encouraged
    if (paso === 5) return true;
    return true;
  })();

  const goNext = () => {
    if (paso < 5) onPaso(paso + 1);
    else onConfirmacion('guardando');
  };
  const goBack = () => { if (paso > 1) onPaso(paso - 1); };

  return (
    <div data-screen-label="Crear campaña" className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-4">
        <CCHeader paso={paso} onBack={goBack} />

        <div className="px-5 pt-4 space-y-4 flex-1">
          {paso === 1 && (
            <CCStepDatos
              tipo={tipo} nombre={nombre} comunidades={comunidades} comunidadIds={comunidadIds}
              comunidadQuery={comunidadQuery} comunidadLoading={comunidadLoading} comunidadResults={comunidadResults}
              fechaInicio={fechaInicio} fechaFin={fechaFin}
              coordinadora={coordinadora}
              onChange={onChangeBasic}
              onToggleComunidad={onToggleComunidad}
              onComunidadQuery={onComunidadQuery} />
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
            <CCStepEquipo
              equipoIds={equipoIds} lotesIds={lotesIds}
              onTogglePersona={onTogglePersona} onToggleLote={onToggleLote}
              tab={asignacionTab} onTab={onAsignacionTab} />
          )}
          {paso === 5 && (
            <CCStepResumen
              tipo={tipo} nombre={nombre} comunidades={comunidades} comunidadIds={comunidadIds}
              fechaInicio={fechaInicio} fechaFin={fechaFin}
              coordinadora={coordinadora}
              hectareas={hectareas} meta={meta} especies={especies}
              equipoIds={equipoIds} lotesIds={lotesIds} />
          )}
        </div>

        <div className="px-5">
          <div className="sticky bottom-0 -mx-5 px-5 pt-3 pb-5 bg-gradient-to-t from-[#eef2ed] via-[#eef2ed]/95 to-transparent">
            {paso === 5 && (
              <button onClick={() => onConfirmacion('guardando')} className="mb-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand-700 shadow-soft ring-1 ring-black/5 hover:ring-brand-300 transition">
                Guardar como BORRADOR
              </button>
            )}
            <button
              onClick={goNext}
              disabled={!canNext}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-base font-extrabold text-white shadow-soft transition active:scale-[0.99]
                ${!canNext ? 'bg-slate-400/70 cursor-not-allowed' :
                  paso === 5 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-brand-600 hover:bg-brand-700'}`}>
              {paso === 5 ? (
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
