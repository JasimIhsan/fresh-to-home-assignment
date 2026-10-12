"use client";

import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { ALL_STATUSES } from "@/services/order.service";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";

const SEARCH_DEBOUNCE_MS = 300;
const MAX_QUERY_LENGTH = 100;

const STATUS_FILTERS = [
  { value: ALL_STATUSES, labelKey: "orders.all" },
  { value: "pending", labelKey: "orders.statusPending" },
  { value: "processing", labelKey: "orders.statusProcessing" },
  { value: "shipped", labelKey: "orders.statusShipped" },
  { value: "delivered", labelKey: "orders.statusDelivered" },
  { value: "cancelled", labelKey: "orders.statusCancelled" },
] as const;

/** Status and text filters synced to the URL (`?status=&q=`). */
export function AdminOrdersFilter() {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedStatus = searchParams.get("status") ?? ALL_STATUSES;
  const query = searchParams.get("q") ?? "";

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  const updateParam = (key: "status" | "q", value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (!value || value === ALL_STATUSES) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const handleSearchChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => updateParam("q", value.trim().slice(0, MAX_QUERY_LENGTH)),
      SEARCH_DEBOUNCE_MS
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-xs transition-opacity sm:flex-row sm:p-5",
        isPending && "opacity-70"
      )}
      aria-busy={isPending}
    >
      <div className="relative w-full sm:w-80">
        <Search
          size={18}
          className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          defaultValue={query}
          maxLength={MAX_QUERY_LENGTH}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t("catalog.searchPlaceholder")}
          aria-label={t("catalog.searchPlaceholder")}
          className="focus:border-primary w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm transition-all focus:bg-white focus:outline-hidden"
        />
      </div>

      <div className="no-scrollbar flex w-full gap-2 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
        {STATUS_FILTERS.map(({ value, labelKey }) => (
          <button
            key={value}
            type="button"
            onClick={() => updateParam("status", value)}
            aria-pressed={selectedStatus === value}
            className={cn(
              "cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all",
              selectedStatus === value
                ? "bg-primary text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
