import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { filterProducts } from '@/lib/supabase/products';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Package, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { cacheStrategies } from '@/components/providers/QueryProvider';

export default function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'latest'],
    queryFn: () => filterProducts({ status: 'available' }, '-created_date', 8),
    ...cacheStrategies.publicCatalog,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-500/20 dark:to-amber-500/10 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-500/20 dark:to-emerald-500/10 rounded-full blur-3xl opacity-60" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Уникальные находки и личные вещи</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              Добро пожаловать в{' '}
              <span className="bg-gradient-to-r from-foreground via-foreground/70 to-foreground bg-clip-text text-transparent">
                ShiShop
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Личные вещи в отличном состоянии и тщательно отобранные товары из Китая. 
              Всё проверено, всё качественно.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('ShopPersonal')}>
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium gap-2">
                  <Package className="w-5 h-5" />
                  Личные вещи
                </Button>
              </Link>
              <Link to={createPageUrl('ShopChina')}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-xl text-base font-medium gap-2 border-2">
                  <ShoppingBag className="w-5 h-5" />
                  Товары из Китая
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Последние поступления</h2>
            <p className="text-muted-foreground mt-2">Свежие товары в каталоге</p>
          </div>
          <Link to={createPageUrl('Shop')}>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              Все товары
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] rounded-2xl bg-muted" />
                <div className="mt-4 h-4 bg-muted rounded w-3/4" />
                <div className="mt-2 h-5 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Товары скоро появятся</p>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-muted py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            Выберите категорию
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              to={createPageUrl('ShopPersonal')}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-500/15 dark:to-amber-500/10 p-8 md:p-12 transition-transform hover:-translate-y-1"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-500/25 flex items-center justify-center mb-6">
                  <Package className="w-7 h-7 text-rose-600 dark:text-rose-200" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Личные вещи</h3>
                <p className="text-muted-foreground mb-6">Одежда, аксессуары и другие вещи в отличном состоянии</p>
                <span className="inline-flex items-center gap-2 text-foreground font-medium group-hover:gap-3 transition-all">
                  Смотреть
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link 
              to={createPageUrl('ShopChina')}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-sky-500/15 dark:to-emerald-500/10 p-8 md:p-12 transition-transform hover:-translate-y-1"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-500/25 flex items-center justify-center mb-6">
                  <ShoppingBag className="w-7 h-7 text-sky-600 dark:text-sky-200" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Товары из Китая</h3>
                <p className="text-muted-foreground mb-6">Проверенные находки с маркетплейсов по выгодным ценам</p>
                <span className="inline-flex items-center gap-2 text-foreground font-medium group-hover:gap-3 transition-all">
                  Смотреть
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
