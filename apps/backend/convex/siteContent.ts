import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

const bilingualText = v.object({ es: v.string(), en: v.string() })

export const getByKey = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first()
  },
})

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("siteContent").collect()
  },
})

export const listByPrefix = query({
  args: { prefix: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("siteContent").collect()
    return all.filter((c) => c.key.startsWith(args.prefix))
  },
})

export const hasDrafts = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("siteContent").collect()
    return all.some((c) => c.draftValue !== undefined)
  },
})

export const saveDraft = mutation({
  args: {
    key: v.string(),
    value: bilingualText,
    type: v.union(v.literal("text"), v.literal("richtext"), v.literal("image")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        draftValue: args.value,
        updatedAt: Date.now(),
      })
      return existing._id
    }

    return await ctx.db.insert("siteContent", {
      key: args.key,
      value: args.value,
      draftValue: args.value,
      type: args.type,
      updatedAt: Date.now(),
    })
  },
})

export const publishAll = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("siteContent").collect()
    let count = 0
    for (const item of all) {
      if (item.draftValue) {
        await ctx.db.patch(item._id, {
          value: item.draftValue,
          draftValue: undefined,
          updatedAt: Date.now(),
        })
        count++
      }
    }
    return count
  },
})

export const discardDrafts = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("siteContent").collect()
    for (const item of all) {
      if (item.draftValue) {
        await ctx.db.patch(item._id, {
          draftValue: undefined,
        })
      }
    }
  },
})

export const upsert = mutation({
  args: {
    key: v.string(),
    value: bilingualText,
    type: v.union(v.literal("text"), v.literal("richtext"), v.literal("image")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        type: args.type,
        updatedAt: Date.now(),
      })
      return existing._id
    }

    return await ctx.db.insert("siteContent", {
      key: args.key,
      value: args.value,
      type: args.type,
      updatedAt: Date.now(),
    })
  },
})

export const remove = mutation({
  args: { contentId: v.id("siteContent") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.contentId)
  },
})
