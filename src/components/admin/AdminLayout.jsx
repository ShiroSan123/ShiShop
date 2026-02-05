import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getAdminCredentials,
  getAdminSession,
  loginAdmin,
} from '@/lib/supabase/adminAuth';

export default function AdminLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(() => ({
    username: getAdminCredentials().username,
    password: '',
  }));

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getAdminSession();
        setIsAuthorized(Boolean(session));
      } catch (error) {
        setAuthError(
          error instanceof Error ? error.message : 'Ошибка авторизации'
        );
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      await loginAdmin({
        username: form.username.trim(),
        password: form.password,
      });
      setIsAuthorized(true);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Ошибка входа');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-card border border-border rounded-xl p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-foreground">Вход в админку</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Используйте логин и пароль администратора.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-username">Логин</Label>
              <Input
                id="admin-username"
                value={form.username}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, username: event.target.value }))
                }
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Пароль</Label>
              <Input
                id="admin-password"
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, password: event.target.value }))
                }
                autoComplete="current-password"
              />
            </div>

            {authError && (
              <p className="text-sm text-destructive">{authError}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Войти
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
