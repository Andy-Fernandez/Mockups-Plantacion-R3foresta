// Registrar plantación — top-level screen composition.
// Drives the 6-step wizard, sticky header + footer, and hands the tweaks panel
// state in via props (paso, fotos, gps, counts, equipo, observaciones, conexion).

function RegistrarPlantacionScreen({
  paso, onPaso,
  campanaId, onCampanaId,
  fotos, onFotos,
  gps, onGps,
  counts, onCounts,
  equipo, onEquipo,
  observaciones, onObservaciones,
  conexion,
  confirmacion, onConfirmacion,
}) {
  const campana = CAMPANAS.find(c => c.id === campanaId) || CAMPANAS[0];

  // Total of trees in this session.
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  // Per-step gating (the primary CTA is only disabled when the user can't proceed).
  const canNext = (() => {
    if (paso === 1) return !!campanaId;
    if (paso === 2) return fotos > 0 && gps === 'capturado';
    if (paso === 3) return total > 0;
    if (paso === 4) return true; // optional
    if (paso === 5) return true; // optional
    if (paso === 6) return true;
    return true;
  })();

  const goNext = () => {
    if (paso < 6) onPaso(paso + 1);
    else onConfirmacion('guardando');
  };

  const goBack = () => {
    if (paso > 1) onPaso(paso - 1);
  };

  return (
    <div data-screen-label="Registrar plantación" className="relative min-h-full bg-[#eef2ed] text-brand-700">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col pb-4">
        <PlantHeader paso={paso} conexion={conexion} onBack={goBack} />

        <div className="px-5 pt-4 space-y-4 flex-1">
          {paso === 1 && (
            <StepCampana campanaId={campanaId} onSelect={onCampanaId} />
          )}
          {paso === 2 && (
            <StepFotoGps
              campana={campana}
              fotos={fotos}
              onAddPhoto={() => onFotos(Math.min(3, fotos + 1))}
              gps={gps}
              onRecaptureGps={() => onGps('capturado')}
            />
          )}
          {paso === 3 && (
            <StepEspecies
              campana={campana}
              counts={counts}
              onChange={(esp, v) => onCounts({ ...counts, [esp]: v })}
            />
          )}
          {paso === 4 && (
            <StepEquipo
              selected={equipo}
              onToggle={(id) => onEquipo(equipo.includes(id) ? equipo.filter(x => x !== id) : [...equipo, id])}
            />
          )}
          {paso === 5 && (
            <StepObservaciones value={observaciones} onChange={onObservaciones} />
          )}
          {paso === 6 && (
            <StepConfirmar
              campana={campana}
              counts={counts}
              fotos={fotos}
              equipo={equipo}
              observaciones={observaciones}
              conexion={conexion}
            />
          )}
        </div>

        <div className="px-5">
          <StepFooter
            primary={
              paso === 6 ? (
                <React.Fragment>
                  <Icon name="check-circle" className="h-5 w-5" />
                  Registrar plantación ({total})
                </React.Fragment>
              ) : (
                <React.Fragment>
                  Continuar
                  <Icon name="chevron-right" className="h-5 w-5" />
                </React.Fragment>
              )
            }
            tone={paso === 6 ? 'success' : 'primary'}
            disabled={!canNext}
            onPrimary={goNext}
            secondary={
              (paso === 4 || paso === 5) ? (
                <React.Fragment>
                  Saltar este paso
                  <Icon name="chevron-right" className="h-4 w-4" />
                </React.Fragment>
              ) : null
            }
            onSecondary={() => onPaso(paso + 1)}
          />
        </div>
      </div>

      {confirmacion !== 'idle' && (
        <SuccessOverlay
          phase={confirmacion}
          campana={campana}
          total={total}
          onContinue={() => { onConfirmacion('idle'); onPaso(1); }}
        />
      )}
    </div>
  );
}

window.RegistrarPlantacionScreen = RegistrarPlantacionScreen;
