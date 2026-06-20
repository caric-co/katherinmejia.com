import { useState } from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction, useMutation } from "convex/react";
import { ImagePlus, Loader2 } from "lucide-react";

import { api } from "@convex/_generated/api";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";

import { CourseCardPreview, CourseDetailPreview } from "#/components/course-preview";

export const Route = createFileRoute("/admin/_layout/courses/new")({
  component: NewCoursePage,
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

function NewCoursePage() {
  const navigate = useNavigate();
  const createCourse = useMutation(api.courses.create);
  const translateAction = useAction(api.ai.translateText);

  const [titleEs, setTitleEs] = useState("");
  const [descEs, setDescEs] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [previewLang, setPreviewLang] = useState<"es" | "en">("es");
  const [titleEn, setTitleEn] = useState("");
  const [descEn, setDescEn] = useState("");

  const slug = slugify(titleEs);
  const price = parseCOP(priceDisplay);

  const previewTitle = previewLang === "es" ? titleEs : titleEn;
  const previewDesc = previewLang === "es" ? descEs : descEn;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEs.trim() || !descEs.trim()) return;

    setSaving(true);
    setError("");
    try {
      const [titleResult, descResult] = await Promise.all([
        translateAction({ text: titleEs }),
        translateAction({ text: descEs }),
      ]);

      const finalTitleEn = titleResult.translated || titleEs;
      const finalDescEn = descResult.translated || descEs;

      setTitleEn(finalTitleEn);
      setDescEn(finalDescEn);

      await createCourse({
        title: { es: titleEs, en: finalTitleEn },
        description: { es: descEs, en: finalDescEn },
        slug: { es: slug, en: slugify(finalTitleEn) },
        price,
      });
      navigate({ to: "/admin/courses" });
    } catch (err: any) {
      setError(err.message ?? "Error al crear el curso");
    }
    setSaving(false);
  };

  return (
    <div className="-m-6 flex h-[calc(100vh-theme(spacing.14))] xl:grid xl:grid-cols-2">
      {/* Form — scrollable */}
      <div className="overflow-y-auto p-6">
        <h1 className="font-display text-h2 mb-8">Nuevo Curso</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Título</Label>
            <Input
              value={titleEs}
              onChange={(e) => setTitleEs(e.target.value)}
              placeholder="Maquillaje Natural de Día"
              required
            />
            {slug && <p className="text-sm text-muted-foreground mt-1.5">/courses/{slug}</p>}
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Descripción</Label>
            <textarea
              value={descEs}
              onChange={(e) => setDescEs(e.target.value)}
              placeholder="Aprende las técnicas fundamentales para un maquillaje natural..."
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
                placeholder="149.900"
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

          {error && <p className="text-destructive">{error}</p>}

          <p className="text-xs text-muted-foreground">La traducción al inglés se genera automáticamente al crear.</p>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 data-icon="inline-start" className="size-3.5 animate-spin" />
                  Traduciendo y creando...
                </>
              ) : (
                "Crear curso"
              )}
            </Button>
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
          <CourseCardPreview title={previewTitle} description={previewDesc} price={price} lang={previewLang} />

          <Separator />

          <CourseDetailPreview title={previewTitle} description={previewDesc} price={price} lang={previewLang} />
        </div>
      </div>
    </div>
  );
}
