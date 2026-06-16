import { useState } from "react";
import { QuoteHeader } from "./components/quote-header";
import { ReferencesSection } from "./components/references-section";
import { PlatformOverview } from "./components/platform-overview";
import { FeatureTable } from "./components/feature-table";
import { CostTable } from "./components/cost-table";
import { TechStackSection } from "./components/tech-stack-section";
import { PricingSection } from "./components/pricing-section";
import { NotesSection } from "./components/notes-section";
import { TrmInput } from "./components/trm-input";

export function App() {
  const [trm, setTrm] = useState(3700);

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <QuoteHeader />
        <TrmInput trm={trm} onTrmChange={setTrm} />
        <ReferencesSection />
        <PlatformOverview />
        <FeatureTable />
        <TechStackSection />
        <PricingSection />
        <CostTable trm={trm} />
        <NotesSection />

        <footer className="border-t border-border pt-6 mt-12 text-center text-sm text-text-muted">
          <p>
            Cotización generada el{" "}
            {new Date().toLocaleDateString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-1">
            Preparado por{" "}
            <a
              href="https://github.com/demarchenac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text font-semibold hover:text-brand transition-colors"
            >
              Cristhian De Marchena
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
