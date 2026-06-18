import { DataTable, type ColumnDef } from "@repo/ui/components/data-table"
import { DataTableColumnHeader } from "@repo/ui/components/data-table-column-header"
import { TableRow, TableCell } from "@repo/ui/components/table"
import { features, type QuoteFeature } from "../data/quote"
import { Badge } from "@repo/ui/components/badge"

const complexityVariant = {
  low: "outline" as const,
  medium: "outline" as const,
  high: "outline" as const,
};

const complexityColor = {
  low: "text-foreground/70 border-border bg-secondary",
  medium: "text-foreground/80 border-peach bg-peach/20",
  high: "text-destructive border-destructive/30 bg-destructive/5",
};

const complexityLabel = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

const columns: ColumnDef<QuoteFeature>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Funcionalidad" />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-muted-foreground mt-0.5">
          {row.original.description}
        </div>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "phase",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Fase"
        className="justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent text-xs font-semibold">
          {row.original.phase}
        </span>
      </div>
    ),
  },
  {
    id: "hours",
    accessorFn: (row) => row.estimatedHours.min,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Horas Est."
        className="justify-center"
      />
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono">
        {row.original.estimatedHours.min}–{row.original.estimatedHours.max}h
      </div>
    ),
  },
  {
    accessorKey: "complexity",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Complejidad"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      const c = row.original.complexity;
      return (
        <div className="text-center">
          <Badge
            variant={complexityVariant[c]}
            className={complexityColor[c]}
          >
            {complexityLabel[c]}
          </Badge>
        </div>
      );
    },
  },
];

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
      <h2 className="text-2xl font-normal mb-6">Alcance y Estimación</h2>

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
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-foreground text-sm font-bold">
                {phase}
              </span>
              Fase {phase} — {phaseLabel}
              <span className="text-sm font-normal text-muted-foreground ml-auto font-mono">
                {phaseHours.min}–{phaseHours.max} horas
              </span>
            </h3>
            <DataTable
              columns={columns}
              data={phaseFeatures}
              emptyMessage="Sin funcionalidades en esta fase."
            />
          </div>
        );
      })}

      <div className="mt-6 p-4 rounded-lg bg-muted border border-border">
        <div className="flex justify-between items-center">
          <span className="font-semibold">
            Estimación total (todas las fases)
          </span>
          <span className="text-xl font-bold font-mono">
            {totalHours.min}–{totalHours.max} horas
          </span>
        </div>
      </div>
    </section>
  );
}
