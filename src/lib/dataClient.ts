import { getBaseUrl } from "./utils";
import { type Product, type ProductInput, type ProductQuery } from "./types";

const request = async <T>(path: string, init?: RequestInit) => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    credentials: "include",
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T & { error?: string }) : ({} as T);

  if (!response.ok) {
    const message = (data as { error?: string }).error ?? response.statusText;
    throw new Error(message);
  }

  return data as T;
};

export const listProducts = async (query: ProductQuery = {}) => {
  const params = new URLSearchParams();

  if (query.type) params.set("type", query.type);
  if (query.status) params.set("status", query.status);
  if (query.q) params.set("q", query.q);
  if (query.sort) params.set("sort", query.sort);

  const qs = params.toString();
  return request<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
};

export const getProduct = async (id: string) => {
  return request<Product>(`/api/products/${id}`);
};

export const getProductBySlug = async (slug: string) => {
  const products = await listProducts();
  return products.find((item) => item.slug === slug) ?? null;
};

export const createProduct = async (payload: ProductInput) => {
  return request<Product>(`/api/products`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateProduct = async (id: string, payload: Partial<ProductInput>) => {
  return request<Product>(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteProduct = async (id: string) => {
  await request<{ ok: true }>(`/api/products/${id}`, {
    method: "DELETE",
  });
};

export const login = async (payload: { username: string; password: string }) => {
  return request<{ username: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const logout = async () => {
  await request<{ ok: true }>("/api/auth/logout", {
    method: "POST",
  });
};

export const getMe = async () => {
  return request<{ username: string }>("/api/auth/me");
};
