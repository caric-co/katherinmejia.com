import { serviceCosts, userScales } from "../data/quote";
import { formatUSD, formatCOP, formatNumber } from "../data/format";
import { useState } from "react";
import type { ServiceCost } from "../data/quote";

interface CostTableProps {
  trm: number;
}

function toCOP(amount: number, currency: "USD" | "COP", trm: number): number {
  return currency === "USD" ? amount * trm : amount;
}

function CostCell({
  service,
  scale,
  trm,
}: {
  service: ServiceCost;
  scale: number;
  trm: number;
}) {
  if (service.unit === "comisión/tx") {
    return (
      <span className="text-text-muted text-xs">
        comisión/tx
        <span className="block text-[10px]">(COP nativo)</span>
      </span>
    );
  }
  if (service.unit === "gratuito") {
    return <span className="text-success text-xs">Gratuito</span>;
  }

  const raw = service.monthlyCost[scale] ?? 0;
  const cop = toCOP(raw, service.currency, trm);

  return (
    <span>
      <span className="block">{formatCOP(cop)}</span>
      {service.currency === "USD" && raw > 0 && (
        <span className="block text-[10px] text-text-muted">
          {formatUSD(raw)} USD
        </span>
      )}
    </span>
  );
}

export function CostTable({ trm }: CostTableProps) {
  const [selectedScale, setSelectedScale] = useState<number>(1000);

  const requiredServices = serviceCosts.filter((s) => s.required);
  const optionalServices = serviceCosts.filter((s) => !s.required);

  const billableServices = requiredServices.filter(
    (s) => s.unit !== "comisión/tx" && s.unit !== "gratuito"
  );

  const totalCOPAtScale = billableServices.reduce(
    (sum, s) => sum + toCOP(s.monthlyCost[selectedScale] ?? 0, s.currency, trm),
    0
  );

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-2">
        Costos de Infraestructura Mensual
      </h2>
      <p className="text-text-muted mb-6">
        Costos reales de los servicios externos según la escala de usuarios
        activos mensuales. No incluye costos de desarrollo. Los precios
        originales en dólares se convierten a pesos colombianos con una TRM
        de {formatCOP(trm)}.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {userScales.map((scale) => (
          <button
            key={scale}
            onClick={() => setSelectedScale(scale)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              selectedScale === scale
                ? "bg-brand text-surface"
                : "bg-surface-overlay text-text-muted hover:text-text border border-border"
            }`}
          >
            {formatNumber(scale)} usuarios
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border mb-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-overlay text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left py-2.5 px-4 font-medium">Servicio</th>
              <th className="text-left py-2.5 px-4 font-medium">
                Descripción
              </th>
              <th className="text-center py-2.5 px-4 font-medium w-20">
                Moneda
              </th>
              <th className="text-left py-2.5 px-4 font-medium">
                Plan gratuito
              </th>
              <th className="text-right py-2.5 px-4 font-medium w-40">
                Costo/mes (COP)
              </th>
            </tr>
          </thead>
          <tbody>
            {requiredServices.map((service) => (
              <tr
                key={service.name}
                className="border-b border-border hover:bg-surface-raised transition-colors"
              >
                <td className="py-3 px-4 font-medium">{service.name}</td>
                <td className="py-3 px-4 text-text-muted">
                  {service.description}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      service.currency === "COP"
                        ? "bg-success/20 text-success"
                        : "bg-brand/20 text-brand"
                    }`}
                  >
                    {service.currency}
                  </span>
                </td>
                <td className="py-3 px-4 text-text-muted text-xs">
                  {service.freeTier ?? "—"}
                </td>
                <td className="py-3 px-4 text-right font-mono">
                  <CostCell
                    service={service}
                    scale={selectedScale}
                    trm={trm}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-surface-overlay font-semibold">
              <td className="py-3 px-4" colSpan={4}>
                Total estimado mensual @{" "}
                {formatNumber(selectedScale)} usuarios
              </td>
              <td className="py-3 px-4 text-right font-mono text-lg">
                <span className="block">{formatCOP(totalCOPAtScale)}</span>
                <span className="block text-xs font-normal text-text-muted">
                  {formatUSD(totalCOPAtScale / trm)} USD
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {optionalServices.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-text-muted">
            Alternativas Opcionales
          </h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-overlay text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left py-2.5 px-4 font-medium">
                    Servicio
                  </th>
                  <th className="text-left py-2.5 px-4 font-medium">
                    Descripción
                  </th>
                  <th className="text-center py-2.5 px-4 font-medium w-20">
                    Moneda
                  </th>
                  <th className="text-left py-2.5 px-4 font-medium">
                    Plan gratuito
                  </th>
                  <th className="text-right py-2.5 px-4 font-medium w-40">
                    Costo/mes (COP)
                  </th>
                </tr>
              </thead>
              <tbody>
                {optionalServices.map((service) => (
                  <tr
                    key={service.name}
                    className="border-b border-border hover:bg-surface-raised transition-colors"
                  >
                    <td className="py-3 px-4 font-medium">{service.name}</td>
                    <td className="py-3 px-4 text-text-muted">
                      {service.description}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-brand/20 text-brand">
                        {service.currency}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-muted text-xs">
                      {service.freeTier ?? "—"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <CostCell
                        service={service}
                        scale={selectedScale}
                        trm={trm}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-3">
          Escala de Costos Completa (COP)
        </h3>
        <div className="rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-overlay text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left py-2.5 px-4 font-medium">
                  Servicio
                </th>
                {userScales.map((scale) => (
                  <th
                    key={scale}
                    className="text-right py-2.5 px-3 font-medium"
                  >
                    {formatNumber(scale)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {billableServices.map((service) => (
                <tr
                  key={service.name}
                  className="border-b border-border hover:bg-surface-raised transition-colors"
                >
                  <td className="py-2 px-4 font-medium whitespace-nowrap">
                    {service.name}
                    <span className="ml-1 text-[10px] text-text-muted">
                      ({service.currency})
                    </span>
                  </td>
                  {userScales.map((scale) => {
                    const raw = service.monthlyCost[scale] ?? 0;
                    const cop = toCOP(raw, service.currency, trm);
                    return (
                      <td
                        key={scale}
                        className="py-2 px-3 text-right font-mono text-xs"
                      >
                        {formatCOP(cop)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-surface-overlay font-semibold">
                <td className="py-2.5 px-4">Total (COP)</td>
                {userScales.map((scale) => {
                  const total = billableServices.reduce(
                    (sum, s) =>
                      sum + toCOP(s.monthlyCost[scale] ?? 0, s.currency, trm),
                    0
                  );
                  return (
                    <td
                      key={scale}
                      className="py-2.5 px-3 text-right font-mono text-xs"
                    >
                      {formatCOP(total)}
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-surface-overlay/50 text-text-muted">
                <td className="py-2 px-4 text-xs">Total (USD ref.)</td>
                {userScales.map((scale) => {
                  const total = billableServices.reduce(
                    (sum, s) =>
                      sum + toCOP(s.monthlyCost[scale] ?? 0, s.currency, trm),
                    0
                  );
                  return (
                    <td
                      key={scale}
                      className="py-2 px-3 text-right font-mono text-[10px]"
                    >
                      {formatUSD(total / trm)}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-xs text-text-muted mt-2">
          * Precios originales en dólares convertidos con TRM de{" "}
          {formatCOP(trm)}. Bold.co cobra comisión por transacción (~2,89% +
          $300 COP); no genera costo fijo mensual. Better Auth es código
          abierto (gratuito).
        </p>
      </div>
    </section>
  );
}
