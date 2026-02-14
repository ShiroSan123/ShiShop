import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Sparkles, Package, ArrowRight } from "lucide-react";

const categories = [
  {
    id: "personal",
    title: "Личные вещи",
    description: "Одежда, аксессуары и другие вещи в отличном состоянии",
    icon: Sparkles,
    href: "CatalogPersonal",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
  },
  {
    id: "china",
    title: "Товары из Китая",
    description: "Проверенные находки с маркетплейсов по выгодным ценам",
    icon: Package,
    href: "CatalogChina",
    gradient: "from-indigo-500 to-blue-600",
    bgGradient: "from-indigo-50 to-blue-50",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600",
  },
];

export default function CategorySection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Выберите категорию
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={createPageUrl(category.href)} className="group block">
                <div
                  className={`relative h-80 rounded-3xl overflow-hidden bg-gradient-to-br ${category.bgGradient} p-8 flex flex-col justify-between transition-all duration-500 hover:shadow-2xl`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg mb-4`}
                    >
                      <category.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {category.description}
                    </p>
                    <span className="inline-flex items-center text-sm font-semibold text-violet-600 group-hover:gap-3 gap-2 transition-all">
                      Смотреть
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
