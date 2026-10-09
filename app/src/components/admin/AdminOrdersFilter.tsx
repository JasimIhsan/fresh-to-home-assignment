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
    <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-xs sm:flex-row sm:p-5">
      <div className="relative w-full sm:w-80">
        <Search
          size={18}
          className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("catalog.searchPlaceholder")}
          className="focus:border-primary w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm transition-all focus:bg-white focus:outline-hidden"
        />
      </div>

      <div className="no-scrollbar flex w-full gap-2 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
        {[
          "all",
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
              selectedStatus === st
                ? "bg-primary text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {st === "all"
              ? t("orders.all")
              : statusKeys[st]
                ? t(statusKeys[st])
                : st}
          </button>
        ))}
      </div>
    </div>
  );
}
