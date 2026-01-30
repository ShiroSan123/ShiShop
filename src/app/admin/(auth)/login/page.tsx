"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/ToastProvider";
import { getMe, login } from "@/lib/dataClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  useEffect(() => {
    const check = async () => {
      try {
        await getMe();
        router.push("/admin");
      } catch {
        // ignore
      }
    };
    check();
  }, [router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(form);
      toast({ title: "Добро пожаловать", variant: "success" });
      router.push("/admin");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось войти";
      toast({ title: "Ошибка", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center gap-6 px-4">
      <div className="space-y-3">
        <Badge label="Админка" variant="accent" />
        <h1 className="text-3xl font-semibold text-slate-900">
          Вход для администратора
        </h1>
        <p className="text-sm text-slate-600">
          Используйте логин и пароль из переменных окружения.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="surface-card space-y-4 p-6">
        <div className="space-y-2">
          <label className="text-xs text-slate-500">Логин</label>
          <Input
            value={form.username}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, username: event.target.value }))
            }
            placeholder="admin"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-slate-500">Пароль</label>
          <Input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
            placeholder="admin"
            required
          />
        </div>
        <Button type="submit" loading={loading} className="w-full">
          Войти
        </Button>
      </form>
    </div>
  );
}
