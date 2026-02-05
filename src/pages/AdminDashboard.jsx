import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { listProducts } from '@/lib/supabase/products';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react';
import { cacheStrategies } from '@/components/providers/QueryProvider';

export default function AdminDashboard() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'admin'],
    queryFn: () => listProducts('-created_date'),
    ...cacheStrategies.adminStats,
  });

  const stats = {
    total: products.length,
    available: products.filter(p => p.status === 'available').length,
    sold: products.filter(p => p.status === 'sold').length,
    preorder: products.filter(p => p.status === 'preorder').length,
  };

  const recentProducts = products.slice(0, 5);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Дашборд</h1>
          <p className="text-muted-foreground mt-1">Обзор вашего магазина</p>
          </div>
          <Link to={createPageUrl('AdminProductEdit')}>
            <Button className="h-11 px-6 gap-2">
              <Plus className="w-4 h-4" />
              Добавить товар
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Всего товаров</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {isLoading ? '—' : stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Package className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">В наличии</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">
                    {isLoading ? '—' : stats.available}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Продано</p>
                  <p className="text-3xl font-bold text-muted-foreground mt-1">
                    {isLoading ? '—' : stats.sold}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Под заказ</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">
                    {isLoading ? '—' : stats.preorder}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Последние товары</CardTitle>
            <Link to={createPageUrl('AdminProducts')}>
              <Button variant="ghost" size="sm" className="gap-2">
                Все товары
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 bg-muted rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-1/4 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentProducts.length > 0 ? (
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={createPageUrl(`AdminProductEdit?id=${product.id}`)}
                    className="flex items-center gap-4 p-3 -mx-3 rounded-xl hover:bg-muted/60 transition-colors"
                  >
                    <img 
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&q=80'} 
                      alt="" 
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.price?.toLocaleString('ru-RU')} ₽ • {product.type === 'personal' ? 'Личное' : 'Китай'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      product.status === 'available'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                        : product.status === 'sold'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                    }`}>
                      {product.status === 'available' ? 'В наличии' : 
                       product.status === 'sold' ? 'Продано' : 'Под заказ'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Товаров пока нет</p>
                <Link to={createPageUrl('AdminProductEdit')}>
                  <Button>Добавить первый товар</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
