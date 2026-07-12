import { useState } from "react";

import { CropUpload, Image, useDevultur } from "@devultur/convex/react";
import type { DevulturMedia, Visibility } from "@devultur/core";
import { Download, ImagePlus, Loader2, Trash2 } from "lucide-react";

import { Button } from "@repo/ui/components/button";

interface ImageUploadProps {
  value: DevulturMedia | null;
  onChange: (media: DevulturMedia | null) => void;
  /** Called with the removed media when the user clears it, for immediate cleanup. */
  onDelete?: (media: DevulturMedia) => void;
  /** External URL (e.g. an Unsplash seed) shown when there is no devultur `value`. */
  externalFallback?: string;
  /** Visibility for uploads. Images here are public (og-safe, tokenless) by default. */
  visibility?: Visibility;
  /** Reject crops whose source is narrower than this (anti-upscaling). */
  minSourceWidth?: number;
  label?: string;
  /** CSS ratio string, e.g. "16/9", "4/3", "3/4". Drives the crop frame + preview box. */
  aspectRatio?: string;
  className?: string;
}

const overlayButton =
  "opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-white hover:bg-white/20";

export function ImageUpload({
  value,
  onChange,
  onDelete,
  externalFallback,
  visibility = "public",
  minSourceWidth,
  label,
  aspectRatio = "16/9",
  className,
}: ImageUploadProps) {
  const { url } = useDevultur();
  const [error, setError] = useState<string | null>(null);

  const [w, h] = aspectRatio.split("/").map(Number);
  const ratio = w && h ? w / h : 16 / 9;
  const downloadHref = value ? url(value, { download: true }) : null;

  return (
    <div className={className}>
      <CropUpload
        aspectRatio={ratio}
        visibility={visibility}
        outputFormat="webp"
        maxWidth={1920}
        minSourceWidth={minSourceWidth}
        accept={["image/jpeg", "image/png", "image/webp"]}
        onComplete={(media) => {
          setError(null);
          onChange(media);
        }}
        onReject={() => setError("La imagen es muy pequeña para este recorte")}
        cropperClassName="relative w-full h-72 overflow-hidden rounded-sm border border-border bg-muted"
      >
        {({ state, pickFile, pendingFile, cancel }) => {
          // While a file is pending, CropUpload renders the cropper (with its own zoom/confirm UI).
          if (pendingFile) return null;

          if (state.phase === "uploading") {
            return (
              <div
                className="flex items-center justify-center gap-2 rounded-sm border border-border bg-background"
                style={{ aspectRatio }}
              >
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Subiendo… {Math.round(state.percent)}%</span>
                <Button type="button" variant="ghost" size="xs" onClick={cancel}>
                  Cancelar
                </Button>
              </div>
            );
          }

          const displayMedia = value ?? (state.phase === "ready" ? state.media : null);

          if (displayMedia || externalFallback) {
            return (
              <div className="relative group rounded-sm overflow-hidden border border-border" style={{ aspectRatio }}>
                <Image
                  media={displayMedia}
                  externalFallback={externalFallback}
                  alt={label ?? "Imagen"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1">
                  {downloadHref && (
                    <Button
                      render={<a href={downloadHref} download />}
                      variant="ghost"
                      size="icon-sm"
                      className={overlayButton}
                    >
                      <Download className="size-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className={overlayButton}
                    onClick={pickFile}
                    title="Reemplazar"
                  >
                    <ImagePlus className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className={overlayButton}
                    onClick={() => {
                      if (!confirm("¿Eliminar esta imagen?")) return;
                      if (onDelete && value) onDelete(value);
                      onChange(null);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <button
              type="button"
              onClick={pickFile}
              className="flex w-full flex-col items-center justify-center border border-dashed rounded-sm cursor-pointer transition-colors border-input/60 bg-muted/30 hover:border-input text-muted-foreground"
              style={{ aspectRatio }}
            >
              <ImagePlus className="size-6" />
              <span className="text-xs mt-2">Subir imagen</span>
              <span className="text-xs text-muted-foreground/60">JPG, PNG o WebP · Recorte {aspectRatio}</span>
            </button>
          );
        }}
      </CropUpload>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
