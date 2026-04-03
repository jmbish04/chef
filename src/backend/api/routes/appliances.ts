import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { Bindings, Variables } from '../index';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { appliances } from '../../db/schema';

export const appliancesRouter = new OpenAPIHono<{ Bindings: Bindings; Variables: Variables }>();

const ApplianceSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Microwave' }),
  model: z.string().openapi({ example: 'X1000' }),
  manualVectorId: z.string().nullable().openapi({ example: 'vec_123' }),
});

const getAppliancesRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List appliances',
  responses: {
    200: {
      content: { 'application/json': { schema: z.array(ApplianceSchema) } },
      description: 'Retrieve all appliances',
    },
  },
});

appliancesRouter.openapi(getAppliancesRoute, async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(appliances);
  return c.json(result as any, 200);
});

const getApplianceByIdRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get an appliance by ID',
  request: {
    params: z.object({
      id: z.coerce.number().openapi({ example: 1 }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: ApplianceSchema } },
      description: 'Retrieve an appliance',
    },
    404: {
      description: 'Appliance not found',
    },
  },
});

appliancesRouter.openapi(getApplianceByIdRoute, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const db = drizzle(c.env.DB);
  const result = await db.select().from(appliances).where(eq(appliances.id, id));
  if (result.length === 0) {
    return c.json({ error: 'Appliance not found' } as any, 404);
  }
  return c.json(result[0] as any, 200);
});

const createApplianceRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create an appliance',
  requestBody: {
    content: {
      'application/json': {
        schema: z.object({
          name: z.string(),
          model: z.string(),
          manualVectorId: z.string().optional(),
        }),
      },
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: ApplianceSchema } },
      description: 'Appliance created',
    },
  },
});

appliancesRouter.openapi(createApplianceRoute, async (c) => {
  const data = c.req.valid('json');
  const db = drizzle(c.env.DB);
  const result = await db.insert(appliances).values(data).returning();
  return c.json(result[0] as any, 201);
});

const updateApplianceRoute = createRoute({
  method: 'put',
  path: '/{id}',
  summary: 'Update an appliance',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().optional(),
            model: z.string().optional(),
            manualVectorId: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: ApplianceSchema } },
      description: 'Appliance updated',
    },
  },
});

appliancesRouter.openapi(updateApplianceRoute, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const data = c.req.valid('json');
  const db = drizzle(c.env.DB);
  const result = await db.update(appliances).set(data).where(eq(appliances.id, id)).returning();
  return c.json(result[0] as any, 200);
});

const deleteApplianceRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete an appliance',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    204: {
      description: 'Appliance deleted',
    },
  },
});

appliancesRouter.openapi(deleteApplianceRoute, async (c) => {
  const id = parseInt(c.req.param('id'), 10);
  const db = drizzle(c.env.DB);
  await db.delete(appliances).where(eq(appliances.id, id));
  return new Response(null, { status: 204 });
});

export default appliancesRouter;
