import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  available: {
    label: 'В наличии',
    className:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30',
  },
  sold: {
    label: 'Продано',
    className: 'bg-muted text-muted-foreground border-border',
  },
  preorder: {
    label: 'Под заказ',
    className:
      'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30',
  },
};

const typeConfig = {
  personal: {
    label: 'Личное',
    className: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
  },
  china: {
    label: 'Китай',
    className: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300',
  },
};

export default function ProductCard({ product, showType = true }) {
  const status = statusConfig[product.status] || statusConfig.available;
  const type = typeConfig[product.type];
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&q=80';
  const isSold = product.status === 'sold';

  return (
    <Link 
      to={createPageUrl(`ProductPage?slug=${product.slug}`)}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card aspect-[4/5]">
        <img 
          src={mainImage} 
          alt={product.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? 'opacity-60 grayscale' : ''}`}
        />
        
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className={`${status.className} border text-xs font-medium`}>
            {status.label}
          </Badge>
        </div>

        {/* Type badge */}
        {showType && (
          <div className="absolute top-3 right-3">
            <Badge className={`${type.className} text-xs font-medium border-0`}>
              {type.label}
            </Badge>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="font-medium text-foreground group-hover:text-foreground/70 transition-colors line-clamp-2">
          {product.title}
        </h3>
        <p className={`text-lg font-semibold ${isSold ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
          {product.price?.toLocaleString('ru-RU')} ₽
        </p>
      </div>
    </Link>
  );
}
