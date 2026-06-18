import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

export const listByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invitationLinks")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect()
  },
})

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("invitationLinks").collect()
  },
})

export const create = mutation({
  args: {
    courseId: v.id("courses"),
    maxUses: v.number(),
    expiresAt: v.optional(v.number()),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const code = generateCode()
    return await ctx.db.insert("invitationLinks", {
      courseId: args.courseId,
      code,
      maxUses: args.maxUses,
      usedCount: 0,
      expiresAt: args.expiresAt,
      createdBy: args.createdBy,
      createdAt: Date.now(),
    })
  },
})

export const redeem = mutation({
  args: {
    code: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("invitationLinks")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first()

    if (!invitation) throw new Error("Código de invitación inválido")
    if (invitation.usedCount >= invitation.maxUses) throw new Error("Este enlace ya alcanzó el límite de usos")
    if (invitation.expiresAt && Date.now() > invitation.expiresAt) throw new Error("Este enlace ha expirado")

    const existingPurchase = await ctx.db
      .query("purchases")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", args.userId).eq("courseId", invitation.courseId)
      )
      .first()

    if (existingPurchase?.status === "completed") {
      throw new Error("Ya tienes acceso a este curso")
    }

    await ctx.db.insert("purchases", {
      userId: args.userId,
      courseId: invitation.courseId,
      amount: 0,
      currency: "COP",
      provider: "invitation",
      status: "completed",
      grantedBy: "invitation",
      createdAt: Date.now(),
    })

    await ctx.db.patch(invitation._id, {
      usedCount: invitation.usedCount + 1,
    })

    return invitation.courseId
  },
})

export const remove = mutation({
  args: { invitationId: v.id("invitationLinks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.invitationId)
  },
})

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}
