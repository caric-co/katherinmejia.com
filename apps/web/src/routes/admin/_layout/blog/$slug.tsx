import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation, useAction } from "convex/react"
import { api } from "@convex/_generated/api"
import { Button } from "@repo/ui/components/button"
import { Separator } from "@repo/ui/components/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/tooltip"
import { Sparkles, Loader2, Save, Eye, ArrowLeft } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { BlogEditor, type BlogEditorRef } from "#/components/editor/blog-editor"

export const Route = createFileRoute("/admin/_layout/blog/$slug")({
  component: EditBlogPostPage,
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

type View = "editor" | "preview"

function EditBlogPostPage() {
  const { slug: routeSlug } = Route.useParams()
  const navigate = useNavigate()
  const post = useQuery(api.blogPosts.getBySlug, { slug: routeSlug })
  const updatePost = useMutation(api.blogPosts.update)
  const publishPost = useMutation(api.blogPosts.publish)
  const unpublishPost = useMutation(api.blogPosts.unpublish)
  const translateAction = useAction(api.ai.translateToEnglish)
  const generateExcerptAction = useAction(api.ai.generateExcerpt)
  const capitalizeTitleAction = useAction(api.ai.capitalizeTitle)

  const editorRef = useRef<BlogEditorRef>(null)
  const [view, setView] = useState<View>("editor")
  const [titleEs, setTitleEs] = useState("")
  const [contentEs, setContentEs] = useState("")
  const [contentHtml, setContentHtml] = useState("")
  const [excerptEs, setExcerptEs] = useState("")

  const [titleEn, setTitleEn] = useState("")
  const [excerptEn, setExcerptEn] = useState("")
  const [contentEn, setContentEn] = useState("")

  const [previewLang, setPreviewLang] = useState<"es" | "en">("es")
  const [generatingExcerpt, setGeneratingExcerpt] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [capitalizing, setCapitalizing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [tokensUsed, setTokensUsed] = useState(0)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (post && !initialized) {
      setTitleEs(post.title.es)
      setTitleEn(post.title.en)
      setExcerptEs(post.excerpt.es)
      setExcerptEn(post.excerpt.en)
      setContentHtml(post.content.es)
      setContentEn(post.content.en)
      setInitialized(true)
    }
  }, [post, initialized])

  if (post === undefined) return <p className="text-muted-foreground">Cargando...</p>
  if (post === null) return <p className="text-destructive">Artículo no encontrado</p>

  const handleTitleBlur = async () => {
    if (!titleEs || titleEs.length < 5 || capitalizing) return
    setCapitalizing(true)
    try {
      const result = await capitalizeTitleAction({ title: titleEs })
      if (result.title !== titleEs) setTitleEs(result.title)
      setTokensUsed((p) => p + result.tokensUsed)
    } catch {}
    setCapitalizing(false)
  }

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

  const handleTranslateAndPreview = async () => {
    if (!titleEs || !contentEs && !contentHtml) {
      setError("Escribe el título y contenido primero")
      return
    }

    if (!excerptEs) await handleGenerateExcerpt()

    setTranslating(true)
    setError("")
    try {
      const result = await translateAction({
        title: titleEs,
        excerpt: excerptEs || titleEs,
        content: contentHtml || contentEs,
      })
      setTitleEn(result.title)
      setExcerptEn(result.excerpt)
      setContentEn(result.content)
      setTokensUsed((p) => p + result.tokensUsed)
      setView("preview")
    } catch (err: any) { setError(err.message) }
    setTranslating(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      await updatePost({
        postId: post._id,
        title: { es: titleEs, en: titleEn || titleEs },
        slug: { es: slugify(titleEs), en: slugify(titleEn || titleEs) },
        excerpt: { es: excerptEs, en: excerptEn || excerptEs },
        content: { es: contentHtml || contentEs, en: contentEn || contentHtml || contentEs },
      })
      navigate({ to: "/admin/blog" })
    } catch (err: any) { setError(err.message) }
    setSaving(false)
  }

  const handlePublish = async () => {
    setSaving(true)
    setError("")
    try {
      await updatePost({
        postId: post._id,
        title: { es: titleEs, en: titleEn || titleEs },
        slug: { es: slugify(titleEs), en: slugify(titleEn || titleEs) },
        excerpt: { es: excerptEs, en: excerptEn || excerptEs },
        content: { es: contentHtml || contentEs, en: contentEn || contentHtml || contentEs },
      })
      await publishPost({ postId: post._id })
      navigate({ to: "/admin/blog" })
    } catch (err: any) { setError(err.message) }
    setSaving(false)
  }

  if (view === "preview") {
    const title = previewLang === "es" ? titleEs : (titleEn || titleEs)
    const excerpt = previewLang === "es" ? excerptEs : (excerptEn || excerptEs)
    const content = previewLang === "es" ? (contentHtml || contentEs) : (contentEn || contentEs)

    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-background/90 backdrop-blur-sm z-10 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setView("editor")}>
              <ArrowLeft data-icon="inline-start" className="size-3.5" />
              Editar
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">Vista previa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 mr-3">
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
            {post.status === "draft" ? (
              <Button size="sm" onClick={handlePublish} disabled={saving}>
                <Save data-icon="inline-start" className="size-3.5" />
                {saving ? "Publicando..." : "Guardar y publicar"}
              </Button>
            ) : (
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Save data-icon="inline-start" className="size-3.5" />
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            )}
          </div>
        </div>

        {error && <p className="text-destructive mb-4">{error}</p>}

        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] tracking-tight mb-4">
          {title}
        </h1>

        {excerpt && (
          <p className="text-lg text-muted-foreground italic mb-8">
            {excerpt}
          </p>
        )}

        <Separator className="mb-8" />

        <div
          className="leading-relaxed [&_h1]:font-display [&_h1]:text-[2rem] [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:font-display [&_h2]:text-[1.5rem] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_blockquote]:border-l-2 [&_blockquote]:border-foreground/15 [&_blockquote]:pl-6 [&_blockquote]:italic [&_img]:w-full [&_img]:my-6"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {tokensUsed > 0 && (
          <p className="text-xs text-muted-foreground mt-8">
            IA: {tokensUsed} tokens consumidos (Mistral)
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-background/90 backdrop-blur-sm z-10 py-3">
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={handleGenerateExcerpt} disabled={generatingExcerpt || (!contentEs && !contentHtml)}>
                  {generatingExcerpt ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generar extracto</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {tokensUsed > 0 && (
            <span className="text-xs text-muted-foreground">({tokensUsed} tokens)</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/admin/blog" })}>
            Cancelar
          </Button>
          {post.status === "published" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => unpublishPost({ postId: post._id })}
            >
              Despublicar
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleTranslateAndPreview}
            disabled={translating || !titleEs || (!contentEs && !contentHtml)}
          >
            {translating ? (
              <Loader2 data-icon="inline-start" className="size-3.5 animate-spin" />
            ) : (
              <Eye data-icon="inline-start" className="size-3.5" />
            )}
            {translating ? "Guardando..." : "Guardar borrador"}
          </Button>
        </div>
      </div>

      {error && <p className="text-destructive mb-4">{error}</p>}

      <div className="relative">
        <input
          value={titleEs}
          onChange={(e) => setTitleEs(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="Título del artículo"
          className="w-full font-display text-[2.5rem] leading-tight tracking-tight bg-transparent outline-none border-none placeholder:text-muted-foreground/30 mb-2"
        />
        {capitalizing && (
          <Loader2 className="absolute right-0 top-4 size-4 animate-spin text-muted-foreground" />
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        /{slugify(titleEs) || "..."}
      </p>

      {excerptEs && (
        <p className="text-lg text-muted-foreground italic mb-6 border-l-2 border-foreground/10 pl-4">
          {excerptEs}
        </p>
      )}

      <BlogEditor
        ref={editorRef}
        initialHtml={contentHtml}
        className="min-h-[60vh]"
        onChange={(_json, text, html) => {
          setContentEs(text)
          setContentHtml(html)
        }}
      />
    </div>
  )
}
