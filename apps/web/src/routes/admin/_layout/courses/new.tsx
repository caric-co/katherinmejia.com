import { useState } from "react";

import { useDevultur } from "@devultur/convex/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction, useMutation } from "convex/react";
import { z } from "zod";

import { api } from "@convex/_generated/api";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { parseCOPInput, slugify } from "@repo/utils";

import { DescriptionField, PriceField } from "#/components/course-form-fields";
import { CourseCardPreview, CourseDetailPreview } from "#/components/course-preview";
import { FormField } from "#/components/form-field";
import { ImageUpload } from "#/components/image-upload";
import { SmartSubmit } from "#/components/smart-submit";
import { useSubmitPulse } from "#/lib/form-primitives";

export const Route = createFileRoute("/admin/_layout/courses/new")({
  component: NewCoursePage,
});

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
  const { uploadUrl, deleteMedia } = useDevultur();
  const [serverError, setServerError] = useState("");
  const [previewLang, setPreviewLang] = useState<"es" | "en">("es");
  const [titleEn, setTitleEn] = useState("");
  const [descEn, setDescEn] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
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
          price: parseCOPInput(value.price),
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
              onUploadUrl={uploadUrl}
              onDelete={deleteMedia}
              label="Thumbnail del curso"
              aspectRatio="4/3"
              className="max-w-sm"
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
            const price = parseCOPInput(values.price);

            return (
              <div className="p-6 space-y-8">
                <CourseCardPreview
                  title={previewTitle}
                  description={previewDesc}
                  price={price}
                  thumbnailUrl={thumbnailUrl ?? undefined}
                  lang={previewLang}
                />
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
