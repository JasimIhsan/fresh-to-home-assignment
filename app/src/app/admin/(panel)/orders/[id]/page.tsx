import { getAdminOrder } from "@/lib/dal/order.dal";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminOrderDetailSkeleton } from "../../(components)/AdminSkeletons";
import { AdminOrderDetailView } from "./(components)/AdminOrderDetailView";

interface PageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default function AdminOrderDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<AdminOrderDetailSkeleton />}>
      <OrderDetail params={params} />
    </Suspense>
  );
}

async function OrderDetail({ params }: PageProps) {
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();
  return <AdminOrderDetailView order={order} />;
}
