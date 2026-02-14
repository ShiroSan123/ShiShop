import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";

import ProductCard from "@/components/shop/ProductCard";
import AdvancedFilters from "@/components/shop/AdvancedFilters";

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("-created_date", 100),
  });

  const { data: allReviews = [] } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: () => base44.entities.Review.list(),
  });

  const { minPrice, maxPrice } = useMemo(() => {
    const prices = products.map((p) => p.price || 0).filter((p) => p > 0);
    return {
      minPrice:
        prices.length > 0 ? Math.floor(Math.min(...prices) / 100) * 100 : 0,
      maxPrice:
        prices.length > 0 ? Math.ceil(Math.max(...prices) / 100) * 100 : 50000,
    };
  }, [products]);

  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [conditions, setConditions] = useState([]);
  const [discountOnly, setDiscountOnly] = useState(false);

  React.useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || p.category === category;
      const matchesPrice =
        (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1];
      const matchesCondition =
        conditions.length === 0 || conditions.includes(p.condition);
      const matchesDiscount =
        !discountOnly || (p.old_price && p.old_price > p.price);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesCondition &&
        matchesDiscount
      );
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
      if (sortBy === "rating") {
        const aReviews = allReviews.filter((r) => r.product_id === a.id);
        const bReviews = allReviews.filter((r) => r.product_id === b.id);
        const aRating =
          aReviews.length > 0
            ? aReviews.reduce((sum, r) => sum + r.rating, 0) / aReviews.length
            : 0;
        const bRating =
          bReviews.length > 0
            ? bReviews.reduce((sum, r) => sum + r.rating, 0) / bReviews.length
            : 0;
        return bRating - aRating;
      }
      return 0;
    });

  const resetFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setConditions([]);
    setDiscountOnly(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Каталог
          </h1>
          <p className="text-slate-600 text-lg">Все товары в одном месте</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Advanced Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden lg:block"
          >
            <AdvancedFilters
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              conditions={conditions}
              onConditionsChange={setConditions}
              discountOnly={discountOnly}
              onDiscountOnlyChange={setDiscountOnly}
              onReset={resetFilters}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </motion.div>

          <div className="lg:col-span-3">
            {/* Search & Quick Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Поиск товаров..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-slate-200"
                  />
                  {search && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                      onClick={() => setSearch("")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Category Filter */}
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-slate-200">
                    <SelectValue placeholder="Категория" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    <SelectItem value="personal">Личные вещи</SelectItem>
                    <SelectItem value="china">Из Китая</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filters Toggle */}
                <Button
                  variant="outline"
                  className="lg:hidden h-12 rounded-xl"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Фильтры
                </Button>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48 h-12 rounded-xl border-slate-200">
                    <SelectValue placeholder="Сортировка" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Сначала новые</SelectItem>
                    <SelectItem value="price_asc">Сначала дешёвые</SelectItem>
                    <SelectItem value="price_desc">Сначала дорогие</SelectItem>
                    <SelectItem value="rating">По рейтингу</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-8"
              >
                <AdvancedFilters
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  conditions={conditions}
                  onConditionsChange={setConditions}
                  discountOnly={discountOnly}
                  onDiscountOnlyChange={setDiscountOnly}
                  onReset={resetFilters}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                />
              </motion.div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-slate-600">
                Найдено товаров:{" "}
                <span className="font-semibold text-slate-900">
                  {filteredProducts.length}
                </span>
              </p>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-80 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Ничего не найдено
                </h3>
                <p className="text-slate-600">
                  Попробуйте изменить параметры поиска
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
