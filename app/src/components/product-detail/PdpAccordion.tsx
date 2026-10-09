"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ChevronDown, Package, RefreshCcw, Ruler } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types";

interface PdpAccordionProps {
  product: Product;
}

interface AccordionItemProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({
  id,
  title,
  icon,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        id={`accordion-${id}-btn`}
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="hover:text-primary group flex w-full cursor-pointer items-center justify-between px-1 py-4 text-left transition-colors duration-150"
        aria-expanded={isOpen}
        aria-controls={`accordion-${id}-panel`}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-primary/70 group-hover:text-primary transition-colors">
            {icon}
          </span>
          <span className="group-hover:text-primary text-sm font-bold text-gray-800 transition-colors">
            {title}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id={`accordion-${id}-panel`}
        role="region"
        aria-labelledby={`accordion-${id}-btn`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2 px-1 text-sm leading-relaxed text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}

export function PdpAccordion({ product }: PdpAccordionProps) {
  const { t } = useLanguage();

  const hasSku = !!product.sku;
  const hasBarcode = !!product.barcode;

  return (
    <div className="rounded-3xl border border-gray-100 bg-white px-5 py-2 shadow-sm">
      {/* Product Details & Specs */}
      <AccordionItem
        id="specs"
        title={t("productDetail.specsTitle")}
        icon={<Package size={16} />}
        defaultOpen
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-gray-50 py-1.5">
            <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
              {t("productDetail.origin")}
            </span>
            <span className="text-xs font-semibold text-gray-800">
              {product.origin || t("productDetail.defaultOrigin")}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-50 py-1.5">
            <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
              {t("productDetail.qualityLabel")}
            </span>
            <span className="text-xs font-semibold text-gray-800">
              {t("productDetail.qualityValue")}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-50 py-1.5">
            <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
              {t("productDetail.category")}
            </span>
            <span className="text-xs font-semibold text-gray-800">
              {product.category}
            </span>
          </div>
          {hasSku && (
            <div className="flex items-center justify-between border-b border-gray-50 py-1.5">
              <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                {t("productDetail.skuLabel")}
              </span>
              <span className="font-mono text-xs text-gray-700">
                {product.sku}
              </span>
            </div>
          )}
          {hasBarcode && (
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                {t("productDetail.barcodeLabel")}
              </span>
              <span className="font-mono text-xs text-gray-700">
                {product.barcode}
              </span>
            </div>
          )}
        </div>
      </AccordionItem>

      {/* Shipping & Returns */}
      <AccordionItem
        id="shipping"
        title={t("productDetail.shippingTitle")}
        icon={<RefreshCcw size={16} />}
      >
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 font-bold text-emerald-500">✓</span>
            <span>{t("productDetail.shippingPoint1")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 font-bold text-emerald-500">✓</span>
            <span>{t("productDetail.shippingPoint2")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 font-bold text-emerald-500">✓</span>
            <span>{t("productDetail.shippingPoint3")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 font-bold text-blue-500">ℹ</span>
            <span>{t("productDetail.shippingPoint4")}</span>
          </li>
        </ul>
      </AccordionItem>

      {/* Portion Guide */}
      <AccordionItem
        id="portions"
        title={t("productDetail.portionsTitle")}
        icon={<Ruler size={16} />}
      >
        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            {t("productDetail.portionsIntro")}
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              {
                label: t("productDetail.portion1Person"),
                amount: t("productDetail.portion1Amount"),
              },
              {
                label: t("productDetail.portion2Person"),
                amount: t("productDetail.portion2Amount"),
              },
              {
                label: t("productDetail.portion4Person"),
                amount: t("productDetail.portion4Amount"),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-purple-100 bg-purple-50 p-2.5"
              >
                <span className="text-primary block text-[11px] font-bold">
                  {item.amount}
                </span>
                <span className="text-[10px] text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 italic">
            {t("productDetail.portionsNote")}
          </p>
        </div>
      </AccordionItem>
    </div>
  );
}
