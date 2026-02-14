import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Package, Star } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import AddToWishlistButton from "./AddToWishlistButton";

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

export default function Product3DCard({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const mainImage =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400";

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", product.id],
    queryFn: () => base44.entities.Review.filter({ product_id: product.id }),
  });

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["7.5deg", "-7.5deg"],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-7.5deg", "7.5deg"],
  );

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <Link
        to={createPageUrl(`ProductPage?slug=${product.slug || product.id}`)}
        className="group block"
      >
        <div
          className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100"
          style={{
            transform: isHovered ? "translateZ(40px)" : "translateZ(0px)",
            transition: "transform 0.3s ease-out",
          }}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-slate-50">
            <motion.img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{
                transform: isHovered ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.7s ease-out",
              }}
            />

            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
              style={{
                x: useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "100%"]),
                y: useTransform(mouseYSpring, [-0.5, 0.5], ["-100%", "100%"]),
              }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
              <div className="flex flex-col gap-2">
                <Badge
                  className={`${statusColors[product.status || "available"]} border backdrop-blur-sm`}
                  style={{ transform: "translateZ(20px)" }}
                >
                  {statusLabels[product.status || "available"]}
                </Badge>
                {reviews.length > 0 && (
                  <Badge
                    className="bg-yellow-400/90 text-slate-900 border-yellow-500/20 border backdrop-blur-sm flex items-center gap-1"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    {avgRating}
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge
                  className="bg-violet-500/10 text-violet-600 border-violet-500/20 border backdrop-blur-sm flex items-center gap-1"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {product.category === "personal" ? (
                    <Sparkles className="w-3 h-3" />
                  ) : (
                    <Package className="w-3 h-3" />
                  )}
                  {categoryLabels[product.category]}
                </Badge>
                <div
                  onClick={(e) => e.preventDefault()}
                  style={{ transform: "translateZ(20px)" }}
                >
                  <AddToWishlistButton
                    product={product}
                    className="bg-white/90 hover:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="p-4" style={{ transform: "translateZ(30px)" }}>
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
            <div onClick={(e) => e.preventDefault()}>
              <AddToCartButton
                product={product}
                size="sm"
                className="w-full rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
