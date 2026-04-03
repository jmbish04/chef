// @ts-nocheck
/**
 * @fileoverview Main Hono API router
 *
 * This file sets up the main Hono application with all API routes and middleware.
 */

import type { D1Database, Ai, VectorizeIndex, Fetcher } from "@cloudflare/workers-types";

import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { agentRouter } from "./routes/agent";
import { aiRouter } from "./routes/ai";
import { appliancesRouter } from "./routes/appliances";
import { authRouter } from "./routes/auth";
import { dashboardRouter } from "./routes/dashboard";
import { documentsRouter } from "./routes/documents";
import { healthRouter } from "./routes/health";
import { inventoryRouter } from "./routes/inventory";
import { notificationsRouter } from "./routes/notifications";
import { openapiRouter } from "./routes/openapi";
import { recipesRouter } from "./routes/recipes";
import { threadsRouter } from "./routes/threads";

export type Bindings = {
  DB: D1Database;
  AI: Ai;
  MANUALS_INDEX: VectorizeIndex;
  BROWSER: Fetcher;
  KitchenOrchestrator: DurableObjectNamespace;
  AI_GATEWAY_TOKEN?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
};

export type Variables = {
  userId?: number;
  user?: {
    id: number;
    email: string;
    name: string;
  };
};

const app = new OpenAPIHono<{ Bindings: Bindings; Variables: Variables }>();

// Middleware
app.use("*", cors());
app.use("*", logger());

// Health check
app.get("/api/ping", (c) => c.json({ status: "ok", timestamp: Date.now() }));

// Mount routers
app.route("/api/auth", authRouter);
app.route("/api/dashboard", dashboardRouter);
app.route("/api/threads", threadsRouter);
app.route("/api/health", healthRouter);
app.route("/api/notifications", notificationsRouter);
app.route("/api/ai", aiRouter);
app.route("/api/documents", documentsRouter);
app.route("/api/recipes", recipesRouter);
app.route("/api/appliances", appliancesRouter);
app.route("/api/agent", agentRouter);
app.route("/api/inventory", inventoryRouter);
// We might keep openapiRouter, but usually OpenAPIHono handles doc gen natively.
app.route("/", openapiRouter);

// Set up OpenAPI documentation using OpenAPIHono
app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "Core Template API",
    description: "API documentation for Cloudflare Workers AI powered application",
  },
  servers: [{ url: "/api", description: "API Server" }],
});

app.get("/swagger", swaggerUI({ url: "/openapi.json" }));

app.get(
  "/scalar",
  apiReference({
    spec: { url: "/openapi.json" },
    theme: "dark",
  }),
);

app.get("/docs", (c) => {
  return c.redirect("/scalar");
});

// context (you mentioned mandatory /context endpoints. Just an empty handler for now)
app.get("/context", (c) => c.json({ message: "Context endpoint" }));

export { app };
