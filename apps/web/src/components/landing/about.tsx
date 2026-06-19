import { useTranslation } from "react-i18next"
import { useSiteContent, usePreviewMode, useFieldClick } from "#/lib/use-site-content"

export function About() {
  const { t } = useTranslation()
  const { t: c } = useSiteContent("about.")
  const isPreview = usePreviewMode()
  const onFieldClick = useFieldClick()

  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div
          className={`aspect-[4/5] bg-accent/30 bg-cover bg-center ${isPreview ? "cursor-pointer" : ""}`}
          style={{
            backgroundImage:
              `url('${c("about.image", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80")}')`,
          }}
          onClick={isPreview && onFieldClick ? () => onFieldClick("about.image") : undefined}
        />
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
            {t("nav.about")}
          </p>
          <h2 className="font-display text-h1 tracking-tight mb-6">
            {c("about.title", "Katherin Mejia")}
          </h2>
          <p className="text-foreground/70 mb-4 max-w-lg leading-relaxed">
            {c("about.bio", "Maquilladora profesional con más de 5 años de experiencia en el sector de la belleza. Especializada en maquillaje para eventos, sesiones fotográficas y contenido editorial.")}
          </p>
          <p className="text-foreground/70 max-w-lg leading-relaxed">
            {c("about.bio2", "Con una comunidad de más de 20.000 seguidores en Instagram, Katherin comparte su conocimiento a través de cursos en línea diseñados para que cualquier persona pueda aprender técnicas de maquillaje profesional desde casa.")}
          </p>
        </div>
      </div>
    </section>
  )
}
