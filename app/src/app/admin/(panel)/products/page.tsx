import { AdminProductsFilter } from "./(components)/AdminProductsFilter";
import { AdminProductsHeader } from "./(components)/AdminProductsHeader";
import { AdminProductsTableSkeleton } from "./(components)/AdminProductSkeletons";
import { AdminProductsTable } from "./(components)/AdminProductsTable";
import { getAdminProducts } from "@/lib/dal/product.dal";
import { ALL_CATEGORIES, productService } from "@/services";
import { Suspense } from "react";

const MAX_QUERY_LENGTH = 100;

type SearchParams = Promise<{
  readonly q?: string | string[];
  readonly category?: string | string[];
}>;

interface PageProps {
  readonly searchParams: SearchParams;
}

/** Guards against repeated params (`?q=a&q=b`) and oversized input. */
function firstParam(value: string | string[] | undefined, max: number): string {
  const single = Array.isArray(value) ? value[0] : value;
  return (single ?? "").trim().slice(0, max);
}

async function ProductsSection({
  searchParams,
}: {
  readonly searchParams: SearchParams;
}) {
  const [params, products] = await Promise.all([
    searchParams,
    getAdminProducts(),
  ]);
  const query = firstParam(params.q, MAX_QUERY_LENGTH);
  const category = firstParam(params.category, 60) || ALL_CATEGORIES;

  const categories = productService.getCategories(products);
  const filtered = productService.filter(products, { category, query });

  return (
    <>
      <AdminProductsFilter
        categories={categories}
        selectedCategory={category}
        initialQuery={query}
      />
      <AdminProductsTable products={filtered} />
    </>
  );
}

export default function AdminProductsPage({ searchParams }: PageProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminProductsHeader />
      <Suspense fallback={<AdminProductsTableSkeleton />}>
        <ProductsSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
