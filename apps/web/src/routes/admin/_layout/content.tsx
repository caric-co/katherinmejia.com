import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation, useAction } from "convex/react"
import { api } from "@convex/_generated/api"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Badge } from "@repo/ui/components/badge"
import { Save, Loader2, Pencil, X, Upload, Undo2 } from "lucide-react"
import { useState, useCallback, useRef, useEffect } from "react"
import { motion, useAnimationControls } from "motion/react"
import { LandingPreview } from "#/components/landing/landing-preview"

export const Route = createFileRoute("/admin/_layout/content")({
  component: ContentPage,
})

const sections = [
  {
    label: "Hero",
    keys: [
      { key: "hero.title", label: "Título", long: false },
      { key: "hero.subtitle", label: "Subtítulo", long: true },
      { key: "hero.cta", label: "Botón CTA", long: false },
      { key: "hero.image", label: "URL imagen de fondo", long: false },
    ],
  },
  {
    label: "Servicios",
    keys: [
      { key: "services.label", label: "Etiqueta", long: false },
      { key: "services.heading", label: "Título de sección", long: false },
      { key: "services.1.title", label: "Servicio 1 — Título", long: false },
      { key: "services.1.description", label: "Servicio 1 — Descripción", long: true },
      { key: "services.1.image", label: "Servicio 1 — URL imagen", long: false },
      { key: "services.2.title", label: "Servicio 2 — Título", long: false },
      { key: "services.2.description", label: "Servicio 2 — Descripción", long: true },
      { key: "services.2.image", label: "Servicio 2 — URL imagen", long: false },
      { key: "services.3.title", label: "Servicio 3 — Título", long: false },
      { key: "services.3.description", label: "Servicio 3 — Descripción", long: true },
      { key: "services.3.image", label: "Servicio 3 — URL imagen", long: false },
    ],
  },
  {
    label: "Sobre Mí",
    keys: [
      { key: "about.label", label: "Etiqueta", long: false },
      { key: "about.title", label: "Nombre", long: false },
      { key: "about.bio", label: "Bio (párrafo 1)", long: true },
      { key: "about.bio2", label: "Bio (párrafo 2)", long: true },
      { key: "about.image", label: "URL imagen", long: false },
    ],
  },
  {
    label: "Cursos",
    keys: [
      { key: "courses.label", label: "Etiqueta", long: false },
      { key: "courses.heading", label: "Título de sección", long: false },
    ],
  },
  {
    label: "Testimonios",
    keys: [
      { key: "testimonials.label", label: "Etiqueta", long: false },
      { key: "testimonials.heading", label: "Título de sección", long: false },
      { key: "testimonials.1.name", label: "Testimonio 1 — Nombre", long: false },
      { key: "testimonials.1.text", label: "Testimonio 1 — Texto", long: true },
      { key: "testimonials.2.name", label: "Testimonio 2 — Nombre", long: false },
      { key: "testimonials.2.text", label: "Testimonio 2 — Texto", long: true },
      { key: "testimonials.3.name", label: "Testimonio 3 — Nombre", long: false },
      { key: "testimonials.3.text", label: "Testimonio 3 — Texto", long: true },
    ],
  },
  {
    label: "Contacto",
    keys: [
      { key: "contact.label", label: "Etiqueta", long: false },
      { key: "contact.heading", label: "Título", long: false },
      { key: "contact.description", label: "Descripción", long: true },
    ],
  },
]

const isImageKey = (key: string) => key.endsWith(".image")

function ContentField({
  fieldKey,
  label,
  long,
  isEditing,
  hasDraft,
  displayValue,
  editValue,
  pulseKey,
  onEdit,
  onEditValueChange,
  onSave,
  onCancel,
  saving,
}: {
  fieldKey: string
  label: string
  long: boolean
  isEditing: boolean
  hasDraft: boolean
  displayValue: string
  editValue: string
  pulseKey: number
  onEdit: () => void
  onEditValueChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
}) {
  const controls = useAnimationControls()

  useEffect(() => {
    if (pulseKey > 0) {
      controls.start({
        scale: [1, 1.02, 1],
        transition: { duration: 0.3, ease: "easeOut" },
      })
    }
  }, [pulseKey, controls])

  return (
    <motion.div
      data-field={fieldKey}
      animate={controls}
      className={`p-3 rounded-sm ${isEditing ? "bg-muted" : "hover:bg-muted/50 cursor-pointer"} ${hasDraft && !isEditing ? "bg-muted/30 ring-1 ring-foreground/5" : ""}`}
    >
      {isEditing ? (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
          {long ? (
            <textarea
              value={editValue}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onEditValueChange(e.target.value)}
              autoFocus
              className="flex field-sizing-content min-h-16 w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground/60 focus-visible:border-foreground/40"
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEditValueChange(e.target.value)}
              autoFocus
              className="text-sm"
            />
          )}
          <div className="flex gap-2 mt-2">
            <Button size="xs" onClick={onSave} disabled={saving || !editValue || editValue === displayValue}>
              {saving ? (
                <Loader2 data-icon="inline-start" className="size-3 animate-spin" />
              ) : (
                <Save data-icon="inline-start" className="size-3" />
              )}
              {saving ? "Guardando..." : "Guardar"}
            </Button>
            <Button variant="ghost" size="xs" onClick={onCancel}>
              <X data-icon="inline-start" className="size-3" />
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="flex items-start justify-between gap-2 group"
          onClick={onEdit}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-xs text-muted-foreground">{label}</p>
              {hasDraft && (
                <span className="size-1.5 rounded-full bg-foreground/40" />
              )}
            </div>
            <p className="text-sm break-words line-clamp-2">
              {displayValue || <span className="text-muted-foreground/40 italic">vacío</span>}
            </p>
          </div>
          <Pencil className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
        </div>
      )}
    </motion.div>
  )
}

function ContentPage() {
  const allContent = useQuery(api.siteContent.listAll)
  const hasDrafts = useQuery(api.siteContent.hasDrafts)
  const saveDraft = useMutation(api.siteContent.saveDraft)
  const publishAll = useMutation(api.siteContent.publishAll)
  const discardDrafts = useMutation(api.siteContent.discardDrafts)
  const translateAction = useAction(api.ai.translateText)

  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [pulseCounter, setPulseCounter] = useState(0)
  const editorPanelRef = useRef<HTMLDivElement>(null)

  const contentMap = new Map(
    (allContent ?? []).map((c) => [c.key, c])
  )

  const startEdit = (key: string, currentEs: string) => {
    setEditingKey(key)
    setEditValue(currentEs)
    setPulseCounter((c) => c + 1)
  }

  const handleFieldClick = useCallback((key: string) => {
    const content = contentMap.get(key)
    const hasDraft = content?.draftValue !== undefined
    const displayValue = hasDraft ? content?.draftValue?.es : content?.value.es
    setEditingKey(key)
    setEditValue(displayValue ?? "")
    setPulseCounter((c) => c + 1)

    setTimeout(() => {
      const panel = editorPanelRef.current
      const el = panel?.querySelector(`[data-field="${key}"]`) as HTMLElement | null
      if (panel && el) {
        const panelRect = panel.getBoundingClientRect()
        const elRect = el.getBoundingClientRect()
        const targetScroll = panel.scrollTop + (elRect.top - panelRect.top) - (panelRect.height / 2) + (elRect.height / 2)
        panel.scrollTo({ top: targetScroll, behavior: "smooth" })
      }
    }, 50)
  }, [contentMap])

  const handleSave = async () => {
    if (!editingKey || !editValue) return

    const current = contentMap.get(editingKey)
    const originalValue = current?.draftValue?.es ?? current?.value.es ?? ""
    if (editValue === originalValue) {
      setEditingKey(null)
      return
    }

    setSaving(true)

    let en = editValue
    if (!isImageKey(editingKey)) {
      try {
        const result = await translateAction({ text: editValue })
        en = result.translated
      } catch {
        en = editValue
      }
    }

    await saveDraft({
      key: editingKey,
      value: { es: editValue, en },
      type: isImageKey(editingKey) ? "image" : "text",
    })
    setSaving(false)
    setEditingKey(null)
  }

  const handlePublish = async () => {
    setPublishing(true)
    await publishAll()
    setPublishing(false)
  }

  const draftCount = allContent?.filter((c) => c.draftValue !== undefined).length ?? 0

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)]">
      {/* Left: Editor */}
      <div className="w-[420px] shrink-0 border-r border-border flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h1 className="font-display text-lg mb-1">Contenido del Sitio</h1>
          <p className="text-sm text-muted-foreground">
            Escribe en español. Se traduce al guardar.
          </p>
        </div>

        {hasDrafts && (
          <div className="px-5 py-3 border-b border-border bg-muted flex items-center justify-between">
            <span className="text-sm">
              <Badge variant="outline" className="mr-2">{draftCount}</Badge>
              {draftCount === 1 ? "cambio pendiente" : "cambios pendientes"}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => discardDrafts()}>
                <Undo2 data-icon="inline-start" className="size-3.5" />
                Descartar
              </Button>
              <Button size="sm" onClick={handlePublish} disabled={publishing}>
                {publishing ? (
                  <Loader2 data-icon="inline-start" className="size-3.5 animate-spin" />
                ) : (
                  <Upload data-icon="inline-start" className="size-3.5" />
                )}
                Publicar
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto scroll-smooth px-5 py-4" ref={editorPanelRef}>
          {sections.map((section) => (
            <div key={section.label} className="mb-8">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                {section.label}
              </h2>
              <div className="space-y-1.5">
                {section.keys.map(({ key, label, long }) => {
                  const content = contentMap.get(key)
                  const isEditing = editingKey === key
                  const hasDraft = content?.draftValue !== undefined
                  const displayValue = hasDraft ? content?.draftValue?.es : content?.value.es

                  return (
                    <ContentField
                      key={key}
                      fieldKey={key}
                      label={label}
                      long={long}
                      isEditing={isEditing}
                      hasDraft={hasDraft}
                      displayValue={displayValue ?? ""}
                      editValue={editValue}
                      pulseKey={isEditing ? pulseCounter : 0}
                      onEdit={() => startEdit(key, displayValue ?? "")}
                      onEditValueChange={setEditValue}
                      onSave={handleSave}
                      onCancel={() => setEditingKey(null)}
                      saving={saving}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Live preview */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden" data-scroll-container>
        <LandingPreview onFieldClick={handleFieldClick} />
      </div>
    </div>
  )
}
