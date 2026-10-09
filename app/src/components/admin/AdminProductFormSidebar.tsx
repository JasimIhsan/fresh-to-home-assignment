"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Image as ImageIcon, Save } from "lucide-react";

export interface AdminProductFormSidebarProps {
   name: string;
   category: string;
   pricePerKg: string;
   imageUrl: string;
   saving: boolean;
   isEditMode?: boolean;
}

export function AdminProductFormSidebar({
   name,
   category,
   pricePerKg,
   imageUrl,
   saving,
   isEditMode = false,
}: AdminProductFormSidebarProps) {
   const { t } = useLanguage();

   return (
      <div className="lg:col-span-1 space-y-6">
         {/* Live Preview Card */}
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4 sticky top-24">
            <h3 className="font-bold text-base text-gray-900 flex items-center space-x-2">
               <ImageIcon size={18} className="text-primary" />
               <span>{t("admin.liveStorePreview")}</span>
            </h3>

            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50">
               <div className="aspect-4/3 w-full bg-gray-200 relative overflow-hidden">
                  {imageUrl ? (
                     <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image Selected
                     </div>
                  )}
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-700">
                     {category}
                  </span>
               </div>

               <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-gray-900 truncate">{name || "Neuer Produktname"}</h4>
                  <div className="flex justify-between items-baseline">
                     <span className="text-xs text-gray-400 font-medium">1 kg</span>
                     <span className="text-base font-black text-primary">
                        {parseFloat(pricePerKg || "0")
                           .toFixed(2)
                           .replace(".", ",")}{" "}
                        €
                     </span>
                  </div>
               </div>
            </div>

            <button
               type="submit"
               form="product-form"
               disabled={saving}
               className="w-full py-4 bg-primary hover:bg-purple-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-primary/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
               <Save size={18} />
               <span>{saving ? t("admin.saving") : isEditMode ? t("admin.saveChanges") : t("admin.createProduct")}</span>
            </button>
         </div>
      </div>
   );
}
