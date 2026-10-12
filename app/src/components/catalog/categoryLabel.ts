import { ALL_CATEGORIES } from "@/services/product.service";

/** Translated category label, falling back to the raw category name. */
export function categoryLabel(
  category: string,
  t: (key: string) => string
): string {
  if (category === ALL_CATEGORIES) return t("catalog.allCategories");
  const key = `categories.${category}`;
  const translated = t(key);
  return translated !== key ? translated : category;
}
