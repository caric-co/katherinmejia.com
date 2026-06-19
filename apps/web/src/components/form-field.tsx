import type { AnyFieldApi } from "@tanstack/react-form"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { useRef, useEffect, useCallback } from "react"
import { motion, useAnimationControls } from "motion/react"

function getErrorMessage(error: unknown): string | null {
  if (!error) return null
  if (typeof error === "string") return error
  if (typeof error === "object" && "message" in error) return (error as { message: string }).message
  return null
}

export const fieldAnimations = new Map<string, () => void>()

export function triggerFieldPulse(fieldId: string) {
  fieldAnimations.get(fieldId)?.()
}

interface FormFieldProps {
  field: AnyFieldApi
  label: string
  type?: string
  placeholder?: string
  className?: string
  autoFocus?: boolean
  nextFieldId?: string
  submitId?: string
  isFormValid?: boolean
}

export function FormField({
  field, label, type = "text", placeholder, className,
  autoFocus, nextFieldId, submitId, isFormValid,
}: FormFieldProps) {
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0
  const errorMessage = hasError ? getErrorMessage(field.state.meta.errors[0]) : null
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const controls = useAnimationControls()
  const isFormValidRef = useRef(isFormValid)
  isFormValidRef.current = isFormValid

  useEffect(() => {
    fieldAnimations.set(field.name, () => {
      controls.start({
        scale: [1, 1.03, 1],
        transition: { duration: 0.35, ease: "easeOut" },
      })
    })
    return () => { fieldAnimations.delete(field.name) }
  }, [field.name, controls])

  const focusTarget = useCallback(() => {
    if (isFormValidRef.current && submitId) {
      triggerFieldPulse(submitId)
      document.getElementById(submitId)?.focus()
      return
    }
    if (nextFieldId) {
      triggerFieldPulse(nextFieldId)
      document.getElementById(nextFieldId)?.focus()
    }
  }, [submitId, nextFieldId])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => () => clearTimer(), [clearTimer])

  const startTimer = useCallback(() => {
    clearTimer()
    if (!inputRef.current?.value) return
    if (!nextFieldId && !submitId) return

    timerRef.current = setTimeout(() => {
      if (document.activeElement !== inputRef.current) return
      if (field.state.meta.errors.length > 0) return
      focusTarget()
    }, 700)
  }, [clearTimer, nextFieldId, submitId, field.state.meta.errors.length, focusTarget])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.handleChange(e.target.value)
    startTimer()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      clearTimer()
      focusTarget()
      return
    }
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      clearTimer()
    }
  }

  const handleBlur = () => {
    clearTimer()
    field.handleBlur()
  }

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
        onKeyDown={handleKeyDown}
        aria-invalid={hasError}
        autoFocus={autoFocus}
      />
      {errorMessage && (
        <p className="text-sm text-destructive mt-1">{errorMessage}</p>
      )}
    </motion.div>
  )
}
