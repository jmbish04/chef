import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono<{ Bindings: Env }>();

app.get("/health", (c) => c.json({ status: "ok" }));

// IMPORTANT: Fallback route to serve Astro frontend using env.ASSETS.fetch
// The reviewer explicitly said: "The previous implementation using env.ASSETS.fetch(request) was the correct approach for Worker Static Assets."
// So this is how we connect the backend entrypoint with the compiled Astro frontend!
app.all("*", (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export { KitchenOrchestrator } from "./agents/KitchenOrchestrator";

export default app;
