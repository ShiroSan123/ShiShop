import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles, Package } from "lucide-react";
import AddToCartButton from "./AddToCartButton";

const statusLabels = {
  available: "В наличии",
  reserved: "Забронировано",
  sold: "Продано",
};

const statusColors = {
  available: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  reserved: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  sold: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const categoryLabels = {
  personal: "Личное",
  china: "Из Китая",
};

export default function ProductCard({ product, index = 0 }) {
  const mainImage =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link
        to={createPageUrl(`ProductPage?slug=${product.slug || product.id}`)}
        className="group block"
      >
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-slate-50">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <Badge
                className={`${statusColors[product.status || "available"]} border backdrop-blur-sm`}
              >
                {statusLabels[product.status || "available"]}
              </Badge>
              <Badge className="bg-violet-500/10 text-violet-600 border-violet-500/20 border backdrop-blur-sm flex items-center gap-1">
                {product.category === "personal" ? (
                  <Sparkles className="w-3 h-3" />
                ) : (
                  <Package className="w-3 h-3" />
                )}
                {categoryLabels[product.category]}
              </Badge>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-2 mb-2">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xl font-bold text-slate-900">
                {product.price?.toLocaleString("ru-RU")} ₽
              </span>
              {product.old_price && (
                <span className="text-sm text-slate-400 line-through">
                  {product.old_price?.toLocaleString("ru-RU")} ₽
                </span>
              )}
            </div>
            <AddToCartButton
              product={product}
              size="sm"
              className="w-full rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
