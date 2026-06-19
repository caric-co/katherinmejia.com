import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation, useAction } from "convex/react"
import { api } from "@convex/_generated/api"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Badge } from "@repo/ui/components/badge"
import { Separator } from "@repo/ui/components/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/tooltip"
import { Eye, Sparkles, Loader2, Wand2, MessageSquareText } from "lucide-react"
import { useState, useRef } from "react"
import { BlogEditor, type BlogEditorRef } from "#/components/editor/blog-editor"

export const Route = createFileRoute("/admin/_layout/blog/new")({
  component: NewBlogPostPage,
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function NewBlogPostPage() {
  const navigate = useNavigate()
  const createPost = useMutation(api.blogPosts.create)
  const translateAction = useAction(api.ai.translateToEnglish)
  const generateExcerptAction = useAction(api.ai.generateExcerpt)
  const improveTextAction = useAction(api.ai.improveText)
  const reviewTextAction = useAction(api.ai.reviewText)

  const editorRef = useRef<BlogEditorRef>(null)
  const [titleEs, setTitleEs] = useState("")
  const [excerptEs, setExcerptEs] = useState("")
  const [contentEs, setContentEs] = useState("")

  const [titleEn, setTitleEn] = useState("")
  const [excerptEn, setExcerptEn] = useState("")
  const [contentEn, setContentEn] = useState("")
  const [translated, setTranslated] = useState(false)

  const [previewLang, setPreviewLang] = useState<"es" | "en">("es")
  const [showPreview, setShowPreview] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [generatingExcerpt, setGeneratingExcerpt] = useState(false)
  const [improving, setImproving] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [tokensUsed, setTokensUsed] = useState(0)
  const [review, setReview] = useState<{
    spelling: string[]
    tone: string
    coherence: string
    overall: string
  } | null>(null)

  const handleGenerateExcerpt = async () => {
    if (!contentEs) return
    setGeneratingExcerpt(true)
    try {
      const result = await generateExcerptAction({ content: contentEs })
      setExcerptEs(result.excerpt)
      setTokensUsed((prev) => prev + result.tokensUsed)
    } catch (err: any) {
      setError(err.message)
    }
    setGeneratingExcerpt(false)
  }

  const handleImproveText = async () => {
    if (!contentEs) return
    setImproving(true)
    try {
      const result = await improveTextAction({ text: contentEs })
      setContentEs(result.improved)
      setTranslated(false)
      setTokensUsed((prev) => prev + result.tokensUsed)
    } catch (err: any) {
      setError(err.message)
    }
    setImproving(false)
  }

  const handleReviewText = async () => {
    if (!contentEs) return
    setReviewing(true)
    setReview(null)
    try {
      const result = await reviewTextAction({ text: contentEs })
      setReview(result.suggestions)
      setTokensUsed((prev) => prev + result.tokensUsed)
    } catch (err: any) {
      setError(err.message)
    }
    setReviewing(false)
  }

  const handleTranslate = async () => {
    if (!titleEs || !contentEs) {
      setError("Escribe el título y contenido en español primero")
      return
    }
    setTranslating(true)
    setError("")
    try {
      const result = await translateAction({
        title: titleEs,
        excerpt: excerptEs || titleEs,
        content: contentEs,
      })
      setTitleEn(result.title)
      setExcerptEn(result.excerpt)
      setContentEn(result.content)
      setTranslated(true)
      setTokensUsed((prev) => prev + result.tokensUsed)
      setShowPreview(true)
    } catch (err: any) {
      setError(err.message ?? "Error al traducir")
    }
    setTranslating(false)
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError("")
    try {
      const htmlContent = editorRef.current?.getHTML() ?? contentEs
      await createPost({
        title: { es: titleEs, en: titleEn || titleEs },
        slug: { es: slugify(titleEs), en: slugify(titleEn || titleEs) },
        excerpt: { es: excerptEs, en: excerptEn || excerptEs },
        content: { es: htmlContent, en: contentEn || htmlContent },
      })
      navigate({ to: "/admin/blog" })
    } catch (err: any) {
      setError(err.message ?? "Error al crear")
    }
    setSaving(false)
  }

  const previewTitle = previewLang === "es" ? titleEs : (titleEn || titleEs)
  const previewExcerpt = previewLang === "es" ? excerptEs : (excerptEn || excerptEs)
  const previewContent = previewLang === "es" ? contentEs : (contentEn || contentEs)

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-h2 mb-6">Nuevo Artículo</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Editor */}
        <div className="space-y-6">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Título
            </Label>
            <Input
              value={titleEs}
              onChange={(e) => { setTitleEs(e.target.value); setTranslated(false) }}
              placeholder="Título del artículo en español"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Slug: /{slugify(titleEs) || "..."}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs uppercase tracking-wider font-medium">
                Extracto
              </Label>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={handleGenerateExcerpt}
                      disabled={generatingExcerpt || !contentEs}
                    >
                      {generatingExcerpt ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="size-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Generar extracto a partir del contenido</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <textarea
              value={excerptEs}
              onChange={(e) => { setExcerptEs(e.target.value); setTranslated(false) }}
              placeholder="Resumen breve para el listado del blog"
              className="flex field-sizing-content min-h-16 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs uppercase tracking-wider font-medium">
                Contenido
              </Label>
              <div className="flex gap-1">
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={handleImproveText}
                        disabled={improving || !contentEs}
                      >
                        {improving ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Wand2 className="size-3.5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Mejorar texto con IA</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={handleReviewText}
                        disabled={reviewing || !contentEs}
                      >
                        {reviewing ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <MessageSquareText className="size-3.5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Revisar redacción, tono y ortografía</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <BlogEditor
              ref={editorRef}
              onChange={(_json, text) => {
                setContentEs(text)
                setTranslated(false)
                setReview(null)
              }}
            />
          </div>

          {/* Review suggestions */}
          {review && (
            <div className="bg-muted p-5 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <MessageSquareText className="size-4" />
                Revisión de texto
              </h3>
              {review.spelling && review.spelling.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Ortografía</p>
                  <ul className="text-sm space-y-1">
                    {review.spelling.map((s, i) => (
                      <li key={i} className="text-destructive">— {s}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Tono</p>
                <p className="text-sm">{review.tone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Coherencia</p>
                <p className="text-sm">{review.coherence}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Evaluación general</p>
                <p className="text-sm">{review.overall}</p>
              </div>
            </div>
          )}

          {error && <p className="text-destructive">{error}</p>}

          <div className="flex gap-3 flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={handleTranslate}
              disabled={translating || !titleEs || !contentEs}
            >
              {translating ? (
                <Loader2 data-icon="inline-start" className="size-4 animate-spin" />
              ) : (
                <Sparkles data-icon="inline-start" className="size-4" />
              )}
              {translating ? "Traduciendo..." : "Generar en ES e EN"}
            </Button>

            {translated && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye data-icon="inline-start" className="size-4" />
                {showPreview ? "Ocultar vista previa" : "Ver vista previa"}
              </Button>
            )}

            <Button
              onClick={handleSubmit}
              disabled={saving || !titleEs || !contentEs}
            >
              {saving ? "Guardando..." : "Crear artículo"}
            </Button>

            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/admin/blog" })}>
              Cancelar
            </Button>
          </div>

          {tokensUsed > 0 && (
            <p className="text-xs text-muted-foreground">
              IA: {tokensUsed} tokens consumidos (Mistral)
            </p>
          )}
        </div>

        {/* Preview */}
        {showPreview && translated && (
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Vista previa</h3>
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

            <div className="bg-muted p-6 max-h-[70vh] overflow-y-auto">
              <Badge variant="outline" className="mb-3">
                {previewLang === "es" ? "Español" : "English"}
              </Badge>
              <h2 className="font-display text-h3 mb-3">{previewTitle || "Sin título"}</h2>
              <p className="text-muted-foreground text-sm mb-4 italic">
                {previewExcerpt || "Sin extracto"}
              </p>
              <Separator className="mb-4" />
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {previewContent || "Sin contenido"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
