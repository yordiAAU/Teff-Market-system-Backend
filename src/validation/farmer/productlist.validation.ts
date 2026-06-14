import { z } from "zod";

export const createProductListSchema = z.object({
  productTypeId: z.string().uuid(),
  // quantity: z.number().positive(),
  quantity: z.string().min(1), // 1, 2, 3, 4
  unit: z.string().min(1), // kg, ton, sack
  // price: z.number().positive(),
  price: z.string().min(1), // 1, 2, 3, 4
  description: z.string().min(5),
});

export type CreateProductListType = z.infer<typeof createProductListSchema>;

export const updateProductListSchema = z.object({
  quantity: z.number().positive().optional(),
  unit: z.string().optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
});