import { betterAuth } from "better-auth/minimal"
import { createClient } from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import authConfig from "./auth.config"
import { components, internal } from "./_generated/api"
import { query } from "./_generated/server"
import type { GenericCtx } from "@convex-dev/better-auth"
import type { DataModel } from "./_generated/dataModel"

export const authComponent = createClient<DataModel>(components.betterAuth)

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: process.env.SITE_URL,
    database: authComponent.adapter(ctx),
    emailAndPassword: { enabled: true },
    plugins: [convex({ authConfig })],
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            await ctx.runMutation(internal.users.upsertFromAuth, {
              email: user.email,
              name: user.name,
              authProvider: "email",
              avatar: user.image ?? undefined,
            })
          },
        },
      },
    },
  })
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx)
  },
})
