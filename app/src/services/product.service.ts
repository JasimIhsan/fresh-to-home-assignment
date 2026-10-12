import {
  deleteProduct,
  getProductById,
  getStoredProducts,
  saveProduct,
  updateProductStatus,
  updateProductStock,
} from "@/lib/store";
import { Product, ProductStatus } from "@/types";

export const ALL_CATEGORIES = "all";

const DEFAULT_DESCRIPTION =
  "Frisches Qualitätsprodukt aus sorgfältig kontrollierter Aufzucht.";
const DEFAULT_ORIGIN = "Deutschland";
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
  list(): Product[] {
    return getStoredProducts();
  }

  getById(id: string): Product | undefined {
    return getProductById(id);
  }

  /** Available products from the same category, excluding the product. */
  getRelated(productId: string, category: string, limit = 4): Product[] {
    return this.list()
      .filter(
        (p) => p.id !== productId && p.category === category && p.isAvailable
      )
      .slice(0, limit);
  }

  /** Distinct categories, prefixed with the "all" option. */
  getCategories(products: Product[]): string[] {
    const categories = new Set(products.map((p) => p.category));
    return [ALL_CATEGORIES, ...Array.from(categories).filter(Boolean)];
  }

  filter(products: Product[], { category, query }: ProductFilter): Product[] {
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

  /** Creates a product from validated form input. */
  create(input: ProductFormInput, fallbackImageUrl: string): Product {
    const product: Product = {
      id: `prod_${Date.now()}`,
      name: input.name.trim(),
      description: input.description.trim() || DEFAULT_DESCRIPTION,
      pricePerKg: parseFloat(input.pricePerKg),
      stockKg: parseFloat(input.stockKg),
      imageUrl: input.imageUrl || fallbackImageUrl,
      isAvailable: input.isAvailable,
      category: input.category,
      origin: input.origin.trim() || DEFAULT_ORIGIN,
    };
    saveProduct(product);
    return product;
  }

  /** Applies validated form input to an existing product. */
  update(product: Product, input: ProductFormInput): Product {
    const updated: Product = {
      ...product,
      name: input.name.trim(),
      description: input.description.trim(),
      pricePerKg: parseFloat(input.pricePerKg) || product.pricePerKg,
      stockKg: parseFloat(input.stockKg) || 0,
      imageUrl: input.imageUrl || product.imageUrl,
      isAvailable: input.isAvailable,
      category: input.category,
      origin: input.origin.trim(),
    };
    saveProduct(updated);
    return updated;
  }

  /** Maps a product back to form values for editing. */
  toFormInput(product: Product): ProductFormInput {
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

  toggleAvailability(product: Product): Product {
    const updated = { ...product, isAvailable: !product.isAvailable };
    saveProduct(updated);
    return updated;
  }

  setStatus(id: string, status: ProductStatus): Product | undefined {
    return updateProductStatus(id, status);
  }

  /**
   * Sets or increments stock. Returns the updated product and the new stock
   * level, or null when the amount is invalid or the product is missing.
   */
  adjustStock(
    product: Product,
    amount: number,
    mode: StockAdjustMode
  ): { product: Product; stockKg: number } | null {
    if (isNaN(amount) || amount < 0) return null;
    const target = mode === "set" ? amount : (product.stockKg ?? 0) + amount;
    const updated = updateProductStock(product.id, target);
    return updated ? { product: updated, stockKg: target } : null;
  }

  delete(id: string): void {
    deleteProduct(id);
  }

  getStatus(product: Product): ProductStatus {
    return product.status || (product.isAvailable ? "active" : "draft");
  }

  /** Pricing and inventory figures shown on the admin product page. */
  getMetrics(product: Product): ProductMetrics {
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
  getGallery(product: Product): string[] {
    return [product.imageUrl, ...(product.galleryImages || [])].filter(
      (url, idx, self) => url && self.indexOf(url) === idx
    );
  }
}

export const productService = new ProductService();
