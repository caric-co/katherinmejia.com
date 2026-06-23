import { createDevulturClient } from "@devultur/server/convex";

import { action } from "./_generated/server";

const devultur = createDevulturClient({
  apiKey: process.env.DEVULTUR_API_KEY!,
  baseUrl: process.env.DEVULTUR_API_URL,
  webhookUrl: `${process.env.CONVEX_SITE_URL}/api/devultur-webhook`,
  locales: ["es-CO", "en"],
  preset: "hls-720p",
});

export const issueViewerToken = action(devultur.convex.issueViewerToken);
export const createUploadUrl = action(devultur.convex.createUploadUrl);
export const processVideo = action(devultur.convex.processVideo);
export const transcode = action(devultur.convex.transcode);
export const getTranscodeStatus = action(devultur.convex.getTranscodeStatus);
export const requestCaptions = action(devultur.convex.requestCaptions);
export const getCaptionsStatus = action(devultur.convex.getCaptionsStatus);
export const deleteVideo = action(devultur.convex.deleteVideo);
export const deleteMedia = action(devultur.convex.deleteMedia);
