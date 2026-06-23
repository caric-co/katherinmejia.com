import { useCallback, useEffect, useState } from "react";

import { useAction } from "convex/react";

import { api } from "@convex/_generated/api";

function extractKeyFromMediaUrl(mediaUrl: string): string | null {
  const match = mediaUrl.match(/\/v1\/media\/(.+?)(?:\?|$)/);
  return match?.[1] ?? null;
}

export function useDevultur() {
  const issueViewerToken = useAction(api.devultur.issueViewerToken);
  const createUploadUrlAction = useAction(api.devultur.createUploadUrl);
  const deleteMediaAction = useAction(api.devultur.deleteMedia);
  const deleteVideoAction = useAction(api.devultur.deleteVideo);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    issueViewerToken().then(setToken);
  }, [issueViewerToken]);

  const uploadUrl = useCallback(
    async (file: File) => {
      const r = await createUploadUrlAction({ filename: file.name, contentType: file.type });
      return { url: r.url, key: r.key };
    },
    [createUploadUrlAction],
  );

  const deleteMedia = useCallback(
    (mediaUrl: string) => {
      const key = extractKeyFromMediaUrl(mediaUrl);
      if (key) deleteMediaAction({ key }).catch(() => {});
    },
    [deleteMediaAction],
  );

  const deleteVideo = useCallback(
    (videoId: string) => {
      deleteVideoAction({ videoId }).catch(() => {});
    },
    [deleteVideoAction],
  );

  return { token, uploadUrl, deleteMedia, deleteVideo };
}
