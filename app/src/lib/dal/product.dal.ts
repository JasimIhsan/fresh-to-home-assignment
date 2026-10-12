import "server-only";

import { CacheTags } from "@/lib/cache-tags";
import { createSessionClient, getPublicClient } from "@/lib/supabase/server";
import type { Product } from "@/types";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import { requireAdmin } from "./auth.dal";
import {
  ADMIN_PRODUCT_COLUMNS,
  STOREFRONT_PRODUCT_COLUMNS,
  toProduct,
} from "./mappers";

/** Hard cap on catalog reads; the shop sells a curated range. */
const MAX_PRODUCTS = 500;

// ---------------------------------------------------------------------------
// Storefront (public, shared cache)
// ---------------------------------------------------------------------------

export async function getStorefrontProducts(): Promise<readonly Product[]> {
  "use cache";
  cacheTag(CacheTags.products);
  cacheLife("hours");

  const { data, error } = await getPublicClient()
    .from("products")
    .select(STOREFRONT_PRODUCT_COLUMNS)
    .eq("status", "active")
    .eq("visibility", "public")
    .order("created_at", { ascending: true })
    .limit(MAX_PRODUCTS);

  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return data.map(toProduct);
}

export async function getStorefrontProduct(
  id: string
): Promise<Product | null> {
  "use cache";
  cacheTag(CacheTags.products, CacheTags.product(id));
  cacheLife("hours");

  const { data, error } = await getPublicClient()
    .from("products")
    .select(STOREFRONT_PRODUCT_COLUMNS)
    .eq("id", id.slice(0, 64))
    .eq("status", "active")
    .eq("visibility", "public")
    .maybeSingle();

  if (error) throw new Error(`Failed to load product: ${error.message}`);
  return data ? toProduct(data) : null;
}

export async function getRelatedProducts(
  productId: string,
  category: string,
  limit = 4
): Promise<readonly Product[]> {
  "use cache";
  cacheTag(CacheTags.products);
  cacheLife("hours");

  const { data, error } = await getPublicClient()
    .from("products")
    .select(STOREFRONT_PRODUCT_COLUMNS)
    .eq("category", category)
    .neq("id", productId)
    .eq("status", "active")
    .eq("visibility", "public")
    .limit(limit);

  if (error)
    throw new Error(`Failed to load related products: ${error.message}`);
  return data.map(toProduct);
}

export async function getStorefrontProductIds(): Promise<readonly string[]> {
  const products = await getStorefrontProducts();
  return products.map((p) => p.id);
}

// ---------------------------------------------------------------------------
// Admin (per-request, RLS as the signed-in admin; never shared-cached)
// ---------------------------------------------------------------------------

export const getAdminProducts = cache(async (): Promise<readonly Product[]> => {
  await requireAdmin("/admin/products");
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("products")
    .select(ADMIN_PRODUCT_COLUMNS)
    .order("updated_at", { ascending: false })
    .limit(MAX_PRODUCTS);

  if (error) throw new Error(`Failed to load products: ${error.message}`);
  return data.map(toProduct);
});

export const getAdminProduct = cache(
  async (id: string): Promise<Product | null> => {
    await requireAdmin(`/admin/products/${encodeURIComponent(id)}`);
    const supabase = await createSessionClient();
    const { data, error } = await supabase
      .from("products")
      .select(ADMIN_PRODUCT_COLUMNS)
      .eq("id", id.slice(0, 64))
      .maybeSingle();

    if (error) throw new Error(`Failed to load product: ${error.message}`);
    return data ? toProduct(data) : null;
  }
);
