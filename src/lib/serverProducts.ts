import "server-only";

import { getStore } from "./store";
import { type Product, type ProductInput, type ProductQuery } from "./types";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase/server";
import type { Database } from "./supabase/types";

type DbProductRow = Database["public"]["Tables"]["products"]["Row"];
type DbProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type DbProductUpdate = Database["public"]["Tables"]["products"]["Update"];

const mapDbProduct = (row: DbProductRow): Product => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  type: row.type,
  status: row.status,
  price: row.price,
  currency: row.currency,
  description: row.description,
  images: Array.isArray(row.images) ? row.images : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapToDbInsert = (input: ProductInput): DbProductInsert => ({
  title: input.title,
  slug: input.slug,
  type: input.type,
  status: input.status,
  price: input.price,
  currency: input.currency,
  description: input.description,
  images: input.images,
});

const mapToDbUpdate = (input: Partial<ProductInput>): DbProductUpdate => ({
  ...(input.title ? { title: input.title } : {}),
  ...(input.slug ? { slug: input.slug } : {}),
  ...(input.type ? { type: input.type } : {}),
  ...(input.status ? { status: input.status } : {}),
  ...(typeof input.price === "number" ? { price: input.price } : {}),
  ...(input.currency ? { currency: input.currency } : {}),
  ...(input.description ? { description: input.description } : {}),
  ...(input.images !== undefined ? { images: input.images } : {}),
});

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

export const listProductsServer = async (query: ProductQuery = {}) => {
  if (!isSupabaseConfigured()) {
    const store = getStore();
    return applyQuery(store.products, query);
  }

  const supabase = getSupabaseAdmin();
  let request = supabase.from("products").select("*");

  if (query.type) {
    request = request.eq("type", query.type);
  }

  if (query.status) {
    request = request.eq("status", query.status);
  }

  if (query.q) {
    request = request.or(
      `title.ilike.%${query.q}%,description.ilike.%${query.q}%`
    );
  }

  const sort = query.sort ?? "newest";
  if (sort === "newest") {
    request = request.order("created_at", { ascending: false });
  }

  if (sort === "price_asc") {
    request = request.order("price", { ascending: true });
  }

  if (sort === "price_desc") {
    request = request.order("price", { ascending: false });
  }

  const { data, error } = await request;
  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as DbProductRow[];
  return rows.map(mapDbProduct);
};

export const getProductByIdServer = async (id: string) => {
  if (!isSupabaseConfigured()) {
    const store = getStore();
    return store.products.find((product) => product.id === id) ?? null;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const row = data as DbProductRow | null;
  return row ? mapDbProduct(row) : null;
};

export const getProductBySlugServer = async (slug: string) => {
  if (!isSupabaseConfigured()) {
    const store = getStore();
    return store.products.find((product) => product.slug === slug) ?? null;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const row = data as DbProductRow | null;
  return row ? mapDbProduct(row) : null;
};

export const isSlugTakenServer = async (slug: string, excludeId?: string) => {
  if (!isSupabaseConfigured()) {
    const store = getStore();
    return store.products.some(
      (product) => product.slug === slug && product.id !== excludeId
    );
  }

  const supabase = getSupabaseAdmin();
  let request = supabase.from("products").select("id").eq("slug", slug);

  if (excludeId) {
    request = request.neq("id", excludeId);
  }

  const { data, error } = await request;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).length > 0;
};

export const createProductServer = async (payload: ProductInput) => {
  if (!isSupabaseConfigured()) {
    const store = getStore();
    const now = new Date().toISOString();
    const created: Product = {
      ...payload,
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: now,
      updatedAt: now,
    };
    store.products.unshift(created);
    return created;
  }

  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const insertPayload: DbProductInsert = {
    ...mapToDbInsert(payload),
    created_at: now,
    updated_at: now,
  };
  const { data, error } = await supabase
    .from("products")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const row = data as DbProductRow;
  return mapDbProduct(row);
};

export const updateProductServer = async (
  id: string,
  payload: Partial<ProductInput>
) => {
  if (!isSupabaseConfigured()) {
    const store = getStore();
    const index = store.products.findIndex((product) => product.id === id);
    if (index === -1) return null;
    const updated: Product = {
      ...store.products[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    store.products[index] = updated;
    return updated;
  }

  const supabase = getSupabaseAdmin();
  const updatePayload: DbProductUpdate = {
    ...mapToDbUpdate(payload),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("products")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const row = data as DbProductRow | null;
  return row ? mapDbProduct(row) : null;
};

export const deleteProductServer = async (id: string) => {
  if (!isSupabaseConfigured()) {
    const store = getStore();
    const index = store.products.findIndex((product) => product.id === id);
    if (index === -1) return false;
    store.products.splice(index, 1);
    return true;
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return true;
};
