import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const createOrderSchema = z.object({
  listingId: z.string().uuid(),
  quantity: z.number().positive(),
});

export const customerOrderQuerySchema = z.object({
  query: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
});