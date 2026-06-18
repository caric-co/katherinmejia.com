import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation } from "convex/react"
import { api } from "@convex/_generated/api"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Separator } from "@repo/ui/components/separator"
import { Save, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/admin/_layout/content")({
  component: ContentPage,
})

const sections = [
  { label: "Hero", keys: ["hero.title", "hero.subtitle", "hero.cta"] },
  { label: "Sobre Mí", keys: ["about.title", "about.bio"] },
  { label: "Testimonios", keys: ["testimonial.1", "testimonial.2", "testimonial.3"] },
]

function ContentPage() {
  const allContent = useQuery(api.siteContent.listAll)
  const upsert = useMutation(api.siteContent.upsert)
  const removeContent = useMutation(api.siteContent.remove)

  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editEs, setEditEs] = useState("")
  const [editEn, setEditEn] = useState("")
  const [newKey, setNewKey] = useState("")
  const [newEs, setNewEs] = useState("")
  const [newEn, setNewEn] = useState("")

  const startEdit = (key: string, es: string, en: string) => {
    setEditingKey(key)
    setEditEs(es)
    setEditEn(en)
  }

  const saveEdit = async () => {
    if (!editingKey) return
    await upsert({ key: editingKey, value: { es: editEs, en: editEn }, type: "text" })
    setEditingKey(null)
  }

  const handleAdd = async () => {
    if (!newKey || !newEs) return
    await upsert({ key: newKey, value: { es: newEs, en: newEn || newEs }, type: "text" })
    setNewKey("")
    setNewEs("")
    setNewEn("")
  }

  const contentMap = new Map(
    (allContent ?? []).map((c) => [c.key, c])
  )

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-h2 mb-6">Contenido del Sitio</h1>
      <p className="text-muted-foreground mb-8">
        Edita los textos que aparecen en la página de marca personal. Los cambios se reflejan en tiempo real.
      </p>

      {sections.map((section) => (
        <div key={section.label} className="mb-10">
          <h2 className="font-semibold text-lg mb-4">{section.label}</h2>
          <div className="space-y-4">
            {section.keys.map((key) => {
              const content = contentMap.get(key)
              const isEditing = editingKey === key

              return (
                <div key={key} className="bg-muted p-4">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm text-muted-foreground">{key}</code>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <Button size="sm" onClick={saveEdit}>
                          <Save data-icon="inline-start" className="size-3.5" />
                          Guardar
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            startEdit(key, content?.value.es ?? "", content?.value.en ?? "")
                          }
                        >
                          Editar
                        </Button>
                      )}
                      {content && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContent({ contentId: content._id })}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs uppercase tracking-wider mb-1 block">ES</Label>
                        <Input value={editEs} onChange={(e) => setEditEs(e.target.value)} />
                      </div>
                      <div>
                        <Label className="text-xs uppercase tracking-wider mb-1 block">EN</Label>
                        <Input value={editEn} onChange={(e) => setEditEn(e.target.value)} />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <p className="text-sm">
                        <span className="text-muted-foreground">ES:</span>{" "}
                        {content?.value.es || <span className="text-muted-foreground/50 italic">vacío</span>}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">EN:</span>{" "}
                        {content?.value.en || <span className="text-muted-foreground/50 italic">vacío</span>}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <Separator className="my-8" />

      <h2 className="font-semibold text-lg mb-4">Agregar contenido personalizado</h2>
      <div className="space-y-4">
        <div>
          <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Clave</Label>
          <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="seccion.campo" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Valor (ES)</Label>
            <Input value={newEs} onChange={(e) => setNewEs(e.target.value)} placeholder="Texto en español" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wider font-medium mb-2 block">Valor (EN)</Label>
            <Input value={newEn} onChange={(e) => setNewEn(e.target.value)} placeholder="Text in English" />
          </div>
        </div>
        <Button onClick={handleAdd} disabled={!newKey || !newEs}>
          <Plus data-icon="inline-start" className="size-4" />
          Agregar
        </Button>
      </div>
    </div>
  )
}
