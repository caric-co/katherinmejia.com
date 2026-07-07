import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { api } from "@convex/_generated/api";
import { Button } from "@repo/ui/components/button";

import { useAuthedMediaUrl } from "#/lib/use-authed-media-url";
import { useFieldClick, usePreviewMode, useSiteContent } from "#/lib/use-site-content";

export function CoursesPreview() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as "es" | "en";
  const { t: c } = useSiteContent("courses.");
  const isPreview = usePreviewMode();
  const onFieldClick = useFieldClick();
  const { data: courses } = useQuery(convexQuery(api.courses.listPublished, {}));

  const displayCourses = (courses ?? []).slice(0, 3);

  return (
    <section id="courses" className="py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p
              className={`text-sm uppercase tracking-widest text-muted-foreground mb-4 ${isPreview ? "cursor-pointer" : ""}`}
              onClick={isPreview && onFieldClick ? () => onFieldClick("courses.label") : undefined}
            >
              {c("courses.label", t("nav.courses"))}
            </p>
            <h2
              className={`font-display text-h1 tracking-tight max-w-xl ${isPreview ? "cursor-pointer" : ""}`}
              onClick={isPreview && onFieldClick ? () => onFieldClick("courses.heading") : undefined}
            >
              {c("courses.heading", "Aprende a tu ritmo con cursos profesionales")}
            </h2>
          </div>
          <Link to="/courses" className="hidden md:block">
            <Button variant="outline">Ver todos los cursos</Button>
          </Link>
        </div>

        {displayCourses.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">Próximamente: nuevos cursos disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayCourses.map((course) => (
              <Link key={course._id} to={`/courses/${course.slug[locale]}` as string} className="group">
                <CourseThumbnail url={course.thumbnailUrl} />
                <h3 className="font-semibold mb-1 group-hover:opacity-70 transition-opacity">{course.title[locale]}</h3>
                <p className="text-muted-foreground mb-2">{course.description[locale]}</p>
                {course.lessonCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {course.lessonCount} {course.lessonCount === 1 ? "lección" : "lecciones"}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 md:hidden">
          <Link to="/courses">
            <Button variant="outline" className="w-full">
              Ver todos los cursos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CourseThumbnail({ url }: { url?: string }) {
  const displayUrl = useAuthedMediaUrl(url);
  return (
    <div
      className="aspect-[4/3] bg-accent/30 bg-cover bg-center mb-4 overflow-hidden"
      style={displayUrl ? { backgroundImage: `url('${displayUrl}')` } : undefined}
    />
  );
}
