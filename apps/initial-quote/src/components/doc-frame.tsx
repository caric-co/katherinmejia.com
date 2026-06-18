import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { Button } from "@repo/ui/components/button"

interface DocFrameProps {
  title: string
  src: string
}

export function DocFrame({ title, src }: DocFrameProps) {
  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card px-6 py-3 flex items-center gap-4 shrink-0">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft data-icon="inline-start" className="size-3.5" />
            Índice
          </Button>
        </Link>
        <span className="text-border">|</span>
        <span className="text-sm font-medium truncate">{title}</span>
      </header>
      <iframe src={src} className="flex-1 w-full border-0" title={title} />
    </div>
  )
}
