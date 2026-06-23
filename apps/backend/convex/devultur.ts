import { createDevulturClient } from "@devultur/server/convex";

import { action } from "./_generated/server";

const devultur = createDevulturClient({
  apiKey: process.env.DEVULTUR_API_KEY!,
  baseUrl: process.env.DEVULTUR_API_URL!,
});

export const issueViewerToken = action(devultur.convex.issueViewerToken);
export const createUploadUrl = action(devultur.convex.createUploadUrl);
export const deleteVideo = action(devultur.convex.deleteVideo);
export const deleteMedia = action(devultur.convex.deleteMedia);
export const requestCaptions = action(devultur.convex.requestCaptions);
