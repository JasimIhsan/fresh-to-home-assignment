import { AdminKpiGrid } from "@/components/admin/AdminKpiGrid";
import { AdminRecentOrdersTable } from "@/components/admin/AdminRecentOrdersTable";
import { AdminStockAlertsCard } from "@/components/admin/AdminStockAlertsCard";
import { getAdminOrders } from "@/lib/dal/order.dal";
import { getAdminProducts } from "@/lib/dal/product.dal";
import { orderService } from "@/services/order.service";
import { Suspense } from "react";
import { AdminDashboardHeader } from "./(components)/AdminDashboardHeader";
import { AdminDashboardSkeleton } from "./(components)/AdminSkeletons";

const STOCK_ALERT_LIMIT = 4;

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AdminDashboardHeader />
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const [orders, products] = await Promise.all([
    getAdminOrders(),
    getAdminProducts(),
  ]);

  const { totalRevenue, openOrderCount, recentOrders } =
    orderService.getDashboardStats(orders);

  // Lowest stock first, trimmed to the fields the card renders.
  const stockAlerts = [...products]
    .sort((a, b) => (a.stockKg ?? 0) - (b.stockKg ?? 0))
    .slice(0, STOCK_ALERT_LIMIT)
    .map((p) => ({ id: p.id, name: p.name, stockKg: p.stockKg ?? 0 }));

  return (
    <>
      <AdminKpiGrid
        totalRevenue={totalRevenue}
        totalOrdersCount={orders.length}
        pendingCount={openOrderCount}
        activeProductsCount={products.filter((p) => p.isAvailable).length}
        totalProductsCount={products.length}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <AdminRecentOrdersTable
          orders={recentOrders.map((o) => ({
            id: o.id,
            customerName: o.customerName,
            userEmail: o.userEmail,
            status: o.status,
            totalAmount: o.totalAmount,
          }))}
        />
        <AdminStockAlertsCard items={stockAlerts} />
      </div>
    </>
  );
}
