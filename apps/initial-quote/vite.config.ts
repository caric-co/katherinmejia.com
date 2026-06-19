import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { port: 5173 },
  plugins: [devtools(), tailwindcss(), tanstackStart(), nitro({ compatibilityDate: "2025-01-01" }), viteReact()],
})
