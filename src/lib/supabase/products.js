import { getSupabaseClient, isSupabaseConfigured } from './client';

const ORDER_FIELD_MAP = {
  created_date: 'created_at',
  created_at: 'created_at',
  price: 'price',
};

const parseOrderBy = (orderBy) => {
  if (!orderBy) {
    return { column: 'created_at', ascending: false };
  }

  const isDesc = orderBy.startsWith('-');
  const rawField = orderBy.replace(/^-/, '');
  const column = ORDER_FIELD_MAP[rawField] || rawField;

  return { column, ascending: !isDesc };
};

const mapDbProduct = (row) => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  type: row.type,
  status: row.status,
  price: row.price,
  currency: row.currency,
  description: row.description,
  images: Array.isArray(row.images) ? row.images : [],
  created_at: row.created_at,
  updated_at: row.updated_at,
  created_date: row.created_at,
  updated_date: row.updated_at,
});

const getClientOrNull = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return getSupabaseClient();
};

export const listProducts = async (orderBy, limit) => {
  const supabase = getClientOrNull();
  if (!supabase) return [];

  let query = supabase.from('products').select('*');
  const { column, ascending } = parseOrderBy(orderBy);
  query = query.order(column, { ascending });

  if (typeof limit === 'number') {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapDbProduct);
};

export const filterProducts = async (filters = {}, orderBy, limit) => {
  const supabase = getClientOrNull();
  if (!supabase) return [];

  let query = supabase.from('products').select('*');

  if (filters.id) {
    query = query.eq('id', filters.id);
  }

  if (filters.slug) {
    query = query.eq('slug', filters.slug);
  }

  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.q) {
    query = query.or(
      `title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`
    );
  }

  if (orderBy) {
    const { column, ascending } = parseOrderBy(orderBy);
    query = query.order(column, { ascending });
  }

  if (typeof limit === 'number') {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapDbProduct);
};

export const createProduct = async (payload) => {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();
  const insertPayload = {
    title: payload.title,
    slug: payload.slug,
    type: payload.type,
    status: payload.status,
    price: payload.price,
    currency: payload.currency || 'RUB',
    description: payload.description || '',
    images: Array.isArray(payload.images) ? payload.images : [],
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from('products')
    .insert(insertPayload)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapDbProduct(data);
};

export const updateProduct = async (id, payload) => {
  const supabase = getSupabaseClient();
  const updatePayload = {
    ...(payload.title ? { title: payload.title } : {}),
    ...(payload.slug ? { slug: payload.slug } : {}),
    ...(payload.type ? { type: payload.type } : {}),
    ...(payload.status ? { status: payload.status } : {}),
    ...(typeof payload.price === 'number' ? { price: payload.price } : {}),
    ...(payload.currency ? { currency: payload.currency } : {}),
    ...(payload.description !== undefined
      ? { description: payload.description }
      : {}),
    ...(payload.images !== undefined ? { images: payload.images } : {}),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('products')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapDbProduct(data) : null;
};

export const deleteProduct = async (id) => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }

  return true;
};
