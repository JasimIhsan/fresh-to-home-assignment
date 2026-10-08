"use client";

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getProductById } from "@/lib/store";
import { Product } from "@/types";
import { ArrowLeft, Check, MapPin, Minus, Plus, ShieldCheck, ShoppingCart, Sparkles, Tag, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = use(params);
   const { id } = resolvedParams;
   const { t } = useLanguage();
   const { user } = useAuth();
   const { addToCart, totalItemsCount, openCart } = useCart();
   const router = useRouter();

   const [product, setProduct] = useState<Product | null>(null);
   const [weight, setWeight] = useState(1.0);
   const [isAdded, setIsAdded] = useState(false);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const found = getProductById(id);
      if (found) {
         setProduct(found);
      }
      setLoading(false);
   }, [id]);

   if (loading) {
      return (
         <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
         </div>
      );
   }

   if (!product) {
      return (
         <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("notFound.title")}</h2>
            <p className="text-gray-500 mb-6">{t("catalog.noResultsDesc")}</p>
            <Link href="/catalog" className="px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-md hover:opacity-90 transition-all">
               {t("productDetail.back")}
            </Link>
         </div>
      );
   }

   const calculatedPrice = (product.pricePerKg * weight).toFixed(2).replace(".", ",");

   const handleAddToCart = () => {
      if (!user) {
         openCart();
         return;
      }

      const res = addToCart(product, weight);
      if (res.success) {
         setIsAdded(true);
         setTimeout(() => setIsAdded(false), 2000);
      }
   };

   return (
      <div className="w-full">
         {/* Header */}
         <header className="bg-primary text-white p-6 rounded-b-3xl shadow-lg sticky top-0 z-40 md:hidden">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
               <button onClick={() => router.back()} className="p-2.5 bg-white/15 hover:bg-white/25 text-white rounded-full transition-colors flex items-center cursor-pointer" aria-label={t("productDetail.back")}>
                  <ArrowLeft size={22} />
               </button>

               <div className="text-center px-2 min-w-0">
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-white truncate max-w-50 sm:max-w-xs">{product.name}</h1>
                  <p className="text-xs text-white/80 mt-0.5 truncate">
                     {product.category} • {t("app.title")}
                  </p>
               </div>

               <div className="flex items-center space-x-2">
                  <LanguageSwitcher />
                  {user && (
                     <button onClick={openCart} className="relative p-2.5 bg-white/15 hover:bg-white/25 text-white rounded-full transition-colors cursor-pointer" aria-label="Cart">
                        <ShoppingCart size={20} />
                        {totalItemsCount > 0 && <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md animate-scale-in">{totalItemsCount}</span>}
                     </button>
                  )}
               </div>
            </div>
         </header>

         {/* Main Content */}
         <main className="max-w-7xl mx-auto p-6 md:py-10">
            {/* Desktop Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 mb-6">
               <Link href="/catalog" className="hover:text-primary transition-colors font-medium flex items-center space-x-1">
                  <ArrowLeft size={16} />
                  <span>{t("productDetail.back")}</span>
               </Link>
               <span>/</span>
               <span className="text-gray-900 font-semibold">{product.name}</span>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-10 lg:gap-16 items-start">
               {/* Left Column: Image Area */}
               <div className="space-y-6">
                  {/* Product Image Banner */}
                  <div className="w-full h-72 sm:h-96 md:h-125 lg:h-150 rounded-3xl overflow-hidden shadow-md relative bg-gray-100 border border-gray-100">
                     <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                     <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-primary shadow-md flex items-center space-x-1">
                        <Tag size={13} />
                        <span>{product.category}</span>
                     </div>

                     <div className="absolute top-4 right-4 bg-primary text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center space-x-1">
                        <Sparkles size={13} />
                        <span>{product.isAvailable ? t("catalog.inStock") : t("catalog.outOfStock")}</span>
                     </div>
                  </div>

                  {/* Desktop Freshness Promise */}
                  <div className="hidden md:block bg-linear-to-r from-purple-900 to-primary text-white p-6 rounded-3xl shadow-md space-y-2">
                     <div className="flex items-center space-x-2">
                        <ShieldCheck size={24} className="text-purple-200" />
                        <h3 className="font-bold text-lg">{t("productDetail.freshnessPromise")}</h3>
                     </div>
                     <p className="text-purple-100 text-sm leading-relaxed">{t("productDetail.freshnessDesc")}</p>
                  </div>
               </div>

               {/* Right Column: Title, Price, Details & Purchase */}
               <div className="space-y-6 mt-6 md:mt-0">
                  {/* Title & Price Header */}
                  <div className="bg-white p-6 rounded-3xl shadow-xs border border-gray-100 space-y-4">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
                        <div className="text-left sm:text-right">
                           <span className="text-2xl sm:text-3xl font-black text-primary">{product.pricePerKg.toFixed(2).replace(".", ",")} €</span>
                           <span className="text-gray-500 text-sm block font-medium">/ kg</span>
                        </div>
                     </div>

                     <p className="text-gray-600 text-base leading-relaxed">{product.description}</p>

                     {/* Details badges */}
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                        <div className="bg-purple-50/70 p-3 rounded-2xl flex items-center space-x-2 text-primary">
                           <MapPin size={18} className="shrink-0" />
                           <div>
                              <span className="block text-[10px] text-gray-500 uppercase font-semibold">{t("productDetail.origin")}</span>
                              <span className="font-bold">{product.origin || t("productDetail.defaultOrigin")}</span>
                           </div>
                        </div>

                        <div className="bg-emerald-50 p-3 rounded-2xl flex items-center space-x-2 text-emerald-800">
                           <ShieldCheck size={18} className="shrink-0 text-emerald-600" />
                           <div>
                              <span className="block text-[10px] text-emerald-600 uppercase font-semibold">{t("productDetail.qualityLabel")}</span>
                              <span className="font-bold">{t("productDetail.qualityValue")}</span>
                           </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-2xl flex items-center space-x-2 text-blue-800 col-span-2 sm:col-span-1">
                           <Truck size={18} className="shrink-0 text-blue-600" />
                           <div>
                              <span className="block text-[10px] text-blue-600 uppercase font-semibold">{t("productDetail.deliveryLabel")}</span>
                              <span className="font-bold">{t("productDetail.deliveryValue")}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Redesigned Weight & Purchase Card */}
                  <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-gray-100 space-y-5">
                     <div className="flex items-center justify-between">
                        <div>
                           <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">{t("productDetail.weightSelection")}</h2>
                           <p className="text-xs text-gray-500 mt-0.5">{t("productDetail.selectWeightKg")}</p>
                        </div>

                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <span>{product.isAvailable ? t("catalog.inStock") : t("catalog.outOfStock")}</span>
                        </div>
                     </div>

                     {/* Quick Weight Presets */}
                     <div className="space-y-2">
                        <div className="grid grid-cols-5 gap-2">
                           {[0.5, 1.0, 1.5, 2.0, 3.0].map((preset) => {
                              const isSelected = weight === preset;
                              return (
                                 <button key={preset} type="button" onClick={() => setWeight(preset)} className={`py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${isSelected ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                                    {preset.toFixed(1).replace(".", ",")} kg
                                 </button>
                              );
                           })}
                        </div>
                     </div>

                     {/* Fine-Tuning Stepper Row */}
                     <div className="flex items-center justify-between p-3.5 bg-gray-50/90 rounded-2xl border border-gray-100">
                        <span className="text-xs sm:text-sm font-semibold text-gray-600">{t("productDetail.weightSelection")}</span>

                        <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs">
                           <button
                              type="button"
                              onClick={() => weight > 0.5 && setWeight(Number((weight - 0.5).toFixed(1)))}
                              disabled={weight <= 0.5}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-30 flex items-center justify-center font-bold transition-colors cursor-pointer"
                              aria-label="Decrease weight"
                           >
                              <Minus size={15} />
                           </button>

                           <span className="font-extrabold text-gray-900 min-w-16 text-center text-sm sm:text-base">{weight.toFixed(1).replace(".", ",")} kg</span>

                           <button type="button" onClick={() => setWeight(Number((weight + 0.5).toFixed(1)))} className="w-8 h-8 rounded-lg bg-primary hover:bg-purple-700 text-white flex items-center justify-center font-bold transition-colors shadow-2xs cursor-pointer" aria-label="Increase weight">
                              <Plus size={15} />
                           </button>
                        </div>
                     </div>

                     {/* Dynamic Live Price Breakdown */}
                     <div className="p-4 bg-linear-to-r from-purple-50/60 to-purple-100/40 rounded-2xl border border-purple-100 flex items-center justify-between">
                        <div>
                           <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider">{t("productDetail.totalPrice")}</span>
                           <span className="text-xs text-purple-900/70 mt-0.5 block font-medium">
                              {weight.toFixed(1).replace(".", ",")} kg × {product.pricePerKg.toFixed(2).replace(".", ",")} € / kg
                           </span>
                        </div>

                        <div className="text-right">
                           <span className="text-2xl sm:text-3xl font-black text-primary">{calculatedPrice} €</span>
                        </div>
                     </div>

                     {/* Add to Cart Action */}
                     <button
                        onClick={handleAddToCart}
                        className={`w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center space-x-2.5 shadow-xl transition-all duration-200 cursor-pointer ${
                           isAdded ? "bg-emerald-600 text-white shadow-emerald-600/30 scale-[0.99]" : "bg-primary hover:bg-purple-700 active:scale-[0.99] text-white shadow-primary/25 hover:shadow-primary/40"
                        }`}
                     >
                        {isAdded ? (
                           <>
                              <Check size={22} className="stroke-[2.5]" />
                              <span>{t("catalog.addedToCart")}</span>
                           </>
                        ) : (
                           <>
                              <ShoppingCart size={22} className="stroke-[2.5]" />
                              <span>{user ? t("productDetail.addToCart") : t("catalog.loginToOrder")}</span>
                              <span className="text-white/80 text-sm font-semibold ml-1">• {calculatedPrice} €</span>
                           </>
                        )}
                     </button>
                  </div>

                  {/* Mobile Freshness Promise */}
                  <div className="md:hidden bg-linear-to-r from-purple-900 to-primary text-white p-6 rounded-3xl shadow-md space-y-2">
                     <div className="flex items-center space-x-2">
                        <ShieldCheck size={24} className="text-purple-200" />
                        <h3 className="font-bold text-lg">{t("productDetail.freshnessPromise")}</h3>
                     </div>
                     <p className="text-purple-100 text-sm leading-relaxed">{t("productDetail.freshnessDesc")}</p>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
}
