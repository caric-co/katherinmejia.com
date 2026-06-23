import { useCallback, useEffect, useMemo } from "react";

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

export function useDevulturMedia() {
  const token = useDevulturStore((s) => s.token);
  const transcodeAction = useAction(api.devultur.transcode);
  const getTranscodeStatusAction = useAction(api.devultur.getTranscodeStatus);
  const requestCaptionsAction = useAction(api.devultur.requestCaptions);
  const getCaptionsStatusAction = useAction(api.devultur.getCaptionsStatus);

  return useMemo(
    () => ({
      transcode: (key: string, options?: { preset?: string }) => transcodeAction({ key, preset: options?.preset }),
      getTranscodeStatus: (jobId: string) => getTranscodeStatusAction({ jobId }),
      requestCaptions: (key: string, locales: string[]) => requestCaptionsAction({ key, locales }),
      getCaptionsStatus: (transcriptId: string) => getCaptionsStatusAction({ transcriptId }),
      getCaptionsVtt: async (transcriptId: string) => {
        const url = `${media.getMediaUrl(`captions/${transcriptId}`)}.vtt`;
        const res = await fetch(token ? `${url}?token=${token}` : url);
        return res.ok ? res.text() : "";
      },
      getMediaUrl: (key: string) => media.getMediaUrl(key),
    }),
    [token, transcodeAction, getTranscodeStatusAction, requestCaptionsAction, getCaptionsStatusAction],
  );
}
