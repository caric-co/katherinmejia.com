import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation, useAction } from "convex/react"
import { api } from "@convex/_generated/api"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/tooltip"
import { Sparkles, Loader2, Wand2, MessageSquareText, Languages, Save } from "lucide-react"
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
  const [contentEs, setContentEs] = useState("")
  const [contentHtml, setContentHtml] = useState("")
  const [excerptEs, setExcerptEs] = useState("")

  const [titleEn, setTitleEn] = useState("")
  const [excerptEn, setExcerptEn] = useState("")
  const [contentEn, setContentEn] = useState("")

  const [generatingExcerpt, setGeneratingExcerpt] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [tokensUsed, setTokensUsed] = useState(0)
  const [translated, setTranslated] = useState(false)

  const [review, setReview] = useState<any>(null)
  const [improving, setImproving] = useState(false)
  const [reviewing, setReviewing] = useState(false)

  const handleGenerateExcerpt = async () => {
    if (!contentEs) return
    setGeneratingExcerpt(true)
    try {
      const result = await generateExcerptAction({ content: contentEs })
      setExcerptEs(result.excerpt)
      setTokensUsed((p) => p + result.tokensUsed)
    } catch (err: any) { setError(err.message) }
    setGeneratingExcerpt(false)
  }

  const handleTranslate = async () => {
    if (!titleEs || !contentEs) return
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
      setTokensUsed((p) => p + result.tokensUsed)
    } catch (err: any) { setError(err.message) }
    setTranslating(false)
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError("")
    try {
      await createPost({
        title: { es: titleEs, en: titleEn || titleEs },
        slug: { es: slugify(titleEs), en: slugify(titleEn || titleEs) },
        excerpt: { es: excerptEs, en: excerptEn || excerptEs },
        content: { es: contentHtml || contentEs, en: contentEn || contentHtml || contentEs },
      })
      navigate({ to: "/admin/blog" })
    } catch (err: any) { setError(err.message) }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-background/90 backdrop-blur-sm z-10 py-3 -mx-6 px-6">
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={handleGenerateExcerpt} disabled={generatingExcerpt || !contentEs}>
                  {generatingExcerpt ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generar extracto a partir del contenido</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={handleTranslate} disabled={translating || !titleEs || !contentEs}>
                  {translating ? <Loader2 className="size-4 animate-spin" /> : <Languages className="size-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Traducir a inglés con IA</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {translated && (
            <span className="text-xs text-muted-foreground ml-2">✓ Traducido</span>
          )}
          {tokensUsed > 0 && (
            <span className="text-xs text-muted-foreground">({tokensUsed} tokens)</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/admin/blog" })}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={saving || !titleEs || !contentEs}>
            <Save data-icon="inline-start" className="size-3.5" />
            {saving ? "Guardando..." : "Publicar"}
          </Button>
        </div>
      </div>

      {error && <p className="text-destructive mb-4">{error}</p>}

      {/* Title - Notion style */}
      <input
        value={titleEs}
        onChange={(e) => { setTitleEs(e.target.value); setTranslated(false) }}
        placeholder="Título del artículo"
        className="w-full font-display text-[2.5rem] leading-tight tracking-tight bg-transparent outline-none border-none placeholder:text-muted-foreground/30 mb-2"
      />

      <p className="text-sm text-muted-foreground mb-6">
        /{slugify(titleEs) || "..."}
      </p>

      {/* Excerpt */}
      {excerptEs && (
        <p className="text-lg text-muted-foreground italic mb-8 border-l-2 border-foreground/10 pl-4">
          {excerptEs}
        </p>
      )}

      {/* Novel editor - the content IS the preview */}
      <BlogEditor
        ref={editorRef}
        className="min-h-[60vh]"
        onChange={(_json, text, html) => {
          setContentEs(text)
          setContentHtml(html)
          setTranslated(false)
        }}
      />

      {/* Review panel */}
      {review && (
        <div className="bg-muted p-5 mt-8 space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <MessageSquareText className="size-4" />
            Revisión de texto
          </h3>
          {review.spelling?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Ortografía</p>
              <ul className="text-sm space-y-1">
                {review.spelling.map((s: string, i: number) => (
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
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Evaluación</p>
            <p className="text-sm">{review.overall}</p>
          </div>
        </div>
      )}
    </div>
  )
}
