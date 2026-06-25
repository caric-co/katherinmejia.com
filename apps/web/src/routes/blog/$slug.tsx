import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ConvexHttpClient } from "convex/browser";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { api } from "@convex/_generated/api";
import { Button } from "@repo/ui/components/button";

import { Footer } from "#/components/landing/footer";
import { Navigation } from "#/components/landing/navigation";

const fetchPostMeta = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const convexUrl = process.env.VITE_CONVEX_URL || import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) return null;
    const client = new ConvexHttpClient(convexUrl);
    const post = await client.query(api.blogPosts.getBySlug, { slug });
    if (!post) return null;
    return {
      title: post.title,
      excerpt: post.excerpt,
      coverImageUrl: post.coverImageUrl,
      publishedAt: post.publishedAt,
    };
  });

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => fetchPostMeta({ data: params.slug }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Artículo no encontrado — Katherin Mejia" }] };
    }
    const title = `${loaderData.title.es} — Katherin Mejia`;
    const description = loaderData.excerpt.es;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(loaderData.coverImageUrl ? [{ property: "og:image", content: loaderData.coverImageUrl }] : []),
        { name: "twitter:card", content: loaderData.coverImageUrl ? "summary_large_image" : "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { i18n } = useTranslation();
  const locale = i18n.language as "es" | "en";
  const { data: post } = useQuery(convexQuery(api.blogPosts.getBySlug, { slug }));

  if (post === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-24 md:py-32 px-6 md:px-10 text-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-24 md:py-32 px-6 md:px-10 text-center">
          <h1 className="font-display text-h2 mb-4">Artículo no encontrado</h1>
          <Link to="/blog">
            <Button variant="outline">Ver todos los artículos</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Link to="/blog">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft data-icon="inline-start" className="size-3.5" />
              Blog
            </Button>
          </Link>

          <div className="max-w-3xl">
            {post.publishedAt && (
              <p className="text-sm text-muted-foreground mb-4">
                {new Date(post.publishedAt).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}

            <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] tracking-tight mb-6">{post.title[locale]}</h1>
          </div>

          {post.coverImageUrl && (
            <div className="aspect-[16/9] mb-8 overflow-hidden">
              <img src={post.coverImageUrl} alt={post.title[locale]} className="w-full h-full object-cover" />
            </div>
          )}

          <div
            className="max-w-3xl text-foreground/80 leading-relaxed [&_h1]:font-display [&_h1]:text-[2rem] [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:font-display [&_h2]:text-[1.5rem] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_blockquote]:border-l-2 [&_blockquote]:border-foreground/15 [&_blockquote]:pl-6 [&_blockquote]:italic [&_img]:w-full [&_img]:my-6 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:opacity-70"
            dangerouslySetInnerHTML={{ __html: post.content[locale] }}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
