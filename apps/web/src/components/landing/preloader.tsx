import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"

interface PreloaderProps {
  isContentReady: boolean
  onComplete: () => void
}

export function Preloader({ isContentReady, onComplete }: PreloaderProps) {
  const [phase, setPhase] = useState<"logo" | "line" | "reveal" | "done">("logo")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("line"), 800)
    const t2 = setTimeout(() => {
      if (isContentReady) {
        setPhase("reveal")
      }
    }, 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    if (phase === "line" && isContentReady) {
      const t = setTimeout(() => setPhase("reveal"), 200)
      return () => clearTimeout(t)
    }
  }, [phase, isContentReady])

  useEffect(() => {
    if (phase === "reveal") {
      const t = setTimeout(() => {
        setPhase("done")
        onComplete()
      }, 700)
      return () => clearTimeout(t)
    }
  }, [phase, onComplete])

  if (phase === "done") return null

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          animate={phase === "reveal" ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Wordmark */}
          <motion.h1
            className="font-display text-[clamp(2rem,6vw,3.5rem)] tracking-tight select-none"
            initial={{ color: "rgba(43, 38, 38, 0.15)" }}
            animate={
              phase === "logo"
                ? { color: "rgba(43, 38, 38, 1)" }
                : { color: "rgba(43, 38, 38, 1)" }
            }
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Katherin Mejia
          </motion.h1>

          {/* Horizontal line */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-px bg-foreground/30 -translate-x-1/2"
            style={{ top: "calc(50% + 2rem)" }}
            initial={{ width: 0 }}
            animate={
              phase === "line" || phase === "reveal"
                ? { width: "min(80%, 320px)" }
                : { width: 0 }
            }
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Subtitle */}
          <motion.p
            className="absolute text-xs uppercase tracking-[0.3em] text-muted-foreground select-none"
            style={{ top: "calc(50% + 3rem)" }}
            initial={{ opacity: 0, y: 4 }}
            animate={
              phase === "line" || phase === "reveal"
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 4 }
            }
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            Maquilladora Profesional
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
