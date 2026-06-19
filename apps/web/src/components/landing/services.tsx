import { useSiteContent, usePreviewMode, useFieldClick } from "#/lib/use-site-content"

const defaults = [
  {
    number: "01",
    titleKey: "services.1.title",
    titleFallback: "Maquillaje Natural",
    descKey: "services.1.description",
    descFallback: "Técnicas para realzar tu belleza natural con productos de alta calidad y acabado profesional.",
    imageKey: "services.1.image",
    imageFallback: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&q=80",
  },
  {
    number: "02",
    titleKey: "services.2.title",
    titleFallback: "Maquillaje Editorial",
    descKey: "services.2.description",
    descFallback: "Looks creativos y de alto impacto visual para sesiones fotográficas, campañas y portafolios.",
    imageKey: "services.2.image",
    imageFallback: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=600&q=80",
  },
  {
    number: "03",
    titleKey: "services.3.title",
    titleFallback: "Maquillaje para Eventos",
    descKey: "services.3.description",
    descFallback: "Preparación completa para bodas, quinceañeros, graduaciones y eventos especiales.",
    imageKey: "services.3.image",
    imageFallback: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&q=80",
  },
]

export function Services() {
  const { t: c } = useSiteContent("services.")
  const isPreview = usePreviewMode()
  const onFieldClick = useFieldClick()

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-muted">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
          {c("services.label", "Servicios")}
        </p>
        <h2 className="font-display text-h1 tracking-tight mb-16 max-w-2xl">
          {c("services.heading", "Transforma tu look con maquillaje profesional")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {defaults.map((service) => (
            <div key={service.number} className="group">
              <div
                className={`aspect-[3/4] bg-accent/30 bg-cover bg-center mb-5 overflow-hidden ${isPreview ? "cursor-pointer" : ""}`}
                style={{ backgroundImage: `url('${c(service.imageKey, service.imageFallback)}')` }}
                onClick={isPreview && onFieldClick ? () => onFieldClick(service.imageKey) : undefined}
              />
              <p className="text-sm text-muted-foreground font-mono mb-1">
                {service.number}/
              </p>
              <h3 className="font-display text-h3 mb-2">
                {c(service.titleKey, service.titleFallback)}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {c(service.descKey, service.descFallback)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
