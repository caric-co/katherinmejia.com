import { useTranslation } from "react-i18next"
import { Button } from "@repo/ui/components/button"
import { Link } from "@tanstack/react-router"

const mockCourses = [
  {
    title: "Maquillaje Natural de Día",
    description: "Aprende a crear un look fresco y natural perfecto para el día a día.",
    lessons: 12,
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80",
  },
  {
    title: "Contorno y Corrección",
    description: "Domina las técnicas de contorno para esculpir y definir tu rostro.",
    lessons: 8,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  },
  {
    title: "Maquillaje para Eventos",
    description: "Looks de alto impacto para bodas, galas y ocasiones especiales.",
    lessons: 15,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80",
  },
]

export function CoursesPreview() {
  const { t } = useTranslation()

  return (
    <section id="courses" className="py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              {t("nav.courses")}
            </p>
            <h2 className="font-display text-h1 tracking-tight max-w-xl">
              Aprende a tu ritmo con cursos profesionales
            </h2>
          </div>
          <Link to="/courses" className="hidden md:block">
            <Button variant="outline">Ver todos los cursos</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockCourses.map((course) => (
            <div key={course.title} className="group cursor-pointer">
              <div
                className="aspect-[4/3] bg-accent/30 bg-cover bg-center mb-4 overflow-hidden"
                style={{ backgroundImage: `url('${course.image}')` }}
              />
              <h3 className="font-semibold mb-1 group-hover:opacity-70 transition-opacity">
                {course.title}
              </h3>
              <p className="text-muted-foreground mb-2">{course.description}</p>
              <p className="text-sm text-muted-foreground">
                {course.lessons} lecciones
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link to="/courses">
            <Button variant="outline" className="w-full">
              Ver todos los cursos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
