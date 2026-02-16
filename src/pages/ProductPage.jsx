import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Package,
  MessageCircle,
  Send,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import AddToCartButton from "@/components/shop/AddToCartButton";
import AddToWishlistButton from "@/components/shop/AddToWishlistButton";
import ReviewSection from "@/components/shop/ReviewSection";

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

const conditionLabels = {
  new: "Новое",
  like_new: "Как новое",
  good: "Хорошее",
  fair: "Удовлетворительное",
};

export default function ProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const all = await base44.entities.Product.list();
      return all.filter((p) => p.slug === slug || p.id === slug);
    },
    enabled: !!slug,
  });

  const product = products[0];
  const rawStatus = String(product?.status || "available").toLowerCase();
  const normalizedStatus =
    rawStatus === "в наличии"
      ? "available"
      : rawStatus === "забронировано"
        ? "reserved"
        : rawStatus === "продано"
          ? "sold"
          : rawStatus;
  const isAvailable = normalizedStatus === "available";

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["related-products", product?.category],
    queryFn: () =>
      base44.entities.Product.filter(
        { category: product.category, status: "available" },
        "-created_date",
        4,
      ),
    enabled: !!product?.category,
  });

  const filteredRelated = relatedProducts
    .filter((p) => p.id !== product?.id)
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Товар не найден
          </h1>
          <Link to={createPageUrl("Catalog")}>
            <Button>Вернуться в каталог</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : ["https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800"];

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to={createPageUrl("Catalog")}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад в каталог
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-violet-500 shadow-lg"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                className={`${statusColors[product.status || "available"]} border`}
              >
                {product.status === "available" && (
                  <CheckCircle className="w-3 h-3 mr-1" />
                )}
                {product.status === "reserved" && (
                  <Clock className="w-3 h-3 mr-1" />
                )}
                {statusLabels[product.status || "available"]}
              </Badge>
              <Badge className="bg-violet-500/10 text-violet-600 border-violet-500/20 border">
                {product.category === "personal" ? (
                  <Sparkles className="w-3 h-3 mr-1" />
                ) : (
                  <Package className="w-3 h-3 mr-1" />
                )}
                {product.category === "personal" ? "Личное" : "Из Китая"}
              </Badge>
              {product.condition && (
                <Badge variant="outline">
                  {conditionLabels[product.condition]}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-slate-900">
                {product.price?.toLocaleString("ru-RU")} ₽
              </span>
              {product.old_price && (
                <span className="text-xl text-slate-400 line-through">
                  {product.old_price?.toLocaleString("ru-RU")} ₽
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h3 className="font-semibold text-slate-900 mb-2">Описание</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="space-y-4 mt-auto">
              <div className="flex gap-3">
                <AddToCartButton
                  product={product}
                  size="lg"
                  className="flex-1 h-14 rounded-2xl text-base"
                />
                <AddToWishlistButton product={product} className="h-14 w-14" />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-2xl flex-1"
                  disabled={!isAvailable}
                  onClick={() => {
                    const message = `Здравствуйте! Интересует товар: ${product.name}\nЦена: ${product.price} ₽`;
                    window.open(
                      `https://t.me/Aaiissnn?text=${encodeURIComponent(message)}`,
                      "_blank",
                    );
                  }}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Telegram
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 rounded-2xl flex-1"
                  disabled={!isAvailable}
                  onClick={() => {
                    const message = `Здравствуйте! Интересует товар: ${product.name}\nЦена: ${product.price} ₽`;
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(message)}`,
                      "_blank",
                    );
                  }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <ReviewSection productId={product.id} />
        </motion.section>

        {/* Related Products */}
        {filteredRelated.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Похожие товары
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelated.map((p, index) => (
                <Link
                  key={p.id}
                  to={createPageUrl(`ProductPage?slug=${p.slug || p.id}`)}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={
                          p.images?.[0] ||
                          "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400"
                        }
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 line-clamp-1 mb-2">
                        {p.name}
                      </h3>
                      <span className="text-lg font-bold">
                        {p.price?.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
