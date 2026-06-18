import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation, useAction } from "convex/react"
import { api } from "@convex/_generated/api"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Badge } from "@repo/ui/components/badge"
import { Separator } from "@repo/ui/components/separator"
import { Languages, Eye, Sparkles, Loader2 } from "lucide-react"
import { useState } from "react"

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
  const translate = useAction(api.translate.translateToEnglish)

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
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [tokensUsed, setTokensUsed] = useState(0)

  const handleTranslate = async () => {
    if (!titleEs || !contentEs) {
      setError("Escribe el título y contenido en español primero")
      return
    }
    setTranslating(true)
    setError("")
    try {
      const result = await translate({
        title: titleEs,
        excerpt: excerptEs || titleEs,
        content: contentEs,
      })
      setTitleEn(result.title)
      setExcerptEn(result.excerpt)
      setContentEn(result.content)
      setTranslated(true)
      setTokensUsed(result.tokensUsed)
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
      const slugEs = slugify(titleEs)
      const slugEn = slugify(titleEn || titleEs)
      await createPost({
        title: { es: titleEs, en: titleEn || titleEs },
        slug: { es: slugEs, en: slugEn },
        excerpt: { es: excerptEs, en: excerptEn || excerptEs },
        content: { es: contentEs, en: contentEn || contentEs },
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
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Extracto
            </Label>
            <textarea
              value={excerptEs}
              onChange={(e) => { setExcerptEs(e.target.value); setTranslated(false) }}
              placeholder="Resumen breve para el listado del blog"
              className="flex field-sizing-content min-h-16 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
              required
            />
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Contenido
            </Label>
            <textarea
              value={contentEs}
              onChange={(e) => { setContentEs(e.target.value); setTranslated(false) }}
              placeholder="Escribe el contenido del artículo en español..."
              className="flex field-sizing-content min-h-64 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
              required
            />
          </div>

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
              Traducción generada con Mistral ({tokensUsed} tokens)
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
