import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

import type { Bindings, Variables } from "../index";

export const agentRouter = new OpenAPIHono<{ Bindings: Bindings; Variables: Variables }>();

const agentChatRoute = createRoute({
  method: "post",
  path: "/",
  summary: "Interact with the Kitchen Orchestrator Agent",
  requestBody: {
    content: {
      "application/json": {
        schema: z.any(),
      },
    },
  },
  responses: {
    200: {
      description: "Agent Response",
    },
  },
});

agentRouter.openapi(agentChatRoute, async (c) => {
  // Pass the request to the KitchenOrchestrator Durable Object via Cloudflare agents API mechanism.
  // The @cloudflare/ai-chat package expects standard stream format or similar.
  // We construct the connection request using the standard DO fetch approach for agents.

  const doId = c.env.KitchenOrchestrator.idFromName("orchestrator-instance-1");
  const stub = c.env.KitchenOrchestrator.get(doId);

  // Forward the entire request to the agent's fetch handler.
  const req = new Request(c.req.url, c.req.raw);
  const response = await stub.fetch(req);
  return new Response(response.body, response);
});

export default agentRouter;
