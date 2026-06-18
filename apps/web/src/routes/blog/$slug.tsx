import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { useTranslation } from "react-i18next"
import { Button } from "@repo/ui/components/button"
import { Navigation } from "#/components/landing/navigation"
import { Footer } from "#/components/landing/footer"
import { ArrowLeft } from "lucide-react"

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
})

function BlogPostPage() {
  const { slug } = Route.useParams()
  const { i18n } = useTranslation()
  const locale = i18n.language as "es" | "en"
  const post = useQuery(api.blogPosts.getBySlug, { slug })

  if (post === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 px-6 text-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (post === null) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 px-6 text-center">
          <h1 className="font-display text-h2 mb-4">Artículo no encontrado</h1>
          <Link to="/blog">
            <Button variant="outline">Ver todos los artículos</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft data-icon="inline-start" className="size-3.5" />
              Blog
            </Button>
          </Link>

          {post.publishedAt && (
            <p className="text-sm text-muted-foreground mb-4">
              {new Date(post.publishedAt).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] tracking-tight mb-6">
            {post.title[locale]}
          </h1>

          {post.coverImageUrl && (
            <div className="aspect-[16/9] mb-8 overflow-hidden">
              <img
                src={post.coverImageUrl}
                alt={post.title[locale]}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {post.content[locale]}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
