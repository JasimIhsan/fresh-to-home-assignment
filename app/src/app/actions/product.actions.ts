"use server";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { CacheTags } from "@/lib/cache-tags";
import { getCurrentUser } from "@/lib/dal/auth.dal";
import {
  productIdSchema,
  productInputSchema,
  productStatusSchema,
  stockAdjustSchema,
  type ProductInput,
} from "@/lib/schemas/product.schema";
import { createSessionClient } from "@/lib/supabase/server";
import type { ProductStatus } from "@/types";
import { revalidatePath, updateTag } from "next/cache";

const DEFAULT_DESCRIPTION =
  "Frisches Qualitätsprodukt aus sorgfältig kontrollierter Aufzucht.";
const FALLBACK_IMAGE = "/images/products/raw_beef_steak.jpg";

async function requireAdminEmail(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.role === "admin" ? (user.email ?? "admin") : null;
}

function bustProductCaches(id?: string): void {
  updateTag(CacheTags.products);
  if (id) updateTag(CacheTags.product(id));
  revalidatePath("/admin/products");
  revalidatePath("/admin");
}

export async function createProduct(
  input: ProductInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid product data.");
  const admin = await requireAdminEmail();
  if (!admin) return fail("Not authorized.");

  const p = parsed.data;
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: p.name,
      category: p.category,
      price_per_kg: p.pricePerKg,
      stock_kg: p.stockKg,
      status: p.isAvailable ? "active" : "draft",
      origin: p.origin,
      image_url: p.imageUrl || FALLBACK_IMAGE,
      description: p.description || DEFAULT_DESCRIPTION,
      created_by: admin,
      updated_by: admin,
    })
    .select("id")
    .single();

  if (error) return fail("Could not create the product.");
  bustProductCaches(String(data.id));
  return ok({ id: String(data.id) });
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<ActionResult<{ id: string }>> {
  const parsedId = productIdSchema.safeParse(id);
  const parsed = productInputSchema.safeParse(input);
  if (!parsedId.success || !parsed.success)
    return fail("Invalid product data.");
  const admin = await requireAdminEmail();
  if (!admin) return fail("Not authorized.");

  const p = parsed.data;
  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: p.name,
      category: p.category,
      price_per_kg: p.pricePerKg,
      stock_kg: p.stockKg,
      status: p.isAvailable ? "active" : "draft",
      origin: p.origin,
      ...(p.imageUrl ? { image_url: p.imageUrl } : {}),
      description: p.description,
      updated_by: admin,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsedId.data);

  if (error) return fail("Could not update the product.");
  bustProductCaches(String(parsedId.data));
  return ok({ id: String(parsedId.data) });
}

export async function setProductStatus(
  id: string,
  status: ProductStatus
): Promise<ActionResult<{ status: ProductStatus }>> {
  const parsedId = productIdSchema.safeParse(id);
  const parsedStatus = productStatusSchema.safeParse(status);
  if (!parsedId.success || !parsedStatus.success)
    return fail("Invalid status.");
  const admin = await requireAdminEmail();
  if (!admin) return fail("Not authorized.");

  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("products")
    .update({
      status: parsedStatus.data,
      updated_by: admin,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsedId.data);

  if (error) return fail("Could not update the status.");
  bustProductCaches(String(parsedId.data));
  return ok({ status: parsedStatus.data });
}

export async function adjustProductStock(input: {
  id: string;
  amount: number;
  mode: "set" | "add";
}): Promise<ActionResult<{ stockKg: number }>> {
  const parsed = stockAdjustSchema.safeParse(input);
  if (!parsed.success) return fail("Invalid stock amount.");
  const admin = await requireAdminEmail();
  if (!admin) return fail("Not authorized.");

  const { id, amount, mode } = parsed.data;
  const supabase = await createSessionClient();
  const { data: current, error: readError } = await supabase
    .from("products")
    .select("stock_kg")
    .eq("id", id)
    .maybeSingle();
  if (readError || !current) return fail("Product not found.");

  const stockKg = Math.max(
    0,
    mode === "set" ? amount : Number(current.stock_kg) + amount
  );
  const { error } = await supabase
    .from("products")
    .update({
      stock_kg: stockKg,
      updated_by: admin,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return fail("Could not update stock.");
  bustProductCaches(String(id));
  return ok({ stockKg });
}

export async function deleteProduct(id: string): Promise<ActionResult<null>> {
  const parsedId = productIdSchema.safeParse(id);
  if (!parsedId.success) return fail("Invalid product.");
  if (!(await requireAdminEmail())) return fail("Not authorized.");

  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", parsedId.data);

  if (error) return fail("Could not delete the product.");
  bustProductCaches(String(parsedId.data));
  return ok(null);
}
