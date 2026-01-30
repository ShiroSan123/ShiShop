import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "./constants";
import { getStore } from "./store";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase/server";
import type { Database } from "./supabase/types";
import type { AdminSession } from "./types";

type AdminSessionRow = Database["public"]["Tables"]["admin_sessions"]["Row"];
type AdminSessionInsert = Database["public"]["Tables"]["admin_sessions"]["Insert"];

const mapAdminSession = (row: AdminSessionRow): AdminSession => ({
  username: row.username,
  createdAt: row.created_at,
});

const getAdminSessionByToken = async (token?: string | null) => {
  if (!token) return null;

  if (!isSupabaseConfigured()) {
    const store = getStore();
    return store.sessions[token] ?? null;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("admin_sessions")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  if (new Date(data.expires_at).getTime() < Date.now()) {
    await supabase.from("admin_sessions").delete().eq("token", token);
    return null;
  }

  return mapAdminSession(data as AdminSessionRow);
};

export const createAdminSession = async (
  username: string,
  expiresInDays: number = 7
) => {
  const token =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  if (!isSupabaseConfigured()) {
    const store = getStore();
    store.sessions[token] = {
      username,
      createdAt: new Date().toISOString(),
    };
    return token;
  }

  const supabase = getSupabaseAdmin();
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + expiresInDays * 24 * 60 * 60 * 1000
  ).toISOString();

  const payload: AdminSessionInsert = {
    token,
    username,
    created_at: now.toISOString(),
    expires_at: expiresAt,
  };

  const { error } = await supabase.from("admin_sessions").insert(payload);
  if (error) {
    throw new Error(error.message);
  }

  return token;
};

export const deleteAdminSession = async (token?: string | null) => {
  if (!token) return;

  if (!isSupabaseConfigured()) {
    const store = getStore();
    delete store.sessions[token];
    return;
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("admin_sessions")
    .delete()
    .eq("token", token);
  if (error) {
    throw new Error(error.message);
  }
};

export const getAdminSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return getAdminSessionByToken(token);
};

export const requireAdmin = async () => {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
};
