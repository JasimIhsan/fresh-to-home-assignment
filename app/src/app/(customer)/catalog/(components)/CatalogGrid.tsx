"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";
import { useEffect, useRef, useState } from "react";

const DEFAULT_WEIGHT_KG = 0.5;
const ADDED_FEEDBACK_MS = 1500;
/** Cards in the first row on desktop; eager-loaded as likely LCP images. */
const PRIORITY_COUNT = 3;

interface CatalogGridProps {
  readonly products: readonly Product[];
}

export function CatalogGrid({ products }: CatalogGridProps) {
  const { user } = useAuth();
  const { addToCart, openCart, isOffline } = useCart();
  const [weights, setWeights] = useState<Readonly<Record<string, number>>>({});
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    },
    []
  );

  const handleWeightChange = (productId: string, weight: number) => {
    setWeights((prev) => ({ ...prev, [productId]: weight }));
  };

  const handleAddToCart = (product: Readonly<Product>) => {
    if (!user) {
      openCart();
      return;
    }
    const weight = weights[product.id] ?? DEFAULT_WEIGHT_KG;
    if (!addToCart(product, weight).success) return;

    setAddedProductId(product.id);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(
      () => setAddedProductId(null),
      ADDED_FEEDBACK_MS
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          currentWeight={weights[product.id] ?? DEFAULT_WEIGHT_KG}
          isAdded={addedProductId === product.id}
          isLoggedIn={!!user}
          onWeightChange={handleWeightChange}
          onAddToCart={handleAddToCart}
          isOffline={isOffline}
          priority={index < PRIORITY_COUNT}
        />
      ))}
    </div>
  );
}
