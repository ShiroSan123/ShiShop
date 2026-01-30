import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 text-center">
      <div className="text-4xl font-semibold text-slate-900">404</div>
      <p className="text-sm text-slate-600">
        Страница не найдена. Возможно, она была перемещена или удалена.
      </p>
      <Link href="/">
        <Button variant="secondary">Вернуться на главную</Button>
      </Link>
    </div>
  );
}
