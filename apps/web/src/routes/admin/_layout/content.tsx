import { createFileRoute } from "@tanstack/react-router"
import { FileText } from "lucide-react"

export const Route = createFileRoute("/admin/_layout/content")({
  component: ContentPage,
})

function ContentPage() {
  return (
    <div>
      <h1 className="font-display text-h2 mb-6">Contenido del Sitio</h1>
      <div className="text-center py-16">
        <FileText className="size-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">Editor de contenido del sitio (próximamente)</p>
      </div>
    </div>
  )
}
