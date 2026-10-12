"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useSyncExternalStore,
} from "react";
import { cartService } from "@/services";
import { CartItem, Product } from "@/types";
import { useAuth } from "./AuthContext";

interface AddToCartResult {
  success: boolean;
  reason?: "not_logged_in" | "invalid_weight" | "offline";
}

interface CartContextType {
  items: readonly CartItem[];
  addToCart: (product: Product, weightKg: number) => AddToCartResult;
  updateWeight: (productId: string, weightKg: number) => boolean;
  removeFromCart: (productId: string) => boolean;
  clearCart: () => boolean;
  /** Subtotal of all items, before delivery. */
  totalAmount: number;
  deliveryFee: number;
  /** Subtotal plus delivery fee. */
  grandTotal: number;
  totalItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  isOffline: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function isBrowserOffline(): boolean {
  return typeof window !== "undefined" && !navigator.onLine;
}

function subscribeToNetwork(onChange: () => void): () => void {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

interface UserCart {
  /** Owner of `items`; null while signed out. */
  readonly userId: string | null;
  readonly items: CartItem[];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [cart, setCart] = useState<UserCart>({ userId: null, items: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isOffline = useSyncExternalStore(
    subscribeToNetwork,
    isBrowserOffline,
    () => false
  );

  // Swap to the signed-in user's saved cart (or clear on sign-out) during
  // render, so there is never a frame showing another user's items. The user
  // only resolves on the client, so the server render always sees no cart.
  if (cart.userId !== userId) {
    setCart({ userId, items: userId ? cartService.load(userId) : [] });
  }
  const items = cart.items;

  const setItems = useCallback(
    (update: (prev: CartItem[]) => CartItem[]) =>
      setCart((prev) => ({ ...prev, items: update(prev.items) })),
    []
  );

  // Persist the cart whenever items change (only while logged in)
  useEffect(() => {
    if (cart.userId) cartService.save(cart.userId, cart.items);
  }, [cart]);

  const addToCart = useCallback(
    (product: Product, weightKg: number): AddToCartResult => {
      if (isBrowserOffline()) return { success: false, reason: "offline" };
      if (!user) return { success: false, reason: "not_logged_in" };
      if (weightKg <= 0) return { success: false, reason: "invalid_weight" };

      setItems((prev) => cartService.addItem(prev, product, weightKg));
      return { success: true };
    },
    [user, setItems]
  );

  const removeFromCart = useCallback(
    (productId: string): boolean => {
      if (isBrowserOffline()) return false;
      setItems((prev) => cartService.removeItem(prev, productId));
      return true;
    },
    [setItems]
  );

  const updateWeight = useCallback(
    (productId: string, weightKg: number): boolean => {
      if (isBrowserOffline() || !user) return false;
      setItems((prev) => cartService.setWeight(prev, productId, weightKg));
      return true;
    },
    [user, setItems]
  );

  const clearCart = useCallback((): boolean => {
    if (isBrowserOffline()) return false;
    setItems(() => []);
    if (user) cartService.clear(user.id);
    return true;
  }, [user, setItems]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const summary = useMemo(() => cartService.getSummary(items), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateWeight,
        removeFromCart,
        clearCart,
        totalAmount: summary.subtotal,
        deliveryFee: summary.deliveryFee,
        grandTotal: summary.grandTotal,
        totalItemsCount: items.length,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        isOffline,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
