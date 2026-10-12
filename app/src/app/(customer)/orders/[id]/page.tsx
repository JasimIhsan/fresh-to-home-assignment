import { OrderDeliveryInfoCard } from "@/components/orders/OrderDeliveryInfoCard";
import { OrderItemList } from "@/components/orders/OrderItemList";
import { OrderTrackingProgress } from "@/components/orders/OrderTrackingProgress";
import { getMyOrder } from "@/lib/dal/order.dal";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OrderDetailHeader } from "./(components)/OrderDetailHeader";

interface OrderTrackingPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  return (
    <div className="bg-background min-h-screen pb-20">
      <Suspense fallback={<OrderDetailSkeleton />}>
        <OrderDetail params={params} />
      </Suspense>
    </div>
  );
}

async function OrderDetail({ params }: OrderTrackingPageProps) {
  const { id } = await params;
  const order = await getMyOrder(id);
  if (!order) notFound();

  return (
    <>
      <OrderDetailHeader orderId={order.id} />

      <main className="mx-auto mt-2 max-w-6xl p-4 md:mt-4 md:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <OrderTrackingProgress
              status={order.status}
              createdAt={order.createdAt}
            />
            <OrderItemList
              items={order.items}
              totalAmount={order.totalAmount}
            />
          </div>

          <div className="space-y-6 lg:col-span-1">
            <OrderDeliveryInfoCard order={order} />
          </div>
        </div>
      </main>
    </>
  );
}

function OrderDetailSkeleton() {
  return (
    <div aria-busy="true">
      <div className="bg-primary h-16 rounded-b-3xl md:h-24 md:rounded-none md:bg-transparent" />
      <div className="mx-auto mt-2 grid max-w-6xl grid-cols-1 gap-6 p-4 md:mt-4 md:p-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-80 animate-pulse rounded-3xl border border-gray-100 bg-white" />
          <div className="h-48 animate-pulse rounded-3xl border border-gray-100 bg-white" />
        </div>
        <div className="h-64 animate-pulse rounded-3xl border border-gray-100 bg-white lg:col-span-1" />
      </div>
    </div>
  );
}
