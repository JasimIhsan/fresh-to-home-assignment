"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Sparkles } from "lucide-react";

export interface SampleImageOption {
   label: string;
   url: string;
}

export interface AdminProductFormFieldsProps {
   name: string;
   setName: (val: string) => void;
   category: string;
   setCategory: (val: string) => void;
   pricePerKg: string;
   setPricePerKg: (val: string) => void;
   stockKg: string;
   setStockKg: (val: string) => void;
   origin: string;
   setOrigin: (val: string) => void;
   imageUrl: string;
   setImageUrl: (val: string) => void;
   description: string;
   setDescription: (val: string) => void;
   isAvailable: boolean;
   setIsAvailable: (val: boolean) => void;
   nameError: string;
   priceError: string;
   stockError: string;
   originError: string;
   touched: {
      name?: boolean;
      pricePerKg?: boolean;
      stockKg?: boolean;
      origin?: boolean;
   };
   setTouched: React.Dispatch<
      React.SetStateAction<{
         name?: boolean;
         pricePerKg?: boolean;
         stockKg?: boolean;
         origin?: boolean;
      }>
   >;
   sampleImages: SampleImageOption[];
}

export function AdminProductFormFields({
   name,
   setName,
   category,
   setCategory,
   pricePerKg,
   setPricePerKg,
   stockKg,
   setStockKg,
   origin,
   setOrigin,
   imageUrl,
   setImageUrl,
   description,
   setDescription,
   isAvailable,
   setIsAvailable,
   nameError,
   priceError,
   stockError,
   originError,
   touched,
   setTouched,
   sampleImages,
}: AdminProductFormFieldsProps) {
   const { t } = useLanguage();

   return (
      <div className="space-y-6">
         {/* Basic Info */}
         <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h2 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">{t("admin.basicInfo")}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                     {t("admin.productName")}
                  </label>
                  <input
                     type="text"
                     value={name}
                     onChange={(e) => {
                        setName(e.target.value);
                        if (!touched.name) setTouched((prev) => ({ ...prev, name: true }));
                     }}
                     onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                     placeholder="z.B. Bio Rinderfilet Extra Zart"
                     className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm transition-all ${
                        nameError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-200 focus:border-primary"
                     }`}
                     aria-invalid={!!nameError}
                  />
                  {nameError && <p className="mt-1 ml-1 text-xs text-red-600 font-medium">{nameError}</p>}
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                     {t("admin.category")}
                  </label>
                  <select
                     value={category}
                     onChange={(e) => setCategory(e.target.value)}
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary text-sm font-medium transition-all"
                  >
                     <option value="Rind">Rind / Beef</option>
                     <option value="Geflügel">Geflügel / Poultry</option>
                     <option value="Lamm">Lamm / Lamb</option>
                     <option value="Fisch">Fisch & Meeresfrüchte</option>
                     <option value="Wurst & Spezialitäten">Wurst & Feinkost</option>
                  </select>
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                     {t("admin.origin")}
                  </label>
                  <input
                     type="text"
                     value={origin}
                     onChange={(e) => {
                        setOrigin(e.target.value);
                        if (!touched.origin) setTouched((prev) => ({ ...prev, origin: true }));
                     }}
                     onBlur={() => setTouched((prev) => ({ ...prev, origin: true }))}
                     placeholder="z.B. Deutschland, Bayern"
                     className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm transition-all ${
                        originError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-200 focus:border-primary"
                     }`}
                     aria-invalid={!!originError}
                  />
                  {originError && <p className="mt-1 ml-1 text-xs text-red-600 font-medium">{originError}</p>}
               </div>
            </div>

            <div>
               <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t("admin.description")}
               </label>
               <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Geben Sie eine detaillierte Beschreibung der Fleischqualität, Reifung und Zubereitungsempfehlung an..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary text-sm transition-all"
               />
            </div>
         </div>

         {/* Pricing and Stock */}
         <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h2 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
               {t("admin.inventoryPricing")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                     {t("admin.pricePerKg")} (€)
                  </label>
                  <div className="relative">
                     <input
                        type="number"
                        step="0.10"
                        min="0"
                        value={pricePerKg}
                        onChange={(e) => {
                           setPricePerKg(e.target.value);
                           if (!touched.pricePerKg) setTouched((prev) => ({ ...prev, pricePerKg: true }));
                        }}
                        onBlur={() => setTouched((prev) => ({ ...prev, pricePerKg: true }))}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm font-semibold transition-all ${
                           priceError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-200 focus:border-primary"
                        }`}
                        aria-invalid={!!priceError}
                     />
                     <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-400">€ / kg</span>
                  </div>
                  {priceError && <p className="mt-1 ml-1 text-xs text-red-600 font-medium">{priceError}</p>}
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                     {t("admin.stockKg")}
                  </label>
                  <div className="relative">
                     <input
                        type="number"
                        step="1"
                        min="0"
                        value={stockKg}
                        onChange={(e) => {
                           setStockKg(e.target.value);
                           if (!touched.stockKg) setTouched((prev) => ({ ...prev, stockKg: true }));
                        }}
                        onBlur={() => setTouched((prev) => ({ ...prev, stockKg: true }))}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-hidden text-sm font-semibold transition-all ${
                           stockError ? "border-red-400 focus:border-red-500 bg-red-50/20" : "border-gray-200 focus:border-primary"
                        }`}
                        aria-invalid={!!stockError}
                     />
                     <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-400">kg</span>
                  </div>
                  {stockError && <p className="mt-1 ml-1 text-xs text-red-600 font-medium">{stockError}</p>}
               </div>
            </div>

            <div className="pt-2">
               <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                     type="checkbox"
                     checked={isAvailable}
                     onChange={(e) => setIsAvailable(e.target.checked)}
                     className="w-5 h-5 text-primary border-gray-300 rounded-lg focus:ring-primary"
                  />
                  <div>
                     <span className="font-bold text-sm text-gray-900 block">{t("admin.activeOnStorefront")}</span>
                     <span className="text-xs text-gray-400">{t("admin.activeOnStorefrontDesc")}</span>
                  </div>
               </label>
            </div>
         </div>

         {/* Image Asset Selection */}
         <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
               <h2 className="font-bold text-lg text-gray-900">{t("admin.productImage")}</h2>
               <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Sparkles size={13} className="text-primary" /> {t("admin.demoPresets")}
               </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
               {sampleImages.map((img) => (
                  <button
                     key={img.url}
                     type="button"
                     onClick={() => setImageUrl(img.url)}
                     className={`p-2 rounded-2xl border-2 transition-all cursor-pointer text-left overflow-hidden ${
                        imageUrl === img.url ? "border-primary bg-purple-50/50 shadow-xs" : "border-gray-100 hover:border-gray-200"
                     }`}
                  >
                     <img src={img.url} alt={img.label} className="w-full h-20 rounded-xl object-cover mb-1.5" />
                     <span className="text-xs font-bold text-gray-800 block truncate">{img.label}</span>
                  </button>
               ))}
            </div>

            <div>
               <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {t("admin.customImageUrl")}
               </label>
               <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/products/..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary text-sm transition-all"
               />
            </div>
         </div>
      </div>
   );
}
