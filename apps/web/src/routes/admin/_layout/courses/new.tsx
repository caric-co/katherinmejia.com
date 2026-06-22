import { useEffect, useState } from "react";

import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction, useMutation } from "convex/react";
import {} from "lucide-react";
import { motion } from "motion/react";
import { z } from "zod";

import { api } from "@convex/_generated/api";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";

import { CourseCardPreview, CourseDetailPreview } from "#/components/course-preview";
import { FormField } from "#/components/form-field";
import { ImageUpload } from "#/components/image-upload";
import { SmartSubmit } from "#/components/smart-submit";
import { triggerPulse, useAutoAdvance, usePulse, useSubmitPulse } from "#/lib/form-primitives";

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

const courseSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  price: z.string().min(1, "Ingresa un precio"),
});

const SUBMIT_ID = "create-course-submit";

const fieldLabels: Record<string, string> = {
  title: "Título",
  description: "Descripción",
  price: "Precio",
};

function NewCoursePage() {
  const navigate = useNavigate();
  const createCourse = useMutation(api.courses.create);
  const translateAction = useAction(api.ai.translateText);
  const issueViewerToken = useAction(api.devultur.issueViewerToken);
  const createUploadUrlAction = useAction(api.devultur.createUploadUrl);
  const [serverError, setServerError] = useState("");
  const [previewLang, setPreviewLang] = useState<"es" | "en">("es");
  const [titleEn, setTitleEn] = useState("");
  const [descEn, setDescEn] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [viewerToken, setViewerToken] = useState<string | null>(null);

  useEffect(() => {
    issueViewerToken().then(setViewerToken);
  }, [issueViewerToken]);
  const submitControls = useSubmitPulse(SUBMIT_ID);

  const form = useForm({
    defaultValues: { title: "", description: "", price: "" },
    validators: { onChange: courseSchema },
    onSubmit: async ({ value }) => {
      setServerError("");
      try {
        const [titleResult, descResult] = await Promise.all([
          translateAction({ text: value.title }),
          translateAction({ text: value.description }),
        ]);

        const finalTitleEn = titleResult.translated || value.title;
        const finalDescEn = descResult.translated || value.description;
        setTitleEn(finalTitleEn);
        setDescEn(finalDescEn);

        const slug = slugify(value.title);
        await createCourse({
          title: { es: value.title, en: finalTitleEn },
          description: { es: value.description, en: finalDescEn },
          slug: { es: slug, en: slugify(finalTitleEn) },
          price: parseCOP(value.price),
          ...(thumbnailUrl ? { thumbnailUrl } : {}),
        });
        navigate({ to: "/admin/courses" });
      } catch (err: any) {
        setServerError(err.message ?? "Error al crear el curso");
      }
    },
  });

  return (
    <div className="-m-6 flex h-[calc(100vh-theme(spacing.14))] xl:grid xl:grid-cols-2">
      <div className="overflow-y-auto p-6">
        <h1 className="font-display text-h2 mb-8">Nuevo Curso</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.Subscribe
            selector={(state) => state.values}
            children={(values) => {
              const slug = slugify(values.title);

              return (
                <>
                  <form.Field
                    name="title"
                    children={(field) => (
                      <FormField
                        field={field}
                        label="Título"
                        placeholder="Maquillaje Natural de Día"
                        autoFocus
                        nextFieldId="description"
                        submitId={SUBMIT_ID}
                        hint={slug ? `/courses/${slug}` : undefined}
                      />
                    )}
                  />

                  <form.Field
                    name="description"
                    children={(field) => <DescriptionField field={field} nextFieldId="price" />}
                  />

                  <form.Field name="price" children={(field) => <PriceField field={field} submitId={SUBMIT_ID} />} />
                </>
              );
            }}
          />

          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Thumbnail</Label>
            <ImageUpload
              value={thumbnailUrl}
              onChange={setThumbnailUrl}
              onUploadUrl={async (file) => {
                const r = await createUploadUrlAction({ filename: file.name, contentType: file.type });
                return { url: r.url, key: r.key };
              }}
              token={viewerToken}
              label="Thumbnail del curso"
            />
          </div>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <p className="text-xs text-muted-foreground">La traducción al inglés se genera automáticamente al crear.</p>

          <form.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit, state.isPristine, state.values] as const}
            children={([isSubmitting, canSubmit, isPristine, values]) => {
              const isDisabled = isSubmitting || !canSubmit || isPristine;
              const emptyFields = Object.entries(values as Record<string, string>)
                .filter(([, v]) => !v)
                .map(([k]) => fieldLabels[k] ?? k);

              return (
                <div className="flex gap-3 items-start">
                  <div className="flex-1">
                    <SmartSubmit
                      id={SUBMIT_ID}
                      controls={submitControls}
                      isSubmitting={isSubmitting}
                      isDisabled={isDisabled}
                      emptyFieldLabels={emptyFields}
                      label="Crear curso"
                      submittingLabel="Traduciendo y creando..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-11"
                    onClick={() => navigate({ to: "/admin/courses" })}
                  >
                    Cancelar
                  </Button>
                </div>
              );
            }}
          />
        </form>
      </div>

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

        <form.Subscribe
          selector={(state) => state.values}
          children={(values) => {
            const previewTitle = previewLang === "es" ? values.title : titleEn;
            const previewDesc = previewLang === "es" ? values.description : descEn;
            const price = parseCOP(values.price);

            return (
              <div className="p-6 space-y-8">
                <CourseCardPreview title={previewTitle} description={previewDesc} price={price} lang={previewLang} />
                <Separator />
                <CourseDetailPreview title={previewTitle} description={previewDesc} price={price} lang={previewLang} />
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

function DescriptionField({ field, nextFieldId, submitId }: { field: any; nextFieldId?: string; submitId?: string }) {
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const errorMessage = hasError ? (field.state.meta.errors[0]?.message ?? field.state.meta.errors[0]) : null;
  const controls = usePulse(field.name);

  const { inputRef, startTimer, onBlur } = useAutoAdvance({
    fieldId: field.name,
    nextFieldId,
    submitId,
    hasErrors: field.state.meta.errors.length > 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    field.handleChange(e.target.value);
    startTimer();
  };

  const handleBlur = () => {
    onBlur();
    field.handleBlur();
  };

  return (
    <motion.div animate={controls}>
      <Label
        htmlFor={field.name}
        className={`text-xs uppercase tracking-wider font-medium mb-2 block ${hasError ? "text-destructive" : ""}`}
      >
        Descripción
      </Label>
      <textarea
        ref={inputRef as unknown as React.RefObject<HTMLTextAreaElement>}
        id={field.name}
        value={field.state.value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Aprende las técnicas fundamentales para un maquillaje natural..."
        className="flex field-sizing-content min-h-24 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
        aria-invalid={hasError}
      />
      <p className={`text-sm mt-1 min-h-5 ${errorMessage ? "text-destructive" : "text-transparent"}`}>
        {errorMessage ?? " "}
      </p>
    </motion.div>
  );
}

function PriceField({ field, submitId }: { field: any; submitId?: string }) {
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const errorMessage = hasError ? (field.state.meta.errors[0]?.message ?? field.state.meta.errors[0]) : null;
  const controls = usePulse(field.name);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && submitId) {
      e.preventDefault();
      triggerPulse(submitId);
      document.getElementById(submitId)?.focus();
    }
  };

  return (
    <motion.div className="max-w-48" animate={controls}>
      <Label
        htmlFor={field.name}
        className={`text-xs uppercase tracking-wider font-medium mb-2 block ${hasError ? "text-destructive" : ""}`}
      >
        Precio (COP)
      </Label>
      <div className="relative">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
        <Input
          id={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(formatCOP(e.target.value))}
          onBlur={field.handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="149.900"
          className="pl-4"
          aria-invalid={hasError}
        />
      </div>
      <p className={`text-sm mt-1 min-h-5 ${errorMessage ? "text-destructive" : "text-transparent"}`}>
        {errorMessage ?? " "}
      </p>
    </motion.div>
  );
}
