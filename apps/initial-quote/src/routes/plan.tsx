import { createFileRoute } from "@tanstack/react-router"
import { DocFrame } from "#/components/doc-frame"

export const Route = createFileRoute("/plan")({
  component: PlanPage,
})

function PlanPage() {
  return (
    <DocFrame
      title="Plan de Implementación MVP"
      src="/docs/plans/MVP_PLAN.html"
    />
  )
}
