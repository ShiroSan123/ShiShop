import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  filterProducts,
  updateProduct,
} from '@/lib/supabase/products';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cacheStrategies } from '@/components/providers/QueryProvider';

export default function AdminProductEdit() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const isEditing = !!productId;
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const products = await filterProducts({ id: productId });
      return products[0];
    },
    enabled: isEditing,
    ...cacheStrategies.admin,
  });

  const createMutation = useMutation({
    mutationFn: (data) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Товар создан');
      navigate(createPageUrl('AdminProducts'));
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      toast.error(`Ошибка при создании товара: ${message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Товар сохранён');
      navigate(createPageUrl('AdminProducts'));
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      toast.error(`Ошибка при сохранении: ${message}`);
    },
  });

  const handleSave = (data) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCancel = () => {
    navigate(createPageUrl('AdminProducts'));
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={createPageUrl('AdminProducts')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к товарам
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {isEditing ? 'Редактировать товар' : 'Новый товар'}
          </h1>
        </div>

        {/* Form */}
        <div className="max-w-2xl bg-card rounded-xl border border-border p-6 md:p-8">
          {isEditing && isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ProductForm
              product={isEditing ? product : null}
              onSave={handleSave}
              onCancel={handleCancel}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
