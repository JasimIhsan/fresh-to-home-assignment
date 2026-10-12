import {
  createOrder,
  getOrderById,
  getStoredOrders,
  updateOrderStatus,
} from "@/lib/store";
import { CartItem, Order, OrderStatus } from "@/types";
import { cartService } from "./cart.service";

export const ALL_STATUSES = "all";

const OPEN_STATUSES: OrderStatus[] = ["pending", "processing"];

export interface OrderFilter {
  status?: string;
  query?: string;
}

export interface PlaceOrderInput {
  customer: { id: string; email?: string | null };
  items: CartItem[];
  fullName: string;
  street: string;
  zip: string;
  city: string;
  phone: string;
  /** Already-translated labels, stored on the order as shown to the user. */
  deliverySlot: string;
  paymentMethod: string;
  notes: string;
}

export interface DashboardStats {
  totalRevenue: number;
  openOrderCount: number;
  recentOrders: Order[];
}

export class OrderService {
  list(): Order[] {
    return getStoredOrders();
  }

  listForCustomer(userId: string): Order[] {
    return getStoredOrders(userId);
  }

  getById(id: string): Order | undefined {
    return getOrderById(id);
  }

  /** Creates a pending order; the total is priced from the cart items. */
  placeOrder(input: PlaceOrderInput): Order {
    const { grandTotal } = cartService.getSummary(input.items);
    const email = input.customer.email;

    return createOrder({
      userId: input.customer.id,
      userEmail: email || "kunde@beispiel.de",
      customerName: input.fullName.trim() || email?.split("@")[0] || "Kunde",
      phone: input.phone.trim(),
      items: input.items,
      totalAmount: grandTotal,
      status: "pending",
      address: `${input.street.trim()}, ${input.zip.trim()} ${input.city.trim()}`,
      deliverySlot: input.deliverySlot,
      paymentMethod: input.paymentMethod,
      notes: input.notes,
    });
  }

  updateStatus(id: string, status: OrderStatus): Order | undefined {
    return updateOrderStatus(id, status);
  }

  /** Matches status exactly and the query against id, customer and address. */
  filter(orders: Order[], { status, query }: OrderFilter): Order[] {
    const q = query?.trim().toLowerCase() ?? "";
    return orders.filter((o) => {
      const matchesStatus =
        !status || status === ALL_STATUSES || o.status === status;
      const matchesQuery =
        !q ||
        [o.id, o.customerName, o.userEmail, o.address].some((field) =>
          field?.toLowerCase().includes(q)
        );
      return matchesStatus && matchesQuery;
    });
  }

  getDashboardStats(orders: Order[], recentLimit = 5): DashboardStats {
    return {
      totalRevenue: orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.totalAmount, 0),
      openOrderCount: orders.filter((o) => OPEN_STATUSES.includes(o.status))
        .length,
      recentOrders: orders.slice(0, recentLimit),
    };
  }
}

export const orderService = new OrderService();
