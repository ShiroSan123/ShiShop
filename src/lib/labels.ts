import { type ProductStatus, type ProductType } from "./types";

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  personal: "Личные вещи",
  china: "Перепродажа с Китая",
};

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  available: "В наличии",
  sold: "Продано",
  preorder: "Под заказ",
};
