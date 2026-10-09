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

export function PdpWeightSelector({
  weight,
  onWeightChange,
  pricePerKg,
}: PdpWeightSelectorProps) {
  const { t } = useLanguage();

  const decrease = () => {
    if (weight > 0.5) onWeightChange(Number((weight - 0.5).toFixed(1)));
  };
  const increase = () => onWeightChange(Number((weight + 0.5).toFixed(1)));

  const calculatedPrice = (pricePerKg * weight).toFixed(2).replace(".", ",");

  return (
    <div className="space-y-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      {/* Section Label */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold tracking-tight text-gray-900">
            {t("productDetail.weightSelection")}
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">
            {t("productDetail.selectWeightKg")}
          </p>
        </div>
        {weight === DEFAULT_WEIGHT && (
          <span className="text-primary bg-primary/8 border-primary/15 rounded-full border px-2.5 py-1 text-[10px] font-bold">
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
              className={`cursor-pointer rounded-2xl py-2.5 text-center text-xs font-bold transition-all duration-200 select-none ${
                isSelected
                  ? "bg-primary shadow-primary/25 ring-primary/30 scale-[1.04] text-white shadow-lg ring-2"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
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
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-3">
        <span className="text-xs font-semibold text-gray-500">
          {t("productDetail.weightSelection")}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={decrease}
            disabled={weight <= 0.5}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Decrease weight"
          >
            <Minus size={16} strokeWidth={2.5} />
          </button>
          <span className="min-w-16 text-center text-sm font-extrabold text-gray-900 tabular-nums">
            {weight.toFixed(1).replace(".", ",")} kg
          </span>
          <button
            type="button"
            onClick={increase}
            className="bg-primary shadow-primary/30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-white shadow-md transition-all duration-150 hover:bg-purple-700 active:scale-90"
            aria-label="Increase weight"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Live Price Breakdown */}
      <div className="flex items-center justify-between rounded-2xl border border-purple-100 bg-linear-to-r from-purple-50 to-violet-50 px-4 py-3.5">
        <div>
          <span className="block text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
            {t("productDetail.totalPrice")}
          </span>
          <span className="mt-0.5 block text-xs font-medium text-purple-700/70">
            {weight.toFixed(1).replace(".", ",")} kg ×{" "}
            {pricePerKg.toFixed(2).replace(".", ",")} €
          </span>
        </div>
        <span className="text-primary text-2xl font-black tabular-nums">
          {calculatedPrice} €
        </span>
      </div>
    </div>
  );
}
