"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";
import {
  createContext,
  use,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PdpAddToCart } from "./PdpAddToCart";
import { PdpStickyBar } from "./PdpStickyBar";
import { PdpWeightSelector } from "./PdpWeightSelector";

/** Pre-selected popular weight (Hick's Law). */
const DEFAULT_WEIGHT_KG = 1.0;
const ADDED_FEEDBACK_MS = 2200;

interface PdpPurchaseState {
  readonly product: Readonly<Product>;
  readonly weight: number;
  readonly setWeight: (weight: number) => void;
  readonly isAdded: boolean;
  readonly isLoggedIn: boolean;
  readonly isOffline: boolean;
  readonly calculatedPrice: string;
  readonly addToCart: () => void;
}

const PdpPurchaseContext = createContext<PdpPurchaseState | null>(null);

function usePdpPurchase(): PdpPurchaseState {
  const ctx = use(PdpPurchaseContext);
  if (!ctx)
    throw new Error("usePdpPurchase must be used within PdpPurchaseProvider");
  return ctx;
}

interface PdpPurchaseProviderProps {
  readonly product: Readonly<Product>;
  readonly children: ReactNode;
}

/**
 * Holds the selected weight and add-to-cart state for the product page so
 * the server-rendered layout can place the interactive slots anywhere.
 */
export function PdpPurchaseProvider({
  product,
  children,
}: PdpPurchaseProviderProps) {
  const { user } = useAuth();
  const { addToCart, openCart, isOffline } = useCart();
  const [weight, setWeight] = useState(DEFAULT_WEIGHT_KG);
  const [isAdded, setIsAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const handleAddToCart = () => {
    if (!user) {
      openCart();
      return;
    }
    if (!addToCart(product, weight).success) return;
    setIsAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setIsAdded(false), ADDED_FEEDBACK_MS);
  };

  const value: PdpPurchaseState = {
    product,
    weight,
    setWeight,
    isAdded,
    isLoggedIn: !!user,
    isOffline,
    calculatedPrice: (product.pricePerKg * weight).toFixed(2).replace(".", ","),
    addToCart: handleAddToCart,
  };

  return <PdpPurchaseContext value={value}>{children}</PdpPurchaseContext>;
}

export function PdpWeightSelectorSlot() {
  const { weight, setWeight, product } = usePdpPurchase();
  return (
    <PdpWeightSelector
      weight={weight}
      pricePerKg={product.pricePerKg}
      onWeightChange={setWeight}
    />
  );
}

export function PdpAddToCartSlot() {
  const s = usePdpPurchase();
  return (
    <PdpAddToCart
      isAdded={s.isAdded}
      isLoggedIn={s.isLoggedIn}
      calculatedPrice={s.calculatedPrice}
      onAddToCart={s.addToCart}
      weight={s.weight}
      isOffline={s.isOffline}
    />
  );
}

export function PdpStickyBarSlot() {
  const s = usePdpPurchase();
  return (
    <PdpStickyBar
      calculatedPrice={s.calculatedPrice}
      isAdded={s.isAdded}
      isLoggedIn={s.isLoggedIn}
      onAddToCart={s.addToCart}
      isOffline={s.isOffline}
    />
  );
}
