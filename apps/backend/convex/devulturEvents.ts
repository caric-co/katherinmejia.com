import { devulturWebhookEvent, handleWebhook } from "@devultur/server/convex";

import { internalMutation } from "./_generated/server";

export const handleMediaEvent = internalMutation({
  args: { event: devulturWebhookEvent },
  handler: async (ctx, { event }) => {
    const lesson = await ctx.db
      .query("lessons")
      .withIndex("by_videoId", (q) => q.eq("videoId", event.videoId))
      .first();
    if (!lesson) return;

    await handleWebhook({
      event,
      recordId: lesson._id,
      patch: (id, fields) => ctx.db.patch(id as any, fields),
    });
  },
});
