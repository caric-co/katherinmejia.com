import { useState } from "react";

import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAction, useMutation, useQuery } from "convex/react";
import { BookOpen } from "lucide-react";
import { z } from "zod";

import { api } from "@convex/_generated/api";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { formatCOPInput, parseCOPInput, slugify } from "@repo/utils";

import { DescriptionField, PriceField } from "#/components/course-form-fields";
import { CourseCardPreview, CourseDetailPreview } from "#/components/course-preview";
import { FormField } from "#/components/form-field";
import { ImageUpload } from "#/components/image-upload";
import { SmartSubmit } from "#/components/smart-submit";
import { useDevultur } from "#/hooks/use-devultur";
import { useSubmitPulse } from "#/lib/form-primitives";

export const Route = createFileRoute("/admin/_layout/courses/$slug/")({
  component: EditCoursePage,
});

const courseSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  price: z.string().min(1, "Ingresa un precio"),
});

const SUBMIT_ID = "edit-course-submit";

const fieldLabels: Record<string, string> = {
  title: "Título",
  description: "Descripción",
  price: "Precio",
};

function EditCoursePage() {
  const { slug: routeSlug } = Route.useParams();
  const navigate = useNavigate();
  const course = useQuery(api.courses.getBySlug, { slug: routeSlug });
  const lessons = useQuery(api.lessons.listByCourse, course ? { courseId: course._id } : "skip");
  const updateCourse = useMutation(api.courses.update);
  const updateStatus = useMutation(api.courses.updateStatus);
  const translateAction = useAction(api.ai.translateText);
  const { token: viewerToken, uploadUrl } = useDevultur();

  const [serverError, setServerError] = useState("");
  const [previewLang, setPreviewLang] = useState<"es" | "en">("es");
  const [titleEn, setTitleEn] = useState("");
  const [descEn, setDescEn] = useState("");
  const submitControls = useSubmitPulse(SUBMIT_ID);

  if (course === undefined) return <p className="text-muted-foreground">Cargando...</p>;
  if (course === null) return <p className="text-destructive">Curso no encontrado</p>;

  const previewLessons = (lessons ?? []).map((l) => ({
    title: previewLang === "es" ? l.title.es : l.title.en,
    description: previewLang === "es" ? l.description?.es : l.description?.en,
    duration: l.duration,
    isFree: l.isFree,
  }));

  const statusLabel = { draft: "Borrador", published: "Publicado", archived: "Archivado" };

  return (
    <EditCourseForm
      key={course._id}
      course={course}
      routeSlug={routeSlug}
      lessons={previewLessons}
      previewLang={previewLang}
      setPreviewLang={setPreviewLang}
      titleEn={titleEn || course.title.en}
      descEn={descEn || course.description.en}
      setTitleEn={setTitleEn}
      setDescEn={setDescEn}
      serverError={serverError}
      setServerError={setServerError}
      submitControls={submitControls}
      statusLabel={statusLabel}
      navigate={navigate}
      updateCourse={updateCourse}
      updateStatus={updateStatus}
      translateAction={translateAction}
      viewerToken={viewerToken}
      uploadUrl={uploadUrl}
    />
  );
}

function EditCourseForm({
  course,
  routeSlug,
  lessons,
  previewLang,
  setPreviewLang,
  titleEn,
  descEn,
  setTitleEn,
  setDescEn,
  serverError,
  setServerError,
  submitControls,
  statusLabel,
  navigate,
  updateCourse,
  updateStatus,
  translateAction,
  viewerToken,
  uploadUrl,
}: {
  course: any;
  routeSlug: string;
  lessons: any[];
  previewLang: "es" | "en";
  setPreviewLang: (lang: "es" | "en") => void;
  titleEn: string;
  descEn: string;
  setTitleEn: (v: string) => void;
  setDescEn: (v: string) => void;
  serverError: string;
  setServerError: (v: string) => void;
  submitControls: any;
  statusLabel: Record<string, string>;
  navigate: any;
  updateCourse: any;
  updateStatus: any;
  translateAction: any;
  viewerToken: string | null;
  uploadUrl: (file: File) => Promise<{ url: string; key: string }>;
}) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(course.thumbnailUrl ?? null);

  const form = useForm({
    defaultValues: {
      title: course.title.es,
      description: course.description.es,
      price: formatCOPInput(course.price.toString()),
    },
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

        const slugEs = slugify(value.title);
        await updateCourse({
          courseId: course._id,
          title: { es: value.title, en: finalTitleEn },
          description: { es: value.description, en: finalDescEn },
          slug: { es: slugEs, en: slugify(finalTitleEn) },
          price: parseCOPInput(value.price),
          thumbnailUrl: thumbnailUrl ?? undefined,
        });
        navigate({ to: "/admin/courses" });
      } catch (err: any) {
        setServerError(err.message ?? "Error al actualizar");
      }
    },
  });

  return (
    <div className="-m-6 flex h-[calc(100vh-theme(spacing.14))] xl:grid xl:grid-cols-2">
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
              token={viewerToken}
              label="Thumbnail del curso"
            />
          </div>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <p className="text-xs text-muted-foreground">
            La traducción al inglés se actualiza automáticamente al guardar.
          </p>

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
                      label="Guardar cambios"
                      submittingLabel="Traduciendo y guardando..."
                    />
                  </div>
                  {course.status === "draft" && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 flex-1"
                      onClick={() => updateStatus({ courseId: course._id, status: "published" })}
                    >
                      Publicar
                    </Button>
                  )}
                  {course.status === "published" && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 flex-1"
                      onClick={() => updateStatus({ courseId: course._id, status: "draft" })}
                    >
                      Despublicar
                    </Button>
                  )}
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
                  thumbnailUrl={course.thumbnailUrl}
                  lang={previewLang}
                />
                <Separator />
                <CourseDetailPreview
                  title={previewTitle}
                  description={previewDesc}
                  price={price}
                  lang={previewLang}
                  lessons={lessons}
                />
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
