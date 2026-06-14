import { z } from "zod";

export const createproductlistSchema = z.object({

    productTypeid: z.string().min(1, "Product type ID is required"),
    
    quantity: z.number().positive("Quantity must be a positive number"),

    unit: z.enum(["kg", "bag", "pieces"], "Unit must be one of: kg, bag, pieces"),

    price: z.number().positive("Price must be a positive number"),

    description: z.string().min(10, "Description must be at least 10 characters"),

    imagefile: z.string().min(1, "Image file is required"),


});

export type ProductListInput =
  z.infer<typeof createproductlistSchema>;



