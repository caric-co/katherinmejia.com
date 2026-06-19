import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect, useCallback } from "react"

interface PreloaderProps {
  isContentReady: boolean
  onComplete: () => void
}

const PHASE_TIMINGS = {
  logo: 1000,
  line: 800,
  hold: 400,
}

const CURTAIN_DURATION = 0.8
const EASE = [0.22, 1, 0.36, 1] as const

export function Preloader({ isContentReady, onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<"logo" | "line" | "hold" | "curtain" | "done">("logo")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("line"), PHASE_TIMINGS.logo)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    if (phase === "line") {
      const t = setTimeout(() => setPhase("hold"), PHASE_TIMINGS.line)
      return () => clearTimeout(t)
    }
  }, [phase])

  useEffect(() => {
    if (phase === "hold" && isContentReady) {
      const t = setTimeout(() => setPhase("curtain"), PHASE_TIMINGS.hold)
      return () => clearTimeout(t)
    }
  }, [phase, isContentReady])

  useEffect(() => {
    if (phase === "curtain") {
      const t = setTimeout(() => {
        setPhase("done")
        onComplete()
      }, CURTAIN_DURATION * 1000 + 100)
      return () => clearTimeout(t)
    }
  }, [phase, onComplete])

  if (phase === "done") return null

  const isCurtain = phase === "curtain"

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Left curtain */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-background"
        animate={isCurtain ? { x: "-100%" } : { x: "0%" }}
        transition={{ duration: CURTAIN_DURATION, ease: EASE }}
      />
      {/* Right curtain */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-background"
        animate={isCurtain ? { x: "100%" } : { x: "0%" }}
        transition={{ duration: CURTAIN_DURATION, ease: EASE }}
      />

      {/* Center content — sits on top of both curtains */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        animate={isCurtain ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeIn" }}
      >
        {/* Wordmark */}
        <motion.h1
          className="font-display text-[clamp(2rem,6vw,3.5rem)] tracking-tight select-none"
          initial={{ color: "rgba(43, 38, 38, 0.1)" }}
          animate={{ color: "rgba(43, 38, 38, 1)" }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        <motion.h1
          className="font-display text-[clamp(2rem,6vw,3.5rem)] tracking-tight select-none absolute"
          initial={{ color: "rgba(43, 38, 38, 0.1)" }}
          animate={{ color: "rgba(43, 38, 38, 1)" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          Katherin Mejia
        </motion.h1>

        {/* Line + subtitle container */}
        <div className="flex flex-col items-center mt-6">
          <motion.div
            className="h-px bg-foreground/25"
            initial={{ width: 0 }}
            animate={
              phase !== "logo" ? { width: 200 } : { width: 0 }
            }
            transition={{ duration: 0.6, ease: EASE }}
          />
          <motion.p
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-3 select-none"
            initial={{ opacity: 0, y: 6 }}
            animate={
              phase !== "logo"
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 6 }
            }
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            Maquilladora Profesional
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
