import type { SSRManifest } from "astro";

import { App } from "astro/app";

import honoApp from "./backend/index";

export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);

  return {
    default: {
      async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        // 1. Backend API Routing Interception
        if (
          url.pathname.startsWith("/api/") ||
          url.pathname === "/openapi.json" ||
          url.pathname === "/swagger" ||
          url.pathname === "/scalar" ||
          url.pathname === "/docs" ||
          url.pathname === "/context"
        ) {
          return honoApp.fetch(request, env, ctx);
        }

        // 2. Astro SSR Fallback
        if (app.match(request)) {
          return app.render(request, { env });
        }

        // 3. Static Asset Fallback
        return env.ASSETS.fetch(request);
      },
    },
  };
}
