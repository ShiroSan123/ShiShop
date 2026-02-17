import React from "react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { getShopUserKey } from "@/lib/shopUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AddToWishlistButton({ product, className }) {
  const queryClient = useQueryClient();

  const { data: wishlistItems = [] } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const userKey = await getShopUserKey();
      return base44.entities.WishlistItem.filter({ created_by: userKey });
    },
  });

  const isInWishlist = wishlistItems.some((item) => item.product_id === product.id);

  const toggleWishlistMutation = useMutation({
    mutationFn: async () => {
      const userKey = await getShopUserKey();
      const userItems = await base44.entities.WishlistItem.filter({
        created_by: userKey,
        product_id: product.id,
      });
      const hasItem = userItems.length > 0;

      if (hasItem) {
        await base44.entities.WishlistItem.delete(userItems[0].id);
      } else {
        await base44.entities.WishlistItem.create({
          created_by: userKey,
          product_id: product.id,
          product_name: product.name || product.title || "Товар",
          product_price: Number(product.price || 0),
          product_image: product.images?.[0] || "",
        });
      }

      return hasItem;
    },
    onSuccess: (removedFromWishlist) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(
        removedFromWishlist ? "Удалено из избранного" : "Добавлено в избранное",
      );
    },
    onError: () => {
      toast.error("Ошибка при обновлении избранного");
    },
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-xl ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlistMutation.mutate();
      }}
      disabled={toggleWishlistMutation.isPending}
    >
      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
        <Heart
          className={`w-5 h-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-slate-400"}`}
        />
      </motion.div>
    </Button>
  );
}
