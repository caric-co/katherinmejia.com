import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";

import { api } from "@convex/_generated/api";

import { BlogPostEditor } from "#/components/blog-post-editor";
import { useDevultur } from "#/hooks/use-devultur";

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
  const { token, uploadUrl } = useDevultur();

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
      createUploadUrl={uploadUrl}
      viewerToken={token}
    />
  );
}
