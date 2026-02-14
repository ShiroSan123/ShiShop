import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import HeroSection from "@/components/shop/HeroSection";
import Product3DCard from "@/components/shop/Product3DCard";
import CategorySection from "@/components/shop/CategorySection";

export default function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products-featured"],
    queryFn: () =>
      base44.entities.Product.filter(
        { status: "available" },
        "-created_date",
        8,
      ),
  });

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Latest Products */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Последние поступления
              </h2>
              <p className="text-slate-600 mt-2">Свежие товары в каталоге</p>
            </div>
            <Link
              to={createPageUrl("Catalog")}
              className="inline-flex items-center gap-2 text-violet-600 font-semibold hover:gap-3 transition-all"
            >
              Все товары
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-80 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <Product3DCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CategorySection />
    </div>
  );
}
