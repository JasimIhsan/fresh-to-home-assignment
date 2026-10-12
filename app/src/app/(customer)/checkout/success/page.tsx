import { getMyOrder } from "@/lib/dal/order.dal";
import { Suspense } from "react";
import { OrderConfirmationView } from "./(components)/OrderConfirmationView";

interface OrderConfirmationPageProps {
  readonly searchParams: Promise<{
    readonly orderId?: string | string[];
  }>;
}

export default function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      }
    >
      <OrderConfirmation searchParams={searchParams} />
    </Suspense>
  );
}

async function OrderConfirmation({ searchParams }: OrderConfirmationPageProps) {
  const { orderId: raw } = await searchParams;
  // Guard against repeated params (?orderId=a&orderId=b) and oversized input
  const value = Array.isArray(raw) ? raw[0] : raw;
  const orderId = value ? value.slice(0, 32) : null;
  const order = orderId ? await getMyOrder(orderId) : null;

  return <OrderConfirmationView order={order} orderId={order?.id ?? orderId} />;
}
