import { createMediaRouter, file, image, video } from "@devultur/core";

export const media = createMediaRouter({
  apiKey: "",
  baseUrl: "https://devultur-api.crdemar.workers.dev",

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
