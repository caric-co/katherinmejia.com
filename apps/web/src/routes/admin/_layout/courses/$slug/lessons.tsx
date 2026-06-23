import { useState } from "react";

import { useDevultur } from "@devultur/react/convex";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/tooltip";
import { formatDuration } from "@repo/utils";

import { LessonForm } from "#/components/lesson-form";

export const Route = createFileRoute("/admin/_layout/courses/$slug/lessons")({
  component: LessonsPage,
});

function LessonsPage() {
  const { slug: routeSlug } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();
  const course = useQuery(api.courses.getBySlug, { slug: routeSlug });
  const courseId = course?._id;
  const lessons = useQuery(api.lessons.listByCourse, courseId ? { courseId } : "skip");
  const reorderLessons = useMutation(api.lessons.reorder);
  const removeLesson = useMutation(api.lessons.remove);
  const { deleteVideo } = useDevultur();
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
                      <MediaStatusBadge status={lesson.transcodeStatus} videoId={lesson.videoId} />
                    </div>
                    <div className="text-sm text-muted-foreground">{lesson.title.en}</div>
                    {lesson.description?.es && (
                      <div className="text-sm text-muted-foreground/70 mt-1 line-clamp-1">{lesson.description.es}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-mono">{formatDuration(lesson.duration ?? 0)}</TableCell>
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
                        <DropdownMenuItem
                          onClick={async () => {
                            if (!confirm("¿Eliminar esta lección? Esta acción no se puede deshacer.")) return;
                            await removeLesson({ lessonId: lesson._id });
                            if (lesson.videoId && lesson.videoId !== "pending-upload") {
                              const id = lesson.videoId.split("/")[1];
                              if (id) deleteVideo(id);
                            }
                          }}
                          variant="destructive"
                        >
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
  if (videoId === "pending-upload")
    return (
      <Badge variant="outline" className="text-xs">
        Sin video
      </Badge>
    );
  if (status === "transcoding" || status === "captioning" || status === "processing") {
    return (
      <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
        <Loader2 className="size-3 animate-spin mr-1" />
        {status === "transcoding" ? "Transcoding" : status === "captioning" ? "Subtítulos" : "Procesando"}
      </Badge>
    );
  }
  if (status === "failed" || status === "error")
    return (
      <Badge variant="outline" className="text-xs text-red-600 border-red-300">
        Error
      </Badge>
    );
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
