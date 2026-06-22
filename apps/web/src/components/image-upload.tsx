import { useState } from "react";

import { UploadZone } from "@devultur/react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

import { Button } from "@repo/ui/components/button";

import { media } from "#/lib/media";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  onUploadUrl: (file: File) => Promise<{ url: string; key: string }>;
  token?: string | null;
  label?: string;
  aspectRatio?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onUploadUrl,
  token,
  label,
  aspectRatio = "16/9",
  className,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const handleUploadUrl = async (file: File) => {
    setError(null);
    return onUploadUrl(file);
  };

  const handleComplete = (result: { key: string; file: File }) => {
    const url = media.getMediaUrl(result.key);
    onChange(url);
  };

  if (value) {
    const displayUrl = token ? `${value}${value.includes("?") ? "&" : "?"}token=${token}` : value;
    return (
      <div className={className}>
        <div className="relative group rounded-sm overflow-hidden border border-border" style={{ aspectRatio }}>
          <img src={displayUrl} alt={label ?? "Uploaded image"} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-white hover:bg-white/20"
              onClick={() => onChange(null)}
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
      <UploadZone
        onUploadUrl={handleUploadUrl}
        onComplete={handleComplete}
        onError={(err) => setError(err.message)}
        accept={["image/jpeg", "image/png", "image/webp"]}
      >
        {({ getRootProps, getInputProps, isDragging, isUploading, progress }) => (
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center border border-dashed rounded-sm cursor-pointer transition-colors ${
              isDragging
                ? "border-foreground/50 bg-foreground/5"
                : "border-input/60 bg-muted/30 hover:border-input text-muted-foreground"
            }`}
            style={{ aspectRatio }}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <>
                <Loader2 className="size-6 animate-spin" />
                <span className="text-xs mt-2">{Math.round(progress)}%</span>
              </>
            ) : (
              <>
                <ImagePlus className="size-6" />
                <span className="text-xs mt-2">{isDragging ? "Soltar imagen" : "Subir imagen"}</span>
                <span className="text-xs text-muted-foreground/60">JPG, PNG o WebP · Max 10MB</span>
              </>
            )}
          </div>
        )}
      </UploadZone>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
