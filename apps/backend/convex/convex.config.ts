import betterAuth from "@convex-dev/better-auth/convex.config";
import devultur from "@devultur/convex/convex.config";
import { defineApp } from "convex/server";
import { v } from "convex/values";

const app = defineApp({
  env: {
    DEVULTUR_API_KEY: v.string(),
    DEVULTUR_API_URL: v.string(),
  },
});
app.use(betterAuth);
app.use(devultur, {
  httpPrefix: "/devultur/",
  env: {
    DEVULTUR_API_KEY: app.env.DEVULTUR_API_KEY,
    DEVULTUR_API_URL: app.env.DEVULTUR_API_URL,
  },
});

export default app;
