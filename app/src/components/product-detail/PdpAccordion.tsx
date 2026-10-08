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

function AccordionItem({ id, title, icon, children, defaultOpen = false }: AccordionItemProps) {
   const [isOpen, setIsOpen] = useState(defaultOpen);

   return (
      <div className="border-b border-gray-100 last:border-0">
         <button
            id={`accordion-${id}-btn`}
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            className="w-full flex items-center justify-between py-4 px-1 text-left hover:text-primary transition-colors duration-150 cursor-pointer group"
            aria-expanded={isOpen}
            aria-controls={`accordion-${id}-panel`}
         >
            <div className="flex items-center gap-2.5">
               <span className="text-primary/70 group-hover:text-primary transition-colors">{icon}</span>
               <span className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">{title}</span>
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
               isOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
            }`}
         >
            <div className="px-1 text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
         </div>
      </div>
   );
}

export function PdpAccordion({ product }: PdpAccordionProps) {
   const { t } = useLanguage();

   const hasSku = !!product.sku;
   const hasBarcode = !!product.barcode;

   return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-5 py-2">
         {/* Product Details & Specs */}
         <AccordionItem
            id="specs"
            title={t("productDetail.specsTitle")}
            icon={<Package size={16} />}
            defaultOpen
         >
            <div className="space-y-2">
               <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">
                     {t("productDetail.origin")}
                  </span>
                  <span className="font-semibold text-gray-800 text-xs">
                     {product.origin || t("productDetail.defaultOrigin")}
                  </span>
               </div>
               <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">
                     {t("productDetail.qualityLabel")}
                  </span>
                  <span className="font-semibold text-gray-800 text-xs">
                     {t("productDetail.qualityValue")}
                  </span>
               </div>
               <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                  <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">
                     {t("productDetail.category")}
                  </span>
                  <span className="font-semibold text-gray-800 text-xs">{product.category}</span>
               </div>
               {hasSku && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                     <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">
                        {t("productDetail.skuLabel")}
                     </span>
                     <span className="font-mono text-gray-700 text-xs">{product.sku}</span>
                  </div>
               )}
               {hasBarcode && (
                  <div className="flex justify-between items-center py-1.5">
                     <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">
                        {t("productDetail.barcodeLabel")}
                     </span>
                     <span className="font-mono text-gray-700 text-xs">{product.barcode}</span>
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
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>{t("productDetail.shippingPoint1")}</span>
               </li>
               <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>{t("productDetail.shippingPoint2")}</span>
               </li>
               <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>{t("productDetail.shippingPoint3")}</span>
               </li>
               <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold mt-0.5">ℹ</span>
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
               <p className="text-xs text-gray-500">{t("productDetail.portionsIntro")}</p>
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
                        className="p-2.5 bg-purple-50 rounded-xl border border-purple-100"
                     >
                        <span className="text-[11px] font-bold text-primary block">{item.amount}</span>
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
