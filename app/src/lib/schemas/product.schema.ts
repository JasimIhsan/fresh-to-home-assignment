import { z } from "zod";
import { dbIdSchema } from "./id.schema";

export const productIdSchema = dbIdSchema;

export const productStatusSchema = z.enum(["draft", "active", "archived"]);

/** Admin product form, as submitted from the client (numbers already parsed). */
export const productInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(60),
  pricePerKg: z.number().positive().max(10_000),
  stockKg: z.number().min(0).max(100_000),
  isAvailable: z.boolean(),
  origin: z.string().trim().min(1).max(120),
  imageUrl: z.string().trim().max(500),
  description: z.string().trim().max(2000),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export const stockAdjustSchema = z.object({
  id: productIdSchema,
  amount: z.number().min(0).max(100_000),
  mode: z.enum(["set", "add"]),
});
