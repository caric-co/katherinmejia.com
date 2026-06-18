import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

const bilingualText = v.object({ es: v.string(), en: v.string() })

export const listByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_course_order", (q) => q.eq("courseId", args.courseId))
      .collect()
  },
})

export const getById = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lessonId)
  },
})

export const create = mutation({
  args: {
    courseId: v.id("courses"),
    title: bilingualText,
    description: bilingualText,
    videoId: v.string(),
    duration: v.number(),
    isFree: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect()
    const maxOrder = existing.reduce((max, l) => Math.max(max, l.order), 0)

    return await ctx.db.insert("lessons", {
      ...args,
      order: maxOrder + 1,
    })
  },
})

export const update = mutation({
  args: {
    lessonId: v.id("lessons"),
    title: v.optional(bilingualText),
    description: v.optional(bilingualText),
    videoId: v.optional(v.string()),
    duration: v.optional(v.number()),
    isFree: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { lessonId, ...updates } = args
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined)
    )
    if (Object.keys(filtered).length > 0) {
      await ctx.db.patch(lessonId, filtered)
    }
  },
})

export const reorder = mutation({
  args: {
    lessonIds: v.array(v.id("lessons")),
  },
  handler: async (ctx, args) => {
    for (let i = 0; i < args.lessonIds.length; i++) {
      await ctx.db.patch(args.lessonIds[i], { order: i + 1 })
    }
  },
})

export const remove = mutation({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.lessonId)
  },
})
