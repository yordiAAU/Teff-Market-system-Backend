import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().min(5),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().min(5),
});

export const productQuerySchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});