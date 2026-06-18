import { createFileRoute } from "@tanstack/react-router"
import { DocFrame } from "#/components/doc-frame"

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
})

function PricingPage() {
  return (
    <DocFrame
      title="Costos de Plataforma y Modelo de Precios"
      src="/docs/research/PLATFORM_COSTS_AND_PRICING.html"
    />
  )
}
