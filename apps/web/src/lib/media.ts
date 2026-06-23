import { createMediaRouter, file, image, video } from "@devultur/core";

export const media = createMediaRouter({
  baseUrl: import.meta.env.VITE_DEVULTUR_API_URL ?? "https://devultur-api.crdemar.workers.dev",

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
