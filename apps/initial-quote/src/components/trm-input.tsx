import { formatCOP } from "../data/format";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

interface TrmInputProps {
  trm: number;
  onTrmChange: (trm: number) => void;
}

export function TrmInput({ trm, onTrmChange }: TrmInputProps) {
  return (
    <div className="mb-10 p-4 rounded-lg border border-border bg-card flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3">
        <Label htmlFor="trm" className="text-sm font-semibold whitespace-nowrap">
          TRM (USD → COP)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            $
          </span>
          <Input
            id="trm"
            type="number"
            value={trm}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value > 0) onTrmChange(value);
            }}
            className="w-28 pl-7 font-mono"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        1 USD = {formatCOP(trm)} — Los costos originales en dólares se
        convierten a pesos colombianos con esta tasa. Los precios de Bold.co se
        expresan directamente en COP.
      </p>
    </div>
  );
}
