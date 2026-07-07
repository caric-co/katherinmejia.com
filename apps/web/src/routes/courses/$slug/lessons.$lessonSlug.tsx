import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { convexQuery } from "@convex-dev/react-query";
import { useDevultur, useDevulturMedia, useDevulturProgress, useMediaUrl } from "@devultur/convex/react";
import { captionPath, extractId } from "@devultur/core";
import { formatTime, VideoPlayer, type VideoPlayerRef } from "@devultur/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { api } from "@convex/_generated/api";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";

import { authClient } from "#/lib/auth-client";
import { media } from "#/lib/media";

export const Route = createFileRoute("/courses/$slug/lessons/$lessonSlug")({
  component: LessonPlayerPage,
});

const CAPTION_LABELS: Record<string, string> = { "es-CO": "Español (CO)", en: "English" };
const SAVE_INTERVAL = 10;

function LessonPlayerPage() {
  const { slug: courseSlug, lessonSlug } = Route.useParams();
  const { i18n } = useTranslation();
  const locale = i18n.language as "es" | "en";
  const { data: session } = authClient.useSession();
  const userId = session?.user?.email;

  const { data: course } = useQuery(convexQuery(api.courses.getBySlug, { slug: courseSlug }));
  const { data: lesson } = useQuery(convexQuery(api.lessons.getBySlug, { slug: lessonSlug }));
  const { data: lessons } = useQuery(convexQuery(api.lessons.listByCourse, course ? { courseId: course._id } : "skip"));
  const { data: access } = useQuery(
    convexQuery(
      api.access.hasAccess,
      userId && course && lesson ? { userId, courseId: course._id, lessonId: lesson._id } : "skip",
    ),
  );

  if (course === undefined || lesson === undefined || lessons === undefined) {
    return <PlayerShell courseSlug={courseSlug}>Cargando...</PlayerShell>;
  }

  if (!course || !lesson) {
    return (
      <PlayerShell courseSlug={courseSlug}>
        <div className="text-center py-16">
          <h1 className="font-display text-h2 mb-4">Lección no encontrada</h1>
          <Link to="/courses/$slug" params={{ slug: courseSlug }}>
            <Button variant="outline">Volver al curso</Button>
          </Link>
        </div>
      </PlayerShell>
    );
  }

  if (access && !access.hasAccess) {
    return (
      <PlayerShell courseSlug={courseSlug}>
        <div className="text-center py-16">
          <Lock className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-display text-h3 mb-2">Lección bloqueada</h2>
          <p className="text-muted-foreground mb-6">Compra el curso para acceder a esta lección</p>
          <Link to="/courses/$slug" params={{ slug: courseSlug }}>
            <Button>Ver curso</Button>
          </Link>
        </div>
      </PlayerShell>
    );
  }

  const currentIndex = lessons.findIndex((l) => l._id === lesson._id);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col min-w-0">
        <PlayerHeader course={course} lesson={lesson} locale={locale} courseSlug={courseSlug} />

        {access?.hasAccess ? (
          <LessonVideo
            lesson={lesson}
            userId={userId}
            lessons={lessons}
            currentIndex={currentIndex}
            courseSlug={courseSlug}
          />
        ) : (
          <div className="aspect-video bg-black flex items-center justify-center">
            <p className="text-white/50">Verificando acceso...</p>
          </div>
        )}

        <div className="p-6">
          <LessonNavigation lessons={lessons} currentIndex={currentIndex} courseSlug={courseSlug} locale={locale} />

          <Separator className="my-6" />

          <div className="max-w-3xl">
            <h2 className="font-display text-h3 mb-3">{lesson.title[locale]}</h2>
            {lesson.description?.[locale] && (
              <p className="text-muted-foreground leading-relaxed">{lesson.description[locale]}</p>
            )}
          </div>
        </div>
      </div>

      <LessonSidebar lessons={lessons} currentLessonId={lesson._id} courseSlug={courseSlug} locale={locale} />
    </div>
  );
}

function PlayerShell({ courseSlug, children }: { courseSlug: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b px-4 py-3">
        <Link to="/courses/$slug" params={{ slug: courseSlug }}>
          <Button variant="ghost" size="sm">
            <ArrowLeft data-icon="inline-start" className="size-3.5" />
            Volver al curso
          </Button>
        </Link>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function PlayerHeader({
  course,
  lesson,
  locale,
  courseSlug,
}: {
  course: { title: { es: string; en: string } };
  lesson: { title: { es: string; en: string } };
  locale: "es" | "en";
  courseSlug: string;
}) {
  return (
    <div className="border-b px-4 py-3 flex items-center gap-3">
      <Link to="/courses/$slug" params={{ slug: courseSlug }}>
        <Button variant="ghost" size="icon-sm">
          <ArrowLeft className="size-4" />
        </Button>
      </Link>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{course.title[locale]}</p>
        <p className="text-sm font-medium truncate">{lesson.title[locale]}</p>
      </div>
    </div>
  );
}

function LessonVideo({
  lesson,
  userId,
  lessons,
  currentIndex,
  courseSlug,
}: {
  lesson: { videoId: string; _id: string };
  userId?: string;
  lessons: Array<{ _id: string; slug?: string }>;
  currentIndex: number;
  courseSlug: string;
}) {
  const { token } = useDevultur();
  const mediaStatus = useDevulturMedia(lesson.videoId);
  const progress = useDevulturProgress();
  const playerRef = useRef<VideoPlayerRef>(null);
  const [initialTime, setInitialTime] = useState<number | null>(null);
  const lastSavedRef = useRef(0);

  useEffect(() => {
    if (!userId || !lesson.videoId) return;
    progress.load(lesson.videoId).then((p) => {
      setInitialTime(p?.lastPosition ?? 0);
    });
  }, [userId, lesson.videoId]);

  const handleProgress = useCallback(
    (currentTime: number) => {
      if (!userId || !lesson.videoId) return;
      if (Math.abs(currentTime - lastSavedRef.current) < SAVE_INTERVAL) return;
      lastSavedRef.current = currentTime;
      progress.save(lesson.videoId, currentTime);
    },
    [userId, lesson.videoId, progress],
  );

  const handleEnded = useCallback(() => {
    if (!userId || !lesson.videoId) return;
    progress.markComplete(lesson.videoId);

    const nextLesson = lessons[currentIndex + 1];
    if (nextLesson?.slug) {
      window.location.href = `/courses/${courseSlug}/lessons/${nextLesson.slug}`;
    }
  }, [userId, lesson.videoId, progress, lessons, currentIndex, courseSlug]);

  const playlistUrl = useMediaUrl(mediaStatus.playlistUrl);

  const captionTracks = useMemo(() => {
    if (!mediaStatus.isReady || !lesson.videoId || mediaStatus.captionLocales.length === 0) return [];
    const id = extractId(lesson.videoId);
    return mediaStatus.captionLocales.map((locale) => ({
      locale,
      label: CAPTION_LABELS[locale] ?? locale,
      src: media.getMediaUrl(captionPath(id, locale)),
    }));
  }, [mediaStatus.isReady, lesson.videoId, mediaStatus.captionLocales]);

  if (mediaStatus.isFailed) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center">
        <p className="text-red-400/80">
          No se pudo procesar este video. {mediaStatus.error ?? "Intenta de nuevo más tarde."}
        </p>
      </div>
    );
  }

  if (!mediaStatus.isReady || !playlistUrl || !token) {
    const statusLabel = mediaStatus.isQueued || mediaStatus.isTranscoding ? "Procesando video..." : "Cargando...";
    return (
      <div className="aspect-video bg-black flex items-center justify-center">
        <p className="text-white/50">{statusLabel}</p>
      </div>
    );
  }

  if (initialTime === null) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center">
        <p className="text-white/50">Cargando...</p>
      </div>
    );
  }

  return (
    <VideoPlayer
      ref={playerRef}
      src={playlistUrl}
      token={token ?? undefined}
      captions={captionTracks}
      defaultCaption="es-CO"
      initialTime={initialTime}
      aspectRatio="16/9"
      onProgress={handleProgress}
      onEnded={handleEnded}
    />
  );
}

function LessonNavigation({
  lessons,
  currentIndex,
  courseSlug,
  locale,
}: {
  lessons: Array<{ _id: string; slug?: string; title: { es: string; en: string } }>;
  currentIndex: number;
  courseSlug: string;
  locale: "es" | "en";
}) {
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="flex items-center justify-between gap-4">
      {prevLesson?.slug ? (
        <Link to="/courses/$slug/lessons/$lessonSlug" params={{ slug: courseSlug, lessonSlug: prevLesson.slug }}>
          <Button variant="outline" size="sm">
            <ChevronLeft data-icon="inline-start" className="size-3.5" />
            {prevLesson.title[locale]}
          </Button>
        </Link>
      ) : (
        <div />
      )}
      <span className="text-xs text-muted-foreground">
        {currentIndex + 1} / {lessons.length}
      </span>
      {nextLesson?.slug ? (
        <Link to="/courses/$slug/lessons/$lessonSlug" params={{ slug: courseSlug, lessonSlug: nextLesson.slug }}>
          <Button variant="outline" size="sm">
            {nextLesson.title[locale]}
            <ChevronRight data-icon="inline-end" className="size-3.5" />
          </Button>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

function LessonSidebar({
  lessons,
  currentLessonId,
  courseSlug,
  locale,
}: {
  lessons: Array<{
    _id: string;
    slug?: string;
    title: { es: string; en: string };
    order: number;
    isFree: boolean;
    videoId: string;
  }>;
  currentLessonId: string;
  courseSlug: string;
  locale: "es" | "en";
}) {
  return (
    <aside className="lg:w-80 xl:w-96 border-l bg-muted/30 overflow-y-auto">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm">Contenido del curso</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{lessons.length} lecciones</p>
      </div>
      <div className="divide-y">
        {lessons.map((l) => (
          <SidebarLesson
            key={l._id}
            lesson={l}
            isCurrent={l._id === currentLessonId}
            courseSlug={courseSlug}
            locale={locale}
          />
        ))}
      </div>
    </aside>
  );
}

function SidebarLesson({
  lesson,
  isCurrent,
  courseSlug,
  locale,
}: {
  lesson: {
    _id: string;
    slug?: string;
    title: { es: string; en: string };
    order: number;
    isFree: boolean;
    videoId: string;
  };
  isCurrent: boolean;
  courseSlug: string;
  locale: "es" | "en";
}) {
  const mediaStatus = useDevulturMedia(lesson.videoId !== "pending-upload" ? lesson.videoId : null);

  const content = (
    <div
      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
        isCurrent ? "bg-accent" : "hover:bg-muted/50"
      }`}
    >
      <span className="text-muted-foreground font-mono text-xs w-6 shrink-0">
        {lesson.order.toString().padStart(2, "0")}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`truncate ${isCurrent ? "font-medium" : ""}`}>{lesson.title[locale]}</p>
        {mediaStatus.duration ? (
          <p className="text-xs text-muted-foreground">{formatTime(mediaStatus.duration)}</p>
        ) : null}
      </div>
      {lesson.isFree && (
        <Badge variant="outline" className="text-[10px] shrink-0">
          Gratis
        </Badge>
      )}
    </div>
  );

  if (!lesson.slug) return content;

  return (
    <Link
      to="/courses/$slug/lessons/$lessonSlug"
      params={{ slug: courseSlug, lessonSlug: lesson.slug }}
      className="block"
    >
      {content}
    </Link>
  );
}
