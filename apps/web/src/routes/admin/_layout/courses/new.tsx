import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation } from "convex/react"
import { api } from "@convex/_generated/api"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { useState } from "react"

export const Route = createFileRoute("/admin/_layout/courses/new")({
  component: NewCoursePage,
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function NewCoursePage() {
  const navigate = useNavigate()
  const createCourse = useMutation(api.courses.create)
  const [loading, setLoading] = useState(false)
  const [titleEs, setTitleEs] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [descEs, setDescEs] = useState("")
  const [descEn, setDescEn] = useState("")
  const [price, setPrice] = useState("")
  const [slug, setSlug] = useState("")
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
      await createCourse({
        title: { es: titleEs, en: titleEn || titleEs },
        description: { es: descEs, en: descEn || descEs },
        slug,
        price: parseInt(price) || 0,
      })
      navigate({ to: "/admin/courses" })
    } catch (err: any) {
      setError(err.message ?? "Error al crear el curso")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-h2 mb-6">Nuevo Curso</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Título (ES)
            </Label>
            <Input
              value={titleEs}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Maquillaje Natural de Día"
              required
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Título (EN)
            </Label>
            <Input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Natural Day Makeup"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
            Slug
          </Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="maquillaje-natural-de-dia"
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            URL: /courses/{slug || "..."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Descripción (ES)
            </Label>
            <textarea
              value={descEs}
              onChange={(e) => setDescEs(e.target.value)}
              placeholder="Descripción del curso en español"
              className="flex field-sizing-content min-h-24 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
              required
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Descripción (EN)
            </Label>
            <textarea
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              placeholder="Course description in English"
              className="flex field-sizing-content min-h-24 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
            />
          </div>
        </div>

        <div className="max-w-xs">
          <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
            Precio (COP)
          </Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="149900"
            required
          />
        </div>

        {error && <p className="text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear curso"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/admin/courses" })}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
