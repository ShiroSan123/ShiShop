import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TELEGRAM_USERNAME } from "./constants";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatPrice = (value: number, currency: string = "RUB") => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-");
};

export const buildTelegramLink = (productTitle: string, url: string) => {
  const text = `Здравствуйте! Интересует товар: ${productTitle}. Ссылка: ${url}`;
  return `https://t.me/${encodeURIComponent(TELEGRAM_USERNAME)}?text=${encodeURIComponent(text)}`;
};

export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};
