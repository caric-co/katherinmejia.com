import { v } from "convex/values"
import { query, mutation, internalMutation } from "./_generated/server"

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()
  },
})

export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId)
  },
})

export const list = query({
  args: {
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let users = await ctx.db.query("users").collect()
    users = users.filter((u) => u.status !== "deleted")
    if (args.search) {
      const term = args.search.toLowerCase()
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      )
    }
    return users
  },
})

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    locale: v.optional(v.union(v.literal("es"), v.literal("en"))),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined)
    )
    if (Object.keys(filtered).length > 0) {
      await ctx.db.patch(userId, filtered)
    }
  },
})

export const setRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("student"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { role: args.role })
  },
})

export const setStatus = mutation({
  args: {
    userId: v.id("users"),
    status: v.union(v.literal("active"), v.literal("blocked"), v.literal("deleted")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { status: args.status })
  },
})

export const upsertFromAuth = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    lastName: v.optional(v.string()),
    authProvider: v.union(
      v.literal("email"),
      v.literal("google"),
      v.literal("apple")
    ),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (existing) {
      return existing._id
    }

    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      lastName: args.lastName,
      role: "student",
      authProvider: args.authProvider,
      avatar: args.avatar,
      locale: "es",
      status: "active",
      createdAt: Date.now(),
    })
  },
})
