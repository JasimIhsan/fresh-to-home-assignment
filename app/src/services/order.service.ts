import type { Order, OrderStatus } from "@/types";

export const ALL_STATUSES = "all";

const OPEN_STATUSES: OrderStatus[] = ["pending", "processing"];

export interface OrderFilter {
  status?: string;
  query?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  openOrderCount: number;
  recentOrders: readonly Order[];
}

class OrderService {
  /** Matches status exactly and the query against id, customer and address. */
  filter(orders: readonly Order[], { status, query }: OrderFilter): Order[] {
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

  getDashboardStats(orders: readonly Order[], recentLimit = 5): DashboardStats {
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
