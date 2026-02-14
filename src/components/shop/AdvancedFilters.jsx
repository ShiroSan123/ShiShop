import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Tag } from "lucide-react";
import PriceRangeSlider from "./PriceRangeSlider";

const conditionOptions = [
  { value: "new", label: "Новое" },
  { value: "like_new", label: "Как новое" },
  { value: "good", label: "Хорошее" },
  { value: "fair", label: "Удовлетворительное" },
];

export default function AdvancedFilters({
  priceRange,
  onPriceRangeChange,
  conditions,
  onConditionsChange,
  discountOnly,
  onDiscountOnlyChange,
  onReset,
  minPrice = 0,
  maxPrice = 50000,
}) {
  const handleConditionToggle = (value) => {
    if (conditions.includes(value)) {
      onConditionsChange(conditions.filter((c) => c !== value));
    } else {
      onConditionsChange([...conditions, value]);
    }
  };

  const hasActiveFilters =
    priceRange[0] !== minPrice ||
    priceRange[1] !== maxPrice ||
    conditions.length > 0 ||
    discountOnly;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Фильтры</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-slate-600 hover:text-slate-900"
          >
            <X className="w-4 h-4 mr-1" />
            Сбросить
          </Button>
        )}
      </div>

      {/* Price Range */}
      <div>
        <PriceRangeSlider
          min={minPrice}
          max={maxPrice}
          value={priceRange}
          onChange={onPriceRangeChange}
        />
      </div>

      {/* Condition Filter */}
      <div>
        <Label className="text-sm font-medium text-slate-700 mb-3 block">
          Состояние товара
        </Label>
        <div className="space-y-3">
          {conditionOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={conditions.includes(option.value)}
                onCheckedChange={() => handleConditionToggle(option.value)}
              />
              <label
                htmlFor={option.value}
                className="text-sm text-slate-700 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Discount Filter */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="discount"
            checked={discountOnly}
            onCheckedChange={onDiscountOnlyChange}
          />
          <label
            htmlFor="discount"
            className="text-sm text-slate-700 cursor-pointer flex items-center gap-2"
          >
            <Tag className="w-4 h-4 text-red-500" />
            Только товары со скидкой
          </label>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-2">Активные фильтры:</p>
          <div className="flex flex-wrap gap-2">
            {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
              <Badge variant="secondary" className="text-xs">
                {priceRange[0]}-{priceRange[1]} ₽
              </Badge>
            )}
            {conditions.map((c) => (
              <Badge key={c} variant="secondary" className="text-xs">
                {conditionOptions.find((o) => o.value === c)?.label}
              </Badge>
            ))}
            {discountOnly && (
              <Badge
                variant="secondary"
                className="text-xs bg-red-500/10 text-red-600"
              >
                Со скидкой
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
