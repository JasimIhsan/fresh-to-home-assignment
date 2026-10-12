"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { cartService } from "@/services";
import { CartItem, Product } from "@/types";
import { useAuth } from "./AuthContext";

interface AddToCartResult {
  success: boolean;
  reason?: "not_logged_in" | "invalid_weight" | "offline";
}

interface CartContextType {
  items: CartItem[];
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Monitor network online/offline state
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load user-specific cart when user logs in, or clear when logged out
  useEffect(() => {
    setItems(user ? cartService.load(user.id) : []);
    setIsLoaded(true);
  }, [user]);

  // Persist the cart whenever items change (only while logged in)
  useEffect(() => {
    if (!isLoaded || !user) return;
    cartService.save(user.id, items);
  }, [items, user, isLoaded]);

  const addToCart = useCallback(
    (product: Product, weightKg: number): AddToCartResult => {
      if (isBrowserOffline()) return { success: false, reason: "offline" };
      if (!user) return { success: false, reason: "not_logged_in" };
      if (weightKg <= 0) return { success: false, reason: "invalid_weight" };

      setItems((prev) => cartService.addItem(prev, product, weightKg));
      return { success: true };
    },
    [user]
  );

  const removeFromCart = useCallback((productId: string): boolean => {
    if (isBrowserOffline()) return false;
    setItems((prev) => cartService.removeItem(prev, productId));
    return true;
  }, []);

  const updateWeight = useCallback(
    (productId: string, weightKg: number): boolean => {
      if (isBrowserOffline() || !user) return false;
      setItems((prev) => cartService.setWeight(prev, productId, weightKg));
      return true;
    },
    [user]
  );

  const clearCart = useCallback((): boolean => {
    if (isBrowserOffline()) return false;
    setItems([]);
    if (user) cartService.clear(user.id);
    return true;
  }, [user]);

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
