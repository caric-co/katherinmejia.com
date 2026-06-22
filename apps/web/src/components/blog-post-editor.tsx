import { useEffect, useRef } from "react";

import { useAction } from "convex/react";
import { ArrowLeft, Eye, Loader2, Save, Sparkles } from "lucide-react";

import { api } from "@convex/_generated/api";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/tooltip";

import { BlogEditor, type BlogEditorRef, setBlogEditorUploadConfig } from "#/components/editor/blog-editor";
import { ImageUpload } from "#/components/image-upload";
import { useBlogEditorStore } from "#/stores/blog-editor-store";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface BlogPayload {
  title: { es: string; en: string };
  slug: { es: string; en: string };
  excerpt: { es: string; en: string };
  content: { es: string; en: string };
  coverImageUrl?: string;
}

interface BlogPostEditorProps {
  initialData?: {
    titleEs: string;
    titleEn: string;
    excerptEs: string;
    excerptEn: string;
    contentHtml: string;
    contentEn: string;
    coverImageUrl?: string | null;
  };
  onSave: (data: BlogPayload) => Promise<void>;
  onPublish?: (data: BlogPayload) => Promise<void>;
  onCancel: () => void;
  onUnpublish?: () => void;
  isPublished?: boolean;
  createUploadUrl: (file: File) => Promise<{ url: string; key: string }>;
  viewerToken: string | null;
}

export function BlogPostEditor({
  initialData,
  onSave,
  onPublish,
  onCancel,
  onUnpublish,
  isPublished,
  createUploadUrl,
  viewerToken,
}: BlogPostEditorProps) {
  const store = useBlogEditorStore();
  const translateAction = useAction(api.ai.translateToEnglish);
  const generateExcerptAction = useAction(api.ai.generateExcerpt);
  const capitalizeTitleAction = useAction(api.ai.capitalizeTitle);

  useEffect(() => {
    if (viewerToken) {
      setBlogEditorUploadConfig(async (file) => createUploadUrl(file), viewerToken);
    }
  }, [createUploadUrl, viewerToken]);
  const editorRef = useRef<BlogEditorRef>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initialData && !initializedRef.current) {
      store.init(initialData);
      initializedRef.current = true;
    } else if (!initialData && !initializedRef.current) {
      store.reset();
      initializedRef.current = true;
    }
  }, [initialData]);

  useEffect(() => {
    return () => store.reset();
  }, []);

  const buildPayload = () => ({
    title: { es: store.titleEs, en: store.titleEn || store.titleEs },
    slug: { es: slugify(store.titleEs), en: slugify(store.titleEn || store.titleEs) },
    excerpt: { es: store.excerptEs, en: store.excerptEn || store.excerptEs },
    content: {
      es: store.contentHtml || store.contentEs,
      en: store.contentEn || store.contentHtml || store.contentEs,
    },
    ...(store.coverImageUrl ? { coverImageUrl: store.coverImageUrl } : {}),
  });

  const handleTitleBlur = async () => {
    if (!store.titleEs || store.titleEs.length < 5 || store.capitalizing) return;
    store.setCapitalizing(true);
    try {
      const result = await capitalizeTitleAction({ title: store.titleEs });
      if (result.title !== store.titleEs) store.setTitleEs(result.title);
      store.addTokens(result.tokensUsed);
    } catch {}
    store.setCapitalizing(false);
  };

  const handleGenerateExcerpt = async () => {
    if (!store.contentEs) return;
    store.setGeneratingExcerpt(true);
    try {
      const result = await generateExcerptAction({ content: store.contentEs });
      store.setExcerptEs(result.excerpt);
      store.addTokens(result.tokensUsed);
    } catch (err: any) {
      store.setError(err.message);
    }
    store.setGeneratingExcerpt(false);
  };

  const handleTranslateAndPreview = async () => {
    if (!store.titleEs || (!store.contentEs && !store.contentHtml)) {
      store.setError("Escribe el título y contenido primero");
      return;
    }

    if (!store.excerptEs) await handleGenerateExcerpt();

    store.setTranslating(true);
    store.setError("");
    try {
      const result = await translateAction({
        title: store.titleEs,
        excerpt: store.excerptEs || store.titleEs,
        content: store.contentHtml || store.contentEs,
      });
      store.setTitleEn(result.title);
      store.setExcerptEn(result.excerpt);
      store.setContentEn(result.content);
      store.addTokens(result.tokensUsed);
      store.setView("preview");
    } catch (err: any) {
      store.setError(err.message);
    }
    store.setTranslating(false);
  };

  const handleSave = async () => {
    store.setSaving(true);
    store.setError("");
    try {
      await onSave(buildPayload());
    } catch (err: any) {
      store.setError(err.message);
    }
    store.setSaving(false);
  };

  const handlePublish = async () => {
    if (!onPublish) return;
    store.setSaving(true);
    store.setError("");
    try {
      await onPublish(buildPayload());
    } catch (err: any) {
      store.setError(err.message);
    }
    store.setSaving(false);
  };

  if (store.view === "preview") {
    const title = store.previewLang === "es" ? store.titleEs : store.titleEn || store.titleEs;
    const excerpt = store.previewLang === "es" ? store.excerptEs : store.excerptEn || store.excerptEs;
    const content =
      store.previewLang === "es" ? store.contentHtml || store.contentEs : store.contentEn || store.contentEs;

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-background/90 backdrop-blur-sm z-10 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => store.setView("editor")}>
              <ArrowLeft data-icon="inline-start" className="size-3.5" />
              Editar
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">Vista previa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 mr-3">
              <Button
                variant={store.previewLang === "es" ? "default" : "outline"}
                size="xs"
                onClick={() => store.setPreviewLang("es")}
              >
                ES
              </Button>
              <Button
                variant={store.previewLang === "en" ? "default" : "outline"}
                size="xs"
                onClick={() => store.setPreviewLang("en")}
              >
                EN
              </Button>
            </div>
            {onPublish && !isPublished ? (
              <Button size="sm" onClick={handlePublish} disabled={store.saving}>
                <Save data-icon="inline-start" className="size-3.5" />
                {store.saving ? "Publicando..." : "Guardar y publicar"}
              </Button>
            ) : (
              <Button size="sm" onClick={handleSave} disabled={store.saving}>
                <Save data-icon="inline-start" className="size-3.5" />
                {store.saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            )}
          </div>
        </div>

        {store.error && <p className="text-destructive mb-4">{store.error}</p>}

        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] tracking-tight mb-4">{title}</h1>

        {excerpt && <p className="text-lg text-muted-foreground italic mb-8">{excerpt}</p>}

        <Separator className="mb-8" />

        <div
          className="leading-relaxed [&_h1]:font-display [&_h1]:text-[2rem] [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:font-display [&_h2]:text-[1.5rem] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_blockquote]:border-l-2 [&_blockquote]:border-foreground/15 [&_blockquote]:pl-6 [&_blockquote]:italic [&_img]:w-full [&_img]:my-6"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {store.tokensUsed > 0 && (
          <p className="text-xs text-muted-foreground mt-8">IA: {store.tokensUsed} tokens consumidos (Mistral)</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-background/90 backdrop-blur-sm z-10 py-3">
        <div className="flex items-center gap-2">
          <TooltipProvider delay={300}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleGenerateExcerpt}
                    disabled={store.generatingExcerpt || (!store.contentEs && !store.contentHtml)}
                  />
                }
              >
                {store.generatingExcerpt ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
              </TooltipTrigger>
              <TooltipContent>Generar extracto</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {store.tokensUsed > 0 && <span className="text-xs text-muted-foreground">({store.tokensUsed} tokens)</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          {isPublished && onUnpublish && (
            <Button variant="ghost" size="sm" onClick={onUnpublish}>
              Despublicar
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleTranslateAndPreview}
            disabled={store.translating || !store.titleEs || (!store.contentEs && !store.contentHtml)}
          >
            {store.translating ? (
              <Loader2 data-icon="inline-start" className="size-3.5 animate-spin" />
            ) : (
              <Eye data-icon="inline-start" className="size-3.5" />
            )}
            {store.translating ? "Traduciendo..." : "Traducir y previsualizar"}
          </Button>
        </div>
      </div>

      {store.error && <p className="text-destructive mb-4">{store.error}</p>}

      <ImageUpload
        value={store.coverImageUrl}
        onChange={store.setCoverImageUrl}
        onUploadUrl={createUploadUrl}
        token={viewerToken}
        label="Imagen de portada"
        aspectRatio="21/9"
        className="mb-6"
      />

      <div className="relative">
        <input
          value={store.titleEs}
          onChange={(e) => store.setTitleEs(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="Título del artículo"
          className="w-full font-display text-[2.5rem] leading-tight tracking-tight bg-transparent outline-none border-none placeholder:text-muted-foreground/30 mb-2"
        />
        {store.capitalizing && <Loader2 className="absolute right-0 top-4 size-4 animate-spin text-muted-foreground" />}
      </div>

      <p className="text-sm text-muted-foreground mb-4">/{slugify(store.titleEs) || "..."}</p>

      {store.excerptEs && (
        <p className="text-lg text-muted-foreground italic mb-6 border-l-2 border-foreground/10 pl-4">
          {store.excerptEs}
        </p>
      )}

      <BlogEditor
        ref={editorRef}
        initialHtml={initialData?.contentHtml}
        className="min-h-[60vh]"
        onChange={(_json, text, html) => {
          store.setContentEs(text);
          store.setContentHtml(html);
        }}
      />
    </div>
  );
}
