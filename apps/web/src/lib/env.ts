import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    CONVEX_DEPLOYMENT: z.string().min(1).optional(),
  },
  clientPrefix: "VITE_",
  client: {
    VITE_CONVEX_URL: z.string().url(),
    VITE_CONVEX_SITE_URL: z.string().url(),
    VITE_SITE_URL: z.string().url(),
  },
  runtimeEnv: import.meta.env,
})
