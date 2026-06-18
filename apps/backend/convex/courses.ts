import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

const bilingualText = v.object({ es: v.string(), en: v.string() })

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const courses = await ctx.db.query("courses").withIndex("by_order").collect()
    const withLessonCount = await Promise.all(
      courses.map(async (course) => {
        const lessons = await ctx.db
          .query("lessons")
          .withIndex("by_course", (q) => q.eq("courseId", course._id))
          .collect()
        return { ...course, lessonCount: lessons.length }
      })
    )
    return withLessonCount
  },
})

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect()
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first()
  },
})

export const getById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.courseId)
  },
})

export const create = mutation({
  args: {
    title: bilingualText,
    description: bilingualText,
    slug: v.string(),
    price: v.number(),
    thumbnailUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first()
    if (existing) throw new Error("Slug already exists")

    const allCourses = await ctx.db.query("courses").collect()
    const maxOrder = allCourses.reduce((max, c) => Math.max(max, c.order), 0)

    return await ctx.db.insert("courses", {
      ...args,
      currency: "COP",
      status: "draft",
      order: maxOrder + 1,
      createdAt: Date.now(),
    })
  },
})

export const update = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.optional(bilingualText),
    description: v.optional(bilingualText),
    slug: v.optional(v.string()),
    price: v.optional(v.number()),
    thumbnailUrl: v.optional(v.string()),
    previewVideoId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { courseId, ...updates } = args
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined)
    )
    if (Object.keys(filtered).length > 0) {
      await ctx.db.patch(courseId, filtered)
    }
  },
})

export const updateStatus = mutation({
  args: {
    courseId: v.id("courses"),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.courseId, { status: args.status })
  },
})

export const remove = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.courseId, { status: "archived" })
  },
})
