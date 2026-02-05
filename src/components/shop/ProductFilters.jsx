import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function ProductFilters({ 
  filters, 
  onFilterChange, 
  showTypeFilter = true 
}) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      type: 'all',
      status: 'all',
      sort: 'newest'
    });
  };

  const hasActiveFilters = filters.search || 
    (showTypeFilter && filters.type !== 'all') || 
    filters.status !== 'all';

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
        <Input
          placeholder="Поиск товаров..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="pl-12 h-12 rounded-xl bg-background"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Фильтры:</span>
        </div>

        {showTypeFilter && (
          <Select value={filters.type} onValueChange={(v) => handleChange('type', v)}>
            <SelectTrigger className="w-[140px] h-10 rounded-xl bg-background">
              <SelectValue placeholder="Тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все товары</SelectItem>
              <SelectItem value="personal">Личные вещи</SelectItem>
              <SelectItem value="china">Из Китая</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select value={filters.status} onValueChange={(v) => handleChange('status', v)}>
          <SelectTrigger className="w-[140px] h-10 rounded-xl bg-background">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Любой статус</SelectItem>
            <SelectItem value="available">В наличии</SelectItem>
            <SelectItem value="preorder">Под заказ</SelectItem>
            <SelectItem value="sold">Продано</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sort} onValueChange={(v) => handleChange('sort', v)}>
          <SelectTrigger className="w-[160px] h-10 rounded-xl bg-background">
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Сначала новые</SelectItem>
            <SelectItem value="price_asc">Цена ↑</SelectItem>
            <SelectItem value="price_desc">Цена ↓</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Сбросить
          </Button>
        )}
      </div>
    </div>
  );
}
