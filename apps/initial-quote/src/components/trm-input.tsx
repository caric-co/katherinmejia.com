import { formatCOP } from "../data/format";

interface TrmInputProps {
  trm: number;
  onTrmChange: (trm: number) => void;
}

export function TrmInput({ trm, onTrmChange }: TrmInputProps) {
  return (
    <div className="mb-10 p-4 rounded-lg border border-border bg-surface-raised flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3">
        <label htmlFor="trm" className="text-sm font-semibold whitespace-nowrap">
          TRM (USD → COP)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
            $
          </span>
          <input
            id="trm"
            type="number"
            value={trm}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value > 0) onTrmChange(value);
            }}
            className="w-28 pl-7 pr-3 py-1.5 rounded-md bg-surface border border-border text-text text-sm font-mono focus:outline-none focus:border-brand"
          />
        </div>
      </div>
      <p className="text-xs text-text-muted">
        1 USD = {formatCOP(trm)} — Los costos originales en dólares se
        convierten a pesos colombianos con esta tasa. Los precios de Bold.co se
        expresan directamente en COP.
      </p>
    </div>
  );
}
