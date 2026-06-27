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
  server: { host: true },
  plugins: [
    ...(process.env.NODE_ENV !== "production" ? [devtools()] : []),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
});
