import { useCallback, useMemo, useState } from "react";

import { Check, Copy } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { type ColumnDef, DataTable } from "@repo/ui/components/data-table";
import { DataTableColumnHeader } from "@repo/ui/components/data-table-column-header";
import { TableCell, TableRow } from "@repo/ui/components/table";

import { formatCOP, formatNumber, formatUSD } from "../data/format";
import { type ServiceCost, serviceCosts, userScales } from "../data/quote";

interface CostTableProps {
  trm: number;
}

function toCOP(amount: number, currency: "USD" | "COP", trm: number): number {
  return currency === "USD" ? amount * trm : amount;
}

function formatCostCell(service: ServiceCost, scale: number, trm: number) {
  if (service.unit === "comisión/tx") return { label: "comisión/tx", sub: "(COP nativo)" };
  if (service.unit === "gratuito") return { label: "Gratuito", sub: null, isGreen: true };
  const raw = service.monthlyCost[scale] ?? 0;
  const cop = toCOP(raw, service.currency, trm);
  return {
    label: formatCOP(cop),
    sub: service.currency === "USD" && raw > 0 ? `${formatUSD(raw)} USD` : null,
  };
}

export function CostTable({ trm }: CostTableProps) {
  const [selectedScale, setSelectedScale] = useState<number>(1000);

  const requiredServices = serviceCosts.filter((s) => s.required);
  const optionalServices = serviceCosts.filter((s) => !s.required);
  const billableServices = requiredServices.filter((s) => s.unit !== "comisión/tx" && s.unit !== "gratuito");

  const totalCOPAtScale = billableServices.reduce(
    (sum, s) => sum + toCOP(s.monthlyCost[selectedScale] ?? 0, s.currency, trm),
    0,
  );

  const serviceColumns = useMemo<ColumnDef<ServiceCost>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Servicio" />,
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        enableHiding: false,
      },
      {
        accessorKey: "description",
        header: "Descripción",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.description}</span>,
      },
      {
        accessorKey: "currency",
        header: () => <div className="text-center">Moneda</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <Badge
              variant="outline"
              className={
                row.original.currency === "COP"
                  ? "bg-secondary text-secondary-foreground border-border"
                  : "bg-accent text-foreground"
              }
            >
              {row.original.currency}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "freeTier",
        header: "Plan gratuito",
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.freeTier ?? "—"}</span>,
      },
      {
        id: "cost",
        header: () => <div className="text-right">Costo/mes (COP)</div>,
        cell: ({ row }) => {
          const fmt = formatCostCell(row.original, selectedScale, trm);
          return (
            <div className="text-right font-mono">
              <span className={fmt.isGreen ? "text-foreground" : ""}>{fmt.label}</span>
              {fmt.sub && <span className="block text-xs text-muted-foreground">{fmt.sub}</span>}
            </div>
          );
        },
      },
    ],
    [selectedScale, trm],
  );

  const serviceFooter = (
    <TableRow className="bg-muted font-semibold">
      <TableCell colSpan={4}>Total estimado mensual @ {formatNumber(selectedScale)} usuarios</TableCell>
      <TableCell className="text-right font-mono text-base">
        <span className="block">{formatCOP(totalCOPAtScale)}</span>
        <span className="block text-xs font-normal text-muted-foreground">{formatUSD(totalCOPAtScale / trm)} USD</span>
      </TableCell>
    </TableRow>
  );

  const scaleColumns = useMemo<ColumnDef<ServiceCost>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Servicio",
        cell: ({ row }) => (
          <span className="font-medium whitespace-nowrap">
            {row.original.name}
            <span className="ml-1 text-xs text-muted-foreground">({row.original.currency})</span>
          </span>
        ),
        enableHiding: false,
      },
      ...userScales.map(
        (scale): ColumnDef<ServiceCost> => ({
          id: `scale-${scale}`,
          header: () => <div className="text-right">{formatNumber(scale)}</div>,
          cell: ({ row }) => {
            const raw = row.original.monthlyCost[scale] ?? 0;
            const cop = toCOP(raw, row.original.currency, trm);
            return <div className="text-right font-mono">{formatCOP(cop)}</div>;
          },
        }),
      ),
    ],
    [trm],
  );

  const scaleFooter = (
    <>
      <TableRow className="bg-muted font-semibold">
        <TableCell>Total (COP)</TableCell>
        {userScales.map((scale) => {
          const total = billableServices.reduce((sum, s) => sum + toCOP(s.monthlyCost[scale] ?? 0, s.currency, trm), 0);
          return (
            <TableCell key={scale} className="text-right font-mono">
              {formatCOP(total)}
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow className="text-muted-foreground">
        <TableCell>Total (USD ref.)</TableCell>
        {userScales.map((scale) => {
          const total = billableServices.reduce((sum, s) => sum + toCOP(s.monthlyCost[scale] ?? 0, s.currency, trm), 0);
          return (
            <TableCell key={scale} className="text-right font-mono text-xs">
              {formatUSD(total / trm)}
            </TableCell>
          );
        })}
      </TableRow>
    </>
  );

  return (
    <section className="mb-12">
      <h2 className="font-display text-h2 mb-2">Costos de Infraestructura Mensual</h2>
      <p className="text-muted-foreground mb-6">
        Costos reales de los servicios externos según la escala de usuarios activos mensuales. No incluye costos de
        desarrollo. Los precios originales en dólares se convierten a pesos colombianos con una TRM de {formatCOP(trm)}.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {userScales.map((scale) => (
          <Button
            key={scale}
            variant={selectedScale === scale ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedScale(scale)}
            className="rounded-full"
          >
            {formatNumber(scale)} usuarios
          </Button>
        ))}
      </div>

      <DataTable columns={serviceColumns} data={requiredServices} footer={serviceFooter} />

      {optionalServices.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Alternativas Opcionales</h3>
          <DataTable columns={serviceColumns} data={optionalServices} />
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Escala de Costos Completa (COP)</h3>
          <CopyCSVButton trm={trm} />
        </div>
        <DataTable columns={scaleColumns} data={billableServices} footer={scaleFooter} />
        <p className="text-xs text-muted-foreground mt-2">
          * Precios originales en dólares convertidos con TRM de {formatCOP(trm)}. Bold.co cobra comisión por
          transacción (~2,89% + $300 COP); no genera costo fijo mensual. Better Auth es código abierto (gratuito).
        </p>
      </div>
    </section>
  );
}

function CopyCSVButton({ trm }: { trm: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const billable = serviceCosts.filter((s) => s.required && s.unit !== "comisión/tx" && s.unit !== "gratuito");
    const header = ["Servicio", ...userScales.map((s) => `${formatNumber(s)} usuarios`)];
    const rows = billable.map((s) => [
      s.name,
      ...userScales.map((scale) => {
        const raw = s.monthlyCost[scale] ?? 0;
        const cop = s.currency === "USD" ? raw * trm : raw;
        return cop.toString();
      }),
    ]);
    const totals = [
      "Total",
      ...userScales.map((scale) =>
        billable
          .reduce((sum, s) => {
            const raw = s.monthlyCost[scale] ?? 0;
            return sum + (s.currency === "USD" ? raw * trm : raw);
          }, 0)
          .toString(),
      ),
    ];
    const csv = [header, ...rows, totals].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [trm]);

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <Check data-icon="inline-start" className="size-3.5" />
      ) : (
        <Copy data-icon="inline-start" className="size-3.5" />
      )}
      {copied ? "Copiado" : "Copiar CSV"}
    </Button>
  );
}
