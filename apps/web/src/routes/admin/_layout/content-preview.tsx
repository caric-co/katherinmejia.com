import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Button } from "@repo/ui/components/button"
import { ArrowLeft } from "lucide-react"
import { LandingPreview } from "#/components/landing/landing-preview"

export const Route = createFileRoute("/admin/_layout/content-preview")({
  component: ContentPreviewPage,
})

function ContentPreviewPage() {
  const navigate = useNavigate()

  return (
    <div className="-m-6 md:-m-8">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-3">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/admin/content" })}>
          <ArrowLeft data-icon="inline-start" className="size-3.5" />
          Volver al editor
        </Button>
      </div>
      <LandingPreview />
    </div>
  )
}
