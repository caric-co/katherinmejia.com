import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal("active"), v.literal("cancelled"), v.literal("past_due"), v.literal("expired")),
    ),
  },
  handler: async (ctx, args) => {
    const subs = args.status
      ? await ctx.db
          .query("subscriptions")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .collect()
      : await ctx.db.query("subscriptions").collect();

    const userIds = [...new Set(subs.map((s) => s.userId))];
    const users = await Promise.all(
      userIds.map((email) =>
        ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", email))
          .first(),
      ),
    );
    const userMap = Object.fromEntries(users.filter(Boolean).map((u) => [u!.email, u!]));

    return subs.map((sub) => ({
      ...sub,
      userName: userMap[sub.userId]
        ? `${userMap[sub.userId].name} ${userMap[sub.userId].lastName ?? ""}`.trim()
        : sub.userId,
      userEmail: sub.userId,
    }));
  },
});

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getById = query({
  args: { subscriptionId: v.id("subscriptions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.subscriptionId);
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    plan: v.union(v.literal("monthly"), v.literal("annual")),
    provider: v.union(v.literal("wompi"), v.literal("bold"), v.literal("manual")),
    externalId: v.optional(v.string()),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (existing) {
      throw new Error("El usuario ya tiene una suscripción activa");
    }

    return await ctx.db.insert("subscriptions", {
      ...args,
      status: "active",
      createdAt: Date.now(),
    });
  },
});

export const cancel = mutation({
  args: { subscriptionId: v.id("subscriptions") },
  handler: async (ctx, args) => {
    const sub = await ctx.db.get(args.subscriptionId);
    if (!sub) throw new Error("Suscripción no encontrada");
    if (sub.status !== "active" && sub.status !== "past_due") {
      throw new Error("Solo se pueden cancelar suscripciones activas");
    }

    await ctx.db.patch(args.subscriptionId, {
      status: "cancelled",
      cancelledAt: Date.now(),
    });
  },
});

export const reactivate = mutation({
  args: {
    subscriptionId: v.id("subscriptions"),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
  },
  handler: async (ctx, args) => {
    const sub = await ctx.db.get(args.subscriptionId);
    if (!sub) throw new Error("Suscripción no encontrada");
    if (sub.status === "active") {
      throw new Error("La suscripción ya está activa");
    }

    await ctx.db.patch(args.subscriptionId, {
      status: "active",
      currentPeriodStart: args.currentPeriodStart,
      currentPeriodEnd: args.currentPeriodEnd,
      cancelledAt: undefined,
    });
  },
});

export const updateStatus = mutation({
  args: {
    subscriptionId: v.id("subscriptions"),
    status: v.union(v.literal("active"), v.literal("cancelled"), v.literal("past_due"), v.literal("expired")),
  },
  handler: async (ctx, args) => {
    const sub = await ctx.db.get(args.subscriptionId);
    if (!sub) throw new Error("Suscripción no encontrada");

    const patch: Record<string, unknown> = { status: args.status };
    if (args.status === "cancelled") {
      patch.cancelledAt = Date.now();
    }

    await ctx.db.patch(args.subscriptionId, patch);
  },
});
