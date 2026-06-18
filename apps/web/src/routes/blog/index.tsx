import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import { useTranslation } from "react-i18next"
import { Navigation } from "#/components/landing/navigation"
import { Footer } from "#/components/landing/footer"

export const Route = createFileRoute("/blog/")({
  component: BlogPage,
})

function BlogPage() {
  const { i18n } = useTranslation()
  const locale = i18n.language as "es" | "en"
  const posts = useQuery(api.blogPosts.listPublished)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
            Blog
          </p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] tracking-tight mb-12 max-w-2xl">
            Artículos sobre maquillaje
          </h1>

          {posts === undefined ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground py-16 text-center">
              Próximamente: artículos sobre maquillaje y tendencias
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post._id} to={`/blog/${post.slug}`} className="group">
                  {post.coverImageUrl && (
                    <div className="aspect-[16/9] bg-accent/20 mb-4 overflow-hidden">
                      <img
                        src={post.coverImageUrl}
                        alt={post.title[locale]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h2 className="font-semibold text-lg mb-1 group-hover:opacity-70 transition-opacity">
                    {post.title[locale]}
                  </h2>
                  <p className="text-muted-foreground line-clamp-2">
                    {post.excerpt[locale]}
                  </p>
                  {post.publishedAt && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {new Date(post.publishedAt).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
