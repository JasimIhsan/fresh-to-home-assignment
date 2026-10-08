"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Leaf, ShieldCheck, Snowflake, Truck } from "lucide-react";

export function PdpTrustBar() {
   const { t } = useLanguage();

   const trustItems = [
      {
         icon: <ShieldCheck size={20} className="text-emerald-500" />,
         label: t("productDetail.trustFresh"),
         sub: t("productDetail.trustFreshSub"),
      },
      {
         icon: <Truck size={20} className="text-blue-500" />,
         label: t("productDetail.deliveryValue"),
         sub: t("productDetail.trustDelivery"),
      },
      {
         icon: <Snowflake size={20} className="text-cyan-500" />,
         label: t("productDetail.trustReturns"),
         sub: t("productDetail.trustReturnsSub"),
      },
      {
         icon: <Leaf size={20} className="text-green-500" />,
         label: t("productDetail.trustSustainable"),
         sub: t("productDetail.trustSustainableSub"),
      },
   ];

   return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {trustItems.map((item, index) => (
               <div
                  key={item.label}
                  className={`flex flex-col items-center gap-1.5 text-center p-2 sm:px-3 sm:py-1 transition-all duration-200 ${
                     index >= 2 ? "pt-3 sm:pt-1" : ""
                  }`}
               >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-0.5">
                     {item.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-800 leading-tight">{item.label}</span>
                  <span className="text-[11px] text-gray-500 font-medium leading-tight">{item.sub}</span>
               </div>
            ))}
         </div>
      </div>
   );
}
