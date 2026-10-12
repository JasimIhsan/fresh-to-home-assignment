import { CartItem, Product } from "@/types";

export const FREE_SHIPPING_THRESHOLD = 50;
const DELIVERY_FEE = 4.9;

export interface CartSummary {
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
}

/** Weights are tracked to one decimal (100 g steps). */
function roundWeight(weightKg: number): number {
  return Math.round(weightKg * 10) / 10;
}

/**
 * Cart pricing rules and per-user cart persistence. Item operations are
 * pure — they return a new array and never mutate the input.
 */
class CartService {
  private storageKey(userId: string): string {
    return `cart_${userId}`;
  }

  load(userId: string): CartItem[] {
    try {
      const stored = localStorage.getItem(this.storageKey(userId));
      const items = stored ? (JSON.parse(stored) as CartItem[]) : [];
      // Drop lines saved before product ids became numeric (e.g. "p1")
      return items.filter((item) => /^\d+$/.test(String(item.product?.id)));
    } catch (e) {
      console.error("Failed to parse stored cart:", e);
      return [];
    }
  }

  save(userId: string, items: CartItem[]): void {
    try {
      localStorage.setItem(this.storageKey(userId), JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }

  clear(userId: string): void {
    try {
      localStorage.removeItem(this.storageKey(userId));
    } catch (e) {
      console.error("Failed to clear cart in localStorage:", e);
    }
  }

  /** Adds a product, merging its weight into an existing line if present. */
  addItem(items: CartItem[], product: Product, weightKg: number): CartItem[] {
    const index = items.findIndex((item) => item.product.id === product.id);
    if (index === -1) return [...items, { product, weightKg }];

    const updated = [...items];
    updated[index] = {
      ...updated[index],
      weightKg: roundWeight(updated[index].weightKg + weightKg),
    };
    return updated;
  }

  setWeight(items: CartItem[], productId: string, weightKg: number) {
    if (weightKg <= 0) return this.removeItem(items, productId);
    return items.map((item) =>
      item.product.id === productId
        ? { ...item, weightKg: roundWeight(weightKg) }
        : item
    );
  }

  removeItem(items: CartItem[], productId: string): CartItem[] {
    return items.filter((item) => item.product.id !== productId);
  }

  getSubtotal(items: CartItem[]): number {
    return items.reduce(
      (sum, item) => sum + item.product.pricePerKg * item.weightKg,
      0
    );
  }

  /** Free delivery for empty carts and orders at or above the threshold. */
  getDeliveryFee(subtotal: number): number {
    return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : DELIVERY_FEE;
  }

  getSummary(items: CartItem[]): CartSummary {
    const subtotal = this.getSubtotal(items);
    const deliveryFee = this.getDeliveryFee(subtotal);
    return { subtotal, deliveryFee, grandTotal: subtotal + deliveryFee };
  }
}

export const cartService = new CartService();
