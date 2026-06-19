import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const listByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("purchases")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
  },
});

export const grantAccess = mutation({
  args: {
    userId: v.string(),
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("purchases")
      .withIndex("by_user_course", (q) => q.eq("userId", args.userId).eq("courseId", args.courseId))
      .first();

    if (existing?.status === "completed") {
      throw new Error("El usuario ya tiene acceso a este curso");
    }

    return await ctx.db.insert("purchases", {
      userId: args.userId,
      courseId: args.courseId,
      amount: 0,
      currency: "COP",
      provider: "manual",
      status: "completed",
      grantedBy: "admin",
      createdAt: Date.now(),
    });
  },
});

export const revokeAccess = mutation({
  args: { purchaseId: v.id("purchases") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.purchaseId, { status: "refunded" });
  },
});
