import "server-only";

import { createSessionClient } from "@/lib/supabase/server";
import type { Order } from "@/types";
import { cache } from "react";
import { requireAdmin, requireUser } from "./auth.dal";
import { ORDER_COLUMNS, toOrder } from "./mappers";

const MAX_ORDERS = 200;

/** The signed-in customer's orders, newest first (RLS scopes to the user). */
export const getMyOrders = cache(async (): Promise<readonly Order[]> => {
  const user = await requireUser("/orders");
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(MAX_ORDERS);

  if (error) throw new Error(`Failed to load orders: ${error.message}`);
  return data.map(toOrder);
});

export const getMyOrder = cache(async (id: string): Promise<Order | null> => {
  const user = await requireUser(`/orders/${encodeURIComponent(id)}`);
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("id", id.slice(0, 32))
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(`Failed to load order: ${error.message}`);
  return data ? toOrder(data) : null;
});

export const getAdminOrders = cache(async (): Promise<readonly Order[]> => {
  await requireAdmin("/admin/orders");
  const supabase = await createSessionClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(MAX_ORDERS);

  if (error) throw new Error(`Failed to load orders: ${error.message}`);
  return data.map(toOrder);
});

export const getAdminOrder = cache(
  async (id: string): Promise<Order | null> => {
    await requireAdmin(`/admin/orders/${encodeURIComponent(id)}`);
    const supabase = await createSessionClient();
    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_COLUMNS)
      .eq("id", id.slice(0, 32))
      .maybeSingle();

    if (error) throw new Error(`Failed to load order: ${error.message}`);
    return data ? toOrder(data) : null;
  }
);
