import { AdminProductForm } from "../../(components)/AdminProductForm";
import { AdminProductFormSkeleton } from "../../(components)/AdminProductSkeletons";
import { getAdminProduct } from "@/lib/dal/product.dal";
import { productService } from "@/services";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Params = Promise<{ readonly id: string }>;

interface PageProps {
  readonly params: Params;
}

async function EditProductSection({ params }: { readonly params: Params }) {
  const { id } = await params;
  const product = await getAdminProduct(id);
  if (!product) notFound();

  return (
    <AdminProductForm
      mode="edit"
      productId={product.id}
      initialValues={productService.toFormInput(product)}
    />
  );
}

export default function EditProductPage({ params }: PageProps) {
  return (
    <Suspense fallback={<AdminProductFormSkeleton />}>
      <EditProductSection params={params} />
    </Suspense>
  );
}
