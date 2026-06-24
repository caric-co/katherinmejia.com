import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const bilingualText = v.object({ es: v.string(), en: v.string() });

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    lastName: v.optional(v.string()),
    role: v.union(v.literal("student"), v.literal("admin")),
    avatar: v.optional(v.string()),
    authProvider: v.union(v.literal("email"), v.literal("google"), v.literal("apple")),
    locale: v.union(v.literal("es"), v.literal("en")),
    status: v.union(v.literal("active"), v.literal("blocked"), v.literal("deleted")),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  courses: defineTable({
    title: bilingualText,
    description: bilingualText,
    slug: bilingualText,
    thumbnailUrl: v.optional(v.string()),
    previewVideoId: v.optional(v.string()),
    price: v.number(),
    currency: v.literal("COP"),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    order: v.number(),
    createdAt: v.number(),
  })
    .index("by_slug_es", ["slug.es"])
    .index("by_slug_en", ["slug.en"])
    .index("by_status", ["status"])
    .index("by_order", ["order"]),

  lessons: defineTable({
    courseId: v.id("courses"),
    title: bilingualText,
    slug: v.optional(v.string()),
    description: bilingualText,
    videoId: v.string(),
    order: v.number(),
    isFree: v.boolean(),
  })
    .index("by_course", ["courseId"])
    .index("by_course_order", ["courseId", "order"]),

  progress: defineTable({
    userId: v.string(),
    lessonId: v.id("lessons"),
    courseId: v.id("courses"),
    watchedSeconds: v.number(),
    duration: v.number(),
    completed: v.boolean(),
    lastWatchedAt: v.number(),
  })
    .index("by_user_lesson", ["userId", "lessonId"])
    .index("by_user_course", ["userId", "courseId"]),

  purchases: defineTable({
    userId: v.string(),
    courseId: v.id("courses"),
    amount: v.number(),
    currency: v.string(),
    provider: v.union(v.literal("bold"), v.literal("manual"), v.literal("invitation")),
    transactionId: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("refunded")),
    grantedBy: v.union(v.literal("admin"), v.literal("invitation"), v.literal("payment")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_course", ["userId", "courseId"])
    .index("by_course", ["courseId"]),

  subscriptions: defineTable({
    userId: v.string(),
    plan: v.union(v.literal("monthly"), v.literal("annual")),
    status: v.union(v.literal("active"), v.literal("cancelled"), v.literal("past_due"), v.literal("expired")),
    provider: v.union(v.literal("wompi"), v.literal("bold"), v.literal("manual")),
    externalId: v.optional(v.string()),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelledAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  invitationLinks: defineTable({
    courseId: v.id("courses"),
    code: v.string(),
    maxUses: v.number(),
    usedCount: v.number(),
    expiresAt: v.optional(v.number()),
    createdBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_course", ["courseId"]),

  siteContent: defineTable({
    key: v.string(),
    value: bilingualText,
    draftValue: v.optional(bilingualText),
    type: v.union(v.literal("text"), v.literal("richtext"), v.literal("image")),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  blogPosts: defineTable({
    title: bilingualText,
    slug: bilingualText,
    content: bilingualText,
    excerpt: bilingualText,
    coverImageUrl: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_slug_es", ["slug.es"])
    .index("by_slug_en", ["slug.en"])
    .index("by_status", ["status"]),
});
