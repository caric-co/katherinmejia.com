import { createFileRoute } from "@tanstack/react-router"
import { PenLine } from "lucide-react"

export const Route = createFileRoute("/admin/_layout/blog/")({
  component: BlogListPage,
})

function BlogListPage() {
  return (
    <div>
      <h1 className="font-display text-h2 mb-6">Blog</h1>
      <div className="text-center py-16">
        <PenLine className="size-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">Gestión de artículos del blog (próximamente)</p>
      </div>
    </div>
  )
}
