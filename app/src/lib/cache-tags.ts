/** Cache tags shared by DAL reads (`cacheTag`) and Server Actions (`updateTag`). */
export const CacheTags = {
  products: "products",
  product: (id: string) => `product:${id}`,
} as const;
