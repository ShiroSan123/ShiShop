import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function PriceRangeSlider({ min, max, value, onChange }) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-slate-700">
        Цена: {value[0].toLocaleString("ru-RU")} ₽ -{" "}
        {value[1].toLocaleString("ru-RU")} ₽
      </Label>
      <Slider
        min={min}
        max={max}
        step={100}
        value={value}
        onValueChange={onChange}
        className="w-full"
      />
    </div>
  );
}
