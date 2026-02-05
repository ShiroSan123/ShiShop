import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadProductImage } from '@/lib/supabase/storage';
import { X, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductForm({ product, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState({
    title: product?.title || '',
    slug: product?.slug || '',
    type: product?.type || 'personal',
    status: product?.status || 'available',
    price: product?.price || '',
    description: product?.description || '',
    images: product?.images || [],
  });
  const [isUploading, setIsUploading] = useState(false);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-zа-яё0-9\s-]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50) + '-' + Date.now().toString(36);
  };

  const handleTitleChange = (value) => {
    setForm(prev => ({
      ...prev,
      title: value,
      slug: !product ? generateSlug(value) : prev.slug
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    try {
      const uploadPromises = files.map((file) => uploadProductImage(file));
      const urls = await Promise.all(uploadPromises);
      
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
      toast.success('Фото загружены');
    } catch (error) {
      toast.error('Ошибка загрузки фото');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      toast.error('Заполните название и цену');
      return;
    }
    onSave({
      ...form,
      price: Number(form.price),
      slug: form.slug || generateSlug(form.title)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Название *</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Например: iPhone 14 Pro Max"
          className="h-12"
        />
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">URL-slug</Label>
        <Input
          id="slug"
          value={form.slug}
          onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
          placeholder="iphone-14-pro-max"
          className="h-12 font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">Генерируется автоматически из названия</p>
      </div>

      {/* Type & Status */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Тип *</Label>
          <Select value={form.type} onValueChange={(v) => setForm(prev => ({ ...prev, type: v }))}>
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Личные вещи</SelectItem>
              <SelectItem value="china">Товары из Китая</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Статус *</Label>
          <Select value={form.status} onValueChange={(v) => setForm(prev => ({ ...prev, status: v }))}>
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">В наличии</SelectItem>
              <SelectItem value="preorder">Под заказ</SelectItem>
              <SelectItem value="sold">Продано</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Цена (₽) *</Label>
        <Input
          id="price"
          type="number"
          value={form.price}
          onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
          placeholder="1500"
          className="h-12"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Опишите товар подробнее..."
          rows={5}
        />
      </div>

      {/* Images */}
      <div className="space-y-4">
        <Label>Фотографии</Label>
        
        <div className="flex flex-wrap gap-4">
          {form.images.map((url, idx) => (
            <div key={idx} className="relative group">
              <img 
                src={url} 
                alt="" 
                className="w-24 h-24 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          <label className="w-24 h-24 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-foreground/40 transition-colors">
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            ) : (
              <>
                <Plus className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">Добавить</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isSaving} className="h-12 px-8">
          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {product ? 'Сохранить' : 'Создать товар'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="h-12 px-8">
          Отмена
        </Button>
      </div>
    </form>
  );
}
