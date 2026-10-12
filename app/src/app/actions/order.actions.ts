"use server";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { getCurrentUser } from "@/lib/dal/auth.dal";
import {
  orderIdSchema,
  orderStatusSchema,
  placeOrderSchema,
  type PlaceOrderInput,
} from "@/lib/schemas/order.schema";
import { createSessionClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types";
import { revalidatePath } from "next/cache";

/** Places an order; the database prices it from current product data. */
export async function placeOrder(
  input: PlaceOrderInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = placeOrderSchema.safeParse(input);
  if (!parsed.success) return fail("Please check your delivery details.");
  if (!(await getCurrentUser())) return fail("Please sign in to order.");

  const o = parsed.data;
  const supabase = await createSessionClient();
  const { data, error } = await supabase.rpc("place_order", {
    p_items: o.items.map((i) => ({
      productId: i.productId,
      weightKg: i.weightKg,
    })),
    p_customer_name: o.fullName,
    p_phone: o.phone,
    p_address: `${o.street}, ${o.zip} ${o.city}`,
    p_delivery_slot: o.deliverySlot,
    p_payment_method: o.paymentMethod,
    p_notes: o.notes,
  });

  if (error) {
    return fail(
      error.message.includes("product_unavailable")
        ? "Some items are no longer available."
        : "Could not place the order."
    );
  }

  revalidatePath("/orders");
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return ok({ id: String(data.id) });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<ActionResult<{ status: OrderStatus }>> {
  const parsedId = orderIdSchema.safeParse(id);
  const parsedStatus = orderStatusSchema.safeParse(status);
  if (!parsedId.success || !parsedStatus.success)
    return fail("Invalid status.");
  if ((await getCurrentUser())?.role !== "admin")
    return fail("Not authorized.");

  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: parsedStatus.data })
    .eq("id", parsedId.data);

  if (error) return fail("Could not update the order.");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${parsedId.data}`);
  revalidatePath("/admin");
  revalidatePath("/orders");
  return ok({ status: parsedStatus.data });
}
