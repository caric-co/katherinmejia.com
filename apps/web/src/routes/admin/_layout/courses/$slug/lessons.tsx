import { useState } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import { useAction, useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Languages,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  X,
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
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/tooltip";

export const Route = createFileRoute("/admin/_layout/courses/$slug/lessons")({
  component: LessonsPage,
});

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function LessonsPage() {
  const { slug: routeSlug } = Route.useParams();
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
      <Link to={`/admin/courses/${routeSlug}` as string}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft data-icon="inline-start" className="size-3.5" />
          Volver al curso
        </Button>
      </Link>

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

      {showForm && courseId && <LessonForm courseId={courseId} onDone={() => setShowForm(false)} />}

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
                    <LessonForm courseId={courseId!} lesson={lesson} onDone={() => setEditingId(null)} />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={lesson._id}>
                  <TableCell className="text-muted-foreground font-mono">{lesson.order}</TableCell>
                  <TableCell>
                    <div className="font-medium">{lesson.title.es}</div>
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

function LessonForm({
  courseId,
  lesson,
  onDone,
}: {
  courseId: Id<"courses">;
  lesson?: {
    _id: Id<"lessons">;
    title: { es: string; en: string };
    description: { es: string; en: string };
    duration: number;
    isFree: boolean;
  };
  onDone: () => void;
}) {
  const createLesson = useMutation(api.lessons.create);
  const updateLesson = useMutation(api.lessons.update);
  const translateAction = useAction(api.ai.translateText);

  const isEditing = !!lesson;

  const [titleEs, setTitleEs] = useState(lesson?.title.es ?? "");
  const [titleEn, setTitleEn] = useState(lesson?.title.en ?? "");
  const [descEs, setDescEs] = useState(lesson?.description?.es ?? "");
  const [descEn, setDescEn] = useState(lesson?.description?.en ?? "");
  const [duration, setDuration] = useState(lesson ? String(lesson.duration) : "");
  const [isFree, setIsFree] = useState(lesson?.isFree ?? false);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);

  const handleTranslate = async () => {
    setTranslating(true);
    try {
      if (titleEs && !titleEn) {
        const result = await translateAction({ text: titleEs });
        setTitleEn(result.translated);
      }
      if (descEs && !descEn) {
        const result = await translateAction({ text: descEs });
        setDescEn(result.translated);
      }
    } catch {}
    setTranslating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await updateLesson({
          lessonId: lesson._id,
          title: { es: titleEs, en: titleEn || titleEs },
          description: { es: descEs, en: descEn || descEs },
          duration: parseInt(duration, 10) || 0,
          isFree,
        });
      } else {
        await createLesson({
          courseId,
          title: { es: titleEs, en: titleEn || titleEs },
          description: { es: descEs, en: descEn || descEs },
          videoId: "pending-upload",
          duration: parseInt(duration, 10) || 0,
          isFree,
        });
      }
      onDone();
    } catch {}
    setLoading(false);
  };

  return (
    <div className="bg-muted p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{isEditing ? "Editar lección" : "Nueva lección"}</h3>
        <div className="flex items-center gap-2">
          {(titleEs || descEs) && (
            <Button type="button" variant="ghost" size="sm" onClick={handleTranslate} disabled={translating}>
              {translating ? (
                <Loader2 data-icon="inline-start" className="size-3.5 animate-spin" />
              ) : (
                <Languages data-icon="inline-start" className="size-3.5" />
              )}
              {translating ? "Traduciendo..." : "Auto-traducir EN"}
            </Button>
          )}
          <Button type="button" variant="ghost" size="icon-sm" onClick={onDone}>
            <X className="size-4" />
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Título (ES)</Label>
            <Input
              value={titleEs}
              onChange={(e) => setTitleEs(e.target.value)}
              placeholder="Preparación de la piel"
              required
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Título (EN)</Label>
            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Skin preparation" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Descripción (ES)</Label>
            <textarea
              value={descEs}
              onChange={(e) => setDescEs(e.target.value)}
              placeholder="Descripción breve de la lección"
              className="flex field-sizing-content min-h-16 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Descripción (EN)</Label>
            <textarea
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              placeholder="Short description"
              className="flex field-sizing-content min-h-16 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
            />
          </div>
        </div>
        <div className="flex gap-4 items-end">
          <div className="max-w-32">
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Duración (seg)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="720"
              required
            />
          </div>
          <label className="flex items-center gap-2 pb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="accent-foreground"
            />
            <span className="text-sm">Lección gratuita</span>
          </label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Agregar lección"}
          </Button>
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
