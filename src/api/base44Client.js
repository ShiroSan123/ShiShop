import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

const ORDER_FIELD_MAP = {
  created_date: "created_at",
  updated_date: "updated_at",
};

const PRODUCT_FILTER_MAP = {
  category: "type",
  name: "title",
};

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
    throw new Error(error.message);
  }

  return data ?? [];
};

const buildEntity = (table, normalizer = DEFAULT_NORMALIZER) => ({
  list: async (orderBy, limit) => {
    const client = getClientOrNull();
    if (!client) return [];

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
  },

  filter: async (filters = {}, orderBy, limit) => {
    const client = getClientOrNull();
    if (!client) return [];

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
  },

  create: async (payload = {}) => {
    const client = getClientOrNull();
    if (!client) {
      throw new Error("Supabase is not configured.");
    }

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
      throw new Error(error.message);
    }

    return normalizer(data);
  },

  update: async (id, payload = {}) => {
    const client = getClientOrNull();
    if (!client) {
      throw new Error("Supabase is not configured.");
    }

    const { data, error } = await client
      .from(table)
      .update(payload)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? normalizer(data) : null;
  },

  delete: async (id) => {
    const client = getClientOrNull();
    if (!client) {
      throw new Error("Supabase is not configured.");
    }

    const { error } = await client.from(table).delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
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
