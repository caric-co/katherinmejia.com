import { type ColumnDef, DataTable } from "@repo/ui/components/data-table";
import { TableCell, TableRow } from "@repo/ui/components/table";

import { formatCOP } from "../data/format";
import { features } from "../data/quote";

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

interface PhaseRow {
  phase: number;
  label: string;
  hoursMin: number;
  hoursMax: number;
  costMin: number;
  costMax: number;
  included: boolean;
}

const columns: ColumnDef<PhaseRow>[] = [
  {
    accessorKey: "label",
    header: "Fase",
    cell: ({ row }) => (
      <span className={`font-medium ${row.original.included ? "" : "opacity-40"}`}>
        {row.original.label}
        {!row.original.included && (
          <span className="ml-2 text-xs text-muted-foreground font-normal">(no incluida)</span>
        )}
      </span>
    ),
  },
  {
    id: "hours",
    header: () => <div className="text-center">Horas</div>,
    cell: ({ row }) => (
      <div className={`text-center font-mono ${row.original.included ? "" : "opacity-40"}`}>
        {row.original.hoursMin}–{row.original.hoursMax}h
      </div>
    ),
  },
  {
    id: "cost",
    header: () => <div className="text-right">Valor estimado (COP)</div>,
    cell: ({ row }) => (
      <div className={`text-right font-mono ${row.original.included ? "" : "opacity-40"}`}>
        {formatCOP(row.original.costMin)} – {formatCOP(row.original.costMax)}
      </div>
    ),
  },
];

export function PricingSection() {
  const allPhases = [...INCLUDED_PHASES, ...FUTURE_PHASES] as const;

  const phaseData: PhaseRow[] = allPhases.map((phase) => {
    const phaseFeatures = features.filter((f) => f.phase === phase);
    const hours = phaseFeatures.reduce(
      (acc, f) => ({
        min: acc.min + f.estimatedHours.min,
        max: acc.max + f.estimatedHours.max,
      }),
      { min: 0, max: 0 },
    );
    const included = (INCLUDED_PHASES as readonly number[]).includes(phase);
    return {
      phase,
      label: phaseLabels[phase],
      hoursMin: hours.min,
      hoursMax: hours.max,
      costMin: hours.min * HOURLY_RATE,
      costMax: hours.max * HOURLY_RATE,
      included,
    };
  });

  const includedData = phaseData.filter((p) => p.included);

  const includedHours = includedData.reduce((acc, p) => ({ min: acc.min + p.hoursMin, max: acc.max + p.hoursMax }), {
    min: 0,
    max: 0,
  });

  const includedCostMin = includedHours.min * HOURLY_RATE;
  const includedCostMax = includedHours.max * HOURLY_RATE;
  const avgIncludedCost = (includedCostMin + includedCostMax) / 2;
  const discountPercent = ((avgIncludedCost - FINAL_PRICE) / avgIncludedCost) * 100;

  const footerRow = (
    <TableRow className="bg-muted font-semibold">
      <TableCell>Valor cotizado (Fases 1 y 2)</TableCell>
      <TableCell className="text-center font-mono">
        {includedHours.min}–{includedHours.max}h
      </TableCell>
      <TableCell className="text-right font-mono">
        {formatCOP(includedCostMin)} – {formatCOP(includedCostMax)}
      </TableCell>
    </TableRow>
  );

  return (
    <section className="mb-12">
      <h2 className="font-display text-h2 mb-2">Inversión del Proyecto</h2>
      <p className="text-muted-foreground mb-6">
        Desglose del valor real del proyecto basado en la tarifa por hora del desarrollador. La presente cotización
        cubre las Fases 1 y 2, con descuento de socio aplicado. La Fase 3 se cotizará por separado.
      </p>

      <div className="border border-border overflow-hidden mb-6">
        <div className="bg-muted px-4 py-3 border-b border-border">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Tarifa base por hora</span>
            <span className="font-mono font-semibold">{formatCOP(HOURLY_RATE)}/h</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Calculada sobre salario de {formatCOP(MONTHLY_SALARY)}/mes ÷ {HOURS_PER_MONTH} horas laborales
          </p>
        </div>

        <DataTable columns={columns} data={phaseData} footer={footerRow} />
      </div>

      <div className="border border-border overflow-hidden">
        <div className="divide-y divide-border">
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-sm text-muted-foreground">Valor promedio estimado (Fases 1 y 2)</span>
            <span className="font-mono text-sm">{formatCOP(avgIncludedCost)}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3 bg-accent">
            <span className="text-sm text-accent-foreground font-medium">
              Descuento de socio ({discountPercent.toFixed(1)}%)
            </span>
            <span className="font-mono text-sm text-accent-foreground">
              −{formatCOP(avgIncludedCost - FINAL_PRICE)}
            </span>
          </div>
          <div className="flex justify-between items-center px-4 py-4 bg-muted">
            <span className="font-bold text-lg">Precio final acordado</span>
            <span className="font-mono font-bold text-2xl">{formatCOP(FINAL_PRICE)}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        * La Fase 3 (Asistente de Redes Sociales, Certificados, Programa de Referidos) será cotizada de forma
        independiente una vez concluidas las Fases 1 y 2.
      </p>
    </section>
  );
}
