import { useCallback, useState } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@repo/ui/components/button";

import { CostTable } from "#/components/cost-table";
import { FeatureTable } from "#/components/feature-table";
import { NotesSection } from "#/components/notes-section";
import { PlatformOverview } from "#/components/platform-overview";
import { PricingSection } from "#/components/pricing-section";
import { QuoteHeader } from "#/components/quote-header";
import { ReferencesSection } from "#/components/references-section";
import { TechStackSection } from "#/components/tech-stack-section";
import { TrmInput } from "#/components/trm-input";

export const Route = createFileRoute("/quote")({
  component: QuotePage,
});

function QuotePage() {
  const [trm, setTrm] = useState(() => {
    if (typeof window === "undefined") return 3700;
    const saved = localStorage.getItem("kmakeup-trm");
    return saved ? parseFloat(saved) : 3700;
  });

  const handleTrmChange = useCallback((value: number) => {
    setTrm(value);
    localStorage.setItem("kmakeup-trm", value.toString());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft data-icon="inline-start" className="size-3.5" />
              Volver al índice
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer data-icon="inline-start" className="size-3.5" />
            Exportar PDF
          </Button>
        </div>

        <QuoteHeader />
        <TrmInput trm={trm} onTrmChange={handleTrmChange} />
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
  );
}
