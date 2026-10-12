import { CatalogNavbar } from "./CatalogNavbar";
import { CatalogSearch } from "./CatalogSearch";
import {
  CATALOG_PAGE_SIZE,
  parseCatalogParams,
  type RawSearchParams,
} from "./catalog-url";
import { CategoryFilter } from "./CategoryFilter";
import { getStorefrontProducts } from "@/lib/dal/product.dal";
import { ALL_CATEGORIES, productService } from "@/services/product.service";
import { CatalogEmptyState } from "./CatalogEmptyState";
import { CatalogGrid } from "./CatalogGrid";
import { CatalogHeading } from "./CatalogHeading";
import { CatalogPager } from "./CatalogPager";

interface CatalogViewProps {
  readonly searchParams: Promise<RawSearchParams>;
}

/** Reads the URL filters (request-time) and renders the filtered catalog. */
export async function CatalogView({ searchParams }: CatalogViewProps) {
  const [raw, products] = await Promise.all([
    searchParams,
    getStorefrontProducts(),
  ]);
  const parsed = parseCatalogParams(raw);

  const categories = productService.getCategories(products);
  const category = categories.includes(parsed.category)
    ? parsed.category
    : ALL_CATEGORIES;

  const filtered = productService.filter(products, {
    category,
    query: parsed.query,
  });
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / CATALOG_PAGE_SIZE)
  );
  const page = Math.min(parsed.page, totalPages);
  const params = { query: parsed.query, category, page };
  const pageItems = filtered.slice(
    (page - 1) * CATALOG_PAGE_SIZE,
    page * CATALOG_PAGE_SIZE
  );

  return (
    <>
      <CatalogNavbar
        query={params.query}
        categories={categories}
        selectedCategory={category}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="hidden flex-col justify-between gap-6 md:flex md:flex-row md:items-end">
          <CatalogHeading />
          <CatalogSearch query={params.query} category={category} />
        </div>

        <div className="hidden md:block">
          <CategoryFilter
            categories={categories}
            selectedCategory={category}
            query={params.query}
          />
        </div>

        {pageItems.length === 0 ? (
          <CatalogEmptyState />
        ) : (
          <CatalogGrid products={pageItems} />
        )}

        <CatalogPager params={params} totalPages={totalPages} />
      </main>
    </>
  );
}
