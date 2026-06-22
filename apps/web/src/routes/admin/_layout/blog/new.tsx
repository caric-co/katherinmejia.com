import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "convex/react";

import { api } from "@convex/_generated/api";

import { BlogPostEditor } from "#/components/blog-post-editor";
import { useDevultur } from "#/hooks/use-devultur";

export const Route = createFileRoute("/admin/_layout/blog/new")({
  component: NewBlogPostPage,
});

function NewBlogPostPage() {
  const navigate = useNavigate();
  const createPost = useMutation(api.blogPosts.create);
  const publishPost = useMutation(api.blogPosts.publish);
  const { token, uploadUrl } = useDevultur();

  return (
    <BlogPostEditor
      onSave={async (data) => {
        await createPost(data);
        navigate({ to: "/admin/blog" });
      }}
      onPublish={async (data) => {
        const postId = await createPost(data);
        await publishPost({ postId });
        navigate({ to: "/admin/blog" });
      }}
      onCancel={() => navigate({ to: "/admin/blog" })}
      createUploadUrl={uploadUrl}
      viewerToken={token}
    />
  );
}
