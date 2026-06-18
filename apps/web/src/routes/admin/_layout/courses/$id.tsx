import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation } from "convex/react"
import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Badge } from "@repo/ui/components/badge"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/admin/_layout/courses/$id")({
  component: EditCoursePage,
})

function EditCoursePage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const course = useQuery(api.courses.getById, { courseId: id as Id<"courses"> })
  const updateCourse = useMutation(api.courses.update)
  const updateStatus = useMutation(api.courses.updateStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [titleEs, setTitleEs] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [descEs, setDescEs] = useState("")
  const [descEn, setDescEn] = useState("")
  const [price, setPrice] = useState("")
  const [slug, setSlug] = useState("")

  useEffect(() => {
    if (course) {
      setTitleEs(course.title.es)
      setTitleEn(course.title.en)
      setDescEs(course.description.es)
      setDescEn(course.description.en)
      setPrice(course.price.toString())
      setSlug(course.slug)
    }
  }, [course])

  if (course === undefined) return <p className="text-muted-foreground">Cargando...</p>
  if (course === null) return <p className="text-destructive">Curso no encontrado</p>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await updateCourse({
        courseId: id as Id<"courses">,
        title: { es: titleEs, en: titleEn },
        description: { es: descEs, en: descEn },
        slug,
        price: parseInt(price) || 0,
      })
      navigate({ to: "/admin/courses" })
    } catch (err: any) {
      setError(err.message ?? "Error al actualizar")
    }
    setLoading(false)
  }

  const statusLabel = { draft: "Borrador", published: "Publicado", archived: "Archivado" }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-display text-h2">Editar Curso</h1>
        <Badge variant={course.status === "published" ? "default" : "outline"}>
          {statusLabel[course.status]}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Título (ES)</Label>
            <Input value={titleEs} onChange={(e) => setTitleEs(e.target.value)} required />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Título (EN)</Label>
            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
          </div>
        </div>

        <div>
          <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Descripción (ES)</Label>
            <textarea value={descEs} onChange={(e) => setDescEs(e.target.value)} className="flex field-sizing-content min-h-24 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40" required />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Descripción (EN)</Label>
            <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} className="flex field-sizing-content min-h-24 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40" />
          </div>
        </div>

        <div className="max-w-xs">
          <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Precio (COP)</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        {error && <p className="text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
          {course.status === "draft" && (
            <Button type="button" variant="outline" onClick={() => updateStatus({ courseId: id as Id<"courses">, status: "published" })}>
              Publicar
            </Button>
          )}
          {course.status === "published" && (
            <Button type="button" variant="outline" onClick={() => updateStatus({ courseId: id as Id<"courses">, status: "draft" })}>
              Despublicar
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={() => navigate({ to: "/admin/courses" })}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
