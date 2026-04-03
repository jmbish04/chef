import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { Bindings, Variables } from '../index';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { recipes } from '../../db/schema';

export const recipesRouter = new OpenAPIHono<{ Bindings: Bindings; Variables: Variables }>();

const RecipeSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  title: z.string().openapi({ example: 'Pancakes' }),
  ingredients: z.array(z.string()).openapi({ example: ["flour", "eggs", "milk"] }),
  genericSteps: z.array(z.string()).openapi({ example: ["mix", "cook"] }),
  createdAt: z.string().datetime().openapi({ example: '2023-01-01T00:00:00Z' }),
});

const getRecipesRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List recipes',
  responses: {
    200: {
      content: { 'application/json': { schema: z.array(RecipeSchema) } },
      description: 'Retrieve all recipes',
    },
  },
});

recipesRouter.openapi(getRecipesRoute, async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(recipes);
  return c.json(result as any, 200);
});

const getRecipeByIdRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get a recipe by ID',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: RecipeSchema } },
      description: 'Retrieve a recipe',
    },
    404: {
      description: 'Recipe not found',
    },
  },
});

recipesRouter.openapi(getRecipeByIdRoute, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const db = drizzle(c.env.DB);
  const result = await db.select().from(recipes).where(eq(recipes.id, id));
  if (result.length === 0) {
    return c.json({ error: 'Recipe not found' } as any, 404);
  }
  return c.json(result[0] as any, 200);
});

const createRecipeRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create a recipe',
  requestBody: {
    content: {
      'application/json': {
        schema: z.object({
          title: z.string(),
          ingredients: z.array(z.string()),
          genericSteps: z.array(z.string()),
        }),
      },
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: RecipeSchema } },
      description: 'Recipe created',
    },
  },
});

recipesRouter.openapi(createRecipeRoute, async (c) => {
  const data = c.req.valid('json');
  const db = drizzle(c.env.DB);
  const result = await db.insert(recipes).values(data).returning();
  return c.json(result[0] as any, 201);
});

const updateRecipeRoute = createRoute({
  method: 'put',
  path: '/{id}',
  summary: 'Update a recipe',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            title: z.string().optional(),
            ingredients: z.string().optional(),
            genericSteps: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: RecipeSchema } },
      description: 'Recipe updated',
    },
  },
});

recipesRouter.openapi(updateRecipeRoute, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const data = c.req.valid('json');
  const db = drizzle(c.env.DB);
  const result = await db.update(recipes).set(data).where(eq(recipes.id, id)).returning();
  return c.json(result[0] as any, 200);
});

const deleteRecipeRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete a recipe',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    204: {
      description: 'Recipe deleted',
    },
  },
});

recipesRouter.openapi(deleteRecipeRoute, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const db = drizzle(c.env.DB);
  await db.delete(recipes).where(eq(recipes.id, id));
  return new Response(null, { status: 204 });
});

export default recipesRouter;
