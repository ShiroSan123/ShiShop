"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";
import { PRODUCT_STATUS_LABELS, PRODUCT_TYPE_LABELS } from "@/lib/labels";
import {
  deleteProduct,
  listProducts,
  updateProduct,
} from "@/lib/dataClient";
import {
  type Product,
  type ProductSort,
  type ProductStatus,
  type ProductType,
} from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Сначала новые" },
  { value: "price_asc", label: "По цене (возрастание)" },
  { value: "price_desc", label: "По цене (убывание)" },
];

export const ProductTable = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState({
    q: "",
    type: "",
    status: "",
    sort: "newest" as ProductSort,
  });

  const filters = useMemo(() => {
    return {
      q: query.q || undefined,
      type: (query.type || undefined) as ProductType | undefined,
      status: (query.status || undefined) as ProductStatus | undefined,
      sort: query.sort,
    };
  }, [query.q, query.sort, query.status, query.type]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listProducts(filters);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkSold = async (product: Product) => {
    try {
      await updateProduct(product.id, { status: "sold" });
      toast({ title: "Статус обновлён", variant: "success" });
      await load();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка";
      toast({ title: "Не удалось обновить", description: message, variant: "error" });
    }
  };

  const handleDelete = async (product: Product) => {
    const confirmDelete = window.confirm(
      `Удалить товар «${product.title}»? Это действие нельзя отменить.`
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(product.id);
      toast({ title: "Товар удалён", variant: "success" });
      await load();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ошибка";
      toast({ title: "Не удалось удалить", description: message, variant: "error" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="surface-soft grid gap-4 p-4 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
        <div>
          <div className="text-xs text-slate-500">Поиск</div>
          <Input
            value={query.q}
            onChange={(event) =>
              setQuery((prev) => ({ ...prev, q: event.target.value }))
            }
            placeholder="Название или описание"
          />
        </div>
        <div>
          <div className="text-xs text-slate-500">Тип</div>
          <Select
            value={query.type}
            onChange={(event) =>
              setQuery((prev) => ({ ...prev, type: event.target.value }))
            }
          >
            <option value="">Все</option>
            {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map((type) => (
              <option key={type} value={type}>
                {PRODUCT_TYPE_LABELS[type]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <div className="text-xs text-slate-500">Статус</div>
          <Select
            value={query.status}
            onChange={(event) =>
              setQuery((prev) => ({ ...prev, status: event.target.value }))
            }
          >
            <option value="">Все</option>
            {(Object.keys(PRODUCT_STATUS_LABELS) as ProductStatus[]).map(
              (status) => (
                <option key={status} value={status}>
                  {PRODUCT_STATUS_LABELS[status]}
                </option>
              )
            )}
          </Select>
        </div>
        <div>
          <div className="text-xs text-slate-500">Сортировка</div>
          <Select
            value={query.sort}
            onChange={(event) =>
              setQuery((prev) => ({
                ...prev,
                sort: event.target.value as ProductSort,
              }))
            }
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-end">
          <Link href="/admin/products/new">
            <Button>Добавить</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Загружаем товары…</div>
      ) : error ? (
        <div className="text-sm text-rose-600">{error}</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Название</th>
                <th className="px-4 py-3">Тип</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Цена</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">
                      {product.title}
                    </div>
                    <div className="text-xs text-slate-500">{product.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {PRODUCT_TYPE_LABELS[product.type]}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {PRODUCT_STATUS_LABELS[product.status]}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatPrice(product.price, product.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="secondary" size="sm">
                          Редактировать
                        </Button>
                      </Link>
                      {product.status !== "sold" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkSold(product)}
                        >
                          Продано
                        </Button>
                      ) : null}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
