import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

import path from "node:path";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@convex": path.resolve(__dirname, "../backend/convex"),
    },
  },
  // In production bundle everything into the SSR output so no client lib (base-ui,
  // framer-motion, …) is left importing `react` as an external the Vercel function
  // can't resolve. tslib stays external to avoid a CJS/ESM interop mismatch.
  ssr: {
    noExternal: process.env.NODE_ENV === "production" ? true : ["@convex-dev/better-auth", "@base-ui/react"],
    external: ["tslib"],
  },
  server: { host: true },
  plugins: [
    ...(process.env.NODE_ENV !== "production" ? [devtools()] : []),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
});
