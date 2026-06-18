import { useState } from "react";
import { QuoteHeader } from "./quote-header";
import { ReferencesSection } from "./references-section";
import { PlatformOverview } from "./platform-overview";
import { FeatureTable } from "./feature-table";
import { CostTable } from "./cost-table";
import { TechStackSection } from "./tech-stack-section";
import { PricingSection } from "./pricing-section";
import { NotesSection } from "./notes-section";
import { TrmInput } from "./trm-input";

interface QuoteViewProps {
  onBack: () => void;
}

export function QuoteView({ onBack }: QuoteViewProps) {
  const [trm, setTrm] = useState(3700);

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={onBack}
          className="text-sm text-text-muted hover:text-text transition-colors mb-6 cursor-pointer"
        >
          ← Volver al índice
        </button>

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
