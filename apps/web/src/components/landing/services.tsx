const services = [
  {
    number: "01",
    title: "Maquillaje Natural",
    description:
      "Técnicas para realzar tu belleza natural con productos de alta calidad y acabado profesional.",
    image:
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&q=80",
  },
  {
    number: "02",
    title: "Maquillaje Editorial",
    description:
      "Looks creativos y de alto impacto visual para sesiones fotográficas, campañas y portafolios.",
    image:
      "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=600&q=80",
  },
  {
    number: "03",
    title: "Maquillaje para Eventos",
    description:
      "Preparación completa para bodas, quinceañeros, graduaciones y eventos especiales.",
    image:
      "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&q=80",
  },
]

export function Services() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-muted">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
          Servicios
        </p>
        <h2 className="font-display text-h1 tracking-tight mb-16 max-w-2xl">
          Transforma tu look con maquillaje profesional
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.number} className="group">
              <div
                className="aspect-[3/4] bg-accent/30 bg-cover bg-center mb-5 overflow-hidden"
                style={{ backgroundImage: `url('${service.image}')` }}
              />
              <p className="text-sm text-muted-foreground font-mono mb-1">
                {service.number}/
              </p>
              <h3 className="font-display text-h3 mb-2">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
