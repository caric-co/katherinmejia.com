const references = [
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
];

export function ReferencesSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-2">Referencias de Diseño</h2>
      <p className="text-text-muted mb-6">
        El sitio de marca personal se desarrollará tomando como referencia estos
        proyectos premiados en Awwwards, ambos pertenecientes al sector de
        maquillaje profesional.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {references.map((ref) => (
          <div
            key={ref.name}
            className="rounded-lg border border-border p-5 bg-surface-raised"
          >
            <h3 className="font-semibold text-lg mb-1">{ref.name}</h3>
            <div className="flex gap-3 mb-4 text-xs">
              <a
                href={ref.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                Sitio web
              </a>
              <a
                href={ref.awwwards}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                Awwwards
              </a>
            </div>
            <ul className="space-y-1.5">
              {ref.highlights.map((h) => (
                <li
                  key={h}
                  className="text-sm text-text-muted flex items-start gap-2"
                >
                  <span className="text-brand mt-1 shrink-0">—</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-lg border border-border bg-surface-overlay">
        <p className="text-sm text-text-muted">
          <strong className="text-text">Elementos comunes a replicar:</strong>{" "}
          animaciones al desplazar, tipografía de alto impacto, fotografía
          profesional como protagonista, navegación minimalista, paleta oscura
          con acentos de color, transiciones fluidas entre secciones y diseño
          adaptable con prioridad móvil.
        </p>
      </div>
    </section>
  );
}
