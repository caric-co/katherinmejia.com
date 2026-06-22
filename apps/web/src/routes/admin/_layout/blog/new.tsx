import { useEffect, useState } from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction, useMutation } from "convex/react";

import { api } from "@convex/_generated/api";

import { BlogPostEditor } from "#/components/blog-post-editor";

export const Route = createFileRoute("/admin/_layout/blog/new")({
  component: NewBlogPostPage,
});

function NewBlogPostPage() {
  const navigate = useNavigate();
  const createPost = useMutation(api.blogPosts.create);
  const publishPost = useMutation(api.blogPosts.publish);
  const issueViewerToken = useAction(api.devultur.issueViewerToken);
  const createUploadUrl = useAction(api.devultur.createUploadUrl);
  const [viewerToken, setViewerToken] = useState<string | null>(null);

  useEffect(() => {
    issueViewerToken().then(setViewerToken);
  }, [issueViewerToken]);

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
      createUploadUrl={async (args) => {
        const r = await createUploadUrl(args);
        return { url: r.url, key: r.key };
      }}
      viewerToken={viewerToken}
    />
  );
}
