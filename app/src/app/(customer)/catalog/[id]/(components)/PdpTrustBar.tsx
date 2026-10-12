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
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid grid-cols-2 gap-3 divide-y divide-gray-100 sm:grid-cols-4 sm:gap-4 sm:divide-x sm:divide-y-0">
        {trustItems.map((item, index) => (
          <div
            key={item.label}
            className={`flex flex-col items-center gap-1.5 p-2 text-center transition-all duration-200 sm:px-3 sm:py-1 ${
              index >= 2 ? "pt-3 sm:pt-1" : ""
            }`}
          >
            <div className="mb-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
              {item.icon}
            </div>
            <span className="text-xs leading-tight font-bold text-gray-800">
              {item.label}
            </span>
            <span className="text-[11px] leading-tight font-medium text-gray-500">
              {item.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
