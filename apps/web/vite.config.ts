import path from "node:path"
import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@convex": path.resolve(__dirname, "../convex/convex"),
    },
  },
  ssr: {
    noExternal: ["@convex-dev/better-auth", "@base-ui/react"],
  },
  server: { host: true },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
})

export default config
