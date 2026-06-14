import { z } from "zod";

export const marketTrendSchema = z.object({
  productTypeId: z.string().uuid(),

  period: z.enum([
    "today",
    "week",
    "month",
    "year",
  ]),
});