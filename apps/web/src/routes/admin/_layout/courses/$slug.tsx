import { useEffect, useState } from "react";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAction, useMutation, useQuery } from "convex/react";
import { BookOpen, ChevronDown, ChevronRight, ImagePlus, Languages, Loader2 } from "lucide-react";

import { api } from "@convex/_generated/api";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/tooltip";

import { CourseCardPreview, CourseDetailPreview } from "#/components/course-preview";

export const Route = createFileRoute("/admin/_layout/courses/$slug")({
  component: EditCoursePage,
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatCOP(value: string): string {
  const num = value.replace(/\D/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("es-CO");
}

function parseCOP(formatted: string): number {
  return parseInt(formatted.replace(/\D/g, ""), 10) || 0;
}

function EditCoursePage() {
  const { slug: routeSlug } = Route.useParams();
  const navigate = useNavigate();
  const course = useQuery(api.courses.getBySlug, { slug: routeSlug });
  const lessons = useQuery(api.lessons.listByCourse, course ? { courseId: course._id } : "skip");
  const updateCourse = useMutation(api.courses.update);
  const updateStatus = useMutation(api.courses.updateStatus);
  const translateAction = useAction(api.ai.translateText);

  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState("");
  const [showEn, setShowEn] = useState(false);
  const [previewLang, setPreviewLang] = useState<"es" | "en">("es");

  const [titleEs, setTitleEs] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descEs, setDescEs] = useState("");
  const [descEn, setDescEn] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");

  useEffect(() => {
    if (course) {
      setTitleEs(course.title.es);
      setTitleEn(course.title.en);
      setDescEs(course.description.es);
      setDescEn(course.description.en);
      setPriceDisplay(formatCOP(course.price.toString()));
    }
  }, [course]);

  if (course === undefined) return <p className="text-muted-foreground">Cargando...</p>;
  if (course === null) return <p className="text-destructive">Curso no encontrado</p>;

  const slugEs = slugify(titleEs);
  const price = parseCOP(priceDisplay);

  const previewTitle = previewLang === "es" ? titleEs : titleEn;
  const previewDesc = previewLang === "es" ? descEs : descEn;
  const previewLessons = (lessons ?? []).map((l) => ({
    title: previewLang === "es" ? l.title.es : l.title.en,
    description: previewLang === "es" ? l.description?.es : l.description?.en,
    duration: l.duration,
    isFree: l.isFree,
  }));

  const handleTranslate = async () => {
    if (!titleEs && !descEs) return;
    setTranslating(true);
    try {
      const translations = await Promise.all([
        titleEs && !titleEn ? translateAction({ text: titleEs }) : null,
        descEs && !descEn ? translateAction({ text: descEs }) : null,
      ]);
      if (translations[0]) setTitleEn(translations[0].translated);
      if (translations[1]) setDescEn(translations[1].translated);
      setShowEn(true);
    } catch {}
    setTranslating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let finalTitleEn = titleEn;
      let finalDescEn = descEn;

      if (!titleEn || !descEn) {
        const translations = await Promise.all([
          !titleEn ? translateAction({ text: titleEs }) : null,
          !descEn ? translateAction({ text: descEs }) : null,
        ]);
        if (translations[0]) finalTitleEn = translations[0].translated;
        if (translations[1]) finalDescEn = translations[1].translated;
      }

      await updateCourse({
        courseId: course._id,
        title: { es: titleEs, en: finalTitleEn || titleEs },
        description: { es: descEs, en: finalDescEn || descEs },
        slug: { es: slugEs, en: slugify(finalTitleEn || titleEs) },
        price,
      });
      navigate({ to: "/admin/courses" });
    } catch (err: any) {
      setError(err.message ?? "Error al actualizar");
    }
    setSaving(false);
  };

  const statusLabel = { draft: "Borrador", published: "Publicado", archived: "Archivado" };

  return (
    <div className="-m-6 flex h-[calc(100vh-theme(spacing.14))] xl:grid xl:grid-cols-2">
      {/* Form — scrollable */}
      <div className="overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-h2">Editar Curso</h1>
            <Badge variant={course.status === "published" ? "default" : "outline"}>{statusLabel[course.status]}</Badge>
          </div>
          <Link to={`/admin/courses/${routeSlug}/lessons` as string}>
            <Button variant="outline" size="sm">
              <BookOpen data-icon="inline-start" className="size-3.5" />
              Lecciones
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Título</Label>
            <Input value={titleEs} onChange={(e) => setTitleEs(e.target.value)} required />
            {slugEs && <p className="text-sm text-muted-foreground mt-1.5">/courses/{slugEs}</p>}
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Descripción</Label>
            <textarea
              value={descEs}
              onChange={(e) => setDescEs(e.target.value)}
              className="flex field-sizing-content min-h-24 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
              required
            />
          </div>

          <div className="max-w-48">
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Precio (COP)</Label>
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                value={priceDisplay}
                onChange={(e) => setPriceDisplay(formatCOP(e.target.value))}
                className="pl-4"
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Thumbnail</Label>
            <div className="flex items-center justify-center w-full h-40 border border-dashed border-input/60 rounded-sm bg-muted/30 text-muted-foreground cursor-not-allowed">
              <div className="flex flex-col items-center gap-2">
                <ImagePlus className="size-6" />
                <span className="text-xs">Próximamente</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* EN translation section */}
          <div>
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowEn(!showEn)}
            >
              {showEn ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
              Traducción inglés
              {titleEn && descEn && <span className="text-xs bg-muted px-1.5 py-0.5 rounded-sm">completa</span>}
            </button>

            {showEn && (
              <div className="mt-4 space-y-4 pl-5 border-l border-input/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Se genera automáticamente si está vacío al guardar.
                  </span>
                  <TooltipProvider delay={300}>
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleTranslate}
                            disabled={translating || (!titleEs && !descEs)}
                          />
                        }
                      >
                        {translating ? (
                          <Loader2 data-icon="inline-start" className="size-3.5 animate-spin" />
                        ) : (
                          <Languages data-icon="inline-start" className="size-3.5" />
                        )}
                        Traducir
                      </TooltipTrigger>
                      <TooltipContent>Traduce los campos vacíos EN desde ES con IA</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Title (EN)</Label>
                  <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Description (EN)</Label>
                  <textarea
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    className="flex field-sizing-content min-h-24 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
                  />
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-destructive">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 data-icon="inline-start" className="size-3.5 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
            {course.status === "draft" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => updateStatus({ courseId: course._id, status: "published" })}
              >
                Publicar
              </Button>
            )}
            {course.status === "published" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => updateStatus({ courseId: course._id, status: "draft" })}
              >
                Despublicar
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/admin/courses" })}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>

      {/* Preview panel — fixed */}
      <div className="hidden xl:flex flex-col border-l border-input/40 overflow-y-auto">
        <div className="flex items-center justify-between p-6 pb-0">
          <p className="text-sm text-muted-foreground">Vista previa</p>
          <div className="flex gap-1">
            <Button
              variant={previewLang === "es" ? "default" : "outline"}
              size="xs"
              onClick={() => setPreviewLang("es")}
            >
              ES
            </Button>
            <Button
              variant={previewLang === "en" ? "default" : "outline"}
              size="xs"
              onClick={() => setPreviewLang("en")}
            >
              EN
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <CourseCardPreview
            title={previewTitle}
            description={previewDesc}
            price={price}
            thumbnailUrl={course.thumbnailUrl}
            lang={previewLang}
          />

          <Separator />

          <CourseDetailPreview
            title={previewTitle}
            description={previewDesc}
            price={price}
            lang={previewLang}
            lessons={previewLessons}
          />
        </div>
      </div>
    </div>
  );
}
