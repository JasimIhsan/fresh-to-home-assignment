import "server-only";

import type {
  Json,
  OrderRecord,
  ProductRecord,
} from "@/lib/supabase/database.types";
import type {
  CartItem,
  Order,
  OrderStatus,
  Product,
  ProductStatus,
} from "@/types";

const PRODUCT_STATUSES: ReadonlySet<string> = new Set([
  "draft",
  "active",
  "archived",
]);
const ORDER_STATUSES: ReadonlySet<string> = new Set([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

/** Columns the storefront renders; admin-only economics are excluded. */
export const STOREFRONT_PRODUCT_COLUMNS =
  "id, name, description, price_per_kg, image_url, category, stock_kg, origin, unit, tags, status, visibility, gallery_images" as const;

export const ADMIN_PRODUCT_COLUMNS =
  "id, name, description, price_per_kg, image_url, category, stock_kg, origin, unit, sku, barcode, tags, reserved_stock_kg, reorder_point_kg, wholesale_cost_per_kg, status, visibility, gallery_images, created_at, updated_at, created_by, updated_by" as const;

export const ORDER_COLUMNS =
  "id, user_id, user_email, customer_name, phone, items, total_amount, status, address, delivery_slot, payment_method, notes, created_at" as const;

export type StorefrontProductRow = Pick<
  ProductRecord,
  | "id"
  | "name"
  | "description"
  | "price_per_kg"
  | "image_url"
  | "category"
  | "stock_kg"
  | "origin"
  | "unit"
  | "tags"
  | "status"
  | "visibility"
  | "gallery_images"
>;

function toProductStatus(value: string): ProductStatus {
  return PRODUCT_STATUSES.has(value) ? (value as ProductStatus) : "draft";
}

export function toProduct(
  row: StorefrontProductRow & Partial<ProductRecord>
): Product {
  const status = toProductStatus(row.status);
  const visibility = row.visibility === "hidden" ? "hidden" : "public";
  return {
    id: String(row.id),
    name: row.name,
    description: row.description,
    pricePerKg: Number(row.price_per_kg),
    imageUrl: row.image_url,
    isAvailable: status === "active" && visibility === "public",
    category: row.category,
    stockKg: Number(row.stock_kg),
    origin: row.origin ?? undefined,
    unit: row.unit,
    tags: row.tags,
    status,
    visibility,
    galleryImages: row.gallery_images,
    sku: row.sku ?? undefined,
    barcode: row.barcode ?? undefined,
    reservedStockKg:
      row.reserved_stock_kg == null ? undefined : Number(row.reserved_stock_kg),
    reorderPointKg:
      row.reorder_point_kg == null ? undefined : Number(row.reorder_point_kg),
    wholesaleCostPerKg:
      row.wholesale_cost_per_kg == null
        ? undefined
        : Number(row.wholesale_cost_per_kg),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by ?? undefined,
    updatedBy: row.updated_by ?? undefined,
  };
}

function isRecord(
  value: Json | undefined
): value is { [key: string]: Json | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Parses the order's line-item snapshot, dropping malformed entries. */
function toCartItems(items: Json): CartItem[] {
  if (!Array.isArray(items)) return [];
  const lines: CartItem[] = [];
  for (const line of items) {
    if (!isRecord(line) || !isRecord(line.product)) continue;
    const p = line.product;
    const id = typeof p.id === "number" ? String(p.id) : p.id;
    if (typeof id !== "string" || typeof p.name !== "string") continue;
    lines.push({
      weightKg: Number(line.weightKg) || 0,
      product: {
        id,
        name: p.name,
        description: typeof p.description === "string" ? p.description : "",
        pricePerKg: Number(p.pricePerKg) || 0,
        imageUrl: typeof p.imageUrl === "string" ? p.imageUrl : "",
        category: typeof p.category === "string" ? p.category : "",
        origin: typeof p.origin === "string" ? p.origin : undefined,
        isAvailable: p.isAvailable === true,
      },
    });
  }
  return lines;
}

export function toOrder(row: OrderRecord): Order {
  return {
    id: String(row.id),
    userId: row.user_id,
    userEmail: row.user_email ?? undefined,
    customerName: row.customer_name,
    phone: row.phone,
    items: toCartItems(row.items),
    totalAmount: Number(row.total_amount),
    status: ORDER_STATUSES.has(row.status)
      ? (row.status as OrderStatus)
      : "pending",
    createdAt: row.created_at,
    address: row.address,
    deliverySlot: row.delivery_slot ?? undefined,
    paymentMethod: row.payment_method ?? undefined,
    notes: row.notes ?? undefined,
  };
}
