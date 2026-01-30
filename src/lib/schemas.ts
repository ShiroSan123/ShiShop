import { z } from "zod";

export const ProductTypeSchema = z.enum(["personal", "china"]);
export const ProductStatusSchema = z.enum(["available", "sold", "preorder"]);
export const ProductSortSchema = z.enum(["newest", "price_asc", "price_desc"]);

export const ProductInputSchema = z.object({
  title: z.string().min(2, "Минимум 2 символа"),
  slug: z.string().min(2, "Минимум 2 символа"),
  type: ProductTypeSchema,
  status: ProductStatusSchema,
  price: z.number().min(0, "Цена должна быть положительной"),
  currency: z.literal("RUB"),
  description: z.string().min(10, "Описание слишком короткое"),
  images: z.array(z.string().min(1, "URL обязателен")).min(1, "Добавьте хотя бы одно изображение"),
});

export const ProductUpdateSchema = ProductInputSchema.partial();

export const ProductQuerySchema = z.object({
  type: ProductTypeSchema.optional(),
  status: ProductStatusSchema.optional(),
  q: z.string().trim().optional(),
  sort: ProductSortSchema.optional(),
});

export const LoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});
