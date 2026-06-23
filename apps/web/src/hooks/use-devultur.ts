import { useCallback, useEffect } from "react";

import { useAction } from "convex/react";

import { api } from "@convex/_generated/api";

import { media } from "#/lib/media";
import { useDevulturStore } from "#/stores/devultur-store";

export function useDevultur() {
  const token = useDevulturStore((s) => s.token);
  const setToken = useDevulturStore((s) => s.setToken);
  const issueViewerToken = useAction(api.devultur.issueViewerToken);
  const createUploadUrlAction = useAction(api.devultur.createUploadUrl);
  const deleteMediaAction = useAction(api.devultur.deleteMedia);
  const deleteVideoAction = useAction(api.devultur.deleteVideo);

  useEffect(() => {
    if (token) return;
    issueViewerToken().then(setToken);
  }, [token, issueViewerToken, setToken]);

  const uploadUrl = useCallback(
    async (file: File) => {
      const r = await createUploadUrlAction({ filename: file.name, contentType: file.type });
      return { url: r.url, key: r.key };
    },
    [createUploadUrlAction],
  );

  const deleteMedia = useCallback(
    (mediaUrl: string) => {
      const key = media.extractKey(mediaUrl);
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
