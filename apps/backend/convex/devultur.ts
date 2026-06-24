import { CaptionLocale, Devultur, TranscodePreset } from "@devultur/convex";

import { components } from "./_generated/api";

export const {
  issueViewerToken,
  createUploadUrl,
  deleteMedia,
  deleteVideo,
  processVideo,
  getMedia,
  saveProgress,
  loadProgress,
  markComplete,
  resetProgress,
} = Devultur.exposeApi(components.devultur, {
  preset: TranscodePreset.HLS_ADAPTIVE,
  locales: [CaptionLocale.ES_CO, CaptionLocale.EN],
});
