import { z } from "zod";

/**
 * Database ids are `bigint` identity columns. The app passes them around as
 * strings (route params, URLs); this parses one back into a number, capped at
 * 15 digits so it stays within `Number.MAX_SAFE_INTEGER`.
 */
export const dbIdSchema = z
  .union([z.string(), z.number()])
  .transform(String)
  .pipe(
    z
      .string()
      .trim()
      .regex(/^[1-9]\d{0,14}$/)
  )
  .transform(Number);

/** The numeric id for a route/URL value, or null when it is not a valid id. */
export function parseDbId(value: unknown): number | null {
  const parsed = dbIdSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
