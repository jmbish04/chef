import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono<{ Bindings: Env }>();

app.get("/health", (c) => c.json({ status: "ok" }));

export { KitchenOrchestrator } from "./agents/KitchenOrchestrator";

export default app;
