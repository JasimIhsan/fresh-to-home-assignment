"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Search } from "lucide-react";

export interface AdminOrdersFilterProps {
   searchQuery: string;
   setSearchQuery: (query: string) => void;
   selectedStatus: string;
   setSelectedStatus: (status: string) => void;
}

export function AdminOrdersFilter({
   searchQuery,
   setSearchQuery,
   selectedStatus,
   setSelectedStatus,
}: AdminOrdersFilterProps) {
   const { t } = useLanguage();

   const statusKeys: Record<string, string> = {
      pending: "orders.statusPending",
      processing: "orders.statusProcessing",
      shipped: "orders.statusShipped",
      delivered: "orders.statusDelivered",
      cancelled: "orders.statusCancelled",
   };

   return (
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
         <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder={t("catalog.searchPlaceholder")}
               className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-primary text-sm transition-all"
            />
         </div>

         <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((st) => (
               <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                     selectedStatus === st ? "bg-primary text-white shadow-xs" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
               >
                  {st === "all" ? t("orders.all") : (statusKeys[st] ? t(statusKeys[st]) : st)}
               </button>
            ))}
         </div>
      </div>
   );
}
