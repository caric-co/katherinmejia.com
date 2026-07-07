import { createMediaRouter, extractKeyFromUrl, file, image, video } from "@devultur/core";

const baseUrl = import.meta.env.VITE_DEVULTUR_API_URL || "https://devultur-api.crdemar.workers.dev";

export const media = createMediaRouter({
  baseUrl,

  video: video({
    maxSize: "2GB",
    locales: ["es-CO", "en"],
  }),

  image: image({
    maxSize: "10MB",
  }),

  file: file({
    maxSize: "500MB",
  }),
});

/**
 * Reverses {@link media.getMediaUrl}: returns the devultur storage key for a URL
 * we produced, or `null` for anything that isn't a devultur URL (e.g. an Unsplash
 * fallback). Use before `useDevultur().deleteMedia` so we never try to delete
 * media we don't own.
 */
export const mediaKeyFromUrl = (url: string): string | null => extractKeyFromUrl(url, baseUrl);
