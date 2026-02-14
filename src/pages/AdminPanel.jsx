import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lock, Package, ShoppingBag, Star, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

/**
 * @typedef {Object} UpdateOrderPayload
 * @property {string} id
 * @property {"pending" | "confirmed" | "shipped" | "delivered" | "cancelled"} status
 */

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

  const ADMIN_PASSWORD = "admin123";

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => base44.entities.Product.list("-created_date", 200),
    enabled: isAuthenticated,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => base44.entities.Order.list("-created_date", 200),
    enabled: isAuthenticated,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => base44.entities.Review.list("-created_date", 200),
    enabled: isAuthenticated,
  });

  const updateOrderMutation = useMutation({
    /** @param {UpdateOrderPayload} payload */
    mutationFn: (payload) =>
      base44.entities.Order.update(payload.id, { status: payload.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Статус заказа обновлен");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Товар удален");
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (id) => base44.entities.Review.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Отзыв удален");
    },
  });

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Добро пожаловать в админ-панель");
    } else {
      toast.error("Неверный пароль");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Админ-панель
            </h1>
            <p className="text-slate-600">Введите пароль для доступа</p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              className="h-12"
            />
            <Button onClick={handleLogin} className="w-full h-12">
              Войти
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const statusLabels = {
    pending: "В обработке",
    confirmed: "Подтвержден",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменен",
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Админ-панель</h1>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Выйти
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="orders">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              Товары
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="w-4 h-4 mr-2" />
              Отзывы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Управление заказами
            </h2>
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Заказ #{order.order_number}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {order.customer_email}
                    </p>
                    <p className="text-sm text-slate-500">
                      {order.items.length} товар(ов) • {order.total} ₽
                    </p>
                  </div>
                  <Select
                    value={order.status}
                    onValueChange={(status) =>
                      updateOrderMutation.mutate(
                        /** @type {UpdateOrderPayload} */ ({ id: order.id, status }),
                      )
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-sm">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-slate-600"
                    >
                      <span>
                        {item.product_name} x{item.quantity}
                      </span>
                      <span>
                        {(item.product_price * item.quantity).toLocaleString(
                          "ru-RU",
                        )}{" "}
                        ₽
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Управление товарами
            </h2>
            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id} className="p-4 flex items-center gap-4">
                  <img
                    src={
                      product.images?.[0] ||
                      "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100"
                    }
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {product.price} ₽ • {product.category}
                    </p>
                    <Badge className="mt-1">{product.status}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500"
                    >
                      <Trash2
                        className="w-4 h-4"
                        onClick={() => deleteProductMutation.mutate(product.id)}
                      />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Управление отзывами
            </h2>
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">
                        {review.author_name}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600">{review.comment}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500"
                    onClick={() => deleteReviewMutation.mutate(review.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
