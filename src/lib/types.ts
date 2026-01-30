export type ProductType = "personal" | "china";
export type ProductStatus = "available" | "sold" | "preorder";
export type CurrencyCode = "RUB";

export type ProductSort = "newest" | "price_asc" | "price_desc";

export interface Product {
  id: string;
  title: string;
  slug: string;
  type: ProductType;
  status: ProductStatus;
  price: number;
  currency: CurrencyCode;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export interface ProductQuery {
  type?: ProductType;
  status?: ProductStatus;
  q?: string;
  sort?: ProductSort;
}

export interface AdminSession {
  username: string;
  createdAt: string;
}
