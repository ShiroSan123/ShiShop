"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import { logout } from "@/lib/dataClient";

export const LogoutButton = () => {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Вы вышли из админки", variant: "info" });
      router.push("/admin/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось выйти";
      toast({ title: "Ошибка", description: message, variant: "error" });
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleLogout}>
      Выйти
    </Button>
  );
};
