"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Minus, Plus } from "lucide-react";

const WEIGHT_PRESETS = [0.5, 1.0, 1.5, 2.0, 3.0];
const DEFAULT_WEIGHT = 1.0;

interface PdpWeightSelectorProps {
   weight: number;
   onWeightChange: (w: number) => void;
   pricePerKg: number;
}

export function PdpWeightSelector({ weight, onWeightChange, pricePerKg }: PdpWeightSelectorProps) {
   const { t } = useLanguage();

   const decrease = () => {
      if (weight > 0.5) onWeightChange(Number((weight - 0.5).toFixed(1)));
   };
   const increase = () => onWeightChange(Number((weight + 0.5).toFixed(1)));

   const calculatedPrice = (pricePerKg * weight).toFixed(2).replace(".", ",");

   return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-5">
         {/* Section Label */}
         <div className="flex items-center justify-between">
            <div>
               <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
                  {t("productDetail.weightSelection")}
               </h3>
               <p className="text-xs text-gray-400 mt-0.5">
                  {t("productDetail.selectWeightKg")}
               </p>
            </div>
            {weight === DEFAULT_WEIGHT && (
               <span className="text-[10px] font-bold text-primary bg-primary/8 border border-primary/15 px-2.5 py-1 rounded-full">
                  {t("productDetail.popularBadge")}
               </span>
            )}
         </div>

         {/* Preset Pills */}
         <div className="grid grid-cols-5 gap-2">
            {WEIGHT_PRESETS.map((preset) => {
               const isSelected = weight === preset;
               return (
                  <button
                     key={preset}
                     type="button"
                     onClick={() => onWeightChange(preset)}
                     className={`py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer text-center select-none ${
                        isSelected
                           ? "bg-primary text-white shadow-lg shadow-primary/25 scale-[1.04] ring-2 ring-primary/30"
                           : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                     }`}
                     aria-pressed={isSelected}
                     aria-label={`${preset} kg`}
                  >
                     {preset.toFixed(1).replace(".", ",")} kg
                  </button>
               );
            })}
         </div>

         {/* Fine-Tune Stepper */}
         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-xs font-semibold text-gray-500">
               {t("productDetail.weightSelection")}
            </span>
            <div className="flex items-center gap-2">
               <button
                  type="button"
                  onClick={decrease}
                  disabled={weight <= 0.5}
                  className="w-11 h-11 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer shadow-xs"
                  aria-label="Decrease weight"
               >
                  <Minus size={16} strokeWidth={2.5} />
               </button>
               <span className="font-extrabold text-gray-900 min-w-16 text-center text-sm tabular-nums">
                  {weight.toFixed(1).replace(".", ",")} kg
               </span>
               <button
                  type="button"
                  onClick={increase}
                  className="w-11 h-11 rounded-xl bg-primary hover:bg-purple-700 text-white flex items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer shadow-md shadow-primary/30"
                  aria-label="Increase weight"
               >
                  <Plus size={16} strokeWidth={2.5} />
               </button>
            </div>
         </div>

         {/* Live Price Breakdown */}
         <div className="flex items-center justify-between px-4 py-3.5 bg-linear-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
            <div>
               <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest block">
                  {t("productDetail.totalPrice")}
               </span>
               <span className="text-xs text-purple-700/70 font-medium mt-0.5 block">
                  {weight.toFixed(1).replace(".", ",")} kg × {pricePerKg.toFixed(2).replace(".", ",")} €
               </span>
            </div>
            <span className="text-2xl font-black text-primary tabular-nums">
               {calculatedPrice} €
            </span>
         </div>
      </div>
   );
}
