import { ALL_CATEGORIES } from "@/services/product.service";

export const CATALOG_PATH = "/catalog";
export const CATALOG_PAGE_SIZE = 9;
export const CATALOG_QUERY_MAX_LENGTH = 100;

export interface CatalogParams {
  readonly query: string;
  readonly category: string;
  readonly page: number;
}

export type RawSearchParams = Readonly<
  Record<string, string | readonly string[] | undefined>
>;

/** First value of a search param, guarding against `?q=a&q=b` pollution. */
function first(value: string | readonly string[] | undefined): string {
  if (typeof value === "string") return value;
  return value?.[0] ?? "";
}

export function parseCatalogParams(raw: RawSearchParams): CatalogParams {
  const page = Number.parseInt(first(raw.page), 10);
  return {
    query: first(raw.q).trim().slice(0, CATALOG_QUERY_MAX_LENGTH),
    category: first(raw.category).trim().slice(0, 60) || ALL_CATEGORIES,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Builds a catalog URL, omitting defaults so URLs stay canonical. */
export function buildCatalogHref({
  query,
  category,
  page,
}: Partial<CatalogParams>): string {
  const params = new URLSearchParams();
  const q = query?.trim().slice(0, CATALOG_QUERY_MAX_LENGTH);
  if (q) params.set("q", q);
  if (category && category !== ALL_CATEGORIES) params.set("category", category);
  if (page && page > 1) params.set("page", String(page));
  const search = params.toString();
  return search ? `${CATALOG_PATH}?${search}` : CATALOG_PATH;
}
