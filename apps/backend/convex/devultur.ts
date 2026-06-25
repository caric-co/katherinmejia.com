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
  video: {
    transcodePreset: TranscodePreset.HLS_ADAPTIVE,
    captionLocales: [CaptionLocale.ES_CO, CaptionLocale.EN],
  },
});
