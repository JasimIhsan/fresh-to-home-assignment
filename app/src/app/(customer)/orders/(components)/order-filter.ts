export const ORDER_FILTER_STATUSES = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
] as const;

export type OrderFilterStatus = (typeof ORDER_FILTER_STATUSES)[number];

const VALID: ReadonlySet<string> = new Set(ORDER_FILTER_STATUSES);

/** Reads `?status=`, guarding against repeated params and unknown values. */
export function parseOrderStatus(
  raw: string | readonly string[] | undefined
): OrderFilterStatus {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === "string" && VALID.has(value)
    ? (value as OrderFilterStatus)
    : "all";
}
