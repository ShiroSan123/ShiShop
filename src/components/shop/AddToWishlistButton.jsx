import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AddToWishlistButton({ product, className }) {
  const queryClient = useQueryClient();

  const { data: wishlistItems = [] } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        return base44.entities.WishlistItem.filter({ created_by: user.email });
      } catch {
        return [];
      }
    },
  });

  const isInWishlist = wishlistItems.some(
    (item) => item.product_id === product.id,
  );

  const toggleWishlistMutation = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      if (isInWishlist) {
        const item = wishlistItems.find((i) => i.product_id === product.id);
        await base44.entities.WishlistItem.delete(item.id);
      } else {
        await base44.entities.WishlistItem.create({
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          product_image: product.images?.[0] || "",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(
        isInWishlist ? "Удалено из избранного" : "Добавлено в избранное",
      );
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
    >
      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
        <Heart
          className={`w-5 h-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-slate-400"}`}
        />
      </motion.div>
    </Button>
  );
}
