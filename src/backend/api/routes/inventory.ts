import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

import type { Bindings, Variables } from "../index";

import { inventory } from "../../db/schema";

export const inventoryRouter = new OpenAPIHono<{ Bindings: Bindings; Variables: Variables }>();

const InventorySchema = z.object({
  id: z.number().openapi({ example: 1 }),
  barcode: z.string().openapi({ example: "1234567890" }),
  itemName: z.string().openapi({ example: "Tomato Ketchup" }),
  quantity: z.number().openapi({ example: 2 }),
});

const getInventoryRoute = createRoute({
  method: "get",
  path: "/",
  summary: "List inventory",
  responses: {
    200: {
      content: { "application/json": { schema: z.array(InventorySchema) } },
      description: "Retrieve all inventory",
    },
  },
});

inventoryRouter.openapi(getInventoryRoute, async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(inventory);
  return c.json(result as any, 200);
});

const getInventoryByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  summary: "Get an inventory item by ID",
  request: {
    params: z.object({
      id: z.string().openapi({ example: "1" }),
    }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: InventorySchema } },
      description: "Retrieve an inventory item",
    },
    404: {
      description: "Inventory item not found",
    },
  },
});

inventoryRouter.openapi(getInventoryByIdRoute, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const db = drizzle(c.env.DB);
  const result = await db.select().from(inventory).where(eq(inventory.id, id));
  if (result.length === 0) {
    return c.json({ error: "Item not found" } as any, 404);
  }
  return c.json(result[0] as any, 200);
});

const createInventoryRoute = createRoute({
  method: "post",
  path: "/",
  summary: "Create an inventory item",
  requestBody: {
    content: {
      "application/json": {
        schema: z.object({
          barcode: z.string(),
          itemName: z.string(),
          quantity: z.number().optional().default(1),
        }),
      },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: InventorySchema } },
      description: "Inventory item created",
    },
  },
});

inventoryRouter.openapi(createInventoryRoute, async (c) => {
  const data = c.req.valid("json");
  const db = drizzle(c.env.DB);
  const result = await db.insert(inventory).values(data).returning();
  return c.json(result[0] as any, 201);
});

const updateInventoryRoute = createRoute({
  method: "put",
  path: "/{id}",
  summary: "Update an inventory item",
  request: {
    params: z.object({
      id: z.string().openapi({ example: "1" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            barcode: z.string().optional(),
            itemName: z.string().optional(),
            quantity: z.number().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: InventorySchema } },
      description: "Inventory item updated",
    },
  },
});

inventoryRouter.openapi(updateInventoryRoute, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const data = c.req.valid("json");
  const db = drizzle(c.env.DB);
  const result = await db.update(inventory).set(data).where(eq(inventory.id, id)).returning();
  return c.json(result[0] as any, 200);
});

const deleteInventoryRoute = createRoute({
  method: "delete",
  path: "/{id}",
  summary: "Delete an inventory item",
  request: {
    params: z.object({
      id: z.string().openapi({ example: "1" }),
    }),
  },
  responses: {
    204: {
      description: "Inventory item deleted",
    },
  },
});

inventoryRouter.openapi(deleteInventoryRoute, async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const db = drizzle(c.env.DB);
  await db.delete(inventory).where(eq(inventory.id, id));
  return new Response(null, { status: 204 });
});

export default inventoryRouter;
