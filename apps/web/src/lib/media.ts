import { createMediaRouter, file, image, video } from "@devultur/core";

export const media = createMediaRouter({
  apiKey: import.meta.env.VITE_DEVULTUR_API_KEY,
  baseUrl: import.meta.env.VITE_DEVULTUR_API_URL,

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
