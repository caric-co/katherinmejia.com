const documents = [
  {
    category: "Cotización",
    items: [
      {
        title: "Cotización del Proyecto",
        description:
          "Propuesta ejecutiva con alcance, estimación de horas, inversión, costos de infraestructura y stack tecnológico",
        hash: "#quote",
        isInternal: true,
      },
    ],
  },
  {
    category: "Planes",
    items: [
      {
        title: "Plan de Implementación MVP",
        description:
          "10 fases de desarrollo, arquitectura del monorrepo, modelo de datos, mapa de rutas, referencia de diseño y decisiones técnicas",
        href: "/docs/plans/MVP_PLAN.html",
      },
    ],
  },
  {
    category: "Investigación",
    items: [
      {
        title: "Costos de Plataforma y Modelo de Precios",
        description:
          "Análisis financiero completo: costos por servicio de 10 a 1M usuarios, precios de suscripción recomendados, márgenes de rentabilidad y hitos de escala",
        href: "/docs/research/PLATFORM_COSTS_AND_PRICING.html",
      },
      {
        title: "Costos de Video Streaming",
        description:
          "Comparativa de Bunny Stream, Mux, Cloudflare Stream, R2 autoalojado y S3+CloudFront con costos por escala y estrategias de optimización",
        href: "/docs/research/VIDEO_STREAMING_COSTS.html",
      },
    ],
  },
];

interface FilePickerProps {
  onNavigateToQuote: () => void;
}

export function FilePicker({ onNavigateToQuote }: FilePickerProps) {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xs text-text-muted uppercase tracking-widest mb-2">
          Documentación del Proyecto
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          KMakeup Platform
        </h1>
        <p className="text-text-muted mb-10 max-w-xl">
          Plataforma de marca personal y cursos en línea para{" "}
          <strong className="text-text">Katherin Mejia</strong> (
          <a
            href="https://www.instagram.com/kmakeup_c"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            @kmakeup_c
          </a>
          ).
        </p>

        {documents.map((group) => (
          <div key={group.category} className="mb-8">
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              {group.category}
            </h2>
            <div className="space-y-3">
              {group.items.map((item) => {
                const isInternal = "isInternal" in item && item.isInternal;

                if (isInternal) {
                  return (
                    <button
                      key={item.title}
                      onClick={onNavigateToQuote}
                      className="w-full text-left group block rounded-lg border border-border p-4 bg-surface-raised hover:bg-surface-overlay transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold group-hover:text-brand transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-text-muted mt-0.5">
                            {item.description}
                          </p>
                        </div>
                        <span className="text-text-muted text-lg shrink-0">
                          →
                        </span>
                      </div>
                    </button>
                  );
                }

                return (
                  <a
                    key={item.title}
                    href={"href" in item ? item.href : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-lg border border-border p-4 bg-surface-raised hover:bg-surface-overlay transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold group-hover:text-brand transition-colors">
                          {item.title}
                          <span className="ml-2 text-xs font-normal text-text-muted">
                            HTML
                          </span>
                        </h3>
                        <p className="text-sm text-text-muted mt-0.5">
                          {item.description}
                        </p>
                      </div>
                      <span className="text-text-muted text-lg shrink-0">
                        ↗
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}

        <footer className="border-t border-border pt-6 mt-12 text-center text-sm text-text-muted">
          <p>
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
