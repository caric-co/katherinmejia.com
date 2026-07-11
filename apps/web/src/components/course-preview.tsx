import { Image } from "@devultur/convex/react";
import type { DevulturMedia } from "@devultur/core";
import { Clock, Lock, PlayCircle } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { formatDurationShort } from "@repo/utils";

interface CoursePreviewData {
  title: string;
  description: string;
  price: number;
  thumbnail?: DevulturMedia | null;
  lang?: "es" | "en";
  lessons?: Array<{
    title: string;
    description?: string;
    duration: number;
    isFree: boolean;
  }>;
}

const i18n = {
  es: {
    title: "Título del curso",
    description: "Descripción del curso...",
    buy: "Comprar curso",
    lessons: "lecciones",
    total: "total",
    content: "Contenido del curso",
    contentSoon: "Contenido próximamente",
    free: "Gratis",
    more: "lecciones más",
    lessonCount: "Lecciones",
    duration: "Duración total",
    languages: "Idiomas",
    access: "Acceso",
    permanent: "Permanente",
    noImage: "Sin imagen",
  },
  en: {
    title: "Course title",
    description: "Course description...",
    buy: "Buy course",
    lessons: "lessons",
    total: "total",
    content: "Course content",
    contentSoon: "Content coming soon",
    free: "Free",
    more: "more lessons",
    lessonCount: "Lessons",
    duration: "Total duration",
    languages: "Languages",
    access: "Access",
    permanent: "Lifetime",
    noImage: "No image",
  },
};

function formatPrice(price: number): string {
  if (!price) return "$0";
  return `$${price.toLocaleString("es-CO")}`;
}

export function CourseCardPreview({ title, description, price, thumbnail, lang = "es" }: CoursePreviewData) {
  const t = i18n[lang];
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Card del catálogo</p>
      <div className="max-w-sm mx-auto">
        <div className="aspect-[4/3] bg-accent/30 mb-4 overflow-hidden">
          <Image
            media={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
            fallback={
              <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                <span className="text-xs">{t.noImage}</span>
              </div>
            }
          />
        </div>
        <h2 className="font-semibold text-lg mb-1">{title || t.title}</h2>
        <p className="text-muted-foreground mb-2 line-clamp-2">{description || t.description}</p>
        <p className="font-mono text-sm">{formatPrice(price)} COP</p>
      </div>
    </div>
  );
}

export function CourseDetailPreview({ title, description, price, lang = "es", lessons = [] }: CoursePreviewData) {
  const t = i18n[lang];
  const totalDuration = lessons.reduce((sum, l) => sum + l.duration, 0);
  const totalHours = Math.round((totalDuration / 3600) * 10) / 10;

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Página de detalle</p>
      <div className="bg-muted/30 border border-input/30 p-6 rounded-sm">
        <h1 className="font-display text-xl tracking-tight mb-2">{title || t.title}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
          {description || t.description}
        </p>

        <div className="flex items-center gap-4 mb-4">
          <p className="font-display text-lg">{formatPrice(price)} COP</p>
          <Button className="text-xs h-8" size="sm" disabled>
            {t.buy}
          </Button>
        </div>

        <div className="flex gap-4 text-xs text-muted-foreground mb-4">
          <span>
            {lessons.length} {t.lessons}
          </span>
          <span>
            {totalHours}h {t.total}
          </span>
          <span>ES / EN</span>
        </div>

        {lessons.length > 0 ? (
          <>
            <Separator className="mb-3" />
            <p className="text-xs font-medium mb-2">{t.content}</p>
            <div className="space-y-0">
              {lessons.slice(0, 5).map((lesson, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                  <span className="text-xs text-muted-foreground font-mono w-5">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm truncate">{lesson.title}</span>
                      {lesson.isFree && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          {t.free}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="size-3" />
                    {formatDurationShort(lesson.duration)}
                  </div>
                  {lesson.isFree ? (
                    <PlayCircle className="size-3.5 text-foreground shrink-0" />
                  ) : (
                    <Lock className="size-3 text-muted-foreground/50 shrink-0" />
                  )}
                </div>
              ))}
              {lessons.length > 5 && (
                <p className="text-xs text-muted-foreground pt-2">
                  +{lessons.length - 5} {t.more}
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">{t.contentSoon}</p>
        )}
      </div>
    </div>
  );
}
