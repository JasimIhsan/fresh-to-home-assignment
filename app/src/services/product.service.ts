import type { ProductInput } from "@/lib/schemas/product.schema";
import type { Product, ProductStatus } from "@/types";

export const ALL_CATEGORIES = "all";

const DEFAULT_REORDER_POINT_KG = 15;
/** Assumed wholesale cost when none is recorded. */
const DEFAULT_WHOLESALE_RATIO = 0.6;

export interface ProductFilter {
  category?: string;
  query?: string;
}

/** Raw admin form values; numeric fields are strings straight from inputs. */
export interface ProductFormInput {
  name: string;
  category: string;
  pricePerKg: string;
  stockKg: string;
  isAvailable: boolean;
  origin: string;
  imageUrl: string;
  description: string;
}

export interface ProductMetrics {
  retailPrice: number;
  wholesaleCost: number;
  grossMargin: number;
  marginPercentage: number;
  stockLevel: number;
  reservedStock: number;
  availableStock: number;
  reorderPoint: number;
  isLowStock: boolean;
  status: ProductStatus;
}

export type StockAdjustMode = "set" | "add";

export class ProductService {
  /** Distinct categories, prefixed with the "all" option. */
  getCategories(products: readonly Product[]): string[] {
    const categories = new Set(products.map((p) => p.category));
    return [ALL_CATEGORIES, ...Array.from(categories).filter(Boolean)];
  }

  filter(
    products: readonly Product[],
    { category, query }: ProductFilter
  ): Product[] {
    const q = query?.trim().toLowerCase() ?? "";
    const cat = category?.toLowerCase();
    return products.filter((p) => {
      const matchesCategory =
        !cat || cat === ALL_CATEGORIES || p.category?.toLowerCase() === cat;
      const matchesQuery =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }

  /** Maps a product back to form values for editing. */
  toFormInput(product: Readonly<Product>): ProductFormInput {
    return {
      name: product.name,
      category: product.category || "Rind",
      pricePerKg: product.pricePerKg.toString(),
      stockKg: (product.stockKg ?? 50).toString(),
      isAvailable: product.isAvailable,
      origin: product.origin || "",
      imageUrl: product.imageUrl,
      description: product.description,
    };
  }

  /** Parses raw form values into the Server Action payload. */
  toInput(form: ProductFormInput): ProductInput {
    return {
      name: form.name.trim(),
      category: form.category,
      pricePerKg: parseFloat(form.pricePerKg) || 0,
      stockKg: parseFloat(form.stockKg) || 0,
      isAvailable: form.isAvailable,
      origin: form.origin.trim(),
      imageUrl: form.imageUrl.trim(),
      description: form.description.trim(),
    };
  }

  getStatus(product: Readonly<Product>): ProductStatus {
    return product.status || (product.isAvailable ? "active" : "draft");
  }

  /** Pricing and inventory figures shown on the admin product page. */
  getMetrics(product: Readonly<Product>): ProductMetrics {
    const retailPrice = product.pricePerKg || 0;
    const wholesaleCost =
      product.wholesaleCostPerKg ?? retailPrice * DEFAULT_WHOLESALE_RATIO;
    const grossMargin = retailPrice - wholesaleCost;
    const stockLevel = product.stockKg ?? 0;
    const reservedStock = product.reservedStockKg ?? 0;
    const reorderPoint = product.reorderPointKg ?? DEFAULT_REORDER_POINT_KG;

    return {
      retailPrice,
      wholesaleCost,
      grossMargin,
      marginPercentage: retailPrice > 0 ? (grossMargin / retailPrice) * 100 : 0,
      stockLevel,
      reservedStock,
      availableStock: Math.max(0, stockLevel - reservedStock),
      reorderPoint,
      isLowStock: stockLevel <= reorderPoint,
      status: this.getStatus(product),
    };
  }

  /** Main image followed by unique gallery images. */
  getGallery(product: Readonly<Product>): string[] {
    return [product.imageUrl, ...(product.galleryImages || [])].filter(
      (url, idx, self) => url && self.indexOf(url) === idx
    );
  }
}

export const productService = new ProductService();
