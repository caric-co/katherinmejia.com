import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const bilingualText = v.object({ es: v.string(), en: v.string() });

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("blogPosts").order("desc").collect();
  },
});

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const byEs = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug_es", (q) => q.eq("slug.es", args.slug))
      .first();
    if (byEs) return byEs;

    return await ctx.db
      .query("blogPosts")
      .withIndex("by_slug_en", (q) => q.eq("slug.en", args.slug))
      .first();
  },
});

export const getById = query({
  args: { postId: v.id("blogPosts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.postId);
  },
});

export const create = mutation({
  args: {
    title: bilingualText,
    slug: bilingualText,
    content: bilingualText,
    excerpt: bilingualText,
    coverImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("blogPosts", {
      ...args,
      status: "draft",
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    postId: v.id("blogPosts"),
    title: v.optional(bilingualText),
    slug: v.optional(bilingualText),
    content: v.optional(bilingualText),
    excerpt: v.optional(bilingualText),
    coverImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { postId, ...updates } = args;
    const filtered = Object.fromEntries(Object.entries(updates).filter(([, val]) => val !== undefined));
    if (Object.keys(filtered).length > 0) {
      await ctx.db.patch(postId, filtered);
    }
  },
});

export const publish = mutation({
  args: { postId: v.id("blogPosts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, {
      status: "published",
      publishedAt: Date.now(),
    });
  },
});

export const unpublish = mutation({
  args: { postId: v.id("blogPosts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.postId, { status: "draft" });
  },
});

export const remove = mutation({
  args: { postId: v.id("blogPosts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.postId);
  },
});
