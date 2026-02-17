import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

const ORDER_FIELD_MAP = {
  created_date: "created_at",
  updated_date: "updated_at",
};

const PRODUCT_FILTER_MAP = {
  category: "type",
  name: "title",
};
const LOCAL_FALLBACK_TABLES = new Set(["cart_items", "wishlist_items", "reviews"]);
const LOCAL_STORAGE_PREFIX = "shishop_local_table_";
const LOCAL_ONLY_TABLES = new Set(["cart_items", "wishlist_items", "reviews"]);

const PRODUCT_NORMALIZER = (row) => ({
  ...row,
  name: row.name ?? row.title ?? "",
  title: row.title ?? row.name ?? "",
  category: row.category ?? row.type ?? "",
  type: row.type ?? row.category ?? "",
  created_date: row.created_date ?? row.created_at ?? null,
  updated_date: row.updated_date ?? row.updated_at ?? null,
});

const DEFAULT_NORMALIZER = (row) => ({
  ...row,
  created_date: row.created_date ?? row.created_at ?? null,
  updated_date: row.updated_date ?? row.updated_at ?? null,
});

const getClientOrNull = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return getSupabaseClient();
};

const parseOrderBy = (orderBy) => {
  if (!orderBy) {
    return null;
  }

  const descending = orderBy.startsWith("-");
  const rawField = orderBy.replace(/^-/, "");
  const field = ORDER_FIELD_MAP[rawField] ?? rawField;

  return {
    field,
    ascending: !descending,
  };
};

const normalizeUser = (user) => ({
  id: user.id,
  email: user.email,
  full_name:
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email ??
    "",
  role: user.app_metadata?.role ?? "user",
});

const getCurrentUserEmail = async () => {
  const client = getClientOrNull();
  if (!client) return null;

  const { data } = await client.auth.getUser();
  return data?.user?.email ?? null;
};

const applyFilters = (query, table, filters = {}) => {
  let nextQuery = query;

  Object.entries(filters).forEach(([rawKey, value]) => {
    if (value === undefined) {
      return;
    }

    const key =
      table === "products" ? PRODUCT_FILTER_MAP[rawKey] ?? rawKey : rawKey;

    if (Array.isArray(value)) {
      nextQuery = nextQuery.in(key, value);
      return;
    }

    if (value === null) {
      nextQuery = nextQuery.is(key, null);
      return;
    }

    nextQuery = nextQuery.eq(key, value);
  });

  return nextQuery;
};

const runSelect = async (query) => {
  const { data, error } = await query;

  if (error) {
    const wrappedError = new Error(error.message);
    wrappedError.status = error.status;
    wrappedError.code = error.code;
    throw wrappedError;
  }

  return data ?? [];
};

const isMissingTableError = (error) =>
  Boolean(
    error &&
      (error.status === 404 ||
        String(error.message || "").toLowerCase().includes("not found") ||
        String(error.message || "").toLowerCase().includes("does not exist")),
  );

const canUseLocalFallback = (table) => LOCAL_FALLBACK_TABLES.has(table);
const shouldUseLocalOnly = (table) => LOCAL_ONLY_TABLES.has(table);

const getLocalStorageKey = (table) => `${LOCAL_STORAGE_PREFIX}${table}`;

const readLocalTable = (table) => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(getLocalStorageKey(table));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalTable = (table, rows) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getLocalStorageKey(table), JSON.stringify(rows));
};

const createLocalId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const applyLocalFilters = (rows, table, filters = {}) =>
  rows.filter((row) => {
    return Object.entries(filters).every(([rawKey, value]) => {
      if (value === undefined) return true;
      const key = table === "products" ? PRODUCT_FILTER_MAP[rawKey] ?? rawKey : rawKey;
      const rowValue = row[key];

      if (Array.isArray(value)) {
        return value.includes(rowValue);
      }
      if (value === null) {
        return rowValue === null || rowValue === undefined;
      }

      return rowValue === value;
    });
  });

const applyLocalOrderAndLimit = (rows, orderBy, limit) => {
  const orderedRows = [...rows];
  const order = parseOrderBy(orderBy);
  if (order) {
    orderedRows.sort((a, b) => {
      const av = a[order.field];
      const bv = b[order.field];
      if (av === bv) return 0;
      if (av === undefined || av === null) return order.ascending ? -1 : 1;
      if (bv === undefined || bv === null) return order.ascending ? 1 : -1;
      if (av > bv) return order.ascending ? 1 : -1;
      return order.ascending ? -1 : 1;
    });
  }

  if (typeof limit === "number") {
    return orderedRows.slice(0, limit);
  }
  return orderedRows;
};

const listLocal = (table, normalizer, orderBy, limit) => {
  const rows = readLocalTable(table);
  return applyLocalOrderAndLimit(rows, orderBy, limit).map(normalizer);
};

const filterLocal = (table, normalizer, filters, orderBy, limit) => {
  const rows = readLocalTable(table);
  const filtered = applyLocalFilters(rows, table, filters);
  return applyLocalOrderAndLimit(filtered, orderBy, limit).map(normalizer);
};

const createLocal = (table, normalizer, payload = {}) => {
  const now = new Date().toISOString();
  const rows = readLocalTable(table);
  const nextRow = {
    id: payload.id ?? createLocalId(),
    ...payload,
    created_at: payload.created_at ?? payload.created_date ?? now,
    updated_at: payload.updated_at ?? payload.updated_date ?? now,
  };
  rows.push(nextRow);
  writeLocalTable(table, rows);
  return normalizer(nextRow);
};

const updateLocal = (table, normalizer, id, payload = {}) => {
  const rows = readLocalTable(table);
  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) return null;
  const nextRow = {
    ...rows[index],
    ...payload,
    updated_at: new Date().toISOString(),
  };
  rows[index] = nextRow;
  writeLocalTable(table, rows);
  return normalizer(nextRow);
};

const deleteLocal = (table, id) => {
  const rows = readLocalTable(table);
  const nextRows = rows.filter((row) => row.id !== id);
  writeLocalTable(table, nextRows);
  return true;
};

const buildEntity = (table, normalizer = DEFAULT_NORMALIZER) => ({
  list: async (orderBy, limit) => {
    if (shouldUseLocalOnly(table)) {
      return listLocal(table, normalizer, orderBy, limit);
    }

    const client = getClientOrNull();
    if (!client) {
      if (canUseLocalFallback(table)) {
        return listLocal(table, normalizer, orderBy, limit);
      }
      return [];
    }

    try {
      let query = client.from(table).select("*");

      const order = parseOrderBy(orderBy);
      if (order) {
        query = query.order(order.field, { ascending: order.ascending });
      }

      if (typeof limit === "number") {
        query = query.limit(limit);
      }

      const rows = await runSelect(query);
      return rows.map(normalizer);
    } catch (error) {
      if (canUseLocalFallback(table) && isMissingTableError(error)) {
        return listLocal(table, normalizer, orderBy, limit);
      }
      throw error;
    }
  },

  filter: async (filters = {}, orderBy, limit) => {
    if (shouldUseLocalOnly(table)) {
      return filterLocal(table, normalizer, filters, orderBy, limit);
    }

    const client = getClientOrNull();
    if (!client) {
      if (canUseLocalFallback(table)) {
        return filterLocal(table, normalizer, filters, orderBy, limit);
      }
      return [];
    }

    try {
      let query = client.from(table).select("*");
      query = applyFilters(query, table, filters);

      const order = parseOrderBy(orderBy);
      if (order) {
        query = query.order(order.field, { ascending: order.ascending });
      }

      if (typeof limit === "number") {
        query = query.limit(limit);
      }

      const rows = await runSelect(query);
      return rows.map(normalizer);
    } catch (error) {
      if (canUseLocalFallback(table) && isMissingTableError(error)) {
        return filterLocal(table, normalizer, filters, orderBy, limit);
      }
      throw error;
    }
  },

  create: async (payload = {}) => {
    if (shouldUseLocalOnly(table)) {
      return createLocal(table, normalizer, payload);
    }

    const client = getClientOrNull();
    if (!client) {
      if (canUseLocalFallback(table)) {
        return createLocal(table, normalizer, payload);
      }
      throw new Error("Supabase is not configured.");
    }

    try {
      const createdBy = await getCurrentUserEmail();
      const insertPayload = {
        ...payload,
        ...(createdBy && payload.created_by === undefined
          ? { created_by: createdBy }
          : {}),
      };

      const { data, error } = await client
        .from(table)
        .insert(insertPayload)
        .select("*")
        .single();

      if (error) {
        const wrappedError = new Error(error.message);
        wrappedError.status = error.status;
        throw wrappedError;
      }

      return normalizer(data);
    } catch (error) {
      if (canUseLocalFallback(table) && isMissingTableError(error)) {
        return createLocal(table, normalizer, payload);
      }
      throw error;
    }
  },

  update: async (id, payload = {}) => {
    if (shouldUseLocalOnly(table)) {
      return updateLocal(table, normalizer, id, payload);
    }

    const client = getClientOrNull();
    if (!client) {
      if (canUseLocalFallback(table)) {
        return updateLocal(table, normalizer, id, payload);
      }
      throw new Error("Supabase is not configured.");
    }

    try {
      const { data, error } = await client
        .from(table)
        .update(payload)
        .eq("id", id)
        .select("*")
        .maybeSingle();

      if (error) {
        const wrappedError = new Error(error.message);
        wrappedError.status = error.status;
        throw wrappedError;
      }

      return data ? normalizer(data) : null;
    } catch (error) {
      if (canUseLocalFallback(table) && isMissingTableError(error)) {
        return updateLocal(table, normalizer, id, payload);
      }
      throw error;
    }
  },

  delete: async (id) => {
    if (shouldUseLocalOnly(table)) {
      return deleteLocal(table, id);
    }

    const client = getClientOrNull();
    if (!client) {
      if (canUseLocalFallback(table)) {
        return deleteLocal(table, id);
      }
      throw new Error("Supabase is not configured.");
    }

    try {
      const { error } = await client.from(table).delete().eq("id", id);

      if (error) {
        const wrappedError = new Error(error.message);
        wrappedError.status = error.status;
        throw wrappedError;
      }

      return true;
    } catch (error) {
      if (canUseLocalFallback(table) && isMissingTableError(error)) {
        return deleteLocal(table, id);
      }
      throw error;
    }
  },
});

export const base44 = {
  auth: {
    me: async () => {
      const client = getClientOrNull();
      if (!client) {
        throw new Error("Supabase is not configured.");
      }

      const { data, error } = await client.auth.getUser();
      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Not authenticated");
      }

      return normalizeUser(data.user);
    },

    logout: async (redirectTo) => {
      const client = getClientOrNull();
      if (client) {
        await client.auth.signOut();
      }

      if (redirectTo && typeof window !== "undefined") {
        window.location.href = redirectTo;
      }
    },

    redirectToLogin: (redirectTo) => {
      if (typeof window !== "undefined") {
        window.location.href = redirectTo || "/";
      }
    },
  },

  entities: {
    Product: buildEntity("products", PRODUCT_NORMALIZER),
    Review: buildEntity("reviews"),
    CartItem: buildEntity("cart_items"),
    WishlistItem: buildEntity("wishlist_items"),
    Order: buildEntity("orders"),
  },

  appLogs: {
    logUserInApp: async (pageName) => {
      const client = getClientOrNull();
      if (!client) return;

      const { data } = await client.auth.getUser();
      await client.from("app_logs").insert({
        page_name: pageName,
        user_email: data?.user?.email ?? null,
      });
    },
  },
};
