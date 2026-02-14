import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AddToCartButton({
  product,
  className,
  size = "default",
  variant = "default",
}) {
  const [added, setAdded] = useState(false);
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      const existingItems = await base44.entities.CartItem.filter({
        product_id: product.id,
        created_by: user.email,
      });

      if (existingItems.length > 0) {
        await base44.entities.CartItem.update(existingItems[0].id, {
          quantity: existingItems[0].quantity + 1,
        });
      } else {
        await base44.entities.CartItem.create({
          product_id: product.id,
          quantity: 1,
          product_name: product.name,
          product_price: product.price,
          product_image: product.images?.[0] || "",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setAdded(true);
      toast.success("Товар добавлен в корзину");
      setTimeout(() => setAdded(false), 2000);
    },
    onError: () => {
      toast.error("Ошибка при добавлении в корзину");
    },
  });

  if (product.status !== "available") {
    return (
      <Button disabled size={size} variant={variant} className={className}>
        Недоступно
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={`relative overflow-hidden ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCartMutation.mutate();
      }}
      disabled={addToCartMutation.isPending || added}
    >
      <AnimatePresence mode="wait">
        {added ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            Добавлено
          </motion.div>
        ) : (
          <motion.div
            key="cart"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />В корзину
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
