import type { AnyFieldApi } from "@tanstack/react-form";
import { motion } from "motion/react";

import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

import { useAutoAdvance, usePulse } from "#/lib/form-primitives";

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error) return (error as { message: string }).message;
  return null;
}

interface FormFieldProps {
  field: AnyFieldApi;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  nextFieldId?: string;
  submitId?: string;
  isFormValid?: boolean;
  hint?: string;
}

export function FormField({
  field,
  label,
  type = "text",
  placeholder,
  className,
  autoFocus,
  nextFieldId,
  submitId,
  isFormValid,
  hint,
}: FormFieldProps) {
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const errorMessage = hasError ? getErrorMessage(field.state.meta.errors[0]) : null;
  const controls = usePulse(field.name);

  const { inputRef, startTimer, onKeyDown, onBlur } = useAutoAdvance({
    fieldId: field.name,
    nextFieldId,
    submitId,
    isFormValid,
    hasErrors: field.state.meta.errors.length > 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.handleChange(e.target.value);
    startTimer();
  };

  const handleBlur = () => {
    onBlur();
    field.handleBlur();
  };

  const bottomText = errorMessage ?? hint ?? " ";
  const bottomClass = errorMessage ? "text-destructive" : hint ? "text-muted-foreground" : "text-transparent";

  return (
    <motion.div className={className} animate={controls}>
      <Label
        htmlFor={field.name}
        className={`text-xs uppercase tracking-wider font-medium mb-2 block ${hasError ? "text-destructive" : ""}`}
      >
        {label}
      </Label>
      <Input
        ref={inputRef}
        id={field.name}
        type={type}
        placeholder={placeholder}
        value={field.state.value}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        aria-invalid={hasError}
        autoFocus={autoFocus}
      />
      <p className={`text-sm mt-1 min-h-5 ${bottomClass}`}>{bottomText}</p>
    </motion.div>
  );
}
