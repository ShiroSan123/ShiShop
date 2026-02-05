import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteProduct,
  listProducts,
  updateProduct,
} from '@/lib/supabase/products';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, MoreHorizontal, Pencil, Trash2, CheckCircle, 
  ExternalLink, Package 
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cacheStrategies } from '@/components/providers/QueryProvider';

const statusConfig = {
  available: {
    label: 'В наличии',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
  sold: {
    label: 'Продано',
    className: 'bg-muted text-muted-foreground',
  },
  preorder: {
    label: 'Под заказ',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  },
};

const typeConfig = {
  personal: {
    label: 'Личное',
    className: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  },
  china: {
    label: 'Китай',
    className: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  },
};

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'admin'],
    queryFn: () => listProducts('-created_date'),
    ...cacheStrategies.admin,
  });

  /** @type {import("@tanstack/react-query").UseMutationResult<any, any, { id: string, data: any }, any>} */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Товар обновлён');
    },
  });

  /** @type {import("@tanstack/react-query").UseMutationResult<any, any, string, any>} */
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Товар удалён');
    },
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(s) ||
        p.slug?.toLowerCase().includes(s)
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter(p => p.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    return result;
  }, [products, search, typeFilter, statusFilter]);

  const markAsSold = (product) => {
    updateMutation.mutate({ id: product.id, data: { status: 'sold' } });
  };

  const handleDelete = (product) => {
    if (window.confirm(`Удалить "${product.title}"?`)) {
      deleteMutation.mutate(product.id);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Товары</h1>
            <p className="text-muted-foreground mt-1">{filteredProducts.length} товаров</p>
          </div>
          <Link to={createPageUrl('AdminProductEdit')}>
            <Button className="h-11 px-6 gap-2">
              <Plus className="w-4 h-4" />
              Добавить товар
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
            <Input
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-background"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] h-11">
              <SelectValue placeholder="Тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="personal">Личное</SelectItem>
              <SelectItem value="china">Китай</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-11">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="available">В наличии</SelectItem>
              <SelectItem value="preorder">Под заказ</SelectItem>
              <SelectItem value="sold">Продано</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Фото</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(10)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="w-10 h-10 bg-muted rounded-lg animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded w-32 animate-pulse" /></TableCell>
                    <TableCell><div className="h-6 bg-muted rounded w-16 animate-pulse" /></TableCell>
                    <TableCell><div className="h-6 bg-muted rounded w-20 animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded w-16 animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded w-20 animate-pulse" /></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img 
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&q=80'} 
                        alt="" 
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{product.title}</div>
                      <div className="text-sm text-muted-foreground">{product.slug}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${typeConfig[product.type]?.className} border-0`}>
                        {typeConfig[product.type]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusConfig[product.status]?.className} border-0`}>
                        {statusConfig[product.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.price?.toLocaleString('ru-RU')} ₽
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {product.created_date && format(new Date(product.created_date), 'd MMM yyyy', { locale: ru })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link to={createPageUrl(`AdminProductEdit?id=${product.id}`)}>
                            <DropdownMenuItem>
                              <Pencil className="w-4 h-4 mr-2" />
                              Редактировать
                            </DropdownMenuItem>
                          </Link>
                          <Link to={createPageUrl(`ProductPage?slug=${product.slug}`)} target="_blank">
                            <DropdownMenuItem>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Открыть на сайте
                            </DropdownMenuItem>
                          </Link>
                          {product.status !== 'sold' && (
                            <DropdownMenuItem onClick={() => markAsSold(product)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Отметить продано
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(product)}
                          className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Товаров не найдено</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
