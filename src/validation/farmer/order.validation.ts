import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const orderQuerySchema = z.object({
  query: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
});