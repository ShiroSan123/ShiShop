import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { filterProducts } from '@/lib/supabase/products';
import ProductCard from '@/components/shop/ProductCard';
import ProductFilters from '@/components/shop/ProductFilters';
import { Button } from "@/components/ui/button";
import { Package } from 'lucide-react';
import { cacheStrategies } from '@/components/providers/QueryProvider';

export default function ShopPersonal() {
  const [filters, setFilters] = useState({
    search: '',
    type: 'personal',
    status: 'all',
    sort: 'newest'
  });
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products', 'personal'],
    queryFn: () => filterProducts({ type: 'personal' }, '-created_date'),
    ...cacheStrategies.publicCatalog,
  });

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }

    if (filters.status !== 'all') {
      result = result.filter(p => p.status === filters.status);
    }

    switch (filters.sort) {
      case 'price_asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_date).getTime() -
            new Date(a.created_date).getTime()
        );
    }

    return result;
  }, [allProducts, filters]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-rose-600 dark:text-rose-300" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Личные вещи</h1>
          </div>
          <p className="text-muted-foreground">
            {filteredProducts.length} товаров — одежда, аксессуары и другие вещи в отличном состоянии
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ProductFilters 
            filters={filters} 
            onFilterChange={setFilters}
            showTypeFilter={false}
          />
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] rounded-2xl bg-muted" />
                <div className="mt-4 h-4 bg-muted rounded w-3/4" />
                <div className="mt-2 h-5 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : visibleProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} showType={false} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="rounded-xl h-12 px-8"
                >
                  Показать ещё
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить фильтры</p>
          </div>
        )}
      </div>
    </div>
  );
}
