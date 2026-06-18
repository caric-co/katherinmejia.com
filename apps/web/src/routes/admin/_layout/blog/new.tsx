import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation } from "convex/react"
import { api } from "@convex/_generated/api"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
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
  const [loading, setLoading] = useState(false)
  const [titleEs, setTitleEs] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [slug, setSlug] = useState("")
  const [excerptEs, setExcerptEs] = useState("")
  const [excerptEn, setExcerptEn] = useState("")
  const [contentEs, setContentEs] = useState("")
  const [contentEn, setContentEn] = useState("")
  const [error, setError] = useState("")

  const handleTitleChange = (val: string) => {
    setTitleEs(val)
    setSlug(slugify(val))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await createPost({
        title: { es: titleEs, en: titleEn || titleEs },
        slug,
        excerpt: { es: excerptEs, en: excerptEn || excerptEs },
        content: { es: contentEs, en: contentEn || contentEs },
      })
      navigate({ to: "/admin/blog" })
    } catch (err: any) {
      setError(err.message ?? "Error al crear artículo")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-h2 mb-6">Nuevo Artículo</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Título (ES)</Label>
            <Input value={titleEs} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Título del artículo" required />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Título (EN)</Label>
            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Article title" />
          </div>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Extracto (ES)</Label>
            <textarea value={excerptEs} onChange={(e) => setExcerptEs(e.target.value)} placeholder="Resumen breve para el listado" className="flex field-sizing-content min-h-16 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40" required />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Extracto (EN)</Label>
            <textarea value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} placeholder="Short summary for listing" className="flex field-sizing-content min-h-16 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40" />
          </div>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Contenido (ES)</Label>
          <textarea value={contentEs} onChange={(e) => setContentEs(e.target.value)} placeholder="Escribe el contenido del artículo..." className="flex field-sizing-content min-h-48 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40" required />
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Contenido (EN)</Label>
          <textarea value={contentEn} onChange={(e) => setContentEn(e.target.value)} placeholder="Write the article content..." className="flex field-sizing-content min-h-48 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40" />
        </div>

        {error && <p className="text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear artículo"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin/blog" })}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
