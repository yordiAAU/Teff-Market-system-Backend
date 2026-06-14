import { z } from "zod";

export const productTypeListQuerySchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
});


export const productTypeDetailQuerySchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),

  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),

  location: z.string().optional(),
  farmerName: z.string().optional(),

  sort: z.enum(["price_asc", "price_desc"]).optional(),
});

export type ProductDetailQuery =
  z.infer<typeof productTypeDetailQuerySchema>;