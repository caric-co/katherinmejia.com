import { motion } from "motion/react";

import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { formatCOPInput } from "@repo/utils";

import { triggerPulse, useAutoAdvance, usePulse } from "#/lib/form-primitives";

export function DescriptionField({
  field,
  nextFieldId,
  submitId,
  placeholder = "Aprende las técnicas fundamentales para un maquillaje natural...",
}: {
  field: any;
  nextFieldId?: string;
  submitId?: string;
  placeholder?: string;
}) {
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const errorMessage = hasError ? (field.state.meta.errors[0]?.message ?? field.state.meta.errors[0]) : null;
  const controls = usePulse(field.name);

  const { inputRef, startTimer, onBlur } = useAutoAdvance({
    fieldId: field.name,
    nextFieldId,
    submitId,
    hasErrors: field.state.meta.errors.length > 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    field.handleChange(e.target.value);
    startTimer();
  };

  const handleBlur = () => {
    onBlur();
    field.handleBlur();
  };

  return (
    <motion.div animate={controls}>
      <Label
        htmlFor={field.name}
        className={`text-xs uppercase tracking-wider font-medium mb-2 block ${hasError ? "text-destructive" : ""}`}
      >
        Descripción
      </Label>
      <textarea
        ref={inputRef as unknown as React.RefObject<HTMLTextAreaElement>}
        id={field.name}
        value={field.state.value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="flex field-sizing-content min-h-24 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
        aria-invalid={hasError}
      />
      <p className={`text-sm mt-1 min-h-5 ${errorMessage ? "text-destructive" : "text-transparent"}`}>
        {errorMessage ?? " "}
      </p>
    </motion.div>
  );
}

export function PriceField({ field, submitId }: { field: any; submitId?: string }) {
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const errorMessage = hasError ? (field.state.meta.errors[0]?.message ?? field.state.meta.errors[0]) : null;
  const controls = usePulse(field.name);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && submitId) {
      e.preventDefault();
      triggerPulse(submitId);
      document.getElementById(submitId)?.focus();
    }
  };

  return (
    <motion.div className="max-w-48" animate={controls}>
      <Label
        htmlFor={field.name}
        className={`text-xs uppercase tracking-wider font-medium mb-2 block ${hasError ? "text-destructive" : ""}`}
      >
        Precio (COP)
      </Label>
      <div className="relative">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
        <Input
          id={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(formatCOPInput(e.target.value))}
          onBlur={field.handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="149.900"
          className="pl-4"
          aria-invalid={hasError}
        />
      </div>
      <p className={`text-sm mt-1 min-h-5 ${errorMessage ? "text-destructive" : "text-transparent"}`}>
        {errorMessage ?? " "}
      </p>
    </motion.div>
  );
}
