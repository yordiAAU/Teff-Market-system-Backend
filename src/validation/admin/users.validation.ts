import { z } from "zod";
import { Role } from "../../constants/role";

export const getUsersSchema =
  z.object({
    page: z.coerce
      .number()
      .min(1)
      .default(1),

    pageSize: z.coerce
      .number()
      .min(1)
      .max(100)
      .default(10),

    role: z
      .nativeEnum(Role)
      .optional(),

    search: z
      .string()
      .optional(),

    productTypeId: z
      .string()
      .uuid()
      .optional(),
  });