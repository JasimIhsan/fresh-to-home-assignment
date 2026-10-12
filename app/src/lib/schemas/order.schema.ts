import { z } from "zod";
import { dbIdSchema } from "./id.schema";

export const orderIdSchema = dbIdSchema;

export const orderStatusSchema = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const placeOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: dbIdSchema,
        weightKg: z.number().positive().max(50),
      })
    )
    .min(1)
    .max(50),
  fullName: z.string().trim().min(2).max(120),
  street: z.string().trim().min(1).max(200),
  zip: z.string().trim().min(3).max(12),
  city: z.string().trim().min(1).max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,15}$/),
  deliverySlot: z.string().trim().max(120),
  paymentMethod: z.string().trim().max(60),
  notes: z.string().trim().max(500),
});

export type PlaceOrderInput = z.input<typeof placeOrderSchema>;
