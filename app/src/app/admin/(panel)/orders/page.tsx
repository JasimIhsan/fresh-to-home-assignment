import { AdminOrdersFilter } from "@/components/admin/AdminOrdersFilter";
import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { getAdminOrders } from "@/lib/dal/order.dal";
import { orderService } from "@/services/order.service";
import { Suspense } from "react";
import {
  AdminBadgeSkeleton,
  AdminFilterSkeleton,
  AdminTableSkeleton,
} from "../(components)/AdminSkeletons";
import {
  AdminOrdersCount,
  AdminOrdersHeading,
} from "./(components)/AdminOrdersHeading";

const MAX_QUERY_LENGTH = 100;

interface SearchParams {
  readonly status?: string | string[];
  readonly q?: string | string[];
}

interface PageProps {
  readonly searchParams: Promise<SearchParams>;
}

/** Guards against repeated params (?q=a&q=b) and oversized input. */
function firstParam(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").slice(0, MAX_QUERY_LENGTH);
}

export default function AdminOrdersPage({ searchParams }: PageProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <AdminOrdersHeading />
        <Suspense fallback={<AdminBadgeSkeleton />}>
          <OrdersTotal />
        </Suspense>
      </div>

      <Suspense fallback={<AdminFilterSkeleton />}>
        <AdminOrdersFilter />
      </Suspense>

      <Suspense fallback={<AdminTableSkeleton />}>
        <OrdersResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function OrdersTotal() {
  const orders = await getAdminOrders();
  return <AdminOrdersCount count={orders.length} />;
}

async function OrdersResults({ searchParams }: PageProps) {
  const [orders, params] = await Promise.all([getAdminOrders(), searchParams]);
  const filtered = orderService.filter(orders, {
    status: firstParam(params.status),
    query: firstParam(params.q),
  });
  return <AdminOrdersTable orders={filtered} />;
}
