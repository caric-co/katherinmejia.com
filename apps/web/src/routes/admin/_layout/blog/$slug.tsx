import { useEffect, useState } from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction, useMutation, useQuery } from "convex/react";

import { api } from "@convex/_generated/api";

import { BlogPostEditor } from "#/components/blog-post-editor";

export const Route = createFileRoute("/admin/_layout/blog/$slug")({
  component: EditBlogPostPage,
});

function EditBlogPostPage() {
  const { slug: routeSlug } = Route.useParams();
  const navigate = useNavigate();
  const post = useQuery(api.blogPosts.getBySlug, { slug: routeSlug });
  const updatePost = useMutation(api.blogPosts.update);
  const publishPost = useMutation(api.blogPosts.publish);
  const unpublishPost = useMutation(api.blogPosts.unpublish);
  const issueViewerToken = useAction(api.devultur.issueViewerToken);
  const createUploadUrl = useAction(api.devultur.createUploadUrl);
  const [viewerToken, setViewerToken] = useState<string | null>(null);

  useEffect(() => {
    issueViewerToken().then(setViewerToken);
  }, [issueViewerToken]);

  if (post === undefined) return <p className="text-muted-foreground">Cargando...</p>;
  if (post === null) return <p className="text-destructive">Artículo no encontrado</p>;

  return (
    <BlogPostEditor
      key={post._id}
      initialData={{
        titleEs: post.title.es,
        titleEn: post.title.en,
        excerptEs: post.excerpt.es,
        excerptEn: post.excerpt.en,
        contentHtml: post.content.es,
        contentEn: post.content.en,
        coverImageUrl: post.coverImageUrl,
      }}
      isPublished={post.status === "published"}
      onSave={async (data) => {
        await updatePost({ postId: post._id, ...data });
        navigate({ to: "/admin/blog" });
      }}
      onPublish={async (data) => {
        await updatePost({ postId: post._id, ...data });
        await publishPost({ postId: post._id });
        navigate({ to: "/admin/blog" });
      }}
      onCancel={() => navigate({ to: "/admin/blog" })}
      onUnpublish={() => unpublishPost({ postId: post._id })}
      createUploadUrl={async (args) => {
        const r = await createUploadUrl(args);
        return { url: r.url, key: r.key };
      }}
      viewerToken={viewerToken}
    />
  );
}
