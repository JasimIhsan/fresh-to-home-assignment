import { AdminProductDetailView } from "./(components)/AdminProductDetailView";
import { AdminProductDetailSkeleton } from "../(components)/AdminProductSkeletons";
import { getAdminProduct } from "@/lib/dal/product.dal";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Params = Promise<{ readonly id: string }>;

interface PageProps {
  readonly params: Params;
}

async function ProductDetailSection({ params }: { readonly params: Params }) {
  const { id } = await params;
  const product = await getAdminProduct(id);
  if (!product) notFound();

  return <AdminProductDetailView product={product} />;
}

export default function AdminProductDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<AdminProductDetailSkeleton />}>
      <ProductDetailSection params={params} />
    </Suspense>
  );
}
