import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Send,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

/**
 * @typedef {Object} UpdateCartQuantityPayload
 * @property {string} id
 * @property {number} quantity
 */

export default function Cart() {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.CartItem.filter(
        { created_by: user.email },
        "-created_date",
      );
    },
  });

  const updateQuantityMutation = useMutation({
    /** @param {UpdateCartQuantityPayload} payload */
    mutationFn: (payload) =>
      base44.entities.CartItem.update(payload.id, { quantity: payload.quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id) => base44.entities.CartItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Товар удалён из корзины");
    },
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0,
  );

  const createTelegramMessage = () => {
    let message = "🛍️ *Новый заказ из ShiShop*\n\n";
    message += "*Товары:*\n";

    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.product_name}\n`;
      message += `   Цена: ${item.product_price.toLocaleString("ru-RU")} ₽\n`;
      message += `   Количество: ${item.quantity}\n`;
      message += `   Сумма: ${(item.product_price * item.quantity).toLocaleString("ru-RU")} ₽\n\n`;
    });

    message += `*Итого: ${total.toLocaleString("ru-RU")} ₽*\n\n`;

    if (comment) {
      message += `*Комментарий:*\n${comment}\n\n`;
    }

    return encodeURIComponent(message);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    const telegramUrl = `https://t.me/ShiShop?text=${createTelegramMessage()}`;
    window.open(telegramUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-slate-100 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Корзина пуста
            </h2>
            <p className="text-slate-600 mb-8">Добавьте товары из каталога</p>
            <Link to={createPageUrl("Catalog")}>
              <Button size="lg" className="rounded-2xl">
                Перейти в каталог
              </Button>
            </Link>
          </div>
        </div>
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
          <Link
            to={createPageUrl("Catalog")}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Продолжить покупки
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">Корзина</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    <Link
                      to={createPageUrl(`ProductPage?slug=${item.product_id}`)}
                      className="flex-shrink-0"
                    >
                      <img
                        src={
                          item.product_image ||
                          "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200"
                        }
                        alt={item.product_name}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={createPageUrl(
                          `ProductPage?slug=${item.product_id}`,
                        )}
                      >
                        <h3 className="font-semibold text-slate-900 hover:text-violet-600 transition-colors line-clamp-2">
                          {item.product_name}
                        </h3>
                      </Link>
                      <p className="text-lg font-bold text-slate-900 mt-2">
                        {item.product_price.toLocaleString("ru-RU")} ₽
                      </p>
                      <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantityMutation.mutate({
                                  id: item.id,
                                  quantity: item.quantity - 1,
                                });
                              }
                            }}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              updateQuantityMutation.mutate({
                                id: item.id,
                                quantity: val,
                              });
                            }}
                            className="w-16 h-8 text-center border-0"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantityMutation.mutate({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            }
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteItemMutation.mutate(item.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-slate-900">
                        {(item.product_price * item.quantity).toLocaleString(
                          "ru-RU",
                        )}{" "}
                        ₽
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-24"
            >
              <Card className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Итого</h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Товары ({cartItems.length})</span>
                    <span>{total.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-slate-900">
                      <span>К оплате</span>
                      <span>{total.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Комментарий к заказу (опционально)
                  </label>
                  <Textarea
                    placeholder="Укажите пожелания к заказу..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="h-24"
                  />
                </div>

                <Button
                  size="lg"
                  className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-base"
                  onClick={handleCheckout}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Оформить через Telegram
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  После нажатия откроется Telegram с готовым сообщением для
                  отправки продавцу
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
