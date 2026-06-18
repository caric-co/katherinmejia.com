import { createFileRoute, Link } from "@tanstack/react-router"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@repo/ui/components/button"
import { QuoteHeader } from "#/components/quote-header"
import { ReferencesSection } from "#/components/references-section"
import { PlatformOverview } from "#/components/platform-overview"
import { FeatureTable } from "#/components/feature-table"
import { CostTable } from "#/components/cost-table"
import { TechStackSection } from "#/components/tech-stack-section"
import { PricingSection } from "#/components/pricing-section"
import { NotesSection } from "#/components/notes-section"
import { TrmInput } from "#/components/trm-input"

export const Route = createFileRoute("/quote")({
  component: QuotePage,
})

function QuotePage() {
  const [trm, setTrm] = useState(3700)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft data-icon="inline-start" className="size-3.5" />
            Volver al índice
          </Button>
        </Link>

        <QuoteHeader />
        <TrmInput trm={trm} onTrmChange={setTrm} />
        <ReferencesSection />
        <PlatformOverview />
        <FeatureTable />
        <TechStackSection />
        <PricingSection />
        <CostTable trm={trm} />
        <NotesSection />

        <footer className="border-t border-border pt-8 mt-14 text-center text-sm text-muted-foreground">
          <p>
            Cotización generada el{" "}
            {new Date().toLocaleDateString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-2">
            Preparado por{" "}
            <a
              href="https://github.com/demarchenac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-semibold hover:opacity-70 transition-opacity"
            >
              Cristhian De Marchena
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
