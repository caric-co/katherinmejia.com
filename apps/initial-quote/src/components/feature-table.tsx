import { useState } from "react";

import { ChevronDown, ChevronsUpDown } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { type ColumnDef, DataTable } from "@repo/ui/components/data-table";
import { DataTableColumnHeader } from "@repo/ui/components/data-table-column-header";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/tooltip";

import { features, type QuoteFeature } from "../data/quote";

const complexityColor = {
  low: "text-foreground/70 border-border bg-secondary",
  medium: "text-foreground/80 border-peach bg-peach/20",
  high: "text-destructive border-destructive/30 bg-destructive/5",
};

const complexityLabel = { low: "Baja", medium: "Media", high: "Alta" };
const phaseLabels = { 1: "MVP", 2: "Crecimiento", 3: "Futuro" } as const;

const columns: ColumnDef<QuoteFeature>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Funcionalidad" />,
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-muted-foreground mt-0.5">{row.original.description}</div>
      </div>
    ),
    enableHiding: false,
  },
  {
    id: "hours",
    accessorFn: (row) => row.estimatedHours.min,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Horas Est." className="justify-center" />,
    cell: ({ row }) => (
      <div className="text-center font-mono">
        {row.original.estimatedHours.min}–{row.original.estimatedHours.max}h
      </div>
    ),
  },
  {
    accessorKey: "complexity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Complejidad" className="justify-center" />,
    cell: ({ row }) => {
      const c = row.original.complexity;
      return (
        <div className="text-center">
          <Badge variant="outline" className={complexityColor[c]}>
            {complexityLabel[c]}
          </Badge>
        </div>
      );
    },
  },
];

export function FeatureTable() {
  const phases = [1, 2, 3] as const;
  const [openPhases, setOpenPhases] = useState<Set<number>>(new Set([1]));

  const togglePhase = (phase: number) => {
    setOpenPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase);
      else next.add(phase);
      return next;
    });
  };

  const totalHours = features.reduce(
    (acc, f) => ({
      min: acc.min + f.estimatedHours.min,
      max: acc.max + f.estimatedHours.max,
    }),
    { min: 0, max: 0 },
  );

  const allOpen = phases.every((p) => openPhases.has(p));

  const toggleAll = () => {
    setOpenPhases(allOpen ? new Set() : new Set([1, 2, 3]));
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-h2">Alcance y Estimación</h2>
        <Button variant="ghost" size="sm" onClick={toggleAll}>
          <ChevronsUpDown data-icon="inline-start" className="size-3.5" />
          {allOpen ? "Colapsar todo" : "Expandir todo"}
        </Button>
      </div>

      {phases.map((phase) => {
        const phaseFeatures = features.filter((f) => f.phase === phase);
        if (phaseFeatures.length === 0) return null;

        const phaseHours = phaseFeatures.reduce(
          (acc, f) => ({
            min: acc.min + f.estimatedHours.min,
            max: acc.max + f.estimatedHours.max,
          }),
          { min: 0, max: 0 },
        );

        const isOpen = openPhases.has(phase);

        return (
          <div key={phase} className="mb-3">
            <button
              onClick={() => togglePhase(phase)}
              className="w-full text-left flex items-center gap-3 py-3 px-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <TooltipProvider delay={300}>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-foreground text-sm font-bold shrink-0" />
                    }
                  >
                    {phase}
                  </TooltipTrigger>
                  <TooltipContent>{phaseLabels[phase]}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-lg font-semibold flex-1">
                Fase {phase}: {phaseLabels[phase]}
              </span>
              <span className="text-sm text-muted-foreground font-mono mr-3">
                {phaseHours.min}–{phaseHours.max}h
              </span>
              <span className="text-xs text-muted-foreground mr-2">{phaseFeatures.length} items</span>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="mt-1 mb-4">
                <DataTable columns={columns} data={phaseFeatures} emptyMessage="Sin funcionalidades en esta fase." />
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-6 p-4 bg-muted border border-border">
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
