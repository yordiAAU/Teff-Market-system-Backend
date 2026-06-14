import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters"),

  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain uppercase, lowercase and number"
    ),

  role: z.enum([
    "customer",
    "farmer",
    "admin",
  ]),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must be at most 15 characters"),

  region: z
    .string()
    .min(3, "Region must be at least 3 characters"),
});

export type RegisterInput =
  z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email(),

  password: z
    .string()
    .min(1),
});

export type LoginInput =
  z.infer<typeof loginSchema>;