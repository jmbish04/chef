// @ts-nocheck
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

import { recipes } from "../../db/schema";

export const recipesRouter = new OpenAPIHono<{ Bindings: Env }>();

const _RecipeSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  title: z.string().openapi({ example: "Pancakes" }),
  ingredients: z.string().openapi({ example: '["flour", "eggs", "milk"]' }),
  genericSteps: z.string().openapi({ example: '["mix", "cook"]' }),
  createdAt: z.any().openapi({ example: "2023-01-01T00:00:00Z" }),
});

const getRecipesRoute = createRoute({
  method: "get",
  path: "/",
  summary: "List recipes",
  responses: {
    200: {
      // @ts-ignore
      content: { "application/json": { schema: z.any() } },
      description: "Retrieve all recipes",
    },
  },
});

recipesRouter.openapi(getRecipesRoute, async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(recipes);
  return c.json(result as any, 200 as any);
});

const getRecipeByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  summary: "Get a recipe by ID",
  request: {
    params: z.object({
      id: z.string().openapi({ example: "1" }),
    }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: z.any() } },
      description: "Retrieve a recipe",
    },
    404: {
      description: "Recipe not found",
    },
  },
});

recipesRouter.openapi(getRecipeByIdRoute, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const db = drizzle(c.env.DB);
  const result = await db.select().from(recipes).where(eq(recipes.id, id));
  if (result.length === 0) {
    return c.json({ error: "Recipe not found" } as any, 404 as any);
  }
  return c.json(result[0] as any, 200 as any);
});

const createRecipeRoute = createRoute({
  method: "post",
  path: "/",
  summary: "Create a recipe",
  requestBody: {
    content: {
      "application/json": {
        schema: z.any(),
      },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: z.any() } },
      description: "Recipe created",
    },
  },
});

recipesRouter.openapi(createRecipeRoute, async (c) => {
  // @ts-ignore
  const data = c.req.valid("json");
  const db = drizzle(c.env.DB);
  const result = await db.insert(recipes).values(data).returning();
  return c.json(result[0] as any, 201 as any);
});

const updateRecipeRoute = createRoute({
  method: "put",
  path: "/{id}",
  summary: "Update a recipe",
  request: {
    params: z.object({
      id: z.string().openapi({ example: "1" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.any(),
        },
      },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: z.any() } },
      description: "Recipe updated",
    },
  },
});

recipesRouter.openapi(updateRecipeRoute, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const data = c.req.valid("json");
  const db = drizzle(c.env.DB);
  const result = await db.update(recipes).set(data).where(eq(recipes.id, id)).returning();
  return c.json(result[0] as any, 200 as any);
});

const deleteRecipeRoute = createRoute({
  method: "delete",
  path: "/{id}",
  summary: "Delete a recipe",
  request: {
    params: z.object({
      id: z.string().openapi({ example: "1" }),
    }),
  },
  responses: {
    204: {
      description: "Recipe deleted",
    },
  },
});

recipesRouter.openapi(deleteRecipeRoute, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const db = drizzle(c.env.DB);
  await db.delete(recipes).where(eq(recipes.id, id));
  return new Response(null, { status: 204 });
});

export default recipesRouter;
