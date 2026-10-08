"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { CartItem, Product } from "@/types";
import { useAuth } from "./AuthContext";

interface AddToCartResult {
  success: boolean;
  reason?: "not_logged_in" | "invalid_weight";
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, weightKg: number) => AddToCartResult;
  updateWeight: (productId: string, weightKg: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user-specific cart when user logs in, or clear when logged out
  useEffect(() => {
    if (!user) {
      setItems([]);
      setIsLoaded(true);
      return;
    }

    try {
      const stored = localStorage.getItem(`cart_${user.uid}`);
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error("Failed to parse stored cart:", e);
      setItems([]);
    }
    setIsLoaded(true);
  }, [user]);

  // Save cart to local storage whenever items change (only if user is logged in)
  useEffect(() => {
    if (!isLoaded || !user) return;
    try {
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }, [items, user, isLoaded]);

  const addToCart = useCallback(
    (product: Product, weightKg: number): AddToCartResult => {
      if (!user) {
        return { success: false, reason: "not_logged_in" };
      }
      if (weightKg <= 0) {
        return { success: false, reason: "invalid_weight" };
      }

      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.product.id === product.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            weightKg: Math.round((updated[existingIndex].weightKg + weightKg) * 10) / 10,
          };
          return updated;
        }
        return [...prev, { product, weightKg }];
      });

      return { success: true };
    },
    [user]
  );

  const updateWeight = useCallback(
    (productId: string, weightKg: number) => {
      if (!user) return;
      if (weightKg <= 0) {
        removeFromCart(productId);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? { ...item, weightKg: Math.round(weightKg * 10) / 10 }
            : item
        )
      );
    },
    [user]
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    if (user) {
      try {
        localStorage.removeItem(`cart_${user.uid}`);
      } catch (e) {
        console.error("Failed to clear cart in localStorage:", e);
      }
    }
  }, [user]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.pricePerKg * item.weightKg, 0);
  }, [items]);

  const totalItemsCount = useMemo(() => {
    return items.length;
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateWeight,
        removeFromCart,
        clearCart,
        totalAmount,
        totalItemsCount,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
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
