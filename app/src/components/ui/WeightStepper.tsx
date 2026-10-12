"use client";

import { Minus, Plus } from "lucide-react";

interface WeightStepperProps {
  weight: number;
  onChange: (newWeight: number) => void;
}

export function WeightStepper({
  weight,
  onChange,
}: Readonly<WeightStepperProps>) {
  const step = 0.5;

  const handleDecrease = () => {
    if (weight > step) onChange(weight - step);
  };

  const handleIncrease = () => {
    onChange(weight + step);
  };

  return (
    <div className="bg-primary-light flex items-center space-x-4 rounded-full px-4 py-2">
      <button
        onClick={handleDecrease}
        className="text-primary hover:opacity-80 disabled:opacity-50"
        disabled={weight <= step}
      >
        <Minus size={20} />
      </button>
      <span className="text-primary min-w-16 text-center font-semibold">
        {weight.toFixed(1).replace(".", ",")} kg
      </span>
      <button
        onClick={handleIncrease}
        className="text-primary hover:opacity-80"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
