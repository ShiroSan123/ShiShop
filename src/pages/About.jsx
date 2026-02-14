import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Shield, Truck, Package } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Каждый товар проверен лично перед продажей",
  },
  {
    icon: Truck,
    title: "Быстрая доставка",
    description: "Отправляю в день заказа или на следующий день",
  },
  {
    icon: Package,
    title: "Надёжная упаковка",
    description: "Все товары аккуратно упакованы",
  },
  {
    icon: Heart,
    title: "Забота о покупателе",
    description: "Всегда на связи и готова помочь",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30 mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Обо мне
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Привет! Я создала этот магазин, чтобы делиться классными находками и
            вещами, которые больше не использую.
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Моя история
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-4">
              Всё началось с того, что у меня накопилось много хороших вещей,
              которые я больше не ношу, но они в отличном состоянии. Было жаль
              просто отдавать их, поэтому я решила продавать по приятным ценам.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Параллельно я часто заказываю интересные товары из Китая — и для
              себя, и под заказ для друзей. Так появилась идея объединить всё в
              одном месте.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Здесь вы найдёте мои личные вещи в отличном состоянии и
              проверенные находки с китайских маркетплейсов. Каждый товар
              проверен мной лично, и я уверена в его качестве.
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Почему выбирают меня
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
