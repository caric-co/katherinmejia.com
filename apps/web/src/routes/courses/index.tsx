import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { useTranslation } from "react-i18next";

import { api } from "@convex/_generated/api";

import { Footer } from "#/components/landing/footer";
import { Navigation } from "#/components/landing/navigation";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Cursos — Katherin Mejia" },
      {
        name: "description",
        content:
          "Cursos de maquillaje profesional por Katherin Mejia. Aprende técnicas de maquillaje natural, glam y más.",
      },
      { property: "og:title", content: "Cursos — Katherin Mejia" },
      {
        property: "og:description",
        content:
          "Cursos de maquillaje profesional por Katherin Mejia. Aprende técnicas de maquillaje natural, glam y más.",
      },
    ],
  }),
  component: CourseCatalogPage,
});

function CourseCatalogPage() {
  const { t, i18n } = useTranslation();
  const courses = useQuery(api.courses.listPublished);
  const locale = i18n.language as "es" | "en";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">{t("nav.courses")}</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] tracking-tight mb-12 max-w-2xl">
            Cursos de maquillaje profesional
          </h1>

          {courses === undefined ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : courses.length === 0 ? (
            <p className="text-muted-foreground py-16 text-center">Próximamente: cursos disponibles</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Link key={course._id} to={`/courses/${course.slug[locale]}` as string} className="group">
                  <div className="aspect-[4/3] bg-accent/30 mb-4 overflow-hidden">
                    {course.thumbnailUrl && (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title[locale]}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h2 className="font-semibold text-lg mb-1 group-hover:opacity-70 transition-opacity">
                    {course.title[locale]}
                  </h2>
                  <p className="text-muted-foreground mb-2 line-clamp-2">{course.description[locale]}</p>
                  <p className="font-mono text-sm">${course.price.toLocaleString("es-CO")} COP</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
