import "server-only";

import { getStore } from "./store";
import { type Product, type ProductQuery } from "./types";

const applyQuery = (products: Product[], query: ProductQuery) => {
  let filtered = [...products];

  if (query.type) {
    filtered = filtered.filter((product) => product.type === query.type);
  }

  if (query.status) {
    filtered = filtered.filter((product) => product.status === query.status);
  }

  if (query.q) {
    const value = query.q.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(value) ||
        product.description.toLowerCase().includes(value)
    );
  }

  const sort = query.sort ?? "newest";
  if (sort === "newest") {
    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  if (sort === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
};

export const listProductsServer = (query: ProductQuery = {}) => {
  const store = getStore();
  return applyQuery(store.products, query);
};

export const getProductByIdServer = (id: string) => {
  const store = getStore();
  return store.products.find((product) => product.id === id) ?? null;
};

export const getProductBySlugServer = (slug: string) => {
  const store = getStore();
  return store.products.find((product) => product.slug === slug) ?? null;
};
