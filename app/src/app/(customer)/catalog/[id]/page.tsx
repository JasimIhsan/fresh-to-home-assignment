"use client";

import { PdpAccordion } from "@/components/product-detail/PdpAccordion";
import { PdpAddToCart } from "@/components/product-detail/PdpAddToCart";
import { PdpBreadcrumb } from "@/components/product-detail/PdpBreadcrumb";
import { PdpFreshnessPromise } from "@/components/product-detail/PdpFreshnessPromise";
import { PdpHeader } from "@/components/product-detail/PdpHeader";
import { PdpImageGallery } from "@/components/product-detail/PdpImageGallery";
import { PdpProductInfo } from "@/components/product-detail/PdpProductInfo";
import { PdpRelatedProducts } from "@/components/product-detail/PdpRelatedProducts";
import { PdpReviews } from "@/components/product-detail/PdpReviews";
import { PdpSkeleton } from "@/components/product-detail/PdpSkeleton";
import { PdpStickyBar } from "@/components/product-detail/PdpStickyBar";
import { PdpTrustBar } from "@/components/product-detail/PdpTrustBar";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getProductById } from "@/lib/store";
import { Product } from "@/types";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function ProductDetailPage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = use(params);
   const { t } = useLanguage();
   const { user } = useAuth();
   const { addToCart, openCart, isOffline } = useCart();

   const [product, setProduct] = useState<Product | null>(null);
   const [weight, setWeight] = useState(1.0); // Pre-selected popular weight (Hick's Law)
   const [isAdded, setIsAdded] = useState(false);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const found = getProductById(id);
      if (found) setProduct(found);
      setLoading(false);
   }, [id]);

   // ── Loading ──────────────────────────────────────────────────────────────
   if (loading) return <PdpSkeleton />;

   // ── Not Found ─────────────────────────────────────────────────────────────
   if (!product) {
      return (
         <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center text-3xl">
               {t("productDetail.notFoundIcon")}
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">{t("notFound.title")}</h2>
            <p className="text-gray-400 text-sm max-w-xs">{t("catalog.noResultsDesc")}</p>
            <Link
               href="/catalog"
               className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:bg-purple-700 transition-all duration-200 active:scale-95"
            >
               {t("productDetail.back")}
            </Link>
         </div>
      );
   }

   // ── Computed Values ───────────────────────────────────────────────────────
   const calculatedPrice = (product.pricePerKg * weight).toFixed(2).replace(".", ",");

   const handleAddToCart = () => {
      if (!user) {
         openCart();
         return;
      }
      const res = addToCart(product, weight);
      if (res.success) {
         setIsAdded(true);
         setTimeout(() => setIsAdded(false), 2200);
      }
   };

   // ── Page Render ───────────────────────────────────────────────────────────
   return (
      <div className="w-full bg-[#fafafa]">
         {/* ── Mobile Sticky Header (Progressive Disclosure) ─────────────────── */}
         <PdpHeader
            productName={product.name}
            category={product.category}
            isLoggedIn={!!user}
         />

         <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-32 md:pb-12 pt-5 md:pt-10">
            {/* ── Desktop Breadcrumb ─────────────────────────────────────────── */}
            <PdpBreadcrumb category={product.category} productName={product.name} />

            {/*
             * ── Two-Column Desktop Layout ──────────────────────────────────
             * Mobile: Single column, full-width stacked
             * Desktop: Left 60% gallery (sticky scroll) + Right 40% info rail
             */}
            <div className="md:grid md:grid-cols-[58%_42%] md:gap-10 lg:gap-14 items-start">

               {/* ═══════════════ LEFT COLUMN – Gallery ═══════════════════════ */}
               <div className="md:sticky md:top-6">
                  <PdpImageGallery product={product} />

                  {/* Desktop Freshness Promise (below gallery) */}
                  <div className="hidden md:block mt-4">
                     <PdpFreshnessPromise />
                  </div>
               </div>

               {/* ═══════════════ RIGHT COLUMN – Info Rail ════════════════════ */}
               <div className="space-y-5 mt-5 md:mt-0">
                  {/*
                   * 1. Product Info: Title, Rating (Social Proof), Price,
                   *    Ethical Scarcity Alert, Description, Icon Badges
                   */}
                  <PdpProductInfo product={product} />

                  {/*
                   * 2. Weight Selector (Hick's Law presets + Fitts's Law steppers)
                   */}
                  <PdpWeightSelectorSection
                     weight={weight}
                     pricePerKg={product.pricePerKg}
                     onWeightChange={setWeight}
                  />

                  {/*
                   * 3. Add to Cart + Wishlist (Von Restorff isolation)
                   *    Only shown on desktop – mobile uses StickyBar
                   */}
                  <div className="hidden md:block">
                     <PdpAddToCart
                        isAdded={isAdded}
                        isLoggedIn={!!user}
                        calculatedPrice={calculatedPrice}
                        onAddToCart={handleAddToCart}
                        weight={weight}
                        isOffline={isOffline}
                     />
                  </div>

                  {/*
                   * 4. Trust Bar – Key Value Props (post-decision anxiety relief)
                   */}
                  <PdpTrustBar />

                  {/*
                   * 5. Progressive Disclosure Accordion – secondary info
                   */}
                  <PdpAccordion product={product} />

                  {/* Mobile Freshness Promise */}
                  <div className="md:hidden">
                     <PdpFreshnessPromise />
                  </div>

                  {/*
                   * 6. Mobile: Add to Cart (visible, above reviews, below accordion)
                   *    Desktop users use the inline CTA above.
                   */}
                  <div className="md:hidden">
                     <PdpAddToCart
                        isAdded={isAdded}
                        isLoggedIn={!!user}
                        calculatedPrice={calculatedPrice}
                        onAddToCart={handleAddToCart}
                        weight={weight}
                     />
                  </div>

                  {/*
                   * 7. Reviews & Social Proof (Bandwagon Effect)
                   */}
                  <PdpReviews />

                  {/*
                   * 8. Cross-Sell / Related Products (max 4, Hick's Law)
                   */}
                  <PdpRelatedProducts
                     currentProductId={product.id}
                     currentCategory={product.category}
                  />
               </div>
            </div>
         </main>

         {/*
          * ── Mobile Sticky Bottom Bar (Fitts's Law – thumb zone) ──────────
          * Fixed at bottom, always visible on mobile.
          * Desktop users see the inline CTA in the right rail.
          */}
         <PdpStickyBar
            calculatedPrice={calculatedPrice}
            isAdded={isAdded}
            isLoggedIn={!!user}
            onAddToCart={handleAddToCart}
            productName={product.name}
            isOffline={isOffline}
         />
      </div>
   );
}

// ── Inline wrapper for weight selector to keep page clean ──────────────────
import { PdpWeightSelector } from "@/components/product-detail/PdpWeightSelector";

function PdpWeightSelectorSection({
   weight,
   pricePerKg,
   onWeightChange,
}: {
   weight: number;
   pricePerKg: number;
   onWeightChange: (w: number) => void;
}) {
   return (
      <PdpWeightSelector
         weight={weight}
         pricePerKg={pricePerKg}
         onWeightChange={onWeightChange}
      />
   );
}
