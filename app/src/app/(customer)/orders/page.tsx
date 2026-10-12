import { CustomerOrderCard } from "@/components/orders/CustomerOrderCard";
import { CustomerOrdersEmpty } from "@/components/orders/CustomerOrdersEmpty";
import { getMyOrders } from "@/lib/dal/order.dal";
import { orderService } from "@/services";
import { Suspense } from "react";
import { OrdersHeader } from "./(components)/OrdersHeader";
import { OrdersSkeleton } from "./(components)/OrdersSkeleton";
import { parseOrderStatus } from "./(components)/order-filter";

interface OrdersPageProps {
  readonly searchParams: Promise<{
    readonly status?: string | string[];
  }>;
}

export default function OrdersPage({ searchParams }: OrdersPageProps) {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersContent searchParams={searchParams} />
    </Suspense>
  );
}

async function OrdersContent({ searchParams }: OrdersPageProps) {
  const [{ status: rawStatus }, orders] = await Promise.all([
    searchParams,
    getMyOrders(),
  ]);
  const status = parseOrderStatus(rawStatus);
  const filteredOrders = orderService.filter(orders, { status });

  return (
    <div className="bg-background min-h-screen pb-20">
      <OrdersHeader activeStatus={status} />

      <main className="mx-auto mt-2 max-w-6xl p-4 sm:p-6 md:mt-4 md:p-8">
        {filteredOrders.length === 0 ? (
          <CustomerOrdersEmpty />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <CustomerOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
