import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Package, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

const statusLabels = {
  pending: "В обработке",
  confirmed: "Подтвержден",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменен",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function Orders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Order.filter(
        { customer_email: user.email },
        "-created_date",
      );
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Мои заказы</h1>
          <p className="text-slate-600">История ваших покупок</p>
        </motion.div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-slate-100 flex items-center justify-center">
              <Package className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Пока нет заказов
            </h2>
            <p className="text-slate-600 mb-8">
              Начните делать покупки в нашем каталоге
            </p>
            <Link to={createPageUrl("Catalog")}>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition">
                Перейти в каталог
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                        <Package className="w-6 h-6 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          Заказ #{order.order_number}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <Calendar className="w-4 h-4" />
                          {format(
                            new Date(order.created_date),
                            "dd.MM.yyyy HH:mm",
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                          <DollarSign className="w-5 h-5" />
                          {order.total.toLocaleString("ru-RU")} ₽
                        </div>
                        <p className="text-sm text-slate-500">
                          {order.items.length} товар(ов)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img
                          src={
                            item.product_image ||
                            "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100"
                          }
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {item.quantity} x{" "}
                            {item.product_price.toLocaleString("ru-RU")} ₽
                          </p>
                        </div>
                        <p className="font-semibold text-slate-900">
                          {(item.quantity * item.product_price).toLocaleString(
                            "ru-RU",
                          )}{" "}
                          ₽
                        </p>
                      </div>
                    ))}
                  </div>

                  {order.comment && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Комментарий:</span>{" "}
                        {order.comment}
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
