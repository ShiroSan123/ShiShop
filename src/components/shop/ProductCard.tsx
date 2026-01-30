/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { PRODUCT_STATUS_LABELS, PRODUCT_TYPE_LABELS } from "@/lib/labels";
import { type Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const statusVariant = (status: Product["status"]) => {
  if (status === "available") return "accent" as const;
  if (status === "sold") return "muted" as const;
  return "outline" as const;
};

export const ProductCard = ({ product }: { product: Product }) => {
  const image = product.images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="surface-card group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            Нет фото
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm font-semibold text-slate-900">
            {product.title}
          </div>
          <Badge
            label={PRODUCT_STATUS_LABELS[product.status]}
            variant={statusVariant(product.status)}
          />
        </div>
        <div className="text-xs text-slate-500">
          {PRODUCT_TYPE_LABELS[product.type]}
        </div>
        <div className="mt-auto text-base font-semibold text-slate-900">
          {formatPrice(product.price, product.currency)}
        </div>
      </div>
    </Link>
  );
};
