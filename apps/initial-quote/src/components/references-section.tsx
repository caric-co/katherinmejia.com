const references = [
  {
    name: "Evamuah",
    website: "https://www.evamuah.com/",
    awwwards: "https://www.awwwards.com/sites/evamuah",
    highlights: [
      "Portada con video de fondo",
      "Transiciones fluidas entre secciones",
      "Diseño editorial tipo revista",
      "Integración visual de redes sociales",
      "Diseño adaptable con prioridad móvil",
    ],
  },
  {
    name: "Evagher Makeup",
    website: "https://evagher.com/en",
    awwwards: "https://www.awwwards.com/sites/evagher-makeup",
    highlights: [
      "Animaciones cinematográficas al desplazar",
      "Galería de trabajos en formato panorámico",
      "Tipografía en negrita con alto contraste",
      "Paleta oscura con acentos dorados",
      "Navegación minimalista",
    ],
  },
];

export function ReferencesSection() {
  return (
    <section className="mb-12">
      <h2 className="font-display text-h2 mb-2">Referencias de Diseño</h2>
      <p className="text-muted-foreground mb-6">
        El sitio de marca personal se desarrollará tomando como referencia estos
        proyectos premiados en Awwwards, ambos pertenecientes al sector de
        maquillaje profesional.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {references.map((ref) => (
          <div
            key={ref.name}
            className="border border-border p-5 bg-card"
          >
            <h3 className="font-semibold text-lg mb-1">
              {ref.name}
            </h3>
            <div className="flex gap-3 mb-4 text-xs">
              <a
                href={ref.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:opacity-70"
              >
                Sitio web
              </a>
              <a
                href={ref.awwwards}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:opacity-70"
              >
                Awwwards
              </a>
            </div>
            <ul className="space-y-1.5">
              {ref.highlights.map((h) => (
                <li
                  key={h}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-foreground mt-1 shrink-0">—</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 border border-border bg-muted">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">
            Elementos comunes a replicar:
          </strong>{" "}
          animaciones al desplazar, tipografía de alto impacto, fotografía
          profesional como protagonista, navegación minimalista, paleta cálida
          con acentos suaves, transiciones fluidas entre secciones y diseño
          adaptable con prioridad móvil.
        </p>
      </div>
    </section>
  );
}
