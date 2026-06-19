import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation, useAction } from "convex/react"
import { api } from "@convex/_generated/api"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/tooltip"
import { Languages, Loader2 } from "lucide-react"
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

function formatCOP(value: string): string {
  const num = value.replace(/\D/g, "")
  if (!num) return ""
  return Number(num).toLocaleString("es-CO")
}

function parseCOP(formatted: string): number {
  return parseInt(formatted.replace(/\D/g, "")) || 0
}

function NewCoursePage() {
  const navigate = useNavigate()
  const createCourse = useMutation(api.courses.create)
  const translateAction = useAction(api.ai.translateText)
  const [loading, setLoading] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [titleEs, setTitleEs] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [descEs, setDescEs] = useState("")
  const [descEn, setDescEn] = useState("")
  const [priceDisplay, setPriceDisplay] = useState("")
  const [slugEs, setSlugEs] = useState("")
  const [slugEn, setSlugEn] = useState("")
  const [error, setError] = useState("")

  const handleTitleEsChange = (val: string) => {
    setTitleEs(val)
    setSlugEs(slugify(val))
  }

  const handleTitleEnChange = (val: string) => {
    setTitleEn(val)
    setSlugEn(slugify(val))
  }

  const handleTranslate = async () => {
    setTranslating(true)
    try {
      if (titleEs && !titleEn) {
        const result = await translateAction({ text: titleEs })
        setTitleEn(result.translated)
        setSlugEn(slugify(result.translated))
      }
      if (descEs && !descEn) {
        const result = await translateAction({ text: descEs })
        setDescEn(result.translated)
      }
    } catch {}
    setTranslating(false)
  }

  const handlePriceChange = (val: string) => {
    setPriceDisplay(formatCOP(val))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await createCourse({
        title: { es: titleEs, en: titleEn || titleEs },
        description: { es: descEs, en: descEn || descEs },
        slug: { es: slugEs, en: slugEn || slugEs },
        price: parseCOP(priceDisplay),
      })
      navigate({ to: "/admin/courses" })
    } catch (err: any) {
      setError(err.message ?? "Error al crear el curso")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-h2">Nuevo Curso</h1>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleTranslate}
                disabled={translating || (!titleEs && !descEs)}
              >
                {translating ? (
                  <Loader2 data-icon="inline-start" className="size-3.5 animate-spin" />
                ) : (
                  <Languages data-icon="inline-start" className="size-3.5" />
                )}
                {translating ? "Traduciendo..." : "Auto-traducir EN"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Traduce los campos vacíos EN desde ES con IA</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Título (ES)
            </Label>
            <Input
              value={titleEs}
              onChange={(e) => handleTitleEsChange(e.target.value)}
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
              onChange={(e) => handleTitleEnChange(e.target.value)}
              placeholder="Natural Day Makeup"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Slug (ES)
            </Label>
            <Input value={slugEs} onChange={(e) => setSlugEs(e.target.value)} required />
            <p className="text-sm text-muted-foreground mt-1">/courses/{slugEs || "..."}</p>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Slug (EN)
            </Label>
            <Input value={slugEn} onChange={(e) => setSlugEn(e.target.value)} />
            <p className="text-sm text-muted-foreground mt-1">/courses/{slugEn || slugEs || "..."}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Descripción (ES)
            </Label>
            <textarea value={descEs} onChange={(e) => setDescEs(e.target.value)} placeholder="Descripción del curso en español" className="flex field-sizing-content min-h-24 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40" required />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
              Descripción (EN)
            </Label>
            <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} placeholder="Course description in English" className="flex field-sizing-content min-h-24 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40" />
          </div>
        </div>

        <div className="max-w-xs">
          <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">
            Precio (COP)
          </Label>
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              value={priceDisplay}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="149.900"
              className="pl-4"
              required
            />
          </div>
        </div>

        {error && <p className="text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear curso"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin/courses" })}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
