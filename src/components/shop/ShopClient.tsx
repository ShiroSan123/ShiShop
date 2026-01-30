"use client";

import { useEffect, useMemo, useState } from "react";
import { listProducts } from "@/lib/dataClient";
import { PRODUCT_STATUS_LABELS } from "@/lib/labels";
import { type Product, type ProductSort, type ProductStatus, type ProductType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ProductCard } from "./ProductCard";

const useDebouncedValue = (value: string, delay: number) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Сначала новые" },
  { value: "price_asc", label: "По цене (возрастание)" },
  { value: "price_desc", label: "По цене (убывание)" },
];

export interface ShopClientProps {
  title: string;
  description?: string;
  defaultType?: ProductType;
}

export const ShopClient = ({ title, description, defaultType }: ShopClientProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState({
    q: "",
    status: "",
    sort: "newest" as ProductSort,
  });

  const debouncedSearch = useDebouncedValue(query.q, 300);

  const filters = useMemo(() => {
    return {
      q: debouncedSearch || undefined,
      type: defaultType,
      status: (query.status || undefined) as ProductStatus | undefined,
      sort: query.sort,
    };
  }, [debouncedSearch, query.sort, query.status, defaultType]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listProducts(filters);
        if (active) {
          setProducts(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Ошибка загрузки");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [filters]);

  const resetFilters = () => {
    setQuery({
      q: "",
      status: "",
      sort: "newest",
    });
  };

  return (
    <section className="space-y-8">
      <div className="space-y-3 fade-up">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm text-slate-600">{description}</p>
        ) : null}
      </div>

      <div className="surface-soft subtle-grid p-4 md:p-5">
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
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
            <Button variant="secondary" onClick={resetFilters}>
              Сбросить
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Загружаем каталог…</div>
      ) : error ? (
        <div className="text-sm text-rose-600">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-sm text-slate-500">
          Ничего не найдено. Попробуйте изменить фильтры.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 fade-up">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
