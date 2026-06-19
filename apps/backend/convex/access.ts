import { v } from "convex/values"
import { query } from "./_generated/server"

export const hasAccess = query({
  args: {
    userId: v.string(),
    courseId: v.id("courses"),
    lessonId: v.optional(v.id("lessons")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userId))
      .first()

    if (!user) return { hasAccess: false, reason: "none" as const }
    if (user.status !== "active") return { hasAccess: false, reason: "blocked" as const }
    if (user.role === "admin") return { hasAccess: true, reason: "admin" as const }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first()

    if (subscription?.status === "active") {
      return { hasAccess: true, reason: "subscription" as const }
    }

    const purchase = await ctx.db
      .query("purchases")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", args.userId).eq("courseId", args.courseId)
      )
      .first()

    if (purchase?.status === "completed") {
      return { hasAccess: true, reason: "purchased" as const }
    }

    if (args.lessonId) {
      const lesson = await ctx.db.get(args.lessonId)
      if (lesson?.isFree) {
        return { hasAccess: true, reason: "free" as const }
      }
    }

    return { hasAccess: false, reason: "none" as const }
  },
})
