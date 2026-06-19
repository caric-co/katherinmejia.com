import path from "node:path"
import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@convex": path.resolve(__dirname, "../backend/convex"),
    },
  },
  ssr: {
    noExternal: ["@convex-dev/better-auth", "@base-ui/react"],
  },
  server: { host: true },
  nitro: {
    noExternals: true,
  },
  plugins: [
    ...(process.env.NODE_ENV !== "production" ? [devtools()] : []),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
})
