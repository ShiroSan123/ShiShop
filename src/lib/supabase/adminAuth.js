import { getSupabaseClient, isSupabaseConfigured } from './client';

const ADMIN_SESSION_KEY = 'ShiShop_session';
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ADMIN_SESSION_KEY);
};

const storeToken = (token) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_SESSION_KEY, token);
};

const clearToken = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
};

const createToken = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const value = Math.random() * 16;
    const nibble = char === 'x' ? value : (value & 0x3) | 0x8;
    return Math.floor(nibble).toString(16);
  });
};

const isExpired = (expiresAt) =>
  new Date(expiresAt).getTime() < Date.now();

export const getAdminSession = async () => {
  const token = getStoredToken();
  if (!token) return null;

  if (!isSupabaseConfigured()) {
    clearToken();
    return null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('admin_sessions')
    .select('*')
    .eq('token', token)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    clearToken();
    return null;
  }

  if (isExpired(data.expires_at)) {
    await supabase.from('admin_sessions').delete().eq('token', token);
    clearToken();
    return null;
  }

  return {
    username: data.username,
    createdAt: data.created_at,
  };
};

export const loginAdmin = async ({ username, password, expiresInDays = 7 }) => {
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    throw new Error('Неверный логин или пароль');
  }

  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase env is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
  }

  const supabase = getSupabaseClient();
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + expiresInDays * 24 * 60 * 60 * 1000
  ).toISOString();
  const token = createToken();

  const { error } = await supabase.from('admin_sessions').insert({
    token,
    username: ADMIN_USERNAME,
    created_at: now.toISOString(),
    expires_at: expiresAt,
  });

  if (error) {
    throw new Error(error.message);
  }

  storeToken(token);

  return {
    username: ADMIN_USERNAME,
    createdAt: now.toISOString(),
  };
};

export const logoutAdmin = async () => {
  const token = getStoredToken();
  if (!token) return;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('admin_sessions')
      .delete()
      .eq('token', token);

    if (error) {
      throw new Error(error.message);
    }
  }

  clearToken();
};

export const getAdminCredentials = () => ({
  username: ADMIN_USERNAME,
});
