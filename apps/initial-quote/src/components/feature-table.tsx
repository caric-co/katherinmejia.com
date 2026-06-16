import { features, type QuoteFeature } from "../data/quote";

const complexityColor = {
  low: "text-success",
  medium: "text-warning",
  high: "text-danger",
} as const;

const complexityLabel = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
} as const;

function FeatureRow({ feature }: { feature: QuoteFeature }) {
  return (
    <tr className="border-b border-border hover:bg-surface-raised transition-colors">
      <td className="py-3 px-4">
        <div className="font-medium">{feature.name}</div>
        <div className="text-sm text-text-muted mt-0.5">
          {feature.description}
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-overlay text-sm font-semibold">
          {feature.phase}
        </span>
      </td>
      <td className="py-3 px-4 text-center font-mono text-sm">
        {feature.estimatedHours.min}–{feature.estimatedHours.max}h
      </td>
      <td className={`py-3 px-4 text-center text-sm font-medium ${complexityColor[feature.complexity]}`}>
        {complexityLabel[feature.complexity]}
      </td>
    </tr>
  );
}

export function FeatureTable() {
  const phases = [1, 2, 3] as const;

  const totalHours = features.reduce(
    (acc, f) => ({
      min: acc.min + f.estimatedHours.min,
      max: acc.max + f.estimatedHours.max,
    }),
    { min: 0, max: 0 }
  );

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Alcance y Estimación</h2>

      {phases.map((phase) => {
        const phaseFeatures = features.filter((f) => f.phase === phase);
        if (phaseFeatures.length === 0) return null;

        const phaseHours = phaseFeatures.reduce(
          (acc, f) => ({
            min: acc.min + f.estimatedHours.min,
            max: acc.max + f.estimatedHours.max,
          }),
          { min: 0, max: 0 }
        );

        const phaseLabel =
          phase === 1 ? "MVP" : phase === 2 ? "Crecimiento" : "Futuro";

        return (
          <div key={phase} className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand/20 text-brand text-sm font-bold">
                {phase}
              </span>
              Fase {phase} — {phaseLabel}
              <span className="text-sm font-normal text-text-muted ml-auto">
                {phaseHours.min}–{phaseHours.max} horas
              </span>
            </h3>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-overlay text-text-muted text-xs uppercase tracking-wider">
                    <th className="text-left py-2.5 px-4 font-medium">
                      Funcionalidad
                    </th>
                    <th className="text-center py-2.5 px-4 font-medium w-20">
                      Fase
                    </th>
                    <th className="text-center py-2.5 px-4 font-medium w-28">
                      Horas Est.
                    </th>
                    <th className="text-center py-2.5 px-4 font-medium w-28">
                      Complejidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {phaseFeatures.map((f) => (
                    <FeatureRow key={f.id} feature={f} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <div className="mt-6 p-4 rounded-lg bg-surface-overlay border border-border">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Estimación total (todas las fases)</span>
          <span className="text-xl font-bold font-mono">
            {totalHours.min}–{totalHours.max} horas
          </span>
        </div>
      </div>
    </section>
  );
}
