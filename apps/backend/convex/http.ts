import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

http.route({
  path: "/api/devultur-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (secret !== process.env.INTERNAL_API_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }
    const event = await request.json();
    await ctx.runMutation(internal.devulturEvents.handleMediaEvent, { event });
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
