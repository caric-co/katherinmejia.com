const testimonials = [
  {
    name: "María García",
    text: "Los cursos de Katherin transformaron mi manera de maquillarme. Las técnicas son claras y los resultados son increíbles.",
  },
  {
    name: "Laura Rodríguez",
    text: "Aprendí más en un curso de Katherin que en años intentando por mi cuenta. Su método es práctico y directo.",
  },
  {
    name: "Camila Torres",
    text: "El maquillaje para mi boda quedó espectacular. Katherin entiende exactamente lo que necesitas y lo ejecuta a la perfección.",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-muted">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
          Testimonios
        </p>
        <h2 className="font-display text-h1 tracking-tight mb-16">
          Lo que dicen nuestras clientas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name}>
              <blockquote className="font-display text-h3 leading-snug mb-6">
                "{t.text}"
              </blockquote>
              <p className="text-sm uppercase tracking-wider text-muted-foreground">
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
