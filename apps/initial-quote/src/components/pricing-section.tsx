import { features } from "../data/quote";
import { formatCOP } from "../data/format";

const MONTHLY_SALARY = 29_000_000;
const HOURS_PER_MONTH = 160;
const HOURLY_RATE = MONTHLY_SALARY / HOURS_PER_MONTH;
const FINAL_PRICE = 5_000_000;

const INCLUDED_PHASES = [1, 2] as const;
const FUTURE_PHASES = [3] as const;

const phaseLabels: Record<number, string> = {
  1: "Fase 1 — MVP",
  2: "Fase 2 — Crecimiento",
  3: "Fase 3 — Futuro",
};

export function PricingSection() {
  const allPhases = [...INCLUDED_PHASES, ...FUTURE_PHASES] as const;

  const phaseBreakdown = allPhases.map((phase) => {
    const phaseFeatures = features.filter((f) => f.phase === phase);
    const hours = phaseFeatures.reduce(
      (acc, f) => ({
        min: acc.min + f.estimatedHours.min,
        max: acc.max + f.estimatedHours.max,
      }),
      { min: 0, max: 0 }
    );
    const included = (INCLUDED_PHASES as readonly number[]).includes(phase);
    return {
      phase,
      label: phaseLabels[phase],
      hours,
      costMin: hours.min * HOURLY_RATE,
      costMax: hours.max * HOURLY_RATE,
      included,
    };
  });

  const includedBreakdown = phaseBreakdown.filter((p) => p.included);

  const includedHours = includedBreakdown.reduce(
    (acc, p) => ({
      min: acc.min + p.hours.min,
      max: acc.max + p.hours.max,
    }),
    { min: 0, max: 0 }
  );

  const includedCostMin = includedHours.min * HOURLY_RATE;
  const includedCostMax = includedHours.max * HOURLY_RATE;
  const avgIncludedCost = (includedCostMin + includedCostMax) / 2;
  const discountPercent =
    ((avgIncludedCost - FINAL_PRICE) / avgIncludedCost) * 100;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-2">Inversión del Proyecto</h2>
      <p className="text-text-muted mb-6">
        Desglose del valor real del proyecto basado en la tarifa por hora del
        desarrollador. La presente cotización cubre las Fases 1 y 2, con
        descuento de socio aplicado. La Fase 3 se cotizará por separado.
      </p>

      <div className="rounded-lg border border-border overflow-hidden mb-6">
        <div className="bg-surface-overlay px-4 py-3 border-b border-border">
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-muted">Tarifa base por hora</span>
            <span className="font-mono font-semibold">
              {formatCOP(HOURLY_RATE)}/h
            </span>
          </div>
          <p className="text-[10px] text-text-muted mt-1">
            Calculada sobre salario de {formatCOP(MONTHLY_SALARY)}/mes ÷{" "}
            {HOURS_PER_MONTH} horas laborales
          </p>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-overlay text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left py-2.5 px-4 font-medium">Fase</th>
              <th className="text-center py-2.5 px-4 font-medium w-28">
                Horas
              </th>
              <th className="text-right py-2.5 px-4 font-medium w-52">
                Valor estimado (COP)
              </th>
            </tr>
          </thead>
          <tbody>
            {phaseBreakdown.map((p) => (
              <tr
                key={p.phase}
                className={`border-b border-border transition-colors ${
                  p.included
                    ? "hover:bg-surface-raised"
                    : "opacity-40"
                }`}
              >
                <td className="py-3 px-4 font-medium">
                  {p.label}
                  {!p.included && (
                    <span className="ml-2 text-[10px] text-text-muted font-normal">
                      (no incluida)
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center font-mono text-text-muted">
                  {p.hours.min}–{p.hours.max}h
                </td>
                <td className="py-3 px-4 text-right font-mono">
                  {formatCOP(p.costMin)} – {formatCOP(p.costMax)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-surface-overlay font-semibold border-t border-border">
              <td className="py-3 px-4">
                Valor cotizado (Fases 1 y 2)
              </td>
              <td className="py-3 px-4 text-center font-mono">
                {includedHours.min}–{includedHours.max}h
              </td>
              <td className="py-3 px-4 text-right font-mono">
                {formatCOP(includedCostMin)} – {formatCOP(includedCostMax)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="divide-y divide-border">
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-sm text-text-muted">
              Valor promedio estimado (Fases 1 y 2)
            </span>
            <span className="font-mono text-sm">
              {formatCOP(avgIncludedCost)}
            </span>
          </div>
          <div className="flex justify-between items-center px-4 py-3 bg-success/5">
            <span className="text-sm text-success font-medium">
              Descuento de socio ({discountPercent.toFixed(1)}%)
            </span>
            <span className="font-mono text-sm text-success">
              −{formatCOP(avgIncludedCost - FINAL_PRICE)}
            </span>
          </div>
          <div className="flex justify-between items-center px-4 py-4 bg-surface-overlay">
            <span className="font-bold text-lg">Precio final acordado</span>
            <span className="font-mono font-bold text-2xl text-brand">
              {formatCOP(FINAL_PRICE)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-text-muted mt-3">
        * La Fase 3 (Asistente de Redes Sociales, Certificados, Programa de
        Referidos) será cotizada de forma independiente una vez concluidas las
        Fases 1 y 2.
      </p>
    </section>
  );
}
