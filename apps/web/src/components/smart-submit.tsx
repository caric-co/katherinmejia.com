import { Button } from "@repo/ui/components/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/tooltip"
import { motion, AnimatePresence } from "motion/react"
import type { AnimationControls } from "motion/react"

interface SmartSubmitProps {
  id: string
  controls: AnimationControls
  isSubmitting: boolean
  isDisabled: boolean
  emptyFieldLabels: string[]
  label?: string
  submittingLabel?: string
  hint?: string
}

export function SmartSubmit({
  id,
  controls,
  isSubmitting,
  isDisabled,
  emptyFieldLabels,
  label = "Enviar",
  submittingLabel = "Enviando...",
  hint = "Presiona Enter para continuar",
}: SmartSubmitProps) {
  const isReady = (!isDisabled || isSubmitting) && !emptyFieldLabels.length

  const submitButton = (
    <motion.div animate={controls}>
      <Button id={id} type="submit" className="w-full h-11" disabled={isDisabled}>
        {isSubmitting ? submittingLabel : label}
      </Button>
    </motion.div>
  )

  if (isReady) {
    return (
      <div>
        {submitButton}
        <AnimatePresence>
          <motion.p
            key="hint"
            initial={{ height: 0, opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ height: "auto", opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{ height: { duration: 0.3 }, opacity: { duration: 0.2 }, clipPath: { duration: 0.4, delay: 0.15 } }}
            className="text-xs text-muted-foreground text-center mt-2 overflow-hidden"
          >
            {hint}
          </motion.p>
        </AnimatePresence>
      </div>
    )
  }

  if (emptyFieldLabels.length) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<div className="w-full" />}>
            {submitButton}
          </TooltipTrigger>
          <TooltipContent className="block">
            <p className="mb-1">Completa los campos:</p>
            <ul className="list-disc pl-4">
              {emptyFieldLabels.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return submitButton
}
