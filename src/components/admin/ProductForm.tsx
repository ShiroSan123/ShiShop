"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/ToastProvider";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/dataClient";
import { PRODUCT_STATUS_LABELS, PRODUCT_TYPE_LABELS } from "@/lib/labels";
import { ProductInputSchema } from "@/lib/schemas";
import { type Product, type ProductStatus, type ProductType } from "@/lib/types";
import { slugify } from "@/lib/utils";

interface ProductFormProps {
  mode: "create" | "edit";
  initial?: Product;
}

export const ProductForm = ({ mode, initial }: ProductFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>(
    initial?.images.length ? initial.images : [""]
  );
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    type: (initial?.type ?? "personal") as ProductType,
    status: (initial?.status ?? "available") as ProductStatus,
    price: initial?.price ? String(initial.price) : "",
    description: initial?.description ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const payload = useMemo(() => {
    const priceValue =
      form.price.trim() === "" ? Number.NaN : Number(form.price);
    return {
      title: form.title.trim(),
      slug: form.slug.trim(),
      type: form.type,
      status: form.status,
      price: priceValue,
      currency: "RUB" as const,
      description: form.description.trim(),
      images: images.map((value) => value.trim()).filter(Boolean),
    };
  }, [form, images]);

  const validate = () => {
    const parsed = ProductInputSchema.safeParse(payload);
    if (parsed.success) {
      setErrors({});
      return parsed.data;
    }

    const fieldErrors: Record<string, string> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0] as string | undefined;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    });
    setErrors(fieldErrors);
    return null;
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    const data = validate();
    if (!data) {
      toast({
        title: "Проверьте форму",
        description: "Заполните обязательные поля.",
        variant: "error",
      });
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        await createProduct(data);
        toast({ title: "Товар добавлен", variant: "success" });
      } else if (initial) {
        await updateProduct(initial.id, data);
        toast({ title: "Изменения сохранены", variant: "success" });
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка";
      toast({ title: "Не удалось сохранить", description: message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initial) return;
    const confirmDelete = window.confirm(
      `Удалить товар «${initial.title}»? Это действие нельзя отменить.`
    );
    if (!confirmDelete) return;

    setSaving(true);
    try {
      await deleteProduct(initial.id);
      toast({ title: "Товар удалён", variant: "success" });
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка";
      toast({ title: "Не удалось удалить", description: message, variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    setImages((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  };

  const addImageField = () => {
    setImages((prev) => [...prev, ""]);
  };

  const removeImageField = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSlugGenerate = () => {
    setForm((prev) => ({ ...prev, slug: slugify(prev.title) }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="surface-card space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs text-slate-500">Название</label>
            <Input
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Например, Винтажная камера"
            />
            {errors.title ? (
              <div className="text-xs text-rose-500">{errors.title}</div>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-500">Slug</label>
            <div className="flex gap-2">
              <Input
                value={form.slug}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, slug: event.target.value }))
                }
                placeholder="slug"
              />
              <Button type="button" variant="secondary" onClick={handleSlugGenerate}>
                Сгенерировать
              </Button>
            </div>
            {errors.slug ? (
              <div className="text-xs text-rose-500">{errors.slug}</div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-xs text-slate-500">Тип</label>
            <Select
              value={form.type}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  type: event.target.value as ProductType,
                }))
              }
            >
              {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map((type) => (
                <option key={type} value={type}>
                  {PRODUCT_TYPE_LABELS[type]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-500">Статус</label>
            <Select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  status: event.target.value as ProductStatus,
                }))
              }
            >
              {(Object.keys(PRODUCT_STATUS_LABELS) as ProductStatus[]).map(
                (status) => (
                  <option key={status} value={status}>
                    {PRODUCT_STATUS_LABELS[status]}
                  </option>
                )
              )}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-500">Цена (RUB)</label>
            <Input
              type="number"
              min={0}
              value={form.price}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, price: event.target.value }))
              }
              placeholder="0"
            />
            {errors.price ? (
              <div className="text-xs text-rose-500">{errors.price}</div>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-500">Описание</label>
          <Textarea
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Подробности о товаре"
          />
          {errors.description ? (
            <div className="text-xs text-rose-500">{errors.description}</div>
          ) : null}
        </div>
      </div>

      <div className="surface-card space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Изображения
            </h3>
            <p className="text-xs text-slate-500">Добавьте ссылки на изображения</p>
          </div>
          <Button type="button" variant="secondary" onClick={addImageField}>
            Добавить фото
          </Button>
        </div>

        <div className="space-y-3">
          {images.map((image, index) => (
            <div key={`image-${index}`} className="grid gap-3 md:grid-cols-[1fr_auto]">
              <Input
                value={image}
                onChange={(event) => handleImageChange(index, event.target.value)}
                placeholder="https://..."
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeImageField(index)}
                  disabled={images.length === 1}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ))}
          {errors.images ? (
            <div className="text-xs text-rose-500">{errors.images}</div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" loading={saving}>
          {mode === "create" ? "Создать" : "Сохранить"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Отмена
        </Button>
        {mode === "edit" ? (
          <Button type="button" variant="danger" onClick={handleDelete}>
            Удалить
          </Button>
        ) : null}
      </div>
    </form>
  );
};
