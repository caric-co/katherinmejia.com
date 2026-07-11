import { useRef, useState } from "react";

import { Image, useDevultur } from "@devultur/convex/react";
import type { DevulturMedia, Visibility } from "@devultur/core";
import { Download, ImagePlus, Loader2, Trash2 } from "lucide-react";

import { Button } from "@repo/ui/components/button";

import { uploadErrorMessage } from "#/lib/upload-error";

interface ImageUploadProps {
  value: DevulturMedia | null;
  onChange: (media: DevulturMedia | null) => void;
  /** Called with the removed media when the user clears it, for immediate cleanup. */
  onDelete?: (media: DevulturMedia) => void;
  /** External URL (e.g. an Unsplash seed) shown when there is no devultur `value`. */
  externalFallback?: string;
  /** Visibility for uploads. Images here are public (og-safe, tokenless) by default. */
  visibility?: Visibility;
  label?: string;
  aspectRatio?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onDelete,
  externalFallback,
  visibility = "public",
  label,
  aspectRatio = "16/9",
  className,
}: ImageUploadProps) {
  const { upload, url } = useDevultur();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const media = await upload(file, { visibility });
      onChange(media);
    } catch (err) {
      setError(uploadErrorMessage(err as Error));
    } finally {
      setUploading(false);
    }
  };

  const downloadHref = value ? url(value, { download: true }) : null;

  if (value || externalFallback) {
    return (
      <div className={className}>
        <div className="relative group rounded-sm overflow-hidden border border-border" style={{ aspectRatio }}>
          <Image
            media={value}
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
                className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-white hover:bg-white/20"
              >
                <Download className="size-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-white hover:bg-white/20"
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
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex w-full flex-col items-center justify-center border border-dashed rounded-sm cursor-pointer transition-colors ${
          isDragging
            ? "border-foreground/50 bg-foreground/5"
            : "border-input/60 bg-muted/30 hover:border-input text-muted-foreground"
        }`}
        style={{ aspectRatio }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {uploading ? (
          <>
            <Loader2 className="size-6 animate-spin" />
            <span className="text-xs mt-2">Subiendo…</span>
          </>
        ) : (
          <>
            <ImagePlus className="size-6" />
            <span className="text-xs mt-2">{isDragging ? "Soltar imagen" : "Subir imagen"}</span>
            <span className="text-xs text-muted-foreground/60">JPG, PNG o WebP · Max 10MB</span>
          </>
        )}
      </button>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
