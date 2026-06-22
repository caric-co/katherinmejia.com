import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { captionPath, extractId, videoHlsPlaylistPath } from "@devultur/core";
import { TranscriptPanel, UploadZone, useVideoProcessing, VideoPlayer, type VideoPlayerRef } from "@devultur/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useAction, useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Film,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { z } from "zod";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/tooltip";

import { FormField } from "#/components/form-field";
import { SmartSubmit } from "#/components/smart-submit";
import { useAutoAdvance, usePulse, useSubmitPulse } from "#/lib/form-primitives";
import { media } from "#/lib/media";

export const Route = createFileRoute("/admin/_layout/courses/$slug/lessons")({
  component: LessonsPage,
});

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve(Math.round(video.duration));
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => {
      resolve(0);
      URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(file);
  });
}

function LessonsPage() {
  const { slug: routeSlug } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();
  const course = useQuery(api.courses.getBySlug, { slug: routeSlug });
  const courseId = course?._id;
  const lessons = useQuery(api.lessons.listByCourse, courseId ? { courseId } : "skip");
  const reorderLessons = useMutation(api.lessons.reorder);
  const removeLesson = useMutation(api.lessons.remove);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"lessons"> | null>(null);

  if (course === undefined || lessons === undefined) {
    return <p className="text-muted-foreground">Cargando...</p>;
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0 || !lessons) return;
    const ids = lessons.map((l) => l._id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    await reorderLessons({ lessonIds: ids });
  };

  const handleMoveDown = async (index: number) => {
    if (!lessons || index === lessons.length - 1) return;
    const ids = lessons.map((l) => l._id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    await reorderLessons({ lessonIds: ids });
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => {
          if (router.history.length > 1) {
            router.history.back();
          } else {
            navigate({ to: "/admin/courses" });
          }
        }}
      >
        <ArrowLeft data-icon="inline-start" className="size-3.5" />
        Volver
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-h2">Lecciones</h1>
          <p className="text-muted-foreground">
            {course?.title.es}
            {lessons && (
              <span className="ml-2 text-sm">
                · {lessons.length} {lessons.length === 1 ? "lección" : "lecciones"}
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
        >
          <Plus data-icon="inline-start" className="size-4" />
          Nueva lección
        </Button>
      </div>

      {showForm && courseId && (
        <LessonForm
          courseId={courseId}
          courseSlug={routeSlug}
          lessonCount={lessons.length}
          onDone={() => setShowForm(false)}
        />
      )}

      {lessons.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">No hay lecciones. Crea la primera.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="text-center w-24">Duración</TableHead>
              <TableHead className="text-center w-20">Gratis</TableHead>
              <TableHead className="w-24 text-center">Orden</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.map((lesson, index) =>
              editingId === lesson._id ? (
                <TableRow key={lesson._id}>
                  <TableCell colSpan={6} className="p-0">
                    <LessonForm
                      courseId={courseId!}
                      courseSlug={routeSlug}
                      lessonCount={lessons.length}
                      lesson={lesson}
                      onDone={() => setEditingId(null)}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={lesson._id}>
                  <TableCell className="text-muted-foreground font-mono">{lesson.order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {lesson.isFree && (
                        <Badge variant="outline" className="text-xs">
                          Gratis
                        </Badge>
                      )}
                      <span className="font-medium">{lesson.title.es}</span>
                      <MediaStatusBadge status={lesson.mediaStatus} videoId={lesson.videoId} />
                    </div>
                    <div className="text-sm text-muted-foreground">{lesson.title.en}</div>
                    {lesson.description?.es && (
                      <div className="text-sm text-muted-foreground/70 mt-1 line-clamp-1">{lesson.description.es}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-mono">{formatDuration(lesson.duration)}</TableCell>
                  <TableCell className="text-center">
                    {lesson.isFree && <Badge variant="outline">Gratis</Badge>}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TooltipProvider delay={300}>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                disabled={index === 0}
                                onClick={() => handleMoveUp(index)}
                              />
                            }
                          >
                            <ChevronUp className="size-4" />
                          </TooltipTrigger>
                          <TooltipContent>Subir</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                disabled={index === lessons.length - 1}
                                onClick={() => handleMoveDown(index)}
                              />
                            }
                          >
                            <ChevronDown className="size-4" />
                          </TooltipTrigger>
                          <TooltipContent>Bajar</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingId(lesson._id);
                            setShowForm(false);
                          }}
                        >
                          <Pencil className="size-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => removeLesson({ lessonId: lesson._id })} variant="destructive">
                          <Trash2 className="size-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function MediaStatusBadge({ status, videoId }: { status?: string; videoId: string }) {
  if (videoId === "pending-upload") {
    return (
      <Badge variant="outline" className="text-xs">
        Sin video
      </Badge>
    );
  }
  if (status === "processing") {
    return (
      <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
        <Loader2 className="size-3 animate-spin mr-1" />
        Procesando
      </Badge>
    );
  }
  if (status === "error") {
    return (
      <Badge variant="outline" className="text-xs text-red-600 border-red-300">
        Error
      </Badge>
    );
  }
  if (status === "ready") {
    return (
      <Badge variant="outline" className="text-xs text-green-600 border-green-300">
        <CheckCircle2 className="size-3 mr-1" />
        Listo
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-xs">
      Video subido
    </Badge>
  );
}

const lessonSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string(),
});

const SUBMIT_ID = "lesson-submit";
const fieldLabels: Record<string, string> = { title: "Título" };

const STATUS_LABELS: Record<string, string> = {
  starting: "Iniciando...",
  transcoding: "Transcoding video...",
  captioning: "Generando subtítulos...",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function courseSlugPrefix(slug: string): string {
  return slug
    .split("-")
    .map((w) => w[0] ?? "")
    .join("");
}

function generateLessonSlug(courseSlug: string, sequence: number, title: string): string {
  const prefix = courseSlugPrefix(courseSlug);
  const seq = String(sequence).padStart(4, "0");
  const titleSlug = slugify(title).slice(0, 40);
  const ts = Math.floor(Date.now() / 1000);
  return `${prefix}-${seq}-${titleSlug}-${ts}`;
}

function LessonForm({
  courseId,
  courseSlug,
  lessonCount,
  lesson,
  onDone,
}: {
  courseId: Id<"courses">;
  courseSlug: string;
  lessonCount: number;
  lesson?: {
    _id: Id<"lessons">;
    title: { es: string; en: string };
    description: { es: string; en: string };
    duration: number;
    isFree: boolean;
    videoId?: string;
    mediaStatus?: string;
    captionLocales?: string[];
  };
  onDone: () => void;
}) {
  const createLesson = useMutation(api.lessons.create);
  const updateLesson = useMutation(api.lessons.update);
  const translateAction = useAction(api.ai.translateText);
  const generateMetadataAction = useAction(api.ai.generateLessonMetadata);

  const isEditing = !!lesson;
  const hasExistingVideo = isEditing && lesson.videoId && lesson.videoId !== "pending-upload";
  const isAlreadyReady = hasExistingVideo && lesson.mediaStatus === "ready";

  const [isFree, setIsFree] = useState(lesson?.isFree ?? false);
  const [videoKey, setVideoKey] = useState<string | null>(lesson?.videoId ?? null);
  const [videoDuration, setVideoDuration] = useState(lesson?.duration ?? 0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [serverError, setServerError] = useState("");
  const [savedAsDraft, setSavedAsDraft] = useState(false);
  const [generatingMeta, setGeneratingMeta] = useState(false);
  const hasAutoGenerated = useRef(false);
  const playerRef = useRef<VideoPlayerRef>(null);
  const [activeSubLocale, setActiveSubLocale] = useState<string>("es-CO");
  const [currentTime, setCurrentTime] = useState(0);
  const draftLessonIdRef = useRef<Id<"lessons"> | null>(lesson?._id ?? null);
  const submitControls = useSubmitPulse(SUBMIT_ID);

  const processing = useVideoProcessing(media, isAlreadyReady ? null : videoKey, {
    locales: ["es-CO", "en"],
    preset: "hls-720p",
    autoStart: true,
  });

  const authToken = import.meta.env.VITE_DEVULTUR_API_KEY;

  const existingVideoId = hasExistingVideo ? extractId(lesson.videoId!) : null;
  const existingPlaylistUrl =
    isAlreadyReady && existingVideoId ? media.getMediaUrl(videoHlsPlaylistPath(existingVideoId)) : null;
  const existingVttUrls = useMemo(() => {
    if (!isAlreadyReady || !existingVideoId || !lesson.captionLocales?.length) return {};
    const urls: Record<string, string> = {};
    for (const locale of lesson.captionLocales) {
      urls[locale] = media.getMediaUrl(captionPath(existingVideoId, locale));
    }
    return urls;
  }, [isAlreadyReady, existingVideoId, lesson?.captionLocales]);

  const playlistUrl = existingPlaylistUrl ?? processing.playlistUrl;
  const vttUrls = Object.keys(existingVttUrls).length > 0 ? existingVttUrls : processing.vttUrls;
  const isProcessing =
    !isAlreadyReady && processing.status !== "idle" && processing.status !== "ready" && processing.status !== "error";

  const captionTracks = useMemo(() => {
    return Object.entries(vttUrls).map(([locale, src]) => ({
      locale,
      label: locale === "es-CO" ? "Español" : "English",
      src,
    }));
  }, [vttUrls]);

  // Update Convex when processing completes (new uploads only)
  useEffect(() => {
    if (isAlreadyReady || processing.status !== "ready") return;
    const lessonId = draftLessonIdRef.current;
    if (!lessonId) return;

    const locales = Object.keys(processing.vttUrls);
    updateLesson({
      lessonId,
      mediaStatus: "ready",
      ...(locales.length ? { captionLocales: locales } : {}),
    }).catch(() => {});
  }, [isAlreadyReady, processing.status, processing.vttUrls, updateLesson]);

  const generateMetadata = useCallback(async () => {
    const esVttUrl = vttUrls["es-CO"];
    if (!esVttUrl || generatingMeta) return;

    setGeneratingMeta(true);
    try {
      const res = await fetch(esVttUrl, { headers: { Authorization: `Bearer ${authToken}` } });
      if (!res.ok) return;
      const vttText = await res.text();
      const plainText = vttText
        .split("\n")
        .filter(
          (line) => !line.includes("-->") && !line.match(/^\d+$/) && line.trim() !== "" && !line.startsWith("WEBVTT"),
        )
        .join(" ");

      const result = await generateMetadataAction({ transcript: plainText });
      if (result.title) {
        form.setFieldValue("title", result.title);
      }
      if (result.description) {
        form.setFieldValue("description", result.description);
      }
    } catch {}
    setGeneratingMeta(false);
  }, [vttUrls, authToken, generatingMeta, generateMetadataAction]);

  // Auto-generate metadata when captions first become available (new uploads only)
  useEffect(() => {
    if (hasAutoGenerated.current || isEditing) return;
    if (!vttUrls["es-CO"]) return;
    hasAutoGenerated.current = true;
    generateMetadata();
  }, [vttUrls, isEditing, generateMetadata]);

  const handleUploadUrl = async (file: File) => {
    const duration = await getVideoDuration(file);
    if (duration > 0) setVideoDuration(duration);

    const result = await media.createUploadUrl({
      filename: file.name,
      contentType: file.type,
    });
    return result;
  };

  const form = useForm({
    defaultValues: {
      title: lesson?.title.es ?? "",
      description: lesson?.description?.es ?? "",
    },
    validators: { onChange: lessonSchema },
    onSubmit: async ({ value }) => {
      setServerError("");
      try {
        const [titleResult, descResult] = await Promise.all([
          translateAction({ text: value.title }),
          value.description ? translateAction({ text: value.description }) : null,
        ]);

        const titleEn = titleResult.translated || value.title;
        const descEn = descResult?.translated || value.description || value.title;
        const lessonSlug = generateLessonSlug(courseSlug, lessonCount + 1, value.title);

        const lessonId = draftLessonIdRef.current ?? lesson?._id;
        if (lessonId) {
          await updateLesson({
            lessonId,
            title: { es: value.title, en: titleEn },
            slug: lessonSlug,
            description: { es: value.description, en: descEn },
            duration: videoDuration,
            isFree,
          });
        } else {
          await createLesson({
            courseId,
            title: { es: value.title, en: titleEn },
            slug: lessonSlug,
            description: { es: value.description, en: descEn },
            videoId: videoKey || "pending-upload",
            duration: videoDuration,
            isFree,
          });
        }
        onDone();
      } catch (err: any) {
        setServerError(err.message ?? "Error al guardar");
      }
    },
  });

  const saveDraft = useCallback(
    async (key: string, duration: number) => {
      const rawTitle = form.getFieldValue("title");
      const titleEs = rawTitle && rawTitle.length >= 3 ? rawTitle : "Lección sin nombrar";
      if (!rawTitle || rawTitle.length < 3) {
        form.setFieldValue("title", titleEs);
      }

      try {
        const titleEn =
          titleEs === "Lección sin nombrar"
            ? "Untitled lesson"
            : (await translateAction({ text: titleEs })).translated || titleEs;

        if (isEditing) {
          await updateLesson({
            lessonId: lesson._id,
            videoId: key,
            duration,
            mediaStatus: "processing",
          });
          draftLessonIdRef.current = lesson._id;
        } else {
          const newId = await createLesson({
            courseId,
            title: { es: titleEs, en: titleEn },
            description: { es: "", en: "" },
            videoId: key,
            duration,
            isFree: false,
            mediaStatus: "processing",
          });
          draftLessonIdRef.current = newId as Id<"lessons">;
        }
        setSavedAsDraft(true);
      } catch {}
    },
    [courseId, isEditing, lesson, createLesson, updateLesson, translateAction, form.getFieldValue, form.setFieldValue],
  );

  const handleUploadComplete = async (result: { key: string; file: File }) => {
    setVideoKey(result.key);
    setUploadedFileName(result.file.name);
    setUploadError(null);

    const duration = await getVideoDuration(result.file);
    if (duration > 0) setVideoDuration(duration);

    saveDraft(result.key, duration);
  };

  const handleUploadError = (error: Error) => {
    setUploadError(error.message);
  };

  const hasUploadedVideo = videoKey && videoKey !== "pending-upload";

  return (
    <div className="bg-muted p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">{isEditing ? "Editar lección" : "Nueva lección"}</h3>
          {savedAsDraft && (
            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
              Borrador guardado
            </Badge>
          )}
          {generatingMeta && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Generando metadatos...
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={generateMetadata}
            disabled={generatingMeta || !vttUrls["es-CO"]}
            title="Generar título y descripción desde la transcripción"
          >
            {generatingMeta ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onDone}>
            <X className="size-4" />
          </Button>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
            className="accent-foreground"
          />
          <span className="text-sm font-medium">Lección gratuita</span>
        </label>

        <form.Field
          name="title"
          children={(field) => (
            <FormField
              field={field}
              label="Título"
              placeholder="Preparación de la piel"
              autoFocus
              nextFieldId="description"
              submitId={SUBMIT_ID}
            />
          )}
        />

        <form.Field name="description" children={(field) => <LessonDescriptionField field={field} />} />

        <div>
          <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Video</Label>

          {playlistUrl && authToken && (
            <div
              className="mb-3 rounded-md overflow-hidden border border-border bg-black"
              style={{ aspectRatio: "16/9", maxHeight: "18rem" }}
            >
              <VideoPlayer
                ref={playerRef}
                src={`${playlistUrl}${playlistUrl.includes("?") ? "&" : "?"}token=${authToken}`}
                token={authToken}
                captions={captionTracks}
                defaultCaption="es-CO"
                aspectRatio="16/9"
                onProgress={(time) => setCurrentTime(time)}
              />
            </div>
          )}

          {videoDuration > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
              <Clock className="size-3.5" />
              <span>Duración: {formatDuration(videoDuration)}</span>
            </div>
          )}

          {hasUploadedVideo || hasExistingVideo ? (
            <div className="flex items-center gap-2 p-2 border border-border rounded-md bg-background mb-2">
              <Film className="size-4 text-muted-foreground shrink-0" />
              <span className="text-sm truncate flex-1">{uploadedFileName ?? lesson?.videoId ?? videoKey}</span>
              {isProcessing && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 shrink-0">
                  <Loader2 className="size-3 animate-spin" />
                  {STATUS_LABELS[processing.status] ?? processing.status}
                </div>
              )}
              {(isAlreadyReady || processing.status === "ready") && (
                <CheckCircle2 className="size-4 text-green-500 shrink-0" />
              )}
              {processing.status === "error" && (
                <span className="text-xs text-red-500 shrink-0">{processing.error}</span>
              )}
            </div>
          ) : (
            <UploadZone
              onUploadUrl={handleUploadUrl}
              onComplete={handleUploadComplete}
              onError={handleUploadError}
              accept={["video/mp4", "video/quicktime", "video/webm"]}
            >
              {({ getRootProps, getInputProps, isDragging, isUploading, progress, file: uploadFile }) => (
                <div
                  {...getRootProps()}
                  className={`relative flex flex-col items-center justify-center gap-2 p-6 border border-dashed rounded-md cursor-pointer transition-colors ${
                    isDragging
                      ? "border-foreground/50 bg-foreground/5"
                      : "border-muted-foreground/30 hover:border-muted-foreground/50 bg-background"
                  }`}
                >
                  <input {...getInputProps()} />
                  {isUploading ? (
                    <>
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Subiendo {uploadFile?.name}... {Math.round(progress)}%
                      </p>
                      <div className="w-full max-w-xs h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-foreground rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="size-6 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {isDragging ? "Suelta el video aquí" : "Arrastra un video o haz clic para seleccionar"}
                      </p>
                      <p className="text-xs text-muted-foreground/60">MP4, MOV o WebM · Máximo 2GB</p>
                    </>
                  )}
                </div>
              )}
            </UploadZone>
          )}
          {uploadError && <p className="text-sm text-red-500 mt-1">{uploadError}</p>}
        </div>

        {Object.keys(vttUrls).length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Label className="text-xs uppercase tracking-wider font-medium block">Subtítulos</Label>
                <span className="text-xs text-muted-foreground">
                  {activeSubLocale === "es-CO"
                    ? "Español (CO)"
                    : activeSubLocale === "en"
                      ? "English"
                      : activeSubLocale}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {Object.keys(vttUrls).map((locale) => (
                  <Button
                    key={locale}
                    type="button"
                    variant={activeSubLocale === locale ? "default" : "outline"}
                    size="xs"
                    onClick={() => setActiveSubLocale(locale)}
                  >
                    {locale === "es-CO" ? "ES" : locale.toUpperCase()}
                  </Button>
                ))}
                {vttUrls[activeSubLocale] && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={async () => {
                      const url = `${vttUrls[activeSubLocale]}${vttUrls[activeSubLocale].includes("?") ? "&" : "?"}token=${authToken}`;
                      const res = await fetch(url);
                      if (!res.ok) return;
                      const blob = new Blob([await res.text()], { type: "text/vtt" });
                      const href = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = href;
                      a.download = `${activeSubLocale}.vtt`;
                      a.click();
                      URL.revokeObjectURL(href);
                    }}
                  >
                    <Download className="size-3" />
                  </Button>
                )}
              </div>
            </div>
            <TranscriptPanel
              captions={captionTracks}
              locale={activeSubLocale}
              currentTime={currentTime}
              token={authToken}
              onSeek={(seconds) => {
                playerRef.current?.seek(seconds);
                playerRef.current?.play();
              }}
            />
          </div>
        )}

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <p className="text-xs text-muted-foreground">La traducción al inglés se genera automáticamente al guardar.</p>

        <form.Subscribe
          selector={(state) => [state.isSubmitting, state.canSubmit, state.isPristine, state.values] as const}
          children={([isSubmitting, canSubmit, isPristine, values]) => {
            const isDisabled = isSubmitting || !canSubmit || (isPristine && !videoKey && !savedAsDraft);
            const emptyFields = Object.entries(values as Record<string, string>)
              .filter(([k, v]) => !v && k !== "description")
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
                    label={isEditing || savedAsDraft ? "Guardar cambios" : "Agregar lección"}
                    submittingLabel="Traduciendo y guardando..."
                  />
                </div>
                <Button type="button" variant="ghost" className="h-11" onClick={onDone}>
                  Cancelar
                </Button>
              </div>
            );
          }}
        />
      </form>
    </div>
  );
}

function LessonDescriptionField({ field }: { field: any }) {
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const errorMessage = hasError ? (field.state.meta.errors[0]?.message ?? field.state.meta.errors[0]) : null;
  const controls = usePulse(field.name);

  const { inputRef, startTimer, onBlur } = useAutoAdvance({
    fieldId: field.name,
    submitId: SUBMIT_ID,
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
        placeholder="Descripción breve de la lección"
        className="flex field-sizing-content min-h-16 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
        aria-invalid={hasError}
      />
      <p className={`text-sm mt-1 min-h-5 ${errorMessage ? "text-destructive" : "text-transparent"}`}>
        {errorMessage ?? " "}
      </p>
    </motion.div>
  );
}
