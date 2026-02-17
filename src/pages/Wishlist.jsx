import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { getShopUserKey } from "@/lib/shopUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

/**
 * @typedef {Object} WishlistItem
 * @property {string} id
 * @property {string} product_id
 * @property {string} product_name
 * @property {number} product_price
 * @property {string=} product_image
 */

export default function Wishlist() {
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const userKey = await getShopUserKey();
      return base44.entities.WishlistItem.filter({ created_by: userKey }, "-created_date");
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id) => base44.entities.WishlistItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Удалено из избранного");
    },
  });

  const moveToCartMutation = useMutation({
    /** @param {WishlistItem} item */
    mutationFn: async (item) => {
      const userKey = await getShopUserKey();
      const existingItems = await base44.entities.CartItem.filter({
        product_id: item.product_id,
        created_by: userKey,
      });

      if (existingItems.length > 0) {
        await base44.entities.CartItem.update(existingItems[0].id, {
          quantity: Number(existingItems[0].quantity || 0) + 1,
        });
      } else {
        await base44.entities.CartItem.create({
          created_by: userKey,
          product_id: item.product_id,
          quantity: 1,
          product_name: item.product_name,
          product_price: Number(item.product_price || 0),
          product_image: item.product_image,
        });
      }

      await base44.entities.WishlistItem.delete(item.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Добавлено в корзину");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-red-50 flex items-center justify-center">
              <Heart className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Список избранного пуст</h2>
            <p className="text-slate-600 mb-8">Добавьте товары, чтобы не потерять их</p>
            <Link to={createPageUrl("Catalog")}>
              <Button size="lg" className="rounded-2xl">Перейти в каталог</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to={createPageUrl("Catalog")} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />Назад в каталог
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
            <Heart className="w-10 h-10 text-red-500" />Избранное
          </h1>
          <p className="text-slate-600 mt-2">{wishlistItems.length} товар(ов)</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={createPageUrl(`ProductPage?slug=${item.product_id}`)}>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.product_image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400"}
                      alt={item.product_name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={createPageUrl(`ProductPage?slug=${item.product_id}`)}>
                    <h3 className="font-semibold text-slate-900 hover:text-violet-600 transition-colors line-clamp-2 mb-2">{item.product_name}</h3>
                  </Link>
                  <p className="text-xl font-bold text-slate-900 mb-4">{item.product_price?.toLocaleString("ru-RU")} ₽</p>
                  <div className="flex gap-2">
                    <Button className="flex-1 rounded-xl" onClick={() => moveToCartMutation.mutate(/** @type {WishlistItem} */ (item))}>
                      <ShoppingCart className="w-4 h-4 mr-2" />В корзину
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteItemMutation.mutate(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
