import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { filterProducts } from '@/lib/supabase/products';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Package, Clock } from 'lucide-react';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductCard from '@/components/shop/ProductCard';
import { cacheStrategies } from '@/components/providers/QueryProvider';

const statusConfig = {
  available: {
    label: 'В наличии',
    className:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30',
    icon: Package,
  },
  sold: {
    label: 'Продано',
    className: 'bg-muted text-muted-foreground border-border',
    icon: Package,
  },
  preorder: {
    label: 'Под заказ',
    className:
      'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30',
    icon: Clock,
  },
};

const typeConfig = {
  personal: { label: 'Личные вещи', href: 'ShopPersonal' },
  china: { label: 'Товары из Китая', href: 'ShopChina' }
};

export default function ProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => filterProducts({ slug }),
    enabled: !!slug,
    ...cacheStrategies.productPage,
  });

  const product = products[0];

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related', product?.type, product?.id],
    queryFn: () =>
      filterProducts(
        { type: product.type, status: 'available' },
        '-created_date',
        5
      ),
    enabled: !!product,
    ...cacheStrategies.publicCatalog,
  });

  const filteredRelated = relatedProducts.filter(p => p.id !== product?.id).slice(0, 4);

  if (isLoading) {
  return (
    <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-muted rounded mb-8" />
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-muted rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Товар не найден</h2>
          <Link to={createPageUrl('Shop')}>
            <Button>Вернуться в каталог</Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[product.status] || statusConfig.available;
  const type = typeConfig[product.type];
  const isSold = product.status === 'sold';

  const telegramMessage = encodeURIComponent(
    `Привет! Интересует товар: ${product.title}\n${window.location.href}`
  );
  const telegramLink = `https://t.me/username?text=${telegramMessage}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to={createPageUrl(type.href)} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{type.label}</span>
          </Link>
        </div>

        {/* Product details */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <ProductGallery images={product.images} />

          {/* Info */}
          <div className="lg:py-4">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className={`${status.className} border`}>
                {status.label}
              </Badge>
              <Badge className="bg-muted text-muted-foreground border-0">
                {type.label}
              </Badge>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {product.title}
            </h1>

            <p className={`text-3xl md:text-4xl font-bold mb-6 ${isSold ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {product.price?.toLocaleString('ru-RU')} ₽
            </p>

            {product.description && (
              <div className="prose dark:prose-invert max-w-none mb-8">
                <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {/* CTA */}
            {!isSold && (
              <a href={telegramLink} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-14 px-8 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-base font-medium gap-3"
                >
                  <Send className="w-5 h-5" />
                  Написать в Telegram
                </Button>
              </a>
            )}

            {isSold && (
              <div className="p-4 bg-muted rounded-xl border border-border">
                <p className="text-muted-foreground text-center">
                  Этот товар уже продан. Посмотрите другие предложения в каталоге.
                </p>
              </div>
            )}

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Категория</p>
                <p className="font-medium text-foreground">{type.label}</p>
              </div>
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Статус</p>
                <p className="font-medium text-foreground">{status.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {filteredRelated.length > 0 && (
          <section className="mt-16 md:mt-24 pt-16 border-t">
            <h2 className="text-2xl font-bold text-foreground mb-8">Похожие товары</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {filteredRelated.map((p) => (
                <ProductCard key={p.id} product={p} showType={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
