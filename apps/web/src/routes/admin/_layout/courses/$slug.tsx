import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { useQuery, useMutation } from "convex/react"
import { api } from "@convex/_generated/api"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Badge } from "@repo/ui/components/badge"
import { BookOpen } from "lucide-react"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/admin/_layout/courses/$slug")({
  component: EditCoursePage,
})

function formatCOP(value: string): string {
  const num = value.replace(/\D/g, "")
  if (!num) return ""
  return Number(num).toLocaleString("es-CO")
}

function parseCOP(formatted: string): number {
  return parseInt(formatted.replace(/\D/g, "")) || 0
}

function EditCoursePage() {
  const { slug: routeSlug } = Route.useParams()
  const navigate = useNavigate()
  const course = useQuery(api.courses.getBySlug, { slug: routeSlug })
  const updateCourse = useMutation(api.courses.update)
  const updateStatus = useMutation(api.courses.updateStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [titleEs, setTitleEs] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [descEs, setDescEs] = useState("")
  const [descEn, setDescEn] = useState("")
  const [priceDisplay, setPriceDisplay] = useState("")
  const [slugEs, setSlugEs] = useState("")
  const [slugEn, setSlugEn] = useState("")

  useEffect(() => {
    if (course) {
      setTitleEs(course.title.es)
      setTitleEn(course.title.en)
      setDescEs(course.description.es)
      setDescEn(course.description.en)
      setPriceDisplay(formatCOP(course.price.toString()))
      setSlugEs(course.slug.es)
      setSlugEn(course.slug.en)
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
        courseId: course._id,
        title: { es: titleEs, en: titleEn },
        description: { es: descEs, en: descEn },
        slug: { es: slugEs, en: slugEn },
        price: parseCOP(priceDisplay),
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-h2">Editar Curso</h1>
          <Badge variant={course.status === "published" ? "default" : "outline"}>
            {statusLabel[course.status]}
          </Badge>
        </div>
        <Link to={`/admin/courses/${routeSlug}/lessons`}>
          <Button variant="outline" size="sm">
            <BookOpen data-icon="inline-start" className="size-3.5" />
            Lecciones
          </Button>
        </Link>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Slug (ES)</Label>
            <Input value={slugEs} onChange={(e) => setSlugEs(e.target.value)} required />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Slug (EN)</Label>
            <Input value={slugEn} onChange={(e) => setSlugEn(e.target.value)} />
          </div>
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
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              value={priceDisplay}
              onChange={(e) => setPriceDisplay(formatCOP(e.target.value))}
              className="pl-4"
              required
            />
          </div>
        </div>

        {error && <p className="text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
          {course.status === "draft" && (
            <Button type="button" variant="outline" onClick={() => updateStatus({ courseId: course._id, status: "published" })}>
              Publicar
            </Button>
          )}
          {course.status === "published" && (
            <Button type="button" variant="outline" onClick={() => updateStatus({ courseId: course._id, status: "draft" })}>
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
