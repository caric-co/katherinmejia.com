import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRight, ExternalLink } from "lucide-react"

const documents = [
  {
    category: "Cotización",
    items: [
      {
        title: "Cotización del Proyecto",
        description:
          "Propuesta ejecutiva con alcance, estimación de horas, inversión, costos de infraestructura y stack tecnológico",
        to: "/quote" as const,
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
        to: "/plan" as const,
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
        to: "/pricing" as const,
      },
      {
        title: "Costos de Video Streaming",
        description:
          "Comparativa de Bunny Stream, Mux, Cloudflare Stream, R2 autoalojado y S3+CloudFront con costos por escala y estrategias de optimización",
        to: "/video-costs" as const,
      },
    ],
  },
]

export const Route = createFileRoute("/")({
  component: IndexPage,
})

function IndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-3">
          Documentación del Proyecto
        </p>
        <h1 className="font-display text-h1 tracking-tight mb-3">
          KMakeup Platform
        </h1>
        <p className="text-body text-muted-foreground mb-12 max-w-xl">
          Plataforma de marca personal y cursos en línea para{" "}
          <strong className="text-foreground">Katherin Mejia</strong> (
          <a
            href="https://www.instagram.com/kmakeup_c"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-2 hover:opacity-70"
          >
            @kmakeup_c
          </a>
          ).
        </p>

        {documents.map((group) => (
          <div key={group.category} className="mb-10">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              {group.category}
            </h2>
            <div className="space-y-3">
              {group.items.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="group block border border-border p-5 bg-card hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-body font-semibold group-hover:opacity-70 transition-opacity">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="size-5 text-muted-foreground shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-14 pt-6 border-t border-border">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Enlaces Externos
          </h2>
          <div className="flex gap-6">
            <a
              href="https://github.com/caric-co/katherinmejia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              Repositorio <ExternalLink className="size-3.5" />
            </a>
            <a
              href="https://www.instagram.com/kmakeup_c"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              Instagram <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>

        <footer className="pt-8 mt-10 text-center text-sm text-muted-foreground">
          <p>
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
