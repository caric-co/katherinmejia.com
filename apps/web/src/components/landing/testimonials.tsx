import { useSiteContent } from "#/lib/use-site-content";

const defaults = [
  {
    nameKey: "testimonials.1.name",
    nameFallback: "María García",
    textKey: "testimonials.1.text",
    textFallback:
      "Los cursos de Katherin transformaron mi manera de maquillarme. Las técnicas son claras y los resultados son increíbles.",
  },
  {
    nameKey: "testimonials.2.name",
    nameFallback: "Laura Rodríguez",
    textKey: "testimonials.2.text",
    textFallback:
      "Aprendí más en un curso de Katherin que en años intentando por mi cuenta. Su método es práctico y directo.",
  },
  {
    nameKey: "testimonials.3.name",
    nameFallback: "Camila Torres",
    textKey: "testimonials.3.text",
    textFallback:
      "El maquillaje para mi boda quedó espectacular. Katherin entiende exactamente lo que necesitas y lo ejecuta a la perfección.",
  },
];

export function Testimonials() {
  const { t: c } = useSiteContent("testimonials.");

  return (
    <section className="py-24 md:py-32 px-6 md:px-10 bg-muted">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
          {c("testimonials.label", "Testimonios")}
        </p>
        <h2 className="font-display text-h1 tracking-tight mb-16">
          {c("testimonials.heading", "Lo que dicen nuestras clientas")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {defaults.map((t) => (
            <div key={t.nameKey}>
              <blockquote className="font-display text-h3 leading-snug mb-6">
                "{c(t.textKey, t.textFallback)}"
              </blockquote>
              <p className="text-sm uppercase tracking-wider text-muted-foreground">{c(t.nameKey, t.nameFallback)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
