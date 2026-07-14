import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ConvexHttpClient } from "convex/browser";
import { ArrowLeft, Lock, PlayCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { api } from "@convex/_generated/api";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";

import { Footer } from "#/components/landing/footer";
import { Navigation } from "#/components/landing/navigation";
import { authClient } from "#/lib/auth-client";
import { publicImageUrl } from "#/lib/media";

const fetchCourseMeta = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const convexUrl = process.env.VITE_CONVEX_URL || import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) return null;
    const client = new ConvexHttpClient(convexUrl);
    const course = await client.query(api.courses.getBySlug, { slug });
    if (!course) return null;
    return {
      title: course.title,
      description: course.description,
      ogImage: course.thumbnail ? publicImageUrl(course.thumbnail) : null,
    };
  });

export const Route = createFileRoute("/courses/$slug")({
  loader: ({ params }) => fetchCourseMeta({ data: params.slug }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Curso no encontrado — Katherin Mejia" }] };
    }
    const title = `${loaderData.title.es} — Katherin Mejia`;
    const description = loaderData.description.es;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        ...(loaderData.ogImage ? [{ property: "og:image", content: loaderData.ogImage }] : []),
        { name: "twitter:card", content: loaderData.ogImage ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    };
  },
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const { slug } = Route.useParams();
  const { i18n } = useTranslation();
  const locale = i18n.language as "es" | "en";
  const { data: session } = authClient.useSession();
  const userId = session?.user?.email;
  const { data: course } = useQuery(convexQuery(api.courses.getBySlug, { slug }));
  const { data: lessons } = useQuery(convexQuery(api.lessons.listByCourse, course ? { courseId: course._id } : "skip"));
  const { data: access } = useQuery(
    convexQuery(api.access.hasAccess, userId && course ? { userId, courseId: course._id } : "skip"),
  );

  if (course === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 px-6 md:px-10 text-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (course === null) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 px-6 md:px-10 text-center">
          <h1 className="font-display text-h2 mb-4">Curso no encontrado</h1>
          <Link to="/courses">
            <Button variant="outline">Ver todos los cursos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalHours = 0;
  const hasAccess = Boolean(access?.hasAccess);
  const firstLessonSlug = lessons?.find((lesson) => lesson.slug)?.slug ?? null;
  const accessNote =
    access?.reason === "subscription"
      ? "Incluido en tu suscripción"
      : access?.reason === "purchased"
        ? "Ya tienes este curso"
        : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Link to="/courses">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft data-icon="inline-start" className="size-3.5" />
              Todos los cursos
            </Button>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-12">
            {/* Main content */}
            <div>
              <h1 className="font-display text-[clamp(2rem,4vw,3rem)] tracking-tight mb-4">{course.title[locale]}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">{course.description[locale]}</p>

              <Separator className="mb-8" />

              <h2 className="font-display text-h3 mb-6">Contenido del curso</h2>

              {lessons === undefined ? (
                <p className="text-muted-foreground">Cargando lecciones...</p>
              ) : lessons.length === 0 ? (
                <p className="text-muted-foreground">Contenido próximamente</p>
              ) : (
                <div className="space-y-1">
                  {lessons.map((lesson, i) => {
                    const isClickable = lesson.isFree || false;
                    const Wrapper =
                      isClickable && lesson.slug
                        ? ({ children }: { children: React.ReactNode }) => (
                            <Link
                              to="/courses/$slug/lessons/$lessonSlug"
                              params={{ slug, lessonSlug: lesson.slug! }}
                              className="block"
                            >
                              {children}
                            </Link>
                          )
                        : ({ children }: { children: React.ReactNode }) => <>{children}</>;

                    return (
                      <Wrapper key={lesson._id}>
                        <div
                          className={`flex items-center gap-4 py-4 border-b border-border last:border-0 ${isClickable ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}`}
                        >
                          <span className="text-sm text-muted-foreground font-mono w-8">
                            {(i + 1).toString().padStart(2, "0")}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{lesson.title[locale]}</span>
                              {lesson.isFree && (
                                <Badge variant="outline" className="text-xs">
                                  Gratis
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">{lesson.description[locale]}</p>
                          </div>
                          {lesson.isFree ? (
                            <PlayCircle className="size-5 text-foreground shrink-0" />
                          ) : (
                            <Lock className="size-4 text-muted-foreground/50 shrink-0" />
                          )}
                        </div>
                      </Wrapper>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:sticky md:top-20 h-fit">
              <div className="bg-muted p-6">
                <div className="text-center mb-6">
                  {hasAccess ? (
                    <p className="font-display text-2xl mb-1">Ya tienes acceso</p>
                  ) : (
                    <>
                      <p className="font-display text-3xl mb-1">${course.price.toLocaleString("es-CO")}</p>
                      <p className="text-sm text-muted-foreground">COP</p>
                    </>
                  )}
                </div>

                <div className="mb-4">
                  {hasAccess ? (
                    <>
                      {firstLessonSlug ? (
                        <Link to="/courses/$slug/lessons/$lessonSlug" params={{ slug, lessonSlug: firstLessonSlug }}>
                          <Button className="w-full">Continuar viendo</Button>
                        </Link>
                      ) : (
                        <Button className="w-full" disabled>
                          Contenido próximamente
                        </Button>
                      )}
                      {accessNote && <p className="text-xs text-center text-muted-foreground mt-2">{accessNote}</p>}
                    </>
                  ) : (
                    <Button className="w-full">Comprar curso</Button>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lecciones</span>
                    <span className="font-medium">{lessons?.length ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración total</span>
                    <span className="font-medium">{totalHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Idiomas</span>
                    <span className="font-medium">ES / EN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Acceso</span>
                    <span className="font-medium">Permanente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
